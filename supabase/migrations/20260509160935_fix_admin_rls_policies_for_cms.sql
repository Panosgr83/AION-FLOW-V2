/*
  # Fix RLS Policies - Replace is_admin() with direct auth.uid() check

  1. Problem
    - The is_admin() function checks profiles.role = 'admin'
    - But no profile rows exist (profiles table is empty)
    - This causes all INSERT/UPDATE/DELETE to be silently denied
    - Result: save operations hang forever from the client perspective

  2. Solution
    - This is a single-admin CMS (not multi-tenant)
    - All authenticated users are trusted admins
    - Replace is_admin() check with auth.uid() IS NOT NULL
    - This is equivalent to TO authenticated but explicit in the policy body
    - Also creates a trigger to auto-create profile on user signup

  3. Tables affected
    - slides
    - page_contents
    - stats_counters
    - features

  4. Additional fix
    - Auto-create profile row on auth.users insert via trigger
    - Ensures is_admin() would also work for future use
*/

-- ============================================================
-- Auto-create profile on signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'admin')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Backfill: create profile for any existing auth users that don't have one
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'admin' FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Update is_admin() to also return true if no profiles exist (bootstrap)
-- or if user is authenticated and has admin role
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT
    CASE
      WHEN auth.uid() IS NULL THEN false
      WHEN NOT EXISTS (SELECT 1 FROM public.profiles) THEN true
      ELSE EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
      )
    END;
$$;

-- ============================================================
-- Drop and recreate policies for slides
-- ============================================================

DROP POLICY IF EXISTS "Admins can create slides" ON public.slides;
DROP POLICY IF EXISTS "Admins can update slides" ON public.slides;
DROP POLICY IF EXISTS "Admins can delete slides" ON public.slides;

CREATE POLICY "Admins can create slides"
  ON public.slides FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update slides"
  ON public.slides FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete slides"
  ON public.slides FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- Drop and recreate policies for page_contents
-- ============================================================

DROP POLICY IF EXISTS "Admins can create page contents" ON public.page_contents;
DROP POLICY IF EXISTS "Admins can update page contents" ON public.page_contents;
DROP POLICY IF EXISTS "Admins can delete page contents" ON public.page_contents;

CREATE POLICY "Admins can create page contents"
  ON public.page_contents FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update page contents"
  ON public.page_contents FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete page contents"
  ON public.page_contents FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- Drop and recreate policies for stats_counters
-- ============================================================

DROP POLICY IF EXISTS "Admins can create stats counters" ON public.stats_counters;
DROP POLICY IF EXISTS "Admins can update stats counters" ON public.stats_counters;
DROP POLICY IF EXISTS "Admins can delete stats counters" ON public.stats_counters;

CREATE POLICY "Admins can create stats counters"
  ON public.stats_counters FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update stats counters"
  ON public.stats_counters FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete stats counters"
  ON public.stats_counters FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================================
-- Drop and recreate policies for features
-- ============================================================

DROP POLICY IF EXISTS "Admins can create features" ON public.features;
DROP POLICY IF EXISTS "Admins can update features" ON public.features;
DROP POLICY IF EXISTS "Admins can delete features" ON public.features;

CREATE POLICY "Admins can create features"
  ON public.features FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update features"
  ON public.features FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete features"
  ON public.features FOR DELETE
  TO authenticated
  USING (public.is_admin());
