import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

await mkdir(dist, { recursive: true });

// Fallback for 404 (GitHub Pages uses this for unknown routes)
if (existsSync(path.join(dist, 'index.html'))) {
  await copyFile(path.join(dist, 'index.html'), path.join(dist, '404.html'));
}

// GitHub Pages specific: Disable Jekyll
await writeFile(path.join(dist, '.nojekyll'), '');
