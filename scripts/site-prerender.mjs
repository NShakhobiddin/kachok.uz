// Saytni oldindan HTML qilib chizadi: dist-site/*.html ga sahifa, sayt ma’lumoti (JSON) va qidiruv tizimlari uchun JSON-LD;
// mushaklar bo‘limidagi mashq rasmlari, sitemap.xml va robots.txt. Natija — mustaqil statik sayt (istalgan hostingga yuklanadi).
// npm run build:site ichida, SSR yig‘masidan (dist-site-ssr) keyin ishlaydi.
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

const { render } = await import(pathToFileURL('dist-site-ssr/entry-server.js').href);
const PLACEHOLDER = 'https://SIZNING-DOMENINGIZ.uz';
const url = (process.env.SITE_URL || PLACEHOLDER).replace(/\/$/, '');
if (url === PLACEHOLDER) console.warn(`SITE_URL berilmagan: kanonik manzil, og:image va sitemap’da "${PLACEHOLDER}" turibdi — domeningizga almashtiring`);
// <script> ichidagi JSON: "</script>" bilan sahifani buzmasin
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

let thumbs = [];
let media = { frames: [], gallery: [] };
for (const page of ['index', 'maxfiylik']) {
  const file = `dist-site/${page}.html`;
  const { html, data, ld } = render(page);
  if (page === 'index') {
    thumbs = [...new Set(Object.values(data.muscles).flatMap((m) => m.top.map((e) => e.id)))];
    media = { frames: data.showcase.flatMap((s) => s.frames.map((f) => f.src.replace(/^\.\//, ''))), gallery: data.gallery.map((g) => g.src) };
  }
  let out = readFileSync(file, 'utf8');
  for (const mark of ['<!--ssr-->', '<!--data-->', '<!--head-->'])
    if (page === 'index' && !out.includes(mark)) throw new Error(`${file}: ${mark} belgisi yo‘q`);
  out = out
    .replace('<!--ssr-->', html)
    .replace('<!--data-->', `<script id="site-data" type="application/json">${json(data)}</script>`)
    .replace('<!--head-->', ld.map((o) => `<script type="application/ld+json">${json(o)}</script>`).join(''))
    .replaceAll('%SITE_URL%', url);
  writeFileSync(file, out);
  console.log(`${file}: ${Math.round(out.length / 1024)} KB`);
}
rmSync('dist-site-ssr', { recursive: true, force: true });

// mushaklar bo‘limidagi mashq rasmlari (ilovadagi kichik nusxalar)
mkdirSync('dist-site/thumbs', { recursive: true });
for (const id of thumbs) {
  const src = `public/illustrations/thumb/${id}.webp`;
  if (!existsSync(src)) throw new Error(`rasm yo‘q: ${src}`);
  copyFileSync(src, `dist-site/thumbs/${id}.webp`);
}
console.log(`dist-site/thumbs: ${thumbs.length} ta rasm`);

// «3D anatomiya»: mashq kadrlari (ilovadagi 1024 px rasmlar) va 3D model (litsenziyasi bilan)
for (const rel of new Set(media.frames)) {
  const src = `public/${rel}`;
  if (!existsSync(src)) throw new Error(`kadr yo‘q: ${src}`);
  mkdirSync(dirname(`dist-site/${rel}`), { recursive: true });
  copyFileSync(src, `dist-site/${rel}`);
}
mkdirSync('dist-site/models', { recursive: true });
for (const f of ['muscles-v2.glb', 'LICENSE.md']) copyFileSync(`public/models/${f}`, `dist-site/models/${f}`);
console.log(`dist-site: ${new Set(media.frames).size} ta harakat kadri, 3D model`);
// rasm lentasi site/public/gallery dan keladi (scripts/site-gallery.py tayyorlaydi)
const missing = media.gallery.filter((g) => !existsSync(`dist-site/${g}`));
if (missing.length) throw new Error(`rasm lentasi: ${missing.join(', ')} yo‘q — python3 scripts/site-gallery.py ni ishga tushiring`);

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  'dist-site/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${url}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>
  <url><loc>${url}/maxfiylik.html</loc><lastmod>${today}</lastmod><priority>0.3</priority></url>
</urlset>
`,
);
writeFileSync('dist-site/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${url}/sitemap.xml\n`);
