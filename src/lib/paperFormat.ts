export function scoreBadgeClass(score: number | null) {
  if (score === null) return "bg-zinc-100 text-zinc-600";
  if (score >= 7) return "bg-emerald-100 text-emerald-700";
  if (score >= 4) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
