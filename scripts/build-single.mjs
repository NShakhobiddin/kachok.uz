// Bitta HTML faylli ko'rgazma versiyasi: `npm run build:single` -> dist-single/kachok.html
// (PWA'siz, marshrutlar xotirada, shrift va kod fayl ichida — istalgan joyda ochiladi)
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

execSync('vite build --outDir dist-single/build --emptyOutDir', { stdio: 'inherit', env: { ...process.env, VITE_TARGET: 'artifact' } });
const dir = 'dist-single/build/assets';
const files = readdirSync(dir);
const css = readFileSync(`${dir}/${files.find((f) => f.endsWith('.css'))}`, 'utf8');
const js = readFileSync(`${dir}/${files.find((f) => f.endsWith('.js'))}`, 'utf8').replaceAll('</script', '<\\/script');
mkdirSync('dist-single', { recursive: true });
writeFileSync(
  'dist-single/kachok.html',
  `<!doctype html><html lang="uz"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Kachok</title><style>${css}</style></head><body><div id="root"></div><script type="module">${js}</script></body></html>`,
);
console.log('dist-single/kachok.html tayyor');
