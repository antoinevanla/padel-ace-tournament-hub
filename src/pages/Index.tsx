
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "@/components/home/HeroSection";
import FeaturedTournament from "@/components/home/FeaturedTournament";
import UpcomingTournaments from "@/components/home/UpcomingTournaments";
import RecentResults from "@/components/home/RecentResults";
import StatsSection from "@/components/home/StatsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  const { data: upcomingTournaments } = useQuery({
    queryKey: ["upcoming-tournaments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select(`
          *,
          organizer:profiles(full_name),
          registrations:tournament_registrations(count)
        `)
        .eq("status", "upcoming")
        .order("start_date", { ascending: true })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: recentResults } = useQuery({
    queryKey: ["recent-results"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(`
          *,
          tournament:tournaments(name, location),
          team1_player1:profiles!matches_team1_player1_id_fkey(full_name),
          team2_player1:profiles!matches_team2_player1_id_fkey(full_name)
        `)
        .eq("status", "completed")
        .order("updated_at", { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const nextTournament = upcomingTournaments?.[0];
  const otherTournaments = upcomingTournaments?.slice(1) || [];

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {nextTournament && <FeaturedTournament tournament={nextTournament} />}
      
      {otherTournaments.length > 0 && (
        <UpcomingTournaments tournaments={otherTournaments} />
      )}
      
      {recentResults && recentResults.length > 0 && (
        <RecentResults matches={recentResults} />
      )}
      
      <StatsSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
};

export default Index;
