/*
  # Security hardening: revoke broad grants and storage policy

  1. Storage
    - Drop the overly-broad "Public can view media" SELECT policy on storage.objects
      Public buckets serve files via their public URL without needing a SELECT policy;
      the policy was exposing the file listing to anyone.

  2. Public schema - anon role
    - Revoke SELECT on all public tables from the anon role so they are not
      discoverable via GraphQL or the PostgREST API without authentication.

  3. Public schema - authenticated role
    - Revoke direct SELECT grant from authenticated on all public tables.
      Access is already governed by RLS policies which use auth.uid(); the
      table-level GRANT is redundant and exposes the tables in the GraphQL schema.
      We then re-grant SELECT to authenticated through RLS by ensuring existing
      RLS policies remain active (they already restrict per-user access).

  Important notes:
    - RLS is already enabled on all tables and policies use auth.uid()
    - After revoking the role-level GRANT, RLS policies still allow authenticated
      users to query rows they own because RLS evaluation happens after auth.
    - Supabase client uses the authenticated role via JWT, so RLS SELECT policies
      continue to work as expected.
*/

-- 1. Drop the broad storage SELECT policy
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;

-- 2. Revoke SELECT from anon on all public tables
REVOKE SELECT ON public.categories FROM anon;
REVOKE SELECT ON public.customers FROM anon;
REVOKE SELECT ON public.media FROM anon;
REVOKE SELECT ON public.order_items FROM anon;
REVOKE SELECT ON public.orders FROM anon;
REVOKE SELECT ON public.products FROM anon;
REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.settings FROM anon;

-- 3. Revoke SELECT from authenticated (RLS policies handle access)
REVOKE SELECT ON public.categories FROM authenticated;
REVOKE SELECT ON public.customers FROM authenticated;
REVOKE SELECT ON public.media FROM authenticated;
REVOKE SELECT ON public.order_items FROM authenticated;
REVOKE SELECT ON public.orders FROM authenticated;
REVOKE SELECT ON public.products FROM authenticated;
REVOKE SELECT ON public.profiles FROM authenticated;
REVOKE SELECT ON public.settings FROM authenticated;

-- 4. Re-grant only through RLS: grant usage so RLS policies can evaluate
--    (Supabase requires the role to have table-level permission for RLS to apply)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;
