import { existsSync, readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";

const root = join(import.meta.dirname, "../..");
const apiDir = join(root, "apps/api");
const webDir = join(root, "apps/web");
const apiDist = join(apiDir, "dist/main.js");
const nextBuild = join(webDir, ".next/BUILD_ID");
const nextRunner = join(root, "tooling/scripts/run-next.mjs");

loadDotEnv(join(root, ".env"));

const webPort = process.env.PORT ?? "3000";
const apiPort = process.env.API_PORT ?? "3001";
const children = [];
let exiting = false;

if (!existsSync(apiDist) || !existsSync(nextBuild)) {
  console.error("[gov360] Build ausente. Execute `node tooling/scripts/build.mjs` antes do start.");
  process.exit(1);
}

const missingEnv = ["DATABASE_URL", "JWT_SECRET"].filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`[gov360] Variáveis de ambiente obrigatórias ausentes: ${missingEnv.join(", ")}`);
  console.error("[gov360] Configure essas variáveis no ambiente do deploy ou forneça um arquivo .env na raiz do projeto.");
  process.exit(1);
}

const api = run("api", process.execPath, [apiDist], apiDir);

setTimeout(() => {
  if (!exiting && api.exitCode === null && !api.killed) {
    run("web", process.execPath, [nextRunner, "start", "-H", "0.0.0.0", "-p", webPort], webDir);
  }
}, 1200);

process.on("SIGTERM", () => {
  shutdown();
  process.exit(143);
});

process.on("SIGINT", () => {
  shutdown();
  process.exit(130);
});

function run(label, command, args, cwd) {
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
    if (exiting || signal) return;
    if (code !== 0 && code !== null) {
      console.error(`[${label}] encerrou com código ${code}`);
      shutdown(child);
      setTimeout(() => process.exit(code), 300);
    }
  });

  children.push(child);
  return child;
}

function shutdown(except) {
  exiting = true;
  for (const child of children) {
    if (child !== except && !child.killed) child.kill();
  }
}

function loadDotEnv(filePath) {
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}
