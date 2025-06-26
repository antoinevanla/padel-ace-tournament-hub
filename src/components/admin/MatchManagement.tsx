import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Plus } from "lucide-react";
import MatchCard from "./match/MatchCard";
import BulkSchedulingTool from "./match/BulkSchedulingTool";
import ScoreEntryDialog from "./match/ScoreEntryDialog";

interface MatchManagementProps {
  tournamentId: string;
}

const MatchManagement = ({ tournamentId }: MatchManagementProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [scoreDialogMatch, setScoreDialogMatch] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    scheduled_time: "",
    court_number: "",
    status: "",
    team1_sets_won: "",
    team2_sets_won: "",
    team1_score: "",
    team2_score: ""
  });

  const { data: matches, isLoading } = useQuery({
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

  const updateMatchMutation = useMutation({
    mutationFn: async ({ matchId, updates }: { matchId: string; updates: any }) => {
      const { error } = await supabase
        .from("matches")
        .update(updates)
        .eq("id", matchId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament-matches", tournamentId] });
      toast({ title: "Match updated successfully" });
      setEditingMatch(null);
    },
    onError: (error) => {
      toast({ 
        title: "Error updating match", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const deleteMatchMutation = useMutation({
    mutationFn: async (matchId: string) => {
      const { error } = await supabase
        .from("matches")
        .delete()
        .eq("id", matchId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament-matches", tournamentId] });
      toast({ title: "Match deleted successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error deleting match", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const bulkScheduleMutation = useMutation({
    mutationFn: async (params: {
      roundName: string;
      courts: number;
      matchDuration: number;
      startTime: string;
      startDate: string;
    }) => {
      const roundMatches = matches?.filter(m => m.round_name === params.roundName) || [];
      
      const updates = roundMatches.map((match, index) => {
        const courtNumber = (index % params.courts) + 1;
        const timeSlot = Math.floor(index / params.courts);
        const startDateTime = new Date(`${params.startDate}T${params.startTime}`);
        const scheduledTime = new Date(startDateTime.getTime() + (timeSlot * params.matchDuration * 60000));
        
        return {
          id: match.id,
          court_number: courtNumber,
          scheduled_time: scheduledTime.toISOString()
        };
      });

      for (const update of updates) {
        const { error } = await supabase
          .from("matches")
          .update({ 
            court_number: update.court_number, 
            scheduled_time: update.scheduled_time 
          })
          .eq("id", update.id);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament-matches", tournamentId] });
      toast({ title: "Matches scheduled successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error scheduling matches", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleStartEdit = (match: any) => {
    setEditingMatch(match.id);
    setEditForm({
      scheduled_time: match.scheduled_time ? new Date(match.scheduled_time).toISOString().slice(0, 16) : "",
      court_number: match.court_number?.toString() || "",
      status: match.status || "scheduled",
      team1_sets_won: match.team1_sets_won?.toString() || "0",
      team2_sets_won: match.team2_sets_won?.toString() || "0",
      team1_score: match.team1_score?.toString() || "0",
      team2_score: match.team2_score?.toString() || "0"
    });
  };

  const handleSaveEdit = (matchId: string) => {
    const updates: any = {
      scheduled_time: editForm.scheduled_time || null,
      court_number: editForm.court_number ? parseInt(editForm.court_number) : null,
      status: editForm.status,
      team1_sets_won: parseInt(editForm.team1_sets_won) || 0,
      team2_sets_won: parseInt(editForm.team2_sets_won) || 0,
      team1_score: parseInt(editForm.team1_score) || 0,
      team2_score: parseInt(editForm.team2_score) || 0
    };

    // Determine winner
    if (updates.status === "completed") {
      if (updates.team1_sets_won > updates.team2_sets_won) {
        updates.winner_team = 1;
      } else if (updates.team2_sets_won > updates.team1_sets_won) {
        updates.winner_team = 2;
      }
    }

    updateMatchMutation.mutate({ matchId, updates });
  };

  const handleFormChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleBulkSchedule = (params: {
    roundName: string;
    courts: number;
    matchDuration: number;
    startTime: string;
    startDate: string;
  }) => {
    bulkScheduleMutation.mutate(params);
  };

  const handleScoreEntry = (matchId: string, scores: {
    team1_sets_won: number;
    team2_sets_won: number;
    team1_score: number;
    team2_score: number;
  }) => {
    const updates = {
      ...scores,
      status: "completed",
      winner_team: scores.team1_sets_won > scores.team2_sets_won ? 1 : 2
    };

    updateMatchMutation.mutate({ matchId, updates });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading matches...</div>;
  }

  const matchesByRound = matches?.reduce((acc, match) => {
    if (!acc[match.round_name]) acc[match.round_name] = [];
    acc[match.round_name].push(match);
    return acc;
  }, {} as Record<string, any[]>) || {};

  const rounds = Object.keys(matchesByRound);

  return (
    <div className="space-y-6">
      <BulkSchedulingTool onBulkSchedule={handleBulkSchedule} rounds={rounds} />

      {Object.entries(matchesByRound).map(([roundName, roundMatches]) => (
        <Card key={roundName}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                {roundName}
              </span>
              <Badge variant="secondary">
                {roundMatches.length} matches
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roundMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  editingMatch={editingMatch}
                  editForm={editForm}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={() => setEditingMatch(null)}
                  onSaveEdit={handleSaveEdit}
                  onDelete={(matchId) => deleteMatchMutation.mutate(matchId)}
                  onFormChange={handleFormChange}
                />
              ))}
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setScoreDialogMatch(roundMatches[0])}
              >
                <Plus className="h-4 w-4 mr-2" />
                Quick Score Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <ScoreEntryDialog
        match={scoreDialogMatch}
        isOpen={!!scoreDialogMatch}
        onClose={() => setScoreDialogMatch(null)}
        onSave={handleScoreEntry}
      />

      {(!matches || matches.length === 0) && (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches yet</h3>
          <p className="text-gray-600">Matches will appear here once the tournament structure is generated.</p>
        </div>
      )}
    </div>
  );
};

export default MatchManagement;
