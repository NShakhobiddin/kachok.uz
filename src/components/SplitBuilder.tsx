// Kunlar taqsimoti: har mashg'ulot kuniga mushak guruhlarini tanlash (mashqlarni dastur o'zi tanlaydi).
import { GROUP_ORDER } from '../data/catalog';
import { SPLIT_PRESETS, splitAdvice, splitDayTitle, type DaySplit } from '../engine/split';
import { DAYS } from '../lib/date';
import type { MuscleGroup } from '../types';
import { Icon } from './ui/Icon';

/** tugmadagi qisqa nom (orqa — "qanot"lar bilan, chunki zalda shunday deyiladi) */
const CHIP: Record<MuscleGroup, string> = {
  chest: 'Ko‘krak',
  back: 'Orqa (qanot)',
  shoulders: 'Yelka',
  biceps: 'Bitseps',
  triceps: 'Triseps',
  quads: 'Son oldi',
  hamstrings: 'Son orqasi',
  glutes: 'Dumba',
  calves: 'Boldir',
  core: 'Press',
};

const same = (a: DaySplit, b: DaySplit) => a.length === b.length && a.every((d, i) => d.length === b[i].length && d.every((g) => b[i].includes(g)));

export function SplitBuilder({ value, onChange, trainingDays, sessionMin }: { value: DaySplit; onChange: (v: DaySplit) => void; trainingDays: number[]; sessionMin: number }) {
  const presets = SPLIT_PRESETS[value.length] ?? [];
  const wd = trainingDays.length === value.length ? [...trainingDays].sort((a, b) => a - b) : null;
  const hints = splitAdvice(value, trainingDays, sessionMin);
  const toggle = (i: number, g: MuscleGroup) =>
    onChange(value.map((d, k) => (k !== i ? d : d.includes(g) ? d.filter((x) => x !== g) : GROUP_ORDER.filter((x) => x === g || d.includes(x)))));

  return (
    <div className="stack gap-12">
      <div className="stack gap-6">
        <span className="tiny strong muted">Tayyor variantlar</span>
        <div className="hscroll" style={{ gap: 6 }}>
          {presets.map((pr) => (
            <button key={pr.name} className={`chip sm ${same(pr.days, value) ? 'on' : ''}`} onClick={() => onChange(pr.days.map((d) => [...d]))}>
              {pr.name}
            </button>
          ))}
        </div>
      </div>

      {value.map((groups, i) => (
        <div key={i} className="card stack gap-8" style={{ padding: 14 }}>
          <div className="row between gap-8">
            <span className="strong">
              {i + 1}-kun{wd ? ` · ${DAYS[wd[i]]}` : ''}
            </span>
            <span className="small muted" style={{ textAlign: 'right' }}>
              {groups.length ? splitDayTitle(groups) : 'mushak tanlang'}
            </span>
          </div>
          <div className="row wrap" style={{ gap: 6 }} role="group" aria-label={`${i + 1}-kun mushaklari`}>
            {GROUP_ORDER.map((g) => {
              const on = groups.includes(g);
              return (
                <button key={g} className={`chip sm ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => toggle(i, g)}>
                  {CHIP[g]}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {hints.length > 0 && (
        <div className="stack gap-6">
          {hints.map((h) => (
            <div key={h.text} className={`notice ${h.level === 'warn' ? 'warn' : 'info'} small`}>
              <Icon name={h.level === 'warn' ? 'alert' : 'info'} size={16} />
              <span>{h.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
