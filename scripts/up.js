import { spawn } from "node:child_process";

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

function startTask(name, args, fatalOnExit) {
  const child = spawn(npmCmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  child.on("exit", (code) => {
    if (code && code !== 0 && fatalOnExit) {
      console.error(`[up] ${name} exited with code ${code}.`);
      shutdown(code);
      return;
    }

    if (code && code !== 0) {
      console.warn(`[up] ${name} exited with code ${code}, continuing.`);
    }

    if (name === "dev" && !shuttingDown) {
      shutdown(code ?? 0);
    }
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

  setTimeout(() => process.exit(code), 200);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log("[up] Starting cms proxy and dev server...");
cms = startTask("cms:proxy", ["run", "cms:proxy"], false);
dev = startTask("dev", ["run", "dev"], true);
