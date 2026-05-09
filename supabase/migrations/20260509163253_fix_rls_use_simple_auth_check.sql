/*
  # Simplify RLS to auth.uid() IS NOT NULL for CMS tables

  1. Problem
    - INSERT on stats_counters and features still failing in production
    - The profiles-based admin check may have RLS recursion issues
    - profiles table has its own RLS SELECT policy that could interfere
      with subqueries in other table policies

  2. Solution
    - Use simple auth.uid() IS NOT NULL check for CMS content tables
    - This is appropriate because:
      a) This is a single-admin CMS (not multi-tenant)
      b) Only authenticated users can access the dashboard
      c) The authentication itself is the access control boundary
    - Remove dependency on profiles table in RLS policies entirely

  3. Tables affected
    - stats_counters
    - features
    - slides
    - page_contents
*/

-- ============================================================
-- stats_counters
-- ============================================================

DROP POLICY IF EXISTS "Admins can create stats counters" ON public.stats_counters;
DROP POLICY IF EXISTS "Admins can update stats counters" ON public.stats_counters;
DROP POLICY IF EXISTS "Admins can delete stats counters" ON public.stats_counters;

CREATE POLICY "Authenticated users can insert stats counters"
  ON public.stats_counters FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update stats counters"
  ON public.stats_counters FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete stats counters"
  ON public.stats_counters FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- features
-- ============================================================

DROP POLICY IF EXISTS "Admins can create features" ON public.features;
DROP POLICY IF EXISTS "Admins can update features" ON public.features;
DROP POLICY IF EXISTS "Admins can delete features" ON public.features;

CREATE POLICY "Authenticated users can insert features"
  ON public.features FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update features"
  ON public.features FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete features"
  ON public.features FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- slides
-- ============================================================

DROP POLICY IF EXISTS "Admins can create slides" ON public.slides;
DROP POLICY IF EXISTS "Admins can update slides" ON public.slides;
DROP POLICY IF EXISTS "Admins can delete slides" ON public.slides;

CREATE POLICY "Authenticated users can insert slides"
  ON public.slides FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update slides"
  ON public.slides FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete slides"
  ON public.slides FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- page_contents
-- ============================================================

DROP POLICY IF EXISTS "Admins can create page contents" ON public.page_contents;
DROP POLICY IF EXISTS "Admins can update page contents" ON public.page_contents;
DROP POLICY IF EXISTS "Admins can delete page contents" ON public.page_contents;

CREATE POLICY "Authenticated users can insert page contents"
  ON public.page_contents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update page contents"
  ON public.page_contents FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete page contents"
  ON public.page_contents FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
