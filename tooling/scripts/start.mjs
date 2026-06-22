import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";

const root = join(import.meta.dirname, "../..");
const apiDist = join(root, "apps/api/dist/main.js");
const isProd = process.env.NODE_ENV === "production" && existsSync(apiDist);
const webPort = process.env.PORT ?? "3000";

const children = [];

function run(command, args) {
  const child = spawn(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      PORT: webPort,
    },
  });

  child.on("exit", (code, signal) => {
    if (signal) return;
    if (code !== 0 && code !== null) {
      for (const other of children) {
        if (other !== child && !other.killed) other.kill();
      }
      process.exit(code);
    }
  });

  children.push(child);
  return child;
}

function shutdown() {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

if (isProd) {
  run("npm", ["run", "start:prod", "--workspace=@gov360/api"]);
  run("npm", ["run", "start", "--workspace=@gov360/web"]);
} else {
  run("npm", ["run", "dev", "--workspace=@gov360/api"]);
  run("npm", ["run", "dev", "--workspace=@gov360/web"]);
}
