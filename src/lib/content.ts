import { CATEGORIES, type Category } from "./constants";
import postsListData from "../data/posts-list.json";

// 异步动态导入所有 Markdown 文件（按需加载正文）
const markdownModules = import.meta.glob("../content/**/*.md", {
  query: "?raw",
  import: "default",
});

export interface PostMeta {
  slug: string;
  category: Category;
  title: string;
  date: string;
  tags: string[];
  heroImage: string;
  heroLink: string;
  excerpt: string;
  collection?: string;
  readMinutes?: number;
  filePath: string;
}

export interface Post extends PostMeta {
  content?: string;
}

// 读取预构建好的文章列表
const postsList: PostMeta[] = postsListData as PostMeta[];

export { CATEGORIES };
export type { Category };

/**
 * 异步获取单篇文章内容
 */
export async function getPostDetail(slug: string, category?: string): Promise<Post | null> {
  const s = slug.trim().toLowerCase();
  let meta = null;

  if (category) {
    const c = category.trim().toLowerCase();
    meta = postsList.find(p => p.slug.toLowerCase() === s && p.category.toLowerCase() === c);
  } else {
    meta = postsList.find(p => p.slug.toLowerCase() === s);
  }

  if (!meta) return null;

  // 匹配并执行异步加载正文
  const loader = markdownModules[meta.filePath];
  if (loader) {
    try {
      const rawContent = (await loader()) as string;
      // 剥离 Front Matter，只返回正文
      let content = rawContent;
      const match = rawContent.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*([\r\n]+([\s\S]*))?$/);
      if (match) {
        content = match[3] || "";
      } else {
        const lines = rawContent.split(/\r?\n/);
        if (lines[0].startsWith('---')) {
          let closingIdx = -1;
          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '---') {
              closingIdx = i;
              break;
            }
          }
          if (closingIdx !== -1) {
            content = lines.slice(closingIdx + 1).join('\n');
          }
        }
      }

      return {
        ...meta,
        content: content.trim(),
      };
    } catch (err) {
      console.error(`Failed to load markdown for ${meta.filePath}`, err);
      return { ...meta, content: "" };
    }
  }

  return { ...meta, content: "" };
}

export function getAllPosts(): PostMeta[] {
  return postsList;
}

export function searchPosts(query: string): PostMeta[] {
  const q = query.toLowerCase();
  return postsList.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.excerpt.toLowerCase().includes(q) || 
    p.tags.some(t => t.toLowerCase().includes(q))
  );
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  postsList.forEach(p => p.tags.forEach(t => tags.add(t)));
  return Array.from(tags).sort();
}

// 导出仅包含元数据的数组，为了兼容原有的 postsWithContent 变量名调用
export { postsList as postsWithContent };