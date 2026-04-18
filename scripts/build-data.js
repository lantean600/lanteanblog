import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, '../src/content');
const outputDir = path.join(__dirname, '../src/data');

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function countWords(str) {
  if (!str) return 0;
  // 匹配中文字符
  const zhMatch = str.match(/[\u4e00-\u9fa5]/g) || [];
  // 匹配英文单词
  const enMatch = str.match(/[a-zA-Z0-9]+/g) || [];
  return zhMatch.length + enMatch.length;
}

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeFrontmatterDate(value) {
  if (!value) return '';

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return formatDateLocal(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return '';

    // Keep explicit YYYY-MM-DD unchanged to avoid timezone shifts.
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }

    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      return formatDateLocal(parsed);
    }

    return trimmed;
  }

  return String(value);
}

function extractSearchSegments(markdown) {
  const segments = [];
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  let inCodeBlock = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) continue;

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      if (text) {
        segments.push({ type: 'heading', level, text });
      }
      continue;
    }

    const bodyText = line
      .replace(/`([^`]*)`/g, '$1')
      .replace(/!\[[^\]]*\]\(([^)]+)\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/^[-*+]\s+/g, '')
      .replace(/^\d+[.)]\s+/g, '')
      .replace(/^>\s?/g, '')
      .replace(/[~*_]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (bodyText) {
      segments.push({ type: 'body', text: bodyText });
    }
  }

  return segments;
}

function buildData() {
  console.log('📦 正在预构建博客数据...');
  
  const allFiles = walkDir(contentDir);
  const postsList = [];
  const searchIndex = [];
  let totalWords = 0;

  for (const filePath of allFiles) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      const pathParts = filePath.split(path.sep);
      const fileName = pathParts.pop();
      const category = pathParts.pop();
      const slug = fileName.replace('.md', '');

      // 从 frontmatter 中读取，没有则提供默认值
      const title = data.title || slug;
      const date = normalizeFrontmatterDate(data.date);
      const tags = Array.isArray(data.tags) ? data.tags : [];
      const excerpt = data.excerpt || title;
      const heroImage = data.heroImage || '/assets/kayuya.jpg';
      const heroLink = data.heroLink || '';
      const collection = data.collection || undefined;

      const wordCount = countWords(content);
      totalWords += wordCount;

      const postMeta = {
        slug,
        category,
        title,
        date,
        tags,
        excerpt,
        heroImage,
        heroLink,
        collection,
        // filePath 用于前端做动态按需加载匹配
        filePath: `../content/${category}/${fileName}`
      };

      postsList.push(postMeta);

      const segments = extractSearchSegments(content);
      const plainText = segments.map((segment) => segment.text).join("\n");

      searchIndex.push({
        slug,
        category,
        title,
        date,
        excerpt,
        tags,
        plainText,
        segments,
      });

    } catch (err) {
      console.error(`❌ 解析文件失败: ${filePath}`, err);
    }
  }

  // 按日期降序排序
  postsList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 计算热力图数据 (过去 52 周，共 364 天)
  const heatmap = [];
  const today = new Date();
  
  // 找准 52 周前的起点（倒推 363 天，使得包含今天共 364 天）
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 363);

  // 初始化一个 364 天的空热力图数组
  for (let i = 0; i < 364; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    heatmap.push({
      date: formatDateLocal(date),
      count: 0,
      level: 0
    });
  }

  let totalContributions = 0;
  // 统计每天的文章数
  for (const post of postsList) {
    if (!post.date) continue;
    // 如果 post.date 是 "2026-04-16"，直接使用即可
    const postDate = post.date;
    const targetCell = heatmap.find(cell => cell.date === postDate);
    if (targetCell) {
      targetCell.count += 1;
      totalContributions++;
    }
  }

  // 根据 count 计算 level (0-4)
  for (const cell of heatmap) {
    if (cell.count === 0) cell.level = 0;
    else if (cell.count === 1) cell.level = 1;
    else if (cell.count === 2) cell.level = 2;
    else if (cell.count === 3) cell.level = 3;
    else cell.level = 4;
  }

  // 生成最后更新日期
  const lastUpdate = postsList.length > 0 ? postsList[0].date : formatDateLocal(new Date());

  // 生成统计数据
  const statistics = {
    totalPosts: postsList.length,
    totalWords,
    lastUpdate,
    heatmap,
    totalContributions
  };

  // 写入 JSON 文件
  fs.writeFileSync(
    path.join(outputDir, 'posts-list.json'),
    JSON.stringify(postsList, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, 'search-index.json'),
    JSON.stringify(searchIndex, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, 'statistics.json'),
    JSON.stringify(statistics, null, 2)
  );

  console.log(`✅ 构建完成! 共 ${postsList.length} 篇文章, 总计 ${totalWords} 字。`);
}

buildData();