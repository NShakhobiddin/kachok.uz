import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { SOURCES } from '../data/sources';

export default function Sources() {
  const nav = useNavigate();
  return (
    <div className="page">
      <div className="back-bar">
        <button className="icon-btn" onClick={() => nav(-1)} aria-label="Orqaga">
          <Icon name="left" />
        </button>
      </div>
      <h1 className="display display-l">Ilmiy manbalar</h1>
      <p className="muted mt-8">
        Kachok’dagi har bir tavsiya — xalqaro tashkilotlar pozitsiyasi (ACSM, ISSN, JSST/WHO, EFSA) yoki meta-tahlillarga asoslangan. Har bir manba mualliflari, jurnali va DOI raqami bilan tekshirilgan.
      </p>
      <div className="stack gap-10 mt-16">
        {SOURCES.map((s) => (
          <div key={s.id} className="card tight stack gap-6">
            <span className="strong small">{s.short}</span>
            <span className="small">{s.finding}</span>
            <span className="tiny faint" style={{ lineHeight: 1.45 }}>
              {s.cite}
            </span>
            {s.doi && (
              <a className="tiny" href={`https://doi.org/${s.doi}`} target="_blank" rel="noreferrer noopener">
                doi:{s.doi}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
