// «Raqamlar gapiradi»: kuch mashqining sog‘liqqa foydasi — katta raqam, qisqa izoh va maqola havolasi.
import { ArrowUpRight } from '@phosphor-icons/react/ssr';
import { useEffect, useRef } from 'react';
import { useSiteData } from '../data';
import { BotButton } from '../ui';

/**
 * Matndagi raqamlar ekranga chiqqanda noldan sanab chiqadi ("10–17%" → 0–0% … 10–17%).
 * Sahifa HTML’ida yakuniy qiymat turadi (qidiruv tizimlari va JS’siz ko‘rish uchun); animatsiya faqat
 * bo‘lim hali ko‘rinmagan bo‘lsa va foydalanuvchi harakatni kamaytirishni so‘ramagan bo‘lsa ishlaydi.
 */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const parts = value.split(/(\d+(?:,\d+)?)/);
    const frame = (t: number) =>
      parts
        .map((p, i) => {
          if (i % 2 === 0) return p;
          const dec = p.includes(',') ? p.split(',')[1].length : 0;
          return (Number(p.replace(',', '.')) * t).toFixed(dec).replace('.', ',');
        })
        .join('');
    el.textContent = frame(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const k = Math.min(1, (now - start) / 1400);
          el.textContent = frame(1 - (1 - k) ** 3);
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = value;
    };
  }, [value]);
  return (
    <span ref={ref} className="fact-num">
      {value}
    </span>
  );
}

export function Facts() {
  const { facts } = useSiteData();
  return (
    <section id="faktlar" className="section" aria-labelledby="facts-t">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Raqamlar gapiradi</span>
          <h2 id="facts-t" className="section-title">
            Kuch mashqi — eng arzon dori
          </h2>
          <p className="body-3 muted">Gap faqat chiroyli tanada emas. Xalqaro tadqiqotlar kuch mashqi umr, yurak, suyak va kayfiyat uchun nima berishini o‘lchagan:</p>
        </div>
        <ul className="facts">
          {facts.map((f, i) => (
            <li key={f.title} className={`card fact reveal${i === 0 ? ' card-olive' : ''}`} style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
              <CountUp value={f.value} />
              <span className="title-2">{f.title}</span>
              <p className="body-6 muted">{f.text}</p>
              {f.src.doi ? (
                <a className="link caption-1 fact-src" href={`https://doi.org/${f.src.doi}`} target="_blank" rel="noopener">
                  {f.src.short}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              ) : (
                <span className="caption-1 faint fact-src">{f.src.short}</span>
              )}
            </li>
          ))}
        </ul>
        <div className="facts-cta reveal">
          <p className="body-3 muted">Boshlash uchun murakkab reja shart emas: GYMbos haftasiga 2 kunlik dasturdan boshlab beradi.</p>
          <BotButton from="site_fakt" size="md">
            Haftasiga 2 kundan boshlash
          </BotButton>
        </div>
      </div>
    </section>
  );
}
