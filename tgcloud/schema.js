// Telegram Serverless ma'lumotlar bazasi (SQLite): do'stlar lentasi.
// Sxema o'zgarsa: push → `npx tgcloud migrate` (CI'da --safe). Tashqi kalitlar yo'q — bog'lanish kodda (lib/social.js).
import { table, integer, text, index, uniqueIndex, primaryKey, sql } from 'sdk/db';

/** Telegram foydalanuvchisi; ichki id do'stlarga ko'rinadi, Telegram id — yo'q */
export const users = table('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tgId: integer('tg_id').notNull().unique(),
  name: text('name').notNull().default(''),
  friendCode: text('friend_code').unique(),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`),
  /** Telegram orqali ulashilgan raqam (requestContact → bot chatiga kontakt); do'stlarga ko'rinmaydi */
  phone: text('phone'),
  /** ro'yxatdan o'tgan vaqt (unix ms): bulutga saqlash shundan keyin yoqiladi */
  registeredAt: integer('registered_at'),
  /** botdan eslatma: mashg'ulot kuni ertalab va dushanba — haftalik natija */
  remind: integer('remind').notNull().default(0),
  /** soat mintaqasi, UTC dan daqiqa (Toshkent — 300) */
  tzOffset: integer('tz_offset').notNull().default(300),
  /** eslatma soati (mahalliy) */
  remindHour: integer('remind_hour').notNull().default(8),
});

/** Do'stlik ikki tomonlama: (a, b) va (b, a) */
export const friendships = table(
  'friendships',
  {
    userId: integer('user_id').notNull(),
    friendId: integer('friend_id').notNull(),
    createdAt: integer('created_at').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.friendId] }),
    friendIdx: index('idx_friendships_friend').on(t.friendId),
  }),
);

/** Lentadagi yozuv: tugagan mashg'ulot yoki hafta natijasi; bir clientId — bitta yozuv */
export const posts = table(
  'posts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull(),
    clientId: text('client_id').notNull(),
    kind: text('kind').notNull(),
    data: text('data').notNull(),
    /** unix ms */
    createdAt: integer('created_at').notNull(),
  },
  (t) => ({
    clientUq: uniqueIndex('uq_posts_user_client').on(t.userId, t.clientId),
    timeIdx: index('idx_posts_user_time').on(t.userId, t.createdAt),
  }),
);

/** «💪» */
export const kudos = table(
  'kudos',
  {
    postId: integer('post_id').notNull(),
    userId: integer('user_id').notNull(),
    createdAt: integer('created_at').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.postId, t.userId] }),
    userIdx: index('idx_kudos_user').on(t.userId),
  }),
);

/** Oddiy so'rov cheklovchi: kalit bo'yicha oyna boshidagi vaqt va son */
export const hits = table('hits', {
  key: text('key').primaryKey(),
  windowStart: integer('window_start').notNull(),
  count: integer('count').notNull(),
});

/** Bulutdagi ilova ma'lumotlari (sinxronlash): profil, dastur, mashg'ulotlar, vazn, ovqat, sozlamalar */
export const docs = table(
  'docs',
  {
    userId: integer('user_id').notNull(),
    kind: text('kind').notNull(),
    docId: text('doc_id').notNull(),
    /** JSON; o'chirilgan hujjatda null */
    data: text('data'),
    /** unix ms — ziddiyatda eng yangisi yutadi */
    updatedAt: integer('updated_at').notNull(),
    deleted: integer('deleted').notNull().default(0),
    /** foydalanuvchi bo'yicha o'sib boruvchi o'zgarish raqami (kursor) */
    seq: integer('seq').notNull(),
    size: integer('size').notNull().default(0),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.kind, t.docId] }),
    seqIdx: index('idx_docs_user_seq').on(t.userId, t.seq),
  }),
);

/** Yuborilgan eslatmalar: bir kunda bir marta (rejalashtiruvchi ikki marta ishlasa ham) */
export const notified = table(
  'notified',
  {
    userId: integer('user_id').notNull(),
    kind: text('kind').notNull(),
    day: text('day').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.kind, t.day] }),
  }),
);
