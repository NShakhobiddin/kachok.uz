// GitHub Pages to‘plami: sayt — ildizda (dist-site), ilova — app/ da (dist).
// Eski manzildan (ildizdan) o‘rnatilgan ilova uchun: sw.js eski xizmat ishchisini o‘chiradi, 404 eski havolalarni app/ ga yo‘naltiradi.
// Ishlatish: SITE_BASE=/kachok.uz/ SITE_URL=https://… node scripts/compose-pages.mjs _site
import { cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const OUT = process.argv[2] || '_site';
const base = process.env.SITE_BASE || '/';
const url = (process.env.SITE_URL || 'https://nshakhobiddin.github.io/kachok.uz').replace(/\/$/, '');
if (!base.startsWith('/') || !base.endsWith('/')) throw new Error(`SITE_BASE "/" bilan boshlanib tugashi kerak: ${base}`);

rmSync(OUT, { recursive: true, force: true });
cpSync('dist-site', OUT, { recursive: true });
cpSync('dist', `${OUT}/app`, { recursive: true });

// 404: ilovaning o‘zi (ichki sahifa to‘g‘ridan-to‘g‘ri ochilganda), app/ dan tashqaridagi eski havolalar — app/ ga
const appIndex = readFileSync('dist/index.html', 'utf8');
const redirect = `<script>(function(){var b=${JSON.stringify(base)},p=location.pathname;if(p.indexOf(b+'app/')!==0&&p.indexOf(b)===0)location.replace(b+'app/'+p.slice(b.length)+location.search+location.hash)})()</script>`;
if (!appIndex.includes('<head>')) throw new Error('dist/index.html: <head> topilmadi');
writeFileSync(`${OUT}/404.html`, appIndex.replace('<head>', `<head>${redirect}`));

// ilova avval ildizda edi: o‘rnatilganlarning eski xizmat ishchisi shu faylni yangilanish sifatida oladi va o‘zini o‘chiradi
writeFileSync(
  `${OUT}/sw.js`,
  `// Ilova ${base}app/ ga ko‘chdi: eski (ildizdagi) xizmat ishchisi keshini tozalaydi, o‘zini o‘chiradi va sahifani yangilaydi.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil((async function () {
    var scope = self.registration.scope;
    var keys = await caches.keys();
    await Promise.all(keys.filter(function (k) { return k.indexOf(scope) >= 0 && k.indexOf(scope + 'app/') < 0; }).map(function (k) { return caches.delete(k); }));
    await self.registration.unregister();
    var list = await self.clients.matchAll({ type: 'window' });
    list.forEach(function (c) { c.navigate(c.url); });
  })());
});
`,
);

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  `${OUT}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${url}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>
  <url><loc>${url}/maxfiylik.html</loc><lastmod>${today}</lastmod><priority>0.3</priority></url>
</urlset>
`,
);
writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\nDisallow: ${base}app/\nSitemap: ${url}/sitemap.xml\n`);
console.log(`${OUT}: sayt ${base}, ilova ${base}app/`);
