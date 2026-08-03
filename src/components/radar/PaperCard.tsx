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

export default function PaperCard({ paper }: { paper: Paper }) {
  const date = formatDate(paper.published_at);

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 py-5 last:border-b-0 dark:border-zinc-800">
      <div className="min-w-0 flex-1">
        <Link
          href={`/blog/paper/${paper.id}`}
          className="font-serif text-lg font-semibold leading-snug text-zinc-900 hover:underline dark:text-zinc-50"
        >
          {paper.title}
        </Link>

        {paper.authors && (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{paper.authors}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2 font-grotesk">
          {paper.source && (
            <span className="rounded-full bg-radar-bg px-2.5 py-0.5 text-xs font-medium text-radar-terracotta-dark dark:bg-zinc-800 dark:text-zinc-300">
              {paper.source}
            </span>
          )}
          {paper.score !== null && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreBadgeClass(paper.score)}`}
            >
              {paper.score.toFixed(1)}
            </span>
          )}
          {date && (
            <span className="text-xs text-zinc-400 dark:text-zinc-500">{date}</span>
          )}
        </div>

        {paper.abstract && (
          <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
            {paper.abstract}
          </p>
        )}
      </div>

      <Link
        href={`/blog/paper/${paper.id}`}
        className="shrink-0 whitespace-nowrap font-grotesk text-sm font-semibold text-radar-terracotta hover:text-radar-terracotta-dark"
      >
        Chi tiết →
      </Link>
    </div>
  );
}
