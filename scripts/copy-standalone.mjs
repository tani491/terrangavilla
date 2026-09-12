/**
 * Copie les assets statiques dans le build standalone (multiplateforme).
 * Remplace `cp -r` qui n'existe pas sous Windows.
 * - .next/static       -> .next/standalone/.next/static
 * - public             -> .next/standalone/public
 * N'échoue jamais le build : si standalone est absent, on sort silencieusement.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const standaloneDir = path.join(root, ".next", "standalone");

if (!fs.existsSync(standaloneDir)) {
  console.log("[copy-standalone] .next/standalone absent — rien à copier.");
  process.exit(0);
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`[copy-standalone] ${path.relative(root, src)} absent — ignoré.`);
    return;
  }
  fs.cpSync(src, dest, { recursive: true, force: true });
  console.log(
    `[copy-standalone] ${path.relative(root, src)} -> ${path.relative(root, dest)}`
  );
}

copyDir(path.join(root, ".next", "static"), path.join(standaloneDir, ".next", "static"));
copyDir(path.join(root, "public"), path.join(standaloneDir, "public"));

console.log("[copy-standalone] Terminé.");
