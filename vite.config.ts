import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import { plugin as markdown } from "vite-plugin-markdown";

const adminRedirectPlugin = {
  name: "admin-redirect",
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      if (req.url === "/admin" || req.url === "/admin/") {
        res.statusCode = 302;
        res.setHeader("Location", "/admin/index.html");
        res.end();
        return;
      }
      next();
    });
  },
  configurePreviewServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      if (req.url === "/admin" || req.url === "/admin/") {
        res.statusCode = 302;
        res.setHeader("Location", "/admin/index.html");
        res.end();
        return;
      }
      next();
    });
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    adminRedirectPlugin,
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
    markdown({ mode: ["html", "toc"] }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 处理 Markdown 文件为原始文本
  assetsInclude: ["**/*.md"],
  server: {
    // 已移除 WXZ_WEB_BUILDER_VITE_SERVER 变量
    // Vercel 会自动处理生产环境的服务器配置
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  ssr: {
    noExternal: ["react-helmet-async", "react-router", "react-router-dom"],
  },
});