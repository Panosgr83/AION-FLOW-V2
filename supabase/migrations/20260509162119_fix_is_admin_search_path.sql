/*
  # Fix is_admin() function search_path

  1. Changes
    - Adds explicit SET search_path to is_admin() function
    - Ensures auth.uid() resolves correctly when called from PostgREST context
    - Prevents potential search_path resolution issues in edge cases

  2. Notes
    - The function is SECURITY DEFINER so it bypasses RLS on profiles
    - search_path includes 'public' and 'auth' schemas explicitly
*/

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public', 'auth', 'extensions'
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
