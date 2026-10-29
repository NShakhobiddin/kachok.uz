import { useMemo } from 'react';
import { adaptiveTdee, formulaTdee, nutritionPlan } from '../engine/nutrition';
import { useStore } from '../store/useStore';
import { isoDate } from './date';

/** Kunlik ovqatlanish rejasi: moslashuvchan sarf yoqilgan va ma'lumot yetarli bo'lsa — kundalik + vazn asosida */
export function useNutrition() {
  const profile = useStore((s) => s.profile)!;
  const kcalAdjust = useStore((s) => s.kcalAdjust);
  const food = useStore((s) => s.food);
  const body = useStore((s) => s.body);
  const adaptiveOn = useStore((s) => !!s.settings.adaptiveTdee);
  const est = useMemo(() => adaptiveTdee(food, body, formulaTdee(profile), isoDate()), [food, body, profile]);
  const useAdaptive = adaptiveOn && est.updates > 0;
  // moslashuvchan sarf yoqilganda qo'lda tuzatish qo'shilmaydi (aks holda tuzatish ikki marta hisoblanadi)
  const np = useMemo(() => nutritionPlan(profile, useAdaptive ? 0 : kcalAdjust, useAdaptive ? est.tdee : undefined), [profile, kcalAdjust, useAdaptive, est.tdee]);
  const today = isoDate();
  const eatenToday = useMemo(() => food.filter((e) => e.date === today).reduce((a, e) => a + e.kcal, 0), [food, today]);
  return { np, est, adaptiveOn, useAdaptive, eatenToday };
}
