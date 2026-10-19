// Tana o'lchamlari: bel/bo'y nisbati shkalasi, US Navy yog' foizi, har o'lchamning 4 haftalik o'zgarishi va kiritish oynasi.
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MEASURES, latestBodyFat, measureTrend, whtr, whtrZone, WHTR_ZONES, type MeasureKey } from '../engine/bodycomp';
import { fmtDate, isoDate } from '../lib/date';
import { useStore } from '../store/useStore';
import { LineChart } from './charts';
import { Icon } from './ui/Icon';
import { Sheet } from './ui/Sheet';
import { Stepper } from './ui/controls';

const SCALE = [0.35, 0.7] as const;
const TONE = { good: 'var(--green)', warn: 'var(--yellow)', bad: 'var(--red)' } as const;
const pos = (r: number) => Math.min(100, Math.max(0, ((r - SCALE[0]) / (SCALE[1] - SCALE[0])) * 100));

export function BodyStats() {
  const body = useStore((s) => s.body);
  const profile = useStore((s) => s.profile)!;
  const [open, setOpen] = useState(false);
  const rows = useMemo(() => MEASURES.map((m) => ({ ...m, t: measureTrend(body, m.key) })).filter((r) => r.t), [body]);
  const waist = rows.find((r) => r.key === 'waistCm')?.t;
  const ratio = waist ? whtr(waist.last, profile.heightCm) : null;
  const zone = ratio ? whtrZone(ratio) : null;
  const bf = useMemo(() => latestBodyFat(body, profile.sex, profile.heightCm), [body, profile.sex, profile.heightCm]);
  const waistSeries = body.filter((b) => b.waistCm).map((b) => ({ t: new Date(b.date + 'T00:00:00').getTime(), v: b.waistCm! }));
  // yog' foizi trendi uchun 4 hafta oldingi holat
  const bfPrev = useMemo(() => {
    const last = waist?.date;
    if (!last) return null;
    const cutoff = isoDate(new Date(Date.parse(last + 'T00:00:00') - 28 * 86400000));
    return latestBodyFat(body.filter((b) => b.date <= cutoff), profile.sex, profile.heightCm);
  }, [body, waist?.date, profile.sex, profile.heightCm]);

  return (
    <div className="card stack gap-16">
      <div className="row between">
        <span className="strong">Tana o‘lchamlari</span>
        <button className="btn btn-secondary btn-xs" onClick={() => setOpen(true)}>
          <Icon name="ruler" size={14} /> O‘lchash
        </button>
      </div>

      {!rows.length ? (
        <p className="small muted">
          Haftada bir marta, ertalab, bir xil sharoitda lenta bilan o‘lchang. Bel o‘lchami vazndan ko‘ra ko‘proq aytadi: <b>bel bo‘yingizning yarmidan kam bo‘lsa</b> — yurak-qon tomir xavfi past (Ashwell 2012). Bel + bo‘yin (ayollarda + son) bo‘yicha yog‘ foizi ham hisoblanadi.
        </p>
      ) : (
        <>
          <div className="grid-2">
            {ratio && zone && (
              <div className="stack gap-4">
                <span className="tiny muted">Bel / bo‘y</span>
                <span className="num" style={{ fontSize: 26, fontWeight: 800 }}>
                  {/* chegaraga juda yaqin bo'lsa — 3 xona, aks holda "0.50 · Sog'lom" chalg'itadi */}
                  {[0.4, 0.5, 0.6].some((b) => Math.abs(ratio - b) < 0.005) ? ratio.toFixed(3) : ratio.toFixed(2)}
                </span>
                <span className="tiny strong" style={{ color: TONE[zone.tone] }}>
                  {zone.name}
                </span>
              </div>
            )}
            <div className="stack gap-4">
              <span className="tiny muted">Yog‘ foizi (US Navy)</span>
              <span className="num" style={{ fontSize: 26, fontWeight: 800 }}>
                {bf !== null ? `${bf}%` : '—'}
              </span>
              <span className="tiny faint">
                {bf === null ? (profile.sex === 'female' ? 'bel, bo‘yin va son kerak' : 'bel va bo‘yin kerak') : bfPrev !== null ? `4 haftada ${bf - bfPrev > 0 ? '+' : ''}${Math.round((bf - bfPrev) * 10) / 10}%` : '±3–4% aniqlik'}
              </span>
            </div>
          </div>

          {ratio && (
            <div className="stack gap-6">
              <div className="whtr-scale" role="img" aria-label={`Bel/bo‘y nisbati ${ratio.toFixed(2)}: ${zone?.name}`}>
                {WHTR_ZONES.map((z, i) => {
                  const lo = i === 0 ? SCALE[0] : WHTR_ZONES[i - 1].max;
                  const hi = Math.min(SCALE[1], z.max);
                  return <i key={z.name} style={{ flex: Math.round((hi - lo) * 1000), background: TONE[z.tone], opacity: z.tone === 'good' ? 0.9 : 0.55 }} />;
                })}
                <b style={{ left: `${pos(ratio)}%` }} />
              </div>
              <div className="whtr-ticks tiny faint num" aria-hidden="true">
                {[0.35, 0.4, 0.5, 0.6, 0.7].map((t) => (
                  <span key={t} style={{ left: `${pos(t)}%` }}>
                    {t.toFixed(2)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {waistSeries.length >= 2 && <LineChart label="Bel o‘lchami" series={waistSeries} unit="sm" height={110} fmtX={(t) => fmtDate(new Date(t))} />}

          <div className="stack" style={{ gap: 0 }}>
            {rows.map((r) => {
              const d = r.t!.delta;
              const good = d === null || d === 0 ? null : r.key === 'waistCm' ? d < 0 : r.key === 'armCm' || r.key === 'chestCm' ? d > 0 : null;
              return (
                <div key={r.key} className="row between small" style={{ padding: '9px 0', borderTop: '1px solid var(--line)' }}>
                  <span>{r.name}</span>
                  <span className="num">
                    <b>{r.t!.last} sm</b>
                    {d !== null && (
                      <span style={{ marginLeft: 8, color: good === null ? 'var(--text-2)' : good ? 'var(--green)' : 'var(--yellow)' }}>
                        {d > 0 ? '+' : ''}
                        {d}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="tiny faint">
            O‘zgarish — taxminan 4 hafta oldingi o‘lchovga nisbatan. Oxirgi o‘lchov: {fmtDate(rows[0].t!.date)}.{' '}
            <Link to="/lesson/tdee-body" className="strong" style={{ color: 'var(--blue-2)' }}>
              Nega bel muhim?
            </Link>
          </p>
        </>
      )}
      <MeasureSheet open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function MeasureSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const body = useStore((s) => s.body);
  const profile = useStore((s) => s.profile)!;
  const addBody = useStore((s) => s.addBody);
  const male = profile.sex === 'male';
  const defaults: Record<MeasureKey, number> = {
    waistCm: Math.round(profile.heightCm * 0.47),
    neckCm: male ? 38 : 32,
    hipCm: male ? 98 : 100,
    chestCm: male ? 100 : 90,
    armCm: male ? 33 : 28,
    thighCm: male ? 56 : 56,
  };
  const init = () => Object.fromEntries(MEASURES.map((m) => [m.key, measureTrend(body, m.key)?.last ?? defaults[m.key]])) as Record<MeasureKey, number>;
  const [vals, setVals] = useState(init);
  const [touched, setTouched] = useState<Set<MeasureKey>>(new Set());
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setVals(init());
      setTouched(new Set());
    }
  }
  const save = () => {
    const e: Partial<Record<MeasureKey, number>> = {};
    touched.forEach((k) => (e[k] = vals[k]));
    addBody({ date: isoDate(), ...e });
    onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} label="Tana o‘lchamlari">
      <h3 className="title">Bugungi o‘lchamlar</h3>
      <p className="small muted mt-4">Faqat o‘zgartirgan o‘lchamlaringiz saqlanadi. Lenta teriga tegib tursin, lekin botib kirmasin.</p>
      <div className="stack gap-12 mt-16">
        {MEASURES.map((m) => (
          <div key={m.key} className="stack gap-6">
            <span className="row between small">
              <b>{m.name}</b>
              {touched.has(m.key) && <span className="tiny" style={{ color: 'var(--green)' }}>yangi</span>}
            </span>
            <Stepper
              value={vals[m.key]}
              onChange={(v) => {
                setVals({ ...vals, [m.key]: v });
                setTouched(new Set(touched).add(m.key));
              }}
              step={0.5}
              min={15}
              max={200}
              unit="sm"
              label={m.name}
            />
            <span className="tiny faint">{m.how}</span>
          </div>
        ))}
      </div>
      <button className="btn btn-primary btn-block mt-16" disabled={!touched.size} onClick={save}>
        {touched.size ? `Saqlash (${touched.size} ta)` : 'O‘lchamni o‘zgartiring'}
      </button>
    </Sheet>
  );
}
