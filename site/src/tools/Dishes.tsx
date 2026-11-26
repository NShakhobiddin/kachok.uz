// Milliy taomlar: porsiyadagi kaloriya va oqsil, kunlik me’yorning qancha qismi; mahsulotlarning glikemik indeksi.
import { CaretDown, MagnifyingGlass, PersonSimpleRun } from '@phosphor-icons/react/ssr';
import { useId, useMemo, useState } from 'react';
import { fmt, useShared, useSiteData } from '../data';
import type { DishRow, GiRow } from '../model';
import { BotButton, Chips, Seg } from '../ui';

/** o‘rtacha kattalar me’yori — kalkulyator ishlatilmagan bo‘lsa */
const DEFAULT_KCAL = 2500;
/** tez yurish ~4.3 MET (Ainsworth 2011), 70 kg odam */
const WALK_KCAL_MIN = (4.3 * 3.5 * 70) / 200;
const LIMIT = 8;

/** apostrof turlaridan qat’i nazar qidirish: o'sh = o‘sh */
const norm = (s: string) => s.toLowerCase().replace(/[‘’'`ʻʼ]/g, "'").trim();

type Sort = 'popular' | 'light' | 'protein';

export function Dishes() {
  const { dishes, groups, gi } = useSiteData();
  const { dailyKcal } = useShared();
  const [mode, setMode] = useState<'dishes' | 'gi'>('dishes');
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('all');
  const [sort, setSort] = useState<Sort>('popular');
  const [open, setOpen] = useState<string | null>(null);
  const [all, setAll] = useState(false);
  const searchId = useId();
  const daily = dailyKcal ?? DEFAULT_KCAL;

  const list = useMemo(() => {
    const nq = norm(q);
    let l = dishes.filter((d) => (group === 'all' || d.group === group) && (!nq || norm(d.name).split(/[\s(]+/).some((w) => w.startsWith(nq)) || norm(d.name).startsWith(nq)));
    if (sort === 'light') l = [...l].sort((a, b) => a.kcal - b.kcal);
    if (sort === 'protein') l = [...l].sort((a, b) => (b.p * 4) / b.kcal - (a.p * 4) / a.kcal);
    return l;
  }, [dishes, q, group, sort]);
  const filtered = q.trim() !== '' || group !== 'all';
  const shown = all || filtered ? list : list.slice(0, LIMIT);

  return (
    <section id="taomlar" className="tool" aria-labelledby="taomlar-t">
      <div className="stack gap-24">
        <div className="tool-head">
          <span className="eyebrow">Ma’lumotnoma</span>
          <h3 id="taomlar-t" className="heading-4">
            Osh, somsa, lag‘mon: bir porsiyada qancha?
          </h3>
          <p className="body-3 muted">
            {dishes.length} ta milliy taomning odatiy porsiyasidagi kaloriya va oqsil. Chiziq — kunlik me’yoringizning ({fmt(daily)} kkal
            {dailyKcal ? ', kalkulyator bo‘yicha' : ', o‘rtacha'}) qancha qismi ekani. Taomni bosing: to‘liq tarkibi va yengilroq varianti.
          </p>
        </div>
        <div className="panel">
          <Seg
            label="Bo‘lim"
            value={mode}
            options={[
              { v: 'dishes', t: 'Milliy taomlar' },
              { v: 'gi', t: 'Glikemik indeks' },
            ]}
            onChange={setMode}
          />
          {mode === 'dishes' ? (
            <>
              <div className="input-wrap">
                <label htmlFor={searchId} className="sr-only">
                  Taom qidirish
                </label>
                <MagnifyingGlass size={18} className="input-ico" aria-hidden="true" />
                <input id={searchId} className="input search" type="search" placeholder="Masalan: manti, sho‘rva" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
              </div>
              <Chips label="Turkum" hideLabel value={group} options={[{ v: 'all', t: 'Hammasi' }, ...groups.map((g) => ({ v: g.id, t: g.short }))]} onChange={setGroup} />
              <Chips
                label="Tartib"
                value={sort}
                options={[
                  { v: 'popular', t: 'Ommabop' },
                  { v: 'light', t: 'Eng yengil' },
                  { v: 'protein', t: 'Oqsilga boy' },
                ]}
                onChange={setSort}
              />
            </>
          ) : (
            <p className="body-6 muted">
              Glikemik indeks (GI) mahsulot qondagi qandni qanchalik tez ko‘tarishini bildiradi (glyukoza = 100). Past GI (55 va undan kam) uzoqroq to‘q tutadi. Qiymatlar xalqaro GI jadvallaridan (Atkinson va boshq., 2008), toifalar ISO 26642 bo‘yicha.
            </p>
          )}
        </div>
      </div>

      <div className="panel">
        {mode === 'gi' ? (
          <GiList rows={gi} />
        ) : list.length === 0 ? (
          <div className="empty">
            <span className="body-2">«{q}» topilmadi</span>
            <span className="body-6">Boshqacha yozib ko‘ring, masalan «osh» yoki «somsa». Yoki turkumni «Hammasi»ga qaytaring.</span>
            <button
              type="button"
              className="btn btn-ghost button-sm"
              onClick={() => {
                setQ('');
                setGroup('all');
              }}
            >
              Qidiruvni tozalash
            </button>
          </div>
        ) : (
          <>
            <ul className="dish-list">
              {shown.map((d) => (
                <Dish key={d.id} d={d} daily={daily} open={open === d.id} onToggle={() => setOpen(open === d.id ? null : d.id)} />
              ))}
            </ul>
            {!filtered && list.length > LIMIT && (
              <button type="button" className="btn btn-ghost button-sm" onClick={() => setAll(!all)} aria-expanded={all}>
                {all ? 'Qisqartirish' : `Hammasini ko‘rsatish (${list.length})`}
              </button>
            )}
          </>
        )}
        <div className="tool-cta">
          <BotButton from="site_taom" size="md">
            Kundalikka bir bosishda qo‘shish
          </BotButton>
        </div>
      </div>
    </section>
  );
}

function Dish({ d, daily, open, onToggle }: { d: DishRow; daily: number; open: boolean; onToggle: () => void }) {
  const pct = d.kcal / daily;
  const e = { p: d.p * 4, c: d.c * 4, f: d.f * 9 };
  const sum = e.p + e.c + e.f || 1;
  const walk = Math.round(d.kcal / WALK_KCAL_MIN);
  const moreId = `dish-${d.id}`;
  return (
    <li className="dish">
      <button type="button" className="dish-btn" onClick={onToggle} aria-expanded={open} aria-controls={moreId}>
        <span className="dish-ico" aria-hidden="true">
          {d.icon}
        </span>
        <span className="dish-mid">
          <span className="title-3">{d.name}</span>
          <span className="caption-5 faint">
            {d.unit} ({d.g} g) · kunlik me’yorning {Math.round(pct * 100)}%
          </span>
          <span className="mini-bar" aria-hidden="true">
            <i className={pct > 0.35 ? 'over' : undefined} style={{ transform: `scaleX(${Math.min(1, pct)})` }} />
          </span>
        </span>
        <span className="dish-right">
          <span className="body-4">{fmt(d.kcal)} kkal</span>
          <span className="caption-4 lime">oqsil {d.p} g</span>
        </span>
      </button>
      <div id={moreId} className="dish-more" hidden={!open}>
        <div className="split" aria-hidden="true">
          <i style={{ flexGrow: e.p, background: 'var(--lime)' }} />
          <i style={{ flexGrow: e.c, background: 'var(--carb)' }} />
          <i style={{ flexGrow: e.f, background: 'var(--fat)' }} />
        </div>
        <p className="caption-2 muted">
          <span className="dot" style={{ background: 'var(--lime)' }} />
          oqsil {d.p} g ({Math.round((e.p / sum) * 100)}%) · <span className="dot" style={{ background: 'var(--carb)' }} />
          uglevod {d.c} g ({Math.round((e.c / sum) * 100)}%) · <span className="dot" style={{ background: 'var(--fat)' }} />
          yog‘ {d.f} g ({Math.round((e.f / sum) * 100)}%)
        </p>
        <p className="note caption-2">
          <PersonSimpleRun size={16} aria-hidden="true" />
          Shuncha energiya: taxminan {walk >= 60 ? `${Math.floor(walk / 60)} soat ${walk % 60} daqiqa` : `${walk} daqiqa`} tez yurish (70 kg odam)
        </p>
        <p className="body-6">{d.tip}</p>
        {d.light && (
          <p className="body-6 muted">
            Yengil varianti ilovada retsepti bilan: <b className="body-4">{d.light.name}</b>, {fmt(d.light.kcal)} kkal, oqsil {d.light.p} g.
          </p>
        )}
      </div>
    </li>
  );
}

const GI_LEVEL = (gi: number) => (gi <= 55 ? { cls: 'gi-low', t: 'past' } : gi < 70 ? { cls: 'gi-mid', t: 'o‘rta' } : { cls: 'gi-high', t: 'yuqori' });

function GiList({ rows }: { rows: GiRow[] }) {
  const [more, setMore] = useState(false);
  const shown = more ? rows : rows.slice(0, 12);
  return (
    <>
      <ul className="dish-list">
        {shown.map((r) => {
          const lv = GI_LEVEL(r.gi);
          const gl = Math.round((r.gi * ((r.c * r.g) / 100)) / 100);
          return (
            <li key={r.id} className="dish">
              <div className="dish-btn" style={{ cursor: 'default', gridTemplateColumns: 'minmax(0, 1fr) auto' }}>
                <span className="dish-mid">
                  <span className="title-3">{r.name}</span>
                  <span className="caption-5 faint">
                    {r.unit} ({r.g} g) · glikemik yuk {gl}
                    {r.as ? ` · jadvalda: ${r.as}` : ''}
                  </span>
                </span>
                <span className={`gi-badge caption-3 ${lv.cls}`}>
                  GI {r.gi} · {lv.t}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      {rows.length > 12 && (
        <button type="button" className="btn btn-ghost button-sm" onClick={() => setMore(!more)} aria-expanded={more}>
          {more ? 'Qisqartirish' : `Hammasini ko‘rsatish (${rows.length})`}
          <CaretDown size={14} aria-hidden="true" style={{ transform: more ? 'rotate(180deg)' : undefined }} />
        </button>
      )}
    </>
  );
}
