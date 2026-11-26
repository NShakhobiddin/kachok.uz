// Brauzer: oldindan tayyorlangan HTML’ni "jonlantiradi" (hydrate). Ishlab chiqishda (vite dev) — noldan chizadi.
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App, type Page } from './App';
import type { SiteData } from './model';
import './site.css';

/** Ekranga kirgan bo‘limlar yumshoq paydo bo‘ladi (bir marta) */
function reveals() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach((e) => e.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries)
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  els.forEach((e) => io.observe(e));
}

async function boot() {
  const root = document.getElementById('root')!;
  const page = (document.body.dataset.page as Page) || 'index';
  const json = document.getElementById('site-data')?.textContent;
  if (json) {
    hydrateRoot(root, <App page={page} data={JSON.parse(json) as SiteData} />);
  } else if (import.meta.env.DEV) {
    // vite dev: ma’lumotni ilova bazasidan shu yerda tayyorlaymiz (yig‘ilgan saytda bu bo‘lak yo‘q)
    const { buildSiteData } = await import('./buildData');
    createRoot(root).render(<App page={page} data={buildSiteData()} />);
  }
  requestAnimationFrame(reveals);
}

void boot();
