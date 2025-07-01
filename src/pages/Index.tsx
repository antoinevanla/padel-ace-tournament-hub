
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
      
      if (error) {
        console.error("Error fetching recent matches:", error);
        return [];
      }
      return data ? data.map(match => ({
        ...match,
        team1_player1: match.team1_player1 || { full_name: "Unknown Player" },
        team1_player2: match.team1_player2 || { full_name: "Unknown Player" },
        team2_player1: match.team2_player1 || { full_name: "Unknown Player" },
        team2_player2: match.team2_player2 || { full_name: "Unknown Player" },
        tournament: match.tournament || { name: "Unknown Tournament", location: "Unknown" }
      })) : [];
    },
  });

  const { data: upcomingTournaments } = useQuery({
    queryKey: ["upcoming-tournaments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select(`
          *,
          registrations:tournament_registrations(count)
        `)
        .in("status", ["upcoming", "active"])
        .order("start_date", { ascending: true })
        .limit(4);
      
      if (error) {
        console.error("Error fetching upcoming tournaments:", error);
        return [];
      }
      return data || [];
    },
  });

  const { data: featuredTournament } = useQuery({
    queryKey: ["featured-tournament"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select(`
          *,
          registrations:tournament_registrations(count)
        `)
        .eq("status", "upcoming")
        .order("start_date", { ascending: true })
        .limit(1)
        .single();
      
      if (error) {
        console.error("Error fetching featured tournament:", error);
        return null;
      }
      return data;
    },
  });

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      {upcomingTournaments && upcomingTournaments.length > 0 && (
        <UpcomingTournaments tournaments={upcomingTournaments} />
      )}
      {featuredTournament && (
        <FeaturedTournament tournament={featuredTournament} />
      )}
      {recentMatches && recentMatches.length > 0 && (
        <RecentResults matches={recentMatches} />
      )}
      <CTASection />
    </div>
  );
};

export default Index;
