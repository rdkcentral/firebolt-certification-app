import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const dist = 'dist';

// --- helpers ---
function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    entry.isDirectory()
      ? copyRecursive(srcPath, destPath)
      : fs.copyFileSync(srcPath, destPath);
  }
}

// --- clean dist ---
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist);

// --- build JS ---
await build({
  entryPoints: ['src/index.js'],
  outfile: 'dist/index.js',
  bundle: false,
  format: 'esm'
});

// --- copy static assets ---
copyRecursive('src', dist);
copyRecursive('vendor', path.join(dist, 'vendor'));

console.log('✅ Build complete');