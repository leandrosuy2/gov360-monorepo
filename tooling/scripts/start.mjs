import { existsSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { join } from "node:path";

const root = join(import.meta.dirname, "../..");
const apiDir = join(root, "apps/api");
const webDir = join(root, "apps/web");
const apiDist = join(apiDir, "dist/main.js");
const isProd = process.env.NODE_ENV === "production" && existsSync(apiDist);
const webPort = process.env.PORT ?? "3000";

const children = [];

function resolvePnpmCommand() {
  const candidates = [
    ["pnpm", []],
    ["corepack", ["pnpm"]],
    ["npx", ["--yes", "pnpm@9.15.9"]],
  ];

  for (const [command, prefix] of candidates) {
    const probe = spawnSync(command, [...prefix, "--version"], {
      cwd: root,
      stdio: "ignore",
    });

    if (!probe.error && probe.status === 0) {
      return { command, prefix };
    }
  }

  return null;
}

const pnpm = resolvePnpmCommand();

function run(label, command, args, cwd = root) {
  const child = spawn(command, args, {
    cwd,
    stdio: "inherit",
    shell: false,
    env: {
      ...process.env,
      PORT: webPort,
    },
  });

  child.on("exit", (code, signal) => {
    if (signal) return;
    if (code !== 0 && code !== null) {
      console.error(`[${label}] encerrou com código ${code}`);
      for (const other of children) {
        if (other !== child && !other.killed) other.kill();
      }
      process.exit(code);
    }
  });

  children.push(child);
  return child;
}

function runPnpm(label, pnpmArgs) {
  if (!pnpm) {
    console.error("[gov360] pnpm não encontrado. Execute `node tooling/scripts/ensure-deps.mjs` antes.");
    process.exit(1);
  }

  run(label, pnpm.command, [...pnpm.prefix, ...pnpmArgs], root);
}

function shutdown() {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

if (isProd) {
  run("api", process.execPath, [apiDist], apiDir);
  runPnpm("web", ["--dir", "apps/web", "exec", "next", "start", "-p", webPort]);
} else {
  runPnpm("api", ["--dir", "apps/api", "exec", "tsx", "watch", "src/main.ts"]);
  runPnpm("web", ["--dir", "apps/web", "exec", "next", "dev"]);
}
