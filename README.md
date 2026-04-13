# 个人博客项目（Lantean Blog）

一个基于 `React + Vite + TypeScript + Tailwind CSS + Supabase` 的个人博客网站项目，支持博客文章、项目展示、学术经历、教育/工作经历、友链和站点统计等数据模型。

当前仓库已包含前端基础工程与 Supabase 数据库迁移脚本，适合作为个人博客系统的二次开发模板。

## 技术栈

- 前端框架：`React 18` + `TypeScript`
- 构建工具：`Vite 5`
- 样式方案：`Tailwind CSS` + `Radix UI`
- 路由：`react-router-dom`
- 数据服务：`Supabase`
- 代码质量：`Biome` + `TypeScript type-check`

## 功能概览

- 博客数据模型（分类、标签、文章、文章标签关联）
- 个人履历模型（教育经历、工作/实习经历）
- 项目展示模型（项目、学术项目、标签关联）
- 友情链接与博客统计模型
- 数据库自动更新时间触发器（`updated_at`）
- 启用 RLS 并内置示例策略
- 提供一份完整的测试数据初始化 SQL

## 项目结构

```text
lanteanblog-main/
├─ src/
│  ├─ components/
│  │  ├─ generated/      # 页面级生成组件（博客、项目、友链等）
│  │  ├─ common/
│  │  └─ ui/             # 通用 UI 组件
│  ├─ lib/
│  │  └─ supabase.ts     # Supabase 客户端初始化
│  ├─ pages/
│  │  └─ Home.tsx
│  ├─ layout.tsx
│  ├─ routes.tsx
│  └─ main.tsx
├─ supabase/
│  └─ migrations/
│     └─ create_blog_tables.sql  # 建表 + RLS + 测试数据
├─ vite.config.ts
└─ package.json
```

## 环境要求

- `Node.js >= 18`（推荐使用 LTS 版本）
- `pnpm >= 10`（项目声明的包管理器）

## 快速开始

1. 安装依赖

```bash
pnpm install
```

2. 配置环境变量（推荐新建 `.env.local`）

```env
VITE_SUPABASE_URL=你的_supabase_url
VITE_SUPABASE_ANON_KEY=你的_supabase_anon_key
```

> `src/lib/supabase.ts` 会读取以上变量；若缺失会在控制台提示警告。

3. 启动本地开发

```bash
pnpm dev
```

4. 构建与预览

```bash
pnpm build
pnpm preview
```

## 可用脚本

- `pnpm dev`：启动开发服务器
- `pnpm build`：构建生产包
- `pnpm preview`：本地预览生产构建
- `pnpm type-check`：TypeScript 类型检查
- `pnpm lint`：Biome 代码检查

## 数据库初始化（Supabase）

项目提供了迁移脚本：

- `supabase/migrations/create_blog_tables.sql`

你可以在 Supabase SQL Editor 中执行该脚本，它将完成：

- 创建博客相关表结构
- 创建 `updated_at` 自动更新时间触发器
- 启用 RLS 与基础策略
- 插入一批演示数据

## 开发说明

- 路径别名：已配置 `@ -> src`（见 `vite.config.ts`）
- 当前路由入口在 `src/routes.tsx`
- 当前 `Home` 页为占位状态（“应用构建中”），可按业务逐步接入 `components/generated` 下的页面模块

## 部署建议

- 可直接部署到 `Vercel`、`Netlify` 等静态平台
- 部署时在平台环境变量中配置 `VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY`
- 首次部署前，先确保 Supabase 数据表和策略已初始化

## License

如需开源发布，建议补充 `LICENSE` 文件并在此声明许可协议（如 MIT）。
