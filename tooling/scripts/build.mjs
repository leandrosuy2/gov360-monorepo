import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { join, relative } from "node:path";
import { platform } from "node:os";

const root = join(import.meta.dirname, "../..");
const apiDist = join(root, "apps/api/dist/main.js");
const nextBuild = join(root, "apps/web/.next/BUILD_ID");
const stampFile = join(root, ".gov360-build-stamp");
const corepackHome = join(root, ".cache/corepack");

const fingerprintRoots = [
  "apps/api/src",
  "apps/web/src",
  "packages",
  "prisma",
  "tooling/scripts",
];

const fingerprintFiles = [
  ".npmrc",
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "turbo.json",
  "prisma.config.ts",
  "apps/api/package.json",
  "apps/web/package.json",
  "apps/api/tsconfig.json",
  "apps/web/tsconfig.json",
  "apps/web/next.config.js",
  "apps/web/next.config.mjs",
];

const ignoredDirs = new Set([
  ".git",
  ".next",
  "dist",
  "node_modules",
  ".turbo",
  ".cache",
]);

const isWindows = platform() === "win32";
const pnpmCommand = isWindows ? "pnpm.cmd" : "pnpm";
const npxCommand = isWindows ? "npx.cmd" : "npx";
const corepackCommand = isWindows ? "corepack.cmd" : "corepack";

function runPnpm(args) {
  const env = {
    ...process.env,
    NODE_ENV: "development",
    CI: "false",
    COREPACK_HOME: process.env.COREPACK_HOME ?? corepackHome,
  };

  let result = spawnSync(pnpmCommand, args, { cwd: root, stdio: "inherit", env, shell: isWindows });

  if (result.error?.code === "ENOENT") {
    spawnSync(corepackCommand, ["enable"], { cwd: root, stdio: "inherit", env, shell: isWindows });
    result = spawnSync(pnpmCommand, args, { cwd: root, stdio: "inherit", env, shell: isWindows });
  }

  if (result.error?.code === "ENOENT") {
    result = spawnSync(npxCommand, ["--yes", "pnpm@9.15.9", ...args], {
      cwd: root,
      stdio: "inherit",
      env,
      shell: isWindows,
    });
  }

  return result;
}

function addFileToHash(hash, filePath) {
  if (!existsSync(filePath)) return;
  const stat = statSync(filePath);
  if (!stat.isFile()) return;
  hash.update(relative(root, filePath));
  hash.update(String(stat.size));
  hash.update(readFileSync(filePath));
}

function addDirectoryToHash(hash, dirPath) {
  if (!existsSync(dirPath)) return;
  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const entryPath = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      addDirectoryToHash(hash, entryPath);
      continue;
    }
    if (entry.isFile()) addFileToHash(hash, entryPath);
  }
}

function currentFingerprint() {
  const hash = createHash("sha256");

  for (const file of fingerprintFiles) {
    addFileToHash(hash, join(root, file));
  }

  for (const dir of fingerprintRoots) {
    addDirectoryToHash(hash, join(root, dir));
  }

  return hash.digest("hex");
}

function previousFingerprint() {
  if (!existsSync(stampFile)) return "";
  return readFileSync(stampFile, "utf8").trim();
}

const fingerprint = currentFingerprint();
const buildPresent = existsSync(apiDist) && existsSync(nextBuild);
const buildFresh = buildPresent && previousFingerprint() === fingerprint;

if (buildFresh && process.env.GOV360_FORCE_BUILD !== "1") {
  console.log("[gov360] Build de produção já presente e atualizado.");
  process.exit(0);
}

console.log(buildPresent ? "[gov360] Código alterado. Regenerando build de produção..." : "[gov360] Gerando build de produção...");

const generate = runPnpm(["exec", "prisma", "generate"]);
if (generate.status !== 0) {
  process.exit(generate.status ?? 1);
}

const result = runPnpm(["exec", "turbo", "build", "--force"]);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

if (!existsSync(apiDist) || !existsSync(nextBuild)) {
  console.error("[gov360] Build concluiu, mas artefatos de produção não foram encontrados.");
  process.exit(1);
}

writeFileSync(stampFile, `${fingerprint}\n`, "utf8");

console.log("[gov360] Build de produção concluído.");
