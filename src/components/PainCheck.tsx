// Mashg'ulot paytida og'riq: sezgi turi va 0–10 shkala bo'yicha nima qilish kerak (og'riq nazorati modeli).
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PAIN_ZONES, safetyFor } from '../data/safety';
import type { Exercise } from '../types';
import { injuryName } from './Safety';
import { Icon } from './ui/Icon';

type Kind = 'muscle' | 'joint' | 'nerve' | 'pop' | 'emergency';

const KINDS: { k: Kind; title: string; text: string }[] = [
  {
    k: 'muscle',
    title: 'Mushakda «yonish» yoki charchoq',
    text: 'Set oxirida kuchayadi, dam olishda o‘tadi',
  },
  {
    k: 'joint',
    title: 'Bo‘g‘imda og‘riq',
    text: 'Tizza, yelka, bel, tirsak yoki bilakda',
  },
  {
    k: 'nerve',
    title: 'Uvishish yoki tarqaluvchi og‘riq',
    text: 'Qo‘l yoki oyoqqa «tok urgandek» tarqaladi, karaxtlik',
  },
  {
    k: 'pop',
    title: '«Qars» etdi',
    text: 'Keyin keskin og‘riq, kuchsizlik yoki ko‘karish',
  },
  {
    k: 'emergency',
    title: 'Ko‘krakda og‘riq, nafas qisishi yoki kuchli bosh og‘rig‘i',
    text: 'Yoki kuchli bosh aylanishi, ko‘z qorong‘ilashishi',
  },
];

export const zoneOf = (n: number) => PAIN_ZONES.find((z) => n >= z.from && n <= z.to) ?? PAIN_ZONES[PAIN_ZONES.length - 1];

export function PainCheck({
  ex,
  onReduce,
  onSwap,
  onSkip,
  onMark,
}: {
  ex: Exercise;
  /** qolgan setlarda vaznni ~20% kamaytirish */
  onReduce: () => void;
  onSwap: () => void;
  /** bu mashqni bugun to'xtatish */
  onSkip: () => void;
  /** og'riqni shu mashg'ulot tarixiga yozish (keyingi safar ogohlantirish chiqadi) */
  onMark: () => void;
}) {
  const [kind, setKind] = useState<Kind | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const joints = safetyFor(ex.id)?.joints ?? [];
  const pick = (k: Kind) => {
    setKind(k);
    setLevel(null);
    if (k === 'nerve' || k === 'pop') onMark();
  };
  const rate = (n: number) => {
    setLevel(n);
    if (n >= 3) onMark();
  };
  const zone = level !== null ? zoneOf(level) : null;

  return (
    <div className="stack gap-12">
      <h3 className="title">Qanday sezgi?</h3>
      <p className="small muted">{ex.name} — to‘g‘ri baholang: bu keyingi qadamni belgilaydi.</p>
      <div className="stack gap-6" role="radiogroup" aria-label="Sezgi turi">
        {KINDS.map((o) => (
          <button
            key={o.k}
            role="radio"
            aria-checked={kind === o.k}
            className={`card tight row gap-12 ${kind === o.k ? 'on' : ''}`}
            style={{
              textAlign: 'left',
              width: '100%',
              color: 'inherit',
              borderColor: kind === o.k ? (o.k === 'muscle' ? 'var(--green)' : o.k === 'joint' ? 'var(--yellow)' : 'var(--red)') : undefined,
            }}
            onClick={() => pick(o.k)}
          >
            <span className="grow">
              <span className="small strong" style={{ display: 'block' }}>
                {o.title}
              </span>
              <span className="tiny muted">{o.text}</span>
            </span>
            {kind === o.k && <Icon name="check" size={18} stroke={3} />}
          </button>
        ))}
      </div>

      {kind === 'muscle' && (
        <div className="notice good small" role="status">
          <Icon name="check" size={18} />
          <span>Bu mushak charchog‘i — normal va xavfsiz. Mushak shunday o‘sadi. Davom eting; texnika buzila boshlasa, set tugadi.</span>
        </div>
      )}

      {kind === 'joint' && (
        <div className="stack gap-10">
          <span className="small strong">Og‘riq qanchalik kuchli? (0 — yo‘q, 10 — chidab bo‘lmas)</span>
          <div className="pain-scale" role="radiogroup" aria-label="Og‘riq darajasi">
            {Array.from({ length: 11 }, (_, n) => {
              const z = zoneOf(n);
              return (
                <button
                  key={n}
                  role="radio"
                  aria-checked={level === n}
                  className={level === n ? 'on' : ''}
                  style={{
                    color: z.color,
                    background: level === n ? 'var(--surface-3)' : undefined,
                  }}
                  onClick={() => rate(n)}
                >
                  {n}
                </button>
              );
            })}
          </div>
          {zone && (
            <div className="card tight stack gap-8" style={{ borderColor: zone.color }} role="status">
              <span className="strong" style={{ color: zone.color }}>
                {zone.name}
              </span>
              <span className="small">{zone.text}</span>
              {level! >= 3 && joints.length > 0 && (
                <div className="stack gap-4 mt-4">
                  <span className="tiny muted">Bu mashqni moslashtirish:</span>
                  {joints.map((j) => (
                    <span key={j.at} className="small">
                      <b>{injuryName(j.at)}:</b> {j.mod}
                    </span>
                  ))}
                </div>
              )}
              {level! >= 3 && (
                <div className="row wrap gap-8 mt-4">
                  {level! <= 5 && (
                    <button className="btn btn-secondary btn-sm" onClick={onReduce}>
                      Vaznni 20% kamaytirish
                    </button>
                  )}
                  <button className="btn btn-secondary btn-sm" onClick={onSwap}>
                    <Icon name="swap" size={16} /> Muqobil mashq
                  </button>
                  {level! >= 6 && (
                    <button className="btn btn-ghost btn-sm" onClick={onSkip}>
                      Bu mashqni to‘xtatish
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {kind === 'nerve' && (
        <div className="notice warn small" role="alert">
          <Icon name="alert" size={18} />
          <div className="grow stack gap-8">
            <span>
              <b>Bugun bu mashqni to‘xtating.</b> Uvishish va tarqaluvchi og‘riq — nerv ta’sirlanishi belgisi; «chidab» davom etish uni kuchaytiradi. Bir necha kunda o‘tmasa, takrorlansa yoki
              kuchsizlik paydo bo‘lsa — nevrolog yoki travmatologga.
            </span>
            <div className="row wrap gap-8">
              <button className="btn btn-secondary btn-sm" onClick={onSwap}>
                <Icon name="swap" size={16} /> Muqobil mashq
              </button>
              <button className="btn btn-ghost btn-sm" onClick={onSkip}>
                Bu mashqni to‘xtatish
              </button>
            </div>
          </div>
        </div>
      )}

      {kind === 'pop' && (
        <div className="notice warn small" role="alert">
          <Icon name="alert" size={18} />
          <div className="grow stack gap-8">
            <span>
              <b>Darhol to‘xtang — og‘irlik ko‘tarmang.</b> Sovuq (muz, 15–20 daqiqa, mato orqali), qisuvchi bog‘lam va jarohatlangan joyni yuqoriga ko‘tarib qo‘ying. Kuchsizlik, shish yoki ko‘karish
              bo‘lsa — <b>bugunoq travmatologga</b>: pay uzilishlarining ba’zilari tez jarrohlikni talab qiladi.
            </span>
            <button className="btn btn-ghost btn-sm" onClick={onSkip} style={{ alignSelf: 'flex-start' }}>
              Bu mashqni to‘xtatish
            </button>
          </div>
        </div>
      )}

      {kind === 'emergency' && (
        <div className="notice warn" role="alert">
          <Icon name="alert" />
          <div className="grow stack gap-8">
            <span>
              <b>Mashg‘ulotni to‘xtating va o‘tiring.</b> Ko‘krakda og‘riq yoki siqilish, to‘satdan kuchli bosh og‘rig‘i, hushni yo‘qotish yoki dam olganda ham o‘tmaydigan nafas qisishi —{' '}
              <b>tez yordam chaqiring</b>. Yolg‘iz bo‘lsangiz, yaqindagi odamga ayting.
            </span>
            <a href="tel:103" className="btn btn-danger btn-block">
              <Icon name="phone" size={18} /> 103 — tez yordam
            </a>
            <span className="tiny muted">Yengil bosh aylanishi bo‘lsa: o‘tiring yoki yoting, suv iching, nafasni ushlamang. 5–10 daqiqada o‘tmasa — 103.</span>
          </div>
        </div>
      )}

      <Link to="/safety" className="small strong row gap-6" style={{ color: 'var(--blue-2)', minHeight: 36 }}>
        Xavfsizlik markazi: barcha belgilar va qoidalar <Icon name="right" size={14} />
      </Link>
      <p className="tiny faint">Bu ilova tibbiy tashxis qo‘ymaydi. Shubha bo‘lsa — shifokorga murojaat qiling.</p>
    </div>
  );
}
