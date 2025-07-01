
-- Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skill_level integer DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- Add missing columns to tournament_registrations table  
ALTER TABLE public.tournament_registrations ADD COLUMN IF NOT EXISTS registration_date timestamp with time zone DEFAULT now();

-- Add missing columns to matches table
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS team1_score integer DEFAULT 0;
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS team2_score integer DEFAULT 0;
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS court_number integer;

-- Fix winner_team column type (should be integer, not text)
ALTER TABLE public.matches ALTER COLUMN winner_team TYPE integer USING CASE 
  WHEN winner_team = '1' THEN 1 
  WHEN winner_team = '2' THEN 2 
  ELSE NULL 
END;
