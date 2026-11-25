// Do'stlar: taklif havolasi yoki kod bilan qo'shish, lenta (mashg'ulot va hafta natijalari) va "💪".
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiError, apiEnabled } from '../api/client';
import {
  acceptPendingFriend,
  addFriend,
  canTelegramLogin,
  deletePost,
  getFeed,
  getFriendCode,
  inviteLink,
  listFriends,
  pendingFriend,
  removeFriend,
  setKudos,
  telegramLogin,
  type FeedPost,
  type Friend,
} from '../api/social';
import { Fold } from '../components/ui/Fold';
import { Icon } from '../components/ui/Icon';
import { Toggle } from '../components/ui/controls';
import { MONTHS } from '../lib/date';
import { telegramShare } from '../lib/share';
import { useBack } from '../lib/useBack';
import { useStore } from '../store/useStore';

const errText = (e: unknown) => (e instanceof ApiError ? e.message : 'Xatolik yuz berdi');

/** "hozirgina", "5 daq oldin", "kecha", "3 kun oldin", "12 noyabr" */
export function ago(iso: string, now = Date.now()): string {
  const d = new Date(iso);
  const min = Math.round((now - d.getTime()) / 60000);
  if (min < 2) return 'hozirgina';
  if (min < 60) return `${min} daq oldin`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} soat oldin`;
  const days = Math.round(h / 24);
  if (days === 1) return 'kecha';
  if (days < 7) return `${days} kun oldin`;
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export default function Friends() {
  const back = useBack('/');
  const account = useStore((s) => s.account);
  if (!apiEnabled)
    return (
      <Shell back={back}>
        <div className="card stack gap-8">
          <b>Server hali ulanmagan</b>
          <p className="small muted">Do‘stlar lentasi uchun ilova serverga ulanishi kerak. Tez orada yoqiladi.</p>
        </div>
      </Shell>
    );
  return <Shell back={back}>{account ? <Feed /> : <SignIn />}</Shell>;
}

function Shell({ back, children }: { back: () => void; children: React.ReactNode }) {
  return (
    <div className="page">
      <div className="back-bar">
        <button className="icon-btn" onClick={back} aria-label="Orqaga">
          <Icon name="left" />
        </button>
        <span className="eyebrow">Do‘stlar</span>
      </div>
      <h1 className="display">Do‘stlar</h1>
      <p className="small muted mt-4">Do‘stlaringiz mashg‘ulotlarini ko‘ring, «💪» bilan qo‘llab-quvvatlang — birga shug‘ullanish ko‘proq ilhom beradi.</p>
      <div className="mt-16 stack gap-12">{children}</div>
    </div>
  );
}

function SignIn() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const pending = pendingFriend();
  const tg = canTelegramLogin();
  return (
    <>
      {pending && (
        <div className="notice good small">
          <Icon name="users" size={18} />
          <span>Sizni do‘stingiz taklif qildi — kirganingizdan keyin avtomatik qo‘shiladi.</span>
        </div>
      )}
      <div className="card stack gap-12">
        <b>Kirish kerak</b>
        <p className="small muted">Natijalaringiz faqat siz qo‘shgan do‘stlarga ko‘rinadi. Telefon raqamingiz hech kimga ko‘rsatilmaydi.</p>
        {tg ? (
          <button
            className="btn btn-primary btn-block"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setErr(null);
              try {
                await telegramLogin();
              } catch (e) {
                setErr(errText(e));
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? 'Kirilmoqda…' : 'Telegram orqali kirish'}
          </button>
        ) : (
          <Link to="/account" className="btn btn-primary btn-block">
            Akkauntga kirish
          </Link>
        )}
        {err && (
          <p className="small" role="alert" style={{ color: 'var(--red)' }}>
            {err}
          </p>
        )}
      </div>
    </>
  );
}

function Feed() {
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);
  const [posts, setPosts] = useState<FeedPost[] | null>(null);
  const [more, setMore] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [code, setCode] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [added, setAdded] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const name = await acceptPendingFriend();
      if (name) setAdded(name);
      const [f, fr, c] = await Promise.all([getFeed(), listFriends(), getFriendCode()]);
      setPosts(f.posts);
      setMore(f.more);
      setFriends(fr);
      setCode(c);
    } catch (e) {
      setErr(errText(e));
      setPosts((p) => p ?? []);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  const invite = () => code && telegramShare(`Men GYMbos’da mashq qilyapman — do‘st bo‘lib, bir-birimizni qo‘llab-quvvatlaylik! Mening kodim: ${code}\n${inviteLink(code)}`);
  const add = async () => {
    setBusy(true);
    setErr(null);
    try {
      const f = await addFriend(input.trim());
      setAdded(f.name || 'Do‘st');
      setInput('');
      await load();
    } catch (e) {
      setErr(errText(e));
    } finally {
      setBusy(false);
    }
  };
  const kudos = async (p: FeedPost) => {
    const on = !p.kudoed;
    setPosts((list) => list?.map((x) => (x.id === p.id ? { ...x, kudoed: on, kudos: x.kudos + (on ? 1 : -1) } : x)) ?? null);
    await setKudos(p.id, on).catch(() => setPosts((list) => list?.map((x) => (x.id === p.id ? p : x)) ?? null));
  };

  return (
    <>
      {added && (
        <div className="notice good small" role="status">
          <Icon name="check" size={18} />
          <span>
            <b>{added}</b> do‘stlaringizga qo‘shildi.
          </span>
        </div>
      )}

      {/* taklif */}
      <div className="card stack gap-10">
        <div className="row between gap-8">
          <b>Do‘stlarni taklif qiling</b>
          {code && <span className="tag num">Kod: {code}</span>}
        </div>
        <button className="btn btn-primary btn-block" onClick={invite} disabled={!code}>
          <Icon name="share" size={18} /> Telegram’da taklif yuborish
        </button>
        <div className="row gap-8">
          <input className="input grow" placeholder="Do‘st kodi" value={input} maxLength={12} onChange={(e) => setInput(e.target.value.toUpperCase())} aria-label="Do‘st kodi" />
          <button className="btn btn-secondary" disabled={input.trim().length < 6 || busy} onClick={add}>
            Qo‘shish
          </button>
        </div>
      </div>

      {err && (
        <p className="small" role="alert" style={{ color: 'var(--red)' }}>
          {err}
        </p>
      )}

      {/* lenta */}
      <div className="section-head mt-4">
        <h2>Lenta</h2>
        <button className="small strong accent-text" onClick={() => void load()}>
          Yangilash
        </button>
      </div>
      {posts === null ? (
        <p className="small muted">Yuklanmoqda…</p>
      ) : posts.length === 0 ? (
        <div className="card small muted" style={{ textAlign: 'center' }}>
          {friends.length ? 'Hali yozuv yo‘q. Mashg‘ulotni tugatsangiz, natijangiz shu yerda chiqadi.' : 'Do‘st qo‘shing — ularning mashg‘ulotlari shu yerda chiqadi.'}
        </div>
      ) : (
        posts.map((p) => <PostCard key={p.id} p={p} onKudos={() => kudos(p)} onDelete={async () => (await deletePost(p.id).catch(() => null), setPosts((l) => l?.filter((x) => x.id !== p.id) ?? null))} />)
      )}
      {more && posts && (
        <button
          className="btn btn-ghost btn-block"
          onClick={async () => {
            const f = await getFeed(posts[posts.length - 1].created_at).catch(() => null);
            if (f) {
              setPosts([...posts, ...f.posts]);
              setMore(f.more);
            }
          }}
        >
          Yana
        </button>
      )}

      <Fold title={`Do‘stlarim (${friends.length})`} hint="Ro‘yxat va lentaga chiqarish sozlamasi">
        <div className="stack gap-8">
          {friends.map((f) => (
            <div key={f.id} className="row between gap-8">
              <span className="row gap-8">
                <span className="avatar sm">{(f.name || '?')[0].toUpperCase()}</span>
                <span className="stack" style={{ gap: 0 }}>
                  <b className="small">{f.name || 'Sportchi'}</b>
                  <span className="tiny muted">{f.last_post ? `oxirgi mashg‘ulot: ${ago(f.last_post)}` : 'hali yozuv yo‘q'}</span>
                </span>
              </span>
              <button
                className="small muted"
                onClick={async () => {
                  await removeFriend(f.id).catch(() => null);
                  await load();
                }}
              >
                O‘chirish
              </button>
            </div>
          ))}
          <label className="row between gap-12 mt-8">
            <span className="small">Tugagan mashg‘ulotlarim do‘stlarga avtomatik ko‘rinsin</span>
            <Toggle on={settings.feedShare !== false} onChange={(v) => setSettings({ feedShare: v })} label="Lentaga avtomatik" />
          </label>
        </div>
      </Fold>
    </>
  );
}

function PostCard({ p, onKudos, onDelete }: { p: FeedPost; onKudos: () => void; onDelete: () => void }) {
  const d = p.data;
  const title = 'label' in d ? `Haftalik hisobot · ${d.label}` : d.title;
  return (
    <article className="card stack gap-10">
      <div className="row gap-10">
        <span className="avatar sm">{(p.author || '?')[0].toUpperCase()}</span>
        <div className="grow" style={{ minWidth: 0 }}>
          <b className="small">{p.own ? 'Siz' : p.author || 'Sportchi'}</b>
          <div className="tiny muted">{ago(p.created_at)}</div>
        </div>
        {p.own && (
          <button className="tiny muted" onClick={onDelete} aria-label="Yozuvni o‘chirish">
            O‘chirish
          </button>
        )}
      </div>
      <b className="title">{title}</b>
      {'done' in d && (
        <span className="small muted">
          {d.done}/{d.planned} mashg‘ulot{d.streak > 1 ? ` · ${d.streak} hafta ketma-ket` : ''}
        </span>
      )}
      <div className="row wrap gap-6">
        {d.stats.map(([k, v]) => (
          <span key={k} className="tag num">
            {k}: <b style={{ marginLeft: 4 }}>{v}</b>
          </span>
        ))}
      </div>
      {d.rows.length > 0 && (
        <div className="stack" style={{ gap: 4 }}>
          {d.rows.slice(0, 3).map((r) => (
            <div key={r.name} className="row between gap-8 small">
              <span className="ellipsis">{r.name}</span>
              <b className="num" style={{ color: r.hot ? 'var(--accent)' : undefined, flex: 'none' }}>
                {r.value}
              </b>
            </div>
          ))}
        </div>
      )}
      <button className={`kudos ${p.kudoed ? 'on' : ''}`} onClick={onKudos} disabled={p.own} aria-pressed={p.kudoed} aria-label={p.own ? `${p.kudos} ta 💪` : 'Qo‘llab-quvvatlash'}>
        💪 <span className="num">{p.kudos || ''}</span>
        {!p.own && <span className="small">{p.kudoed ? 'Qo‘llab-quvvatladingiz' : 'Barakalla!'}</span>}
      </button>
    </article>
  );
}
