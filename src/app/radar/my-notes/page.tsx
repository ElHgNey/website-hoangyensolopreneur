"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthProvider";
import { supabase } from "@/lib/supabase";

type NoteWithPaper = {
  id: string;
  content: string;
  updated_at: string;
  paper_id: string;
  papers: { title: string } | null;
};

export default function MyNotesPage() {
  const { user, loading: authLoading } = useAuth();
  const [notes, setNotes] = useState<NoteWithPaper[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setNotes(null);
      return;
    }

    let active = true;

    async function load() {
      const { data, error } = await supabase
        .from("notes")
        .select("id, content, updated_at, paper_id, papers(title)")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false });

      if (!active) return;
      if (error) setError(error.message);
      else setNotes((data as unknown as NoteWithPaper[]) ?? []);
    }

    load();
    return () => {
      active = false;
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          My Notes
        </h1>

        {authLoading && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Đang tải...</p>
        )}

        {!authLoading && !user && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Vui lòng đăng nhập để xem ghi chú của bạn.
          </p>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            Lỗi tải dữ liệu: {error}
          </p>
        )}

        {user && notes === null && !error && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Đang tải ghi chú...</p>
        )}

        {user && notes !== null && notes.length === 0 && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Bạn chưa có ghi chú nào.
          </p>
        )}

        {user && notes && notes.length > 0 && (
          <div className="flex flex-col gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <Link
                  href={`/radar/paper/${note.paper_id}`}
                  className="font-semibold text-zinc-900 hover:underline dark:text-zinc-50"
                >
                  {note.papers?.title ?? "Paper"}
                </Link>
                <p className="mt-2 whitespace-pre-line text-sm text-zinc-600 dark:text-zinc-400">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
