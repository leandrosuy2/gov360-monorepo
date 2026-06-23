import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";

const root = join(import.meta.dirname, "../..");
const pnpmVersion = "9.15.9";

const requiredPackages = [
  { pkgJson: "apps/api/package.json", name: "@nestjs/common" },
  { pkgJson: "apps/api/package.json", name: "@nestjs/cli/bin/nest.js" },
  { pkgJson: "apps/api/package.json", name: "reflect-metadata" },
  { pkgJson: "apps/api/package.json", name: "tsx" },
  { pkgJson: "apps/web/package.json", name: "next" },
  { pkgJson: "apps/web/package.json", name: "next/dist/bin/next" },
  { pkgJson: "apps/web/package.json", name: "@gov360/typescript-config" },
];

function canResolve(requireFn, name) {
  try {
    requireFn.resolve(name);
    return true;
  } catch {
    try {
      requireFn.resolve(`${name}/package.json`);
      return true;
    } catch {
      return false;
    }
  }
}

export function workspaceDepsInstalled() {
  const pnpmStoreExists = existsSync(join(root, "node_modules/.pnpm"));
  const prismaHoisted = existsSync(join(root, "node_modules/.prisma/client"));
  const prismaRuntimeHoisted = existsSync(join(root, "node_modules/@prisma/client-runtime-utils"));
  const npmrcExists = existsSync(join(root, ".npmrc"));

  if (npmrcExists && pnpmStoreExists && (!prismaHoisted || !prismaRuntimeHoisted)) {
    console.log("[gov360] .npmrc detectado mas runtime do Prisma nao esta hoisted. Forcando pnpm install...");
    return false;
  }

  return requiredPackages.every(({ pkgJson, name }) => {
    const requireFn = createRequire(join(root, pkgJson));
    return canResolve(requireFn, name);
  });
}

function run(command, args) {
  return spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "development",
      CI: "false",
    },
  });
}

function pnpmMissing(result) {
  return result.error?.code === "ENOENT";
}

function installWithPnpm() {
  run("corepack", ["enable"]);

  const installArgs = ["install", "--no-frozen-lockfile", "--prod=false"];

  let result = run("pnpm", installArgs);

  if (pnpmMissing(result) || result.status !== 0) {
    console.log(`[gov360] Tentando pnpm@${pnpmVersion} via npx...`);
    result = run("npx", ["--yes", `pnpm@${pnpmVersion}`, ...installArgs]);
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
    const missing = requiredPackages
      .filter(({ pkgJson, name }) => !canResolve(createRequire(join(root, pkgJson)), name))
      .map(({ name }) => name);

    console.error(
      "[gov360] pnpm install concluiu, mas pacotes do workspace ainda estão ausentes:",
      missing.join(", "),
    );
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
