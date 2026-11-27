// Ilovadagi barcha ilmiy manbalar: ochiladigan ro‘yxat, qidiruv bilan (muallif, yil, jurnal yoki xulosa bo‘yicha).
import { ArrowUpRight, CaretDown, MagnifyingGlass } from '@phosphor-icons/react/ssr';
import { useId, useMemo, useState } from 'react';
import { useSiteData } from '../data';

const norm = (s: string) => s.toLowerCase().replace(/[‘’'`ʻʼ]/g, "'");

export function AllSources() {
  const { allSources } = useSiteData();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const listId = useId();
  const searchId = useId();
  const list = useMemo(() => {
    const nq = norm(q.trim());
    return nq ? allSources.filter((s) => norm(`${s.short} ${s.finding} ${s.cite}`).includes(nq)) : allSources;
  }, [allSources, q]);

  return (
    <div className="all-sources">
      <button type="button" className="btn btn-ghost button-md" aria-expanded={open} aria-controls={listId} onClick={() => setOpen(!open)}>
        {open ? 'Ro‘yxatni yopish' : `Barcha ${allSources.length} ta manbani ko‘rish`}
        <CaretDown size={16} aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 300ms var(--ease)' }} />
      </button>
      {open && (
        <div id={listId} className="panel src-panel">
          <div className="field">
            <label className="sr-only" htmlFor={searchId}>
              Manbalardan qidirish
            </label>
            <div className="input-wrap">
              <MagnifyingGlass size={18} className="input-ico" aria-hidden="true" />
              <input
                id={searchId}
                className="input search"
                type="search"
                placeholder="Masalan: oqsil, uyqu, Schoenfeld"
                autoComplete="off"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
          <span className="caption-4 faint" aria-live="polite">
            {list.length} ta manba
          </span>
          <ol className="src-list">
            {list.map((s) => (
              <li key={s.cite}>
                <span className="body-4">{s.short}</span>
                {s.finding && <p className="body-6 muted">{s.finding}</p>}
                <p className="caption-5 faint">{s.cite}</p>
                {s.doi && (
                  <a className="link caption-4" href={`https://doi.org/${s.doi}`} target="_blank" rel="noopener">
                    doi.org/{s.doi}
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
