// Mashq rasmlari lentasi: ilovadagi anatomik rasmlar sekin suzib o‘tadi (harakatni kamaytirish so‘ralsa — qo‘lda suriladi).
import { useSiteData } from '../data';
import { asset } from '../links';

export function Gallery() {
  const { gallery, stats } = useSiteData();
  // ikki nusxa ketma-ket: birinchisi chapga to‘liq chiqqanda ikkinchisi uning o‘rnida — uzluksiz aylanish
  const loop = [...gallery, ...gallery];
  return (
    <section className="gallery" aria-labelledby="gal-t">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Texnika</span>
          <h2 id="gal-t" className="section-title">
            {stats.illustrated} ta mashq — har biri anatomik rasm bilan
          </h2>
          <p className="body-3 muted">Lime rangda — shu mashqda ishlayotgan mushaklar. Ilovada har rasm ustida mushak nomlari va to‘g‘ri texnika belgilari turadi.</p>
        </div>
      </div>
      <div className="marquee">
        <ul className="marquee-track">
          {loop.map((g, k) => (
            <li key={k} className="marquee-item" aria-hidden={k >= gallery.length ? true : undefined}>
              <img src={asset(g.src)} width={400} height={400} alt={k < gallery.length ? `${g.name}: anatomik rasm` : ''} loading="lazy" decoding="async" />
              <span className="caption-4 muted">{g.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
