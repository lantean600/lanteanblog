// 自动生成的文章数据
// 请勿手动修改此文件，由 scripts/compile-content.js 生成

export interface Post {
  slug: string;
  category: string;
  title: string;
  date: string;
  tags: string[];
  views: number;
  heroImage: string;
  heroLink: string;
  excerpt: string;
  content: string;
}

export const posts: Post[] = [
  {
    "slug": "2026-04-10-transformer-architecture",
    "category": "research",
    "title": "深入理解 Transformer 架构",
    "date": "2026-04-10",
    "tags": [
      "AI",
      "Deep Learning",
      "NLP"
    ],
    "views": 0,
    "heroImage": "/assets/hero1.jpg",
    "heroLink": "https://www.pixiv.net/en/artworks/142350190",
    "excerpt": "Transformer 模型彻底改变了自然语言处理领域。本文将深入探讨其核心机制，包括自注意力机制、位置编码等关键概念。",
    "content": "\r\n# 引言\r\n\r\nTransformer 模型自 2017 年提出以来，彻底改变了自然语言处理领域。本文将深入探讨其核心机制。\r\n\r\n## 自注意力机制\r\n\r\n自注意力机制是 Transformer 的核心创新。它允许模型在处理序列时，关注输入的不同部分。\r\n\r\n### 计算过程\r\n\r\n1. 计算 Query、Key、Value 矩阵\r\n2. 计算注意力分数\r\n3. 应用 Softmax 归一化\r\n4. 加权求和得到输出\r\n\r\n## 位置编码\r\n\r\n由于 Transformer 没有递归结构，需要显式地注入位置信息。\r\n\r\n## 总结\r\n\r\nTransformer 的成功在于其并行化能力和强大的长距离依赖建模能力。"
  },
  {
    "slug": "2026-04-05-react-performance",
    "category": "technical",
    "title": "React 性能优化最佳实践",
    "date": "2026-04-05",
    "tags": [
      "React",
      "JavaScript",
      "Performance"
    ],
    "views": 0,
    "heroImage": "/assets/hero1.jpg",
    "heroLink": "https://www.pixiv.net/en/artworks/142350190",
    "excerpt": "在大型 React 应用中，性能优化至关重要。本文分享了一系列实用的优化技巧和最佳实践。",
    "content": "\r\n# React 性能优化\r\n\r\n## 1. 减少不必要渲染\r\n\r\n- 使用 `React.memo` 包裹纯展示组件\r\n- 合理拆分组件，避免大组件全量重渲染\r\n- 使用稳定的 `key`，避免列表抖动\r\n\r\n## 2. 缓存计算和回调\r\n\r\n- 用 `useMemo` 缓存高开销计算\r\n- 用 `useCallback` 稳定函数引用\r\n\r\n## 3. 代码分割\r\n\r\n- 用路由级懒加载降低首屏体积\r\n- 按页面拆包，提升首屏加载速度"
  },
  {
    "slug": "2026-03-28-weekend-hiking",
    "category": "daily",
    "title": "周末徒步记录",
    "date": "2026-03-28",
    "tags": [
      "Life",
      "Outdoor"
    ],
    "views": 0,
    "heroImage": "/assets/hero1.jpg",
    "heroLink": "https://www.pixiv.net/en/artworks/142350190",
    "excerpt": "上周末去爬了附近的山，记录一下沿途的美景和感受。",
    "content": "\r\n# 周末徒步\r\n\r\n## 路线\r\n\r\n本次路线全程约 12 公里，爬升约 700 米，整体难度中等。\r\n\r\n## 风景\r\n\r\n山脊视野开阔，途中有一段林间小道，适合拍照和短暂停留。\r\n\r\n## 感受\r\n\r\n徒步是很好的重启方式。离开屏幕一整天后，回到工作状态会更专注。"
  },
  {
    "slug": "2026-04-14-pytorch-note",
    "category": "daily",
    "title": "《Pytorch实用教程》笔记（一）数据模块",
    "date": "2026-04-14",
    "tags": [
      "pytorch"
    ],
    "views": 0,
    "heroImage": "/assets/hero1.jpg",
    "heroLink": "https://www.pixiv.net/en/artworks/142350190",
    "excerpt": "文章摘要",
    "content": "\n\n## 数据处理流程\n\n[[COVID19图像分类－数据处理流程图.canvas]]\n(安卓端无法导出为矢量图 之后会优化这个画布引用)\n## Dataset\n这个模块的学习主要还是读代码。我之前主要精读了一个函数代码，笔记如下：\n```python\ndef get_img_info(self):\n\t# 功能：读取硬盘数据，并建立数据标签，将二者组成元组存在列表中\n\tfor root, dirs, files in os.walk(root_dir):\n\t\t# os: operation system\n\t\t# walk(): 接受一个文件夹路径（root），返回一个生成器(root, dirs, files)\n\t\tfor file in files:\n\t\t\tif file.endwith('jpeg') or file.endwith('png'):\n\t\t\t\t# 取文件路径\n\t\t\t\tpath_img = os.path.join(root, file) # path.join(): 路径拼贴\n\t\t\t\t# 取子目录\n\t\t\t\tsub_dir = os.path.basename(root) # basename(): 取末级路径\n\t\t\t\t# 子目录转为整数标签\n\t\t\t\tlable_int = self.str_2_int[sub_dir] # str_2_int: 在__init_-定义的字典\n\t\t\t\t# 保存为元组列表\n\t\t\t\tself.info_img.append(path_img, label_int)\n```\n## DataLoader\n"
  },
  {
    "slug": "2026-04-01-q1-summary",
    "category": "journal",
    "title": "我的 2026 年第一季度总结",
    "date": "2026-04-01",
    "tags": [
      "Life",
      "Review"
    ],
    "views": 0,
    "heroImage": "/assets/hero1.jpg",
    "heroLink": "https://www.pixiv.net/en/artworks/142350190",
    "excerpt": "回顾过去三个月的学习、工作和生活，分享一些感悟和收获。",
    "content": "\r\n# 2026 Q1 总结\r\n\r\n## 工作进展\r\n\r\n本季度完成了博客系统核心模块与多语言切换重构，提升了整体可维护性。\r\n\r\n## 学习收获\r\n\r\n重点深入了前端工程化与 AI 应用落地实践，对性能优化和用户体验有了更系统理解。\r\n\r\n## 生活记录\r\n\r\n保持阅读与运动，整体节奏更稳定，也更注重复盘与长期规划。"
  }
];

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
