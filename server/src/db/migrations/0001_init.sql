-- Foydalanuvchilar (telefon raqami bilan kiriladi)
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL UNIQUE,
  name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'athlete' CHECK (role IN ('athlete', 'coach')),
  trial_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- SMS tasdiqlash kodlari (kodning o'zi emas, HMAC xeshi saqlanadi)
CREATE TABLE otp_codes (
  phone text PRIMARY KEY,
  code_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  attempts int NOT NULL DEFAULT 0,
  sent_count int NOT NULL DEFAULT 1,
  window_start timestamptz NOT NULL DEFAULT now(),
  last_sent_at timestamptz NOT NULL DEFAULT now()
);

-- Yangilash tokenlari (xeshlangan)
CREATE TABLE refresh_tokens (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX refresh_tokens_user ON refresh_tokens (user_id);

-- Sinxronlanadigan hujjatlar: profil, dastur, mashg'ulotlar, vazn, sozlamalar
CREATE SEQUENCE docs_seq;
CREATE TABLE docs (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  id text NOT NULL,
  data jsonb,
  updated_at bigint NOT NULL,
  deleted boolean NOT NULL DEFAULT false,
  seq bigint NOT NULL DEFAULT nextval('docs_seq'),
  PRIMARY KEY (user_id, kind, id)
);
CREATE INDEX docs_user_seq ON docs (user_id, seq);

-- Murabbiy va mijoz bog'lanishi
CREATE TABLE coach_invites (
  code text PRIMARY KEY,
  coach_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE coach_links (
  coach_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'ended')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (coach_id, client_id)
);
CREATE INDEX coach_links_client ON coach_links (client_id);
CREATE TABLE coach_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX coach_notes_client ON coach_notes (client_id, created_at DESC);

-- Obunalar va to'lovlar
CREATE TABLE subscriptions (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('pro', 'coach')),
  current_period_end timestamptz NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, kind)
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan text NOT NULL,
  amount_tiyin bigint NOT NULL,
  provider text NOT NULL CHECK (provider IN ('payme', 'click')),
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'pending', 'paid', 'cancelled')),
  -- Payme / Click tranzaksiya ma'lumotlari
  provider_txn_id text UNIQUE,
  provider_state int,
  provider_create_time bigint,
  perform_time bigint,
  cancel_time bigint,
  cancel_reason int,
  click_prepare_id bigint UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE SEQUENCE click_prepare_seq;
CREATE INDEX orders_user ON orders (user_id, created_at DESC);
