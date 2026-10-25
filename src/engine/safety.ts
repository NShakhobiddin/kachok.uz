// Shaxsiy xavfsizlik: foydalanuvchi cheklovlari bo'yicha mashq bahosi, setdan oldingi tekshiruv, vazn sakrashi.
import { safetyFor, type JointRisk } from '../data/safety';
import type { Exercise, Injury } from '../types';

export interface PersonalSafety {
  /** shu cheklovlar bilan tavsiya etilmaydi */
  avoid: Injury[];
  /** ehtiyotkorlik bilan */
  caution: Injury[];
  /** foydalanuvchi cheklovlariga to'g'ri keladigan bo'g'imlar — moslashtirish matni bilan */
  joints: JointRisk[];
  level: 'avoid' | 'caution' | null;
}

export function personalSafety(ex: Exercise, injuries: Injury[]): PersonalSafety {
  const avoid = (ex.avoid ?? []).filter((i) => injuries.includes(i));
  const joints = (safetyFor(ex.id)?.joints ?? []).filter((j) => injuries.includes(j.at));
  const caution = [...new Set([...(ex.caution ?? []), ...joints.map((j) => j.at)])].filter((i) => injuries.includes(i) && !avoid.includes(i));
  return {
    avoid,
    caution,
    joints,
    level: avoid.length ? 'avoid' : caution.length ? 'caution' : null,
  };
}

/** mashg'ulotda birinchi ishchi setdan oldin xavfsizlik ro'yxati ko'rsatiladimi */
export function needsPreSetCheck(ex: Exercise, injuries: Injury[]): boolean {
  const s = safetyFor(ex.id);
  return !!s && (s.risk === 3 || personalSafety(ex, injuries).level !== null);
}

/** reja/tavsiyadan sezilarli og'irroq vazn — foizda (aks holda null) */
export function loadJump(kg: number, suggested: number | null | undefined, increment: number): number | null {
  if (!suggested || suggested <= 0 || kg <= 0) return null;
  if (kg - suggested <= increment || kg <= suggested * 1.1) return null;
  return Math.round((kg / suggested - 1) * 100);
}

/** og'riqda vaznni kamaytirish (standart 20%), jihoz qadamiga yaxlitlab */
export function reducedLoad(kg: number, increment: number, factor = 0.8): number {
  const step = increment > 0 ? increment : 1;
  return Math.max(0, Math.round((kg * factor) / step) * step);
}
