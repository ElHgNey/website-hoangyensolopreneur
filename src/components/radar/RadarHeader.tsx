"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthProvider";
import ThemeToggle from "@/components/radar/ThemeToggle";

export default function RadarHeader() {
  const { user, loading, signInWithEmail, signOut } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    setSendError(null);
    const { error } = await signInWithEmail(email);
    if (error) setSendError(error);
    else setSent(true);
  }

  function closeForm() {
    setShowForm(false);
    setSent(false);
    setSendError(null);
    setEmail("");
  }

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-y-2 px-4 py-4 sm:px-8">
        <Link
          href="/radar"
          className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50"
        >
          Radar nghiên cứu
        </Link>

        <div className="flex flex-wrap items-center gap-3 font-grotesk sm:gap-4">
          <Link
            href="/radar/my-notes"
            className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
          >
            My Notes
          </Link>

          <ThemeToggle />

          {loading ? null : user ? (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="max-w-[140px] truncate text-sm text-zinc-600 dark:text-zinc-400 sm:max-w-none">
                {user.email}
              </span>
              <button
                type="button"
                onClick={() => signOut()}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowForm((s) => !s)}
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Đăng nhập
              </button>

              {showForm && (
                <div className="absolute right-0 top-full z-10 mt-2 w-72 rounded-lg border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                  {sent ? (
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Đã gửi link đăng nhập, kiểm tra email của bạn.
                      </p>
                      <button
                        type="button"
                        onClick={closeForm}
                        className="self-start text-xs text-zinc-500 hover:underline dark:text-zinc-400"
                      >
                        Đóng
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSend} className="flex flex-col gap-2">
                      <input
                        type="email"
                        required
                        placeholder="email@vidu.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                      />
                      {sendError && <p className="text-xs text-red-600">{sendError}</p>}
                      <button
                        type="submit"
                        className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
                      >
                        Gửi link đăng nhập
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
