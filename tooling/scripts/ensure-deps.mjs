import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const root = join(import.meta.dirname, "../..");

function workspaceDepsInstalled() {
  const markers = [
    join(root, "node_modules/@nestjs/common/package.json"),
    join(root, "apps/api/node_modules/@nestjs/common/package.json"),
    join(root, "node_modules/next/package.json"),
    join(root, "apps/web/node_modules/next/package.json"),
  ];

  return markers.some(existsSync);
}

if (!workspaceDepsInstalled()) {
  console.log("[gov360] Dependências do monorepo ausentes. Executando npm install...");

  const result = spawnSync(
    "npm",
    ["install", "--include=dev", "--no-audit", "--no-fund"],
    { cwd: root, stdio: "inherit" },
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
