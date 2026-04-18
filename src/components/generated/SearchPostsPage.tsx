import { useMemo, useState, useEffect, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

// 使用预构建的搜索索引，包含纯文本的 plainText
import searchIndexData from "@/data/search-index.json";

export interface SearchIndexItem {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  tags: string[];
  plainText: string;
  date?: string;
  segments?: SearchSegment[];
}

export interface SearchSegment {
  type: "heading" | "body";
  text: string;
  level?: number;
}

interface SearchRenderLine {
  type: "heading" | "body";
  text: string;
  level: number;
}

const searchIndex = searchIndexData as SearchIndexItem[];

// 简单的防抖 Hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function normalize(text: string): string {
  return text.toLowerCase();
}

function tokenizeQuery(query: string): string[] {
  return query
    .split(/\s+/)
    .map((token) => normalize(token.trim()))
    .filter(Boolean);
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitSections(plain: string): string[] {
  const normalized = plain.replace(/\r\n?/g, "\n");

  // Prefer natural paragraph boundaries first.
  let sections = normalized
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sections.length <= 1) {
    // Fallback: many historical plainText records are one-line, split by sentence endings.
    sections = normalized
      .split(/(?<=[。！？；.!?;])/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return sections;
}

function clipLine(text: string, maxLength = 170): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

function toSegments(post: SearchIndexItem): SearchSegment[] {
  if (post.segments && post.segments.length > 0) {
    return post.segments;
  }

  return splitSections(post.plainText || post.excerpt).map((text) => ({
    type: "body" as const,
    text,
    level: 0,
  }));
}

function findHeadingChain(segments: SearchSegment[], index: number): SearchRenderLine[] {
  const byLevel = new Map<number, SearchRenderLine>();

  for (let i = 0; i < index; i++) {
    const segment = segments[i];
    if (segment.type !== "heading") continue;

    const level = Math.max(1, Math.min(6, segment.level || 1));
    byLevel.set(level, { type: "heading", text: segment.text, level });

    for (const existingLevel of Array.from(byLevel.keys())) {
      if (existingLevel > level) byLevel.delete(existingLevel);
    }
  }

  return Array.from(byLevel.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, line]) => line);
}

function buildRenderLines(post: SearchIndexItem, tokens: string[], maxLines = 12): SearchRenderLine[] {
  const segments = toSegments(post);
  if (segments.length === 0) return [];

  if (tokens.length === 0) {
    const first = segments[0];
    return [{
      type: first.type,
      text: clipLine(first.text),
      level: first.type === "heading" ? Math.max(1, Math.min(6, first.level || 1)) : 0,
    }];
  }

  const matchedIndexes = segments
    .map((segment, idx) => ({ idx, normalized: normalize(segment.text || "") }))
    .filter((item) => tokens.some((token) => item.normalized.includes(token)))
    .map((item) => item.idx);

  if (matchedIndexes.length === 0) {
    return [{ type: "body", text: clipLine(post.excerpt || post.plainText || ""), level: 0 }];
  }

  const lines: SearchRenderLine[] = [];
  const seen = new Set<string>();

  const appendLine = (line: SearchRenderLine) => {
    const key = `${line.type}:${line.level}:${line.text}`;
    if (seen.has(key)) return;
    seen.add(key);
    lines.push(line);
  };

  for (const idx of matchedIndexes) {
    const segment = segments[idx];
    if (!segment?.text) continue;

    if (segment.type === "heading") {
      appendLine({
        type: "heading",
        text: clipLine(segment.text, 120),
        level: Math.max(1, Math.min(6, segment.level || 1)),
      });
    } else {
      const headingChain = findHeadingChain(segments, idx);
      headingChain.forEach(appendLine);
      appendLine({
        type: "body",
        text: clipLine(segment.text, 180),
        level: 0,
      });
    }

    if (lines.length >= maxLines) break;
  }

  return lines.slice(0, maxLines);
}

function highlightText(text: string, tokens: string[]): ReactNode {
  if (!text || tokens.length === 0) return text;

  const uniqueTokens = Array.from(new Set(tokens)).sort((a, b) => b.length - a.length);
  const pattern = uniqueTokens.map(escapeRegExp).join("|");
  if (!pattern) return text;

  const parts = text.split(new RegExp(`(${pattern})`, "gi"));
  return parts.map((part, idx) => {
    const matched = uniqueTokens.some((token) => normalize(part) === token);
    return matched ? (
      <mark key={`${part}-${idx}`} className="rounded bg-yellow-200 px-0.5 text-foreground dark:bg-yellow-600/40">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${idx}`}>{part}</span>
    );
  });
}

export function SearchPostsPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const debouncedQuery = useDebounce(query, 300); // 300ms 防抖延迟

  const normalizedQuery = normalize(debouncedQuery.trim());
  const queryTokens = useMemo(() => tokenizeQuery(normalizedQuery), [normalizedQuery]);

  const results = useMemo(() => {
    if (queryTokens.length === 0) return [] as SearchIndexItem[];

    return searchIndex
      .filter((post) => {
        const haystack = normalize([
          post.title,
          post.excerpt,
          post.tags.join(" "),
          post.plainText, // 使用提取好的纯文本
        ].join("\n"));
        return queryTokens.every((token) => haystack.includes(token));
      });
  }, [queryTokens]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (query.trim()) next.set("q", query.trim()); else next.delete("q");
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="mb-6 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <FaArrowLeft className="h-4 w-4" />
          <span>{language === "zh" ? "返回博客" : "Back to Blog"}</span>
        </Link>

        <div className="mb-8 glass-card rounded-2xl p-5">
          <h1 className="text-3xl font-black text-foreground">
            {language === "zh" ? "全站搜索" : "Global Search"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {language === "zh"
              ? "支持检索标题、摘要、标签与正文内容"
              : "Search across title, excerpt, tags, and full article content"}
          </p>

          <form onSubmit={onSubmit} className="relative mt-4 max-w-xl">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === "zh" ? "输入关键词，例如：transformer / dataset" : "Type keywords..."}
              aria-label="Search posts"
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-24 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
            >
              {language === "zh" ? "检索" : "Search"}
            </button>
          </form>

          <p className="mt-3 text-sm text-muted-foreground">
            {normalizedQuery
              ? (language === "zh" ? `匹配到 ${results.length} 篇文章` : `${results.length} article(s) matched`)
              : null}
          </p>
        </div>

        <div className="space-y-4">
          {results.map((post) => {
            const lines = buildRenderLines(post, queryTokens);

            return (
              <article
                key={`${post.category}-${post.slug}`}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/35"
              >
                <Link to={`/blog/${post.category}/${post.slug}`}>
                  <h2 className="text-xl font-bold text-foreground transition-colors hover:text-primary">
                    {highlightText(post.title, queryTokens)}
                  </h2>
                </Link>

                <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  {lines.map((line, idx) => (
                    <p
                      key={`${post.slug}-line-${idx}`}
                      className={line.type === "heading" ? "font-black text-foreground" : "text-muted-foreground"}
                    >
                      {line.type === "heading"
                        ? highlightText(line.text, queryTokens)
                        : <>
                            <span className="mr-1 text-foreground/70">↳</span>
                            {highlightText(line.text, queryTokens)}
                          </>}
                    </p>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{post.date}</span>
                  {post.tags.map((t) => (
                    <Link
                      key={t}
                      to={`/blog/tag/${encodeURIComponent(t)}`}
                      className="rounded-full border border-border px-2 py-0.5 hover:border-primary/50 hover:text-primary"
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
