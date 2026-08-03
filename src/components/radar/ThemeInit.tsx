"use client";

import { useLayoutEffect } from "react";

const STORAGE_KEY = "radar-theme";

// Applies the saved/system theme to #blog-root synchronously before paint.
// A plain <script> tag only runs on the initial HTML parse, not on client-side
// navigations (e.g. clicking a Next.js <Link> into /blog) — useLayoutEffect
// covers both cases.
export default function ThemeInit() {
  useLayoutEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const root = document.getElementById("blog-root");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (root && (stored === "dark" || (!stored && prefersDark))) {
        root.classList.add("dark");
      }
    } catch {
      // localStorage unavailable — fall back to light theme.
    }
  }, []);

  return null;
}
