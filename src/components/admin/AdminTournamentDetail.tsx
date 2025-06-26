import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TournamentRegistration from "@/components/tournaments/TournamentRegistration";
import MatchManagement from "./MatchManagement";
import TournamentStructureGenerator from "./TournamentStructureGenerator";
import QualificationManager from "./QualificationManager";
import ParticipantManagement from "./ParticipantManagement";
import TournamentOverview from "./TournamentOverview";

interface AdminTournamentDetailProps {
  tournamentId: string;
}

const AdminTournamentDetail = ({ tournamentId }: AdminTournamentDetailProps) => {
  const { data: tournament } = useQuery({
    queryKey: ["tournament", tournamentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .eq("id", tournamentId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: participants } = useQuery({
    queryKey: ["tournament-participants", tournamentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournament_registrations")
        .select(`
          *,
          player:profiles!tournament_registrations_player_id_fkey(full_name, avatar_url, email, skill_level),
          partner:profiles!tournament_registrations_partner_id_fkey(full_name, avatar_url, email, skill_level)
        `)
        .eq("tournament_id", tournamentId);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: matches } = useQuery({
    queryKey: ["tournament-matches", tournamentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(`
          *,
          team1_player1:profiles!matches_team1_player1_id_fkey(full_name),
          team1_player2:profiles!matches_team1_player2_id_fkey(full_name),
          team2_player1:profiles!matches_team2_player1_id_fkey(full_name),
          team2_player2:profiles!matches_team2_player2_id_fkey(full_name)
        `)
        .eq("tournament_id", tournamentId)
        .order("round_name", { ascending: true })
        .order("scheduled_time", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  if (!tournament) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{tournament.name}</h1>
        <p className="text-gray-600">Tournament Management</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <TournamentOverview 
            tournament={tournament} 
            participants={participants}
            matches={matches}
          />
        </TabsContent>

        <TabsContent value="matches">
          <MatchManagement tournamentId={tournamentId} />
        </TabsContent>

        <TabsContent value="qualifications">
          <QualificationManager tournamentId={tournamentId} />
        </TabsContent>

        <TabsContent value="structure">
          {participants && (
            <TournamentStructureGenerator 
              tournament={tournament} 
              participants={participants} 
            />
          )}
        </TabsContent>

        <TabsContent value="participants">
          <ParticipantManagement 
            tournamentId={tournamentId}
            participants={participants}
          />
        </TabsContent>

        <TabsContent value="registration">
          <TournamentRegistration tournament={tournament} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTournamentDetail;
