// GYMbos logotipi (dizayn: GYMbos_logo.html). size — "GYM" shrifti balandligi, px; tugma ~1.17 baravar balandroq.
import '../styles/brand.css';

export function Logo({
  size = 32,
  bos = true,
  tone = 'dark',
  intro = false,
  flat = false,
  className = '',
}: {
  size?: number;
  /** "bos" yozuvi (false — faqat tugma: ikonka va tor joylar uchun) */
  bos?: boolean;
  /** fon: dark (asosiy), light (oq fon), lime (lime fon) */
  tone?: 'dark' | 'light' | 'lime';
  /** kirish animatsiyasi: tugma bosiladi, keyin "bos" chiqadi */
  intro?: boolean;
  /** soyasiz (kichik o'lchamlar va chop etish uchun) */
  flat?: boolean;
  className?: string;
}) {
  const cls = ['gb', tone === 'light' ? 'on-light' : tone === 'lime' ? 'on-lime' : '', intro ? 'intro' : '', flat ? 'flat' : '', className].filter(Boolean).join(' ');
  return (
    <span className={cls} style={{ fontSize: size }} role="img" aria-label="GYMbos">
      <span className="gb-pill" aria-hidden="true">
        <span className="gb-plates">
          <i className="s" />
          <i className="l" />
        </span>
        <span className="gb-gym">GYM</span>
        <span className="gb-plates">
          <i className="l" />
          <i className="s" />
        </span>
      </span>
      {bos && (
        <span className="gb-bos" aria-hidden="true">
          bos
        </span>
      )}
    </span>
  );
}
