
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Users, Zap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TournamentStructureGeneratorProps {
  tournament: any;
  participants: any[];
}

const TournamentStructureGenerator = ({ tournament, participants }: TournamentStructureGeneratorProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generationConfig, setGenerationConfig] = useState({
    format: "groups_elimination",
    groupSize: 3,
    teamsPerGroup: 4,
  });

  const generateStructureMutation = useMutation({
    mutationFn: async () => {
      // Step 1: Create teams from participants
      const teams = createTeamsFromParticipants(participants);
      
      // Step 2: Generate matches based on format
      const matches = generateMatches(teams, generationConfig);
      
      // Step 3: Insert matches into database
      const { error } = await supabase
        .from("matches")
        .insert(matches.map(match => ({
          tournament_id: tournament.id,
          round_name: match.round,
          team1_player1_id: match.team1.player1_id,
          team1_player2_id: match.team1.player2_id,
          team2_player1_id: match.team2.player1_id,
          team2_player2_id: match.team2.player2_id,
          status: "scheduled",
        })));
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Tournament structure generated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["tournament-matches"] });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to generate tournament structure", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const createTeamsFromParticipants = (participants: any[]) => {
    const teams = [];
    const processedPlayers = new Set();
    
    // First, handle players with partners
    for (const participant of participants) {
      if (participant.partner_id && !processedPlayers.has(participant.player_id)) {
        teams.push({
          player1_id: participant.player_id,
          player2_id: participant.partner_id,
          player1_name: participant.player.full_name,
          player2_name: participant.partner?.full_name,
        });
        processedPlayers.add(participant.player_id);
        processedPlayers.add(participant.partner_id);
      }
    }
    
    // Then, pair remaining solo players
    const soloPlayers = participants.filter(p => 
      !p.partner_id && !processedPlayers.has(p.player_id)
    );
    
    for (let i = 0; i < soloPlayers.length - 1; i += 2) {
      teams.push({
        player1_id: soloPlayers[i].player_id,
        player2_id: soloPlayers[i + 1].player_id,
        player1_name: soloPlayers[i].player.full_name,
        player2_name: soloPlayers[i + 1].player.full_name,
      });
    }
    
    return teams;
  };

  const generateMatches = (teams: any[], config: typeof generationConfig) => {
    const matches = [];
    
    if (config.format === "groups_elimination") {
      // Divide teams into groups
      const groups = [];
      const teamsPerGroup = config.teamsPerGroup;
      
      for (let i = 0; i < teams.length; i += teamsPerGroup) {
        groups.push(teams.slice(i, i + teamsPerGroup));
      }
      
      // Generate group stage matches
      groups.forEach((group, groupIndex) => {
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            matches.push({
              round: `Group ${groupIndex + 1}`,
              team1: group[i],
              team2: group[j],
            });
          }
        }
      });
    } else if (config.format === "single_elimination") {
      // Generate single elimination bracket
      let currentRound = teams;
      let roundNumber = 1;
      
      while (currentRound.length > 1) {
        const nextRound = [];
        const roundName = getRoundName(currentRound.length);
        
        for (let i = 0; i < currentRound.length; i += 2) {
          if (i + 1 < currentRound.length) {
            matches.push({
              round: roundName,
              team1: currentRound[i],
              team2: currentRound[i + 1],
            });
            // Placeholder for winner
            nextRound.push({ placeholder: true });
          }
        }
        
        currentRound = nextRound;
        roundNumber++;
      }
    }
    
    return matches;
  };

  const getRoundName = (teamsCount: number) => {
    if (teamsCount <= 2) return "Final";
    if (teamsCount <= 4) return "Semi-Final";
    if (teamsCount <= 8) return "Quarter-Final";
    if (teamsCount <= 16) return "Round of 16";
    return `Round of ${teamsCount}`;
  };

  const canGenerate = participants.length >= 4 && participants.length % 2 === 0;
  const teamCount = Math.floor(participants.length / 2);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 mr-2" />
          Generate Tournament Structure
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center text-blue-800 mb-2">
            <Users className="h-4 w-4 mr-2" />
            <span className="font-medium">Tournament Status</span>
          </div>
          <p className="text-sm text-blue-700">
            {participants.length} participants registered → {teamCount} teams
          </p>
          {!canGenerate && (
            <p className="text-sm text-red-600 mt-1">
              Need even number of participants (minimum 4) to generate structure
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="format">Tournament Format</Label>
            <Select 
              value={generationConfig.format} 
              onValueChange={(value) => setGenerationConfig(prev => ({ ...prev, format: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="groups_elimination">Groups + Elimination</SelectItem>
                <SelectItem value="single_elimination">Single Elimination</SelectItem>
                <SelectItem value="round_robin">Round Robin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {generationConfig.format === "groups_elimination" && (
            <div>
              <Label htmlFor="teamsPerGroup">Teams per Group</Label>
              <Input
                id="teamsPerGroup"
                type="number"
                min="3"
                max="6"
                value={generationConfig.teamsPerGroup}
                onChange={(e) => setGenerationConfig(prev => ({
                  ...prev,
                  teamsPerGroup: parseInt(e.target.value)
                }))}
              />
            </div>
          )}
        </div>

        <Button
          onClick={() => generateStructureMutation.mutate()}
          disabled={!canGenerate || generateStructureMutation.isPending}
          className="w-full"
        >
          <Zap className="h-4 w-4 mr-2" />
          Generate Tournament Structure
        </Button>

        {generationConfig.format === "groups_elimination" && canGenerate && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p className="font-medium mb-1">Preview:</p>
            <p>• {Math.ceil(teamCount / generationConfig.teamsPerGroup)} groups of {generationConfig.teamsPerGroup} teams</p>
            <p>• {Math.ceil(teamCount / generationConfig.teamsPerGroup) * (generationConfig.teamsPerGroup * (generationConfig.teamsPerGroup - 1) / 2)} group stage matches</p>
            <p>• Followed by elimination rounds</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TournamentStructureGenerator;
