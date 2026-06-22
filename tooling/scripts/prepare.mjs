import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { join } from "node:path";

if (process.env.CI === "true" || process.env.HUSKY === "0") {
  process.exit(0);
}

const root = join(import.meta.dirname, "../..");
const require = createRequire(join(root, "package.json"));

try {
  require.resolve("husky/package.json");
} catch {
  process.exit(0);
}

const result = spawnSync("husky", [], { cwd: root, stdio: "inherit" });
process.exit(result.status ?? 0);
