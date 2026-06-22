import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { join } from "node:path";

const root = join(import.meta.dirname, "../..");
const require = createRequire(join(root, "package.json"));

try {
  require.resolve("prisma/package.json");
} catch {
  console.warn("[gov360] prisma não instalado; pulando prisma generate.");
  process.exit(0);
}

const result = spawnSync("pnpm", ["exec", "prisma", "generate"], {
  cwd: root,
  stdio: "inherit",
});

if (result.error?.code === "ENOENT") {
  const fallback = spawnSync("npx", ["prisma", "generate"], {
    cwd: root,
    stdio: "inherit",
  });
  process.exit(fallback.status ?? 0);
}

process.exit(result.status ?? 0);
