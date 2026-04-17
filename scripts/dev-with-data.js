import { spawn } from "node:child_process";

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

function spawnProc(args) {
  return spawn(npmCmd, args, { stdio: "inherit", shell: process.platform === "win32" });
}

const watcher = spawnProc(["run", "watch-data"]);
const dev = spawnProc(["run", "dev"]);

function shutdown(code = 0) {
  watcher.kill("SIGINT");
  dev.kill("SIGINT");
  process.exit(code);
}

watcher.on("exit", (code) => {
  if (code && code !== 0) shutdown(code);
});

dev.on("exit", (code) => {
  if (code && code !== 0) shutdown(code);
  shutdown(0);
});

process.on("SIGINT", () => shutdown(0));
