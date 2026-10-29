import { Icon } from '../components/ui/Icon';
import { SOURCES } from '../data/sources';
import { useBack } from '../lib/useBack';

export default function Sources() {
  const back = useBack();
  return (
    <div className="page">
      <div className="back-bar">
        <button className="icon-btn" onClick={back} aria-label="Orqaga">
          <Icon name="left" />
        </button>
      </div>
      <h1 className="display display-l">Ilmiy manbalar</h1>
      <p className="muted mt-8">
        Kachok’dagi har bir tavsiya — xalqaro tashkilotlar pozitsiyasi (ACSM, ISSN, JSST/WHO, EFSA) yoki meta-tahlillarga asoslangan. Har bir manba mualliflari, jurnali va DOI raqami bilan
        tekshirilgan.
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

      <h2 className="title mt-24">3D anatomik model</h2>
      <div className="card tight stack gap-6 mt-12">
        <span className="small">
          Mushaklar va skelet modeli: <b>Z-Anatomy</b> — the libre 3D atlas of anatomy (G. Kervyn, M. Zielinski, L. Vinent), CC BY-SA 4.0. Asos: <b>BodyParts3D</b>, © The Database Center for Life
          Science (DBCLS), K. Okubo; Mitsuhashi va boshq., Nucleic Acids Res 2009.
        </span>
        <span className="tiny faint" style={{ lineHeight: 1.45 }}>
          Moslashtirish: mushaklar guruhlarga birlashtirildi, soddalashtirildi (~390 ming uchburchak), qorin to‘g‘ri mushagi ustidagi aponevroz olib tashlandi, siqildi (meshopt). O‘zgartirilgan model
          fayli ham CC BY-SA 4.0 litsenziyasi ostida.
        </span>
        <a className="tiny" href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer noopener">
          creativecommons.org/licenses/by-sa/4.0
        </a>
      </div>

      <h2 className="title mt-24">Mushak faolligi (EMG)</h2>
      <p className="small muted mt-8">
        Har bir mashqdagi % MVIC qiymatlari — sirt elektromiografiya tadqiqotlaridan; ≈ belgili qiymatlar tadqiqotlardagi oraliq, nisbiy farq yoki o‘xshash mashq asosida baholangan. Manbalar har bir
        mashq sahifasidagi «Mushaklar 3D» bo‘limida.
      </p>
    </div>
  );
}
