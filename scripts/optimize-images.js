import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const publicImagesDir = path.join(rootDir, "public", "images");
const manifestFile = path.join(rootDir, "src", "data", "image-variants.json");
const maxWidth = 1600;
const webpQuality = 84;

function walkImages(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkImages(filePath, fileList);
      continue;
    }

    if (/\.(jpe?g|png)$/i.test(entry.name)) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

function toPublicUrl(filePath) {
  return "/" + path.relative(path.join(rootDir, "public"), filePath).replace(/\\/g, "/");
}

function toWebpPath(filePath) {
  return filePath.replace(/\.(jpe?g|png)$/i, ".webp");
}

async function optimizeImage(sourcePath) {
  const sourceStat = fs.statSync(sourcePath);
  const outputPath = toWebpPath(sourcePath);

  if (fs.existsSync(outputPath)) {
    const outputStat = fs.statSync(outputPath);
    if (outputStat.mtimeMs >= sourceStat.mtimeMs) {
      return { sourcePath, outputPath, optimized: outputStat.size < sourceStat.size };
    }
  }

  await sharp(sourcePath)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true, fit: "inside" })
    .webp({ quality: webpQuality, effort: 4, smartSubsample: true })
    .toFile(outputPath);

  const outputStat = fs.statSync(outputPath);
  if (outputStat.size >= sourceStat.size * 0.95) {
    fs.unlinkSync(outputPath);
    return { sourcePath, outputPath: null, optimized: false };
  }

  return { sourcePath, outputPath, optimized: true };
}

function removeStaleVariants(sourceFiles) {
  const sourceSet = new Set(sourceFiles.map((filePath) => filePath.toLowerCase()));
  const existingWebpFiles = walkImages(publicImagesDir).filter((filePath) => filePath.toLowerCase().endsWith(".webp"));

  for (const webpFile of existingWebpFiles) {
    const sourceFileJpg = webpFile.replace(/\.webp$/i, ".jpg");
    const sourceFileJpeg = webpFile.replace(/\.webp$/i, ".jpeg");
    const sourceFilePng = webpFile.replace(/\.webp$/i, ".png");

    if (
      sourceSet.has(sourceFileJpg.toLowerCase()) ||
      sourceSet.has(sourceFileJpeg.toLowerCase()) ||
      sourceSet.has(sourceFilePng.toLowerCase())
    ) {
      continue;
    }

    fs.unlinkSync(webpFile);
  }
}

async function main() {
  if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(path.dirname(manifestFile), { recursive: true });
    fs.writeFileSync(manifestFile, "{}\n");
    console.log("[images] No public/images directory found.");
    return;
  }

  const sourceFiles = walkImages(publicImagesDir).filter((filePath) => /\.(jpe?g|png)$/i.test(filePath));
  const manifest = {};
  let optimizedCount = 0;
  let savedBytes = 0;

  for (const sourcePath of sourceFiles) {
    const sourceStat = fs.statSync(sourcePath);
    const result = await optimizeImage(sourcePath);

    if (result.optimized && result.outputPath) {
      const outputStat = fs.statSync(result.outputPath);
      const sourceUrl = toPublicUrl(sourcePath);
      const outputUrl = toPublicUrl(result.outputPath);
      manifest[sourceUrl] = outputUrl;
      optimizedCount += 1;
      savedBytes += Math.max(0, sourceStat.size - outputStat.size);
    }
  }

  removeStaleVariants(sourceFiles);

  fs.mkdirSync(path.dirname(manifestFile), { recursive: true });
  fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);

  const savedMb = (savedBytes / (1024 * 1024)).toFixed(2);
  console.log(`[images] Optimized ${optimizedCount} images, saved ${savedMb} MB.`);
}

main().catch((error) => {
  console.error("[images] Optimization failed:", error);
  process.exit(1);
});
