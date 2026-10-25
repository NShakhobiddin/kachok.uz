import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EquipmentGrid } from '../components/EquipmentGrid';
import { Icon } from '../components/ui/Icon';
import { Sheet } from '../components/ui/Sheet';
import { Choice, Stepper, Toggle } from '../components/ui/controls';
import { GROUPS, GROUP_ORDER, INJURIES } from '../data/catalog';
import { METHOD_INFO, resolveMethod } from '../engine/methods';
import { ACTIVITY } from '../engine/nutrition';
import { DEFAULT_DAYS } from '../engine/program';
import { DAYS_SHORT } from '../lib/date';
import { apiEnabled } from '../api/client';
import { saveFile } from '../lib/download';
import { BILLING } from '../lib/features';
import { APP_VERSION, forceUpdate } from '../lib/pwa';
import { exportData, useStore } from '../store/useStore';
import type { ActivityLevel, Profile as P } from '../types';
import { GOALS, LEVELS } from './Onboarding';

type Panel = 'body' | 'goal' | 'schedule' | 'equipment' | 'limits' | 'activity' | null;

export default function Profile() {
  const nav = useNavigate();
  const profile = useStore((s) => s.profile)!;
  const setProfile = useStore((s) => s.setProfile);
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);
  const importData = useStore((s) => s.importData);
  const reset = useStore((s) => s.reset);
  const account = useStore((s) => s.account);
  const [panel, setPanel] = useState<Panel>(null);
  const [draft, setDraft] = useState<P>(profile);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const open = (p: Panel) => {
    setDraft(profile);
    setPanel(p);
  };
  const save = (regen: boolean) => {
    setProfile(draft, regen);
    setPanel(null);
  };
  const regenPanels: Panel[] = ['goal', 'schedule', 'equipment', 'limits'];

  const download = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    saveFile(`kachok-zaxira-${new Date().toISOString().slice(0, 10)}.json`, blob).catch(() => setImportMsg('Fayl saqlanmadi. Qaytadan urinib ko‘ring.'));
  };

  return (
    <div className="page">
      <div className="back-bar">
        <button className="icon-btn" onClick={() => nav(-1)} aria-label="Orqaga">
          <Icon name="left" />
        </button>
      </div>
      <div className="row gap-16">
        <span style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--plate-blue)', display: 'grid', placeItems: 'center', fontSize: 28, fontWeight: 800, color: '#fff' }}>
          {(profile.name || 'K')[0].toUpperCase()}
        </span>
        <div>
          <h1 className="display display-m">{profile.name || 'Sportchi'}</h1>
          <p className="small muted">
            {profile.age} yosh · {profile.heightCm} sm · {profile.weightKg} kg
          </p>
        </div>
      </div>

      {apiEnabled && (
        <section className="section">
          <div className="card flush">
            <Item
              icon="user"
              label={account ? 'Akkaunt va sinxronlash' : 'Akkauntga kirish'}
              value={account ? `+${account.user.phone.slice(0, 3)} ${account.user.phone.slice(3, 5)} ···` : 'Bulutda saqlash'}
              onClick={() => nav('/account')}
              last={!(account?.user.role === 'coach') && !BILLING}
            />
            {account?.user.role === 'coach' && <Item icon="list" label="Mijozlarim" onClick={() => nav('/coach')} last={!BILLING} />}
            {BILLING && <Item icon="spark" label="Kachok Pro" value={account?.entitlements?.pro.active ? 'Faol' : undefined} onClick={() => nav('/premium')} last />}
          </div>
        </section>
      )}

      <section className="section">
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          Profil
        </div>
        <div className="card flush">
          <Item icon="scale" label="Tana ko‘rsatkichlari" value={`${profile.weightKg} kg`} onClick={() => open('body')} />
          <Item icon="target" label="Maqsad va daraja" value={GOALS.find((g) => g.id === profile.goal)?.title.split(' (')[0] ?? ''} onClick={() => open('goal')} />
          <Item icon="calendar" label="Jadval" value={`${profile.daysPerWeek} kun · ${profile.sessionMin} daq`} onClick={() => open('schedule')} />
          <Item icon="dumbbell" label="Zal jihozlari" value={`${profile.equipment.length} ta`} onClick={() => open('equipment')} />
          <Item icon="alert" label="Cheklovlar va ustuvorlik" value={profile.injuries.length ? `${profile.injuries.length} ta` : "Yo‘q"} onClick={() => open('limits')} />
          <Item icon="bolt" label="Kundalik faollik" value={ACTIVITY[profile.activity].name} onClick={() => open('activity')} />
          <Item icon="shield" label="Xavfsizlik markazi" onClick={() => nav('/safety')} last />
        </div>
      </section>

      <section className="section">
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          Mashg‘ulot sozlamalari
        </div>
        <div className="card stack gap-16">
          <label className="row between">
            <span>Taymer ovozi</span>
            <Toggle on={settings.sound} onChange={(v) => setSettings({ sound: v })} label="Taymer ovozi" />
          </label>
          <label className="row between">
            <span>Tebranish (vibratsiya)</span>
            <Toggle on={settings.vibrate} onChange={(v) => setSettings({ vibrate: v })} label="Tebranish" />
          </label>
          <div className="row between">
            <span>Shtanga grifi</span>
            <div className="row gap-6">
              {[20, 15, 10].map((k) => (
                <button key={k} className={`chip sm ${settings.barKg === k ? 'on' : ''}`} onClick={() => setSettings({ barKg: k })}>
                  {k} kg
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          Ma’lumotlar
        </div>
        <div className="card flush">
          <Item icon="download" label="Zaxira nusxa olish (.json)" onClick={download} />
          <Item icon="refresh" label="Zaxiradan tiklash" onClick={() => fileRef.current?.click()} />
          <Item icon="book" label="Ilmiy manbalar" onClick={() => nav('/sources')} last />
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setImportMsg(importData(await f.text()) ? 'Ma’lumotlar tiklandi.' : 'Fayl o‘qilmadi. Kachok’dan olingan .json zaxira faylini tanlang.');
          }}
        />
        {importMsg && (
          <p className="small mt-8" role="status" style={{ color: importMsg.startsWith('Fayl') ? 'var(--danger)' : 'var(--green)' }}>
            {importMsg}
          </p>
        )}
        <p className="tiny faint mt-8">
          {account ? 'Ma’lumotlar telefonda va bulutda saqlanadi.' : 'Barcha ma’lumotlar faqat shu qurilmada saqlanadi. Telefonni almashtirishdan oldin zaxira nusxa oling'}
          {!account && apiEnabled ? ' yoki akkauntga kiring.' : !account ? '.' : ''}
        </p>
        <button
          className="btn btn-ghost btn-block mt-16"
          style={{ color: 'var(--danger)' }}
          onClick={() => setResetOpen(true)}
        >
          Hammasini o‘chirish
        </button>
      </section>

      <div className="row center gap-8 mt-24 tiny faint" style={{ flexWrap: 'wrap' }}>
        <span className="num">Versiya: {APP_VERSION}</span>
        <button className="tiny strong" style={{ color: 'var(--blue-2)', minHeight: 32 }} onClick={() => void forceUpdate()}>
          Yangilanishni tekshirish
        </button>
      </div>
      <p className="tiny faint mt-8" style={{ textAlign: 'center' }}>
        Kachok 1.0 · Tavsiyalar ma’lumot uchun, tibbiy maslahat o‘rnini bosmaydi.
        <br />
        <Link to="/sources">ACSM · ISSN · WHO · EFSA manbalari</Link>
      </p>

      <Sheet open={resetOpen} onClose={() => setResetOpen(false)} label="Hammasini o‘chirish">
        <h3 className="title">Hammasini o‘chirasizmi?</h3>
        <p className="muted mt-8">Profil, dastur va butun mashg‘ulotlar tarixi shu qurilmadan o‘chiriladi.{' '}
          {account ? 'Akkauntdan ham chiqasiz — bulutdagi nusxa saqlanib qoladi, qayta kirsangiz tiklanadi.' : 'Buni qaytarib bo‘lmaydi — avval zaxira nusxa oling.'}</p>
        <div className="row gap-8 mt-16">
          <button className="btn btn-secondary grow" onClick={() => setResetOpen(false)}>
            Bekor qilish
          </button>
          <button
            className="btn btn-danger grow"
            onClick={() => {
              reset();
              nav('/onboarding');
            }}
          >
            O‘chirish
          </button>
        </div>
      </Sheet>

      <Sheet open={panel !== null} onClose={() => setPanel(null)} label="Tahrirlash">
        <div className="stack gap-12">
          {panel === 'body' && (
            <>
              <h3 className="title">Tana ko‘rsatkichlari</h3>
              <input className="input" placeholder="Ism" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              <div className="grid-2">
                <Choice on={draft.sex === 'male'} onClick={() => setDraft({ ...draft, sex: 'male' })} title="Erkak" />
                <Choice on={draft.sex === 'female'} onClick={() => setDraft({ ...draft, sex: 'female' })} title="Ayol" />
              </div>
              <Stepper value={draft.age} onChange={(v) => setDraft({ ...draft, age: v })} min={14} max={90} unit="yosh" label="Yosh" />
              <Stepper value={draft.heightCm} onChange={(v) => setDraft({ ...draft, heightCm: v })} min={130} max={225} unit="sm" label="Bo‘y" />
              <Stepper value={draft.weightKg} onChange={(v) => setDraft({ ...draft, weightKg: v })} step={0.5} min={35} max={250} unit="kg" label="Vazn" />
              <Stepper value={draft.bodyFat ?? 0} onChange={(v) => setDraft({ ...draft, bodyFat: v || undefined })} min={0} max={60} unit="% yog'" label="Tana yog‘i foizi (ixtiyoriy)" />
            </>
          )}
          {panel === 'goal' && (
            <>
              <h3 className="title">Maqsad</h3>
              {GOALS.map((g) => (
                <Choice key={g.id} on={draft.goal === g.id} onClick={() => setDraft({ ...draft, goal: g.id })} title={g.title} desc={g.desc} />
              ))}
              <h3 className="title mt-8">Daraja</h3>
              {LEVELS.map((l) => (
                <Choice key={l.id} on={draft.level === l.id} onClick={() => setDraft({ ...draft, level: l.id })} title={l.title} desc={l.desc} />
              ))}
              <h3 className="title mt-8">Dastur uslubi</h3>
              <Choice on={(draft.method ?? 'auto') === 'auto'} onClick={() => setDraft({ ...draft, method: 'auto' })} title="Avtomatik" desc={`Maqsad va darajaga qarab — hozir: ${METHOD_INFO[resolveMethod({ ...draft, method: 'auto' })].name}`} />
              {(['hypertrophy', 'strength', 'linear', 'powerbuilding'] as const).map((m) => (
                <Choice key={m} on={draft.method === m} onClick={() => setDraft({ ...draft, method: m })} title={METHOD_INFO[m].name} desc={m === 'powerbuilding' && draft.daysPerWeek < 4 ? `${METHOD_INFO[m].short} · haftasiga 4+ kun kerak` : METHOD_INFO[m].short} />
              ))}
            </>
          )}
          {panel === 'schedule' && (
            <>
              <h3 className="title">Jadval</h3>
              <div className="row gap-8">
                {[2, 3, 4, 5, 6].map((n) => (
                  <button key={n} className={`chip ${draft.daysPerWeek === n ? 'on' : ''}`} style={{ flex: 1, justifyContent: 'center', height: 44 }} onClick={() => setDraft({ ...draft, daysPerWeek: n, trainingDays: DEFAULT_DAYS[n] })}>
                    {n}
                  </button>
                ))}
              </div>
              <div className="row gap-6">
                {DAYS_SHORT.map((d, i) => {
                  const on = draft.trainingDays.includes(i);
                  return (
                    <button
                      key={d}
                      className={`chip ${on ? 'on' : ''}`}
                      style={{ flex: 1, justifyContent: 'center', padding: 0, height: 42 }}
                      onClick={() => {
                        const next = on ? draft.trainingDays.filter((x) => x !== i) : [...draft.trainingDays, i].sort();
                        if (next.length <= draft.daysPerWeek) setDraft({ ...draft, trainingDays: next });
                      }}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              <div className="row wrap gap-6">
                {[30, 45, 60, 75, 90].map((m) => (
                  <button key={m} className={`chip ${draft.sessionMin === m ? 'on' : ''}`} onClick={() => setDraft({ ...draft, sessionMin: m })}>
                    {m} daq
                  </button>
                ))}
              </div>
            </>
          )}
          {panel === 'equipment' && (
            <>
              <h3 className="title">Zal jihozlari</h3>
              <EquipmentGrid value={draft.equipment} onChange={(eq) => setDraft({ ...draft, equipment: eq })} />
            </>
          )}
          {panel === 'limits' && (
            <>
              <h3 className="title">Og‘riq yoki jarohat</h3>
              <p className="small muted">Belgilangan bo‘g‘im uchun xavfli mashqlar dasturdan chiqariladi, qolganlarida esa mashq sahifasi va mashg‘ulot paytida moslashtirish ko‘rsatiladi.</p>
              <div className="row wrap gap-8">
                {INJURIES.map((inj) => {
                  const on = draft.injuries.includes(inj.id);
                  return (
                    <button key={inj.id} className={`chip ${on ? 'on' : ''}`} onClick={() => setDraft({ ...draft, injuries: on ? draft.injuries.filter((x) => x !== inj.id) : [...draft.injuries, inj.id] })}>
                      {inj.name}
                    </button>
                  );
                })}
              </div>
              <h3 className="title mt-8">Ustuvor mushaklar</h3>
              <div className="row wrap gap-8">
                {GROUP_ORDER.map((g) => {
                  const on = draft.focus.includes(g);
                  return (
                    <button key={g} className={`chip ${on ? 'on' : ''}`} onClick={() => setDraft({ ...draft, focus: on ? draft.focus.filter((x) => x !== g) : draft.focus.length < 3 ? [...draft.focus, g] : draft.focus })}>
                      {GROUPS[g].name}
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {panel === 'activity' && (
            <>
              <h3 className="title">Kundalik faollik</h3>
              {(Object.keys(ACTIVITY) as ActivityLevel[]).map((a) => (
                <Choice key={a} on={draft.activity === a} onClick={() => setDraft({ ...draft, activity: a })} title={ACTIVITY[a].name} desc={ACTIVITY[a].desc} />
              ))}
            </>
          )}
          {panel && regenPanels.includes(panel) ? (
            <div className="stack gap-8 mt-8">
              <button className="btn btn-primary btn-block" disabled={panel === 'schedule' && draft.trainingDays.length !== draft.daysPerWeek} onClick={() => save(true)}>
                Saqlash va dasturni yangilash
              </button>
              <button className="btn btn-ghost btn-block" onClick={() => save(false)}>
                Faqat saqlash
              </button>
            </div>
          ) : (
            <button className="btn btn-primary btn-block mt-8" onClick={() => save(false)}>
              Saqlash
            </button>
          )}
        </div>
      </Sheet>
    </div>
  );
}

function Item({ icon, label, value, onClick, last }: { icon: string; label: string; value?: string; onClick: () => void; last?: boolean }) {
  return (
    <button className="row gap-12" onClick={onClick} style={{ width: '100%', padding: '14px 16px', borderBottom: last ? 0 : '1px solid var(--line)', textAlign: 'left' }}>
      <Icon name={icon} size={20} style={{ color: 'var(--text-2)' }} />
      <span className="grow">{label}</span>
      {value && <span className="small muted ellipsis" style={{ maxWidth: 150 }}>{value}</span>}
      <Icon name="right" size={16} style={{ color: 'var(--text-3)' }} />
    </button>
  );
}
