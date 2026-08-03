// Native <select> can't color individual <option> elements consistently
// across browsers, so a colored dot emoji prefix is the practical way to
// make each topic visually distinct in the dropdown.
const TOPIC_LABELS: Record<string, string> = {
  "solo-founder-ai": "🔵 AI cho một người làm chủ",
  "ai-doanh-nghiep": "🟢 AI cho doanh nghiệp",
};

export function topicDisplayLabel(name: string) {
  return TOPIC_LABELS[name] ?? `⚪ ${name}`;
}
