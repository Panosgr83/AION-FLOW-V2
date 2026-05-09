/*
  # Grant ALL and reload PostgREST schema cache

  1. Problem
    - stats_counters and features tables were created in later migrations
    - PostgREST caches the database schema at startup
    - New tables added after initial schema load are invisible to the API
    - This causes the Supabase client's await to hang indefinitely (no response)

  2. Solution
    - Explicit GRANT ALL on the newer CMS tables to both authenticated and anon roles
    - GRANT USAGE on all sequences
    - NOTIFY pgrst to reload its schema cache so PostgREST recognizes the tables

  3. Tables affected
    - stats_counters
    - features  
    - page_contents
    - slides
*/

-- Ensure authenticated role has full access
GRANT ALL ON TABLE public.stats_counters TO authenticated;
GRANT ALL ON TABLE public.features TO authenticated;
GRANT ALL ON TABLE public.page_contents TO authenticated;
GRANT ALL ON TABLE public.slides TO authenticated;

-- Ensure anon role has access (PostgREST authenticator starts as anon)
GRANT ALL ON TABLE public.stats_counters TO anon;
GRANT ALL ON TABLE public.features TO anon;
GRANT ALL ON TABLE public.page_contents TO anon;
GRANT ALL ON TABLE public.slides TO anon;

-- Grant sequence usage
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
