import { spawn } from "node:child_process";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const nodeBin = process.execPath;
const viteEntry = path.join(rootDir, "node_modules", "vite", "bin", "vite.js");
const cmsScript = path.join(rootDir, "scripts", "start-cms-proxy.js");
const watchScript = path.join(rootDir, "scripts", "watch-data.js");
const requiredPorts = [5173, 8091];

function getListeningPidsWindows(port) {
  try {
    const output = execSync(`netstat -ano -p tcp | findstr LISTENING | findstr :${port}`, {
      encoding: "utf8",
    });

    return output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.split(/\s+/).at(-1))
      .filter((pid) => pid && /^\d+$/.test(pid));
  } catch {
    return [];
  }
}

function getListeningPidsUnix(port) {
  try {
    const output = execSync(`lsof -ti tcp:${port} -sTCP:LISTEN`, { encoding: "utf8" }).trim();
    if (!output) return [];
    return output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function processNameByPidWindows(pid) {
  try {
    const output = execSync(
      `powershell -NoProfile -Command "(Get-Process -Id ${pid} -ErrorAction SilentlyContinue).ProcessName"`,
      { encoding: "utf8" },
    ).trim();
    return output.toLowerCase();
  } catch {
    return "";
  }
}

function processNameByPidUnix(pid) {
  try {
    const output = execSync(`ps -p ${pid} -o comm=`, { encoding: "utf8" }).trim();
    return output.toLowerCase();
  } catch {
    return "";
  }
}

function killPid(pid) {
  if (process.platform === "win32") {
    execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
    return;
  }
  execSync(`kill -9 ${pid}`, { stdio: "ignore" });
}

function ensureRequiredPortsAvailable() {
  for (const port of requiredPorts) {
    const pids = process.platform === "win32" ? getListeningPidsWindows(port) : getListeningPidsUnix(port);
    if (pids.length === 0) continue;

    for (const pid of pids) {
      const procName =
        process.platform === "win32" ? processNameByPidWindows(pid) : processNameByPidUnix(pid);

      if (procName.includes("node")) {
        try {
          killPid(pid);
          console.log(`[dev] Released stale node listener pid=${pid} on port ${port}.`);
        } catch {
          throw new Error(`Failed to release node process pid=${pid} on port ${port}.`);
        }
      } else {
        throw new Error(`Port ${port} is occupied by non-node process '${procName || "unknown"}' (pid=${pid}).`);
      }
    }
  }
}

const childSpecs = {
  "watch-data": {
    scriptPath: watchScript,
    extraEnv: {},
  },
  "cms:proxy": {
    scriptPath: cmsScript,
    extraEnv: { PORT: "8091" },
  },
  dev: {
    scriptPath: viteEntry,
    extraEnv: {},
  },
};

const children = {
  "watch-data": null,
  "cms:proxy": null,
  dev: null,
};

const restartHistory = {
  "watch-data": [],
  "cms:proxy": [],
  dev: [],
};

const MAX_RESTARTS = 3;
const RESTART_WINDOW_MS = 60_000;
const RESTART_DELAY_MS = 800;

let shuttingDown = false;

function shouldRestart(label) {
  const now = Date.now();
  const recent = restartHistory[label].filter((ts) => now - ts < RESTART_WINDOW_MS);
  if (recent.length >= MAX_RESTARTS) {
    restartHistory[label] = recent;
    return false;
  }
  recent.push(now);
  restartHistory[label] = recent;
  return true;
}

function spawnNode(label) {
  const { scriptPath, extraEnv } = childSpecs[label];
  const child = spawn(nodeBin, [scriptPath], {
    cwd: rootDir,
    stdio: "inherit",
    shell: false,
    env: {
      ...process.env,
      ...extraEnv,
      FORCE_COLOR: process.env.FORCE_COLOR ?? "1",
    },
  });

  children[label] = child;

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;

    if (signal) {
      console.log(`[dev] ${label} exited via ${signal}.`);
      if (shouldRestart(label)) {
        console.log(`[dev] Restarting ${label}...`);
        setTimeout(() => spawnNode(label), RESTART_DELAY_MS);
      } else {
        shutdown(1);
      }
      return;
    }

    const exitCode = code ?? 0;
    if (exitCode !== 0) {
      console.error(`[dev] ${label} exited with code ${exitCode}.`);
    } else {
      console.log(`[dev] ${label} exited cleanly.`);
    }

    if (shouldRestart(label)) {
      console.log(`[dev] Restarting ${label}...`);
      setTimeout(() => spawnNode(label), RESTART_DELAY_MS);
    } else {
      console.error(`[dev] ${label} exceeded restart limit.`);
      shutdown(exitCode || 1);
    }
  });

  return child;
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of Object.values(children)) {
    if (child && !child.killed) {
      child.kill("SIGINT");
    }
  }

  setTimeout(() => process.exit(code), 300);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log("[dev] Starting content watcher, CMS backend, and Vite...");
try {
  ensureRequiredPortsAvailable();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[dev] ${message}`);
  process.exit(1);
}

spawnNode("watch-data");
spawnNode("cms:proxy");
spawnNode("dev");
