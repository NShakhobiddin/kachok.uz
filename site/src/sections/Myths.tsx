// «Mif yoki haqiqat?»: zaldagi mashhur gaplar — tanlaysiz, tushuntirish va manba chiqadi; oxirida ball va ulashish.
import { ArrowClockwise, ArrowRight, ArrowUpRight, Check, PaperPlaneTilt, X } from '@phosphor-icons/react/ssr';
import { useRef, useState } from 'react';
import { useSiteData } from '../data';
import { BotButton, CheckItem } from '../ui';

const SHARE_URL = `${__SITE_URL__}/#mif`;

function verdict(score: number, total: number): { title: string; text: string } {
  const r = score / total;
  if (r === 1) return { title: 'Murabbiy darajasi!', text: 'Birorta mif sizni aldolmadi. Endi bu bilimni zalda ishlatish qoldi.' };
  if (r >= 0.7) return { title: 'Zo‘r natija', text: 'Ko‘p narsani bilasiz. Qolgan bo‘shliqlarni ilovadagi qisqa darslar to‘ldiradi.' };
  if (r >= 0.4) return { title: 'Yomon emas', text: 'Zaldagi gaplarning yarmi mif ekan. Ilovadagi darslar 3–5 daqiqada asosiysini tushuntiradi.' };
  return { title: 'Miflar ko‘p ekan', text: 'Xavotir olmang, ko‘pchilik shunday boshlaydi. Ilova har bir qoidani manbasi bilan tushuntiradi.' };
}

export function Myths() {
  const { myths, stats } = useSiteData();
  const total = myths.length;
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const m = myths[Math.min(i, total - 1)];
  const answered = pick !== null;
  const right = answered && pick === m.truth;

  // telefonda: yangi savol yoki natija kartochka boshidan ko‘rinsin
  const focusCard = () =>
    requestAnimationFrame(() => {
      const el = cardRef.current;
      if (!el) return;
      el.focus({ preventScroll: true });
      if (el.getBoundingClientRect().top < 80) el.scrollIntoView({ block: 'start' });
    });
  const answer = (v: boolean) => {
    if (answered) return;
    setPick(v);
    if (v === m.truth) setScore((s) => s + 1);
    // javob va «Keyingisi» tugmasi ekrandan pastda qolmasin
    requestAnimationFrame(() => {
      const next = cardRef.current?.querySelector('.myth-next');
      if (next && next.getBoundingClientRect().bottom > window.innerHeight - 16) next.scrollIntoView({ block: 'nearest' });
    });
  };
  const next = () => {
    if (i + 1 >= total) setDone(true);
    else {
      setI(i + 1);
      setPick(null);
    }
    focusCard();
  };
  const restart = () => {
    setI(0);
    setPick(null);
    setScore(0);
    setDone(false);
    focusCard();
  };

  const v = verdict(score, total);
  const shareText = `GYMbos «Mif yoki haqiqat?» testida ${total} tadan ${score} tasini topdim. Siz-chi?`;
  const share = `https://t.me/share/url?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(shareText)}`;

  return (
    <section id="mif" className="section" aria-labelledby="mif-t">
      <div className="container myths">
        <div className="section-head reveal">
          <span className="eyebrow">O‘yin · 1 daqiqa</span>
          <h2 id="mif-t" className="section-title">
            Mif yoki haqiqat?
          </h2>
          <p className="body-3 muted">
            Zalda eshitiladigan {total} ta gap. Har biriga javob bering: to‘g‘rimi yoki yo‘q, tushuntirish va ilmiy manbasi darhol chiqadi.
          </p>
          <ul className="checks">
            <CheckItem>Har javob ilmiy maqolaga tayanadi</CheckItem>
            <CheckItem>Oxirida natijangizni do‘stga yuborasiz</CheckItem>
            <CheckItem>Ro‘yxatdan o‘tish shart emas</CheckItem>
          </ul>
        </div>

        <div ref={cardRef} className="myth-card reveal" tabIndex={-1} aria-live="polite">
          {!done ? (
            <div key={i} className="myth-step">
              <div className="myth-top">
                <span className="caption-3 muted num">
                  {i + 1} / {total}
                </span>
                <span className="caption-3 lime num">{score} ball</span>
              </div>
              <div className="myth-progress" aria-hidden="true">
                <i style={{ transform: `scaleX(${(i + (answered ? 1 : 0)) / total})` }} />
              </div>
              <p className="myth-claim">«{m.claim}»</p>
              {!answered ? (
                <div className="myth-btns">
                  <button type="button" className="myth-btn is-myth button-md" onClick={() => answer(false)}>
                    <X size={20} weight="bold" aria-hidden="true" />
                    Mif
                  </button>
                  <button type="button" className="myth-btn is-truth button-md" onClick={() => answer(true)}>
                    <Check size={20} weight="bold" aria-hidden="true" />
                    Haqiqat
                  </button>
                </div>
              ) : (
                <div className={`myth-answer ${right ? 'ok' : 'bad'}`}>
                  <div className="row gap-12">
                    <span className={`ico-round ${right ? 'lime' : 'red'}`} aria-hidden="true">
                      {right ? <Check size={14} weight="bold" /> : <X size={14} weight="bold" />}
                    </span>
                    <span className="heading-6">
                      {right ? 'To‘g‘ri!' : 'Noto‘g‘ri.'} Bu — {m.truth ? 'haqiqat' : 'mif'}.
                    </span>
                  </div>
                  <p className="body-3 muted">{m.explain}</p>
                  {m.src.doi ? (
                    <a className="link caption-1" href={`https://doi.org/${m.src.doi}`} target="_blank" rel="noopener">
                      Manba: {m.src.short}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="caption-1 faint">Manba: {m.src.short}</span>
                  )}
                  <button type="button" className="btn btn-primary button-md myth-next" onClick={next}>
                    {i + 1 >= total ? 'Natijani ko‘rish' : 'Keyingisi'}
                    <ArrowRight size={18} weight="bold" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="myth-step myth-end">
              <span className="caption-3 muted">Natijangiz</span>
              <div className="big">
                <span className="heading-1 num">{score}</span>
                <span className="title-1 muted">/ {total}</span>
              </div>
              <div className="myth-dots" aria-hidden="true">
                {Array.from({ length: total }, (_, k) => (
                  <i key={k} className={k < score ? 'on' : ''} />
                ))}
              </div>
              <span className="heading-5">{v.title}</span>
              <p className="body-3 muted">
                {v.text} Ilovada {stats.lessons} ta animatsiyali dars va test bor: ozish, mushak o‘sishi, oqsil, uyqu.
              </p>
              <div className="tool-cta">
                <BotButton from="site_mif" size="md">
                  Darslarni ochish
                </BotButton>
                <a className="btn btn-ghost button-md" href={share} target="_blank" rel="noopener">
                  <PaperPlaneTilt size={18} aria-hidden="true" />
                  Do‘stga yuborish
                </a>
                <button type="button" className="link body-5 myth-again" onClick={restart}>
                  <ArrowClockwise size={16} aria-hidden="true" />
                  Qayta o‘ynash
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
