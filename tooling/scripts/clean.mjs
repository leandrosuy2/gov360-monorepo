import { rm } from "node:fs/promises";
import { join } from "node:path";

const root = join(import.meta.dirname, "../..");

const targets = [
  "node_modules",
  ".turbo",
  "apps/web/.next",
  "apps/api/dist",
];

for (const target of targets) {
  const path = join(root, target);
  try {
    await rm(path, { recursive: true, force: true });
    console.log(`Removido: ${target}`);
  } catch (error) {
    console.warn(`Falha ao remover ${target}:`, error);
  }
}

console.log("Limpeza concluída.");
