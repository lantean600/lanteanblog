import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaArrowRight } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { getAllPosts, searchPosts } from "@/lib/content";
import { getAllCollections } from "@/lib/collections";
import hero1 from "@/assets/hero1.jpg";

interface PostMeta {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
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
  const [searchQuery] = useState("");
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
      
      if (allPosts.length === 0) {
        console.warn("[BlogList] No posts loaded from content.ts. This might indicate a markdown parsing issue or empty content directory.");
      }

      if (searchQuery.trim()) {
        postsData = searchPosts(searchQuery.trim());
      } else if (category !== "all") {
        postsData = postsData.filter((post) => post.category === category);
      }

      setPosts(postsData);
    } catch (error) {
      console.error("[BlogList] Failed to load posts:", error);
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
        <h1 className="text-3xl font-bold text-foreground mb-6">{language === "zh" ? "博客文章" : "Blog Posts"}</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
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
                    className="glass-card group relative isolate overflow-hidden rounded-3xl shadow-lg shadow-black/5 hover:shadow-xl hover:bg-card/70 transition-all duration-300"
                  >
                    <img
                      src={heroImage}
                      alt=""
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover [mask-image:linear-gradient(to_right,transparent_0%,transparent_40%,black_75%,black_100%)]"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = hero1;
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/95 via-[40%] to-transparent" />

                    <Link to={`/blog/${post.category}/${post.slug}`} className="block h-full">
                      <div className="relative min-h-[240px] md:min-h-[260px] flex items-center px-6 md:px-8">
                        <div className="flex-1 pr-12">
                          <div className="mb-3 text-sm tracking-wide text-muted-foreground">
                            {post.date}
                          </div>
                          <h2 className="text-xl md:text-2xl font-bold leading-tight text-foreground mb-3">
                            {post.title}
                          </h2>
                          <p className="text-base md:text-lg text-foreground/70 mb-4 line-clamp-2">{post.excerpt}</p>

                          <div className="flex items-center gap-2 text-foreground/80 mb-4">
                            <FaClock className="h-4 w-4" />
                            <span className="text-base font-normal">{readMinutes} min read</span>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-muted/80 px-5 py-2 text-sm text-foreground/85 hover:bg-muted transition-colors"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground/50">
                          <FaArrowRight />
                        </div>
                      </div>
                    </Link>
                  </article>
                  );
                })
              )}
            </div>
          </div>

          <aside className="w-full md:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="glass-card rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">{language === "zh" ? "文章集合" : "Collections"}</h3>
                <div className="space-y-1">
                  {getAllCollections().map((col) => (
                    <Link
                      key={col.id}
                      to={`/blog/collections/${col.id}`}
                      className="flex items-center justify-between px-3 py-2 rounded-md text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <span>{language === "zh" ? col.name.zh : col.name.en}</span>
                      <span className="text-xs text-muted-foreground">({col.items.length})</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-lg p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">{language === "zh" ? "标签" : "Tags"}</h3>
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
