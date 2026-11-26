// Asosiy bo'limlarda ham "Orqaga": ilova ichidagi oldingi sahifaga (to'g'ridan-to'g'ri ochilgan bo'lsa — Bugun sahifasiga).
import { useBack } from '../lib/useBack';
import { Icon } from './ui/Icon';

export function PageBack({ label = 'Orqaga', fallback = '/' }: { label?: string; fallback?: string }) {
  const back = useBack(fallback);
  return (
    <div className="back-bar">
      <button className="icon-btn" onClick={back} aria-label="Orqaga">
        <Icon name="left" />
      </button>
      <span className="eyebrow">{label}</span>
    </div>
  );
}
