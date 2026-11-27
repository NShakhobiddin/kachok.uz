// Umumiy bo‘laklar: telefon ramkasi, asosiy tugma, raqamli maydon, tanlov tugmalari.
import { Check, TelegramLogo } from '@phosphor-icons/react/ssr';
import { useEffect, useId, useState, type ReactNode, type RefObject } from 'react';
import { asset, botUrl } from './links';

/** Ilovaning haqiqiy ekrani (scripts/site-shots bilan olingan) */
export function Phone({ shot, alt, eager = false }: { shot: string; alt: string; eager?: boolean }) {
  return (
    <div className="phone">
      <img
        src={asset(`shots/${shot}.webp`)}
        width={390}
        height={844}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={eager ? 'high' : 'auto'}
      />
    </div>
  );
}

/** Asosiy harakat: Telegram’da Mini App’ni ochish */
export function BotButton({ from, children = 'Telegram’da bepul boshlash', size = 'lg' }: { from: string; children?: ReactNode; size?: 'lg' | 'md' | 'sm' }) {
  return (
    <a className={`btn btn-primary ${size === 'lg' ? 'btn-lg button-lg' : size === 'md' ? 'button-md' : 'button-sm'}`} href={botUrl(from)} target="_blank" rel="noopener">
      <TelegramLogo size={size === 'lg' ? 22 : 18} weight="fill" aria-hidden="true" />
      {children}
    </a>
  );
}

export function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li>
      <span className="ico-round lime" aria-hidden="true">
        <Check size={14} weight="bold" />
      </span>
      <span className="body-3 muted">{children}</span>
    </li>
  );
}

/** Raqam kiritish: tekshiruv bilan; ↑/↓ tugmalari qadam bilan o‘zgartiradi */
export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  error?: string | null;
}) {
  const id = useId();
  const n = Number(value.replace(',', '.'));
  const bump = (d: number) => {
    const base = Number.isFinite(n) && value.trim() !== '' ? n : min;
    const next = Math.min(max, Math.max(min, Math.round((base + d) / step) * step));
    onChange(String(Math.round(next * 10) / 10));
  };
  return (
    <div className="field">
      <label className="field-label caption-1" htmlFor={id}>
        {label}
      </label>
      <div className="input-wrap">
        <input
          id={id}
          className="input"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-e` : undefined}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.,]/g, '').slice(0, 5))}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') (e.preventDefault(), bump(step));
            if (e.key === 'ArrowDown') (e.preventDefault(), bump(-step));
          }}
        />
        {unit && <span className="input-unit caption-2">{unit}</span>}
      </div>
      {error && (
        <span id={`${id}-e`} className="err caption-4" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

/** Raqamni tekshirish: noto‘g‘ri bo‘lsa — xato matni */
export function parseNum(v: string, min: number, max: number, what: string): { n: number; err: string | null } {
  const n = Number(v.replace(',', '.'));
  if (v.trim() === '') return { n: NaN, err: `${what}ni kiriting` };
  if (!Number.isFinite(n) || n < min || n > max) return { n: NaN, err: `${what} ${min} dan ${max} gacha bo‘lishi kerak` };
  return { n, err: null };
}

/** Bir nechtasidan bittasini tanlash (radio guruh) */
export function Seg<T extends string | number>({ label, value, options, onChange }: { label: string; value: T; options: { v: T; t: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="field">
      <span className="field-label caption-1">{label}</span>
      <div className="seg" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={String(o.v)} type="button" role="radio" aria-checked={o.v === value} className="button-sm" onClick={() => onChange(o.v)}>
            {o.t}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Chips<T extends string | number>({ label, value, options, onChange, hideLabel }: { label: string; value: T; options: { v: T; t: string }[]; onChange: (v: T) => void; hideLabel?: boolean }) {
  return (
    <div className="field">
      <span className={hideLabel ? 'sr-only' : 'field-label caption-1'}>{label}</span>
      <div className="chips" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={String(o.v)} type="button" role="radio" aria-checked={o.v === value} className="chip button-sm" onClick={() => onChange(o.v)}>
            {o.t}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Telefonda yonga suriladigan kartochkalar qatori (.swipe) uchun nuqtalar: qaysi kartochka ko‘rinib turibdi */
export function SwipeDots({ target, count }: { target: RefObject<HTMLElement | null>; count: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const first = el.firstElementChild as HTMLElement | null;
        if (!first) return;
        const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0');
        // oxiriga yetganda — oxirgi nuqta (oxirgi kartochka chapga to‘liq kelmaydi)
        const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
        setI(end ? count - 1 : Math.round(el.scrollLeft / Math.max(1, step)));
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [target, count]);
  return (
    <div className="swipe-dots" aria-hidden="true">
      {Array.from({ length: count }, (_, k) => (
        <i key={k} className={k === i ? 'on' : ''} />
      ))}
    </div>
  );
}
