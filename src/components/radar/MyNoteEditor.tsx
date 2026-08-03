"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthProvider";
import { supabase } from "@/lib/supabase";

export default function MyNoteEditor({ paperId }: { paperId: string }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let active = true;

    async function load() {
      const { data } = await supabase
        .from("notes")
        .select("content")
        .eq("paper_id", paperId)
        .eq("user_id", user!.id)
        .maybeSingle();

      if (!active) return;
      if (data) setContent(data.content);
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [paperId, user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    setError(null);

    const { error } = await supabase.from("notes").upsert(
      {
        paper_id: paperId,
        user_id: user.id,
        content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "paper_id,user_id" }
    );

    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  if (!user) return null;

  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Ghi chú của tôi
      </h2>

      {loading ? (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">Đang tải ghi chú...</p>
      ) : (
        <div className="flex flex-col gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Viết ghi chú của bạn..."
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-fit rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
            {saved && (
              <span className="text-sm text-emerald-600 dark:text-emerald-400">Đã lưu ✓</span>
            )}
            {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
          </div>
        </div>
      )}
    </section>
  );
}
