import type { Queryable } from '../db/index.js';
import { planById } from './plans.js';

export interface Entitlements {
  pro: { active: boolean; until: string | null; trial: boolean };
  coach: { active: boolean; until: string | null };
}

/** To'langan buyurtma bo'yicha obunani uzaytirish (amaldagi muddat ustiga qo'shiladi) */
export async function activatePlan(q: Queryable, userId: string, planId: string) {
  const plan = planById(planId);
  if (!plan) throw new Error(`Noma’lum tarif: ${planId}`);
  await q.query(
    `INSERT INTO subscriptions (user_id, plan, kind, current_period_end)
     VALUES ($1, $2, $3, now() + make_interval(days => $4))
     ON CONFLICT (user_id, kind) DO UPDATE SET
       plan = EXCLUDED.plan,
       current_period_end = GREATEST(subscriptions.current_period_end, now()) + make_interval(days => $4),
       updated_at = now()`,
    [userId, plan.id, plan.kind, plan.days],
  );
}

/** To'lov qaytarilganda (Payme bekor qilishi) obunadan shu tarif kunlarini ayirish */
export async function revokePlan(q: Queryable, userId: string, planId: string) {
  const plan = planById(planId);
  if (!plan) return;
  await q.query(
    `UPDATE subscriptions SET current_period_end = current_period_end - make_interval(days => $3), updated_at = now()
     WHERE user_id = $1 AND kind = $2`,
    [userId, plan.kind, plan.days],
  );
}

export async function entitlements(q: Queryable, userId: string): Promise<Entitlements> {
  const { rows } = await q.query<{ kind: string; end: Date; trial: Date | null }>(
    `SELECT s.kind, s.current_period_end AS end, u.trial_until AS trial
       FROM users u LEFT JOIN subscriptions s ON s.user_id = u.id
      WHERE u.id = $1`,
    [userId],
  );
  const now = Date.now();
  const iso = (d: Date | null | undefined) => (d ? new Date(d).toISOString() : null);
  const get = (kind: string) => rows.find((r) => r.kind === kind)?.end ?? null;
  const proEnd = get('pro');
  const coachEnd = get('coach');
  const trial = rows[0]?.trial ?? null;
  const coachActive = !!coachEnd && new Date(coachEnd).getTime() > now;
  const paidPro = !!proEnd && new Date(proEnd).getTime() > now;
  const trialPro = !!trial && new Date(trial).getTime() > now;
  return {
    // murabbiy tarifi Pro imkoniyatlarini ham ochadi
    pro: { active: paidPro || trialPro || coachActive, until: iso(paidPro ? proEnd : coachActive ? coachEnd : trial), trial: !paidPro && !coachActive && trialPro },
    coach: { active: coachActive, until: iso(coachEnd) },
  };
}
