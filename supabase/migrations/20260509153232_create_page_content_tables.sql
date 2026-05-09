/*
  # Create Page Content Management Tables

  1. New Tables
    - `page_contents`
      - `id` (uuid, primary key)
      - `page_key` (text, unique) - identifier like 'about_story', 'home_intro'
      - `title` (text, nullable) - section title
      - `content` (text, default '') - rich text HTML content
      - `metadata` (jsonb, nullable) - extra structured data
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `stats_counters`
      - `id` (uuid, primary key)
      - `label` (text) - counter label e.g. "Χρόνια Εμπειρίας"
      - `value` (text) - counter value e.g. "25", "10,000"
      - `suffix` (text, nullable) - suffix e.g. "+", "%"
      - `order_position` (integer, default 0)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `features`
      - `id` (uuid, primary key)
      - `icon` (text) - Lucide icon name e.g. "Heart", "Star"
      - `title` (text) - feature title
      - `description` (text) - feature description
      - `order_position` (integer, default 0)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Authenticated users can SELECT, INSERT, UPDATE, DELETE
    - No public/anon access

  3. Notes
    - page_contents uses unique page_key for upsert pattern
    - stats_counters and features support ordering and active toggle
*/

-- Page Contents
CREATE TABLE IF NOT EXISTS page_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text UNIQUE NOT NULL,
  title text,
  content text NOT NULL DEFAULT '',
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view page contents"
  ON page_contents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create page contents"
  ON page_contents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update page contents"
  ON page_contents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete page contents"
  ON page_contents FOR DELETE
  TO authenticated
  USING (true);

-- Stats Counters
CREATE TABLE IF NOT EXISTS stats_counters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL DEFAULT '0',
  suffix text,
  order_position integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE stats_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view stats counters"
  ON stats_counters FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create stats counters"
  ON stats_counters FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update stats counters"
  ON stats_counters FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete stats counters"
  ON stats_counters FOR DELETE
  TO authenticated
  USING (true);

-- Features
CREATE TABLE IF NOT EXISTS features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Star',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  order_position integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view features"
  ON features FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create features"
  ON features FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update features"
  ON features FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete features"
  ON features FOR DELETE
  TO authenticated
  USING (true);
