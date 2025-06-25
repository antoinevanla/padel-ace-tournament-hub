
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Clock, MapPin, Trophy, Target } from "lucide-react";

const PlayerDashboard = () => {
  const { user } = useAuth();

  const { data: playerMatches } = useQuery({
    queryKey: ["player-matches", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
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
        .or(`team1_player1_id.eq.${user.id},team1_player2_id.eq.${user.id},team2_player1_id.eq.${user.id},team2_player2_id.eq.${user.id}`)
        .order("scheduled_time", { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: tournamentStats } = useQuery({
    queryKey: ["player-tournament-stats", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("tournament_registrations")
        .select(`
          tournament:tournaments(name, status),
          payment_status
        `)
        .eq("player_id", user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getMatchResult = (match: any) => {
    if (match.status !== "completed") return null;
    
    const isTeam1 = match.team1_player1_id === user?.id || match.team1_player2_id === user?.id;
    const won = (isTeam1 && match.team1_sets_won > match.team2_sets_won) || 
                (!isTeam1 && match.team2_sets_won > match.team1_sets_won);
    
    return { won, score: `${match.team1_sets_won}-${match.team2_sets_won}` };
  };

  const upcomingMatches = playerMatches?.filter(m => m.status === "scheduled") || [];
  const recentMatches = playerMatches?.filter(m => m.status === "completed").slice(0, 5) || [];
  const activeTournaments = tournamentStats?.filter(t => t.tournament.status === "active").length || 0;

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Player Dashboard</h1>
        <p className="text-gray-600">Track your matches and tournament progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{activeTournaments}</p>
                <p className="text-gray-600">Active Tournaments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{upcomingMatches.length}</p>
                <p className="text-gray-600">Upcoming Matches</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{recentMatches.length}</p>
                <p className="text-gray-600">Recent Matches</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {recentMatches.filter(m => getMatchResult(m)?.won).length}
                </p>
                <p className="text-gray-600">Wins</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Matches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingMatches.length === 0 ? (
              <p className="text-gray-600">No upcoming matches scheduled.</p>
            ) : (
              <div className="space-y-4">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium">{match.tournament.name}</p>
                        <p className="text-sm text-gray-600">{match.round_name}</p>
                      </div>
                      <Badge className={getStatusColor(match.status)}>
                        {match.status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm mb-3">
                      <span className="font-medium">
                        {match.team1_player1?.full_name}
                        {match.team1_player2 && ` & ${match.team1_player2.full_name}`}
                      </span>
                      <span className="mx-2 text-gray-400">VS</span>
                      <span className="font-medium">
                        {match.team2_player1?.full_name}
                        {match.team2_player2 && ` & ${match.team2_player2.full_name}`}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                      {match.scheduled_time && (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(match.scheduled_time).toLocaleString()}
                        </div>
                      )}
                      {match.court_number && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          Court {match.court_number}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Recent Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentMatches.length === 0 ? (
              <p className="text-gray-600">No recent matches completed.</p>
            ) : (
              <div className="space-y-4">
                {recentMatches.map((match) => {
                  const result = getMatchResult(match);
                  return (
                    <div key={match.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium">{match.tournament.name}</p>
                          <p className="text-sm text-gray-600">{match.round_name}</p>
                        </div>
                        <Badge variant={result?.won ? "default" : "secondary"}>
                          {result?.won ? "Won" : "Lost"}
                        </Badge>
                      </div>
                      
                      <div className="text-sm mb-2">
                        <span className="font-medium">
                          {match.team1_player1?.full_name}
                          {match.team1_player2 && ` & ${match.team1_player2.full_name}`}
                        </span>
                        <span className="mx-2 text-gray-400">VS</span>
                        <span className="font-medium">
                          {match.team2_player1?.full_name}
                          {match.team2_player2 && ` & ${match.team2_player2.full_name}`}
                        </span>
                      </div>

                      {result && (
                        <div className="text-center font-bold text-lg">
                          {result.score}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerDashboard;
