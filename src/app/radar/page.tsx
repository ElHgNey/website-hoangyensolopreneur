"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PaperCard from "@/components/radar/PaperCard";
import FilterBar, { type Filters } from "@/components/radar/FilterBar";
import StatsCharts from "@/components/radar/StatsCharts";

type Paper = {
  id: string;
  title: string;
  authors: string | null;
  abstract: string | null;
  url: string | null;
  source: string | null;
  score: number | null;
  published_at: string | null;
};

type Topic = { id: string; name: string };

const DEFAULT_FILTERS: Filters = {
  topicId: null,
  source: null,
  year: null,
  minScore: 0,
  search: "",
};

export default function Home() {
  const [papers, setPapers] = useState<Paper[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const [topics, setTopics] = useState<Topic[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);

  // Load filter option lists once on mount.
  useEffect(() => {
    async function loadFilterOptions() {
      const [topicsRes, sourceRes, dateRes] = await Promise.all([
        supabase.from("topics").select("id, name").order("name"),
        supabase.from("papers").select("source"),
        supabase.from("papers").select("published_at"),
      ]);

      if (topicsRes.data) setTopics(topicsRes.data);

      if (sourceRes.data) {
        const unique = Array.from(
          new Set(sourceRes.data.map((r) => r.source).filter((s): s is string => !!s))
        ).sort();
        setSources(unique);
      }

      if (dateRes.data) {
        const unique = Array.from(
          new Set(
            dateRes.data
              .map((r) => (r.published_at ? new Date(r.published_at).getFullYear() : null))
              .filter((y): y is number => y !== null)
          )
        ).sort((a, b) => b - a);
        setYears(unique);
      }
    }

    loadFilterOptions();
  }, []);

  // Re-fetch papers whenever filters change (search is debounced).
  useEffect(() => {
    let active = true;
    const debounceMs = filters.search ? 300 : 0;

    const timer = setTimeout(async () => {
      let query = supabase
        .from("papers")
        .select("id, title, authors, abstract, url, source, score, published_at")
        .order("published_at", { ascending: false })
        .limit(50);

      if (filters.topicId) query = query.eq("topic_id", filters.topicId);
      if (filters.source) query = query.eq("source", filters.source);
      if (filters.year) {
        query = query
          .gte("published_at", `${filters.year}-01-01`)
          .lt("published_at", `${filters.year + 1}-01-01`);
      }
      if (filters.minScore > 0) query = query.gte("score", filters.minScore);

      const term = filters.search.trim();
      if (term) {
        query = query.textSearch("search_vector", term, { type: "websearch" });
      }

      let { data, error } = await query;

      // Fallback to ILIKE if full-text search on search_vector isn't usable.
      if (error && term) {
        let fallbackQuery = supabase
          .from("papers")
          .select("id, title, authors, abstract, url, source, score, published_at")
          .order("published_at", { ascending: false })
          .limit(50)
          .or(`title.ilike.%${term}%,abstract.ilike.%${term}%`);

        if (filters.topicId) fallbackQuery = fallbackQuery.eq("topic_id", filters.topicId);
        if (filters.source) fallbackQuery = fallbackQuery.eq("source", filters.source);
        if (filters.year) {
          fallbackQuery = fallbackQuery
            .gte("published_at", `${filters.year}-01-01`)
            .lt("published_at", `${filters.year + 1}-01-01`);
        }
        if (filters.minScore > 0) fallbackQuery = fallbackQuery.gte("score", filters.minScore);

        const fallback = await fallbackQuery;
        data = fallback.data;
        error = fallback.error;
      }

      if (!active) return;

      if (error) {
        setError(error.message);
      } else {
        setError(null);
        setPapers(data ?? []);
      }
    }, debounceMs);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [filters]);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <div className="mx-auto max-w-5xl">
        <StatsCharts />

        <FilterBar
          filters={filters}
          onChange={setFilters}
          topics={topics}
          sources={sources}
          years={years}
        />

        {error && (
          <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            Lỗi tải dữ liệu: {error}
          </p>
        )}

        {!error && papers === null && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Đang tải...</p>
        )}

        {!error && papers !== null && papers.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Không có paper nào khớp bộ lọc hiện tại.
          </p>
        )}

        {!error && papers !== null && papers.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {papers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
