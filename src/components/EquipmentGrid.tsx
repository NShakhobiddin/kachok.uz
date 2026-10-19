import { EQUIPMENT } from '../data/catalog';
import type { EquipmentId } from '../types';
import { Icon } from './ui/Icon';

export function EquipmentGrid({ value, onChange }: { value: EquipmentId[]; onChange: (v: EquipmentId[]) => void }) {
  return (
    <div className="grid-2">
      {EQUIPMENT.map((e) => {
        const on = value.includes(e.id);
        return (
          <button
            key={e.id}
            type="button"
            className={`choice ${on ? 'on' : ''}`}
            style={{ padding: '10px 12px', alignItems: 'flex-start', gap: 10 }}
            aria-pressed={on}
            onClick={() => onChange(on ? value.filter((x) => x !== e.id) : [...value, e.id])}
          >
            <span className={`check-mark ${on ? 'on' : ''}`} style={{ width: 20, height: 20, marginTop: 1 }}>
              <Icon name="check" size={12} stroke={3} />
            </span>
            <span className="stack" style={{ minWidth: 0 }}>
              <span className="strong small">{e.name}</span>
              <span className="tiny faint" style={{ lineHeight: 1.3 }}>
                {e.hint}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
