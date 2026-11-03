import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Figure } from '../components/figure/Figure';
import { NotFound } from '../components/NotFound';
import { Icon } from '../components/ui/Icon';
import { ILLUSTRATIONS } from '../data/illustrations';
import { ROUTINE_MAP, TRANSITION_SEC, stretchSteps } from '../data/routines';
import { useBack } from '../lib/useBack';
import { useStore } from '../store/useStore';

type Phase = 'prep' | 'hold' | 'done';

/** Qisqa signal: poza tugadi */
function beep(freq = 880, ms = 160) {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = freq;
    g.gain.value = 0.08;
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + ms / 1000);
    o.onended = () => void ctx.close();
  } catch {
    /* ovoz bo'lmasa — jim */
  }
}

/** Cho'zilish taymeri: har poza uchun tayyorlanish → ushlash, tomonlar alohida */
export default function StretchPlayer() {
  const { id = '' } = useParams();
  const r = ROUTINE_MAP[id];
  const steps = useMemo(() => (r ? stretchSteps(r) : []), [r]);
  const back = useBack(`/routine/${id}`);
  const settings = useStore((s) => s.settings);
  const addStretch = useStore((s) => s.addStretch);

  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('prep');
  const [left, setLeft] = useState(5);
  const [paused, setPaused] = useState(false);
  const endsAt = useRef(Date.now() + 5000);
  const held = useRef(0);
  const logged = useRef(false);

  const signal = useCallback(
    (freq?: number) => {
      if (settings.sound) beep(freq);
      if (settings.vibrate) navigator.vibrate?.(180);
    },
    [settings.sound, settings.vibrate],
  );

  const go = useCallback((i: number, p: Phase, sec: number) => {
    setIdx(i);
    setPhase(p);
    setLeft(sec);
    endsAt.current = Date.now() + sec * 1000;
  }, []);

  const finish = useCallback(() => {
    setPhase('done');
    if (!logged.current && held.current >= 30) {
      logged.current = true;
      addStretch(Math.round((held.current / 60) * 10) / 10);
    }
  }, [addStretch]);

  // keyingi bosqich: tayyorlanish → ushlash → keyingi pozaga tayyorlanish → … → tugadi
  const advance = useCallback(() => {
    if (phase === 'prep') {
      signal(660);
      go(idx, 'hold', steps[idx].sec);
    } else if (phase === 'hold') {
      held.current += steps[idx].sec;
      signal();
      if (idx + 1 >= steps.length) finish();
      // o'sha pozaning ikkinchi tomoni — qisqa tanaffus
      else go(idx + 1, 'prep', steps[idx + 1].ex.id === steps[idx].ex.id ? 4 : TRANSITION_SEC);
    }
  }, [phase, idx, steps, go, signal, finish]);

  useEffect(() => {
    if (phase === 'done' || paused) return;
    const t = setInterval(() => {
      const s = Math.max(0, Math.ceil((endsAt.current - Date.now()) / 1000));
      setLeft(s);
      if (s <= 0) advance();
    }, 250);
    return () => clearInterval(t);
  }, [phase, paused, advance]);

  // ekran o'chib qolmasin
  useEffect(() => {
    let lock: { release: () => Promise<void> } | null = null;
    const nav = navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } };
    nav.wakeLock
      ?.request('screen')
      .then((l) => (lock = l))
      .catch(() => {});
    return () => void lock?.release().catch(() => {});
  }, []);

  if (!r || r.kind !== 'stretch' || !steps.length) return <NotFound text="Cho‘zilish topilmadi" />;

  const pause = () => {
    if (paused) endsAt.current = Date.now() + left * 1000;
    setPaused((p) => !p);
  };
  const skip = () => {
    if (phase === 'prep') go(idx, 'hold', steps[idx].sec);
    else if (idx + 1 >= steps.length) finish();
    else go(idx + 1, 'prep', 3);
  };
  const prev = () => go(Math.max(0, phase === 'prep' ? idx - 1 : idx), 'prep', 3);
  const addTime = () => {
    endsAt.current += 10000;
    setLeft((l) => l + 10);
  };

  if (phase === 'done') {
    const min = Math.max(1, Math.round(held.current / 60));
    return (
      <div className="page no-tab stack gap-16" style={{ alignItems: 'center', textAlign: 'center', paddingTop: 'calc(var(--safe-t) + 64px)' }}>
        <span className="lib-safety-ico" style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--accent-soft)', color: 'var(--accent)' }}>
          <Icon name="check" size={32} />
        </span>
        <h1 className="display">Barakalla!</h1>
        <p className="muted">
          «{r.title}» — {min} daqiqa cho‘zilish. Muntazam bajarilsa (haftasiga 3–5 marta), harakat erkinligi bir necha haftada sezilarli oshadi.
        </p>
        <div className="stack gap-8" style={{ width: '100%' }}>
          <Link to="/routines?tab=stretch" className="btn btn-primary btn-block">
            Boshqa cho‘zilishlar
          </Link>
          <Link to="/" className="btn btn-secondary btn-block">
            Bosh sahifa
          </Link>
        </div>
      </div>
    );
  }

  const st = steps[idx];
  const ill = ILLUSTRATIONS[st.ex.id];
  const total = phase === 'prep' ? (idx === 0 ? 5 : TRANSITION_SEC) : st.sec;
  const frac = Math.min(1, Math.max(0, left / Math.max(1, total)));
  const next = steps[idx + 1];
  const C = 2 * Math.PI * 56;

  return (
    <div className="page no-tab sp gap-12">
      <div className="back-bar">
        <button className="icon-btn" onClick={back} aria-label="Yopish">
          <Icon name="x" />
        </button>
        <span className="eyebrow grow">{r.title}</span>
        <span className="small muted num">
          {idx + 1}/{steps.length}
        </span>
      </div>
      <div className="sp-prog" aria-hidden="true">
        <i style={{ width: `${((idx + (phase === 'hold' ? 1 - frac : 0)) / steps.length) * 100}%` }} />
      </div>

      <div className="sp-stage">
        {ill ? (
          <img src={ill.src} alt={st.ex.name} />
        ) : (
          <div className="stage">
            <Figure spec={st.ex.anim} primary={st.ex.primary} secondary={st.ex.secondary} playing={!paused} title={st.ex.name} fit />
          </div>
        )}
        {st.side && (
          <span className="tag stage-tag sp-side">
            <i className="dot" style={{ background: 'var(--accent)' }} />
            {st.side === 'o‘ng' ? 'O‘ng tomon' : 'Chap tomon'}
          </span>
        )}
      </div>

      <div className="row gap-16" style={{ alignItems: 'center' }}>
        <div className="sp-ring" role="timer" aria-label={`${left} soniya qoldi`}>
          <svg viewBox="0 0 132 132" aria-hidden="true">
            <circle cx="66" cy="66" r="56" fill="none" stroke="var(--line)" strokeWidth="10" />
            <circle
              cx="66"
              cy="66"
              r="56"
              fill="none"
              stroke={phase === 'prep' ? 'var(--text-3)' : 'var(--accent)'}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - frac)}
              style={{ transition: 'stroke-dashoffset 0.25s linear' }}
            />
          </svg>
          <b>{left}</b>
        </div>
        <div className="grow stack gap-4" style={{ minWidth: 0 }}>
          <span className="eyebrow">{phase === 'prep' ? 'Tayyorlaning' : 'Ushlab turing'}</span>
          <b style={{ fontSize: 20, lineHeight: 1.2 }}>{st.ex.name}</b>
          <span className="small muted">{phase === 'prep' ? st.ex.setup[0] : (st.ex.cues[0] ?? st.ex.breathing)}</span>
        </div>
      </div>

      <div className="row gap-8" style={{ justifyContent: 'center' }}>
        <button className="icon-btn" style={{ width: 52, height: 52, border: '1px solid var(--line)' }} onClick={prev} aria-label="Oldingi poza" disabled={idx === 0 && phase === 'prep'}>
          <Icon name="left" />
        </button>
        <button className="icon-btn filled" style={{ width: 64, height: 64 }} onClick={pause} aria-label={paused ? 'Davom ettirish' : 'Pauza'}>
          <Icon name={paused ? 'play' : 'pause'} size={26} />
        </button>
        <button className="icon-btn" style={{ width: 52, height: 52, border: '1px solid var(--line)' }} onClick={skip} aria-label="Keyingisi">
          <Icon name="right" />
        </button>
        {phase === 'hold' && (
          <button className="chip" onClick={addTime} aria-label="10 soniya qo‘shish">
            +10 s
          </button>
        )}
      </div>

      {next && (
        <div className="card tight row gap-10 small">
          <span className="eyebrow">Keyingi</span>
          <span className="grow" style={{ minWidth: 0 }}>
            {next.ex.name}
            {next.side ? ` · ${next.side} tomon` : ''}
          </span>
          <span className="muted num">{next.sec} s</span>
        </div>
      )}
      <details className="small">
        <summary className="muted">Qanday bajariladi</summary>
        <ol className="steps mt-8">
          {st.ex.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}
