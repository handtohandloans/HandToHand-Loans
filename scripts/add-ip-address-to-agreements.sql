-- =========================================================================
-- SQL Migration: Add ip_address column to public.agent_agreements
-- Run this in your Supabase Project -> SQL Editor
-- =========================================================================

-- 1. Add the ip_address column if it does not already exist
ALTER TABLE public.agent_agreements 
ADD COLUMN IF NOT EXISTS ip_address TEXT;

-- 2. Notify PostgREST to immediately reload its schema cache
NOTIFY pgrst, 'reload schema';
