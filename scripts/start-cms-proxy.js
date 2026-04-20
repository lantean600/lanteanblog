import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number.parseInt(process.env.PORT || "8091", 10);
const host = process.env.BIND_HOST || "127.0.0.1";
const maxImageWidth = 1600;
const webpQuality = 84;
const contentRootPrefix = "src/content/";
const validCategories = new Set(["research", "technical", "daily", "journal"]);

const app = express();
app.use(morgan("combined"));
app.use(cors({ origin: process.env.ORIGIN || "*" }));
app.use(express.json({ limit: "50mb" }));

function normalizePath(filePath) {
  return filePath.replace(/\\/g, "/");
}

function extractFrontmatterCategory(raw) {
  if (typeof raw !== "string") return "";

  const frontmatterMatch = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) return "";

  const categoryMatch = frontmatterMatch[1].match(/^\s*category\s*:\s*["']?([A-Za-z0-9_-]+)["']?\s*$/m);
  return categoryMatch ? categoryMatch[1].toLowerCase() : "";
}

function getMovedCategoryPath(filePath, raw) {
  const normalizedPath = normalizePath(filePath);
  if (!normalizedPath.startsWith(contentRootPrefix) || !normalizedPath.endsWith(".md")) {
    return null;
  }

  const relativePath = normalizedPath.slice(contentRootPrefix.length);
  const pathParts = relativePath.split("/");
  if (pathParts.length < 2) {
    return null;
  }

  const currentCategory = pathParts[0].toLowerCase();
  const targetCategory = extractFrontmatterCategory(raw);

  if (!targetCategory || !validCategories.has(targetCategory) || targetCategory === currentCategory) {
    return null;
  }

  const fileName = pathParts[pathParts.length - 1];
  return normalizePath(path.posix.join(contentRootPrefix, targetCategory, fileName));
}

async function cleanupCategoryDuplicates(targetPath) {
  const normalizedTarget = normalizePath(targetPath);
  if (!normalizedTarget.startsWith(contentRootPrefix) || !normalizedTarget.endsWith(".md")) {
    return;
  }

  const relativePath = normalizedTarget.slice(contentRootPrefix.length);
  const parts = relativePath.split("/");
  if (parts.length < 2) return;

  const targetCategory = parts[0].toLowerCase();
  const fileName = parts[parts.length - 1];

  await Promise.all(
    Array.from(validCategories)
      .filter((category) => category !== targetCategory)
      .map(async (category) => {
        const duplicatePath = normalizePath(path.posix.join(contentRootPrefix, category, fileName));
        await deleteFile(duplicatePath);
      }),
  );
}

function toAbsolute(relativePath) {
  const absolutePath = path.resolve(rootDir, relativePath);
  if (path.relative(rootDir, absolutePath).startsWith("..")) {
    throw new Error("Path traversal blocked");
  }
  return absolutePath;
}

function hashBuffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function isCompressibleImage(filePath) {
  return /\.(jpe?g|png)$/i.test(filePath);
}

function isWebpImage(filePath) {
  return /\.webp$/i.test(filePath);
}

function toWebpPath(filePath) {
  return normalizePath(filePath.replace(/\.(jpe?g|png)$/i, ".webp"));
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function walk(dir, extension, depth) {
  if (depth <= 0) return [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath, extension, depth - 1);
      }
      if (!extension || fullPath.endsWith(extension)) {
        return [fullPath];
      }
      return [];
    }),
  );

  return nested.flat();
}

async function listRepoFiles(folder, extension, depth) {
  const absFolder = toAbsolute(folder);
  const normalizedExt = extension && !extension.startsWith(".") ? `.${extension}` : extension;
  const files = await walk(absFolder, normalizedExt, depth);
  return files.map((filePath) => normalizePath(filePath.slice(rootDir.length + 1)));
}

async function readEntry(filePath, label) {
  const raw = await fs.readFile(toAbsolute(filePath), "utf8");
  return {
    data: raw,
    file: {
      path: normalizePath(filePath),
      label: label || path.basename(filePath),
      id: hashBuffer(Buffer.from(raw)),
    },
  };
}

async function readMediaFile(filePath) {
  const preferredPath = await getPreferredMediaPath(filePath);
  const content = await fs.readFile(toAbsolute(preferredPath));
  return {
    id: hashBuffer(content),
    content: content.toString("base64"),
    encoding: "base64",
    path: normalizePath(preferredPath),
    name: path.basename(preferredPath),
  };
}

async function ensureCompressedMedia(filePath) {
  const normalizedPath = normalizePath(filePath);
  if (!isCompressibleImage(normalizedPath)) {
    return normalizedPath;
  }

  const sourcePath = toAbsolute(normalizedPath);
  const webpPath = toWebpPath(normalizedPath);
  const webpAbsolutePath = toAbsolute(webpPath);

  const sourceExists = await pathExists(sourcePath);
  if (!sourceExists) {
    return normalizedPath;
  }

  const webpExists = await pathExists(webpAbsolutePath);
  if (!webpExists) {
    await ensureDir(webpAbsolutePath);
    await sharp(sourcePath)
      .rotate()
      .resize({ width: maxImageWidth, withoutEnlargement: true, fit: "inside" })
      .webp({ quality: webpQuality, effort: 4, smartSubsample: true })
      .toFile(webpAbsolutePath);
  }

  return webpPath;
}

async function getPreferredMediaPath(filePath) {
  const normalizedPath = normalizePath(filePath);

  if (isWebpImage(normalizedPath)) {
    return normalizedPath;
  }

  if (isCompressibleImage(normalizedPath)) {
    return ensureCompressedMedia(normalizedPath);
  }

  return normalizedPath;
}

async function writeFile(filePath, content) {
  const absolutePath = toAbsolute(filePath);
  await ensureDir(absolutePath);
  await fs.writeFile(absolutePath, content);
}

async function moveFile(oldPath, newPath) {
  const from = toAbsolute(oldPath);
  const to = toAbsolute(newPath);
  await ensureDir(to);
  await fs.rename(from, to);
}

async function deleteFile(filePath) {
  await fs.unlink(toAbsolute(filePath)).catch(() => {});
}

app.get("/api/v1", (_req, res) => {
  res.json({
    repo: path.basename(rootDir),
    publish_modes: ["simple"],
    type: "local_fs",
  });
});

app.post("/api/v1", async (req, res) => {
  try {
    const { action, params } = req.body || {};

    switch (action) {
      case "info":
        res.json({ repo: path.basename(rootDir), publish_modes: ["simple"], type: "local_fs" });
        return;
      case "entriesByFolder": {
        const { folder, extension, depth } = params;
        const files = await listRepoFiles(folder, extension, depth);
        const entries = await Promise.all(files.map((filePath) => readEntry(filePath)));
        res.json(entries);
        return;
      }
      case "entriesByFiles": {
        const files = params.files || [];
        const entries = await Promise.all(files.map(({ path: filePath, label }) => readEntry(filePath, label)));
        res.json(entries);
        return;
      }
      case "getEntry": {
        const [entry] = await Promise.all([readEntry(params.path)]);
        res.json(entry);
        return;
      }
      case "getMedia": {
        const files = await listRepoFiles(params.mediaFolder, "", 1);
        const preferredPaths = new Set();

        for (const filePath of files) {
          const preferredPath = await getPreferredMediaPath(filePath);
          if (isCompressibleImage(filePath)) {
            preferredPaths.add(preferredPath);
            continue;
          }
          if (isWebpImage(filePath)) {
            preferredPaths.add(normalizePath(filePath));
            continue;
          }
          preferredPaths.add(normalizePath(filePath));
        }

        const items = await Promise.all(Array.from(preferredPaths).map((filePath) => readMediaFile(filePath)));
        res.json(items);
        return;
      }
      case "getMediaFile":
        res.json(await readMediaFile(params.path));
        return;
      case "persistEntry": {
        const { entry, dataFiles = [entry], assets = [] } = params;
        await Promise.all(dataFiles.map(({ path: filePath, raw }) => writeFile(filePath, raw)));
        await Promise.all(assets.map(({ path: filePath, content, encoding }) => writeFile(filePath, Buffer.from(content, encoding))));
        await Promise.all(assets.map(async ({ path: filePath }) => {
          if (isCompressibleImage(filePath)) {
            await ensureCompressedMedia(filePath);
          }
        }));
        for (const file of dataFiles) {
          const configuredTargetPath = file.newPath ? normalizePath(file.newPath) : null;
          const autoMovedPath = getMovedCategoryPath(file.path, file.raw);
          const targetPath = autoMovedPath || configuredTargetPath;
          const sourcePath = normalizePath(file.path);

          if (targetPath && sourcePath !== targetPath) {
            const sourceExists = await pathExists(toAbsolute(sourcePath));
            if (sourceExists) {
              await moveFile(sourcePath, targetPath);
            }
            await deleteFile(sourcePath);
          }

          if (autoMovedPath) {
            await cleanupCategoryDuplicates(autoMovedPath);
          }
        }
        res.json({ message: "entry persisted" });
        return;
      }
      case "persistMedia": {
        const { asset } = params;
        await writeFile(asset.path, Buffer.from(asset.content, asset.encoding));
        const preferredPath = await getPreferredMediaPath(asset.path);
        res.json(await readMediaFile(preferredPath));
        return;
      }
      case "deleteFile": {
        await deleteFile(params.path);
        res.json({ message: `deleted file ${params.path}` });
        return;
      }
      case "deleteFiles": {
        await Promise.all((params.paths || []).map((filePath) => deleteFile(filePath)));
        res.json({ message: `deleted files ${(params.paths || []).join(", ")}` });
        return;
      }
      case "getDeployPreview":
        res.json(null);
        return;
      default:
        res.status(422).json({ error: `Unknown action ${action}` });
        return;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[cms] Error handling request: ${message}`);
    res.status(500).json({ error: message });
  }
});

app.listen(port, host, () => {
  console.log(`[cms] Local CMS backend listening on http://${host}:${port}`);
});
