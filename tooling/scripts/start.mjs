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

  if (!relative) {
    throw new Error(`Binário "${binKey}" não encontrado em "${packageName}".`);
  }

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

function shutdown() {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

try {
  if (isProd) {
    run("api", process.execPath, [apiDist], apiDir);
    const nextBin = resolvePackageBin("next", "next");
    run("web", process.execPath, [nextBin, "start", "-p", webPort], webDir);
  } else {
    const nestBin = resolvePackageBin("@nestjs/cli", "nest");
    const nextBin = resolvePackageBin("next", "next");
    run("api", process.execPath, [nestBin, "start", "--watch"], apiDir);
    run("web", process.execPath, [nextBin, "dev"], webDir);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  console.error("Execute `npm install` na raiz do projeto antes de `npm start`.");
  process.exit(1);
}
