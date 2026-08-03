"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
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
  // Not populated by the ingestion pipeline yet — reserved for a future
  // AI-generated Vietnamese summary column.
  summary_vi?: string | null;
};

export default function PaperDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [paper, setPaper] = useState<Paper | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data, error } = await supabase
        .from("papers")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!active) return;
      if (error) setError(error.message);
      else setPaper(data);
    }

    load();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 text-sm font-medium text-zinc-600 hover:underline dark:text-zinc-400"
        >
          ← Quay lại
        </button>

        {error && (
          <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            Lỗi tải dữ liệu: {error}
          </p>
        )}

        {!error && paper === undefined && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Đang tải...</p>
        )}

        {!error && paper === null && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Không tìm thấy paper này.
          </p>
        )}

        {!error && paper && (
          <article className="flex flex-col gap-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
            <h1 className="text-2xl font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
              {paper.title}
            </h1>

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
              {formatDate(paper.published_at) && (
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {formatDate(paper.published_at)}
                </span>
              )}
            </div>

            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Abstract gốc
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {paper.abstract || "Không có abstract."}
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Tóm tắt tiếng Việt (AI)
              </h2>
              {paper.summary_vi ? (
                <>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {paper.summary_vi}
                  </p>
                  <p className="mt-2 text-xs italic text-zinc-400 dark:text-zinc-500">
                    Do AI sinh — nên đọc bản gốc trước khi trích dẫn.
                  </p>
                </>
              ) : (
                <p className="text-sm italic text-zinc-400 dark:text-zinc-500">
                  Chưa có tóm tắt tiếng Việt cho bài này.
                </p>
              )}
            </section>

            {paper.url && (
              <a
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center justify-center rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Mở paper gốc
              </a>
            )}
          </article>
        )}
      </div>
    </div>
  );
}
