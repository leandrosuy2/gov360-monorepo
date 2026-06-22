import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const root = join(import.meta.dirname, "../..");
const pnpmVersion = "9.15.9";

function workspaceDepsInstalled() {
  const markers = [
    join(root, "node_modules/@nestjs/common/package.json"),
    join(root, "apps/api/node_modules/@nestjs/common/package.json"),
    join(root, "node_modules/next/package.json"),
    join(root, "apps/web/node_modules/next/package.json"),
  ];

  return markers.some(existsSync);
}

function run(command, args) {
  return spawnSync(command, args, { cwd: root, stdio: "inherit" });
}

function pnpmMissing(result) {
  return result.error?.code === "ENOENT";
}

function installWithPnpm() {
  run("corepack", ["enable"]);

  let result = run("pnpm", ["install", "--frozen-lockfile"]);
  if (result.status !== 0 && !pnpmMissing(result)) {
    result = run("pnpm", ["install"]);
  }

  if (pnpmMissing(result) || result.status !== 0) {
    console.log(`[gov360] Tentando pnpm@${pnpmVersion} via npx...`);
    result = run("npx", ["--yes", `pnpm@${pnpmVersion}`, "install"]);
  }

  return result;
}

if (!workspaceDepsInstalled()) {
  console.log("[gov360] Dependências do monorepo ausentes. Executando pnpm install...");

  const result = installWithPnpm();

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
