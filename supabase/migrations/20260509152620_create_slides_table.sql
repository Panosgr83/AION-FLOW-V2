/*
  # Create slides table for Hero Slider Manager

  1. New Tables
    - `slides`
      - `id` (uuid, primary key)
      - `title` (text, not null) - Slide headline
      - `subtitle` (text, nullable) - Secondary text line
      - `description` (text, default '') - Longer description paragraph
      - `image_url` (text, default '') - Background image URL
      - `cta1_text` (text, nullable) - Primary CTA button text
      - `cta1_link` (text, nullable) - Primary CTA button link
      - `cta2_text` (text, nullable) - Secondary CTA button text
      - `cta2_link` (text, nullable) - Secondary CTA button link
      - `order_position` (integer, default 0) - Display order
      - `is_active` (boolean, default true) - Visibility toggle
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `slides` table
    - Authenticated users can SELECT, INSERT, UPDATE, DELETE their slides
    - No public/anon access

  3. Notes
    - order_position allows drag-and-drop reordering
    - is_active allows hiding slides without deleting them
*/

CREATE TABLE IF NOT EXISTS slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  cta1_text text,
  cta1_link text,
  cta2_text text,
  cta2_link text,
  order_position integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view slides"
  ON slides FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create slides"
  ON slides FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update slides"
  ON slides FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete slides"
  ON slides FOR DELETE
  TO authenticated
  USING (true);
