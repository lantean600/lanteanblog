import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import { plugin as markdown } from "vite-plugin-markdown";

import { cloudflare } from "@cloudflare/vite-plugin";

const rootDir = __dirname;
const contentDir = path.resolve(rootDir, "./src/content");
const imagesDir = path.resolve(rootDir, "./public/images");
const collectionsFile = path.resolve(rootDir, "./src/lib/collections.ts");
const dataDir = path.resolve(rootDir, "./src/data");

function needsFullReload(file: string) {
  const normalized = file.replace(/\\/g, "/");
  return [contentDir, imagesDir, collectionsFile, dataDir].some((base) =>
    normalized.startsWith(base.replace(/\\/g, "/")),
  );
}

const adminAndAssetPlugin = {
  name: "admin-and-asset-reload",
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

    server.watcher.add([contentDir, imagesDir, collectionsFile, dataDir]);
    server.watcher.on("add", (file: string) => {
      if (needsFullReload(file)) server.ws.send({ type: "full-reload", path: file });
    });
    server.watcher.on("change", (file: string) => {
      if (needsFullReload(file)) server.ws.send({ type: "full-reload", path: file });
    });
    server.watcher.on("unlink", (file: string) => {
      if (needsFullReload(file)) server.ws.send({ type: "full-reload", path: file });
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
  plugins: [adminAndAssetPlugin, react(), svgr({
    svgrOptions: {
      icon: true,
      exportType: "named",
      namedExport: "ReactComponent",
    },
  }), markdown({ mode: ["html", "toc"] }), cloudflare()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 处理 Markdown 文件为原始文本
  assetsInclude: ["**/*.md"],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api/v1": {
        target: "http://127.0.0.1:8091",
        changeOrigin: true,
      },
    },
    // 已移除 WXZ_WEB_BUILDER_VITE_SERVER 变量
    // Vercel 会自动处理生产环境的服务器配置
  },
  preview: {
    port: 4173,
    strictPort: true,
    proxy: {
      "/api/v1": {
        target: "http://127.0.0.1:8091",
        changeOrigin: true,
      },
    },
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