import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { ensureDeps } from "./ensure-deps.mjs";

const root = join(import.meta.dirname, "../..");
const require = createRequire(join(root, "package.json"));

try {
  require.resolve("prisma/package.json");

  const result = spawnSync("pnpm", ["exec", "prisma", "generate"], {
    cwd: root,
    stdio: "inherit",
  });

  if (result.error?.code === "ENOENT") {
    spawnSync("npx", ["prisma", "generate"], {
      cwd: root,
      stdio: "inherit",
    });
  }
} catch {
  console.warn("[gov360] prisma não instalado; pulando prisma generate.");
}

process.exit(ensureDeps());
