#!/usr/bin/env node
// Obsidian Bridge — sync brain/ ↔ Obsidian vault
// Usage: node obsidian-bridge.js --watch <brain> --vault <vault>

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
function getArg(name) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
}

const brainDir = getArg("watch") || getArg("brain") || "my-business-brain/brain";
const vaultDir = getArg("vault");

if (!vaultDir) {
  console.error("Usage: node obsidian-bridge.js --watch <brain> --vault <vault>");
  process.exit(1);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  console.log(`synced: ${path.relative(process.cwd(), src)} -> ${path.relative(process.cwd(), dest)}`);
}

function syncTree(srcRoot, destRoot) {
  const entries = fs.readdirSync(srcRoot, { withFileTypes: true });
  for (const entry of entries) {
    const src = path.join(srcRoot, entry.name);
    const dest = path.join(destRoot, entry.name);
    if (entry.isDirectory()) {
      syncTree(src, dest);
    } else {
      copyFile(src, dest);
    }
  }
}

// initial sync
ensureDir(vaultDir);
syncTree(brainDir, vaultDir);
console.log(`Initial sync complete: ${brainDir} -> ${vaultDir}`);

// watch for changes
fs.watch(brainDir, { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  const src = path.join(brainDir, filename);
  const dest = path.join(vaultDir, filename);
  if (eventType === "rename" && fs.existsSync(src)) {
    copyFile(src, dest);
  }
});

console.log(`Watching ${brainDir} for changes... (Ctrl+C to stop)`);
