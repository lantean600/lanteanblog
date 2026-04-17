import net from "node:net";
import { spawn } from "node:child_process";

const PORT = 8091;
const HOST = "127.0.0.1";

function isPortOpen(port, host) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;

    const finalize = (value) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(value);
    };

    socket.setTimeout(1200);
    socket.once("connect", () => finalize(true));
    socket.once("timeout", () => finalize(false));
    socket.once("error", () => finalize(false));

    socket.connect(port, host);
  });
}

async function main() {
  const occupied = await isPortOpen(PORT, HOST);

  if (occupied) {
    console.log(`[cms:proxy] Port ${PORT} is already in use. Assuming Decap proxy is running.`);
    console.log(`[cms:proxy] If this is not Decap proxy, free the port and run again.`);
    process.exit(0);
  }

  console.log(`[cms:proxy] Starting Decap proxy on port ${PORT}...`);
  const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
  const child = spawn(cmd, ["decap-server"], {
    stdio: "inherit",
    env: { ...process.env, PORT: String(PORT) },
    shell: process.platform === "win32",
  });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

main().catch((err) => {
  console.error("[cms:proxy] Failed to start:", err);
  process.exit(1);
});
