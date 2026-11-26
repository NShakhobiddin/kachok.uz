import { AnimatePresence, motion, useDragControls, useIsPresent } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

/**
 * Ochiq oynalar ro'yxati: Telegram'ning "Orqaga" tugmasi (Android'da apparat tugmasi ham) avval eng ustidagi oynani yopadi —
 * aks holda Mini App yopilib yoki boshqa sahifaga o'tib ketardi (lib/telegram.ts useTelegramBridge).
 */
const stack: { close: () => void }[] = [];
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
export const sheetStack = {
  size: () => stack.length,
  closeTop: () => stack[stack.length - 1]?.close(),
  subscribe: (f: () => void) => {
    subs.add(f);
    return () => void subs.delete(f);
  },
};

/** Yopilish animatsiyasi davomida oyna bosilmaydi — ikki marta bosilganda ovqat/mashq ikki marta qo'shilmasin */
function PresenceGuard({ children }: { children: React.ReactNode }) {
  const present = useIsPresent();
  return <div style={{ display: 'contents', pointerEvents: present ? undefined : 'none' }}>{children}</div>;
}

export function Sheet({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: React.ReactNode; label?: string }) {
  // pastga tortib yopish faqat tutqichdan: butun oynada drag bo'lsa framer `touch-action: pan-x` qo'yadi
  // va oynaning o'zini barmoq bilan aylantirib bo'lmay qoladi (pastdagi "Saqlash" tugmalariga yetib bo'lmaydi)
  const drag = useDragControls();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const entry = { close: () => closeRef.current() };
    stack.push(entry);
    emit();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && stack[stack.length - 1] === entry && entry.close();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // ekran o'quvchi va klaviatura uchun: fokus oynaga, yopilganda — avvalgi joyiga
    const before = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => {
      // oyna ichidagi maydon o'zi fokus olgan bo'lsa (autoFocus) — tegmaymiz
      if (panel.current && !panel.current.contains(document.activeElement)) panel.current.focus({ preventScroll: true });
    }, 50);
    // brauzer/telefon "orqaga"si avval oynani yopsin: ochilganda tarixga belgi qo'yiladi (manzil o'zgarmaydi)
    const token = Math.random().toString(36).slice(2);
    let popped = false;
    try {
      window.history.pushState({ ...window.history.state, sheet: token }, '');
    } catch {
      /* tarix mavjud emas */
    }
    const onPop = () => {
      if (window.history.state?.sheet !== token) {
        popped = true;
        closeRef.current();
      }
    };
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('popstate', onPop);
      // tugma, fon yoki tortish bilan yopilgan — tarixdagi belgini olib tashlaymiz (boshqa sahifaga o'tilgan bo'lsa — tegmaymiz)
      if (!popped && window.history.state?.sheet === token) window.history.back();
      clearTimeout(t);
      const i = stack.indexOf(entry);
      if (i >= 0) stack.splice(i, 1);
      emit();
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      before?.focus?.({ preventScroll: true });
    };
  }, [open]);
  // body ga portal: sahifa animatsiyasi (opacity) yaratadigan qatlam kontekstida pastki menyu ostida qolmasin
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="sheet-backdrop" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            ref={panel}
            tabIndex={-1}
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-label={label}
            initial={{ y: '100%', x: '-50%' }}
            animate={{ y: 0, x: '-50%' }}
            exit={{ y: '100%', x: '-50%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 340 }}
            drag="y"
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
          >
            <PresenceGuard>
              <div className="sheet-grip" aria-hidden="true" onPointerDown={(e) => drag.start(e)} />
              {/* joy egallamaydi: nol balandlikdagi «yopishqoq» qatlam ichida — oyna aylantirilganda ham tepada */}
              <div className="sheet-close-wrap">
                <button type="button" className="sheet-close" onClick={onClose} aria-label="Yopish">
                  <Icon name="x" size={18} />
                </button>
              </div>
              {children}
            </PresenceGuard>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
