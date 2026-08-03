"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.slice(1);
    // Wait for the page to settle (fonts/layout) before jumping, otherwise
    // a smooth scroll gets interrupted mid-animation on a fresh page load.
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    }, 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
