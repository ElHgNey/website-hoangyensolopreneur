import Link from "next/link";
import { scoreBadgeClass, formatDate } from "@/lib/paperFormat";

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

function SourceIcon({ source }: { source: string | null }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 11a9 9 0 019 9M4 4a16 16 0 0116 16M5 19a1 1 0 100-2 1 1 0 000 2z"
        />
      </svg>
      <span className="sr-only">{source ?? "nguồn"}</span>
    </span>
  );
}

export default function PaperCard({ paper }: { paper: Paper }) {
  const date = formatDate(paper.published_at);

  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 border-b border-zinc-200 py-4 last:border-b-0 dark:border-zinc-800">
      <SourceIcon source={paper.source} />

      <div className="min-w-0">
        <Link
          href={`/blog/paper/${paper.id}`}
          className="font-serif text-base font-semibold leading-snug text-zinc-900 hover:underline dark:text-zinc-50"
        >
          {paper.title}
        </Link>
        {paper.abstract && (
          <p className="mt-1 line-clamp-1 text-sm text-zinc-500 dark:text-zinc-400">
            {paper.abstract}
          </p>
        )}
        {paper.source && (
          <span className="mt-1 inline-block font-grotesk text-xs font-medium text-zinc-400 dark:text-zinc-500">
            {paper.source}
          </span>
        )}
      </div>

      {paper.score !== null ? (
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold font-grotesk ${scoreBadgeClass(paper.score)}`}
        >
          {paper.score.toFixed(1)}
        </span>
      ) : (
        <span />
      )}

      <span className="shrink-0 font-grotesk text-xs text-zinc-400 dark:text-zinc-500">
        {date}
      </span>

      <Link
        href={`/blog/paper/${paper.id}`}
        aria-label="Xem chi tiết"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-300 text-zinc-500 transition-colors hover:border-radar-terracotta hover:text-radar-terracotta dark:border-zinc-700 dark:text-zinc-400"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
