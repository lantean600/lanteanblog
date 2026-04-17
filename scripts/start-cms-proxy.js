import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number.parseInt(process.env.PORT || "8091", 10);
const host = process.env.BIND_HOST || "127.0.0.1";

const app = express();
app.use(morgan("combined"));
app.use(cors({ origin: process.env.ORIGIN || "*" }));
app.use(express.json({ limit: "50mb" }));

function normalizePath(filePath) {
  return filePath.replace(/\\/g, "/");
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
  const content = await fs.readFile(toAbsolute(filePath));
  return {
    id: hashBuffer(content),
    content: content.toString("base64"),
    encoding: "base64",
    path: normalizePath(filePath),
    name: path.basename(filePath),
  };
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
        const items = await Promise.all(files.map((filePath) => readMediaFile(filePath)));
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
        for (const file of dataFiles) {
          if (file.newPath) {
            await moveFile(file.path, file.newPath);
          }
        }
        res.json({ message: "entry persisted" });
        return;
      }
      case "persistMedia": {
        const { asset } = params;
        await writeFile(asset.path, Buffer.from(asset.content, asset.encoding));
        res.json(await readMediaFile(asset.path));
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
