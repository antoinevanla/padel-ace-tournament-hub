
-- First, let's check if the foreign key constraints exist and add them if missing
-- Add foreign key constraints for matches table to profiles table
DO $$
BEGIN
    -- Add foreign key for team1_player1_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'matches_team1_player1_id_fkey'
    ) THEN
        ALTER TABLE public.matches 
        ADD CONSTRAINT matches_team1_player1_id_fkey 
        FOREIGN KEY (team1_player1_id) REFERENCES public.profiles(id);
    END IF;

    -- Add foreign key for team1_player2_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'matches_team1_player2_id_fkey'
    ) THEN
        ALTER TABLE public.matches 
        ADD CONSTRAINT matches_team1_player2_id_fkey 
        FOREIGN KEY (team1_player2_id) REFERENCES public.profiles(id);
    END IF;

    -- Add foreign key for team2_player1_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'matches_team2_player1_id_fkey'
    ) THEN
        ALTER TABLE public.matches 
        ADD CONSTRAINT matches_team2_player1_id_fkey 
        FOREIGN KEY (team2_player1_id) REFERENCES public.profiles(id);
    END IF;

    -- Add foreign key for team2_player2_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'matches_team2_player2_id_fkey'
    ) THEN
        ALTER TABLE public.matches 
        ADD CONSTRAINT matches_team2_player2_id_fkey 
        FOREIGN KEY (team2_player2_id) REFERENCES public.profiles(id);
    END IF;

    -- Add foreign key for tournament_registrations player_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tournament_registrations_player_id_fkey'
    ) THEN
        ALTER TABLE public.tournament_registrations 
        ADD CONSTRAINT tournament_registrations_player_id_fkey 
        FOREIGN KEY (player_id) REFERENCES public.profiles(id);
    END IF;

    -- Add foreign key for tournament_registrations partner_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tournament_registrations_partner_id_fkey'
    ) THEN
        ALTER TABLE public.tournament_registrations 
        ADD CONSTRAINT tournament_registrations_partner_id_fkey 
        FOREIGN KEY (partner_id) REFERENCES public.profiles(id);
    END IF;

    -- Add foreign key for media_gallery uploaded_by if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'media_gallery_uploaded_by_fkey'
    ) THEN
        ALTER TABLE public.media_gallery 
        ADD CONSTRAINT media_gallery_uploaded_by_fkey 
        FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id);
    END IF;

    -- Add foreign key for media_gallery tournament_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'media_gallery_tournament_id_fkey'
    ) THEN
        ALTER TABLE public.media_gallery 
        ADD CONSTRAINT media_gallery_tournament_id_fkey 
        FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id);
    END IF;

    -- Add foreign key for tournaments organizer_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tournaments_organizer_id_fkey'
    ) THEN
        ALTER TABLE public.tournaments 
        ADD CONSTRAINT tournaments_organizer_id_fkey 
        FOREIGN KEY (organizer_id) REFERENCES public.profiles(id);
    END IF;
END $$;
