// Mushak xaritasi: mushakni bosing — EMG tadqiqotlari bo‘yicha uni eng ko‘p ishlatadigan mashqlar.
import { useState } from 'react';
import { BodyMap } from '../../../src/components/BodyMap';
import type { MuscleId } from '../../../src/types';
import { useSiteData } from '../data';
import { asset } from '../links';
import { BotButton } from '../ui';

export function Muscles() {
  const { muscles } = useSiteData();
  const ids = Object.keys(muscles) as MuscleId[];
  const [sel, setSel] = useState<MuscleId>(ids.includes('chest') ? 'chest' : ids[0]);
  const m = muscles[sel];
  const pick = (id: MuscleId) => muscles[id] && setSel(id);

  return (
    <section id="mushaklar" className="tool" aria-labelledby="mushaklar-t">
      <div className="stack gap-24">
        <div className="tool-head">
          <span className="eyebrow">Mushaklar xaritasi</span>
          <h3 id="mushaklar-t" className="heading-4">
            Qaysi mashq qaysi mushakni ko‘proq ishlatadi?
          </h3>
          <p className="body-3 muted">Mushakni bosing. Ro‘yxat EMG tadqiqotlaridan: mashq paytida mushak o‘z maksimal kuchining necha foizida ishlagani (% MVIC).</p>
        </div>
        <div className="panel">
          <div className="map-box">
            <BodyMap selected={[sel]} onSelect={pick} height={300} />
          </div>
          <div className="chips" role="radiogroup" aria-label="Mushak">
            {ids.map((id) => (
              <button key={id} type="button" role="radio" aria-checked={id === sel} className="chip button-xsm" onClick={() => setSel(id)}>
                {muscles[id]!.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="panel" aria-live="polite">
        {m && (
          <div className="result">
            <div className="stack gap-8">
              <span className="caption-1 muted">{m.view === 'front' ? 'Oldingi tomon' : 'Orqa tomon'}</span>
              <h4 className="heading-5">{m.name}</h4>
              <p className="body-6 muted">{m.short}</p>
            </div>
            <span className="caption-3 faint">ENG KO‘P ISHLATADIGAN MASHQLAR</span>
            <ol className="ex-list">
              {m.top.map((e, i) => (
                <li key={e.id} className="ex">
                  <img src={asset(`thumbs/${e.id}.webp`)} alt="" width={56} height={56} loading="lazy" decoding="async" />
                  <div className="ex-mid">
                    <div className="row gap-8" style={{ justifyContent: 'space-between' }}>
                      <span className="title-4">
                        {i + 1}. {e.name}
                      </span>
                      <span className="body-4 num lime">
                        {e.est ? '~' : ''}
                        {e.mvic}%
                      </span>
                    </div>
                    <div className="bar" aria-hidden="true">
                      <i style={{ background: 'var(--lime)', transform: `scaleX(${Math.min(1, e.mvic / 100)})` }} />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <p className="caption-5 faint">«~» — shu mashq uchun to‘g‘ridan-to‘g‘ri o‘lchov yo‘q, o‘xshash harakat bo‘yicha baholangan.</p>
            <div className="tool-cta">
              <BotButton from="site_mushak" size="md">
                Texnikasini rasmlar bilan ko‘rish
              </BotButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
