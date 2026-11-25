// Telegram Serverless (tgcloud/): Mini App app<id>.tgcloud.ai da yig'ilgan (VITE_TGCLOUD=1) va Telegram ichida ochilgan bo'lsa,
// endpointlar Telegram.WebApp.Serverless.call orqali chaqiriladi — foydalanuvchini Telegram tasdiqlaydi.
import { telegram } from '../lib/telegram';
import { ApiError } from './client';

export const TGCLOUD = import.meta.env.VITE_TGCLOUD === '1';

/** Telegram Mini App ichida: kirish ma'lumoti bor */
export const tgInitData = (): string => (telegram() as unknown as { initData?: string } | undefined)?.initData ?? '';
/** Joriy Telegram foydalanuvchisi id si */
export const tgUserId = (): number | undefined => telegram()?.initDataUnsafe.user?.id;

type SlsError = Error & { type?: string; status?: number; parameters?: { code?: string } };
type Sls = { call: (name: string, input: object, cb: (err: SlsError | null, result: unknown) => void) => void };
const sls = () => (telegram() as unknown as { Serverless?: Sls } | undefined)?.Serverless;

export const serverless = () => TGCLOUD && !!sls() && tgInitData().length > 0;

/** Endpoint chaqiruvi (tgcloud/endpoints/<name>.js); xato — ApiError (EndpointError matni foydalanuvchiga) */
export function scall<T>(name: string, input: object = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      sls()!.call(name, input, (err, result) => {
        if (!err) return resolve(result as T);
        const mine = err.type === 'ENDPOINT_ERROR';
        reject(new ApiError(err.status ?? 0, err.parameters?.code ?? err.type ?? 'error', mine ? err.message : err.status ? 'Server xatosi — birozdan keyin qayta urinib ko‘ring' : 'Internet bilan bog‘lanib bo‘lmadi'));
      });
    } catch {
      reject(new ApiError(0, 'no_telegram', 'Ilovani Telegram ichida oching'));
    }
  });
}
