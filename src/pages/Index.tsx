
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import UpcomingTournaments from "@/components/home/UpcomingTournaments";
import StatsSection from "@/components/home/StatsSection";
import RecentResults from "@/components/home/RecentResults";
import FeaturedTournament from "@/components/home/FeaturedTournament";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["homepage-stats"],
    queryFn: async () => {
      console.log("Fetching homepage stats...");
      
      const [
        { data: tournaments, error: tournamentsError },
        { data: registrations, error: registrationsError },
        { data: matches, error: matchesError },
        { data: allTournaments, error: allTournamentsError }
      ] = await Promise.all([
        supabase.from("tournaments").select("id").eq("status", "active"),
        supabase.from("tournament_registrations").select("id"),
        supabase.from("matches").select("id").eq("status", "completed"),
        supabase.from("tournaments").select("id")
      ]);

      if (tournamentsError || registrationsError || matchesError || allTournamentsError) {
        console.error("Error fetching stats:", { tournamentsError, registrationsError, matchesError, allTournamentsError });
        throw new Error("Failed to fetch homepage stats");
      }

      const result = {
        activeTournaments: tournaments?.length || 0,
        registeredPlayers: registrations?.length || 0,
        completedMatches: matches?.length || 0,
        totalTournaments: allTournaments?.length || 0
      };

      console.log("Homepage stats:", result);
      return result;
    },
  });

  const { data: recentMatches, isLoading: matchesLoading } = useQuery({
    queryKey: ["recent-matches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(`
          *,
          tournament:tournaments(name, location),
          team1_player1:profiles!matches_team1_player1_id_fkey(full_name),
          team1_player2:profiles!matches_team1_player2_id_fkey(full_name),
          team2_player1:profiles!matches_team2_player1_id_fkey(full_name),
          team2_player2:profiles!matches_team2_player2_id_fkey(full_name)
        `)
        .eq("status", "completed")
        .order("updated_at", { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatsSection stats={stats} isLoading={statsLoading} />
      <UpcomingTournaments />
      <FeaturedTournament />
      <RecentResults matches={recentMatches} isLoading={matchesLoading} />
      <CTASection />
    </div>
  );
};

export default Index;
