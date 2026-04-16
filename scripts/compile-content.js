import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, '../src/content');
const outputFile = path.join(__dirname, '../src/lib/generated-posts.ts');

function processMarkdownFile(filePath, category, slug) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data, content: markdownContent } = matter(content);
  
  return {
    slug,
    category,
    title: data.title || '无标题',
    date: data.date || '',
    tags: data.tags || [],
    collections: data.collections || [],
    views: data.views || 0,
    heroImage: data.heroImage || '/assets/hero1.jpg',
    heroLink: data.heroLink || '',
    excerpt: data.excerpt || '',
    draft: data.draft || false,
    content: markdownContent,
  };
}

function scanContentDirectory() {
  const posts = [];
  const categories = ['research', 'technical', 'daily', 'journal'];
  
  for (const category of categories) {
    const categoryDir = path.join(contentDir, category);
    if (!fs.existsSync(categoryDir)) continue;
    
    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const slug = file.replace('.md', '');
      const filePath = path.join(categoryDir, file);
      const post = processMarkdownFile(filePath, category, slug);
      if (post.draft) continue;
      posts.push(post);
    }
  }
  
  return posts;
}

function generateTypeScriptFile(posts) {
  let content = `// 自动生成的文章数据
// 请勿手动修改此文件，由 scripts/compile-content.js 生成

export interface Post {
  slug: string;
  category: string;
  title: string;
  date: string;
  tags: string[];
  collections: string[];
  views: number;
  heroImage: string;
  heroLink: string;
  excerpt: string;
  draft: boolean;
  content: string;
}

export const posts: Post[] = ${JSON.stringify(posts, null, 2)};

export function getAllPosts(): Omit<Post, "content">[] {
  return posts.map(({ content, ...meta }) => meta);
}

export function getPostsByCategory(category: string): Omit<Post, "content">[] {
  return getAllPosts().filter(p => p.category === category);
}

export function getPostBySlug(slug: string, category: string): Post | null {
  return posts.find(p => p.slug === slug && p.category === category) || null;
}

export function getPostBySlugAny(slug: string): Post | null {
  return posts.find(p => p.slug === slug) || null;
}

export function searchPosts(query: string): Omit<Post, "content">[] {
  const lowerQuery = query.toLowerCase();
  return getAllPosts().filter(p => 
    p.title.toLowerCase().includes(lowerQuery) ||
    p.excerpt.toLowerCase().includes(lowerQuery) ||
    p.tags.some(t => t.toLowerCase().includes(lowerQuery))
  );
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  posts.forEach(p => p.tags.forEach(t => tagSet.add(t)));
  return Array.from(tagSet).sort();
}
`;
  
  fs.writeFileSync(outputFile, content);
  console.log(`成功生成 ${posts.length} 篇文章数据到 ${outputFile}`);
}

try {
  const posts = scanContentDirectory();
  generateTypeScriptFile(posts);
} catch (error) {
  console.error('编译内容失败:', error);
  process.exit(1);
}
