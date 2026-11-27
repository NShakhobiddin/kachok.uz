// Bel/bo‘y nisbati (WHtR): ilovadagi formula va zonalar bilan (src/engine/bodycomp.ts) — Ashwell 2012.
import { ArrowUpRight, Info } from '@phosphor-icons/react/ssr';
import { useState } from 'react';
import { MEASURES, WHTR_ZONES, whtr, whtrZone } from '../../../src/engine/bodycomp';
import { fmt1 } from '../data';
import { BotButton, NumberField, parseNum } from '../ui';

/** shkala chegaralari: 0.35 … 0.70 */
const LO = 0.35;
const HI = 0.7;
const pos = (r: number) => Math.max(0, Math.min(1, (r - LO) / (HI - LO)));
const TONE: Record<string, string> = { good: 'var(--lime)', warn: 'var(--fat)', bad: 'var(--red)' };
const HOW = MEASURES.find((m) => m.key === 'waistCm')!.how;

export function Waist() {
  const [height, setHeight] = useState('175');
  const [waist, setWaist] = useState('86');
  const h = parseNum(height, 140, 215, 'Bo‘y');
  const w = parseNum(waist, 50, 180, 'Bel');
  const ok = !h.err && !w.err;
  const r = ok ? whtr(w.n, h.n) : 0;
  const zone = ok ? whtrZone(r) : null;
  const limit = ok ? Math.floor(h.n / 2) : 0;
  const over = ok ? Math.round(w.n - h.n / 2) : 0;

  return (
    <section id="bel" className="tool" aria-labelledby="bel-t">
      <div className="stack gap-24">
        <div className="tool-head">
          <span className="eyebrow">Sog‘liq testi · 1 daqiqa</span>
          <h3 id="bel-t" className="heading-4">
            Belingiz yuragingiz haqida nima deydi?
          </h3>
          <p className="body-3 muted">
            Bel/bo‘y nisbati yurak-qon tomir kasalliklari va qandli diabet xavfini tana vazn indeksidan (BMI) yaxshiroq ko‘rsatadi. Qoida oddiy: belingiz bo‘yingizning yarmidan kam bo‘lsin.
          </p>
        </div>
        <div className="panel">
          <div className="fields-2">
            <NumberField label="Bo‘y" value={height} onChange={setHeight} min={140} max={215} unit="sm" error={h.err} />
            <NumberField label="Bel" value={waist} onChange={setWaist} min={50} max={180} step={0.5} unit="sm" error={w.err} />
          </div>
          <p className="note caption-2">
            <Info size={16} aria-hidden="true" />
            Qanday o‘lchanadi: {HOW.charAt(0).toLowerCase() + HOW.slice(1)}.
          </p>
        </div>
      </div>

      <div className="panel" aria-live="polite">
        {zone ? (
          <div className="result">
            <span className="caption-1 muted">Bel/bo‘y nisbati</span>
            <div className="big">
              <span className="heading-2">{r.toFixed(2).replace('.', ',')}</span>
              <span className="title-2" style={{ color: TONE[zone.tone] }}>
                {zone.name}
              </span>
            </div>
            <div className="whtr" role="img" aria-label={`Nisbat ${r.toFixed(2)}: ${zone.name}`}>
              <div className="whtr-bar">
                {WHTR_ZONES.map((z, i) => {
                  const from = i === 0 ? LO : WHTR_ZONES[i - 1].max;
                  const to = Math.min(z.max, HI);
                  return <i key={z.name} style={{ flexGrow: Math.round((to - from) * 1000), background: TONE[z.tone], opacity: z === zone ? 1 : 0.28 }} />;
                })}
              </div>
              <span className="whtr-mark" style={{ left: `${pos(r) * 100}%` }} />
              <div className="whtr-ticks caption-5 faint num">
                {[0.4, 0.5, 0.6].map((t) => (
                  <span key={t} style={{ left: `${pos(t) * 100}%` }}>
                    {fmt1(t)}
                  </span>
                ))}
              </div>
            </div>
            <div className="kv">
              <div>
                <span className="caption-4 faint">Sog‘lom bel chegarasi</span>
                <span className="body-1 num">{limit} sm gacha</span>
              </div>
              <div>
                <span className="caption-4 faint">{over > 0 ? 'Chegaragacha kamaytirish' : 'Chegaragacha zaxira'}</span>
                <span className="body-1 num">{Math.abs(over)} sm</span>
              </div>
            </div>
            <p className="body-5">
              {zone.tone === 'good'
                ? 'Zo‘r ko‘rsatkich. Kuch mashqi va yetarli oqsil uni yillar davomida saqlashga yordam beradi.'
                : r < 0.4
                  ? 'Bel juda ingichka: ehtimol vazn yetishmaydi. Kaloriya va oqsilni oshirib, kuch mashqi bilan mushak qo‘shish foydali.'
                  : 'Bel bo‘yingiz yarmidan oshgan. Uni kaloriya taqchilligi kichraytiradi, kuch mashqi esa shu payt mushakni saqlaydi. Ilova bel o‘lchamini vazn bilan birga kuzatib boradi.'}
            </p>
            <div className="tool-cta">
              <BotButton from="site_bel" size="md">
                Bel o‘lchamini kuzatish
              </BotButton>
            </div>
            <p className="caption-5 faint">
              Zonalar: 0,4 dan kam — juda ozg‘in, 0,4–0,5 — sog‘lom, 0,5–0,6 — xavf oshgan, 0,6 dan ko‘p — yuqori xavf.{' '}
              <a className="link" href="https://doi.org/10.1111/j.1467-789X.2011.00952.x" target="_blank" rel="noopener">
                Ashwell va boshq., 2012
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
              . Tibbiy tashxis emas.
            </p>
          </div>
        ) : (
          <div className="empty">
            <span className="body-2">Natija shu yerda chiqadi</span>
            <span className="body-6">Bo‘y va belni sm da kiriting: qaysi maydon xato ekani chap tomonda yozilgan.</span>
          </div>
        )}
      </div>
    </section>
  );
}
