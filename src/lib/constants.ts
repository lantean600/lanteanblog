export const CATEGORIES = ["research", "technical", "daily", "journal"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, { zh: string; en: string }> = {
  research: { zh: "学术研究", en: "Research" },
  technical: { zh: "技术分享", en: "Technical" },
  daily: { zh: "日常随笔", en: "Daily" },
  journal: { zh: "阶段总结", en: "Journal" },
};

export function getCategoryLabel(category: string, language: "zh" | "en"): string {
  const known = CATEGORY_LABELS[category as Category];
  if (known) {
    return language === "zh" ? known.zh : known.en;
  }

  const normalized = category
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  if (!normalized) return category;

  return normalized
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
