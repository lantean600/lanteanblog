import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

export function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const category = searchParams.get("category") || "all";

  const categories = [
    { key: "all", label: "全部" },
    { key: "research", label: "研究" },
    { key: "technical", label: "技术" },
    { key: "daily", label: "日常" },
    { key: "journal", label: "月刊" },
  ];

  const posts = [
    {
      id: 1,
      title: "深入理解 Transformer 架构",
      excerpt: "Transformer 模型彻底改变了自然语言处理领域。本文将深入探讨其核心机制，包括自注意力机制、位置编码等关键概念。",
      category: "research",
      tags: ["AI", "Deep Learning", "NLP"],
      date: "2026-04-10",
      views: 1234,
    },
    {
      id: 2,
      title: "React 性能优化最佳实践",
      excerpt: "在大型 React 应用中，性能优化至关重要。本文分享了一系列实用的优化技巧和最佳实践。",
      category: "technical",
      tags: ["React", "JavaScript", "Performance"],
      date: "2026-04-05",
      views: 892,
    },
    {
      id: 3,
      title: "我的 2026 年第一季度总结",
      excerpt: "回顾过去三个月的学习、工作和生活，分享一些感悟和收获。",
      category: "journal",
      tags: ["Life", "Review"],
      date: "2026-04-01",
      views: 567,
    },
    {
      id: 4,
      title: "周末徒步记录",
      excerpt: "上周末去爬了附近的山，记录一下沿途的美景和感受。",
      category: "daily",
      tags: ["Life", "Outdoor"],
      date: "2026-03-28",
      views: 423,
    },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = category === "all" || post.category === category;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (newCategory: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (newCategory === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", newCategory);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              博客文章
            </h1>

            {/* Category Tabs */}
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

            {/* Posts List */}
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="p-6 bg-card border border-border rounded-lg hover:border-foreground/20 hover:bg-muted/30 hover:translate-y-[-2px] transition-all duration-200"
                >
                  <Link to={`/blog/${post.id}`}>
                    <h2 className="text-xl font-bold text-foreground mb-2 hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground font-mono">
                        {post.date}
                      </span>
                      <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                        {categories.find((c) => c.key === post.category)?.label}
                      </span>
                      <div className="flex items-center space-x-1">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground">
                        阅读：{post.views}
                      </span>
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-sm text-primary hover:text-primary/80 font-medium"
                      >
                        阅读更多 →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full md:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Search Box */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索文章..."
                  className="w-full px-4 py-3 pl-10 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>

              {/* Tags Cloud */}
              <div className="p-4 bg-card border border-border rounded-lg">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  热门标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["AI", "React", "JavaScript", "Life", "NLP", "Performance"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 bg-muted text-muted-foreground rounded hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
                      >
                        #{tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
