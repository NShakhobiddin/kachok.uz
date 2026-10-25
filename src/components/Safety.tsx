// Xavfsizlik: xavf darajasi ko'rsatkichi, mashq sahifasidagi bo'lim, shaxsiy ogohlantirish, mashg'ulotdagi setdan oldingi ro'yxat.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { INJURIES } from '../data/catalog';
import { RISK_INFO, safetyFor, type ExerciseSafety, type Risk } from '../data/safety';
import { personalSafety } from '../engine/safety';
import type { Exercise, Injury } from '../types';
import { Icon } from './ui/Icon';

export const injuryName = (i: Injury) => INJURIES.find((x) => x.id === i)?.name ?? i;

export const FAILURE_TEXT: Record<NonNullable<ExerciseSafety['failure']>, string> = {
  spot: 'Chegaragacha (RIR 0) faqat rama to‘sinlari, to‘xtatgichlar yoki sug‘urtachi bilan. Yolg‘iz bo‘lsangiz 1–2 takror zaxira qoldiring.',
  form: 'Chegaragacha (RIR 0) bormang: oxirgi takrorlarda texnika buzilib, bel xavf ostida qoladi. 1–2 takror zaxira qoldiring.',
};

export function RiskMeter({ risk, size = 'm' }: { risk: Risk; size?: 's' | 'm' }) {
  const info = RISK_INFO[risk];
  return (
    <span className={`risk-meter ${size}`} role="img" aria-label={`Xavf darajasi: ${info.name}`}>
      {[1, 2, 3].map((n) => (
        <i key={n} style={{ background: n <= risk ? info.color : undefined }} />
      ))}
    </span>
  );
}

export function RiskTag({ risk, label = true }: { risk: Risk; label?: boolean }) {
  const info = RISK_INFO[risk];
  return (
    <span
      className="tag"
      style={{
        color: info.color,
        borderColor: 'transparent',
        background: info.soft,
      }}
    >
      <RiskMeter risk={risk} size="s" />
      {label && `${info.name} xavf`}
    </span>
  );
}

/** Mashq sahifasining yuqorisida: foydalanuvchining cheklovlariga mos ogohlantirish */
export function PersonalSafetyNotice({ ex, injuries }: { ex: Exercise; injuries: Injury[] }) {
  const ps = personalSafety(ex, injuries);
  if (!ps.level) return null;
  const mod = (i: Injury) => ps.joints.find((j) => j.at === i)?.mod;
  const names = (l: Injury[]) => l.map((i) => injuryName(i).toLowerCase()).join(', ');
  return (
    <div className="stack gap-8 mt-12">
      {ps.avoid.length > 0 && (
        <div className="notice warn">
          <Icon name="alert" />
          <span>
            <b>Sizga tavsiya etilmaydi</b> — {names(ps.avoid)} muammosi tufayli.
            {ps.avoid.map((i) => {
              const m = mod(i)?.replace(/^Tavsiya etilmaydi:\s*/, '');
              return m ? (
                <span key={i} style={{ display: 'block', marginTop: 4 }}>
                  <b>Muqobil:</b> {m}
                </span>
              ) : null;
            })}
          </span>
        </div>
      )}
      {ps.caution.length > 0 && (
        <div className="notice gold">
          <Icon name="info" />
          <span>
            <b>Ehtiyotkorlik bilan</b> — {names(ps.caution)} muammosi bor.
            {ps.caution.map((i) =>
              mod(i) ? (
                <span key={i} style={{ display: 'block', marginTop: 4 }}>
                  <b>{injuryName(i)}:</b> {mod(i)}
                </span>
              ) : null,
            )}
            {!ps.caution.some(mod) && ' Yengil vazn, og‘riqsiz amplituda.'}
          </span>
        </div>
      )}
    </div>
  );
}

/** Mashq sahifasidagi "Xavfsizlik" bo'limi */
export function SafetySection({ ex, injuries }: { ex: Exercise; injuries: Injury[] }) {
  const s = safetyFor(ex.id);
  if (!s) return null;
  const info = RISK_INFO[s.risk];
  const joints = [...s.joints].sort((a, b) => Number(injuries.includes(b.at)) - Number(injuries.includes(a.at)));
  return (
    <section className="section" id="safety" style={{ scrollMarginTop: 16 }}>
      <div className="section-head">
        <h2>Xavfsizlik</h2>
        <span className="small muted">travmaning oldini olish</span>
      </div>
      <div className="card stack gap-16">
        <div className="row gap-12" style={{ alignItems: 'flex-start' }}>
          <RiskMeter risk={s.risk} />
          <div className="grow" style={{ minWidth: 0 }}>
            <div className="strong" style={{ color: info.color }}>
              {info.name} xavf
            </div>
            <p className="small mt-4">{s.why}</p>
          </div>
        </div>
        {s.failure && (
          <div className={`notice ${s.failure === 'form' ? 'warn' : 'gold'} small`}>
            <Icon name="alert" size={18} />
            <span>{FAILURE_TEXT[s.failure]}</span>
          </div>
        )}
        <div>
          <div className="eyebrow">Setdan oldin tekshiring</div>
          <ul className="safe-list mt-8">
            {s.check.map((c) => (
              <li key={c}>
                <Icon name="shield" size={16} />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
        {s.bail && (
          <div className="notice info small">
            <Icon name="down" size={18} />
            <span>
              <b>Ko‘tara olmasangiz:</b> {s.bail}
            </span>
          </div>
        )}
      </div>

      {joints.length > 0 && (
        <div className="stack gap-8 mt-12">
          <div className="eyebrow">Xavf ostidagi bo‘g‘imlar</div>
          {joints.map((j) => {
            const mine = injuries.includes(j.at);
            return (
              <div key={j.at} className="card tight stack gap-8" style={mine ? { borderColor: 'rgba(255, 200, 61, 0.45)' } : undefined}>
                <div className="row gap-8">
                  <Icon
                    name="joint"
                    size={18}
                    style={{
                      color: mine ? 'var(--yellow)' : 'var(--text-3)',
                      flex: 'none',
                    }}
                  />
                  <span className="strong">{injuryName(j.at)}</span>
                  {mine && (
                    <span
                      className="tag"
                      style={{
                        color: 'var(--yellow)',
                        background: 'var(--yellow-soft)',
                        borderColor: 'transparent',
                      }}
                    >
                      sizda cheklov
                    </span>
                  )}
                </div>
                <p className="small muted">{j.how}</p>
                <p className="small">
                  <b>Muammo bo‘lsa:</b> {j.mod}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="card mt-12 stack gap-8" style={{ borderColor: 'rgba(240, 71, 59, 0.35)' }}>
        <div className="row gap-8">
          <Icon name="alert" size={18} style={{ color: 'var(--red)' }} />
          <span className="strong">Darhol to‘xtang, agar:</span>
        </div>
        <ul className="stop-list">
          {s.stop.map((x) => (
            <li key={x} className="small">
              {x}
            </li>
          ))}
        </ul>
        <Link to="/safety" className="small strong row gap-6" style={{ color: 'var(--blue-2)', minHeight: 36 }}>
          Og‘riq shkalasi va barcha xavf belgilari <Icon name="right" size={14} />
        </Link>
      </div>
    </section>
  );
}

/** Mashg'ulotda: birinchi ishchi setdan oldin qisqa xavfsizlik ro'yxati */
export function PreSetCheck({ ex, injuries, onDone }: { ex: Exercise; injuries: Injury[]; onDone: () => void }) {
  const s = safetyFor(ex.id);
  const [ticked, setTicked] = useState<number[]>([]);
  const [bail, setBail] = useState(false);
  if (!s) return null;
  const ps = personalSafety(ex, injuries);
  const toggle = (i: number) => setTicked((t) => (t.includes(i) ? t.filter((x) => x !== i) : [...t, i]));
  return (
    <div className="card tight stack gap-10 preset-card" role="region" aria-label="Setdan oldin xavfsizlik">
      <div className="row between gap-8">
        <span className="row gap-8">
          <Icon name="shield" size={18} style={{ color: RISK_INFO[s.risk].color }} />
          <b className="small">Setdan oldin</b>
          <RiskTag risk={s.risk} />
        </span>
        <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={onDone} aria-label="Yopish">
          <Icon name="x" size={16} />
        </button>
      </div>
      {ps.joints.map((j) => (
        <p key={j.at} className="tiny" style={{ color: 'var(--yellow)' }}>
          <b>{injuryName(j.at)}:</b> {j.mod}
        </p>
      ))}
      {ps.avoid.length > 0 && !ps.joints.length && (
        <p className="tiny" style={{ color: 'var(--red)' }}>
          {ps.avoid.map(injuryName).join(', ')} cheklovingiz bilan tavsiya etilmaydi — almashtirishni o‘ylab ko‘ring.
        </p>
      )}
      <div className="stack" style={{ gap: 2 }}>
        {s.check.map((c, i) => {
          const on = ticked.includes(i);
          return (
            <button key={c} className={`check-row ${on ? 'on' : ''}`} onClick={() => toggle(i)} aria-pressed={on}>
              <span className="check-box">{on && <Icon name="check" size={13} stroke={3} />}</span>
              <span className="small">{c}</span>
            </button>
          );
        })}
      </div>
      {s.failure === 'spot' && <p className="tiny muted">{FAILURE_TEXT.spot}</p>}
      {s.bail && (
        <>
          <button className="small strong row gap-6" style={{ color: 'var(--blue-2)', minHeight: 32 }} onClick={() => setBail((b) => !b)} aria-expanded={bail}>
            Ko‘tara olmasangiz nima qilasiz? <Icon name={bail ? 'up' : 'down'} size={14} />
          </button>
          {bail && <p className="small">{s.bail}</p>}
        </>
      )}
      <button className="btn btn-secondary btn-sm btn-block" onClick={onDone}>
        <Icon name="check" size={16} stroke={3} /> {ticked.length === s.check.length ? 'Hammasi tayyor' : 'Tushunarli'}
      </button>
    </div>
  );
}
