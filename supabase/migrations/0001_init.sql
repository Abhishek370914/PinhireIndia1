-- ============================================================
-- PinHire India — Supabase Schema
-- Run inside Supabase SQL editor or: supabase db push
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Profiles (extends auth.users) ───────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  avatar_url    TEXT,
  email         TEXT UNIQUE,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Companies ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS companies (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  logo_url        TEXT,
  banner_url      TEXT,
  description     TEXT,
  short_bio       TEXT,
  website         TEXT,
  career_page_url TEXT,
  industry        TEXT,
  company_size    TEXT,   -- "1-10", "11-50", "51-200", "201-1000", "1000+"
  funding_stage   TEXT,   -- "Bootstrapped", "Pre-seed", "Seed", "Series A", ...
  lat             DOUBLE PRECISION NOT NULL,
  lng             DOUBLE PRECISION NOT NULL,
  address         TEXT,
  locality        TEXT,
  city            TEXT NOT NULL,
  state           TEXT NOT NULL,
  pincode         TEXT,
  is_verified     BOOLEAN DEFAULT false,
  is_featured     BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ─── Jobs ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      UUID REFERENCES companies(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  requirements    TEXT,
  salary_min      INTEGER,
  salary_max      INTEGER,
  salary_currency TEXT DEFAULT 'INR',
  experience_min  INTEGER,   -- years
  experience_max  INTEGER,
  job_type        TEXT,      -- "full-time", "part-time", "contract", "internship"
  work_mode       TEXT,      -- "remote", "hybrid", "onsite"
  skills          TEXT[],
  apply_url       TEXT,
  source          TEXT DEFAULT 'manual',
  external_id     TEXT,
  is_new          BOOLEAN DEFAULT true,
  is_active       BOOLEAN DEFAULT true,
  posted_at       TIMESTAMPTZ DEFAULT now(),
  fetched_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source, external_id)
);

-- ─── Saved Items ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('company','job')),
  ref_id      UUID NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, type, ref_id)
);

-- ─── Alerts ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('company','locality','keyword')),
  value       TEXT NOT NULL,
  channels    TEXT[] DEFAULT ARRAY['in_app'],
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── Notifications ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  body        TEXT,
  url         TEXT,
  is_read     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── Push Subscriptions ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint    TEXT UNIQUE NOT NULL,
  keys        JSONB NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_companies_city        ON companies(city);
CREATE INDEX IF NOT EXISTS idx_companies_state       ON companies(state);
CREATE INDEX IF NOT EXISTS idx_companies_industry    ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_coords      ON companies(lat, lng);
CREATE INDEX IF NOT EXISTS idx_companies_featured    ON companies(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_jobs_company          ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_active           ON jobs(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_jobs_new              ON jobs(is_new) WHERE is_new = true;
CREATE INDEX IF NOT EXISTS idx_jobs_posted           ON jobs(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_user            ON saved_items(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user           ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_user            ON notifications(user_id, is_read, created_at DESC);

-- ─── Row Level Security ───────────────────────────────────────
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies         ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs              ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Public read for companies and jobs (everyone sees listings)
CREATE POLICY "Public read companies"  ON companies         FOR SELECT USING (true);
CREATE POLICY "Public read jobs"       ON jobs              FOR SELECT USING (is_active = true);

-- Profiles
CREATE POLICY "Users read own profile"  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Saved items
CREATE POLICY "Users manage saved"     ON saved_items FOR ALL USING (auth.uid() = user_id);

-- Alerts
CREATE POLICY "Users manage alerts"    ON alerts FOR ALL  USING (auth.uid() = user_id);

-- Notifications
CREATE POLICY "Users read own notifs"  ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifs" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Push subscriptions
CREATE POLICY "Users manage push"      ON push_subscriptions FOR ALL USING (auth.uid() = user_id);

-- ─── Helper View: Companies with job count ────────────────────
CREATE OR REPLACE VIEW companies_with_job_count AS
  SELECT c.*, COUNT(j.id) FILTER (WHERE j.is_active) AS job_count
  FROM companies c
  LEFT JOIN jobs j ON j.company_id = c.id
  GROUP BY c.id;
