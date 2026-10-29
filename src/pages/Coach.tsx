// Murabbiy kabineti: mijozlar ro'yxati, ularning haftalik faolligi va taklif kodi.
import { useCallback, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { api, ApiError } from '../api/client';
import { GOALS } from './Onboarding';
import { BILLING } from '../lib/features';
import { fmtDate } from '../lib/date';
import { useStore } from '../store/useStore';
import type { Goal } from '../types';
import { useBack } from '../lib/useBack';

export interface ClientRow {
  id: string;
  name: string;
  phone: string;
  goal: Goal | null;
  linkedAt: string;
  lastWorkout: string | null;
  workouts7d: number;
  minutes7d: number;
}

export default function Coach() {
  const back = useBack();
  const account = useStore((s) => s.account);
  const [clients, setClients] = useState<ClientRow[] | null>(null);
  const [limit, setLimit] = useState(0);
  const [invite, setInvite] = useState<{ code: string; expiresInDays: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(() => {
    api<{ clients: ClientRow[]; limit: number }>('/coach/clients')
      .then((r) => {
        setClients(r.clients);
        setLimit(r.limit);
      })
      .catch((e) => setErr(e instanceof ApiError ? e.message : 'Yuklanmadi'));
  }, []);
  useEffect(load, [load]);

  if (!account || account.user.role !== 'coach') return <Navigate to="/account" replace />;

  const makeInvite = async () => {
    setErr(null);
    try {
      setInvite(await api('/coach/invites', { body: {} }));
      setCopied(false);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Kod yaratilmadi');
    }
  };
  const copy = async () => {
    if (!invite) return;
    const text = `Kachok ilovasida meni murabbiy sifatida qo‘shing: Profil → Akkaunt → Murabbiy kodi: ${invite.code}`;
    try {
      if (navigator.share) await navigator.share({ text });
      else {
        await navigator.clipboard.writeText(invite.code);
        setCopied(true);
      }
    } catch {
      /* bekor qilindi */
    }
  };

  const full = clients !== null && clients.length >= limit;
  const now = Date.now();

  return (
    <div className="page">
      <div className="back-bar">
        <button className="icon-btn" onClick={back} aria-label="Orqaga">
          <Icon name="left" />
        </button>
      </div>
      <div className="page-head">
        <div className="stack gap-4">
          <span className="eyebrow">Murabbiy kabineti</span>
          <h1 className="display">Mijozlarim</h1>
        </div>
        {clients && (
          <span className="tag num">
            {clients.length} / {limit}
          </span>
        )}
      </div>

      <div className="card stack gap-12">
        <div className="strong">Yangi mijoz qo‘shish</div>
        {invite ? (
          <>
            <button
              className="mono"
              onClick={copy}
              style={{ fontSize: 40, fontWeight: 700, letterSpacing: '0.25em', textAlign: 'center', padding: '8px 0', color: 'var(--text)' }}
              aria-label="Kodni ulashish"
            >
              {invite.code}
            </button>
            <p className="small muted">
              Mijoz ilovada <b>Profil → Akkaunt → Murabbiy</b> bo‘limiga shu kodni kiritadi. Kod {invite.expiresInDays} kun amal qiladi.
            </p>
            <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={copy}>
              <Icon name="share" size={16} /> {copied ? 'Nusxa olindi' : 'Ulashish'}
            </button>
          </>
        ) : (
          <>
            <p className="small muted">Kod yarating va mijozingizga yuboring. U ulanganidan keyin mashg‘ulotlari, vazni va dasturi shu yerda ko‘rinadi.</p>
            <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }} onClick={makeInvite} disabled={full}>
              <Icon name="plus" size={16} /> Taklif kodi yaratish
            </button>
          </>
        )}
        {full && (
          <div className="notice gold">
            <Icon name="lock" />
            <span>
              Bepul rejimda {limit} ta mijoz.{' '}
              {BILLING ? (
                <Link to="/premium?f=coachPlus" className="strong">
                  Murabbiy tarifi
                </Link>
              ) : (
                'Murabbiy tarifi'
              )}{' '}
              bilan 50 tagacha.
            </span>
          </div>
        )}
      </div>

      {err && (
        <p className="small mt-12" role="alert" style={{ color: 'var(--danger)' }}>
          {err}
        </p>
      )}

      <section className="section">
        {clients === null && !err && <div className="card empty">Yuklanmoqda...</div>}
        {clients?.length === 0 && <div className="card empty">Hali mijoz yo‘q. Yuqoridagi kodni yuboring.</div>}
        {clients && clients.length > 0 && (
          <div className="card flush">
            {clients.map((c, i) => {
              const idle = c.lastWorkout ? Math.floor((now - new Date(c.lastWorkout).getTime()) / 86400000) : null;
              const warn = idle === null || idle >= 5;
              return (
                <Link key={c.id} to={`/coach/${c.id}`} className="row gap-12" style={{ padding: '14px 16px', borderBottom: i < clients.length - 1 ? '1px solid var(--line)' : 0, color: 'inherit' }}>
                  <span style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--surface-3)', display: 'grid', placeItems: 'center', fontWeight: 800, flexShrink: 0 }}>
                    {(c.name || '?')[0].toUpperCase()}
                  </span>
                  <div className="grow" style={{ minWidth: 0 }}>
                    <div className="strong ellipsis">{c.name || c.phone}</div>
                    <div className="tiny muted ellipsis">
                      {c.goal ? GOALS.find((g) => g.id === c.goal)?.title.split(' (')[0] : 'Profil to‘ldirilmagan'} ·{' '}
                      <span style={{ color: warn ? 'var(--yellow)' : undefined }}>
                        {idle === null ? 'hali mashq qilmagan' : idle === 0 ? 'bugun mashq qildi' : `${idle} kun oldin · ${fmtDate(c.lastWorkout!)}`}
                      </span>
                    </div>
                  </div>
                  <div className="stack" style={{ alignItems: 'flex-end', gap: 2 }}>
                    <span className="strong num">{c.workouts7d}×</span>
                    <span className="tiny faint num">{c.minutes7d} daq/hafta</span>
                  </div>
                  <Icon name="right" size={16} style={{ color: 'var(--text-3)' }} />
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
