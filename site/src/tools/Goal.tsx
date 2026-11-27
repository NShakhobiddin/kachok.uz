// Maqsadgacha qancha: xavfsiz sur’atda (ozish — haftasiga vaznning 0,5–0,7%, massa — 0,25–0,5%) maqsad vaznga qachon yetiladi.
// Sur’atlar ilovadagi bilan bir xil (src/engine/nutrition.ts): ozish 0,6%, massa — boshlovchi 0,4%, tajribali 0,25%.
import { Info } from '@phosphor-icons/react/ssr';
import { useEffect, useMemo, useState } from 'react';
import { fmt, fmt1 } from '../data';
import { BotButton, Chips, NumberField, parseNum } from '../ui';

const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
/** 1 kg tana vazni ≈ 7 700 kkal (Hall 2008) */
const KCAL_PER_KG = 7700;
const MAX_WEEKS = 260;

/** har hafta vaznning r ulushi o‘zgaradi: maqsadga yetguncha haftalar va yo‘l */
function path(from: number, to: number, r: number): number[] {
  const dir = Math.sign(to - from);
  const out = [from];
  let w = from;
  while ((to - w) * dir > 0.05 && out.length <= MAX_WEEKS) {
    w = w * (1 + dir * r);
    if ((to - w) * dir < 0) w = to;
    out.push(w);
  }
  return out;
}

type Level = 'beginner' | 'trained';

export function Goal() {
  const [now, setNow] = useState<Date | null>(null);
  const [cur, setCur] = useState('85');
  const [target, setTarget] = useState('75');
  const [level, setLevel] = useState<Level>('beginner');
  // sana faqat brauzerda: oldindan tayyorlangan HTML yig‘ish kunini ko‘rsatmasin
  useEffect(() => setNow(new Date()), []);

  const c = parseNum(cur, 40, 200, 'Hozirgi vazn');
  const t = parseNum(target, 40, 200, 'Maqsad vazn');
  const ok = !c.err && !t.err;
  const lose = ok && t.n < c.n;
  const same = ok && Math.abs(t.n - c.n) < 0.5;
  const rate = lose ? 0.006 : level === 'beginner' ? 0.004 : 0.0025;
  const [fast, slow] = lose ? [0.007, 0.005] : [0.005, 0.0025];

  const res = useMemo(() => {
    if (!ok || same) return null;
    const main = path(c.n, t.n, rate);
    return {
      main,
      weeks: main.length - 1,
      range: [path(c.n, t.n, fast).length - 1, path(c.n, t.n, slow).length - 1] as const,
      perWeek: Math.abs(main[1] - main[0]),
      kcalDay: Math.round((Math.abs(main[1] - main[0]) * KCAL_PER_KG) / 7 / 10) * 10,
      capped: main.length - 1 >= MAX_WEEKS,
    };
  }, [ok, same, c.n, t.n, rate, fast, slow]);

  const date = now && res ? new Date(now.getTime() + res.weeks * 7 * 86400000) : null;
  const big = ok && Math.abs(t.n - c.n) / c.n > 0.2;

  return (
    <section id="maqsad" className="tool" aria-labelledby="maqsad-t">
      <div className="stack gap-24">
        <div className="tool-head">
          <span className="eyebrow">Reja</span>
          <h3 id="maqsad-t" className="heading-4">
            Maqsadingizga qachon yetasiz?
          </h3>
          <p className="body-3 muted">
            Shoshilgan ozish mushakni yeydi, shoshilgan massa esa yog‘ bo‘lib qoladi. Kalkulyator mushakni saqlaydigan xavfsiz sur’atda hisoblaydi: ozishda haftasiga vaznning 0,5–0,7% i, massada 0,25–0,5% i.
          </p>
        </div>
        <div className="panel">
          <div className="fields-2">
            <NumberField label="Hozirgi vazn" value={cur} onChange={setCur} min={40} max={200} step={0.5} unit="kg" error={c.err} />
            <NumberField label="Maqsad vazn" value={target} onChange={setTarget} min={40} max={200} step={0.5} unit="kg" error={t.err} />
          </div>
          {ok && !lose && !same && (
            <Chips
              label="Zalda tajriba"
              value={level}
              options={[
                { v: 'beginner', t: 'Endi boshlayapman' },
                { v: 'trained', t: '1 yildan ko‘p' },
              ]}
              onChange={setLevel}
            />
          )}
        </div>
      </div>

      <div className="panel" aria-live="polite">
        {res ? (
          <div className="result">
            <span className="caption-1 muted">{lose ? 'Ozish' : 'Massa olish'}: taxminiy muddat</span>
            <div className="big">
              <span className="heading-2 num">{res.capped ? '260+' : res.weeks}</span>
              <span className="title-2 muted">hafta</span>
              {!res.capped && <span className="title-2 muted">· ~{fmt1(res.weeks / 4.35)} oy</span>}
            </div>
            <span className="body-5">
              {date ? (
                <>
                  Shu sur’atda <span className="lime">{fmt1(t.n)} kg</span> ga taxminan {date.getDate()}-{MONTHS[date.getMonth()]}, {date.getFullYear()} da yetasiz.
                </>
              ) : (
                <>&nbsp;</>
              )}
            </span>
            <GoalChart pts={res.main} target={t.n} />
            <div className="kv">
              <div>
                <span className="caption-4 faint">Birinchi hafta</span>
                <span className="body-1 num">
                  {lose ? '−' : '+'}
                  {fmt1(res.perWeek)} kg
                </span>
              </div>
              <div>
                <span className="caption-4 faint">{lose ? 'Kunlik taqchillik' : 'Kunlik ortiqcha'}</span>
                {/* massada energiyaning bir qismi mushakka ketadi: 7 700 kkal/kg emas, me’yorga foiz (ilovadagidek) */}
                <span className="body-1 num">{lose ? `~${fmt(res.kcalDay)} kkal` : `me’yordan +${level === 'beginner' ? 12 : 8}%`}</span>
              </div>
              <div>
                <span className="caption-4 faint">Sekinroq / tezroq</span>
                <span className="body-1 num">
                  {res.range[1]} / {res.range[0]} hafta
                </span>
              </div>
              <div>
                <span className="caption-4 faint">Haftalik sur’at</span>
                <span className="body-1 num">{fmt1(rate * 100)}% vazn</span>
              </div>
            </div>
            {big && (
              <p className="note caption-2">
                <Info size={16} aria-hidden="true" />
                Maqsad vazningizning 20% idan ko‘p. Uni 2–3 bosqichga bo‘ling va har bosqich orasida 2–4 hafta vaznni ushlab turing; sog‘lig‘ingizda muammo bo‘lsa, shifokor bilan maslahatlashing.
              </p>
            )}
            <div className="tool-cta">
              <BotButton from="site_maqsad" size="md">
                Maqsad qo‘yib, kuzatib borish
              </BotButton>
            </div>
            <p className="caption-5 faint">
              Sur’at: Garthe 2011, Helms 2014 (ozish), Iraki 2019 (massa); 1 kg ≈ 7 700 kkal (Hall 2008). Taxminiy hisob: ilova haftalik vazn trendingizga qarab rejani o‘zi tuzatadi.
            </p>
          </div>
        ) : (
          <div className="empty">
            <span className="body-2">{same ? 'Siz allaqachon maqsaddasiz' : 'Natija shu yerda chiqadi'}</span>
            <span className="body-6">
              {same ? 'Endi vazifa — vaznni ushlab turib, kuchni oshirish. Ilova buni ham rejalashtiradi.' : 'Hozirgi va maqsad vaznni kiriting: qaysi maydon xato ekani chap tomonda yozilgan.'}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

/** Vazn yo‘li: haftalar bo‘yicha egri chiziq va maqsad chizig‘i */
function GoalChart({ pts, target }: { pts: number[]; target: number }) {
  const W = 320;
  const H = 120;
  const pad = 8;
  const min = Math.min(...pts, target);
  const max = Math.max(...pts, target);
  const span = Math.max(0.5, max - min);
  const x = (i: number) => pad + (i / Math.max(1, pts.length - 1)) * (W - pad * 2);
  const y = (v: number) => pad + (1 - (v - min) / span) * (H - pad * 2);
  const d = pts.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${d} L${x(pts.length - 1).toFixed(1)},${H} L${x(0).toFixed(1)},${H} Z`;
  return (
    <svg className="goal-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Vazn ${fmt1(pts[0])} kg dan ${fmt1(target)} kg gacha, ${pts.length - 1} hafta`}>
      <line x1={pad} x2={W - pad} y1={y(target)} y2={y(target)} className="goal-target" />
      <path d={area} className="goal-area" />
      <path d={d} className="goal-line" />
      <circle cx={x(0)} cy={y(pts[0])} r={4} className="goal-dot start" />
      <circle cx={x(pts.length - 1)} cy={y(pts[pts.length - 1])} r={5} className="goal-dot" />
    </svg>
  );
}
