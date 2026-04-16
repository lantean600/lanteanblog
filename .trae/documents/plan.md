# 修复博客文章不显示问题的计划

## 1. 当前状态分析
根据对代码库的探索，项目中博客文章的 Markdown 文件（如 `2026-04-16-deep-learning-intro.md` 等）依然完好地存放在 `src/content/` 目录下，并没有真正丢失。
目前项目使用了 Vite 的 `import.meta.glob` 动态导入这些文件，并在 `src/lib/content.ts` 中通过**正则表达式**来解析 Front Matter 和文章内容。

文章“消失”的原因大概率是以下两个潜在的兼容性问题导致文章在解析时被静默过滤掉了：
1. **正则表达式解析脆弱**：`src/lib/content.ts` 中的正则 `^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$` 对文件格式要求极为严格。如果用户在 Windows 下编辑了文件（产生了 `\r\n` 换行符）、文件头部包含了 BOM 字符，或者 `---` 之后没有紧跟换行符，正则就会匹配失败，导致 `parseMarkdownFile` 返回 `null`，文章在列表中就会消失。
2. **Vite 配置冲突**：`vite.config.ts` 中配置了 `assetsInclude: ["**/*.md"]`。在某些 Vite 版本和系统环境下，这会导致 `import.meta.glob` 即使加了 `?raw` 后缀，也可能无法正确返回纯文本内容，从而导致内容解析失败。

## 2. 修复方案 (Proposed Changes)

### 步骤 1：使用 `gray-matter` 替换脆弱的正则解析
- **文件**：`src/lib/content.ts`
- **修改内容**：
  - 引入项目中已经安装的 `gray-matter` 库 (`import matter from "gray-matter"`).
  - 重写 `parseMarkdownFile` 方法，使用 `matter(rawContent)` 来稳健地解析 Front Matter 和 Markdown 正文，彻底解决由于换行符、BOM 或空格导致的解析失败问题。
  - 确保默认值（如标题、日期、分类等）在解析缺失时能正确回退，防止应用崩溃。

### 步骤 2：修复 Vite 静态资源配置冲突
- **文件**：`vite.config.ts`
- **修改内容**：
  - 移除或注释掉 `assetsInclude: ["**/*.md"]`。因为当前架构使用的是 `import.meta.glob(..., { query: "?raw" })` 将其作为字符串加载，不需要也不应该将其作为静态资产(Asset)处理。

### 步骤 3：增强文章列表的容错和提示
- **文件**：`src/components/generated/BlogList.tsx`
- **修改内容**：
  - 检查并在控制台输出加载失败或解析出错的日志，方便后续排查。

## 3. 假设与决策
- **假设**：`package.json` 中已经包含了 `"gray-matter": "^4.0.3"`，因此直接引入不会增加额外依赖负担。
- **决策**：废弃纯正则解析方案，转而使用社区标准的 `gray-matter` 处理 Markdown 元数据，这不仅能解决当前文章不显示的问题，还能提高后续添加新文章的容错率。

## 4. 验证步骤
1. 应用上述修改。
2. 运行 `npm run dev` 启动开发服务器。
3. 访问 `/blog` 页面，确认文章列表能够正常渲染出来，并且所有 7 篇测试/现有文章均显示正常。
4. 验证首页 (HomePage) 的文章统计数据是否正确恢复。