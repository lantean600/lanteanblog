export interface TocItem {
  level: number;
  text: string;
  id: string;
}

export function normalizeHeadingText(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[`~!@#$%^&*()+=[\]{};:'",.<>/?\\|]/g, "")
    .replace(/\s+/g, "-");
}

/** Parse heading rows from markdown and generate a stable TOC list. */
export function extractTocFromMarkdown(md: string): TocItem[] {
  const items: TocItem[] = [];
  const used = new Map<string, number>();
  let inCodeFence = false;

  for (const line of md.split("\n")) {
    if (/^\s*```/.test(line)) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const m = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (!m) continue;

    const text = m[2].trim();
    const base = normalizeHeadingText(text) || "section";
    const hit = used.get(base) ?? 0;
    used.set(base, hit + 1);
    const id = hit === 0 ? base : `${base}-${hit}`;

    items.push({
      level: m[1].length,
      text,
      id,
    });
  }

  return items;
}
