import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { join } from "node:path";

const root = join(import.meta.dirname, "../..");
const appDir = join(root, "apps/api");
const requireFromApi = createRequire(join(appDir, "package.json"));
const nestBin = requireFromApi.resolve("@nestjs/cli/bin/nest.js");

const result = spawnSync(process.execPath, [nestBin, ...process.argv.slice(2)], {
  cwd: appDir,
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
