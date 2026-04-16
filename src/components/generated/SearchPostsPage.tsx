import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { postsWithContent, type Post } from "@/lib/content";

function normalize(text: string): string {
  return text.toLowerCase();
}

function buildSnippet(content: string, q: string): string {
  const plain = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/[#>*_\-\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!q) return plain.slice(0, 150);
  const i = normalize(plain).indexOf(q);
  if (i < 0) return plain.slice(0, 150);
  const start = Math.max(0, i - 40);
  const end = Math.min(plain.length, i + 110);
  return `${start > 0 ? "..." : ""}${plain.slice(start, end)}${end < plain.length ? "..." : ""}`;
}

export function SearchPostsPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initial);

  const normalizedQuery = normalize(query.trim());

  const results = useMemo(() => {
    if (!normalizedQuery) return [] as Post[];

    return postsWithContent
      .filter((post) => {
        const haystack = normalize([
          post.title,
          post.excerpt,
          post.tags.join(" "),
          post.content,
        ].join("\n"));
        return haystack.includes(normalizedQuery);
      })
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [normalizedQuery]);

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
          {results.map((post) => (
            <article
              key={`${post.category}-${post.slug}`}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/35"
            >
              <Link to={`/blog/${post.category}/${post.slug}`}>
                <h2 className="text-xl font-bold text-foreground transition-colors hover:text-primary">
                  {post.title}
                </h2>
              </Link>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {buildSnippet(post.content || post.excerpt, normalizedQuery)}
              </p>
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
          ))}
        </div>
      </div>
    </div>
  );
}
