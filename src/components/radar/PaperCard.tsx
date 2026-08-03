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
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <Link
        href={`/radar/paper/${paper.id}`}
        className="font-semibold leading-snug text-zinc-900 hover:underline dark:text-zinc-50"
      >
        {paper.title}
      </Link>

      {paper.authors && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{paper.authors}</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {paper.source && (
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
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
        <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {paper.abstract}
        </p>
      )}

      <Link
        href={`/radar/paper/${paper.id}`}
        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        Chi tiết →
      </Link>
    </div>
  );
}
