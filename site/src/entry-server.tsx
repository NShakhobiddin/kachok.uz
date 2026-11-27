// Yig‘ishda: sahifalarni HTML qilib chizadi (qidiruv tizimlari va tez ochilish uchun) — scripts/site-prerender.mjs chaqiradi.
import { renderToString } from 'react-dom/server';
import { App, type Page } from './App';
import { buildSiteData } from './buildData';
import { faqs } from './faq';
import { BOT_NAME } from './links';

export function render(page: Page) {
  const full = buildSiteData();
  // maxfiylik sahifasiga faqat pastki qism uchun kerakli raqamlar
  const data = page === 'index' ? full : { ...full, dishes: [], groups: [], gi: [], muscles: {}, sources: [], facts: [], myths: [], allSources: [], showcase: [], gallery: [], m3names: {} };
  const html = renderToString(<App page={page} data={data} />);
  const url = __SITE_URL__;
  const ld: object[] =
    page === 'index'
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'GYMbos',
            url: `${url}/`,
            inLanguage: 'uz',
            applicationCategory: 'HealthApplication',
            operatingSystem: 'Telegram, Web',
            description: 'Telegram ichidagi shaxsiy fitnes murabbiy: mashq dasturi, mashqlar texnikasi, milliy taomlar bilan ovqatlanish va natijalar.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'UZS' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs(data.stats, BOT_NAME).map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          },
        ]
      : [];
  return { html, data, ld };
}
