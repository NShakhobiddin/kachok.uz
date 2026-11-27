// Sahifa ramkasi: tepadagi suzuvchi menyu, telefondagi to‘liq menyu va pastki qism.
import { useEffect, useState } from 'react';
import { Logo } from '../../src/components/Logo';
import { useSiteData } from './data';
import { APP_URL, BOT_CHAT, HOME_URL, PRIVACY_URL, botUrl } from './links';
import { BotButton } from './ui';

// sahifadagi tartibda
const LINKS = [
  { id: 'imkoniyatlar', t: 'Imkoniyatlar' },
  { id: 'dastur', t: 'Dastur' },
  { id: 'anatomiya', t: '3D anatomiya' },
  { id: 'vositalar', t: 'Kalkulyatorlar' },
  { id: 'mif', t: 'Mif yoki haqiqat' },
  { id: 'savollar', t: 'Savollar' },
];

export function Nav({ home = true }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const href = (id: string) => (home ? `#${id}` : `${HOME_URL}#${id}`);

  // qaysi bo‘lim ko‘rinib turibdi — menyuda belgilanadi
  useEffect(() => {
    if (!home || typeof IntersectionObserver === 'undefined') return;
    const els = LINKS.map((l) => document.getElementById(l.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [home]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <a className="skip button-sm" href="#main">
        Asosiy qismga o‘tish
      </a>
      <header className="nav-wrap">
        <nav className="nav" aria-label="Asosiy menyu">
          <a className="nav-logo" href={home ? '#top' : HOME_URL} aria-label="GYMbos — bosh sahifa">
            <Logo size={20} flat />
          </a>
          <ul className="nav-links">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a className="title-4" href={href(l.id)} aria-current={active === l.id ? 'true' : undefined}>
                  {l.t}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn-primary button-sm" href={botUrl('site_nav')} target="_blank" rel="noopener">
            Botni ochish
          </a>
          <button type="button" className="nav-toggle" aria-expanded={open} aria-controls="menu" aria-label={open ? 'Menyuni yopish' : 'Menyuni ochish'} onClick={() => setOpen(!open)}>
            <span />
            <span />
          </button>
        </nav>
      </header>
      <div id="menu" className={`menu${open ? ' open' : ''}`} aria-hidden={!open} inert={!open}>
        <ul>
          {LINKS.map((l, i) => (
            <li key={l.id} style={{ transitionDelay: open ? `${Math.min(i * 60, 340)}ms` : '0ms' }}>
              <a className="menu-link heading-4" href={href(l.id)} onClick={() => setOpen(false)}>
                {l.t}
              </a>
            </li>
          ))}
          <li style={{ transitionDelay: open ? `${Math.min(LINKS.length * 60, 340)}ms` : '0ms' }}>
            <a className="menu-link heading-4 muted" href={APP_URL}>
              Brauzerda ochish
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export function Footer() {
  const { stats } = useSiteData();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="stack gap-12">
          <Logo size={24} flat />
          <span className="caption-2 faint">Gapirma — bos. © {stats.year} GYMbos</span>
        </div>
        <nav aria-label="Pastki menyu">
          <ul className="footer-links body-5">
            <li>
              <a href={BOT_CHAT} target="_blank" rel="noopener">
                Telegram bot
              </a>
            </li>
            <li>
              <a href={APP_URL}>Brauzerda ochish</a>
            </li>
            <li>
              <a href={PRIVACY_URL}>Maxfiylik va shartlar</a>
            </li>
            <li>
              <a href={`${HOME_URL}#manbalar`}>Ilmiy manbalar</a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

/**
 * Telefonda pastki yopishqoq tugma: bosh ekran o‘tgach chiqadi; yakuniy chaqiriq yoki pastki qism ko‘ringanda
 * va raqam kiritilayotganda (klaviatura ochiq) yashirinadi — kalkulyator maydonlarini yopmaydi.
 */
export function MobileCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const hero = document.getElementById('top');
    const blockers = [document.querySelector('.final'), document.querySelector('.footer')].filter((e): e is Element => !!e);
    let heroIn = true;
    const seen = new Set<Element>();
    let typing = false;
    const update = () => setShow(!heroIn && seen.size === 0 && !typing);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) heroIn = e.isIntersecting;
        else if (e.isIntersecting) seen.add(e.target);
        else seen.delete(e.target);
      }
      update();
    });
    if (hero) io.observe(hero);
    blockers.forEach((b) => io.observe(b));
    const isField = (t: EventTarget | null) => t instanceof Element && t.matches('input, select, textarea');
    const onIn = (e: FocusEvent) => {
      typing = isField(e.target);
      update();
    };
    // bir maydondan ikkinchisiga o‘tganda tugma "miltillamasin": fokus qayerga tushganini bir lahzadan keyin tekshiramiz
    const onOut = () =>
      window.setTimeout(() => {
        typing = isField(document.activeElement);
        update();
      }, 50);
    document.addEventListener('focusin', onIn);
    document.addEventListener('focusout', onOut);
    return () => {
      io.disconnect();
      document.removeEventListener('focusin', onIn);
      document.removeEventListener('focusout', onOut);
    };
  }, []);
  return (
    <div className={`mcta${show ? ' on' : ''}`} aria-hidden={!show} inert={!show}>
      <BotButton from="site_sticky" size="md">
        Telegram’da bepul boshlash
      </BotButton>
    </div>
  );
}
