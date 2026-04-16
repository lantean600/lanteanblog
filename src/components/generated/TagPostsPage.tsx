import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaSearch, FaTag } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { getAllPosts, getAllTags } from "@/lib/content";

export function TagPostsPage() {
  const { language } = useLanguage();
  const { tag } = useParams();
  const [query, setQuery] = useState("");

  const selectedTag = decodeURIComponent(tag ?? "").trim();
  const normalizedTag = selectedTag.toLowerCase();

  const allPosts = useMemo(() => getAllPosts(), []);
  const allTags = useMemo(() => getAllTags(), []);

  const tagPosts = useMemo(() => {
    return allPosts.filter((post) =>
      post.tags.some((t) => t.toLowerCase() === normalizedTag),
    );
  }, [allPosts, normalizedTag]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tagPosts;

    return tagPosts.filter((post) =>
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [query, tagPosts]);

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

        <div className="mb-8 rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 inline-flex items-center gap-2 text-muted-foreground">
            <FaTag className="h-4 w-4" />
            <span>{language === "zh" ? "标签页面" : "Tag Page"}</span>
          </div>
          <h1 className="text-3xl font-black text-foreground">#{selectedTag || "-"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {language === "zh"
              ? `共匹配到 ${tagPosts.length} 篇文章`
              : `${tagPosts.length} article(s) matched`}
          </p>

          <div className="relative mt-4 max-w-md">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === "zh" ? "在当前标签中检索..." : "Search in this tag..."}
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <FaSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {allTags.map((t) => {
            const active = t.toLowerCase() === normalizedTag;
            return (
              <Link
                key={t}
                to={`/blog/tag/${encodeURIComponent(t)}`}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
              >
                #{t}
              </Link>
            );
          })}
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
              {language === "zh" ? "没有匹配文章" : "No matching articles"}
            </div>
          ) : (
            filtered.map((post) => (
              <article
                key={`${post.category}-${post.slug}`}
                className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/35"
              >
                <Link to={`/blog/${post.category}/${post.slug}`}>
                  <h2 className="text-xl font-bold text-foreground transition-colors hover:text-primary">
                    {post.title}
                  </h2>
                </Link>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{post.date}</span>
                  {post.tags.map((t) => (
                    <span key={t} className="rounded-full border border-border px-2 py-0.5">
                      #{t}
                    </span>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
