// Mashqning tibbiy foydasi: tana siluetida foyda joylashgan nuqtalar navbatma-navbat yonadi.
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { BENEFITS } from '../data/catalog';
import { sourceById } from '../data/sources';
import { solveFront } from '../lib/figure';
import type { BenefitId } from '../types';
import { BodySilhouette } from './BodyMap';
import { Icon } from './ui/Icon';

export function BenefitMap({ items }: { items: { id: BenefitId; text: string }[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const sk = useMemo(() => solveFront({ ua: 166, fa: 170 }, 50, 214), []);
  useEffect(() => {
    if (paused || items.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % items.length), 4200);
    return () => clearInterval(id);
  }, [paused, items.length]);
  if (!items.length) return null;
  const cur = items[i % items.length];
  const info = BENEFITS[cur.id];
  const src = sourceById(info.source);
  return (
    <div className="card stack gap-12">
      <div className="row gap-12" style={{ alignItems: 'stretch' }}>
        <svg viewBox="0 18 100 204" style={{ width: 118, flex: 'none' }} role="img" aria-label="Foyda joylashuvi">
          <BodySilhouette sk={sk} back={false} />
          {items.map((b, k) => {
            const p = BENEFITS[b.id];
            const on = k === i % items.length;
            return (
              <g key={b.id} onClick={() => { setI(k); setPaused(true); }} style={{ cursor: 'pointer' }}>
                {on && (
                  <motion.circle cx={p.x} cy={p.y} r={6} fill="none" stroke="var(--green)" strokeWidth={1.5} initial={{ r: 4, opacity: 1 }} animate={{ r: 16, opacity: 0 }} transition={{ duration: 1.4, repeat: Infinity }} />
                )}
                <circle cx={p.x} cy={p.y} r={on ? 5 : 3.5} fill={on ? 'var(--green)' : 'var(--text-3)'} stroke="var(--surface)" strokeWidth={1.5} />
              </g>
            );
          })}
        </svg>
        <div className="grow stack gap-8" style={{ minHeight: 170 }}>
          <AnimatePresence mode="wait">
            <motion.div key={cur.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="stack gap-8">
              <span className="row gap-8" style={{ color: 'var(--green)' }}>
                <Icon name={info.icon} size={20} />
                <span className="strong" style={{ color: 'var(--text)' }}>
                  {info.name}
                </span>
              </span>
              <p style={{ fontSize: 15 }}>{cur.text}</p>
              <p className="small muted">{info.text}</p>
              {src && <span className="tiny faint">Manba: {src.short}</span>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {items.length > 1 && (
        <div className="row center">
          {items.map((b, k) => (
            <button
              key={b.id}
              onClick={() => {
                setI(k);
                setPaused(true);
              }}
              aria-label={BENEFITS[b.id].name}
              aria-pressed={k === i % items.length}
              style={{ padding: '14px 4px' }}
            >
              <span style={{ display: 'block', width: k === i % items.length ? 22 : 8, height: 8, borderRadius: 4, background: k === i % items.length ? 'var(--green)' : 'var(--surface-3)', transition: 'all .25s' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
