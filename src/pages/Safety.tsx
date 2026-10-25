// Xavfsizlik markazi: xavfli mashqlar va ularni to'g'ri bajarish, og'riq shkalasi, darhol to'xtash belgilari, shaxsiy cheklovlar.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExerciseThumb } from '../components/ExerciseThumb';
import { injuryName, RiskMeter, RiskTag } from '../components/Safety';
import { Icon } from '../components/ui/Icon';
import { EXERCISES } from '../data/exercises';
import { GOLDEN_RULES, PAIN_ZONES, RED_FLAGS, RISK_INFO, SAFETY_SOURCES, safetyFor, type Risk } from '../data/safety';
import { sourceById } from '../data/sources';
import { personalSafety } from '../engine/safety';
import { useStore } from '../store/useStore';

const byRisk = (r: Risk) => EXERCISES.filter((e) => safetyFor(e.id)?.risk === r).sort((a, b) => b.score - a.score);

export default function Safety() {
  const nav = useNavigate();
  const profile = useStore((s) => s.profile);
  const injuries = profile?.injuries ?? [];
  const [showMid, setShowMid] = useState(false);
  /** uzun "ehtiyotkorlik" ro'yxati to'liq ochilgan cheklovlar */
  const [openInj, setOpenInj] = useState<string[]>([]);
  const high = byRisk(3);
  const mid = byRisk(2);

  return (
    <div className="page">
      <div className="back-bar">
        <button className="icon-btn" onClick={() => nav(-1)} aria-label="Orqaga">
          <Icon name="left" />
        </button>
        <span className="eyebrow">Xavfsizlik markazi</span>
      </div>
      <h1 className="display display-l">Jarohatsiz mashq</h1>
      <p className="muted mt-8">
        Kuch mashqi — eng xavfsiz sport turlaridan biri: jarohat 1000 soat mashg‘ulotga bir necha ta. Deyarli har bir jarohat sababi ma’lum — shoshilib vazn qo‘shish, charchoqda texnika buzilishi va
        xavfsizlik sozlamalarini e’tiborsiz qoldirish.
      </p>

      <div className="safety-facts mt-16">
        <Fact big="3×" text="kam sport jarohati — kuch mashqi qilganlarda" src="lauersen2014" />
        <Fact big="90%" text="shoshilinch jarohatlar — shtanga va gantel bilan" src="kerr2010" />
        <Fact big="Yelka · bel · tizza" text="eng ko‘p zararlanadigan joylar" src="keogh2017" small />
      </div>

      {/* Shaxsiy cheklovlar */}
      <section className="section">
        <div className="section-head">
          <h2>Sizning cheklovlaringiz</h2>
          <Link to="/profile" className="small strong" style={{ color: 'var(--blue-2)' }}>
            O‘zgartirish
          </Link>
        </div>
        {injuries.length === 0 ? (
          <div className="card small muted">
            Cheklov belgilanmagan. Bo‘g‘imda og‘riq yoki eski jarohat bo‘lsa, <b>Profil → Cheklovlar</b> bo‘limida belgilang: dastur xavfli mashqlarni almashtiradi, mashq sahifalarida esa sizga mos
            moslashtirish ko‘rsatiladi.
          </div>
        ) : (
          <div className="stack gap-8">
            {injuries.map((inj) => {
              const avoid = EXERCISES.filter((e) => personalSafety(e, [inj]).avoid.length);
              const caution = EXERCISES.filter((e) => !avoid.includes(e) && personalSafety(e, [inj]).caution.length);
              return (
                <div key={inj} className="card tight stack gap-8">
                  <div className="row gap-8">
                    <Icon name="joint" size={18} style={{ color: 'var(--yellow)' }} />
                    <span className="strong">{injuryName(inj)}</span>
                  </div>
                  {avoid.length > 0 && (
                    <div className="stack gap-4">
                      <span className="tiny" style={{ color: 'var(--red)' }}>
                        Tavsiya etilmaydi — dasturga qo‘shilmaydi
                      </span>
                      <div className="row wrap gap-6">
                        {avoid.map((e) => (
                          <Link key={e.id} to={`/exercise/${e.id}#safety`} className="chip sm" style={{ borderColor: 'rgba(240, 71, 59, 0.45)' }}>
                            {e.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {caution.length > 0 && (
                    <div className="stack gap-4">
                      <span className="tiny" style={{ color: 'var(--yellow)' }}>
                        Ehtiyotkorlik bilan — {caution.length} ta mashq, har birida moslashtirish yozilgan
                      </span>
                      <div className="row wrap gap-6">
                        {(openInj.includes(inj) ? caution : caution.slice(0, 6)).map((e) => (
                          <Link key={e.id} to={`/exercise/${e.id}#safety`} className="chip sm">
                            {e.name}
                          </Link>
                        ))}
                        {caution.length > 6 && !openInj.includes(inj) && (
                          <button className="chip sm" onClick={() => setOpenInj((x) => [...x, inj])}>
                            yana {caution.length - 6} ta <Icon name="down" size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Darhol to'xtash belgilari */}
      <section className="section">
        <div className="section-head">
          <h2>Darhol to‘xtang</h2>
        </div>
        <div className="card stack gap-12" style={{ borderColor: 'rgba(240, 71, 59, 0.45)' }}>
          <span className="small strong" style={{ color: 'var(--red)' }}>
            Tez yordam chaqiring (103):
          </span>
          {RED_FLAGS.filter((f) => f.level === 'emergency').map((f) => (
            <div key={f.text} className="flag-row">
              <Icon name="alert" size={16} style={{ color: 'var(--red)' }} />
              <span>{f.text}</span>
            </div>
          ))}
          <a href="tel:103" className="btn btn-danger btn-block">
            <Icon name="phone" size={18} /> 103 — tez yordam
          </a>
        </div>
        <div className="card stack gap-12 mt-12">
          <span className="small strong" style={{ color: 'var(--yellow)' }}>
            To‘xtang va tez orada shifokorga boring:
          </span>
          {RED_FLAGS.filter((f) => f.level === 'doctor').map((f) => (
            <div key={f.text} className="flag-row">
              <Icon name="info" size={16} style={{ color: 'var(--yellow)' }} />
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Og'riq shkalasi */}
      <section className="section">
        <div className="section-head">
          <h2>Og‘riq shkalasi</h2>
          <span className="small muted">bo‘g‘imdagi og‘riq, 0–10</span>
        </div>
        <div className="zone-bar">
          {PAIN_ZONES.map((z) => (
            <div
              key={z.name}
              style={{
                background: `color-mix(in srgb, ${z.color} 16%, transparent)`,
                border: `1px solid color-mix(in srgb, ${z.color} 45%, transparent)`,
              }}
            >
              <div className="num strong" style={{ color: z.color }}>
                {z.from}–{z.to}
              </div>
              <div className="tiny strong">{z.name}</div>
            </div>
          ))}
        </div>
        <div className="stack gap-8 mt-12">
          {PAIN_ZONES.map((z) => (
            <p key={z.name} className="small">
              <b style={{ color: z.color }}>{z.name}:</b> {z.text}
            </p>
          ))}
          <p className="tiny muted">
            Mushakdagi «yonish» va ertasi kungi mushak og‘rig‘i bu shkalaga kirmaydi — ular normal. Mashg‘ulot paytida har bir mashqda <b>«Og‘riq»</b> tugmasi bor: sezgini tanlasangiz, nima qilishni
            aytadi va keyingi safar eslatadi.
          </p>
        </div>
      </section>

      {/* Oltin qoidalar */}
      <section className="section">
        <div className="section-head">
          <h2>10 ta oltin qoida</h2>
        </div>
        <ol className="card stack gap-12 rules-list">
          {GOLDEN_RULES.map((r, i) => (
            <li key={r.title} className="row gap-12" style={{ alignItems: 'flex-start' }}>
              <span className="pill-num">{i + 1}</span>
              <span className="small">
                <b>{r.title}.</b> {r.text}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Xavfli mashqlar */}
      <section className="section">
        <div className="section-head">
          <h2>Yuqori xavfli mashqlar</h2>
          <span className="small muted">{high.length} ta</span>
        </div>
        <p className="small muted" style={{ marginBottom: 12 }}>
          Bu mashqlar yomon emas — aksincha, eng samaralilari. Lekin xato qilinsa oqibati jiddiy, shuning uchun har birida sozlash va «chiqish yo‘li»ni oldindan biling.
        </p>
        <div className="stack gap-8">
          {high.map((e) => {
            const s = safetyFor(e.id)!;
            return (
              <Link key={e.id} to={`/exercise/${e.id}#safety`} className="card tight stack gap-10" style={{ color: 'inherit' }}>
                <div className="row gap-12">
                  <ExerciseThumb ex={e} size={64} />
                  <div className="grow" style={{ minWidth: 0 }}>
                    <div className="strong" style={{ lineHeight: 1.25 }}>
                      {e.name}
                    </div>
                    <div className="mt-4">
                      <RiskTag risk={3} />
                    </div>
                  </div>
                  <Icon name="right" size={18} style={{ color: 'var(--text-3)' }} />
                </div>
                <p className="small muted">{s.why}</p>
                {s.bail && (
                  <p className="small">
                    <b>Ko‘tara olmasangiz:</b> {s.bail.split('. ')[0]}.
                  </p>
                )}
              </Link>
            );
          })}
        </div>
        <button className="btn btn-ghost btn-block mt-12" onClick={() => setShowMid((v) => !v)} aria-expanded={showMid}>
          <RiskMeter risk={2} size="s" /> O‘rta xavfli mashqlar ({mid.length}) <Icon name={showMid ? 'up' : 'down'} size={16} />
        </button>
        {showMid && (
          <div className="stack gap-6 mt-8">
            {mid.map((e) => (
              <Link key={e.id} to={`/exercise/${e.id}#safety`} className="card tight row gap-12" style={{ color: 'inherit' }}>
                <ExerciseThumb ex={e} size={48} />
                <span className="grow small" style={{ minWidth: 0 }}>
                  <b style={{ display: 'block' }}>{e.name}</b>
                  <span className="tiny muted">{safetyFor(e.id)!.why}</span>
                </span>
              </Link>
            ))}
          </div>
        )}
        <p className="tiny faint mt-12">
          Xavf darajasi: <b style={{ color: RISK_INFO[1].color }}>past</b> — {RISK_INFO[1].text.toLowerCase()} <b style={{ color: RISK_INFO[2].color }}>O‘rta</b> — {RISK_INFO[2].text.toLowerCase()}{' '}
          <b style={{ color: RISK_INFO[3].color }}>Yuqori</b> — {RISK_INFO[3].text.toLowerCase()}
        </p>
      </section>

      <section className="section">
        <Link to="/lesson/safety" className="card row gap-12" style={{ color: 'inherit' }}>
          <span
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: 'var(--plate-red)',
              display: 'grid',
              placeItems: 'center',
              flex: 'none',
              color: '#fff',
            }}
          >
            <Icon name="play" />
          </span>
          <span className="grow">
            <b style={{ display: 'block' }}>Darslik: Jarohatsiz mashq qilish</b>
            <span className="tiny muted">Razminka, nafas, to‘sinlar va sug‘urta, og‘riq shkalasi · 6 daq</span>
          </span>
          <Icon name="right" size={18} style={{ color: 'var(--text-3)' }} />
        </Link>
      </section>

      <section className="section">
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          Manbalar
        </div>
        <div className="stack gap-8">
          {SAFETY_SOURCES.map((id) => {
            const s = sourceById(id);
            if (!s) return null;
            return (
              <div key={id} className="tiny muted" style={{ lineHeight: 1.45 }}>
                <b>{s.short}.</b> {s.finding}
              </div>
            );
          })}
          <Link to="/sources" className="tiny strong" style={{ color: 'var(--blue-2)' }}>
            Barcha manbalar →
          </Link>
          <p className="tiny faint">Bu ilova tibbiy tashxis qo‘ymaydi va shifokor maslahatining o‘rnini bosmaydi.</p>
        </div>
      </section>
    </div>
  );
}

function Fact({ big, text, src, small }: { big: string; text: string; src: string; small?: boolean }) {
  return (
    <div className="card tight stack gap-4" style={{ minWidth: 0 }}>
      <span
        className="num strong"
        style={{
          fontSize: small ? 15 : 24,
          lineHeight: 1.15,
          color: 'var(--yellow)',
        }}
      >
        {big}
      </span>
      <span className="tiny">{text}</span>
      <span className="tiny faint">{sourceById(src)?.short}</span>
    </div>
  );
}
