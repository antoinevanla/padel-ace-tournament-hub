
import { Trophy, Users, Target, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StatsSection = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["homepage-stats"],
    queryFn: async () => {
      console.log("Fetching homepage stats...");
      
      try {
        // Get active tournaments count
        const { data: activeTournaments, error: tournamentsError } = await supabase
          .from("tournaments")
          .select("id")
          .eq("status", "active");
        
        if (tournamentsError) {
          console.error("Error fetching active tournaments:", tournamentsError);
        }

        // Get unique registered players count
        const { data: registrations, error: registrationsError } = await supabase
          .from("tournament_registrations")
          .select("player_id, partner_id");
        
        if (registrationsError) {
          console.error("Error fetching registrations:", registrationsError);
        }

        // Count unique players
        const uniquePlayerIds = new Set<string>();
        registrations?.forEach(reg => {
          if (reg.player_id) uniquePlayerIds.add(reg.player_id);
          if (reg.partner_id) uniquePlayerIds.add(reg.partner_id);
        });

        // Get completed matches count
        const { data: completedMatches, error: matchesError } = await supabase
          .from("matches")
          .select("id")
          .eq("status", "completed");
        
        if (matchesError) {
          console.error("Error fetching completed matches:", matchesError);
        }

        // Get total tournaments count (including upcoming and completed)
        const { data: allTournaments, error: allTournamentsError } = await supabase
          .from("tournaments")
          .select("id");
        
        if (allTournamentsError) {
          console.error("Error fetching all tournaments:", allTournamentsError);
        }

        const statsData = {
          activeTournaments: activeTournaments?.length || 0,
          registeredPlayers: uniquePlayerIds.size || 0,
          completedMatches: completedMatches?.length || 0,
          totalTournaments: allTournaments?.length || 0
        };

        console.log("Homepage stats:", statsData);
        return statsData;
      } catch (error) {
        console.error("Error in homepage stats query:", error);
        throw error;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    retry: 3,
    retryDelay: 1000,
  });

  // Fallback stats in case of error
  const fallbackStats = {
    activeTournaments: 0,
    registeredPlayers: 0,
    completedMatches: 0,
    totalTournaments: 0
  };

  const displayStats = [
    { 
      label: "Active Tournaments", 
      value: isLoading ? "..." : `${(stats || fallbackStats).activeTournaments}+`, 
      icon: Trophy,
      color: "text-blue-600"
    },
    { 
      label: "Registered Players", 
      value: isLoading ? "..." : `${(stats || fallbackStats).registeredPlayers}+`, 
      icon: Users,
      color: "text-green-600"
    },
    { 
      label: "Matches Played", 
      value: isLoading ? "..." : `${(stats || fallbackStats).completedMatches}+`, 
      icon: Target,
      color: "text-purple-600"
    },
    { 
      label: "Total Tournaments", 
      value: isLoading ? "..." : `${(stats || fallbackStats).totalTournaments}+`, 
      icon: Star,
      color: "text-orange-600"
    }
  ];

  if (error) {
    console.error("Homepage stats error:", error);
    // Continue to render with fallback data instead of crashing
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Growing Community</h2>
          <p className="text-gray-600">Be part of the fastest-growing padel tournament platform</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {displayStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-white shadow-lg w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gray-100">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
                {error && index === 0 && (
                  <div className="text-xs text-red-500 mt-1">Live data temporarily unavailable</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
