import { useEffect, useMemo, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaCalendarAlt, FaClock, FaHashtag, FaImage } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import { useLanguage } from "@/context/LanguageContext";
import { extractTocFromMarkdown } from "@/lib/markdown-toc";
import { getAllPosts, getPostDetail, type Post } from "@/lib/content";
import { DEFAULT_HERO_IMAGE, getImagePaths } from "@/lib/images";

export function BlogDetail() {
  const { language } = useLanguage();
  const { category, slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<Omit<Post, "content">[]>([]);
  const [activeTocId, setActiveTocId] = useState<string>("");
  const articleRef = useRef<HTMLElement | null>(null);
  const headingElementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [category, slug]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const topOffset = 112;
    const y = el.getBoundingClientRect().top + window.scrollY - topOffset;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadPost = async () => {
      try {
        if (!slug) {
          setPost(null);
          setRelatedPosts([]);
          return;
        }

        const postData = await getPostDetail(slug, category);
        
        if (!isMounted) return;

        setPost(postData);

        if (!postData) {
          setRelatedPosts([]);
        } else {
          const related = getAllPosts()
            .filter((p) => p.category === postData.category && p.slug !== postData.slug)
            .slice(0, 2);
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error("Failed to load post:", error);
        if (isMounted) {
          setPost(null);
          setRelatedPosts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPost();

    return () => {
      isMounted = false;
    };
  }, [category, slug]);

  const toc = useMemo(() => {
    if (!post?.content) return [];
    try {
      return extractTocFromMarkdown(post.content);
    } catch (error) {
      console.error("Failed to parse TOC:", error);
      return [];
    }
  }, [post?.content]);

  useEffect(() => {
    if (!toc.length || !articleRef.current) {
      headingElementsRef.current = [];
      setActiveTocId("");
      return;
    }

    const allHeadings = Array.from(
      articleRef.current.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6"),
    );
    const headingElements = allHeadings.slice(0, toc.length);
    headingElements.forEach((heading, i) => {
      heading.id = toc[i].id;
    });
    headingElementsRef.current = headingElements;

    if (!headingElements.length) {
      setActiveTocId(toc[0].id);
      return;
    }

    const topThreshold = 140;
    const syncActiveHeading = () => {
      let matchedId = headingElements[0].id;
      for (const heading of headingElements) {
        if (heading.getBoundingClientRect().top <= topThreshold) {
          matchedId = heading.id;
        } else {
          break;
        }
      }
      setActiveTocId(matchedId);
    };

    syncActiveHeading();
    window.addEventListener("scroll", syncActiveHeading, { passive: true });
    window.addEventListener("resize", syncActiveHeading);

    return () => {
      window.removeEventListener("scroll", syncActiveHeading);
      window.removeEventListener("resize", syncActiveHeading);
    };
  }, [toc, post?.content]);

  const readMinutes = post?.readMinutes || 1;

  const markdownComponents = useMemo(() => {
    const withId = (Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") => {
      return (
        props: ComponentPropsWithoutRef<typeof Tag> & { children?: ReactNode },
      ) => {
        return (
          <Tag
            {...props}
            className={`scroll-mt-28 ${props.className ?? ""}`.trim()}
          />
        );
      };
    };

    const MarkdownImage = (
      props: ComponentPropsWithoutRef<"img">,
    ) => {
      const { alt, src, className, ...rest } = props;
      const { original, optimized } = getImagePaths(typeof src === "string" ? src : undefined);
      return (
        optimized ? (
          <picture>
            <source srcSet={optimized} type="image/webp" />
            <img
              {...rest}
              alt={alt ?? ""}
              src={original}
              loading="lazy"
              decoding="async"
              className={`max-w-full rounded-xl border border-border/40 shadow-sm ${className ?? ""}`.trim()}
            />
          </picture>
        ) : (
          <img
            {...rest}
            alt={alt ?? ""}
            src={original}
            loading="lazy"
            decoding="async"
            className={`max-w-full rounded-xl border border-border/40 shadow-sm ${className ?? ""}`.trim()}
          />
        )
      );
    };

    return {
      h1: withId("h1"),
      h2: withId("h2"),
      h3: withId("h3"),
      h4: withId("h4"),
      h5: withId("h5"),
      h6: withId("h6"),
      img: MarkdownImage,
    };
  }, [toc]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-lg text-muted-foreground">
          {language === "zh" ? "加载中..." : "Loading..."}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span>{language === "zh" ? "返回博客列表" : "Back to Blog List"}</span>
          </Link>
          <div className="p-6 bg-card border border-border rounded-lg">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {language === "zh" ? "文章不存在" : "Post Not Found"}
            </h1>
            <p className="text-muted-foreground">
              {language === "zh"
                ? "你访问的文章不存在或已被删除。"
                : "The post you are looking for does not exist or has been removed."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tocNav = (
    <nav
      aria-label={language === "zh" ? "文章目录" : "Table of contents"}
      className="glass-card rounded-2xl p-4"
    >
      <p className="poetic-title mb-2">Navigation</p>
      <p className="mb-3 font-heading text-xl text-foreground">
        {language === "zh" ? "目录" : "Contents"}
      </p>
      <ul className="max-h-[min(70vh,32rem)] space-y-1 overflow-y-auto text-sm">
        {toc.map((item) => {
          const isActive = activeTocId === item.id;
          return (
            <li
              key={item.id}
              style={{ paddingLeft: `${Math.max(0, item.level - 1) * 12}px` }}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeading(item.id);
                }}
                className={`block rounded-md px-2 py-1 transition-colors ${
                  isActive
                    ? "bg-primary/12 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-primary"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <div className="min-h-screen pt-24 pb-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center space-x-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>{language === "zh" ? "返回博客列表" : "Back to Blog List"}</span>
        </Link>

        <div className="lg:grid lg:grid-cols-[minmax(0,2fr)_min(320px,30%)] lg:gap-12">
          {/* Left column: Hero image and article content */}
          <div>
            <header className="focus-halo mb-11">
              <p className="poetic-title mb-2">Article</p>
              <div className="relative overflow-hidden rounded-[1.55rem] border border-border/60">
                {(() => {
                  const { original, optimized } = getImagePaths(post.heroImage);
                  return optimized ? (
                    <picture>
                      <source srcSet={optimized} type="image/webp" />
                      <img
                        src={original || DEFAULT_HERO_IMAGE}
                        alt={`${post.title} hero`}
                        className="block w-full aspect-[16/9] object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_HERO_IMAGE;
                        }}
                      />
                    </picture>
                  ) : (
                    <img
                      src={original || DEFAULT_HERO_IMAGE}
                      alt={`${post.title} hero`}
                      className="block w-full aspect-[16/9] object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_HERO_IMAGE;
                      }}
                    />
                  );
                })()}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/14 to-transparent" />
                <div className="cinematic-tone pointer-events-none absolute inset-0" />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <FaCalendarAlt className="h-4 w-4" />
                  {language === "zh"
                    ? `${post.date} / 更新 ${post.date}`
                    : `${post.date} / Update ${post.date}`}
                </span>
                <span className="inline-flex items-center gap-2">
                  <FaClock className="h-4 w-4" />
                  {readMinutes} {language === "zh" ? "分钟阅读" : "min read"}
                </span>
                <span className="inline-flex items-center gap-2">
                  <FaImage className="h-4 w-4" />
                  {post.heroLink ? (
                    <a
                      href={post.heroLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-foreground"
                    >
                      Hero Image
                    </a>
                  ) : (
                    <span>Hero Image</span>
                  )}
                </span>
                <span className="inline-flex items-center gap-2">
                  <FaHashtag className="h-4 w-4" />
                  <span>{post.tags.join(" / ")}</span>
                </span>
              </div>

              <h1 className="mt-5 font-heading text-3xl tracking-tight text-foreground sm:text-4xl">
                {post.title}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">{post.excerpt}</p>
            </header>

            <article ref={articleRef} className="prose prose-lg max-w-none dark:prose-invert min-w-0">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeHighlight, rehypeKatex]}
                components={markdownComponents}
              >
                {post.content}
              </ReactMarkdown>
            </article>
          </div>

          {/* Right column: Table of contents */}
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">{tocNav}</div>
            </aside>
          )}
        </div>

        {toc.length > 0 && <div className="mt-8 lg:hidden">{tocNav}</div>}

        <section className="mt-12 border-t border-border/70 pt-8">
          <p className="poetic-title mb-2">Further Reading</p>
          <h2 className="mb-4 font-heading text-3xl text-foreground">
            {language === "zh" ? "相关文章" : "Related Posts"}
          </h2>
          <div className="space-y-4">
            {relatedPosts.length > 0 ? (
              relatedPosts.map((related) => (
                <Link
                  key={`${related.category}-${related.slug}`}
                  to={`/blog/${related.category}/${related.slug}`}
                  className="glass-card block rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-card/75"
                >
                  <h3 className="font-heading text-2xl text-foreground transition-colors hover:text-primary">
                    {related.title}
                  </h3>
                </Link>
              ))
            ) : (
              <p className="text-muted-foreground">
                {language === "zh" ? "暂无相关文章" : "No related posts"}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
