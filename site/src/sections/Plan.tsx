// «30 soniyada sizga mos dastur»: 3 ta savol (maqsad, joy, kunlar) — ilova dvigateli tuzgan haftalik reja darhol chiqadi.
// Standart reja sahifaga oldindan chizilgan; boshqa tanlovlar plans.json dan (birinchi bosishda ~10 KB yuklanadi).
import { ArrowRight, Barbell, Clock } from '@phosphor-icons/react/ssr';
import { useEffect, useState } from 'react';
import { fmt1, useSiteData } from '../data';
import { asset } from '../links';
import type { PlanRow } from '../model';
import { PLAN_DAYS, PLAN_DEFAULT, PLAN_GOALS, PLAN_PLACES, planKey, type Place } from '../plans';
import { BotButton, Chips } from '../ui';

const WEEK = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

let plansPromise: Promise<Record<string, PlanRow>> | null = null;
const loadPlans = () =>
  (plansPromise ??= fetch(asset('plans.json'))
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json() as Promise<Record<string, PlanRow>>;
    })
    .catch((e) => {
      plansPromise = null;
      throw e;
    }));

/** 180 → «3 daq», 90 → «1,5 daq», 80 → «80 s» */
const rest = (s: number) => (s >= 60 && s % 30 === 0 ? `${fmt1(s / 60)} daq` : `${s} s`);

export function Plan() {
  const { plan: first } = useSiteData();
  const [goal, setGoal] = useState(PLAN_DEFAULT.goal);
  const [place, setPlace] = useState<Place>(PLAN_DEFAULT.place);
  const [days, setDays] = useState(PLAN_DEFAULT.days);
  const [all, setAll] = useState<Record<string, PlanRow> | null>(null);
  const [failed, setFailed] = useState(false);
  const [d, setD] = useState(0);
  const key = planKey(goal, place, days);
  const plan = key === first.key ? first : (all?.[key] ?? null);

  useEffect(() => {
    if (key === first.key || all) return;
    let live = true;
    setFailed(false);
    loadPlans()
      .then((p) => live && setAll(p))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, [key, first.key, all]);
  useEffect(() => setD(0), [key]);

  const day = plan?.days[Math.min(d, plan.days.length - 1)];
  const goalName = PLAN_GOALS.find((g) => g.v === goal)!.t.toLowerCase();

  return (
    // sichqoncha yoki barmoq tekkanda rejalarni oldindan yuklab qo‘yamiz — tanlov darhol almashadi
    <section id="dastur" className="section" aria-labelledby="plan-t" onPointerEnter={() => void loadPlans().catch(() => {})} onFocus={() => void loadPlans().catch(() => {})}>
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">3 savol · 30 soniya</span>
          <h2 id="plan-t" className="section-title">
            Sizga mos dastur — uchta savol bilan
          </h2>
          <p className="body-3 muted">Tanlang — ilova tuzadigan haftalik reja shu yerda chiqadi: qaysi kuni qaysi mashq, necha set va takror.</p>
        </div>
        <div className="plan">
          <div className="panel plan-q">
            <Chips label="1. Maqsadingiz" value={goal} options={PLAN_GOALS} onChange={setGoal} />
            <Chips label="2. Qayerda shug‘ullanasiz" value={place} options={PLAN_PLACES.map(({ v, t }) => ({ v, t }))} onChange={setPlace} />
            <Chips label="3. Haftada necha kun" value={days} options={PLAN_DAYS.map((n) => ({ v: n, t: `${n} kun` }))} onChange={setDays} />
            <p className="caption-5 faint">Reja boshlovchi uchun, 1 soatlik mashg‘ulot. Ilovada yosh, vazn, tajriba va og‘riyotgan joyingizga qarab moslanadi.</p>
          </div>

          <div className="panel plan-r" aria-live="polite" aria-busy={!plan && !failed}>
            {plan && day ? (
              <>
                <div className="stack gap-4">
                  {/* «Chiziqli progressiya A/B» nomida uslub allaqachon bor — takrorlamaymiz */}
                  {!plan.name.startsWith(plan.method.split(' ')[0]) && <span className="caption-3 lime">{plan.method}</span>}
                  <span className="heading-6">{plan.name}</span>
                </div>
                <div className="week" aria-label={`Mashg‘ulot kunlari: ${plan.days.map((x) => WEEK[x.weekday]).join(', ')}`}>
                  {WEEK.map((w, k) => {
                    const at = plan.days.findIndex((x) => x.weekday === k);
                    return (
                      <button
                        key={w}
                        type="button"
                        className={`week-day${at >= 0 ? ' on' : ''}${at === d ? ' sel' : ''}`}
                        disabled={at < 0}
                        aria-pressed={at >= 0 ? at === d : undefined}
                        aria-label={at >= 0 ? `${w}: ${plan.days[at].title}` : `${w}: dam olish`}
                        onClick={() => at >= 0 && setD(at)}
                      >
                        <span className="caption-4">{w}</span>
                        <span className="week-dot" aria-hidden="true">
                          {at >= 0 ? at + 1 : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="plan-day">
                  <div className="row gap-12 wrap" style={{ justifyContent: 'space-between' }}>
                    <span className="title-2">
                      {d + 1}-kun · {day.title}
                    </span>
                    <span className="caption-2 muted row gap-4">
                      <Clock size={14} aria-hidden="true" />~{day.min} daq
                    </span>
                  </div>
                  <ol className="plan-ex">
                    {day.ex.map((e) => (
                      <li key={e.id}>
                        {e.thumb ? (
                          <img src={asset(`thumbs/${e.id}.webp`)} width={48} height={48} alt="" loading="lazy" decoding="async" />
                        ) : (
                          <span className="plan-ico" aria-hidden="true">
                            <Barbell size={20} />
                          </span>
                        )}
                        <span className="plan-mid">
                          <span className="body-5">{e.name}</span>
                          <span className="caption-5 faint">dam olish {rest(e.rest)}</span>
                        </span>
                        <span className="body-4 num plan-sets">
                          {e.sets} × {e.reps}
                        </span>
                      </li>
                    ))}
                  </ol>
                  {plan.days.length > 1 && (
                    <button type="button" className="link body-5 plan-next" onClick={() => setD((d + 1) % plan.days.length)}>
                      {d + 1 < plan.days.length ? `${d + 2}-kun` : '1-kun'}
                      <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>
                <div className="tool-cta">
                  <BotButton from={`site_plan_${goal}_${place}_${days}`} size="md">
                    Shu dastur bilan boshlash
                  </BotButton>
                </div>
                <p className="caption-5 faint">
                  Ilovada har setdan keyin ✓ bosasiz: keyingi safar qancha kilogramm olish, dam olish vaqti va {goalName} bo‘yicha haftalik natija o‘zi hisoblanadi.
                </p>
              </>
            ) : (
              <div className="empty">
                <span className="body-2">{failed ? 'Rejani yuklab bo‘lmadi' : 'Reja tayyorlanmoqda…'}</span>
                <span className="body-6">{failed ? 'Internetni tekshirib, tanlovni qayta bosing.' : 'Bir soniya.'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
