
import { Trophy, Users, Target, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StatsSection = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["homepage-stats"],
    queryFn: async () => {
      console.log("Fetching homepage stats...");
      
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
      const uniquePlayerIds = new Set();
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
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  const displayStats = [
    { 
      label: "Active Tournaments", 
      value: isLoading ? "..." : `${stats?.activeTournaments || 0}+`, 
      icon: Trophy 
    },
    { 
      label: "Registered Players", 
      value: isLoading ? "..." : `${stats?.registeredPlayers || 0}+`, 
      icon: Users 
    },
    { 
      label: "Matches Played", 
      value: isLoading ? "..." : `${stats?.completedMatches || 0}+`, 
      icon: Target 
    },
    { 
      label: "Total Tournaments", 
      value: isLoading ? "..." : `${stats?.totalTournaments || 0}+`, 
      icon: Star 
    }
  ];

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
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
