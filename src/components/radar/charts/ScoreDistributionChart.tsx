"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function colorForScore(score: number) {
  if (score >= 8) return "#10b981"; // emerald-500, matches score-badge color for >=8
  if (score >= 6) return "#f59e0b"; // amber-500, matches score-badge color for 6-8
  return "#a1a1aa"; // zinc-400, matches score-badge color for <6
}

export default function ScoreDistributionChart({ data }: { data: { score: number; count: number }[] }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Phân bố điểm AI
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
          <XAxis dataKey="score" tick={{ fontSize: 11, fill: "#71717a" }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#71717a" }} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e4e4e7" }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive={false}>
            {data.map((entry) => (
              <Cell key={entry.score} fill={colorForScore(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
