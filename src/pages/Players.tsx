import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Star, Trophy, Calendar, Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Players = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: players, isLoading, error } = useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      console.log("Fetching all registered players...");
      
      try {
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (profileError) {
          console.error("Error fetching profiles:", profileError);
          throw profileError;
        }

        const { data: registrations, error: regError } = await supabase
          .from("tournament_registrations")
          .select(`
            player_id,
            partner_id,
            tournament_id,
            payment_status,
            registration_date,
            tournament:tournaments(name, start_date, status)
          `);
        
        if (regError) {
          console.error("Error fetching registrations:", regError);
        }

        const playersWithTournaments = profiles?.map(profile => {
          const playerRegistrations = registrations?.filter(reg => 
            reg.player_id === profile.id || reg.partner_id === profile.id
          ) || [];
          
          return {
            ...profile,
            tournament_registrations: playerRegistrations
          };
        }) || [];

        console.log("All players:", playersWithTournaments);
        return playersWithTournaments;
      } catch (error) {
        console.error("Error in players query:", error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: 1000,
  });

  const updateSkillLevelMutation = useMutation({
    mutationFn: async ({ playerId, skillLevel }: { playerId: string; skillLevel: number }) => {
      console.log("Updating skill level for player:", playerId, "to level:", skillLevel);
      
      if (!playerId || !skillLevel || skillLevel < 1 || skillLevel > 10) {
        throw new Error("Invalid player ID or skill level");
      }

      const { error } = await supabase
        .from("profiles")
        .update({ skill_level: skillLevel })
        .eq("id", playerId);
      
      if (error) {
        console.error("Error updating skill level:", error);
        throw error;
      }
      console.log("Skill level updated successfully");
    },
    onSuccess: () => {
      toast({ title: "Skill level updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["players"] });
      queryClient.invalidateQueries({ queryKey: ["tournament-participants"] });
      queryClient.invalidateQueries({ queryKey: ["homepage-stats"] });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast({ 
        title: "Error updating skill level", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const getSkillLevel = (level: number | null) => {
    if (!level) return "Beginner";
    if (level <= 3) return "Beginner";
    if (level <= 6) return "Intermediate";
    if (level <= 8) return "Advanced";
    return "Expert";
  };

  const getSkillColor = (level: number | null) => {
    if (!level) return "bg-gray-100 text-gray-800";
    if (level <= 3) return "bg-green-100 text-green-800";
    if (level <= 6) return "bg-blue-100 text-blue-800";
    if (level <= 8) return "bg-purple-100 text-purple-800";
    return "bg-red-100 text-red-800";
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "organizer":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSkillLevelChange = (playerId: string, newLevel: string) => {
    const skillLevel = parseInt(newLevel);
    console.log("Handling skill level change:", playerId, skillLevel);
    
    if (!playerId || !skillLevel || isNaN(skillLevel)) {
      toast({ 
        title: "Error", 
        description: "Invalid player ID or skill level",
        variant: "destructive" 
      });
      return;
    }
    
    updateSkillLevelMutation.mutate({ playerId, skillLevel });
  };

  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'organizer';

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading players...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <p>Error loading players: {error.message}</p>
          <button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ["players"] })}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log("Total players found:", players?.length || 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Players</h1>
        <p className="text-gray-600">
          Meet the padel community and discover talented players ({players?.length || 0} total players)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {players?.map((player) => (
          <Card key={player.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src={player.avatar_url || ""} alt={player.full_name || ""} />
                <AvatarFallback className="text-lg">
                  {player.full_name ? player.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : player.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">
                {player.full_name || player.email.split('@')[0]}
              </CardTitle>
              <div className="flex justify-center space-x-2 flex-wrap gap-1">
                <Badge className={getRoleColor(player.role || 'player')}>
                  {player.role || 'player'}
                </Badge>
                {player.skill_level && (
                  <Badge className={getSkillColor(player.skill_level)}>
                    {getSkillLevel(player.skill_level)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </span>
                <span className="font-medium text-xs truncate max-w-[120px]" title={player.email}>
                  {player.email}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-600">
                  <Star className="h-4 w-4 mr-2" />
                  Skill Level
                </span>
                {isAdmin ? (
                  <Select
                    value={player.skill_level?.toString() || "1"}
                    onValueChange={(value) => handleSkillLevelChange(player.id, value)}
                    disabled={updateSkillLevelMutation.isPending}
                  >
                    <SelectTrigger className="w-24 h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 (Beginner)</SelectItem>
                      <SelectItem value="2">2 (Beginner)</SelectItem>
                      <SelectItem value="3">3 (Beginner)</SelectItem>
                      <SelectItem value="4">4 (Intermediate)</SelectItem>
                      <SelectItem value="5">5 (Intermediate)</SelectItem>
                      <SelectItem value="6">6 (Intermediate)</SelectItem>
                      <SelectItem value="7">7 (Advanced)</SelectItem>
                      <SelectItem value="8">8 (Advanced)</SelectItem>
                      <SelectItem value="9">9 (Expert)</SelectItem>
                      <SelectItem value="10">10 (Expert)</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="font-medium">{player.skill_level || 1}/10</span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-600">
                  <Trophy className="h-4 w-4 mr-2" />
                  Tournaments
                </span>
                <span className="font-medium">
                  {player.tournament_registrations?.length || 0}
                </span>
              </div>

              {player.tournament_registrations && player.tournament_registrations.length > 0 && (
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-700">Recent Tournaments:</div>
                  {player.tournament_registrations.slice(0, 2).map((reg: any) => (
                    <div key={reg.tournament_id} className="flex items-center justify-between text-xs">
                      <span className="truncate max-w-[100px]" title={reg.tournament?.name}>
                        {reg.tournament?.name || 'Unknown Tournament'}
                      </span>
                      <Badge 
                        className={`${getPaymentStatusColor(reg.payment_status)} text-xs`}
                        variant="secondary"
                      >
                        {reg.payment_status}
                      </Badge>
                    </div>
                  ))}
                  {player.tournament_registrations.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{player.tournament_registrations.length - 2} more
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined
                </span>
                <span className="font-medium">
                  {new Date(player.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!players || players.length === 0) && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No players found</h3>
          <p className="text-gray-600">Players will appear here when they register on the website.</p>
        </div>
      )}
    </div>
  );
};

export default Players;
