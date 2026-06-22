import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const root = join(import.meta.dirname, "../..");
const apiDist = join(root, "apps/api/dist/main.js");
const nextBuild = join(root, "apps/web/.next/BUILD_ID");

function runPnpm(args) {
  const env = {
    ...process.env,
    NODE_ENV: "development",
    CI: "false",
  };

  let result = spawnSync("pnpm", args, { cwd: root, stdio: "inherit", env });

  if (result.error?.code === "ENOENT") {
    spawnSync("corepack", ["enable"], { cwd: root, stdio: "inherit" });
    result = spawnSync("pnpm", args, { cwd: root, stdio: "inherit", env });
  }

  if (result.error?.code === "ENOENT") {
    result = spawnSync("npx", ["--yes", "pnpm@9.15.9", ...args], {
      cwd: root,
      stdio: "inherit",
      env,
    });
  }

  return result;
}

if (existsSync(apiDist) && existsSync(nextBuild) && process.env.GOV360_FORCE_BUILD !== "1") {
  console.log("[gov360] Build de produção já presente.");
  process.exit(0);
}

console.log("[gov360] Gerando build de produção...");

const result = runPnpm(["run", "build"]);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

if (!existsSync(apiDist) || !existsSync(nextBuild)) {
  console.error("[gov360] Build concluiu, mas artefatos de produção não foram encontrados.");
  process.exit(1);
}

console.log("[gov360] Build de produção concluído.");
