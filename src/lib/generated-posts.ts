// 自动生成的文章数据
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
    "collections": [],
    "views": 0,
    "heroImage": "/assets/hero1.jpg",
    "heroLink": "https://www.pixiv.net/en/artworks/142350190",
    "excerpt": "Transformer 模型彻底改变了自然语言处理领域。本文将深入探讨其核心机制，包括自注意力机制、位置编码等关键概念。",
    "draft": false,
    "content": "\n# 引言\n\nTransformer 模型自 2017 年提出以来，彻底改变了自然语言处理领域。本文将深入探讨其核心机制。\n\n## 自注意力机制\n\n自注意力机制是 Transformer 的核心创新。它允许模型在处理序列时，关注输入的不同部分。\n\n### 计算过程\n\n1. 计算 Query、Key、Value 矩阵\n2. 计算注意力分数\n3. 应用 Softmax 归一化\n4. 加权求和得到输出\n\n## 位置编码\n\n由于 Transformer 没有递归结构，需要显式地注入位置信息。\n\n## 总结\n\nTransformer 的成功在于其并行化能力和强大的长距离依赖建模能力。"
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
    "collections": [],
    "views": 0,
    "heroImage": "/assets/hero1.jpg",
    "heroLink": "https://www.pixiv.net/en/artworks/142350190",
    "excerpt": "在大型 React 应用中，性能优化至关重要。本文分享了一系列实用的优化技巧和最佳实践。",
    "draft": false,
    "content": "\n# React 性能优化\n\n## 1. 减少不必要渲染\n\n- 使用 `React.memo` 包裹纯展示组件\n- 合理拆分组件，避免大组件全量重渲染\n- 使用稳定的 `key`，避免列表抖动\n\n## 2. 缓存计算和回调\n\n- 用 `useMemo` 缓存高开销计算\n- 用 `useCallback` 稳定函数引用\n\n## 3. 代码分割\n\n- 用路由级懒加载降低首屏体积\n- 按页面拆包，提升首屏加载速度"
  },
  {
    "slug": "2025-10-18-experience-post",
    "category": "daily",
    "title": "写论文的一些经验帖",
    "date": "2025-10-18",
    "tags": [
      "paper"
    ],
    "collections": [],
    "views": 0,
    "heroImage": "/assets/hero1.jpg",
    "heroLink": "https://www.pixiv.net/en/artworks/142350190",
    "excerpt": "一些汇总。",
    "draft": false,
    "content": "\n[我是如何从头开始写一篇顶级论文的 - 重剑无锋的文章 - 知乎](https://zhuanlan.zhihu.com/p/538681254)\n\n[我是如何在本科期间发表顶会论文的？（内含开源代码和数据集） - Thoughts Memo的文章 - 知乎](https://zhuanlan.zhihu.com/p/543325359)\n\n\n> [!1 计算机科研经验]\n> 清华计算机入学教育之“关于如何做科研的一些个人经验” - ZHANG Mingxing的文章 - 知乎\n> https://zhuanlan.zhihu.com/p/718156903\n\n写作 输出 棋盘法\n读论文 写论文 八股文\n\n\n> [!NOTE] 2 物理学科研经验\n> 你想对物理学专业的人说些什么? - 苇草的回答 - 知乎\n> https://www.zhihu.com/question/1022588196/answer/1901151731125032333\n\n赶快去读论文！\n\n\n> [!NOTE] 3 太理-港中文校友\n> 在太原理工大学就读是怎样一番体验？ - Henry TIAN的回答 - 知乎\n> https://www.zhihu.com/question/24423090/answer/2471708803\n\n多去层次比自己高的老师和人去碰壁，利用好仅有的资源收益最大。\n\n\n> [!NOTE] 4 CS高校内卷恶劣\n>官媒下场手撕张雪峰，张雪峰的结局会是什么？ - 纳米酱的回答 - 知乎\n>https://www.zhihu.com/question/638740157/answer/1915799428444451029\n\n到底转哪个专业？仔细考虑一下，结合科研\n\n> [!5 留学东大物理系]\n> 2024年东京大学理学系物理学专攻  大学院一般入试  个人向备考心得 - 千叶絮语的文章 - 知乎\n> https://zhuanlan.zhihu.com/p/720661430\n\n> [!6 双非保研北大理论物理]\n> 高考对未来的人生选择还有多大影响？ - 拉格朗日的忧郁的回答 - 知乎\n> https://www.zhihu.com/question/1905630080295723647/answer/1911748623093462004\n\n\n\n> [!NOTE] 港大-哥本哈根\n> 写在高三之后 - 姜尧耕(渔樵耕牍)的文章 - 知乎\n> https://zhuanlan.zhihu.com/p/703161684\n\n活出自己\n\n> [!NOTE] 科研干货\n> 博士生每日科研很累，累到几乎没力气，怎么办？ - 李乾元的回答 - 知乎\n> https://www.zhihu.com/question/621912340/answer/1901458932209264354\n\n> [!NOTE] 大学榜样\n> 一个阶段的落幕和迷茫 - 东川路第一伊蕾娜的文章 - 知乎\n> https://zhuanlan.zhihu.com/p/8647906358\n\n> [!pdf提取文本工具]\n> 【工具分享】PDF、图片、公式——阻碍我们知识数字化的敌人终于倒下了，吗？ - Thoughts Memo的文章 - 知乎\n> https://zhuanlan.zhihu.com/p/16167738894\n\n"
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
    "collections": [],
    "views": 0,
    "heroImage": "/assets/hero1.jpg",
    "heroLink": "https://www.pixiv.net/en/artworks/142350190",
    "excerpt": "上周末去爬了附近的山，记录一下沿途的美景和感受。",
    "draft": false,
    "content": "\n# 周末徒步\n\n## 路线\n\n本次路线全程约 12 公里，爬升约 700 米，整体难度中等。\n\n## 风景\n\n山脊视野开阔，途中有一段林间小道，适合拍照和短暂停留。\n\n## 感受\n\n徒步是很好的重启方式。离开屏幕一整天后，回到工作状态会更专注。"
  },
  {
    "slug": "2026-04-14-pytorch-note",
    "category": "daily",
    "title": "《Pytorch实用教程》笔记（一）数据模块",
    "date": "2026-04-14",
    "tags": [
      "pytorch"
    ],
    "collections": [],
    "views": 0,
    "heroImage": "/assets/hero1.jpg",
    "heroLink": "https://www.pixiv.net/en/artworks/142350190",
    "excerpt": "文章摘要",
    "draft": false,
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
    "collections": [],
    "views": 0,
    "heroImage": "/assets/hero1.jpg",
    "heroLink": "https://www.pixiv.net/en/artworks/142350190",
    "excerpt": "回顾过去三个月的学习、工作和生活，分享一些感悟和收获。",
    "draft": false,
    "content": "\n# 2026 Q1 总结\n\n## 工作进展\n\n本季度完成了博客系统核心模块与多语言切换重构，提升了整体可维护性。\n\n## 学习收获\n\n重点深入了前端工程化与 AI 应用落地实践，对性能优化和用户体验有了更系统理解。\n\n## 生活记录\n\n保持阅读与运动，整体节奏更稳定，也更注重复盘与长期规划。"
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
