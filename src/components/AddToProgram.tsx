// Mashq sahifasidan: mashqni dasturning tanlangan kuniga yoki joriy mashg'ulotga qo'lda qo'shish.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DAYS_SHORT } from '../lib/date';
import { useStore } from '../store/useStore';
import type { Exercise } from '../types';
import { Icon } from './ui/Icon';
import { Sheet } from './ui/Sheet';

export function AddToProgram({ ex }: { ex: Exercise }) {
  const program = useStore((s) => s.program);
  const active = useStore((s) => s.active);
  const addPlanned = useStore((s) => s.addPlanned);
  const addActiveExercise = useStore((s) => s.addActiveExercise);
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  if (!program) return null;
  const days = [...program.days].sort((a, b) => a.weekday - b.weekday);
  return (
    <>
      <button className="btn btn-secondary btn-block mt-12" onClick={() => setOpen(true)}>
        <Icon name="plus" size={18} /> Dasturga qo‘shish
      </button>
      <Sheet
        open={open}
        onClose={() => {
          setOpen(false);
          setAdded(null);
        }}
        label="Dasturga qo‘shish"
      >
        <h3 className="title" style={{ marginBottom: 12 }}>
          «{ex.name}» qaysi kunga?
        </h3>
        <div className="stack gap-8">
          {active && (
            <button
              className="choice"
              onClick={() => {
                addActiveExercise(ex.id);
                nav('/workout');
              }}
            >
              <span className="pill-num">
                <Icon name="play" size={13} />
              </span>
              <div className="grow">
                <div className="ch-title">Joriy mashg‘ulotga</div>
                <div className="ch-desc">{active.log.title} — hozir bajarish</div>
              </div>
            </button>
          )}
          {days.map((d) => {
            const has = d.exercises.some((pe) => pe.exerciseId === ex.id);
            return (
              <button
                key={d.id}
                className={`choice ${added === d.id ? 'on' : ''}`}
                disabled={has && added !== d.id}
                style={has && added !== d.id ? { opacity: 0.5 } : undefined}
                onClick={() => {
                  if (has) return;
                  addPlanned(d.id, ex.id);
                  setAdded(d.id);
                }}
              >
                <span className="pill-num">{DAYS_SHORT[d.weekday]}</span>
                <div className="grow">
                  <div className="ch-title">{d.title}</div>
                  <div className="ch-desc">{added === d.id ? 'Qo‘shildi ✓' : has ? 'Bu kunda bor' : `${d.exercises.length} ta mashq`}</div>
                </div>
              </button>
            );
          })}
        </div>
        {added && (
          <Link to="/program" className="btn btn-primary btn-block mt-16">
            Dasturni ko‘rish <Icon name="right" size={18} />
          </Link>
        )}
      </Sheet>
    </>
  );
}
