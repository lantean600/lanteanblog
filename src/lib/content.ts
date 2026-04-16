// 动态导入所有 Markdown 文件
const markdownModules = import.meta.glob("../content/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

export interface Post {
  slug: string;
  category: string;
  title: string;
  date: string;
  tags: string[];
  heroImage: string;
  heroLink: string;
  excerpt: string;
  content: string;
}

// 解析 Markdown 文件和 Front Matter
function parseMarkdownFile(filePath: string, rawContent: string): Post | null {
  try {
    // 从路径中提取分类和 slug
    const match = filePath.match(/\/content\/(\w+)\/([^.]+)\.md$/);
    if (!match) {
      console.warn(`[Content] Failed to match path pattern for: ${filePath}`);
      return null;
    }

    const [, category, slug] = match;

    // 清理可能的 BOM 头
    const cleanContent = rawContent.replace(/^\uFEFF/, "").trim();
    
    // 使用分割法解析 Front Matter，兼容不同的换行符和格式
    const parts = cleanContent.split(/^---\s*$/m);
    if (parts.length < 3) {
      console.warn(`[Content] Failed to parse Front Matter for: ${filePath}`);
      return null;
    }

    const frontMatterStr = parts[1];
    const content = parts.slice(2).join("---");

    // 解析 YAML Front Matter
    const titleMatch = frontMatterStr.match(/title:\s*["']?([^"'\n]+)["']?/);
    const dateMatch = frontMatterStr.match(/date:\s*["']?([^"'\n]+)["']?/);
    const tagsMatch = frontMatterStr.match(/tags:\s*\[([^\]]*)\]/);
    const heroImageMatch = frontMatterStr.match(/heroImage:\s*["']?([^"'\n]+)["']?/);
    const heroLinkMatch = frontMatterStr.match(/heroLink:\s*["']?([^"'\n]+)["']?/);
    const excerptMatch = frontMatterStr.match(/excerpt:\s*["']?([^"'\n]+)["']?/);

    const tags = tagsMatch
      ? tagsMatch[1]
          .split(",")
          .map((t) => t.trim().replace(/["']/g, ""))
          .filter(Boolean)
      : [];

    return {
      slug,
      category,
      title: titleMatch ? titleMatch[1].trim() : "无标题",
      date: dateMatch ? dateMatch[1].trim() : "",
      tags,
      heroImage: heroImageMatch ? heroImageMatch[1].trim() : "/assets/hero1.jpg",
      heroLink: heroLinkMatch ? heroLinkMatch[1].trim() : "",
      excerpt: excerptMatch ? excerptMatch[1].trim() : "",
      content: content.trim(),
    };
  } catch (error) {
    console.error(`[Content] Failed to parse ${filePath}:`, error);
    return null;
  }
}

// 生成文章列表
const posts: Post[] = Object.entries(markdownModules)
  .map(([path, raw]) => {
    if (typeof raw === "string") {
      return parseMarkdownFile(path, raw);
    }
    return null;
  })
  .filter((post): post is Post => post !== null)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const categories = ["research", "technical", "daily", "journal"] as const;

export type Category = (typeof categories)[number];

export function getAllPosts(): Omit<Post, "content">[] {
  return posts.map(({ content, ...meta }) => meta);
}

export function getPostsByCategory(category: string): Omit<Post, "content">[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPostBySlug(slug: string, category: string): Post | null {
  return posts.find((p) => p.slug === slug && p.category === category) || null;
}

export function getPostBySlugAny(slug: string): Post | null {
  return posts.find((p) => p.slug === slug) || null;
}

export function searchPosts(query: string): Omit<Post, "content">[] {
  const lowerQuery = query.toLowerCase();
  return getAllPosts().filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.excerpt.toLowerCase().includes(lowerQuery) ||
      p.tags.some((t) => t.toLowerCase().includes(lowerQuery)),
  );
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

// 导出包含完整内容的文章列表（用于搜索等需要全文的场景）
export { posts as postsWithContent };
