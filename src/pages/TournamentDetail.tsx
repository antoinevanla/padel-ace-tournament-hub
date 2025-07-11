
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TournamentRegistration from "@/components/tournaments/TournamentRegistration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Calendar, Trophy, Loader2, AlertCircle } from "lucide-react";

const TournamentDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: tournament, isLoading: tournamentLoading, error: tournamentError } = useQuery({
    queryKey: ["tournament", id],
    queryFn: async () => {
      if (!id) throw new Error("Tournament ID is required");
      
      console.log("Fetching tournament details for ID:", id);
      const { data, error } = await supabase
        .from("tournaments")
        .select(`
          *,
          organizer:profiles!tournaments_organizer_id_fkey(full_name)
        `)
        .eq("id", id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching tournament:", error);
        throw error;
      }
      console.log("Tournament data loaded:", data);
      return data;
    },
    enabled: !!id,
    retry: 2,
    retryDelay: 1000,
  });

  const { data: participants, isLoading: participantsLoading } = useQuery({
    queryKey: ["tournament-participants", id],
    queryFn: async () => {
      if (!id) return [];
      
      console.log("Fetching participants for tournament:", id);
      const { data, error } = await supabase
        .from("tournament_registrations")
        .select(`
          *,
          player:profiles!tournament_registrations_player_id_fkey(full_name, avatar_url, email),
          partner:profiles!tournament_registrations_partner_id_fkey(full_name, avatar_url, email)
        `)
        .eq("tournament_id", id);
      
      if (error) {
        console.error("Error fetching participants:", error);
        return [];
      }
      console.log("Participants data loaded:", data);
      return data || [];
    },
    enabled: !!id && !!tournament,
    retry: 2,
    retryDelay: 1000,
  });

  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ["tournament-matches", id],
    queryFn: async () => {
      if (!id) return [];
      
      console.log("Fetching matches for tournament:", id);
      const { data, error } = await supabase
        .from("matches")
        .select(`
          *,
          team1_player1:profiles!matches_team1_player1_id_fkey(full_name),
          team1_player2:profiles!matches_team1_player2_id_fkey(full_name),
          team2_player1:profiles!matches_team2_player1_id_fkey(full_name),
          team2_player2:profiles!matches_team2_player2_id_fkey(full_name)
        `)
        .eq("tournament_id", id)
        .order("scheduled_time", { ascending: true });
      
      if (error) {
        console.error("Error fetching matches:", error);
        return [];
      }
      console.log("Matches data loaded:", data);
      return data || [];
    },
    enabled: !!id && !!tournament,
    retry: 2,
    retryDelay: 1000,
  });

  const isLoading = tournamentLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading tournament details...</span>
        </div>
      </div>
    );
  }

  if (tournamentError) {
    console.error("Tournament error:", tournamentError);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Tournament</h2>
          <p className="text-gray-600 mb-4">
            {tournamentError.message || "There was an error loading the tournament details."}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tournament Not Found</h2>
          <p className="text-gray-600">The tournament you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {tournament && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-2xl font-bold mb-4">Tournament Registration</h2>
              <p className="text-gray-600 mb-4">Players can register for this tournament using the form below.</p>
              <TournamentRegistration tournament={tournament} />
            </div>
          )}

          {participants && participants.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Participants ({participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {participants.map((registration) => (
                    <div key={registration.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar>
                        <AvatarImage src={registration.player?.avatar_url || ""} />
                        <AvatarFallback>
                          {registration.player?.full_name?.[0] || registration.player?.email?.[0] || "P"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">
                          {registration.player?.full_name || registration.player?.email?.split('@')[0] || "Unknown Player"}
                        </p>
                        {registration.partner && (
                          <p className="text-sm text-gray-600">
                            Partner: {registration.partner?.full_name || registration.partner?.email?.split('@')[0] || "Unknown"}
                          </p>
                        )}
                        <Badge 
                          variant={registration.payment_status === "completed" ? "default" : "secondary"}
                          className="text-xs mt-1"
                        >
                          {registration.payment_status || "pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {matches && matches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Matches & Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matches.map((match) => (
                    <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">{match.round_name || "Round TBD"}</span>
                        <Badge className={getStatusColor(match.status || "scheduled")}>
                          {match.status || "scheduled"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-center">
                          <p className="font-medium">
                            {match.team1_player1?.full_name || "TBD"}
                            {match.team1_player2?.full_name && ` & ${match.team1_player2.full_name}`}
                          </p>
                          {match.status === "completed" && (
                            <span className="text-lg font-bold">{match.team1_sets_won || 0}</span>
                          )}
                        </div>
                        <span className="text-gray-400 mx-4">VS</span>
                        <div className="text-center">
                          <p className="font-medium">
                            {match.team2_player1?.full_name || "TBD"}
                            {match.team2_player2?.full_name && ` & ${match.team2_player2.full_name}`}
                          </p>
                          {match.status === "completed" && (
                            <span className="text-lg font-bold">{match.team2_sets_won || 0}</span>
                          )}
                        </div>
                      </div>
                      {match.scheduled_time && (
                        <div className="text-center text-sm text-gray-600 mt-2">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {new Date(match.scheduled_time).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tournament Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium">Organizer:</span>
                <p className="text-gray-600">{tournament.organizer?.full_name || "Unknown"}</p>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <Badge className={getStatusColor(tournament.status || "upcoming")} variant="secondary">
                  {tournament.status || "upcoming"}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Dates:</span>
                <p className="text-gray-600">
                  {tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : "TBD"} - {tournament.end_date ? new Date(tournament.end_date).toLocaleDateString() : "TBD"}
                </p>
              </div>
              <div>
                <span className="font-medium">Registration Deadline:</span>
                <p className="text-gray-600">
                  {tournament.registration_deadline ? new Date(tournament.registration_deadline).toLocaleDateString() : "TBD"}
                </p>
              </div>
              {tournament.entry_fee && tournament.entry_fee > 0 && (
                <div>
                  <span className="font-medium">Entry Fee:</span>
                  <p className="text-gray-600">€{tournament.entry_fee}</p>
                </div>
              )}
              {tournament.prize_pool && tournament.prize_pool > 0 && (
                <div>
                  <span className="font-medium">Prize Pool:</span>
                  <p className="text-green-600 font-semibold">€{tournament.prize_pool}</p>
                </div>
              )}
              <div>
                <span className="font-medium">Participants:</span>
                <p className="text-gray-600">{participants?.length || 0} / {tournament.max_participants || 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;
