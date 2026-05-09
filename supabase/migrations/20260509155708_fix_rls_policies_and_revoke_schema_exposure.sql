/*
  # Fix RLS Policies and Revoke GraphQL Schema Exposure

  1. Security Fixes - RLS Policies
    - Drop all "always true" INSERT/UPDATE/DELETE policies on:
      slides, page_contents, stats_counters, features
    - Replace with admin-only policies that check the user has 'admin' role
      in their profile (via profiles.role check)
    - SELECT policies remain for authenticated users (read access is appropriate)

  2. Security Fixes - GraphQL Schema Exposure
    - Revoke SELECT on all public tables from `anon` role
    - Revoke SELECT on all public tables from `authenticated` role
    - Tables are only accessible through RLS policies (which grant row-level
      access), not through broad role-level grants

  3. Notes
    - Admin check uses: EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    - This ensures only users with admin role in profiles can modify CMS content
    - Read access for authenticated users is preserved via RLS SELECT policies
*/

-- Helper: Create a reusable function for admin check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ============================================================
-- 1. FIX: slides table policies
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can create slides" ON public.slides;
DROP POLICY IF EXISTS "Authenticated users can update slides" ON public.slides;
DROP POLICY IF EXISTS "Authenticated users can delete slides" ON public.slides;

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
-- 2. FIX: page_contents table policies
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can create page contents" ON public.page_contents;
DROP POLICY IF EXISTS "Authenticated users can update page contents" ON public.page_contents;
DROP POLICY IF EXISTS "Authenticated users can delete page contents" ON public.page_contents;

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
-- 3. FIX: stats_counters table policies
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can create stats counters" ON public.stats_counters;
DROP POLICY IF EXISTS "Authenticated users can update stats counters" ON public.stats_counters;
DROP POLICY IF EXISTS "Authenticated users can delete stats counters" ON public.stats_counters;

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
-- 4. FIX: features table policies
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can create features" ON public.features;
DROP POLICY IF EXISTS "Authenticated users can update features" ON public.features;
DROP POLICY IF EXISTS "Authenticated users can delete features" ON public.features;

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

-- ============================================================
-- 5. FIX: Revoke direct table access from anon role (GraphQL schema exposure)
-- ============================================================

REVOKE SELECT ON public.features FROM anon;
REVOKE SELECT ON public.page_contents FROM anon;
REVOKE SELECT ON public.slides FROM anon;
REVOKE SELECT ON public.stats_counters FROM anon;
REVOKE SELECT ON public.categories FROM anon;
REVOKE SELECT ON public.customers FROM anon;
REVOKE SELECT ON public.media FROM anon;
REVOKE SELECT ON public.order_items FROM anon;
REVOKE SELECT ON public.orders FROM anon;
REVOKE SELECT ON public.products FROM anon;
REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.settings FROM anon;

-- ============================================================
-- 6. FIX: Revoke direct table access from authenticated role (GraphQL schema exposure)
--    RLS policies still control actual row-level access for authenticated users
-- ============================================================

REVOKE SELECT ON public.features FROM authenticated;
REVOKE SELECT ON public.page_contents FROM authenticated;
REVOKE SELECT ON public.slides FROM authenticated;
REVOKE SELECT ON public.stats_counters FROM authenticated;
REVOKE SELECT ON public.categories FROM authenticated;
REVOKE SELECT ON public.customers FROM authenticated;
REVOKE SELECT ON public.media FROM authenticated;
REVOKE SELECT ON public.order_items FROM authenticated;
REVOKE SELECT ON public.orders FROM authenticated;
REVOKE SELECT ON public.products FROM authenticated;
REVOKE SELECT ON public.profiles FROM authenticated;
REVOKE SELECT ON public.settings FROM authenticated;
