import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaArrowRight } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import { getAllPosts, searchPosts, type PostMeta } from "@/lib/content";
import { CATEGORIES, getCategoryLabel } from "@/lib/constants";
import { getAllCollections } from "@/lib/collections";
import { DEFAULT_HERO_IMAGE, getImagePaths } from "@/lib/images";

export function BlogList() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery] = useState("");
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const allPosts = useMemo(() => getAllPosts(), []);

  const category = searchParams.get("category") || "all";

  const categories = useMemo(() => {
    const knownOrder = new Map(CATEGORIES.map((cat, index) => [cat, index]));
    const dynamicCategories = Array.from(
      new Set(allPosts.map((post) => post.category).filter(Boolean)),
    );

    dynamicCategories.sort((a, b) => {
      const orderA = knownOrder.get(a);
      const orderB = knownOrder.get(b);

      if (orderA !== undefined && orderB !== undefined) return orderA - orderB;
      if (orderA !== undefined) return -1;
      if (orderB !== undefined) return 1;
      return a.localeCompare(b);
    });

    return [
      { key: "all", label: language === "zh" ? "全部" : "All" },
      ...dynamicCategories.map((cat) => ({
        key: cat,
        label: getCategoryLabel(cat, language),
      })),
    ];
  }, [allPosts, language]);

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
    <div className="min-h-screen pt-24 pb-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="focus-halo mb-7 flex flex-col gap-2">
          <p className="poetic-title">Reading Index</p>
          <h1 className="font-heading text-3xl text-foreground md:text-4xl">
            {language === "zh" ? "博客文章" : "Blog Posts"}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-9 flex flex-wrap gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryChange(cat.key)}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.12em] transition-all duration-200 ${
                    category === cat.key
                      ? "border-primary/70 bg-primary/90 text-primary-foreground"
                      : "border-border/70 bg-card/65 text-foreground/80 hover:border-primary/35 hover:text-primary"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {language === "zh" ? "没有找到相关文章" : "No articles found"}
              </div>
            ) : (
              filteredPosts.map((post) => {
                const { original: heroImage, optimized: optimizedHeroImage } = getImagePaths(post.heroImage);

                return (
                  <article
                    key={`${post.category}-${post.slug}`}
                    className="glass-card group relative isolate overflow-hidden rounded-[1.4rem] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {optimizedHeroImage ? (
                      <picture>
                        <source srcSet={optimizedHeroImage} type="image/webp" />
                        <img
                          src={heroImage || DEFAULT_HERO_IMAGE}
                          alt=""
                          className="pointer-events-none absolute inset-0 h-full w-full object-cover [mask-image:linear-gradient(to_right,transparent_0%,transparent_34%,black_72%,black_100%)]"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_HERO_IMAGE;
                          }}
                        />
                      </picture>
                    ) : (
                      <img
                        src={heroImage || DEFAULT_HERO_IMAGE}
                        alt=""
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover [mask-image:linear-gradient(to_right,transparent_0%,transparent_34%,black_72%,black_100%)]"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_HERO_IMAGE;
                        }}
                      />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/95 via-[44%] to-transparent" />
                    <div className="cinematic-tone pointer-events-none absolute inset-0" />

                    <Link to={`/blog/${post.category}/${post.slug}`} className="block h-full">
                      <div className="relative min-h-[190px] md:min-h-[214px] flex items-center px-6 md:px-8 py-7">
                        <div className="flex-1 pr-12">
                          <div className="poetic-title mb-3 text-[0.66rem]">
                            {post.date}
                          </div>
                          <h2 className="mb-2 font-heading text-2xl leading-tight text-foreground md:text-[1.74rem]">
                            {post.title}
                          </h2>
                          <p className="mb-4 max-w-2xl text-sm leading-relaxed text-foreground/72 md:text-base line-clamp-2">{post.excerpt}</p>

                          <div className="mb-3 flex items-center gap-2 text-foreground/80">
                            <FaClock className="h-3.5 w-3.5" />
                            <span className="text-sm font-normal">{post.readMinutes || 1} min read</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-border/70 bg-card/70 px-3 py-1 text-[0.72rem] uppercase tracking-[0.1em] text-foreground/78 transition-colors hover:border-primary/35 hover:text-primary"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xl text-muted-foreground/50 md:right-8 md:text-2xl">
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
              <div className="glass-card rounded-2xl p-5">
                <p className="poetic-title mb-2">Collections</p>
                <h3 className="mb-3 font-heading text-2xl text-foreground">{language === "zh" ? "文章集合" : "Collections"}</h3>
                <div className="space-y-1">
                  {getAllCollections().map((col) => (
                    <Link
                      key={col.id}
                      to={`/blog/collections/${col.id}`}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-foreground/90 transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <span>{language === "zh" ? col.name.zh : col.name.en}</span>
                      <span className="text-xs text-muted-foreground">({col.items.length})</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5">
                <p className="poetic-title mb-2">Index Tags</p>
                <h3 className="mb-3 font-heading text-2xl text-foreground">{language === "zh" ? "标签" : "Tags"}</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(([tag, count]) => (
                    <Link
                      key={tag}
                      to={`/blog/tag/${encodeURIComponent(tag)}`}
                      className="rounded-full border border-border/65 px-3 py-1 text-[0.68rem] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary"
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
