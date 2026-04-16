import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaSearch } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { getAllPosts, searchPosts } from "@/lib/content";
import hero1 from "@/assets/hero1.jpg";

interface PostMeta {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  views: number;
  tags: string[];
  heroImage?: string;
}

const resolveHeroImage = (image?: string) => {
  if (!image || image === "/assets/hero1.jpg") return hero1;
  return image;
};

const estimateReadMinutes = (text: string) => {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
};

export function BlogList() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const allPosts = useMemo(() => getAllPosts(), []);

  const category = searchParams.get("category") || "all";

  const categories = [
    { key: "all", label: language === "zh" ? "全部" : "All" },
    { key: "research", label: language === "zh" ? "研究" : "Research" },
    { key: "technical", label: language === "zh" ? "技术" : "Technical" },
    { key: "daily", label: language === "zh" ? "日常" : "Daily" },
    { key: "journal", label: language === "zh" ? "月刊" : "Journal" },
  ];

  useEffect(() => {
    setLoading(true);
    try {
      let postsData = allPosts;

      if (searchQuery.trim()) {
        postsData = searchPosts(searchQuery.trim());
      } else if (category !== "all") {
        postsData = postsData.filter((post) => post.category === category);
      }

      setPosts(postsData);
    } catch (error) {
      console.error("Failed to load posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [allPosts, category, searchQuery]);

  const handleCategoryChange = (newCategory: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (newCategory === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", newCategory);
    }
    setSearchParams(newParams);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [posts, searchQuery]);

  const popularTags = useMemo(() => {
    const tagCount = new Map<string, number>();

    for (const post of allPosts) {
      for (const tag of post.tags) {
        tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
      }
    }

    return Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 18);
  }, [allPosts]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-lg text-muted-foreground">{language === "zh" ? "加载中..." : "Loading..."}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-6">{language === "zh" ? "博客文章" : "Blog Posts"}</h1>

            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryChange(cat.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    category === cat.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {language === "zh" ? "没有找到相关文章" : "No articles found"}
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const heroImage = resolveHeroImage(post.heroImage);
                  const readMinutes = estimateReadMinutes(`${post.title} ${post.excerpt}`);

                  return (
                    <article
                      key={`${post.category}-${post.slug}`}
                      className="relative isolate overflow-hidden rounded-3xl border border-border/70 bg-card shadow-lg shadow-black/5"
                    >
                      <img
                        src={heroImage}
                        alt=""
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55 blur-[6px] saturate-115 contrast-105 scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = hero1;
                        }}
                      />
                      <img
                        src={heroImage}
                        alt=""
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-34 [mask-image:linear-gradient(to_right,transparent_4%,rgba(0,0,0,0.85)_58%,black_100%)]"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = hero1;
                        }}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/97 via-background/86 via-[46%] to-background/60" />
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(86%_100%_at_34%_44%,rgba(255,255,255,0.56)_0%,rgba(255,255,255,0.16)_48%,rgba(255,255,255,0)_78%)]" />

                      <div className="relative min-h-[220px] md:min-h-[236px]">
                        <div className="p-5 md:p-6 flex h-full flex-col justify-between">
                          <div>
                            <div className="mb-2 inline-flex items-center gap-2 text-xs tracking-wide text-muted-foreground">
                              <FaCalendarAlt className="h-3.5 w-3.5" />
                              {post.date}
                            </div>
                            <Link to={`/blog/${post.category}/${post.slug}`}>
                              <h2 className="text-2xl md:text-[1.85rem] font-black leading-tight text-foreground hover:text-primary transition-colors line-clamp-2">
                                {post.title}
                              </h2>
                            </Link>
                            <p className="mt-2 text-sm md:text-base text-foreground/80 line-clamp-2">{post.excerpt}</p>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-foreground/85">
                              <FaClock className="h-3 w-3" />
                              {readMinutes} {language === "zh" ? "分钟" : "min"}
                            </span>
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-border/70 bg-background/65 px-3 py-1 text-xs text-foreground/85"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>

          <aside className="w-full md:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="p-4 bg-card border border-border rounded-lg">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {language === "zh" ? "全站搜索" : "Global Search"}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {language === "zh"
                    ? "检索标题、摘要、标签和正文内容"
                    : "Search title, excerpt, tags, and full content"}
                </p>
                <Link
                  to={searchQuery.trim() ? `/search?q=${encodeURIComponent(searchQuery.trim())}` : "/search"}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <FaSearch className="h-3.5 w-3.5" />
                  <span>{language === "zh" ? "打开搜索页" : "Open Search"}</span>
                </Link>
              </div>

              <div className="p-4 bg-card border border-border rounded-lg">
                <h3 className="text-sm font-semibold text-foreground mb-3">{language === "zh" ? "热门标签" : "Popular Tags"}</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(([tag, count]) => (
                    <Link
                      key={tag}
                      to={`/blog/tag/${encodeURIComponent(tag)}`}
                      className="text-xs px-3 py-1 bg-muted text-muted-foreground rounded hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      #{tag} <span className="opacity-70">({count})</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
