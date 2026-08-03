"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PapersPerWeekChart from "@/components/radar/charts/PapersPerWeekChart";
import TopSourcesChart from "@/components/radar/charts/TopSourcesChart";
import ScoreDistributionChart from "@/components/radar/charts/ScoreDistributionChart";

type Row = { published_at: string | null; source: string | null; score: number | null };

function buildWeekBuckets(now: Date, weeksBack: number) {
  const buckets: { start: Date; end: Date; label: string }[] = [];
  for (let i = weeksBack - 1; i >= 0; i--) {
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    end.setDate(end.getDate() - i * 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    const label = `${start.getDate().toString().padStart(2, "0")}/${(start.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    buckets.push({ start, end, label });
  }
  return buckets;
}

export default function StatsCharts() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data, error } = await supabase.from("papers").select("published_at, source, score");
      if (!active) return;
      if (error) setError(error.message);
      else setRows(data ?? []);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <p className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
        Lỗi tải số liệu thống kê: {error}
      </p>
    );
  }

  if (rows === null) {
    return (
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">Đang tải số liệu...</p>
    );
  }

  // 1. Papers per week — last 8 real weeks, counting only real published_at values.
  const buckets = buildWeekBuckets(new Date(), 8);
  const weekData = buckets.map(({ start, end, label }) => ({
    week: label,
    count: rows.filter((r) => {
      if (!r.published_at) return false;
      const d = new Date(r.published_at);
      return d >= start && d <= end;
    }).length,
  }));

  // 2. Top 5 sources by real paper count.
  const sourceCounts = new Map<string, number>();
  for (const r of rows) {
    if (!r.source) continue;
    sourceCounts.set(r.source, (sourceCounts.get(r.source) ?? 0) + 1);
  }
  const sourceData = Array.from(sourceCounts.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 3. Score distribution — integer buckets 0..10, real counts only.
  const scoreCounts = new Map<number, number>();
  for (let i = 0; i <= 10; i++) scoreCounts.set(i, 0);
  for (const r of rows) {
    if (r.score === null) continue;
    const bucket = Math.round(r.score);
    scoreCounts.set(bucket, (scoreCounts.get(bucket) ?? 0) + 1);
  }
  const scoreData = Array.from(scoreCounts.entries()).map(([score, count]) => ({ score, count }));

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <PapersPerWeekChart data={weekData} />
      <TopSourcesChart data={sourceData} />
      <ScoreDistributionChart data={scoreData} />
    </div>
  );
}
