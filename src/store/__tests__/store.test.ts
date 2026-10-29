import { beforeEach, describe, expect, it } from 'vitest';
import { EQUIPMENT_PRESETS } from '../../data/catalog';
import { EXERCISE_MAP } from '../../data/exercises';
import { clampKcalAdjust } from '../../engine/nutrition';
import { alternatives, DEFAULT_DAYS } from '../../engine/program';
import type { Profile } from '../../types';
import { repairState } from '../sanitize';
import { exportData, useStore, workoutEdits, workoutEnd } from '../useStore';

const profile: Profile = {
  name: 'T',
  sex: 'male',
  age: 30,
  heightCm: 178,
  weightKg: 80,
  goal: 'muscle',
  level: 'intermediate',
  daysPerWeek: 3,
  sessionMin: 60,
  trainingDays: DEFAULT_DAYS[3],
  equipment: EQUIPMENT_PRESETS[0].items,
  injuries: [],
  focus: [],
  activity: 'light',
  healthFlags: [],
  dietPrefs: { noPork: true, lactoseFree: false, vegetarian: false },
  createdAt: new Date().toISOString(),
};
const S = () => useStore.getState();
const acc = { user: { id: 'u', phone: '998901234567', name: 'T', role: 'athlete' as const }, access: 'a', refresh: 'r' };

beforeEach(() => {
  S().reset();
  S().setProfile(profile);
});

const altFor = (id: string) => alternatives(id, profile).find((e) => e.id !== id)!.id;

describe('faol mashg‘ulot', () => {
  it('almashtirishda bajarilgan setlar o‘chmaydi: eski mashq shu setlar bilan qoladi, yangisi keyin keladi', () => {
    const day = S().program!.days[0];
    S().startWorkout(day, day.exercises);
    const first = day.exercises[0].exerciseId;
    const total = S().active!.log.exercises[0].sets.length;
    S().updateSet(0, 0, { kg: 100, reps: 8, done: true });
    S().updateSet(0, 1, { kg: 100, reps: 7, done: true });
    const alt = altFor(first);
    S().swapActive(0, alt);
    const a = S().active!;
    expect(a.log.exercises[0]).toMatchObject({ exerciseId: first, sets: [{ kg: 100, done: true }, { kg: 100, done: true }] });
    expect(a.log.exercises[1].exerciseId).toBe(alt);
    expect(a.log.exercises[1].sets.length).toBe(Math.max(1, total - 2));
    expect(a.plan.length).toBe(a.log.exercises.length);
    expect(a.plan[1].exerciseId).toBe(alt);
    expect(a.index).toBe(1);
    const log = S().finishWorkout()!;
    expect(log.exercises[0].sets.length).toBe(2);
  });

  it('bajarilgan seti yo‘q mashq joyida almashtiriladi', () => {
    const day = S().program!.days[0];
    S().startWorkout(day, day.exercises);
    const alt = altFor(day.exercises[1].exerciseId);
    S().swapActive(1, alt);
    expect(S().active!.log.exercises.length).toBe(day.exercises.length);
    expect(S().active!.log.exercises[1].exerciseId).toBe(alt);
  });

  it('unutilgan mashg‘ulot: davomiylik oxirgi setdan 10 daqiqa keyin, ko‘pi bilan 4 soat', () => {
    const now = Date.now();
    const log = { startedAt: new Date(now - 20 * 3600e3).toISOString() } as never;
    expect((workoutEnd({ log, lastSetAt: now - 19 * 3600e3 }, now) - (now - 20 * 3600e3)) / 60000).toBe(70);
    expect((workoutEnd({ log }, now) - (now - 20 * 3600e3)) / 3600e3).toBe(4);
    // oddiy holat: oxirgi set yaqinda — hozirgi vaqt
    const fresh = { startedAt: new Date(now - 50 * 60e3).toISOString() } as never;
    expect(workoutEnd({ log: fresh, lastSetAt: now - 3 * 60e3 }, now)).toBe(now);

    const day = S().program!.days[0];
    S().startWorkout(day, day.exercises);
    const a = S().active!;
    useStore.setState({ active: { ...a, log: { ...a.log, startedAt: new Date(now - 20 * 3600e3).toISOString() } } });
    S().updateSet(0, 0, { kg: 50, reps: 8, done: true });
    useStore.setState({ active: { ...S().active!, lastSetAt: now - 19 * 3600e3 } });
    expect(S().finishWorkout()!.durationMin).toBe(70);
  });

  it('yengillashtirish belgisi faqat deload haftasidagi dastur mashg‘ulotiga yoziladi', () => {
    const finish = (dayIdx: number | null) => {
      const day = dayIdx === null ? null : S().program!.days[dayIdx];
      S().startWorkout(day, day ? day.exercises : S().program!.days[0].exercises);
      S().updateSet(0, 0, { kg: 50, reps: 8, done: true });
      return S().finishWorkout()!;
    };
    expect(finish(0).deload).toBeUndefined();
    // blokning oxirgi (yengillashtirish) haftasigacha mashg'ulotlar
    const p = S().program!;
    const t = new Date().toISOString();
    const need = (p.mesoWeeks - 1) * profile.daysPerWeek;
    useStore.setState({
      logs: Array.from({ length: need }, (_, i) => ({ id: 'l' + i, dayId: p.days[i % p.days.length].id, title: 'x', startedAt: t, finishedAt: t, durationMin: 40, exercises: [{ exerciseId: p.days[0].exercises[0].exerciseId, sets: [{ kg: 40, reps: 8, done: true }] }] })),
    });
    expect(finish(null).deload).toBeUndefined(); // erkin mashg'ulot
    expect(finish(1).deload).toBe(true);
  });
});

describe('mashg‘ulotdan dasturga saqlash', () => {
  it('o‘zgarish bo‘lmasa taklif qilinmaydi; mashg‘ulot paytida dasturda o‘chirilgan mashq qaytib kelmaydi', () => {
    const day = S().program!.days[0];
    S().startWorkout(day, day.exercises);
    S().removePlanned(day.id, day.exercises.length - 1);
    expect(workoutEdits(S().active!, S().program)).toBeNull();
  });

  it('faqat almashtirish va qo‘shimcha yoziladi, boshqa tahrirlar saqlanadi', () => {
    const day = S().program!.days[0];
    const ids = day.exercises.map((p) => p.exerciseId);
    S().startWorkout(day, day.exercises);
    const alt = altFor(ids[0]);
    S().swapActive(0, alt);
    const extra = Object.keys(EXERCISE_MAP).find((id) => !ids.includes(id) && id !== alt)!;
    S().addActiveExercise(extra);
    S().removePlanned(day.id, ids.length - 1); // dasturda alohida tahrir
    const edits = workoutEdits(S().active!, S().program)!;
    expect(edits.swaps).toEqual([{ from: ids[0], to: alt }]);
    expect(edits.added.map((p) => p.exerciseId)).toEqual([extra]);
    S().applyWorkoutToDay(day.id, edits);
    const after = S().program!.days.find((d) => d.id === day.id)!.exercises.map((p) => p.exerciseId);
    expect(after).toEqual([alt, ...ids.slice(1, -1), extra]);
  });

  it('dastur qayta tuzilsa (d1..dN id lar qaytadan) eski reja yangi dasturga yozilmaydi', async () => {
    const day = S().program!.days[0];
    S().startWorkout(day, day.exercises);
    S().swapActive(0, altFor(day.exercises[0].exerciseId));
    await new Promise((r) => setTimeout(r, 5)); // dastur id si vaqtga bog'liq
    S().regenerate();
    expect(S().program!.days[0].id).toBe(day.id);
    expect(workoutEdits(S().active!, S().program)).toBeNull();
  });
});

describe('zaxira: eksport / import', () => {
  it('buzuq tuzilma (logs — obyekt) rad etiladi, holat o‘zgarmaydi', () => {
    const before = S().program;
    expect(S().importData(JSON.stringify({ profile, logs: {}, food: 'x' }))).toBe(false);
    expect(S().importData('not json')).toBe(false);
    expect(S().importData(JSON.stringify({ app: 'kachok' }))).toBe(false);
    expect(S().program).toBe(before);
    expect(Array.isArray(S().logs)).toBe(true);
  });

  it('noma’lum kalitlar (amallar) yozilmaydi, buzuq yozuvlar tashlanadi', () => {
    const t = new Date().toISOString();
    const ok = S().importData(
      JSON.stringify({
        profile,
        addFood: 1,
        account: { evil: true },
        logs: [{ id: 'a', title: 'x', startedAt: t, finishedAt: t, durationMin: 5, exercises: [] }, { nope: 1 }, 5],
        food: [{ id: 'f', date: '2026-10-29', meal: 1, name: 'Osh', kcal: 600, p: 1, f: 1, c: 1 }, { id: 'g' }],
      }),
    );
    expect(ok).toBe(true);
    expect(typeof S().addFood).toBe('function');
    expect(S().account).toBeNull();
    expect(S().logs.map((l) => l.id)).toEqual(['a']);
    expect(S().food.map((f) => f.id)).toEqual(['f']);
  });

  it('setDeltaMeso eksport/import qilinadi va reset da tozalanadi', () => {
    useStore.setState({ setDelta: { chest: 2 }, setDeltaMeso: 1 });
    const json = exportData();
    expect(JSON.parse(json).setDeltaMeso).toBe(1);
    S().reset();
    expect(S().setDeltaMeso).toBeUndefined();
    expect(S().importData(json)).toBe(true);
    expect(S().setDelta).toEqual({ chest: 2 });
    expect(S().setDeltaMeso).toBe(1);
  });

  it('import akkauntdan chiqarmaydi va tiklangan hujjatlarni tahrirlangan deb belgilaydi', () => {
    S().setAccount(acc);
    S().setSync({ cursor: 42, hashes: { 'profile:me': 'x' }, stamps: { 'profile:me': 1 } });
    S().importData(exportData());
    expect(S().account?.user.id).toBe('u');
    expect(S().sync.uid).toBe('u');
    expect(S().sync.forceLocal).toBe(true);
    expect(S().sync.edited?.['profile:me']).toBeGreaterThan(0);
  });

  it('buzilgan saqlangan holat tiklanadi (ErrorBoundary)', () => {
    const st = JSON.parse(JSON.stringify(S()));
    st.logs = { a: 1 };
    st.food = [{ id: 'f', date: '2026-10-29', meal: 0, name: 'Non', kcal: 200, p: 1, f: 1, c: 1 }, 'junk'];
    st.active = { log: { id: 'x' }, plan: 3, index: 0 };
    st.account = acc;
    const fixed = repairState(st);
    expect(fixed.logs).toEqual([]);
    expect((fixed.food as { id: string }[]).map((f) => f.id)).toEqual(['f']);
    expect(fixed.active).toBeNull();
    expect(fixed.account).toEqual(acc);
    expect((fixed.profile as Profile).name).toBe('T');
  });
});

describe('kaloriya tuzatishi', () => {
  it('chegaralanadi va o‘zgartirilgan sana yoziladi; importda ham chegaralanadi', () => {
    S().setKcalAdjust(-5000);
    expect(S().kcalAdjust).toBe(clampKcalAdjust(-5000));
    expect(S().kcalAdjustAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const json = JSON.parse(exportData());
    expect(json.kcalAdjustAt).toBe(S().kcalAdjustAt);
    expect(S().importData(JSON.stringify({ ...json, kcalAdjust: 9999 }))).toBe(true);
    expect(S().kcalAdjust).toBe(clampKcalAdjust(9999));
  });
});

describe('akkaunt', () => {
  it('chiqishda sinxron holati saqlanadi, boshqa akkauntda — boshidan', () => {
    S().setAccount(acc);
    S().setSync({ cursor: 7, hashes: { 'profile:me': 'h' } });
    S().setAccount(null);
    expect(S().sync.cursor).toBe(7);
    expect(S().sync.uid).toBe('u');
    S().setAccount(acc);
    expect(S().sync.cursor).toBe(7);
    S().setAccount(null);
    S().setAccount({ ...acc, user: { ...acc.user, id: 'other' } });
    expect(S().sync.cursor).toBe(0);
    expect(S().sync.hashes).toEqual({});
  });
});

describe('dastur', () => {
  it('band hafta kuniga ko‘chirilsa — kunlar o‘rin almashadi', () => {
    const [d1, d2] = S().program!.days;
    S().moveDay(d2.id, d1.weekday);
    const days = S().program!.days;
    expect(days.find((d) => d.id === d2.id)!.weekday).toBe(d1.weekday);
    expect(days.find((d) => d.id === d1.id)!.weekday).toBe(d2.weekday);
    expect(new Set(days.map((d) => d.weekday)).size).toBe(days.length);
  });
});
