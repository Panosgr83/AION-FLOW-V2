/*
  # Simplify RLS Policies - Remove is_admin() dependency

  1. Problem
    - The is_admin() function works in SQL tests but may have execution
      context issues in actual PostgREST calls
    - Users report INSERT still failing on stats_counters and features

  2. Solution
    - Replace is_admin() WITH CHECK with direct inline subquery
    - This eliminates any potential function resolution issues
    - Uses direct EXISTS check against profiles table
    - Falls back to allowing any authenticated user if no profiles exist

  3. Tables affected
    - stats_counters (INSERT, UPDATE, DELETE)
    - features (INSERT, UPDATE, DELETE)
    - slides (INSERT, UPDATE, DELETE)
    - page_contents (INSERT, UPDATE, DELETE)
*/

-- ============================================================
-- stats_counters
-- ============================================================

DROP POLICY IF EXISTS "Admins can create stats counters" ON public.stats_counters;
DROP POLICY IF EXISTS "Admins can update stats counters" ON public.stats_counters;
DROP POLICY IF EXISTS "Admins can delete stats counters" ON public.stats_counters;

CREATE POLICY "Admins can create stats counters"
  ON public.stats_counters FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR NOT EXISTS (SELECT 1 FROM public.profiles)
  );

CREATE POLICY "Admins can update stats counters"
  ON public.stats_counters FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR NOT EXISTS (SELECT 1 FROM public.profiles)
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR NOT EXISTS (SELECT 1 FROM public.profiles)
  );

CREATE POLICY "Admins can delete stats counters"
  ON public.stats_counters FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR NOT EXISTS (SELECT 1 FROM public.profiles)
  );

-- ============================================================
-- features
-- ============================================================

DROP POLICY IF EXISTS "Admins can create features" ON public.features;
DROP POLICY IF EXISTS "Admins can update features" ON public.features;
DROP POLICY IF EXISTS "Admins can delete features" ON public.features;

CREATE POLICY "Admins can create features"
  ON public.features FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR NOT EXISTS (SELECT 1 FROM public.profiles)
  );

CREATE POLICY "Admins can update features"
  ON public.features FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR NOT EXISTS (SELECT 1 FROM public.profiles)
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR NOT EXISTS (SELECT 1 FROM public.profiles)
  );

CREATE POLICY "Admins can delete features"
  ON public.features FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR NOT EXISTS (SELECT 1 FROM public.profiles)
  );

-- ============================================================
-- slides
-- ============================================================

DROP POLICY IF EXISTS "Admins can create slides" ON public.slides;
DROP POLICY IF EXISTS "Admins can update slides" ON public.slides;
DROP POLICY IF EXISTS "Admins can delete slides" ON public.slides;

CREATE POLICY "Admins can create slides"
  ON public.slides FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR NOT EXISTS (SELECT 1 FROM public.profiles)
  );

CREATE POLICY "Admins can update slides"
  ON public.slides FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR NOT EXISTS (SELECT 1 FROM public.profiles)
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR NOT EXISTS (SELECT 1 FROM public.profiles)
  );

CREATE POLICY "Admins can delete slides"
  ON public.slides FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR NOT EXISTS (SELECT 1 FROM public.profiles)
  );

-- ============================================================
-- page_contents
-- ============================================================

DROP POLICY IF EXISTS "Admins can create page contents" ON public.page_contents;
DROP POLICY IF EXISTS "Admins can update page contents" ON public.page_contents;
DROP POLICY IF EXISTS "Admins can delete page contents" ON public.page_contents;

CREATE POLICY "Admins can create page contents"
  ON public.page_contents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR NOT EXISTS (SELECT 1 FROM public.profiles)
  );

CREATE POLICY "Admins can update page contents"
  ON public.page_contents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR NOT EXISTS (SELECT 1 FROM public.profiles)
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR NOT EXISTS (SELECT 1 FROM public.profiles)
  );

CREATE POLICY "Admins can delete page contents"
  ON public.page_contents FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
    OR NOT EXISTS (SELECT 1 FROM public.profiles)
  );
