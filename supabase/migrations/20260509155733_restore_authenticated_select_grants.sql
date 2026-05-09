/*
  # Restore SELECT grants for authenticated role

  1. Changes
    - Re-grants SELECT on all public tables to authenticated role
    - This is required because PostgREST/Supabase client needs the base
      privilege grant, with RLS policies then filtering at row level
    - Without SELECT grant, even RLS SELECT policies won't work
    - The anon revocations remain in place (anon should not access these tables)

  2. Notes
    - GraphQL schema visibility for authenticated users is acceptable in this
      admin CMS context since all authenticated users are verified admins
    - RLS policies still restrict actual data access at row level
*/

GRANT SELECT ON public.features TO authenticated;
GRANT SELECT ON public.page_contents TO authenticated;
GRANT SELECT ON public.slides TO authenticated;
GRANT SELECT ON public.stats_counters TO authenticated;
GRANT SELECT ON public.categories TO authenticated;
GRANT SELECT ON public.customers TO authenticated;
GRANT SELECT ON public.media TO authenticated;
GRANT SELECT ON public.order_items TO authenticated;
GRANT SELECT ON public.orders TO authenticated;
GRANT SELECT ON public.products TO authenticated;
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.settings TO authenticated;

-- Also ensure INSERT/UPDATE/DELETE grants exist for authenticated
-- (RLS policies will control actual access, but the role needs base privileges)
GRANT INSERT, UPDATE, DELETE ON public.features TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.page_contents TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.slides TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.stats_counters TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.settings TO authenticated;
