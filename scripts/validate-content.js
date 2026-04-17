import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, "../src/content");
const publicDir = path.join(__dirname, "../public");

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath, fileList);
    } else if (file.endsWith(".md")) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function toPosixPath(p) {
  return p.replace(/\\/g, "/");
}

function checkLocalImagePath(imagePath, sourceFile, errors, warnings) {
  if (!imagePath) return;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return;

  if (imagePath.startsWith("/public/images/")) {
    errors.push(`${sourceFile}: heroImage uses legacy path '${imagePath}'. Use '/images/...'.`);
    return;
  }

  if (!imagePath.startsWith("/images/")) {
    errors.push(`${sourceFile}: heroImage '${imagePath}' must start with '/images/'.`);
    return;
  }

  const target = path.join(publicDir, imagePath.replace(/^\//, ""));
  if (!fs.existsSync(target)) {
    errors.push(`${sourceFile}: heroImage file not found at '${toPosixPath(target)}'.`);
    return;
  }

  const sizeBytes = fs.statSync(target).size;
  const sizeMb = sizeBytes / (1024 * 1024);
  if (sizeMb > 2) {
    warnings.push(`${sourceFile}: heroImage '${imagePath}' is ${sizeMb.toFixed(2)}MB (recommend <= 2MB).`);
  }
}

function validate() {
  console.log("[validate] Checking markdown content...");

  const allFiles = walkDir(contentDir);
  const errors = [];
  const warnings = [];

  for (const filePath of allFiles) {
    const relativeFile = toPosixPath(path.relative(path.join(__dirname, ".."), filePath));
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);

    const heroImage = typeof data.heroImage === "string" ? data.heroImage.trim() : "";
    checkLocalImagePath(heroImage, relativeFile, errors, warnings);
  }

  if (warnings.length > 0) {
    console.warn("[warn] Content warnings:");
    for (const warning of warnings) {
      console.warn(`  - ${warning}`);
    }
  }

  if (errors.length > 0) {
    console.error("[error] Content validation failed:");
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log("[ok] Content validation passed.");
}

validate();
