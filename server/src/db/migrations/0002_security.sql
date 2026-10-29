-- Akkaunt o'chirilsa ham to'lov yozuvlari qoladi: Payme/Click tekshiruvi, hisobot (GetStatement) va qaytarish uchun kerak
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE orders DROP CONSTRAINT orders_user_id_fkey;
ALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Bepul sinov bir raqamga bir marta: raqamning HMAC xeshi, akkaunt o'chirilganda ham saqlanadi
CREATE TABLE trial_used (
  phone_hash text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Raqam bo'yicha cheklovlar (SMS soat/kun, kunlik xato urinishlar). Kod qayta yuborilganda yoki muvaffaqiyatli kirishda nolga tushmaydi
CREATE TABLE phone_limits (
  phone text PRIMARY KEY,
  day date NOT NULL DEFAULT current_date,
  sms_day int NOT NULL DEFAULT 0,
  fails_day int NOT NULL DEFAULT 0,
  hour_start timestamptz NOT NULL DEFAULT now(),
  sms_hour int NOT NULL DEFAULT 0,
  last_sent_at timestamptz
);

-- Butun server bo'yicha soatlik SMS byudjeti
CREATE TABLE sms_budget (
  hour timestamptz PRIMARY KEY,
  n int NOT NULL
);

-- Taklif kodi bir marta ishlatiladi
ALTER TABLE coach_invites ADD COLUMN used_at timestamptz;
ALTER TABLE coach_invites ADD COLUMN used_by uuid REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX coach_invites_coach ON coach_invites (coach_id, created_at DESC);

-- Hujjatning JSON hajmi (bayt): foydalanuvchi kvotasi siqilgan emas, haqiqiy hajm bo'yicha hisoblanadi
ALTER TABLE docs ADD COLUMN size int NOT NULL DEFAULT 0;
UPDATE docs SET size = coalesce(octet_length(data::text), 0);
