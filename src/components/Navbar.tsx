"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthProvider";
import ThemeToggle from "@/components/radar/ThemeToggle";

const NAV_ITEMS = [
  { id: "about", label: "Overview" },
  { id: "expertise", label: "Solutions" },
  { id: "impact", label: "Impact" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const onRadar = pathname?.startsWith("/blog") ?? false;
  const [activeId, setActiveId] = useState("about");

  const { user, loading, signInWithEmail, signOut } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    if (onRadar) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [onRadar]);

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
    <nav className="fixed top-0 z-50 w-full border-b border-subtle/20 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-24 max-w-[1280px] items-center justify-between px-5 md:px-16">
        <Link
          href="/"
          className="font-grotesk text-2xl font-bold tracking-tighter text-onyx"
        >
          Michelle Le (Hoàng Yến)
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`/#${id}`}
              className={`font-grotesk text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                !onRadar && activeId === id
                  ? "border-b-2 border-onyx pb-1 text-onyx"
                  : "text-muted hover:text-onyx"
              }`}
            >
              {label}
            </a>
          ))}
          <Link
            href="/blog"
            className={`font-grotesk text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
              onRadar
                ? "border-b-2 border-onyx pb-1 text-onyx"
                : "text-muted hover:text-onyx"
            }`}
          >
            Blog
          </Link>

          {onRadar && (
            <div className="flex items-center gap-4 border-l border-subtle/30 pl-6">
              <Link
                href="/blog/my-notes"
                className="font-grotesk text-sm font-semibold text-muted transition-colors hover:text-onyx"
              >
                My Notes
              </Link>

              <ThemeToggle />

              {loading ? null : user ? (
                <div className="flex items-center gap-2">
                  <span className="max-w-[120px] truncate font-grotesk text-sm text-muted">
                    {user.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="rounded-full border border-subtle px-3 py-1.5 font-grotesk text-xs font-semibold text-muted hover:bg-zinc-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowForm((s) => !s)}
                    className="rounded-full bg-onyx px-4 py-1.5 font-grotesk text-xs font-semibold text-white hover:bg-emerald"
                  >
                    Đăng nhập
                  </button>

                  {showForm && (
                    <div className="absolute right-0 top-full z-10 mt-2 w-72 rounded-lg border border-zinc-200 bg-white p-4 font-grotesk shadow-lg">
                      {sent ? (
                        <div className="flex flex-col gap-2">
                          <p className="text-sm text-zinc-600">
                            Đã gửi link đăng nhập, kiểm tra email của bạn.
                          </p>
                          <button
                            type="button"
                            onClick={closeForm}
                            className="self-start text-xs text-zinc-500 hover:underline"
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
                            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                          />
                          {sendError && <p className="text-xs text-red-600">{sendError}</p>}
                          <button
                            type="submit"
                            className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700"
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
          )}
        </div>
        <a
          href="/#contact"
          className="bg-onyx px-6 py-3 font-grotesk text-xs font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-emerald sm:px-8 sm:text-sm"
        >
          Partner With Us
        </a>
      </div>
    </nav>
  );
}
