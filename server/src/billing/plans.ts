// Tariflar. Narxlar — taxminiy boshlang'ich qiymatlar, biznes qaroriga ko'ra o'zgartiring.
export interface Plan {
  id: string;
  kind: 'pro' | 'coach';
  name: string;
  days: number;
  priceSom: number;
}

export const PLANS: Plan[] = [
  { id: 'pro_month', kind: 'pro', name: 'Pro · 1 oy', days: 30, priceSom: 29_000 },
  { id: 'pro_year', kind: 'pro', name: 'Pro · 1 yil', days: 365, priceSom: 249_000 },
  { id: 'coach_month', kind: 'coach', name: 'Murabbiy · 1 oy', days: 30, priceSom: 99_000 },
];

export const planById = (id: string) => PLANS.find((p) => p.id === id);

/** Bepul murabbiy nechta mijoz bilan ishlay oladi; Murabbiy tarifida — ko'proq */
export const COACH_FREE_CLIENTS = 2;
export const COACH_PAID_CLIENTS = 50;
