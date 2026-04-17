import { execSync } from "node:child_process";

function stopOnWindows() {
  let output = "";
  try {
    output = execSync(
      "powershell -NoProfile -Command \"Get-CimInstance Win32_Process | Where-Object { $_.Name -match 'node' -and $_.CommandLine -match 'vite' } | Select-Object -ExpandProperty ProcessId\"",
      { encoding: "utf8" },
    ).trim();
  } catch {
    output = "";
  }

  if (!output) {
    console.log("[dev:stop] No Vite process found.");
    return;
  }

  const pids = output.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
      console.log(`[dev:stop] Stopped Vite process PID=${pid}.`);
    } catch {
      // Ignore stale PID race.
    }
  }
}

function stopOnUnix() {
  try {
    const output = execSync("pgrep -f vite", { encoding: "utf8" }).trim();
    if (!output) {
      console.log("[dev:stop] No Vite process found.");
      return;
    }

    const pids = output.split(/\r?\n/).filter(Boolean);
    for (const pid of pids) {
      try {
        execSync(`kill -9 ${pid}`);
        console.log(`[dev:stop] Stopped Vite process PID=${pid}.`);
      } catch {
        // Ignore stale PID race.
      }
    }
  } catch {
    console.log("[dev:stop] No Vite process found.");
  }
}

if (process.platform === "win32") {
  stopOnWindows();
} else {
  stopOnUnix();
}
