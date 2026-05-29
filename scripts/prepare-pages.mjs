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
await copyIfExists(path.join(root, 'CNAME'), path.join(dist, 'CNAME'));

if (existsSync(path.join(dist, 'index.html'))) {
  const appShell = path.join(dist, 'index.html');
  const spaRoutes = [
    'services',
    'about',
    'faq',
    'blog',
    'contact',
    'privacy-policy',
    'terms-of-service',
  ];

  for (const route of spaRoutes) {
    await mkdir(path.join(dist, route), { recursive: true });
    await copyFile(appShell, path.join(dist, route, 'index.html'));
  }

  await copyFile(appShell, path.join(dist, '404.html'));
}

await writeFile(path.join(dist, '.nojekyll'), '');
