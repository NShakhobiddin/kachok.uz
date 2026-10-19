// Kuch darajasi: asosiy mashqlar bo'yicha musobaqa disklari rangidagi daraja (oq 5 → yashil 10 → sariq 15 → ko'k 20 → qizil 25).
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fmtKg } from '../engine/progression';
import { LEVELS, liftLevel, strengthProfile, thresholds, type LiftId } from '../engine/standards';
import { useStore } from '../store/useStore';
import { PlateBadge } from './Barbell';

/** 5 bo'lakli daraja chizig'i: har bo'lak — bir daraja, marker — siz */
export function LevelBar({ score }: { score: number }) {
  return (
    <div className="level-bar" role="img" aria-label={`Daraja: ${score.toFixed(1)} / 5`}>
      {LEVELS.map((l, i) => {
        const fill = Math.max(0, Math.min(1, score - i));
        return (
          <span key={l.id} className="level-seg">
            <i style={{ width: `${fill * 100}%`, background: l.plate }} />
          </span>
        );
      })}
    </div>
  );
}

const unit = (lift: LiftId) => (lift === 'pullup' ? 'takror' : 'kg');

export function StrengthLevels() {
  const logs = useStore((s) => s.logs);
  const profile = useStore((s) => s.profile)!;
  const rows = useMemo(() => strengthProfile(logs, profile.sex, profile.weightKg), [logs, profile.sex, profile.weightKg]);
  const have = rows.filter((r) => r.data);
  if (!have.length)
    return (
      <div className="card small muted">
        Asosiy mashqlar (o‘tirib-turish, yotib jim, o‘lik tortish, tik turib jim, shtanga tortish, turnik) bajarilgach, bu yerda kuch darajangiz va dunyo bo‘yicha o‘rningiz chiqadi.
      </div>
    );
  const avg = have.reduce((a, r) => a + r.data!.score, 0) / have.length;
  const overall = LEVELS[Math.min(4, Math.max(0, Math.floor(avg) - (avg >= 1 ? 1 : 0)))];
  return (
    <div className="card stack gap-16">
      <div className="row gap-12">
        <PlateBadge color={overall.plate} size={52} />
        <div className="grow">
          <div className="tiny muted">Umumiy kuch darajasi</div>
          <div className="display display-m">{avg < 1 ? 'Boshlovchidan oldin' : overall.name}</div>
        </div>
      </div>
      {have.map((r) => {
        const d = r.data!;
        return (
          <Link key={r.id} to={`/exercise/${r.exerciseId}`} className="stack gap-6" style={{ color: 'inherit' }}>
            <div className="row between small">
              <span className="strong">{r.name}</span>
              <span className="num">
                {r.id === 'pullup' ? `${d.value} takror` : `1RM ≈ ${fmtKg(Math.round(d.value))} kg · ${(d.value / profile.weightKg).toFixed(2)}×`}
              </span>
            </div>
            <LevelBar score={d.score} />
            <div className="row between tiny">
              <span style={{ color: d.level ? 'var(--text)' : 'var(--text-2)' }}>
                {d.level ? LEVELS[d.level - 1].name : 'Boshlovchidan past'} · ~{d.percentile}% dan kuchli
              </span>
              {d.next && (
                <span className="muted num">
                  {d.next.name}: +{fmtKg(Math.ceil(d.next.need * 2) / 2)} {unit(r.id)}
                </span>
              )}
            </div>
          </Link>
        );
      })}
      <p className="tiny faint">Me’yorlar: Strength Level foydalanuvchilari natijalari (5/20/50/80/95-persentil), vazningiz va jinsingizga moslangan. Taxminiy 1RM — so‘nggi 4 oydagi eng yaxshi set (RIR bo‘lsa RPE jadvali bo‘yicha).</p>
    </div>
  );
}

/** Mashq sahifasida: shu mashq uchun sizning vazningizga mos daraja chegaralari */
export function StandardsTable({ lift, exName }: { lift: LiftId; exName: string }) {
  const logs = useStore((s) => s.logs);
  const profile = useStore((s) => s.profile);
  const rows = useMemo(() => (profile ? strengthProfile(logs, profile.sex, profile.weightKg) : []), [logs, profile]);
  if (!profile) return null;
  const th = thresholds(lift, profile.sex, profile.weightKg);
  const mine = rows.find((r) => r.id === lift)?.data ?? null;
  const lvl = mine ? mine.level : -1;
  return (
    <div className="card stack gap-12">
      <div className="row between">
        <span className="strong">Kuch me’yorlari</span>
        <span className="tiny muted">
          {profile.sex === 'male' ? 'erkak' : 'ayol'}, {profile.weightKg} kg
        </span>
      </div>
      <div className="stack gap-6">
        {LEVELS.map((l, i) => (
          <div key={l.id} className={`row between small std-row ${lvl === i + 1 ? 'on' : ''}`}>
            <span className="row gap-8">
              <i className="dot" style={{ background: l.plate, width: 10, height: 10 }} /> {l.name}
              <span className="tiny faint">{l.pct}% dan kuchli</span>
            </span>
            <b className="num">
              {lift === 'pullup' ? `${th[i]} takror` : `${fmtKg(th[i])} kg`}
            </b>
          </div>
        ))}
      </div>
      {mine ? (
        <p className="small">
          Sizning {exName.toLowerCase()} natijangiz: <b className="num">{lift === 'pullup' ? `${mine.value} takror` : `1RM ≈ ${Math.round(mine.value)} kg`}</b> — foydalanuvchilarning ~{mine.percentile}% idan kuchliroq.
        </p>
      ) : (
        <p className="small muted">Bu mashqni bajarib, natijangizni yozsangiz — darajangiz shu yerda belgilanadi.</p>
      )}
    </div>
  );
}

export { liftLevel };
