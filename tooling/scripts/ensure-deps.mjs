import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = join(import.meta.dirname, "../..");
const require = createRequire(join(root, "package.json"));
const pnpmVersion = "9.15.9";

const requiredPackages = [
  "@gov360/typescript-config",
  "@nestjs/common",
  "reflect-metadata",
];

function hasPackage(name) {
  try {
    require.resolve(`${name}/package.json`);
    return true;
  } catch {
    return false;
  }
}

export function workspaceDepsInstalled() {
  return requiredPackages.every(hasPackage);
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

export function ensureDeps() {
  if (workspaceDepsInstalled()) {
    return 0;
  }

  if (process.env.GOV360_INSTALLING === "1") {
    return 0;
  }

  console.log("[gov360] Dependências do monorepo ausentes. Executando pnpm install...");

  process.env.GOV360_INSTALLING = "1";
  const result = installWithPnpm();
  delete process.env.GOV360_INSTALLING;

  if (result.status !== 0) {
    return result.status ?? 1;
  }

  if (!workspaceDepsInstalled()) {
    console.error("[gov360] pnpm install concluiu, mas pacotes do workspace ainda estão ausentes.");
    return 1;
  }

  return 0;
}

const isDirectRun =
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectRun) {
  process.exit(ensureDeps());
}
