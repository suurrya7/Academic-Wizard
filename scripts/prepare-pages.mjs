import { copyFile, cp, mkdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

async function copyIfExists(from, to) {
  if (!existsSync(from)) return;
  await mkdir(path.dirname(to), { recursive: true });
  const info = await stat(from);
  if (info.isDirectory()) {
    await cp(from, to, { recursive: true, force: true });
  } else {
    await copyFile(from, to);
  }
}

await mkdir(dist, { recursive: true });
if (existsSync(path.join(dist, 'app.html'))) {
  await copyFile(path.join(dist, 'app.html'), path.join(dist, 'index.html'));
}
await copyIfExists(path.join(root, 'blog', 'assets'), path.join(dist, 'blog', 'assets'));
await copyIfExists(path.join(root, 'blog', 'posts'), path.join(dist, 'blog', 'posts'));
await copyIfExists(path.join(root, 'data'), path.join(dist, 'data'));
await copyIfExists(path.join(root, 'public', 'sitemap.xml'), path.join(dist, 'sitemap.xml'));
await copyIfExists(path.join(root, 'public', 'robots.txt'), path.join(dist, 'robots.txt'));

if (existsSync(path.join(dist, 'index.html'))) {
  await copyFile(path.join(dist, 'index.html'), path.join(dist, '404.html'));
}

await writeFile(path.join(dist, '.nojekyll'), '');
