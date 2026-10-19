import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BodyMap } from '../components/BodyMap';
import { ExerciseThumb } from '../components/ExerciseThumb';
import { Icon } from '../components/ui/Icon';
import { Segmented, Toggle } from '../components/ui/controls';
import { MUSCLES } from '../data/catalog';
import { EXERCISES } from '../data/exercises';
import { LESSONS } from '../data/lessons';
import { hasEquipment } from '../engine/program';
import { useStore } from '../store/useStore';
import type { MuscleId } from '../types';

const AREAS: { k: string; label: string; muscles: MuscleId[] }[] = [
  { k: 'all', label: 'Hammasi', muscles: [] },
  { k: 'chest', label: "Ko‘krak", muscles: ['chest'] },
  { k: 'back', label: 'Orqa', muscles: ['lats', 'upperBack', 'traps', 'lowerBack'] },
  { k: 'shoulders', label: 'Yelka', muscles: ['frontDelts', 'sideDelts', 'rearDelts'] },
  { k: 'arms', label: "Qo‘llar", muscles: ['biceps', 'triceps', 'forearms'] },
  { k: 'legs', label: 'Oyoqlar', muscles: ['quads', 'hamstrings', 'glutes', 'adductors', 'calves'] },
  { k: 'core', label: 'Press', muscles: ['abs', 'obliques'] },
];

export default function Library() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'lessons' ? 'lessons' : 'exercises';
  return (
    <div className="page">
      <div className="page-head">
        <h1 className="display">{tab === 'lessons' ? 'Darslar' : 'Mashqlar'}</h1>
      </div>
      <Segmented
        label="Bo‘lim"
        value={tab}
        onChange={(v) => setParams(v === 'lessons' ? { tab: 'lessons' } : {}, { replace: true })}
        options={[
          { value: 'exercises', label: 'Mashqlar' },
          { value: 'lessons', label: 'Darsliklar' },
        ]}
      />
      <div className="mt-16">{tab === 'lessons' ? <Lessons /> : <Exercises />}</div>
    </div>
  );
}

function Exercises() {
  const profile = useStore((s) => s.profile);
  const [q, setQ] = useState('');
  const [area, setArea] = useState('all');
  const [picked, setPicked] = useState<MuscleId[]>([]);
  const [mine, setMine] = useState(!!profile);
  const [showMap, setShowMap] = useState(false);
  const list = useMemo(() => {
    const areaM = AREAS.find((a) => a.k === area)?.muscles ?? [];
    const filterM = picked.length ? picked : areaM;
    return EXERCISES.filter((e) => {
      if (q && !(e.name + ' ' + e.en).toLowerCase().includes(q.toLowerCase())) return false;
      if (filterM.length && !e.primary.some((m) => filterM.includes(m))) return false;
      if (mine && profile && !hasEquipment(e, profile.equipment)) return false;
      return true;
    }).sort((a, b) => b.score - a.score);
  }, [q, area, picked, mine, profile]);

  return (
    <div className="stack gap-12">
      <div className="row gap-8">
        <div className="grow" style={{ position: 'relative' }}>
          <Icon name="search" size={18} style={{ position: 'absolute', left: 14, top: 16, color: 'var(--text-3)' }} />
          <input className="input" style={{ paddingLeft: 40 }} placeholder="Mashq nomi (o‘zbekcha yoki inglizcha)" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Mashq qidirish" />
        </div>
        <button className={`icon-btn ${showMap ? 'filled' : ''}`} style={{ width: 50, height: 50, border: '1px solid var(--line)' }} onClick={() => setShowMap((v) => !v)} aria-label="Tana xaritasi" aria-pressed={showMap}>
          <Icon name="user" />
        </button>
      </div>

      {showMap && (
        <div className="card">
          <p className="small muted" style={{ marginBottom: 8 }}>
            Mushakka bosing — unga mos mashqlar chiqadi.
          </p>
          <BodyMap selected={picked} onSelect={(m) => setPicked((p) => (p.includes(m) ? p.filter((x) => x !== m) : [...p, m]))} height={230} />
          {picked.length > 0 && (
            <div className="row wrap gap-6 mt-12">
              {picked.map((m) => (
                <button key={m} className="chip sm on" onClick={() => setPicked((p) => p.filter((x) => x !== m))}>
                  {MUSCLES[m].name} <Icon name="x" size={12} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="hscroll">
        {AREAS.map((a) => (
          <button
            key={a.k}
            className={`chip ${area === a.k && !picked.length ? 'on' : ''}`}
            onClick={() => {
              setArea(a.k);
              setPicked([]);
            }}
          >
            {a.label}
          </button>
        ))}
      </div>

      {profile && (
        <label className="row between small" style={{ padding: '4px 2px' }}>
          <span className="muted">Faqat zalimdagi jihozlar bilan</span>
          <Toggle on={mine} onChange={setMine} label="Faqat zalimdagi jihozlar" />
        </label>
      )}

      <div className="tiny faint">{list.length} ta mashq</div>
      <div className="stack gap-8">
        {list.map((e) => (
          <Link key={e.id} to={`/exercise/${e.id}`} className="card tight row gap-12" style={{ color: 'inherit' }}>
            <ExerciseThumb ex={e} size={72} />
            <div className="grow" style={{ minWidth: 0 }}>
              <div className="strong" style={{ lineHeight: 1.25 }}>
                {e.name}
              </div>
              <div className="tiny faint">{e.en}</div>
              <div className="row wrap gap-4 mt-8">
                {e.primary.slice(0, 2).map((m) => (
                  <span key={m} className="tag">
                    <i className="dot" style={{ background: 'var(--muscle-primary)', width: 6, height: 6 }} />
                    {MUSCLES[m].name}
                  </span>
                ))}
                <span className="tag">{['', 'Oson', "O‘rta", 'Murakkab'][e.level]}</span>
              </div>
            </div>
            <Icon name="right" size={18} style={{ color: 'var(--text-3)' }} />
          </Link>
        ))}
        {list.length === 0 && <div className="empty">Bu filtrga mos mashq yo‘q. Filtrlarni o‘zgartiring.</div>}
      </div>
    </div>
  );
}

function Lessons() {
  const done = useStore((s) => s.lessonsDone);
  const cats = Array.from(new Set(LESSONS.map((l) => l.category)));
  return (
    <div className="stack gap-20">
      <div className="card row gap-12">
        <div className="grow">
          <div className="strong">Bilim — natijaning yarmi</div>
          <div className="small muted mt-4">
            {done.length} / {LESSONS.length} dars tugatildi
          </div>
        </div>
        <div style={{ width: 90 }} className="progress">
          <i style={{ width: `${(done.length / LESSONS.length) * 100}%`, background: 'var(--green)' }} />
        </div>
      </div>
      {cats.map((c) => (
        <div key={c} className="stack gap-8">
          <div className="eyebrow">{c}</div>
          {LESSONS.filter((l) => l.category === c).map((l) => {
            const isDone = done.includes(l.id);
            return (
              <Link key={l.id} to={`/lesson/${l.id}`} className="card tight row gap-12" style={{ color: 'inherit' }}>
                <span
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: `var(--plate-${l.plate})`,
                    display: 'grid',
                    placeItems: 'center',
                    flex: 'none',
                    color: l.plate === 'white' || l.plate === 'yellow' ? '#111' : '#fff',
                  }}
                >
                  <Icon name={l.icon} />
                </span>
                <div className="grow" style={{ minWidth: 0 }}>
                  <div className="strong">{l.title}</div>
                  <div className="tiny faint mt-4">
                    {l.slides.length} slayd · {l.minutes} daq · {l.summary}
                  </div>
                </div>
                {isDone ? <Icon name="check" size={20} style={{ color: 'var(--green)' }} /> : <Icon name="play" size={16} style={{ color: 'var(--text-3)' }} />}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
