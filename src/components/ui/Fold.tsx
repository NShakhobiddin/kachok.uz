// Uzun matnlar yig'iq turadi: sarlavha va qisqa mazmun ko'rinadi, to'liq matn bosilganda ochiladi.
// Ichidagi narsa birinchi ochilganda chiziladi (animatsiyalar yopiq blokda ishlamaydi).
import { useState } from 'react';
import { Icon } from './Icon';

export function Fold({
  title,
  hint,
  icon,
  open,
  className = '',
  children,
}: {
  title: React.ReactNode;
  /** yig'iq holatda sarlavha ostidagi qisqa mazmun */
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  open?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [seen, setSeen] = useState(!!open);
  return (
    <details className={`fold ${className}`} open={open} onToggle={(e) => e.currentTarget.open && setSeen(true)}>
      <summary>
        {icon && <span className="fold-ico">{icon}</span>}
        <span className="fold-head">
          <span className="fold-title">{title}</span>
          {hint && <span className="fold-hint">{hint}</span>}
        </span>
        <Icon name="down" size={18} className="fold-chev" />
      </summary>
      <div className="fold-body">{seen && children}</div>
    </details>
  );
}

/** Kichik izoh: "ⓘ Izoh" bosilganda matn ochiladi */
export function Note({ label = 'Izoh', className = '', children }: { label?: string; className?: string; children: React.ReactNode }) {
  return (
    <details className={`note ${className}`}>
      <summary>
        <Icon name="info" size={14} /> {label}
      </summary>
      <div className="note-body">{children}</div>
    </details>
  );
}
