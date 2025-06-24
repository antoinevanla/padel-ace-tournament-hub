
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, MapPin } from "lucide-react";

const Results = () => {
  const { data: matches, isLoading } = useQuery({
    queryKey: ["matches"],
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
        .order("updated_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tournament Results</h1>
        <p className="text-gray-600">Latest match results and tournament outcomes</p>
      </div>

      <div className="space-y-6">
        {matches?.map((match) => (
          <Card key={match.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{match.tournament?.name}</CardTitle>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {match.tournament?.location}
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(match.status)}>
                    {match.status}
                  </Badge>
                  <div className="text-sm text-gray-600 mt-1">
                    Round: {match.round_name}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  {/* Team 1 */}
                  <div className={`text-center ${match.winner_team === 1 ? 'font-bold text-green-600' : ''}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">
                        {match.team1_player1?.full_name}
                        {match.team1_player2 && ` & ${match.team1_player2.full_name}`}
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {match.team1_sets_won}
                    </div>
                    <div className="text-sm text-gray-600">
                      ({match.team1_score} points)
                    </div>
                  </div>

                  {/* VS */}
                  <div className="text-2xl font-bold text-gray-400 mx-4">
                    VS
                  </div>

                  {/* Team 2 */}
                  <div className={`text-center ${match.winner_team === 2 ? 'font-bold text-green-600' : ''}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">
                        {match.team2_player1?.full_name}
                        {match.team2_player2 && ` & ${match.team2_player2.full_name}`}
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {match.team2_sets_won}
                    </div>
                    <div className="text-sm text-gray-600">
                      ({match.team2_score} points)
                    </div>
                  </div>
                </div>

                {match.winner_team && (
                  <div className="text-center mt-4 pt-4 border-t">
                    <div className="flex items-center justify-center text-green-600">
                      <Trophy className="h-4 w-4 mr-2" />
                      <span className="font-medium">
                        Winner: Team {match.winner_team}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {match.scheduled_time && (
                <div className="flex items-center text-sm text-gray-600 mt-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  Played on {new Date(match.scheduled_time).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {(!matches || matches.length === 0) && (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No results yet</h3>
          <p className="text-gray-600">Match results will appear here once tournaments begin.</p>
        </div>
      )}
    </div>
  );
};

export default Results;
