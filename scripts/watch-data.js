import chokidar from "chokidar";
import { spawn } from "node:child_process";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const contentGlob = path.join(root, "src/content/**/*.md").replaceAll("\\", "/");
const collectionsFile = path.join(root, "src/lib/collections.ts").replaceAll("\\", "/");
const buildScript = path.join(root, "scripts/build-data.js");

let running = false;
let pending = false;
let debounceTimer = null;

function runBuild() {
  if (running) {
    pending = true;
    return;
  }

  running = true;
  pending = false;

  const child = spawn("node", [buildScript], { stdio: "inherit" });
  child.on("exit", (code) => {
    running = false;
    if (code !== 0) {
      process.exitCode = code;
    }
    if (pending) {
      runBuild();
    }
  });
}

function scheduleBuild() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    runBuild();
  }, 150);
}

console.log("Watching content changes...");
runBuild();

const watcher = chokidar.watch([contentGlob, collectionsFile], {
  ignoreInitial: true,
});

watcher.on("add", scheduleBuild);
watcher.on("change", scheduleBuild);
watcher.on("unlink", scheduleBuild);
watcher.on("error", (err) => {
  console.error(err);
});

process.on("SIGINT", async () => {
  await watcher.close();
  process.exit(0);
});
