// Darslik ko‘ruvchisi: hikoya (stories) uslubida slaydlar, oxirida test.
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Scene } from '../components/Scenes';
import { Icon } from '../components/ui/Icon';
import { LESSONS, lessonById } from '../data/lessons';
import { sourceById } from '../data/sources';
import { useStore } from '../store/useStore';

export default function LessonView() {
  const { id } = useParams();
  const nav = useNavigate();
  const lesson = lessonById(id ?? '');
  const completeLesson = useStore((s) => s.completeLesson);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  if (!lesson) return <div className="page empty">Dars topilmadi.</div>;
  const total = lesson.slides.length + 1;
  const onQuiz = i >= lesson.slides.length;
  const slide = lesson.slides[i];
  const src = slide?.source ? sourceById(slide.source) : null;
  const correct = lesson.quiz.filter((q, k) => answers[k] === q.correct).length;
  const allAnswered = Object.keys(answers).length === lesson.quiz.length;
  const next = LESSONS[(LESSONS.findIndex((l) => l.id === lesson.id) + 1) % LESSONS.length];

  const go = (d: number) => setI((x) => Math.max(0, Math.min(total - 1, x + d)));

  return (
    <div className="page no-tab" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', paddingTop: 'calc(var(--safe-t) + 10px)' }}>
      <div className="row gap-4" aria-label={`${i + 1} / ${total}`}>
        {Array.from({ length: total }, (_, k) => (
          <i key={k} style={{ flex: 1, height: 3, borderRadius: 2, background: k <= i ? 'var(--text)' : 'var(--surface-3)', transition: 'background .3s' }} />
        ))}
      </div>
      <div className="row between mt-12">
        <div className="stack">
          <span className="eyebrow">
            {lesson.category} · {lesson.title}
          </span>
        </div>
        <button className="icon-btn" onClick={() => nav(-1)} aria-label="Yopish">
          <Icon name="x" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!onQuiz ? (
          <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }} className="stack gap-16" style={{ flex: 1 }}>
            <div className="stage mt-12" style={{ aspectRatio: '320 / 230', padding: 6 }}>
              <Scene id={slide.scene} />
            </div>
            <h1 className="display" style={{ fontSize: 34 }}>
              {slide.title}
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--text-2)' }}>{slide.text}</p>
            {src && (
              <p className="tiny faint" style={{ lineHeight: 1.45 }}>
                Manba: {src.cite}
              </p>
            )}
          </motion.div>
        ) : (
          <motion.div key="quiz" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="stack gap-16 mt-16" style={{ flex: 1 }}>
            <h1 className="display display-l">Tekshirib ko‘ring</h1>
            {lesson.quiz.map((q, k) => (
              <div key={k} className="card stack gap-10">
                <span className="strong">{q.q}</span>
                {q.options.map((o, j) => {
                  const picked = answers[k] === j;
                  const show = answers[k] !== undefined;
                  const ok = j === q.correct;
                  return (
                    <button
                      key={j}
                      className="choice"
                      disabled={show}
                      onClick={() => setAnswers((a) => ({ ...a, [k]: j }))}
                      style={{
                        padding: '11px 14px',
                        borderColor: show && ok ? 'var(--green)' : show && picked ? 'var(--danger)' : undefined,
                        background: show && ok ? 'var(--green-soft)' : show && picked ? 'var(--red-soft)' : undefined,
                      }}
                    >
                      <span className="grow small strong">{o}</span>
                      {show && ok && <Icon name="check" size={18} style={{ color: 'var(--green)' }} />}
                      {show && picked && !ok && <Icon name="x" size={18} style={{ color: 'var(--danger)' }} />}
                    </button>
                  );
                })}
                {answers[k] !== undefined && <p className="small muted">{q.explain}</p>}
              </div>
            ))}
            {allAnswered && (
              <div className={`notice ${correct === lesson.quiz.length ? 'good' : 'gold'}`}>
                <Icon name="trophy" />
                <span>
                  {correct}/{lesson.quiz.length} to‘g‘ri. {correct === lesson.quiz.length ? 'Ajoyib!' : 'Yaxshi — slaydlarni qayta ko‘rib chiqing.'}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="row gap-8 mt-24" style={{ position: 'sticky', bottom: 'calc(var(--safe-b) + 12px)' }}>
        <button className="btn btn-secondary" onClick={() => go(-1)} disabled={i === 0} aria-label="Oldingi">
          <Icon name="left" />
        </button>
        {!onQuiz ? (
          <button className="btn btn-primary grow" onClick={() => go(1)}>
            {i === lesson.slides.length - 1 ? 'Testga o‘tish' : 'Keyingi'} <Icon name="right" size={18} />
          </button>
        ) : (
          <button
            className="btn btn-success grow"
            disabled={!allAnswered}
            onClick={() => {
              completeLesson(lesson.id);
              nav(`/lesson/${next.id}`, { replace: true });
              setI(0);
              setAnswers({});
            }}
          >
            Yakunlash · keyingi dars
          </button>
        )}
      </div>
    </div>
  );
}
