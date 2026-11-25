// Haftalik hisobot: reja bajarilishi, rekordlar, kuch o'sishi, mushaklar hajmi, vazn va ovqat, keyingi hafta uchun tavsiyalar.
import { EXERCISE_MAP } from '../data/exercises';
import { GROUPS, GROUP_ORDER, VOLUME_LANDMARKS } from '../data/catalog';
import { addDays, isoDate, MONTHS, startOfWeek } from '../lib/date';
import type { BodyEntry, FoodEntry, Goal, MuscleGroup, Profile, WorkoutLog } from '../types';
import { e1rm } from './progression';
import { detectPRs, finished, logSets, logVolume, weekStreak, weekSummary, type PR } from './stats';

export interface LiftTrend {
  exerciseId: string;
  name: string;
  /** taxminiy 1RM: oldingi 6 hafta eng yaxshisi va shu hafta */
  before: number;
  now: number;
  /** shu haftaning eng kuchli seti */
  kg: number;
  reps: number;
}

export interface ReportTip {
  tone: 'good' | 'warn' | 'info';
  text: string;
}

export interface WeekReport {
  start: Date;
  label: string;
  workouts: number;
  planned: number;
  minutes: number;
  sets: number;
  volume: number;
  /** o'tgan haftaga nisbatan */
  prev: { workouts: number; volume: number; sets: number };
  prs: PR[];
  lifts: LiftTrend[];
  groups: { g: MuscleGroup; name: string; sets: number; mev: number; mav: [number, number] }[];
  streak: number;
  weight: { from: number; to: number } | null;
  food: { days: number; kcal: number; protein: number } | null;
  pain: string[];
  tips: ReportTip[];
}

/** hisobot uchun standart hafta: dushanba–chorshanba — o'tgan hafta (yakunlangan), qolgan kunlarda — joriy */
export function defaultReportWeek(now = new Date()): Date {
  const cur = startOfWeek(now);
  return (now.getDay() + 6) % 7 <= 2 ? addDays(cur, -7) : cur;
}

/** "17–23 noyabr" yoki "28 noyabr – 4 dekabr" */
export function weekLabel(start: Date): string {
  const end = addDays(start, 6);
  return start.getMonth() === end.getMonth()
    ? `${start.getDate()}–${end.getDate()} ${MONTHS[end.getMonth()]}`
    : `${start.getDate()} ${MONTHS[start.getMonth()]} – ${end.getDate()} ${MONTHS[end.getMonth()]}`;
}

const bestE = (sets: { kg: number; reps: number }[]) => Math.max(0, ...sets.map((s) => e1rm(s.kg, s.reps)));

export function weekReport(
  input: { logs: WorkoutLog[]; profile: Profile; body: BodyEntry[]; food: FoodEntry[]; target?: { kcal: number; protein: number } },
  start: Date,
): WeekReport {
  const { logs, profile, body, food, target } = input;
  const end = addDays(start, 7);
  const all = finished(logs).sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  const inWeek = all.filter((l) => new Date(l.startedAt) >= start && new Date(l.startedAt) < end);
  const cur = weekSummary(logs, start);
  const prevW = weekSummary(logs, addDays(start, -7));

  // rekordlar: har mashg'ulot o'zidan oldingilarga nisbatan
  const prs = inWeek.flatMap((l) => detectPRs(l, all.filter((x) => x.startedAt < l.startedAt)));

  // kuch o'sishi: shu haftadagi eng kuchli set va oldingi 6 haftadagi eng yaxshisi (taxminiy 1RM bo'yicha)
  const from6 = addDays(start, -42);
  const before = all.filter((l) => new Date(l.startedAt) >= from6 && new Date(l.startedAt) < start);
  const setsOf = (ls: WorkoutLog[], id: string) => ls.flatMap((l) => l.exercises.filter((e) => e.exerciseId === id).flatMap((e) => e.sets.filter((s) => s.done && !s.warmup && s.kg > 0 && s.reps > 0)));
  const ids = [...new Set(inWeek.flatMap((l) => l.exercises.map((e) => e.exerciseId)))];
  const lifts: LiftTrend[] = ids
    .flatMap((id) => {
      const ex = EXERCISE_MAP[id];
      if (!ex || ex.loadType === 'bodyweight' || ex.loadType === 'band' || ex.assisted) return [];
      const now = setsOf(inWeek, id);
      const was = setsOf(before, id);
      if (!now.length || !was.length) return [];
      const top = now.reduce((a, b) => (e1rm(b.kg, b.reps) > e1rm(a.kg, a.reps) ? b : a));
      return [{ exerciseId: id, name: ex.name, before: bestE(was), now: bestE(now), kg: top.kg, reps: top.reps }];
    })
    .filter((t) => t.now > t.before * 1.005)
    .sort((a, b) => b.now / b.before - a.now / a.before)
    .slice(0, 4);

  const groups = GROUP_ORDER.map((g) => ({ g, name: GROUPS[g].name, sets: Math.round(cur.groups[g] * 2) / 2, mev: VOLUME_LANDMARKS[g].mev, mav: VOLUME_LANDMARKS[g].mav }));

  // vazn: hafta boshigacha oxirgi o'lchov va hafta ichidagi oxirgisi
  const w = body.filter((b) => b.weightKg).sort((a, b) => a.date.localeCompare(b.date));
  const s0 = isoDate(start);
  const e0 = isoDate(end);
  const wFrom = [...w].reverse().find((b) => b.date < s0);
  const wTo = [...w].reverse().find((b) => b.date >= s0 && b.date < e0);
  const weight = wFrom && wTo ? { from: wFrom.weightKg!, to: wTo.weightKg! } : null;

  // ovqat: yozilgan kunlar bo'yicha o'rtacha
  const fw = food.filter((f) => f.date >= s0 && f.date < e0);
  const fDays = new Set(fw.map((f) => f.date));
  const foodSum = fDays.size ? { days: fDays.size, kcal: Math.round(fw.reduce((a, f) => a + f.kcal, 0) / fDays.size), protein: Math.round(fw.reduce((a, f) => a + f.p, 0) / fDays.size) } : null;

  const pain = [...new Set(inWeek.flatMap((l) => l.painEx ?? []))];
  const streak = weekStreak(logs, profile.daysPerWeek, addDays(start, 6));
  const planned = profile.daysPerWeek;

  const report: WeekReport = {
    start,
    label: weekLabel(start),
    workouts: inWeek.length,
    planned,
    minutes: cur.minutes,
    sets: inWeek.reduce((a, l) => a + logSets(l), 0),
    volume: inWeek.reduce((a, l) => a + logVolume(l), 0),
    prev: { workouts: prevW.workouts, volume: prevW.volume, sets: prevW.sets },
    prs,
    lifts,
    groups,
    streak,
    weight,
    food: foodSum,
    pain,
    tips: [],
  };
  report.tips = reportTips(report, profile.goal, target);
  return report;
}

/** Keyingi hafta uchun 2–4 ta aniq tavsiya (muhimi birinchi) */
export function reportTips(r: WeekReport, goal: Goal, target?: { kcal: number; protein: number }): ReportTip[] {
  const out: ReportTip[] = [];
  if (r.pain.length)
    out.push({
      tone: 'warn',
      text: `${r.pain.map((id) => EXERCISE_MAP[id]?.name ?? id).join(', ')} — og‘riq belgilangan. Keyingi safar vaznni kamaytiring yoki «⋯» → «Boshqa mashqqa almashtirish». Og‘riq takrorlansa — shifokorga.`,
    });
  if (r.workouts === 0) out.push({ tone: 'info', text: 'Bu hafta mashg‘ulot bo‘lmadi. Yangi haftani bitta qisqa mashg‘ulot bilan boshlang — «Bugun» sahifasida «−» bilan mashqlarni kamaytirsa bo‘ladi.' });
  else if (r.workouts < r.planned)
    out.push({
      tone: 'info',
      text: `Rejada ${r.planned} ta, bajarildi ${r.workouts} ta. Vaqt yetmasa — mashqlar sonini «−» bilan kamaytiring yoki haftalik rejada kunlarni ${Math.max(2, r.workouts)} taga tushiring: kam, lekin muntazam — ko‘p, lekin uzilishli rejadan yaxshi.`,
    });
  else out.push({ tone: 'good', text: `Reja to‘liq bajarildi${r.streak > 1 ? ` — ${r.streak} hafta ketma-ket` : ''}. Keyingi haftada ham shu sur’at.` });
  if (r.prs.length) out.push({ tone: 'good', text: `${r.prs.length} ta yangi rekord — progressiya ishlayapti. Vaznni ham shunday asta-sekin oshirishda davom eting.` });
  // ishlagan, lekin hajmi kam mushaklar (faqat hafta yetarli bajarilgan bo'lsa — aks holda sabab qatnashmaslik)
  if (r.workouts >= Math.max(1, r.planned - 1)) {
    const low = r.groups.filter((g) => g.sets < g.mev && !['calves', 'core'].includes(g.g)).sort((a, b) => a.sets / a.mev - b.sets / b.mev);
    if (low.length)
      out.push({
        tone: 'info',
        text: `${low
          .slice(0, 2)
          .map((g) => `${g.name} — ${g.sets} set`)
          .join(', ')} (o‘sish uchun haftasiga kamida ~${low[0].mev}). «Bugun» sahifasida shu mushak kuniga «+» bilan bitta mashq qo‘shing.`,
      });
  }
  if (r.food && target && r.food.protein < target.protein * 0.8)
    out.push({ tone: 'info', text: `Oqsil o‘rtacha ${r.food.protein} g (maqsad ${target.protein} g). Har mahalga tuxum, tvorog, go‘sht yoki dukkakli qo‘shing.` });
  if (r.weight) {
    const d = Math.round((r.weight.to - r.weight.from) * 10) / 10;
    if (goal === 'fatLoss' && d > 0.3) out.push({ tone: 'warn', text: `Vazn +${d} kg. Ozish maqsadida haftasiga 0.3–0.7 kg kamayish ma’qul — kunlik kaloriyani biroz kamaytiring.` });
    else if (goal === 'muscle' && d < -0.3) out.push({ tone: 'info', text: `Vazn ${d} kg. Mushak o‘sishi uchun ozgina ortiqcha kaloriya kerak — kuniga 150–250 kkal qo‘shing.` });
  }
  return out.slice(0, 4);
}
