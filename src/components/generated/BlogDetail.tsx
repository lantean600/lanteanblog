import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function BlogDetail() {

  const post = {
    id: 1,
    title: "深入理解 Transformer 架构",
    date: "2026-04-10",
    category: "research",
    tags: ["AI", "Deep Learning", "NLP"],
    views: 1234,
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
  };

  const relatedPosts = [
    {
      id: 2,
      title: "BERT 模型详解",
    },
    {
      id: 3,
      title: "注意力机制综述",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>返回博客列表</span>
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {post.title}
          </h1>
          <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground">
            <span>发布于：{post.date}</span>
            <span>分类：{post.category}</span>
            <span>阅读量：{post.views}</span>
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
            相关文章
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
