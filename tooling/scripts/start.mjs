import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const root = join(import.meta.dirname, "../..");
const require = createRequire(join(root, "package.json"));

const apiDir = join(root, "apps/api");
const webDir = join(root, "apps/web");
const apiDist = join(apiDir, "dist/main.js");
const isProd = process.env.NODE_ENV === "production" && existsSync(apiDist);
const webPort = process.env.PORT ?? "3000";

const children = [];

function resolvePackageBin(packageName, binKey) {
  const pkgJsonPath = require.resolve(`${packageName}/package.json`);
  const pkg = require(pkgJsonPath);
  const bin = pkg.bin;

  if (!bin) {
    throw new Error(`Pacote "${packageName}" não expõe binário.`);
  }

  const relative =
    typeof bin === "string" ? bin : bin[binKey ?? Object.keys(bin)[0]];

  return join(dirname(pkgJsonPath), relative);
}

function run(label, command, args, cwd) {
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

function runLocalOrNpx(label, packageName, binKey, localArgs, npxPackage, npxArgs, cwd) {
  try {
    const bin = resolvePackageBin(packageName, binKey);
    run(label, process.execPath, [bin, ...localArgs], cwd);
  } catch {
    run(label, "npx", ["--yes", npxPackage, ...npxArgs], cwd);
  }
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
  runLocalOrNpx("web", "next", "next", ["start", "-p", webPort], "next@15", ["start", "-p", webPort], webDir);
} else {
  runLocalOrNpx("api", "tsx", "tsx", ["watch", "src/main.ts"], "tsx@4", ["watch", "src/main.ts"], apiDir);
  runLocalOrNpx("web", "next", "next", ["dev"], "next@15", ["dev"], webDir);
}
