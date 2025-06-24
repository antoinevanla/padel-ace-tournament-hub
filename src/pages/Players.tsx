
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Star, Trophy, Calendar } from "lucide-react";

const Players = () => {
  const { data: players, isLoading } = useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          tournaments_organized:tournaments!tournaments_organizer_id_fkey(count),
          tournament_registrations(count)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading players...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Players</h1>
        <p className="text-gray-600">Meet the padel community and discover talented players</p>
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
              <div className="flex justify-center space-x-2">
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
              {player.skill_level && (
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-gray-600">
                    <Star className="h-4 w-4 mr-2" />
                    Skill Level
                  </span>
                  <span className="font-medium">{player.skill_level}/10</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-600">
                  <Trophy className="h-4 w-4 mr-2" />
                  Tournaments
                </span>
                <span className="font-medium">
                  {player.tournament_registrations?.[0]?.count || 0}
                </span>
              </div>

              {player.tournaments_organized?.[0]?.count > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    Organized
                  </span>
                  <span className="font-medium">
                    {player.tournaments_organized[0].count}
                  </span>
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No players yet</h3>
          <p className="text-gray-600">Players will appear here as they join the community.</p>
        </div>
      )}
    </div>
  );
};

export default Players;
