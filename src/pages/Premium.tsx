// Pro tarif: imkoniyatlar, narxlar va Payme/Click orqali to'lov.
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { api, ApiError, apiEnabled, refreshMe } from '../api/client';
import { BILLING, PRO_FEATURES, type ProFeature } from '../lib/features';
import { fmtDate } from '../lib/date';
import { useStore } from '../store/useStore';

interface Plan {
  id: string;
  kind: 'pro' | 'coach';
  name: string;
  days: number;
  priceSom: number;
}
type Provider = 'payme' | 'click';

const FREE = [
  'Shaxsiy mashg‘ulot dasturi va uni tahrirlash',
  'Barcha mashqlar animatsiyasi va texnikasi',
  'Kg va takrorlarni yozish, rekordlar',
  'Statistika va haftalik tahlil',
  'Animatsion darsliklar',
  'Kaloriya va oqsil hisobi',
];
const som = (n: number) => n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' so‘m';

export default function Premium() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const account = useStore((s) => s.account);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [providers, setProviders] = useState<Record<Provider, boolean>>({ payme: false, click: false });
  const [sel, setSel] = useState(params.get('f') === 'coachPlus' ? 'coach_month' : 'pro_year');
  const [busy, setBusy] = useState<Provider | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const orderId = params.get('order');
  const highlight = params.get('f') as ProFeature | null;
  const ent = account?.entitlements;

  useEffect(() => {
    if (!apiEnabled) return;
    api<{ plans: Plan[]; providers: Record<Provider, boolean> }>('/billing/plans', { auth: false })
      .then((r) => {
        setPlans(r.plans);
        setProviders(r.providers);
      })
      .catch(() => setErr('Tariflar yuklanmadi. Internetni tekshiring.'));
  }, []);

  const pay = async (provider: Provider) => {
    setBusy(provider);
    setErr(null);
    try {
      const r = await api<{ orderId: string; checkoutUrl: string }>('/billing/orders', { body: { plan: sel, provider } });
      window.location.href = r.checkoutUrl;
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'To‘lov boshlanmadi');
      setBusy(null);
    }
  };

  const shown = plans.filter((p) => p.kind === 'pro' || account?.user.role === 'coach');
  const month = plans.find((p) => p.id === 'pro_month');

  return (
    <div className="page">
      <div className="back-bar">
        <button className="icon-btn" onClick={() => (window.history.length > 1 ? nav(-1) : nav('/'))} aria-label="Orqaga">
          <Icon name="left" />
        </button>
      </div>
      <span className="eyebrow" style={{ color: 'var(--yellow)' }}>
        Kachok Pro
      </span>
      <h1 className="display mt-4">Ko‘proq natija</h1>

      {orderId && account && <OrderStatus id={orderId} />}

      {ent?.pro.active && !orderId && (
        <div className="notice good mt-16">
          <Icon name="check" />
          <span>
            {ent.pro.trial ? 'Sinov muddati faol' : 'Pro faol'}
            {ent.pro.until ? ` — ${fmtDate(ent.pro.until, true)} gacha` : ''}.
          </span>
        </div>
      )}

      <section className="section">
        <div className="card stack gap-12">
          {(Object.keys(PRO_FEATURES) as ProFeature[])
            .filter((f) => f !== 'coachPlus' || account?.user.role === 'coach')
            .map((f) => (
              <div key={f} className="row gap-12" style={{ color: highlight === f ? 'var(--yellow)' : undefined }}>
                <Icon name="spark" size={18} style={{ color: 'var(--yellow)' }} />
                <span className={highlight === f ? 'strong' : ''}>{PRO_FEATURES[f]}</span>
              </div>
            ))}
        </div>
        <p className="small muted mt-12">Har doim bepul:</p>
        <div className="stack gap-6 mt-8">
          {FREE.map((f) => (
            <div key={f} className="row gap-8 small muted">
              <Icon name="check" size={14} style={{ color: 'var(--green)' }} /> {f}
            </div>
          ))}
        </div>
      </section>

      {!BILLING ? (
        <div className="notice info mt-24">
          <Icon name="info" />
          <span>Hozircha barcha imkoniyatlar bepul ochiq.</span>
        </div>
      ) : !account ? (
        <div className="card stack gap-12 mt-24">
          <p className="strong">Pro uchun akkaunt kerak</p>
          <p className="small muted">Telefon raqam bilan kiring — 7 kunlik sinov muddati avtomatik yoqiladi.</p>
          <Link to="/account" className="btn btn-primary btn-block">
            Kirish
          </Link>
        </div>
      ) : (
        <section className="section stack gap-12">
          {shown.map((p) => {
            const perMonth = Math.round(p.priceSom / (p.days / 30) / 100) * 100;
            const save = month && p.kind === 'pro' && p.days > 30 ? Math.round((1 - perMonth / month.priceSom) * 100) : 0;
            return (
              <button key={p.id} className={`choice ${sel === p.id ? 'on' : ''}`} onClick={() => setSel(p.id)} aria-pressed={sel === p.id}>
                <div className="grow">
                  <div className="ch-title row gap-8">
                    {p.name}
                    {save > 0 && (
                      <span className="tag" style={{ color: 'var(--green)' }}>
                        −{save}%
                      </span>
                    )}
                  </div>
                  <div className="ch-desc">{p.kind === 'coach' ? '50 tagacha mijoz, Pro ham kiradi' : p.days > 30 ? `oyiga ≈ ${som(perMonth)}` : 'istalgan vaqt to‘xtatish mumkin'}</div>
                </div>
                <span className="strong num">{som(p.priceSom)}</span>
              </button>
            );
          })}
          <div className="grid-2 mt-8">
            <button className="btn btn-secondary" disabled={!providers.payme || !!busy} onClick={() => pay('payme')}>
              {busy === 'payme' ? '...' : 'Payme'}
            </button>
            <button className="btn btn-secondary" disabled={!providers.click || !!busy} onClick={() => pay('click')}>
              {busy === 'click' ? '...' : 'Click'}
            </button>
          </div>
          {!providers.payme && !providers.click && plans.length > 0 && <p className="tiny faint">To‘lov tizimlari hali ulanmagan.</p>}
          <p className="tiny faint">Obuna avtomatik yangilanmaydi: muddat tugaganda qayta to‘laysiz. Muddat davomida to‘lasangiz, kunlar qo‘shilib boradi.</p>
        </section>
      )}

      {err && (
        <p className="small mt-12" role="alert" style={{ color: 'var(--danger)' }}>
          {err}
        </p>
      )}
    </div>
  );
}

/** To'lovdan qaytgach: buyurtma holatini tekshirib turish */
function OrderStatus({ id }: { id: string }) {
  const [status, setStatus] = useState<string>('created');
  useEffect(() => {
    let stop = false;
    let n = 0;
    const tick = async () => {
      try {
        const r = await api<{ order: { status: string } }>(`/billing/orders/${id}`);
        if (stop) return;
        setStatus(r.order.status);
        if (r.order.status === 'paid') {
          await refreshMe().catch(() => null);
          return;
        }
        if (r.order.status === 'cancelled') return;
      } catch {
        /* keyingi urinish */
      }
      if (!stop && ++n < 40) setTimeout(tick, 3000);
    };
    void tick();
    return () => {
      stop = true;
    };
  }, [id]);
  if (status === 'paid')
    return (
      <div className="notice good mt-16" role="status">
        <Icon name="check" />
        <span>
          <b>To‘lov qabul qilindi.</b> Pro imkoniyatlari ochildi — rahmat!
        </span>
      </div>
    );
  if (status === 'cancelled')
    return (
      <div className="notice warn mt-16" role="status">
        <Icon name="alert" />
        <span>To‘lov bekor qilindi. Qaytadan urinib ko‘rishingiz mumkin.</span>
      </div>
    );
  return (
    <div className="notice info mt-16" role="status">
      <Icon name="clock" />
      <span>To‘lov tasdiqlanishi kutilmoqda...</span>
    </div>
  );
}
