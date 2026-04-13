import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/context/LanguageContext";
import hero1 from "@/assets/hero1.jpg";

export function BlogDetail() {
  const { language } = useLanguage();
  const { id } = useParams();

  const posts = [
    {
      id: 1,
      title: "深入理解 Transformer 架构",
      date: "2026-04-10",
      category: "research",
      tags: ["AI", "Deep Learning", "NLP"],
      views: 1234,
      heroImage: hero1,
      heroLink: "https://www.pixiv.net/en/artworks/142350190",
      content: `
# 引言

Transformer 模型自 2017 年提出以来，彻底改变了自然语言处理领域。本文将深入探讨其核心机制。

## 自注意力机制

自注意力机制是 Transformer 的核心创新。它允许模型在处理序列时，关注输入的不同部分。

### 计算过程

1. 计算 Query、Key、Value 矩阵
2. 计算注意力分数
3. 应用 Softmax 归一化
4. 加权求和得到输出

## 位置编码

由于 Transformer 没有递归结构，需要显式地注入位置信息。

## 总结

Transformer 的成功在于其并行化能力和强大的长距离依赖建模能力。
      `,
    },
    {
      id: 2,
      title: "React 性能优化最佳实践",
      date: "2026-04-05",
      category: "technical",
      tags: ["React", "JavaScript", "Performance"],
      views: 892,
      heroImage: hero1,
      heroLink: "https://www.pixiv.net/en/artworks/142350190",
      content: `
# React 性能优化

## 1. 减少不必要渲染

- 使用 \`React.memo\` 包裹纯展示组件
- 合理拆分组件，避免大组件全量重渲染
- 使用稳定的 \`key\`，避免列表抖动

## 2. 缓存计算和回调

- 用 \`useMemo\` 缓存高开销计算
- 用 \`useCallback\` 稳定函数引用

## 3. 代码分割

- 用路由级懒加载降低首屏体积
- 按页面拆包，提升首屏加载速度
      `,
    },
    {
      id: 3,
      title: "我的 2026 年第一季度总结",
      date: "2026-04-01",
      category: "journal",
      tags: ["Life", "Review"],
      views: 567,
      heroImage: hero1,
      heroLink: "https://www.pixiv.net/en/artworks/142350190",
      content: `
# 2026 Q1 总结

## 工作进展

本季度完成了博客系统核心模块与多语言切换重构，提升了整体可维护性。

## 学习收获

重点深入了前端工程化与 AI 应用落地实践，对性能优化和用户体验有了更系统理解。

## 生活记录

保持阅读与运动，整体节奏更稳定，也更注重复盘与长期规划。
      `,
    },
    {
      id: 4,
      title: "周末徒步记录",
      date: "2026-03-28",
      category: "daily",
      tags: ["Life", "Outdoor"],
      views: 423,
      heroImage: hero1,
      heroLink: "https://www.pixiv.net/en/artworks/142350190",
      content: `
# 周末徒步

## 路线

本次路线全程约 12 公里，爬升约 700 米，整体难度中等。

## 风景

山脊视野开阔，途中有一段林间小道，适合拍照和短暂停留。

## 感受

徒步是很好的重启方式。离开屏幕一整天后，回到工作状态会更专注。
      `,
    },
  ];
  const postId = Number(id);
  const post = posts.find((item) => item.id === postId);
  const relatedPosts = posts.filter((item) => item.id !== postId).slice(0, 2);

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

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>{language === "zh" ? "返回博客列表" : "Back to Blog List"}</span>
        </Link>

        <a
          href={post.heroLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block mb-8 overflow-hidden rounded-2xl shadow-lg bg-card transition-shadow duration-300 hover:shadow-xl"
        >
          <img
            src={post.heroImage}
            alt={`${post.title} hero`}
            className="block w-full aspect-[16/9] object-cover rounded-2xl transition-[filter] duration-300 group-hover:brightness-95"
            loading="lazy"
          />
          <span className="absolute right-4 bottom-4 px-3 py-1.5 text-xs font-medium text-white bg-black/50 rounded-md backdrop-blur-sm opacity-90 group-hover:opacity-100 transition-all duration-300">
            Hero Image
          </span>
        </a>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {post.title}
          </h1>
          <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground">
            <span>{language === "zh" ? `发布于：${post.date}` : `Published: ${post.date}`}</span>
            <span>{language === "zh" ? `分类：${post.category}` : `Category: ${post.category}`}</span>
            <span>{language === "zh" ? `阅读量：${post.views}` : `Views: ${post.views}`}</span>
            <div className="flex items-center gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Related Posts */}
        <section className="mt-12 pt-8 border-t border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">
            {language === "zh" ? "相关文章" : "Related Posts"}
          </h2>
          <div className="space-y-4">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                to={`/blog/${related.id}`}
                className="block p-4 bg-card border border-border rounded-lg hover:border-foreground/20 hover:bg-muted/30 transition-all duration-200"
              >
                <h3 className="font-medium text-foreground hover:text-primary transition-colors">
                  {related.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
