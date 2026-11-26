// 2026-11 auditi: rasmlardagi xatolar va Flow-6 uchun tuzatish topshiriqlari (flow-pack3.ts).
// priority: 1 — noto'g'ri texnika yoki buzuq rasm; 2 — harakat (ikkinchi kadr) yo'q yoki noto'g'ri.
// main — asosiy kadrni yangidan chizishdagi tuzatishlar (ingliz tilida); pair — ikkinchi kadr.

export interface AuditFix {
  id: string;
  priority: 1 | 2;
  /** o'zbekcha: nima xato */
  problem: string;
  /** uy/trenajyor bo'limi — ayol figura */
  female?: boolean;
  main?: string;
  pair?: { phaseUz: string; change: string };
}

export const AUDIT_FIXES: AuditFix[] = [];
