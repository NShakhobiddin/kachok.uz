// "Bugun" sahifasida: murabbiydan kelgan yangi dastur va xabarlar.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, apiEnabled } from '../api/client';
import { fmtDate } from '../lib/date';
import { useStore } from '../store/useStore';
import { Icon } from './ui/Icon';

interface Note {
  id: string;
  text: string;
  created_at: string;
  coach_name: string;
}

export function CoachBanner() {
  const nav = useNavigate();
  const account = useStore((s) => s.account);
  const program = useStore((s) => s.program);
  const programAck = useStore((s) => s.programAck);
  const ackProgram = useStore((s) => s.ackProgram);
  const seenNotes = useStore((s) => s.seenNotes);
  const markNote = useStore((s) => s.markNote);
  const lastSyncAt = useStore((s) => s.sync.lastSyncAt);
  const [notes, setNotes] = useState<Note[]>([]);
  const linked = !!account?.coach;

  useEffect(() => {
    if (!apiEnabled || !linked) return;
    api<{ notes: Note[] }>('/notes')
      .then((r) => setNotes(r.notes))
      .catch(() => null);
  }, [linked, lastSyncAt]);

  const note = notes.find((n) => !seenNotes.includes(n.id));
  const newProgram = program?.coach && program.coach.at !== programAck ? program.coach : null;
  if (!note && !newProgram) return null;

  return (
    <div className="stack gap-8" style={{ marginBottom: 12 }}>
      {newProgram && (
        <div className="notice info">
          <Icon name="calendar" />
          <div className="grow">
            <b>{newProgram.name}</b> sizga yangi dastur yubordi · {fmtDate(newProgram.at)}
            <div className="row gap-16 mt-8">
              <button
                className="small strong"
                style={{ color: 'var(--blue-2)' }}
                onClick={() => {
                  ackProgram(newProgram.at);
                  nav('/program');
                }}
              >
                Dasturni ko‘rish
              </button>
              <button className="small strong" style={{ color: 'var(--text-2)' }} onClick={() => ackProgram(newProgram.at)}>
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
      {note && (
        <div className="notice">
          <Icon name="user" />
          <div className="grow" style={{ minWidth: 0 }}>
            <div className="tiny muted">
              Murabbiy {note.coach_name || ''} · {fmtDate(note.created_at)}
            </div>
            <p className="mt-4" style={{ whiteSpace: 'pre-wrap' }}>
              {note.text}
            </p>
          </div>
          <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => markNote(note.id)} aria-label="O‘qildi">
            <Icon name="x" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
