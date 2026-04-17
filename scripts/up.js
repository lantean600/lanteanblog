import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const binDir = path.join(rootDir, "node_modules", ".bin");

const isWindows = process.platform === "win32";
const viteBin = isWindows ? path.join(binDir, "vite.cmd") : path.join(binDir, "vite");
const cmsBin = isWindows ? path.join(binDir, "decap-server.cmd") : path.join(binDir, "decap-server");

function spawnProcess(label, command, args) {
  const spawnCommand = isWindows ? "cmd.exe" : command;
  const spawnArgs = isWindows ? ["/d", "/s", "/c", `"${command}" ${args.join(" ")}`.trim()] : args;

  const child = spawn(spawnCommand, spawnArgs, {
    cwd: rootDir,
    stdio: "inherit",
    shell: false,
    env: {
      ...process.env,
      FORCE_COLOR: process.env.FORCE_COLOR ?? "1",
    },
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      console.log(`[up] ${label} exited via ${signal}.`);
      return;
    }

    if (code && code !== 0) {
      console.error(`[up] ${label} exited with code ${code}.`);
    } else {
      console.log(`[up] ${label} exited cleanly.`);
    }

    shutdown(code ?? 0);
  });

  return child;
}

let cms = null;
let dev = null;
let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  if (cms && !cms.killed) cms.kill("SIGINT");
  if (dev && !dev.killed) dev.kill("SIGINT");

  setTimeout(() => process.exit(code), 300);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log("[up] Starting cms proxy and dev server...");
cms = spawnProcess("cms:proxy", cmsBin, []);
dev = spawnProcess("dev", viteBin, []);