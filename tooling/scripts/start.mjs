import { config as dotenvConfig } from "dotenv";
import { join } from "node:path";
import { existsSync } from "node:fs";

const root = join(import.meta.dirname, "../..");

dotenvConfig({ path: join(root, ".env") });
const apiDir = join(root, "apps/api");
const apiDist = join(apiDir, "dist/main.js");
const nextBuild = join(root, "apps/web/.next/BUILD_ID");
const webPort = process.env.PORT ?? "3000";
const apiPort = process.env.API_PORT ?? "3001";

const children = [];

if (!existsSync(apiDist) || !existsSync(nextBuild)) {
  console.error("[gov360] Build ausente. Execute `node tooling/scripts/build.mjs` antes do start.");
  process.exit(1);
}

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
      NODE_ENV: "production",
      PORT: webPort,
      API_PORT: apiPort,
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
    console.error("[gov360] pnpm não encontrado.");
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

run("api", process.execPath, [apiDist], apiDir);
runPnpm("web", ["--dir", "apps/web", "exec", "next", "start", "-H", "0.0.0.0", "-p", webPort]);
