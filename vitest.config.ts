import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  // Telegram Serverless modullari (tgcloud/) testlarda `sdk` o'rniga SQLite ustidagi nusxani oladi
  resolve: {
    alias: [
      { find: /^sdk\/db$/, replacement: here('./test/tgcloud/sdk-db.ts') },
      { find: /^sdk$/, replacement: here('./test/tgcloud/sdk.ts') },
    ],
  },
  test: { include: ['src/**/*.test.ts', 'test/**/*.test.ts'], environment: 'node', testTimeout: 60000 },
});
