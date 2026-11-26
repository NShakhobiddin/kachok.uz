// Sayt ma’lumoti va kalkulyatorlar orasidagi umumiy holat (kaloriya kalkulyatori natijasi taomlar ro‘yxatida ishlatiladi).
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { SiteData } from './model';

const DataCtx = createContext<SiteData | null>(null);

interface Shared {
  /** kalkulyatorda hisoblangan kunlik kaloriya (bo‘lmasa — null) */
  dailyKcal: number | null;
  setDailyKcal: (n: number | null) => void;
}
const SharedCtx = createContext<Shared>({ dailyKcal: null, setDailyKcal: () => {} });

export function SiteProvider({ data, children }: { data: SiteData; children: ReactNode }) {
  const [dailyKcal, setDailyKcal] = useState<number | null>(null);
  const shared = useMemo(() => ({ dailyKcal, setDailyKcal }), [dailyKcal]);
  return (
    <DataCtx.Provider value={data}>
      <SharedCtx.Provider value={shared}>{children}</SharedCtx.Provider>
    </DataCtx.Provider>
  );
}

export function useSiteData(): SiteData {
  const d = useContext(DataCtx);
  if (!d) throw new Error('SiteProvider yo‘q');
  return d;
}

export const useShared = () => useContext(SharedCtx);

/** "1 234" — minglar ajratilmaydigan bo‘sh joy bilan (server va brauzerda bir xil natija) */
export const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
/** o‘nli kasr vergul bilan: 2,5 */
export const fmt1 = (n: number) => (Math.round(n * 10) / 10).toString().replace('.', ',');
