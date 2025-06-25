
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TournamentRegistration from "@/components/tournaments/TournamentRegistration";
import MatchManagement from "./MatchManagement";
import TournamentStructureGenerator from "./TournamentStructureGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
          player:profiles!tournament_registrations_player_id_fkey(full_name, avatar_url),
          partner:profiles!tournament_registrations_partner_id_fkey(full_name, avatar_url)
        `)
        .eq("tournament_id", tournamentId);
      
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <TournamentRegistration tournament={tournament} />
        </TabsContent>

        <TabsContent value="structure">
          {participants && (
            <TournamentStructureGenerator 
              tournament={tournament} 
              participants={participants} 
            />
          )}
        </TabsContent>

        <TabsContent value="matches">
          <MatchManagement tournamentId={tournamentId} />
        </TabsContent>

        <TabsContent value="participants">
          <Card>
            <CardHeader>
              <CardTitle>Registered Participants</CardTitle>
            </CardHeader>
            <CardContent>
              {participants && participants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {participants.map((registration) => (
                    <div key={registration.id} className="border rounded-lg p-4">
                      <div className="font-medium">{registration.player.full_name}</div>
                      {registration.partner && (
                        <div className="text-sm text-gray-600">
                          Partner: {registration.partner.full_name}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        Payment: {registration.payment_status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No participants registered yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTournamentDetail;
