// Kuch darajasi: bir setdagi vazn va takrordan taxminiy 1RM (Epley) va daraja — ilovadagi me’yorlar bilan (src/engine/standards.ts).
import { CaretDown } from '@phosphor-icons/react/ssr';
import { useId, useState } from 'react';
import { e1rm } from '../../../src/engine/progression';
import { LEVELS, LIFTS, liftLevel, type LiftId } from '../../../src/engine/standards';
import type { Sex } from '../../../src/types';
import { fmt1 } from '../data';
import { BotButton, NumberField, parseNum, Seg } from '../ui';

export function Strength() {
  const liftId = useId();
  const [lift, setLift] = useState<LiftId>('bench');
  const [sex, setSex] = useState<Sex>('male');
  const [body, setBody] = useState('75');
  const [kg, setKg] = useState('60');
  const [reps, setReps] = useState('5');
  const pull = lift === 'pullup';

  const b = parseNum(body, 35, 200, 'Tana vazni');
  const k = pull ? { n: 0, err: null } : parseNum(kg, 1, 500, 'Vazn');
  const r = parseNum(reps, 1, pull ? 60 : 20, 'Takror');
  const ok = !b.err && !k.err && !r.err;
  const value = ok ? (pull ? Math.round(r.n) : Math.round(e1rm(k.n, Math.round(r.n)) * 2) / 2) : 0;
  const res = ok ? liftLevel(lift, value, sex, b.n) : null;
  const unit = pull ? 'takror' : 'kg';
  const levelName = res ? (res.level === 0 ? 'Boshlang‘ich' : LEVELS[res.level - 1].name) : '';

  return (
    <section id="kuch" className="tool" aria-labelledby="kuch-t">
      <div className="stack gap-24">
        <div className="tool-head">
          <span className="eyebrow">Test</span>
          <h3 id="kuch-t" className="heading-4">
            Siz qanchalik kuchlisiz?
          </h3>
          <p className="body-3 muted">Oxirgi og‘ir setingizni kiriting. Taxminiy bir takrorlik maksimum va zalga qatnaydiganlar orasidagi darajangizni ko‘rasiz.</p>
        </div>
        <div className="panel">
          <div className="field">
            <label className="field-label caption-1" htmlFor={liftId}>
              Mashq
            </label>
            <div className="input-wrap">
              <select id={liftId} className="input" value={lift} onChange={(e) => setLift(e.target.value as LiftId)}>
                {LIFTS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
              <CaretDown size={16} className="select-caret" aria-hidden="true" />
            </div>
          </div>
          <Seg label="Jins" value={sex} options={[{ v: 'male', t: 'Erkak' }, { v: 'female', t: 'Ayol' }]} onChange={setSex} />
          <div className={pull ? 'fields-2' : 'fields-3'}>
            <NumberField label="Tana vazni" value={body} onChange={setBody} min={35} max={200} step={0.5} unit="kg" error={b.err} />
            {!pull && <NumberField label="Ko‘targan vazn" value={kg} onChange={setKg} min={1} max={500} step={2.5} unit="kg" error={k.err} />}
            <NumberField label={pull ? 'Necha marta' : 'Takror'} value={reps} onChange={setReps} min={1} max={pull ? 60 : 20} unit="marta" error={r.err} />
          </div>
          {!pull && ok && r.n > 12 && <p className="caption-5 faint">12 dan ko‘p takrorda hisob aniqligi pasayadi, 12 takror deb olindi.</p>}
        </div>
      </div>

      <div className="panel" aria-live="polite">
        {res ? (
          <div className="result">
            <span className="caption-1 muted">{pull ? 'Bir urinishda' : 'Taxminiy 1 takrorlik maksimum (1RM)'}</span>
            <div className="big">
              <span className="heading-2">{fmt1(value)}</span>
              <span className="title-2 muted">{unit}</span>
            </div>
            <div className="stack gap-4">
              <span className="heading-5">{levelName}</span>
              <span className="body-6 muted">Zalga qatnaydiganlarning taxminan {res.percentile}% idan kuchliroqsiz.</span>
            </div>
            <div className="levels" role="img" aria-label={`Daraja: ${levelName}`}>
              {LEVELS.map((l, i) => {
                const fill = Math.max(0, Math.min(1, res.score - i));
                return (
                  <div key={l.id} className="level">
                    <div className="level-bar">
                      <i style={{ transform: `scaleX(${fill})` }} />
                    </div>
                    <span className="caption-4">{l.name}</span>
                    <span className="caption-5 faint num">
                      {fmt1(res.thresholds[i])} {pull ? '' : 'kg'}
                    </span>
                  </div>
                );
              })}
            </div>
            {res.next ? (
              <p className="body-5">
                «{res.next.name}» darajasigacha: yana <span className="lime">{fmt1(res.next.need)}</span> {unit}. Ilova shu maqsadga qachon yetishingizni hisoblab boradi.
              </p>
            ) : (
              <p className="body-5">Eng yuqori daraja. Endi asosiysi — jarohatsiz saqlab qolish.</p>
            )}
            <div className="tool-cta">
              <BotButton from="site_kuch" size="md">
                Kuch o‘sishini kuzatish
              </BotButton>
            </div>
            <p className="caption-5 faint">Me’yorlar: Strength Level foydalanuvchilari natijalarining 5, 20, 50, 80 va 95-persentillari; 1RM — Epley formulasi.</p>
          </div>
        ) : (
          <div className="empty">
            <span className="body-2">Natija shu yerda chiqadi</span>
            <span className="body-6">Maydonlarni to‘ldiring: qaysi biri xato ekani chap tomonda yozilgan.</span>
          </div>
        )}
      </div>
    </section>
  );
}
