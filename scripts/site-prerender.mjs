// Saytni oldindan HTML qilib chizadi: dist-site/*.html ga sahifa, sayt ma’lumoti (JSON) va qidiruv tizimlari uchun JSON-LD.
// npm run build:site ichida, SSR yig‘masidan (dist-site-ssr) keyin ishlaydi.
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const { render } = await import(pathToFileURL('dist-site-ssr/entry-server.js').href);
const url = (process.env.SITE_URL || 'https://nshakhobiddin.github.io/kachok.uz').replace(/\/$/, '');
// <script> ichidagi JSON: "</script>" bilan sahifani buzmasin
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

for (const page of ['index', 'maxfiylik']) {
  const file = `dist-site/${page}.html`;
  const { html, data, ld } = render(page);
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
