import { Link } from 'react-router-dom';
import { PRO_FEATURES, useIsPro, type ProFeature } from '../lib/features';
import { Icon } from './ui/Icon';

/** Pro bo'lmasa — mazmun o'rniga qisqa taklif kartasi */
export function ProGate({ feature, children }: { feature: ProFeature; children: React.ReactNode }) {
  const pro = useIsPro();
  if (pro) return <>{children}</>;
  return (
    <div className="card stack gap-12" style={{ alignItems: 'flex-start', borderColor: 'rgba(255, 200, 61, 0.35)' }}>
      <span className="tag" style={{ color: 'var(--yellow)' }}>
        <Icon name="lock" size={14} /> Pro
      </span>
      <p className="strong">{PRO_FEATURES[feature]}</p>
      <p className="small muted">Pro tarifda ochiladi. 7 kunlik sinov muddati — bepul.</p>
      <Link to={`/premium?f=${feature}`} className="btn btn-primary btn-sm">
        Pro’ni ko‘rish
      </Link>
    </div>
  );
}
