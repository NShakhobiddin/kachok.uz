// «3D anatomiya»: mashqni tanlang — ilovadagi ikki kadrli harakat rasmi va aylanuvchi 3D modelda
// ishlayotgan mushaklar (sirt EMG, % MVIC) lime rangda yonadi. 3D (three.js + 3,5 MB model) faqat kerak bo‘lganda yuklanadi:
// kompyuterda — bo‘lim ekranga yaqinlashganda, telefonda — «3D model» bosilganda (trafik va batareya uchun).
import { Cube, Pause, Play } from '@phosphor-icons/react/ssr';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { BodyMap } from '../../../src/components/BodyMap';
import type { M3 } from '../../../src/data/muscles3d';
import type { AnimSpec } from '../../../src/types';
import { useSiteData } from '../data';
import type { ShowcaseRow } from '../model';
import { BotButton, Chips, Seg } from '../ui';

const Muscle3D = lazy(() => import('../../../src/components/Muscle3D'));

type Conn = { saveData?: boolean; effectiveType?: string };
/** trafikni tejash rejimi yoki sekin internet — 3D o‘zi yuklanmaydi (tugma bilan ochiladi) */
const lightMode = () => {
  const c = (navigator as Navigator & { connection?: Conn }).connection;
  return !!c?.saveData || /2g|3g/.test(c?.effectiveType ?? '');
};

const CUE = { up: 'Kuch bilan · nafas chiqaring', down: 'Nazorat bilan · nafas oling' } as const;

export function Anatomy() {
  const { showcase, stats, m3names } = useSiteData();
  const [i, setI] = useState(0);
  const [view, setView] = useState<'motion' | '3d'>('motion');
  const [sel, setSel] = useState<M3 | null>(null);
  const [state3d, setState3d] = useState<'loading' | 'ready' | 'error'>('loading');
  const ref = useRef<HTMLElement>(null);
  const ex = showcase[i];

  // kompyuter va tez internet: bo‘limga yaqinlashganda 3D o‘zi ochiladi
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (!window.matchMedia('(min-width: 960px)').matches || lightMode()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setView('3d');
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pick = (k: number) => {
    setI(k);
    setSel(null);
  };
  const top = ex.acts.slice(0, 5);
  const max = Math.max(1, ...top.map((a) => a.mvic));
  const selAct = sel ? ex.acts.find((a) => a.key === sel) : null;

  return (
    <section ref={ref} id="anatomiya" className="section" aria-labelledby="anat-t">
      <div className="container anat">
        <div className="anat-copy">
          <div className="section-head reveal">
            <span className="eyebrow">3D anatomiya</span>
            <h2 id="anat-t" className="section-title">
              Har mashqda qaysi mushak yonadi?
            </h2>
            <p className="body-3 muted">
              Mashqni tanlang: rasmda to‘g‘ri harakat, 3D modelda esa ishlayotgan mushaklar. Mushak EMG tadqiqotlarida qanchalik kuchli ishlagan bo‘lsa, shunchalik yorqin yonadi.
            </p>
          </div>
          <Chips label="Mashq" hideLabel value={i} options={showcase.map((s, k) => ({ v: k, t: s.name }))} onChange={pick} />
          <div className="anat-list" aria-live="polite">
            <span className="caption-3 muted">Eng ko‘p ishlaydigan mushaklar · {ex.tag}</span>
            <ul className="stack gap-12">
              {top.map((a) => (
                <li key={a.key} className="bar-row">
                  <span className="body-5">{a.name}</span>
                  <span className="body-4 num lime">
                    {a.est ? '≈' : ''}
                    {a.mvic}%
                  </span>
                  <span className="bar" aria-hidden="true">
                    <i style={{ transform: `scaleX(${a.mvic / max})`, background: 'var(--lime)' }} />
                  </span>
                </li>
              ))}
            </ul>
            <span className="caption-5 faint">% MVIC — mashq paytida mushak o‘z maksimal kuchining necha foizida ishlagani (sirt EMG). «≈» — taxminiy qiymat.</span>
          </div>
          <div className="tool-cta">
            <BotButton from="site_3d" size="md">
              Barcha {stats.illustrated} ta mashqni ko‘rish
            </BotButton>
          </div>
        </div>

        <div className="anat-stage-wrap reveal">
          <Seg
            label="Ko‘rinish"
            value={view}
            options={[
              { v: 'motion', t: 'Harakat' },
              { v: '3d', t: '3D model' },
            ]}
            onChange={setView}
          />
          <div className="stage">
            {view === 'motion' ? (
              <Motion key={ex.id} ex={ex} />
            ) : (
              <>
                <Suspense fallback={<Flat ex={ex} loading />}>
                  <Muscle3D
                    key={ex.id}
                    mode="turntable"
                    view={ex.view}
                    acts={ex.acts.map((a) => ({ key: a.key as M3, mvic: a.mvic }))}
                    anim={{ view: 'side', frames: ex.anim } as unknown as AnimSpec}
                    selected={sel}
                    onSelect={setSel}
                    onState={setState3d}
                    placeholder={<Flat ex={ex} loading />}
                    label={`${ex.name}: 3D modelda ishlayotgan mushaklar`}
                    className="stage-3d"
                  />
                </Suspense>
                {state3d === 'ready' && (
                  <span className="stage-hint caption-4">
                    <Cube size={14} aria-hidden="true" />
                    {sel ? (selAct ? `${m3names[sel]} — ${selAct.mvic}%` : `${m3names[sel] ?? ''}: bu mashqda deyarli ishlamaydi`) : 'Suring — aylanadi, mushakni bosing'}
                  </span>
                )}
                {state3d === 'error' && <span className="stage-hint caption-4">3D bu qurilmada ochilmadi — 2D xarita ko‘rsatildi</span>}
              </>
            )}
          </div>
          <p className="caption-5 faint">
            {view === 'motion' ? '3D model: ~3,5 MB, «3D model» bosilganda yuklanadi. ' : ''}
            3D model: Z-Anatomy (BodyParts3D asosida),{' '}
            <a className="link" href="https://creativecommons.org/licenses/by-sa/4.0/deed.uz" target="_blank" rel="noopener">
              CC BY-SA 4.0
            </a>
            . Rasmlar — ilovadan.
          </p>
        </div>
      </div>
    </section>
  );
}

/** 3D yuklanguncha (yoki ochilmasa) — 2D anatomik xarita */
function Flat({ ex, loading }: { ex: ShowcaseRow; loading?: boolean }) {
  return (
    <div className="stage-flat">
      <BodyMap primary={ex.primary} secondary={ex.secondary} views={[ex.view]} height={300} showLabels={false} />
      {loading && (
        <span className="stage-hint caption-4">
          <span className="spinner" aria-hidden="true" />
          3D model yuklanmoqda…
        </span>
      )}
    </div>
  );
}

/** Ikki kadr navbatma-navbat: boshlanish ↔ harakatning ikkinchi cheti, mashq tempi bilan */
function Motion({ ex }: { ex: ShowcaseRow }) {
  const two = ex.frames.length === 2;
  const [playing, setPlaying] = useState(true);
  // 0 — boshlanishda turish, 1 — o‘tish, 2 — ikkinchi chetda turish, 3 — qaytish
  const [step, setStep] = useState(0);
  const [frozen, setFrozen] = useState(0);
  const FADE = 380;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false);
  }, []);
  useEffect(() => {
    if (!playing || !two) return;
    const wait = step === 0 ? ex.tempo.go.ms : step === 2 ? ex.tempo.back.ms : FADE;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % 4), wait);
    return () => window.clearTimeout(id);
  }, [playing, step, two, ex]);

  const at = !two ? 0 : playing ? (step === 1 || step === 2 ? 1 : 0) : frozen;
  const moving = !playing || !two ? null : step === 0 || step === 1 ? ex.tempo.go.phase : ex.tempo.back.phase;

  return (
    <figure className="motion-fig" aria-label={`${ex.name}: ${ex.frames.map((f) => f.phase.toLowerCase()).join(' → ')}`}>
      <img src={ex.frames[0].src} alt={ex.alt} width={1024} height={1024} loading="lazy" decoding="async" />
      {two && (
        <img
          src={ex.frames[1].src}
          alt=""
          aria-hidden="true"
          width={1024}
          height={1024}
          loading="lazy"
          decoding="async"
          className="motion-top"
          style={{ opacity: at, transitionDuration: `${FADE}ms` }}
        />
      )}
      <figcaption className="stage-tag caption-3">{ex.frames[at].phase}</figcaption>
      {moving && <span className={`stage-cue caption-4 ${moving}`}>{CUE[moving]}</span>}
      {two && (
        <div className="motion-ctl">
          {!playing &&
            ex.frames.map((f, k) => (
              <button key={f.src} type="button" className={`chip button-xsm${frozen === k ? ' on' : ''}`} aria-pressed={frozen === k} onClick={() => setFrozen(k)}>
                {k + 1}. {f.phase}
              </button>
            ))}
          <button
            type="button"
            className="play-btn"
            aria-label={playing ? 'To‘xtatish' : 'Harakatni ko‘rsatish'}
            onClick={() => {
              if (!playing) setStep(0);
              else setFrozen(at);
              setPlaying(!playing);
            }}
          >
            {playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
          </button>
        </div>
      )}
    </figure>
  );
}
