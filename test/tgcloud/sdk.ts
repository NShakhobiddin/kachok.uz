// Telegram Serverless `sdk` ning testlar uchun nusxasi: db (SQLite), api (yozib boradi), EndpointError.
import { db } from './sdk-db';

export { db };

export class EndpointError extends Error {
  constructor(
    public description: string,
    public parameters?: Record<string, unknown>,
  ) {
    super(description);
  }
}

export const calls: { method: string; params: unknown }[] = [];
export const replies: Record<string, (p: unknown) => unknown> = {};
export const api: Record<string, (p?: unknown) => Promise<unknown>> = new Proxy(
  {},
  {
    get: (_t, method: string) => async (params?: unknown) => {
      calls.push({ method, params });
      const r = replies[method];
      if (!r) return true;
      return r(params);
    },
  },
);
