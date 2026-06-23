import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { join } from "node:path";

const root = join(import.meta.dirname, "../..");
const appDir = join(root, "apps/web");
const requireFromWeb = createRequire(join(appDir, "package.json"));
const nextBin = requireFromWeb.resolve("next/dist/bin/next");

const result = spawnSync(process.execPath, [nextBin, ...process.argv.slice(2)], {
  cwd: appDir,
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
