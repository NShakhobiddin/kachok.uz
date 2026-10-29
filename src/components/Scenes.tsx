// Darsliklar uchun animatsion sahnalar (SVG + framer-motion).
import { motion } from 'framer-motion';
import { exById } from '../data/exercises';
import type { SceneId } from '../data/lessons';
import { ILLUSTRATIONS } from '../data/illustrations';
import { solveFront } from '../lib/figure';
import { BodySilhouette } from './BodyMap';
import { motionFrames } from './ExerciseMotion';

const loop = (duration: number, delay = 0) => ({ duration, delay, repeat: Infinity, repeatType: 'reverse' as const, ease: 'easeInOut' as const });
const T = { fill: 'var(--text)', fontFamily: 'var(--font-body)', fontWeight: 700 } as const;
const M = { fill: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em' } as const;

function Svg({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 320 220" width="100%" height="100%" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

function Balance({ surplus }: { surplus?: boolean }) {
  const ang = surplus ? -9 : 9;
  return (
    <Svg label={surplus ? 'Kaloriya ortiqchasi: ovqat sarfdan ko‘p' : 'Kaloriya taqchilligi: sarf ovqatdan ko‘p'}>
      <path d="M160 70 L140 190 H180 Z" fill="var(--surface-3)" />
      <rect x={110} y={188} width={100} height={8} rx={4} fill="var(--surface-3)" />
      <motion.g style={{ transformOrigin: '160px 70px' }} animate={{ rotate: [0, ang] }} transition={loop(1.6)}>
        <rect x={50} y={66} width={220} height={7} rx={3.5} fill="var(--iron)" />
        <line x1={70} y1={70} x2={60} y2={120} stroke="var(--line-2)" strokeWidth={1.5} />
        <line x1={70} y1={70} x2={100} y2={120} stroke="var(--line-2)" strokeWidth={1.5} />
        <line x1={250} y1={70} x2={220} y2={120} stroke="var(--line-2)" strokeWidth={1.5} />
        <line x1={250} y1={70} x2={260} y2={120} stroke="var(--line-2)" strokeWidth={1.5} />
        <path d="M52 120 H108 Q80 140 52 120Z" fill="var(--surface-3)" />
        <path d="M212 120 H268 Q240 140 212 120Z" fill="var(--surface-3)" />
        <circle cx={72} cy={112} r={7} fill="var(--plate-yellow)" />
        <circle cx={86} cy={110} r={9} fill="var(--plate-green)" />
        <circle cx={80} cy={100} r={6} fill="var(--plate-red)" />
        <path d="M240 92c6 8 10 12 10 19a10 10 0 0 1-20 0c0-5 3-8 5-12 1 4 3 5 5 5 0-5-2-8 0-12z" fill="var(--plate-red)" />
        <text x={80} y={152} textAnchor="middle" fontSize={13} {...T}>
          Ovqat
        </text>
        <text x={240} y={152} textAnchor="middle" fontSize={13} {...T}>
          Sarf
        </text>
        <text x={80} y={168} textAnchor="middle" {...M}>
          {surplus ? '2900 KKAL' : '2200 KKAL'}
        </text>
        <text x={240} y={168} textAnchor="middle" {...M}>
          2600 KKAL
        </text>
      </motion.g>
      <text x={160} y={30} textAnchor="middle" fontSize={15} {...T}>
        {surplus ? '+300 kkal → massa' : '−400 kkal → ozish'}
      </text>
    </Svg>
  );
}

function Tdee() {
  const parts = [
    { k: 'Tinch holat (BMR)', v: 0.64, c: 'var(--plate-blue)' },
    { k: 'Kundalik harakat', v: 0.18, c: 'var(--plate-green)' },
    { k: 'Ovqat hazmi', v: 0.1, c: 'var(--plate-yellow)' },
    { k: 'Mashq', v: 0.08, c: 'var(--plate-red)' },
  ];
  let x = 20;
  return (
    <Svg label="Kunlik energiya sarfi tarkibi">
      <text x={20} y={40} fontSize={14} {...T}>
        Kunlik sarf = 100%
      </text>
      {parts.map((p, i) => {
        const w = 280 * p.v;
        const el = (
          <g key={p.k}>
            <motion.rect x={x} y={56} height={34} rx={4} fill={p.c} initial={{ width: 0 }} animate={{ width: w - 2 }} transition={{ delay: 0.3 + i * 0.35, duration: 0.6 }} />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.35 }}>
              <rect x={20} y={110 + i * 24} width={12} height={12} rx={3} fill={p.c} />
              <text x={40} y={121 + i * 24} fontSize={12} fill="var(--text-2)" fontFamily="var(--font-body)">
                {p.k}
              </text>
              <text x={300} y={121 + i * 24} fontSize={12} textAnchor="end" {...T}>
                {Math.round(p.v * 100)}%
              </text>
            </motion.g>
          </g>
        );
        x += w;
        return el;
      })}
    </Svg>
  );
}

function FatCells() {
  const cells = Array.from({ length: 15 }, (_, i) => ({ x: 50 + (i % 5) * 55, y: 50 + Math.floor(i / 5) * 55 }));
  return (
    <Svg label="Yog‘ hujayralari kichrayadi">
      {cells.map((c, i) => (
        <motion.circle
          key={i}
          cx={c.x}
          cy={c.y}
          fill="var(--yellow-soft)"
          stroke="var(--plate-yellow)"
          strokeWidth={1.5}
          initial={{ r: 24 }}
          animate={{ r: [24, 15] }}
          transition={loop(2.4, i * 0.05)}
        />
      ))}
      <text x={160} y={212} textAnchor="middle" {...M}>
        HUJAYRALAR KICHRAYADI · SONI EMAS
      </text>
    </Svg>
  );
}

const SCENE_BODY = solveFront({ ua: 170, fa: 174 }, 160, 198);

function Spot() {
  return (
    <Svg label="Yog‘ butun tanadan bir xil kamayadi">
      <motion.g style={{ transformOrigin: '160px 120px' }} animate={{ scale: [1.09, 1.01], opacity: [0.9, 0.25] }} transition={loop(2.2)}>
        <BodySilhouette sk={SCENE_BODY} back={false} fill="var(--yellow-soft)" />
      </motion.g>
      <BodySilhouette sk={SCENE_BODY} back={false} fill="var(--skin)" />
      {[0, 1, 2, 3].map((i) => (
        <motion.text
          key={i}
          x={[90, 230, 100, 220][i]}
          y={[70, 70, 160, 160][i]}
          textAnchor="middle"
          fontSize={18}
          fill="var(--plate-yellow)"
          animate={{ y: [[70, 70, 160, 160][i], [60, 60, 150, 150][i]], opacity: [1, 0] }}
          transition={{ duration: 1.6, delay: i * 0.4, repeat: Infinity }}
        >
          −
        </motion.text>
      ))}
      <text x={160} y={216} textAnchor="middle" {...M}>
        BUTUN TANADAN BIR VAQTDA
      </text>
    </Svg>
  );
}

function Fiber() {
  return (
    <Svg label="Mushak tolasi qalinlashadi">
      <motion.g style={{ transformOrigin: '160px 100px' }} animate={{ scaleY: [1, 1.35] }} transition={loop(2.4)}>
        <rect x={40} y={78} width={240} height={44} rx={22} fill="var(--red-soft)" stroke="var(--plate-red)" strokeWidth={1.5} />
        {Array.from({ length: 11 }, (_, i) => (
          <motion.line
            key={i}
            x1={62 + i * 18}
            x2={62 + i * 18}
            y1={84}
            y2={116}
            stroke="var(--plate-red)"
            strokeWidth={2}
            initial={{ x1: 62 + i * 18, x2: 62 + i * 18 }}
            animate={{ x1: [62 + i * 18, 66 + i * 17], x2: [62 + i * 18, 66 + i * 17] }}
            transition={loop(0.9)}
          />
        ))}
      </motion.g>
      <text x={40} y={40} fontSize={14} {...T}>
        Taranglik → signal → qalinlashish
      </text>
      <motion.text x={40} y={180} {...M} animate={{ opacity: [1, 0.2] }} transition={loop(2.4)}>
        1-HAFTA
      </motion.text>
      <motion.text x={280} y={180} textAnchor="end" {...M} animate={{ opacity: [0.2, 1] }} transition={loop(2.4)}>
        12-HAFTA
      </motion.text>
    </Svg>
  );
}

function Mps() {
  const d = 'M30 170 C60 168 70 70 110 64 S170 120 200 150 S260 168 300 168';
  return (
    <Svg label="Mashqdan keyingi oqsil sintezi egri chizig‘i">
      <line x1={30} y1={170} x2={300} y2={170} stroke="var(--line)" />
      <rect x={70} y={40} width={100} height={130} fill="var(--green-soft)" />
      <text x={120} y={34} textAnchor="middle" {...M}>
        OQSIL + UYQU OYNASI
      </text>
      <motion.path
        d={d}
        fill="none"
        stroke="var(--blue)"
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
      />
      {['0', '24', '48', '72 soat'].map((t, i) => (
        <text key={t} x={30 + i * 90} y={190} textAnchor={i === 3 ? 'end' : 'middle'} {...M}>
          {t}
        </text>
      ))}
      <text x={30} y={210} {...M}>
        MUSHAK OQSILI SINTEZI
      </text>
    </Svg>
  );
}

function Stairs() {
  const steps = ['60×8', '60×10', '60×12', '62.5×8', '62.5×10'];
  return (
    <Svg label="Progressiv yuklama zinapoyasi">
      {steps.map((s, i) => (
        <motion.g key={s} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.45, repeat: Infinity, repeatDelay: 3, duration: 0.4 }}>
          <rect x={22 + i * 58} y={170 - i * 26} width={56} height={26 + i * 26} rx={4} fill={i >= 3 ? 'var(--blue-soft)' : 'var(--surface-3)'} stroke={i >= 3 ? 'var(--blue)' : 'none'} />
          <text x={50 + i * 58} y={162 - i * 26} textAnchor="middle" fontSize={12} {...T}>
            {s}
          </text>
          <text x={50 + i * 58} y={190} textAnchor="middle" {...M}>
            {i + 1}-H
          </text>
        </motion.g>
      ))}
      <text x={22} y={30} fontSize={13} {...T}>
        Avval takror ↑, keyin vazn ↑
      </text>
    </Svg>
  );
}

function Dose() {
  const d = 'M30 180 C80 110 130 74 180 62 S260 50 300 48';
  return (
    <Svg label="Haftalik setlar va o‘sish — kamayuvchi foyda">
      <rect x={107} y={30} width={86} height={150} fill="var(--green-soft)" />
      <text x={150} y={24} textAnchor="middle" {...M}>
        10–20 SET
      </text>
      <line x1={30} y1={180} x2={300} y2={180} stroke="var(--line)" />
      <motion.path d={d} fill="none" stroke="var(--blue)" strokeWidth={2.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} />
      <motion.circle
        r={6}
        fill="var(--blue)"
        stroke="var(--surface)"
        strokeWidth={2}
        initial={{ cx: 30, cy: 180 }}
        animate={{ cx: [30, 120, 180, 300], cy: [180, 92, 62, 48] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <text x={30} y={200} {...M}>
        0
      </text>
      <text x={300} y={200} textAnchor="end" {...M}>
        30 SET/HAFTA
      </text>
    </Svg>
  );
}

function Rir() {
  return (
    <Svg label="RIR 2: 8 takror bajarildi, 2 zaxirada">
      {Array.from({ length: 10 }, (_, i) => (
        <motion.rect
          key={i}
          x={28 + i * 27}
          y={70}
          width={21}
          height={80}
          rx={5}
          fill={i < 8 ? 'var(--blue)' : 'transparent'}
          stroke={i < 8 ? 'none' : 'var(--plate-yellow)'}
          strokeWidth={2}
          initial={{ opacity: 0 }}
          animate={i < 8 ? { opacity: 1 } : { opacity: [0.3, 1] }}
          transition={i < 8 ? { delay: i * 0.18 } : loop(0.8)}
        />
      ))}
      <text x={28} y={50} fontSize={14} {...T}>
        8 takror bajarildi
      </text>
      <text x={292} y={50} fontSize={14} textAnchor="end" fill="var(--plate-yellow)" fontWeight={700}>
        2 zaxirada
      </text>
      <text x={160} y={186} textAnchor="middle" fontSize={22} fontFamily="var(--font-display)" fontWeight={800} fill="var(--text)">
        RIR 2
      </text>
    </Svg>
  );
}

function Deload() {
  const fat = 'M20 150 L70 130 L120 110 L170 90 L220 70 L270 140 L300 135';
  const fit = 'M20 160 L70 152 L120 146 L170 140 L220 136 L270 128 L300 112';
  return (
    <Svg label="Charchoq va kuch: yengil haftadan keyin kuch o‘sadi">
      <rect x={246} y={30} width={48} height={150} fill="var(--yellow-soft)" />
      <text x={270} y={24} textAnchor="middle" {...M}>
        DELOAD
      </text>
      <motion.path d={fat} fill="none" stroke="var(--red)" strokeWidth={2.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1 }} />
      <motion.path
        d={fit}
        fill="none"
        stroke="var(--blue)"
        strokeWidth={2.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1 }}
      />
      <g>
        <line x1={24} y1={200} x2={40} y2={200} stroke="var(--red)" strokeWidth={2.5} />
        <text x={46} y={204} fontSize={11} fill="var(--text-2)">
          Charchoq
        </text>
        <line x1={120} y1={200} x2={136} y2={200} stroke="var(--blue)" strokeWidth={2.5} />
        <text x={142} y={204} fontSize={11} fill="var(--text-2)">
          Kuch
        </text>
      </g>
    </Svg>
  );
}

function Plate() {
  const arc = (a0: number, a1: number, r = 80) => {
    const p = (a: number) => [160 + r * Math.cos(((a - 90) * Math.PI) / 180), 105 + r * Math.sin(((a - 90) * Math.PI) / 180)];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    return `M160 105 L${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1} Z`;
  };
  const parts = [
    { d: arc(0, 180), c: 'var(--plate-green)', k: 'Sabzavot ½', x: 262, y: 100 },
    { d: arc(180, 270), c: 'var(--plate-red)', k: 'Oqsil ¼', x: 58, y: 160 },
    { d: arc(270, 360), c: 'var(--plate-yellow)', k: 'Uglevod ¼', x: 58, y: 50 },
  ];
  return (
    <Svg label="Sog‘lom likopcha: yarmi sabzavot, chorak oqsil, chorak uglevod">
      <circle cx={160} cy={105} r={92} fill="var(--surface-3)" />
      {parts.map((p, i) => (
        <motion.path
          key={p.k}
          d={p.d}
          fill={p.c}
          stroke="var(--surface)"
          strokeWidth={3}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.3, type: 'spring' }}
          style={{ transformOrigin: '160px 105px' }}
        />
      ))}
      {parts.map((p) => (
        <text key={p.k + 't'} x={p.x} y={p.y} textAnchor="middle" fontSize={12} {...T}>
          {p.k}
        </text>
      ))}
    </Svg>
  );
}

function ProteinDay() {
  const meals = ['08:00', '13:00', '17:00', '20:00'];
  return (
    <Svg label="Oqsilni 4 mahalga bo‘lish">
      <line x1={20} y1={170} x2={300} y2={170} stroke="var(--line)" />
      {meals.map((m, i) => (
        <g key={m}>
          <motion.rect
            x={40 + i * 70}
            width={36}
            rx={6}
            fill="var(--plate-red)"
            initial={{ y: 170, height: 0 }}
            animate={{ y: 110, height: 60 }}
            transition={{ delay: 0.3 + i * 0.3, type: 'spring' }}
          />
          <text x={58 + i * 70} y={102} textAnchor="middle" fontSize={12} {...T}>
            ~30 g
          </text>
          <text x={58 + i * 70} y={190} textAnchor="middle" {...M}>
            {m}
          </text>
        </g>
      ))}
      <text x={20} y={40} fontSize={14} {...T}>
        Har mahalda ~0.4 g/kg oqsil
      </text>
    </Svg>
  );
}

function Trend() {
  const pts = [82, 81.4, 82.3, 81.6, 81.1, 81.9, 81, 80.6, 81.3, 80.5, 80.2, 80.9, 80, 79.8];
  const x = (i: number) => 26 + i * 20.5;
  const y = (v: number) => 180 - (v - 79) * 40;
  let t = pts[0];
  const trend = pts.map((v) => (t = t + 0.3 * (v - t)));
  const d = trend.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join(' ');
  return (
    <Svg label="Kundalik vazn tebranadi, trend silliq pasayadi">
      {pts.map((v, i) => (
        <motion.circle key={i} cx={x(i)} cy={y(v)} r={4} fill="var(--text-3)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }} />
      ))}
      <motion.path d={d} fill="none" stroke="var(--blue)" strokeWidth={2.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 1.6 }} />
      <circle cx={30} cy={204} r={4} fill="var(--text-3)" />
      <text x={40} y={208} fontSize={11} fill="var(--text-2)">
        Kunlik tarozi
      </text>
      <line x1={140} y1={204} x2={156} y2={204} stroke="var(--blue)" strokeWidth={2.5} />
      <text x={162} y={208} fontSize={11} fill="var(--text-2)">
        Trend
      </text>
    </Svg>
  );
}

function Sleep() {
  return (
    <Svg label="7–9 soat uyqu">
      <motion.path d="M190 40a50 50 0 1 0 60 70 42 42 0 0 1-60-70z" fill="var(--plate-yellow)" animate={{ rotate: [-6, 6] }} style={{ transformOrigin: '210px 80px' }} transition={loop(3)} />
      {[
        [60, 40],
        [110, 70],
        [80, 100],
        [140, 30],
      ].map(([cx, cy], i) => (
        <motion.circle key={i} cx={cx} cy={cy} r={2.5} fill="var(--text)" animate={{ opacity: [0.2, 1] }} transition={loop(1 + i * 0.3)} />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <motion.rect
          key={i}
          x={40 + i * 26}
          width={18}
          rx={4}
          y={190 - 18}
          height={18}
          fill={i >= 6 ? 'var(--blue)' : 'var(--surface-3)'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.12 }}
        />
      ))}
      <text x={40} y={160} {...M}>
        SOAT: 1 … 9
      </text>
      <text x={274} y={160} textAnchor="end" fontSize={13} {...T}>
        7–9 soat
      </text>
    </Svg>
  );
}

function Brace() {
  const waist = SCENE_BODY.shoulderY + 38;
  return (
    <Svg label="Nafas olib qorinni tarang qilish">
      <defs>
        <clipPath id="brace-clip">
          <rect x={0} y={0} width={320} height={194} />
        </clipPath>
      </defs>
      <g clipPath="url(#brace-clip)">
        <g transform="translate(160 100) scale(1.45) translate(-160 -100)">
          <BodySilhouette sk={SCENE_BODY} back={false} fill="var(--skin)" />
        </g>
      </g>
      <motion.ellipse
        cx={160}
        cy={100 + (waist - 100) * 1.45}
        rx={34}
        ry={11}
        fill="none"
        stroke="var(--blue)"
        strokeWidth={4}
        initial={{ rx: 30 }}
        animate={{ rx: [30, 40], opacity: [0.5, 1] }}
        transition={loop(1.4)}
      />
      {[-1, 1].map((k) => (
        <motion.path
          key={k}
          d={`M${160 + k * 92} ${100 + (waist - 100) * 1.45} l${-k * 18} 0 m${k * 8} -8 l${-k * 8} 8 l${k * 8} 8`}
          stroke="var(--blue-2)"
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          animate={{ x: [0, -k * 10] }}
          transition={loop(1.4)}
        />
      ))}
      <text x={160} y={212} textAnchor="middle" {...M}>
        360° QORIN BOSIMI = UMURTQA KORSETI
      </text>
    </Svg>
  );
}

function Warmup() {
  const sets = ['40%', '60%', '80%', '100%'];
  return (
    <Svg label="Isinish setlari: 40, 60, 80 foiz">
      <rect x={34} y={30} width={22} height={150} rx={11} fill="var(--surface-3)" />
      <motion.rect x={38} width={14} rx={7} fill="var(--red)" initial={{ y: 176, height: 0 }} animate={{ y: 50, height: 126 }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.8 }} />
      <circle cx={45} cy={186} r={16} fill="var(--red)" />
      {sets.map((s, i) => (
        <motion.g key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.5, repeat: Infinity, repeatDelay: 2.6, duration: 0.3 }}>
          <rect x={92 + i * 54} y={170 - (i + 1) * 30} width={44} height={(i + 1) * 30} rx={6} fill={i === 3 ? 'var(--blue)' : 'var(--surface-3)'} />
          <text x={114 + i * 54} y={190} textAnchor="middle" fontSize={12} {...T}>
            {s}
          </text>
        </motion.g>
      ))}
    </Svg>
  );
}

function Health() {
  return (
    <Svg label="Yurak urishi va kamaygan xavf">
      <motion.path
        d="M10 120 H90 L105 80 L120 160 L135 60 L150 140 L160 120 H310"
        fill="none"
        stroke="var(--green)"
        strokeWidth={3}
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <text x={160} y={196} textAnchor="middle" fontSize={26} fontFamily="var(--font-display)" fontWeight={800} fill="var(--text)">
        −10–17% XAVF
      </text>
    </Svg>
  );
}

function Bone() {
  return (
    <Svg label="Suyak zichligi oshadi">
      <path d="M70 90a20 20 0 1 1 26-24h128a20 20 0 1 1 26 24 20 20 0 1 1-26 24H96a20 20 0 1 1-26-24z" fill="var(--surface-3)" stroke="var(--fig-near)" strokeWidth={2} />
      {Array.from({ length: 36 }, (_, i) => (
        <motion.circle
          key={i}
          cx={104 + (i % 12) * 10}
          cy={80 + Math.floor(i / 12) * 10}
          r={2.6}
          fill="var(--fig-near)"
          initial={{ opacity: 0.1 }}
          animate={{ opacity: i % 3 === 0 ? [0.1, 1] : 0.8 }}
          transition={loop(1.6, (i % 7) * 0.1)}
        />
      ))}
      <text x={160} y={170} textAnchor="middle" fontSize={26} fontFamily="var(--font-display)" fontWeight={800} fill="var(--text)">
        +2.9%
      </text>
      <text x={160} y={190} textAnchor="middle" {...M}>
        BEL UMURTQALARI ZICHLIGI · 8 OY
      </text>
    </Svg>
  );
}

function Heart() {
  return (
    <Svg label="Yurak va qon bosimi">
      <motion.path
        d="M160 170s-60-36-60-80a32 32 0 0 1 60-16 32 32 0 0 1 60 16c0 44-60 80-60 80z"
        fill="var(--plate-red)"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 0.9, repeat: Infinity }}
        style={{ transformOrigin: '160px 110px' }}
      />
      <text x={160} y={205} textAnchor="middle" {...M}>
        QON BOSIMI ↓ · QAND NAZORATI ↑
      </text>
    </Svg>
  );
}

function Brain() {
  return (
    <Svg label="Kayfiyat yaxshilanadi">
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={160}
          cy={100}
          r={40}
          fill="none"
          stroke="var(--blue)"
          strokeWidth={2}
          initial={{ r: 40 }}
          animate={{ r: [40, 100], opacity: [0.8, 0] }}
          transition={{ duration: 2.4, delay: i * 0.8, repeat: Infinity }}
        />
      ))}
      <path d="M140 70a20 20 0 0 0-22 26 18 18 0 0 0 8 30 18 18 0 0 0 34 4V64a14 14 0 0 0-20 6zM180 70a20 20 0 0 1 22 26 18 18 0 0 1-8 30 18 18 0 0 1-34 4" fill="var(--fig-near)" />
      <text x={160} y={200} textAnchor="middle" {...M}>
        DEPRESSIYA ↓ · XAVOTIR ↓
      </text>
    </Svg>
  );
}

function Grades() {
  const rows = [
    ['A', 'Kreatin', 'var(--green)'],
    ['A', 'Kofein', 'var(--green)'],
    ['B', 'Oqsil kukuni', 'var(--blue)'],
    ['X', "BCAA, 'yog‘ yoqardi'", 'var(--red)'],
  ];
  return (
    <Svg label="Qo‘shimchalar dalil darajasi">
      {rows.map(([g, n, c], i) => (
        <motion.g key={n} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.25 }}>
          <rect x={40} y={24 + i * 46} width={36} height={36} rx={10} fill={c} />
          <text x={58} y={48 + i * 46} textAnchor="middle" fontSize={18} fontWeight={800} fill="#0b0e12">
            {g}
          </text>
          <text x={92} y={47 + i * 46} fontSize={15} {...T}>
            {n}
          </text>
        </motion.g>
      ))}
    </Svg>
  );
}

function Water() {
  return (
    <Svg label="Suv">
      <path d="M120 30 H200 L190 190 H130 Z" fill="none" stroke="var(--line-2)" strokeWidth={3} />
      <clipPath id="glass">
        <path d="M120 30 H200 L190 190 H130 Z" />
      </clipPath>
      <motion.rect x={110} width={100} fill="var(--blue)" opacity={0.75} clipPath="url(#glass)" initial={{ y: 170, height: 20 }} animate={{ y: [170, 70], height: [20, 120] }} transition={loop(2.6)} />
      <text x={160} y={212} textAnchor="middle" {...M}>
        2.0–2.5 L / KUN + MASHQ
      </text>
    </Svg>
  );
}

function Pain() {
  return (
    <Svg label="Mushakdagi yonish normal, bo‘g‘imdagi o‘tkir og‘riq — to‘xtash">
      <g>
        <rect x={20} y={40} width={130} height={140} rx={16} fill="var(--green-soft)" stroke="var(--green)" />
        <text x={85} y={80} textAnchor="middle" fontSize={34}>
          ✓
        </text>
        <text x={85} y={120} textAnchor="middle" fontSize={13} {...T}>
          Mushak «yonishi»
        </text>
        <text x={85} y={140} textAnchor="middle" fontSize={11} fill="var(--text-2)">
          normal
        </text>
      </g>
      <motion.g animate={{ x: [0, 2, -2, 0] }} transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1.2 }}>
        <rect x={170} y={40} width={130} height={140} rx={16} fill="var(--red-soft)" stroke="var(--red)" />
        <path d="M240 58 L222 90 H238 L230 118 L254 82 H238 L246 58Z" fill="var(--red)" />
        <text x={235} y={140} textAnchor="middle" fontSize={13} {...T}>
          Bo‘g‘imda o‘tkir
        </text>
        <text x={235} y={160} textAnchor="middle" fontSize={11} fill="var(--text-2)">
          to‘xtang
        </text>
      </motion.g>
    </Svg>
  );
}

function Cardio() {
  return (
    <Svg label="O‘rtacha kardio">
      <ellipse cx={160} cy={110} rx={120} ry={60} fill="none" stroke="var(--surface-3)" strokeWidth={14} />
      <motion.circle
        r={9}
        fill="var(--blue)"
        initial={{ cx: 280, cy: 110 }}
        animate={{ cx: [280, 160, 40, 160, 280], cy: [110, 170, 110, 50, 110] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      <text x={160} y={106} textAnchor="middle" fontSize={16} {...T}>
        20–40 daqiqa
      </text>
      <text x={160} y={126} textAnchor="middle" {...M}>
        HAFTASIGA 2–3 MARTA
      </text>
    </Svg>
  );
}

/** Mashq sahnasi: mashq rasmining ikki holati yonma-yon (boshlanish → ikkinchi chet) */
function FigScene({ id }: { id: string }) {
  const ex = exById(id);
  const ill = ILLUSTRATIONS[id];
  if (!ex || !ill) return null;
  const frames = motionFrames(ex, ill);
  return (
    <div className="fig-scene">
      {frames.map((f, i) => (
        <figure key={f.src}>
          <img src={f.src} alt={i === 0 ? ill.alt : ''} decoding="async" />
          <figcaption>
            {frames.length > 1 ? `${i + 1}. ` : ''}
            {f.phase}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function Scene({ id }: { id: SceneId }) {
  if (id.startsWith('fig:')) return <FigScene id={id.slice(4)} />;
  switch (id) {
    case 'balance-deficit':
      return <Balance />;
    case 'balance-surplus':
      return <Balance surplus />;
    case 'tdee':
      return <Tdee />;
    case 'fat-cells':
      return <FatCells />;
    case 'spot':
      return <Spot />;
    case 'fiber':
      return <Fiber />;
    case 'mps':
      return <Mps />;
    case 'stairs':
      return <Stairs />;
    case 'dose':
      return <Dose />;
    case 'rir':
      return <Rir />;
    case 'deload':
      return <Deload />;
    case 'plate':
      return <Plate />;
    case 'protein-day':
      return <ProteinDay />;
    case 'trend':
      return <Trend />;
    case 'sleep':
      return <Sleep />;
    case 'brace':
      return <Brace />;
    case 'warmup':
      return <Warmup />;
    case 'health':
      return <Health />;
    case 'bone':
      return <Bone />;
    case 'heart':
      return <Heart />;
    case 'brain':
      return <Brain />;
    case 'grades':
      return <Grades />;
    case 'water':
      return <Water />;
    case 'pain':
      return <Pain />;
    case 'cardio':
      return <Cardio />;
    default:
      return null;
  }
}
