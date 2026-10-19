// Dam olish taymeri: disk shaklidagi halqa, qolgan vaqt ko‘k yoy bilan kamayadi.
export function PlateRing({ remaining, total, size = 220 }: { remaining: number; total: number; size?: number }) {
  const r = 92;
  const c = 2 * Math.PI * r;
  const frac = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
  const m = Math.floor(Math.max(0, remaining) / 60);
  const s = Math.max(0, Math.ceil(remaining)) % 60;
  const label = remaining <= 0 ? 'Tayyor' : `${m}:${String(s).padStart(2, '0')}`;
  return (
    <svg viewBox="0 0 220 220" width={size} height={size} role="timer" aria-label={`Dam olish: ${label}`}>
      <circle cx={110} cy={110} r={106} fill="var(--surface)" />
      <circle cx={110} cy={110} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={12} />
      <circle
        cx={110}
        cy={110}
        r={r}
        fill="none"
        stroke={remaining <= 5 ? 'var(--green)' : 'var(--blue)'}
        strokeWidth={12}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - frac)}
        transform="rotate(-90 110 110)"
        style={{ transition: 'stroke-dashoffset 0.25s linear, stroke 0.3s' }}
      />
      <circle cx={110} cy={110} r={70} fill="none" stroke="var(--line)" strokeWidth={1} />
      <text x={110} y={116} textAnchor="middle" fontFamily="var(--font-display)" fontWeight={800} fontSize={remaining <= 0 ? 40 : 58} fill="var(--text)">
        {label}
      </text>
      <text x={110} y={146} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={11} letterSpacing="0.1em" fill="var(--text-3)">
        {remaining <= 0 ? 'KEYINGI SET' : 'DAM OLISH'}
      </text>
    </svg>
  );
}
