import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 从 constants.ts 中读取分类
const constantsPath = path.join(__dirname, '../src/lib/constants.ts');
const constantsContent = fs.readFileSync(constantsPath, 'utf8');
const categoriesMatch = constantsContent.match(/export const CATEGORIES = \[(.*?)\]/s);
const categories = categoriesMatch 
  ? categoriesMatch[1].split(',').map(s => s.trim().replace(/["']/g, '')).filter(Boolean)
  : ['research', 'technical', 'daily', 'journal'];

const contentDir = path.join(__dirname, '../src/content');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createPost() {
  console.log('🚀 开始创建新文章...\n');

  let title = await question('文章标题: ');
  if (!title) {
    console.log('❌ 标题不能为空');
    process.exit(1);
  }

  console.log('\n选择分类:');
  categories.forEach((cat, i) => console.log(`${i + 1}. ${cat}`));
  let catIndex = await question('选择编号 (默认 1): ');
  let category = categories[parseInt(catIndex) - 1] || categories[0];

  let tagsInput = await question('\n标签 (用逗号分隔): ');
  let tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];

  // 获取现有集合
  const collectionsPath = path.join(__dirname, '../src/lib/collections.ts');
  const collectionsContent = fs.readFileSync(collectionsPath, 'utf8');
  const metadataMatch = collectionsContent.match(/const COLLECTION_METADATA: Record<string,.*?> = {(.*?)};/s);
  let existingCollections = [];
  if (metadataMatch) {
    const regex = /"([^"]+)"\s*:/g;
    let m;
    while ((m = regex.exec(metadataMatch[1])) !== null) {
      existingCollections.push(m[1]);
    }
  }

  console.log('\n选择所属集合 (可选):');
  console.log('0. 无集合');
  existingCollections.forEach((col, i) => console.log(`${i + 1}. ${col}`));
  let colChoice = await question('输入编号或直接输入新集合 ID: ');
  
  let collection = '';
  if (colChoice === '0' || colChoice === '') {
    collection = '';
  } else if (parseInt(colChoice) > 0 && parseInt(colChoice) <= existingCollections.length) {
    collection = existingCollections[parseInt(colChoice) - 1];
  } else {
    collection = colChoice.trim();
  }

  let excerpt = await question('\n文章摘要: ');

  const date = new Date().toISOString().split('T')[0];
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  const fileName = `${date}-${slug}.md`;
  const filePath = path.join(contentDir, category, fileName);

  const content = `---
title: "${title}"
date: "${date}"
category: "${category}"
tags: ${JSON.stringify(tags)}
${collection ? `collection: "${collection}"` : ''}
views: 0
heroImage: "/assets/kayuya.jpg"
excerpt: "${excerpt || title}"
---

# ${title}

在此开始写作...
`;

  if (!fs.existsSync(path.join(contentDir, category))) {
    fs.mkdirSync(path.join(contentDir, category), { recursive: true });
  }

  fs.writeFileSync(filePath, content);
  console.log(`\n✅ 成功创建文章: ${filePath}`);
  rl.close();
}

createPost().catch(err => {
  console.error('❌ 创建失败:', err);
  process.exit(1);
});
