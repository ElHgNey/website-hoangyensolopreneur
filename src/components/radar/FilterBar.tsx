type Topic = { id: string; name: string };

export type Filters = {
  topicId: string | null;
  source: string | null;
  year: number | null;
  minScore: number;
  search: string;
};

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
  topics: Topic[];
  sources: string[];
  years: number[];
};

const selectClass =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200";

export default function FilterBar({ filters, onChange, topics, sources, years }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 font-grotesk shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <select
            className={selectClass}
            value={filters.topicId ?? ""}
            onChange={(e) => onChange({ ...filters, topicId: e.target.value || null })}
          >
            <option value="">Tất cả chủ đề</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <select
            className={selectClass}
            value={filters.source ?? ""}
            onChange={(e) => onChange({ ...filters, source: e.target.value || null })}
          >
            <option value="">Tất cả nguồn</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            className={selectClass}
            value={filters.year ?? ""}
            onChange={(e) =>
              onChange({ ...filters, year: e.target.value ? Number(e.target.value) : null })
            }
          >
            <option value="">Tất cả năm</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <span>Điểm AI tối thiểu: {filters.minScore.toFixed(1)}</span>
          <input
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={filters.minScore}
            onChange={(e) => onChange({ ...filters, minScore: Number(e.target.value) })}
            className="w-32 accent-radar-terracotta"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <input
            type="text"
            placeholder="Tìm theo tiêu đề hoặc tóm tắt..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          />
        </div>
        {filters.search && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, search: "" })}
            className="shrink-0 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Xoá tìm kiếm
          </button>
        )}
      </div>
    </div>
  );
}
