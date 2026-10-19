import { Icon } from './Icon';

export function Stepper({ value, onChange, step = 1, min = 0, max = 999, unit, label }: { value: number; onChange: (v: number) => void; step?: number; min?: number; max?: number; unit?: string; label?: string }) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v * 100) / 100));
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(clamp(value - step))} aria-label="Kamaytirish">
        <Icon name="minus" />
      </button>
      <input
        inputMode="decimal"
        value={Number.isFinite(value) ? value : ''}
        aria-label={label}
        onChange={(e) => {
          const v = parseFloat(e.target.value.replace(',', '.'));
          onChange(Number.isFinite(v) ? clamp(v) : min);
        }}
      />
      {unit && <span className="unit">{unit}</span>}
      <button type="button" onClick={() => onChange(clamp(value + step))} aria-label="Oshirish">
        <Icon name="plus" />
      </button>
    </div>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button type="button" className={`toggle ${on ? 'on' : ''}`} role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} />;
}

export function Segmented<T extends string | number>({ options, value, onChange, label }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; label?: string }) {
  return (
    <div className="segmented" role="tablist" aria-label={label}>
      {options.map((o) => (
        <button key={String(o.value)} type="button" role="tab" aria-selected={o.value === value} className={o.value === value ? 'on' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Choice({ on, onClick, title, desc, icon, multi }: { on: boolean; onClick: () => void; title: string; desc?: string; icon?: React.ReactNode; multi?: boolean }) {
  return (
    <button type="button" className={`choice ${on ? 'on' : ''}`} onClick={onClick} aria-pressed={on}>
      {icon}
      <div className="grow">
        <div className="ch-title">{title}</div>
        {desc && <div className="ch-desc">{desc}</div>}
      </div>
      <span className="check-mark" style={multi ? undefined : { borderRadius: 999 }}>
        <Icon name="check" size={14} stroke={3} />
      </span>
    </button>
  );
}
