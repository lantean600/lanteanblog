# 博客内容管理系统

## 目录结构

博客文章按照四个板块分类存放：

```
src/content/
├── research/      # 研究类文章
├── technical/     # 技术类文章
├── daily/         # 日常类文章
└── journal/       # 月刊类文章
```

## 如何添加新文章

1. 在对应的分类目录下创建一个新的 Markdown 文件
2. 文件名格式：`YYYY-MM-DD-文章标题.md`（使用英文或拼音）
3. 在文件开头添加 Front Matter 元数据

### Front Matter 格式

```yaml
---
title: "文章标题"
date: "2026-04-14"
category: "research"  # research, technical, daily, journal
tags: ["标签1", "标签2"]
views: 0
heroImage: "/assets/hero1.jpg"  # 可选
heroLink: "https://example.com"  # 可选
excerpt: "文章摘要，将显示在文章列表中"
---
```

### 文章正文

Front Matter 之后就是 Markdown 格式的文章正文：

```markdown
# 引言

这里是文章内容...

## 小节标题

更多内容...
```

## 示例

### 研究类文章

文件路径：`src/content/research/2026-04-10-transformer-architecture.md`

```yaml
---
title: "深入理解 Transformer 架构"
date: "2026-04-10"
category: "research"
tags: ["AI", "Deep Learning", "NLP"]
views: 1234
heroImage: "/assets/hero1.jpg"
heroLink: "https://www.pixiv.net/en/artworks/142350190"
excerpt: "Transformer 模型彻底改变了自然语言处理领域。"
---

# 引言

Transformer 模型自 2017 年提出以来...
```

## 文章链接格式

- 博客列表页：`/blog`
- 分类筛选：`/blog?category=research`
- 文章详情页：`/blog/{category}/{slug}`
  - 例如：`/blog/research/2026-04-10-transformer-architecture`

## 注意事项

1. **不要**在代码中硬编码文章内容
2. 每篇文章的 `slug`（文件名去掉 .md）应该是唯一的
3. `category` 字段应该与文件所在目录一致
4. `excerpt` 字段很重要，它会显示在文章列表中
5. 文章会自动按日期排序，最新的文章显示在前面

## 技术实现

- 使用 `gray-matter` 解析 Markdown 文件的 Front Matter
- 使用 `react-markdown` 和 `remark-gfm` 渲染 Markdown 内容
- 使用 Vite 的 `import.meta.glob` 动态导入 Markdown 文件
- 支持热更新，添加或修改文章后会自动刷新