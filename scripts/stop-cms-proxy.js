import { execSync } from "node:child_process";

const PORT = 8091;

function stopOnWindows() {
  const output = execSync(`netstat -ano -p tcp | findstr :${PORT}`, { encoding: "utf8" });
  const lines = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && /LISTENING/i.test(line));

  if (lines.length === 0) {
    console.log(`[cms:stop] No listener found on port ${PORT}.`);
    return;
  }

  const pids = new Set(
    lines
      .map((line) => line.split(/\s+/).at(-1))
      .filter(Boolean),
  );

  for (const pid of pids) {
    execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
    console.log(`[cms:stop] Stopped process PID=${pid} on port ${PORT}.`);
  }
}

function stopOnUnix() {
  try {
    const output = execSync(`lsof -ti tcp:${PORT}`, { encoding: "utf8" }).trim();
    if (!output) {
      console.log(`[cms:stop] No listener found on port ${PORT}.`);
      return;
    }

    const pids = output.split(/\r?\n/).filter(Boolean);
    for (const pid of pids) {
      execSync(`kill -9 ${pid}`);
      console.log(`[cms:stop] Stopped process PID=${pid} on port ${PORT}.`);
    }
  } catch {
    console.log(`[cms:stop] No listener found on port ${PORT}.`);
  }
}

try {
  if (process.platform === "win32") {
    stopOnWindows();
  } else {
    stopOnUnix();
  }
} catch {
  console.log(`[cms:stop] No listener found on port ${PORT}.`);
}
