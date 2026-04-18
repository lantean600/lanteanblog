# 博客自动更新功能实现说明

## ✅ 已实现的功能

现在，当您在 `src/content/` 目录下添加、修改或删除 Markdown 文件时，网站会**自动更新**，无需手动运行任何脚本。

## 🔧 技术实现

### 核心改动

1. **使用 Vite 的 `import.meta.glob` 动态导入**
   - 文件位置：`src/lib/content.ts`
   - 自动扫描 `src/content/**/*.md` 下的所有 Markdown 文件
   - 支持热模块替换（HMR）

2. **内置 Front Matter 解析器**
   - 不再依赖外部编译脚本
   - 实时解析 YAML Front Matter
   - 自动提取文章元数据

3. **移除手动编译步骤**
   - 之前的 `scripts/compile-content.js` 脚本不再需要
   - `src/lib/generated-posts.ts` 文件已废弃

## 📝 使用方法

### 🚀 快速创建新文章 (推荐)

现在可以使用脚手架工具快速生成文章模板：
```bash
npm run new-post
```
按照提示输入标题、选择分类和添加标签，脚本会自动在正确目录下创建带有完整 Front Matter 的 Markdown 文件。

### ✍️ 手动添加新文章

1. 在对应的分类目录下创建 Markdown 文件：
   ```
   src/content/research/2026-04-16-my-article.md
   src/content/technical/2026-04-16-my-article.md
   src/content/daily/2026-04-16-my-article.md
   src/content/journal/2026-04-16-my-article.md
   ```

2. 添加 Front Matter (详见 `src/lib/constants.ts` 中的分类定义)：
   ```yaml
   ---
   title: "文章标题"
   date: "2026-04-16"
   category: "research"
   tags: ["标签1", "标签2"]
   views: 0
   heroImage: "/assets/kayuya.jpg"
   excerpt: "文章摘要"
   ---
   
   # 文章内容
   
   这里是正文...
   ```

3. **保存文件后，浏览器会自动刷新显示新文章！** ✨

### 📤 一键推送更新

完成写作后，可以使用以下命令一键提交并推送至 GitHub：
```bash
npm run push
```

### 🛠️ 项目结构调整

- `src/lib/constants.ts`: 统一管理分类 (CATEGORIES) 和标签显示。
- `scripts/new-post.js`: 交互式文章创建脚本。
- `src/lib/content.ts`: 优化了 Markdown 解析逻辑，更加健壮。
- 移除了旧的 `scripts/compile-content.js`。

### 🎯 优势对比

### 之前（手动编译）
❌ 添加文章后需要运行 `node scripts/compile-content.js`  
❌ 每次修改都要重新编译  
❌ 容易忘记编译导致内容不同步  

### 现在（自动更新）
✅ 添加/修改/删除文件后自动更新  
✅ 支持 Vite HMR，开发体验极佳  
✅ 无需额外命令或脚本  
✅ 代码更简洁，维护更容易  

## 🧪 测试验证

已创建测试文章：`src/content/daily/2026-04-16-test-auto-update.md`

您可以：
1. 访问 http://localhost:5174/blog
2. 选择"日常"分类
3. 应该能看到"测试自动更新功能"这篇文章

## 📚 API 参考

`src/lib/content.ts` 导出的函数：

- `getAllPosts()` - 获取所有文章（不含正文）
- `getPostsByCategory(category)` - 按分类获取文章
- `getPostBySlug(slug, category)` - 根据 slug 和分类获取文章
- `getPostBySlugAny(slug)` - 根据 slug 获取文章（任意分类）
- `searchPosts(query)` - 搜索文章
- `getAllTags()` - 获取所有标签
- `postsWithContent` - 包含完整内容的文章数组（用于全文搜索）

## ⚠️ 注意事项

1. **文件名格式**：建议使用 `YYYY-MM-DD-标题.md` 格式
2. **Front Matter 必需**：每篇文章必须包含完整的 Front Matter
3. **分类一致性**：`category` 字段应与文件所在目录一致
4. **唯一性**：每个 slug（文件名）应该是唯一的

## 🚀 下一步

您现在可以：
1. 删除测试文章 `2026-04-16-test-auto-update.md`
2. 开始创作您的博客文章
3. 享受自动更新的便捷体验！
