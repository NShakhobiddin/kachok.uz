// Jihozlarni tanlash: har bir trenajyor rasmi bilan, bir bosishda belgilanadi.
import { EQUIPMENT } from '../data/catalog';
import { equipmentImg } from '../data/equipmentImages';
import type { EquipmentId } from '../types';
import { Icon } from './ui/Icon';

export function EquipmentGrid({ value, onChange }: { value: EquipmentId[]; onChange: (v: EquipmentId[]) => void }) {
  return (
    <div className="eq-grid">
      {EQUIPMENT.map((e) => {
        const on = value.includes(e.id);
        const src = equipmentImg(e.id);
        return (
          <button
            key={e.id}
            type="button"
            className={`eq-card ${on ? 'on' : ''}`}
            aria-pressed={on}
            aria-label={`${e.name}: ${e.hint}`}
            title={e.hint}
            onClick={() => onChange(on ? value.filter((x) => x !== e.id) : [...value, e.id])}
          >
            <span className="eq-img">{src ? <img src={src} alt="" loading="lazy" decoding="async" /> : <Icon name="dumbbell" size={26} />}</span>
            <span className="eq-name">{e.name}</span>
            <span className="eq-check" aria-hidden="true">
              <Icon name="check" size={12} stroke={3.2} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
