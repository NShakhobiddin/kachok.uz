-- Telegram orqali kirish: telefon raqamisiz akkaunt (telefon yoki telegram_id — kamida bittasi)
ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE users ADD COLUMN telegram_id bigint UNIQUE;
ALTER TABLE users ADD CONSTRAINT users_login CHECK (phone IS NOT NULL OR telegram_id IS NOT NULL);

-- Do'stlar: har foydalanuvchining shaxsiy taklif kodi va ikki tomonlama do'stlik (har yo'nalish alohida qator)
ALTER TABLE users ADD COLUMN friend_code text UNIQUE;
CREATE TABLE friendships (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, friend_id),
  CHECK (user_id <> friend_id)
);
CREATE INDEX friendships_friend ON friendships (friend_id);

-- Lenta: mashg'ulot va hafta natijalari (ilovadagi ulashish kartochkasi ma'lumoti)
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('workout', 'week')),
  data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, client_id)
);
CREATE INDEX posts_user_time ON posts (user_id, created_at DESC);

-- "💪" — do'stning natijasiga qo'llab-quvvatlash
CREATE TABLE kudos (
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);
CREATE INDEX kudos_user ON kudos (user_id);
