import { spawn } from "node:child_process";
import { join } from "node:path";

const root = join(import.meta.dirname, "../..");

const turbo = spawn("pnpm", ["exec", "turbo", "dev", "--parallel"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
});

turbo.on("exit", (code) => {
  process.exit(code ?? 0);
});
