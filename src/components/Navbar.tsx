"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { id: "about", label: "Overview" },
  { id: "expertise", label: "Solutions" },
  { id: "impact", label: "Impact" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const onBlog = pathname?.startsWith("/blog") ?? false;
  const [activeId, setActiveId] = useState("about");

  useEffect(() => {
    if (onBlog) return;

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
  }, [onBlog]);

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
                !onBlog && activeId === id
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
              onBlog
                ? "border-b-2 border-onyx pb-1 text-onyx"
                : "text-muted hover:text-onyx"
            }`}
          >
            Blog
          </Link>
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
