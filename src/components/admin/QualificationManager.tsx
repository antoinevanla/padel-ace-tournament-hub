
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Users, TrendingUp, TrendingDown, Settings } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface QualificationManagerProps {
  tournamentId: string;
}

interface TeamStats {
  teamId: string;
  teamName: string;
  groupName: string;
  matches: number;
  wins: number;
  losses: number;
  setsWon: number;
  setsLost: number;
  pointsScored: number;
  pointsAgainst: number;
  points: number;
  qualified?: boolean;
  eliminated?: boolean;
  player1Id: string;
  player2Id?: string;
}

const QualificationManager = ({ tournamentId }: QualificationManagerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [teamQualifications, setTeamQualifications] = useState<Record<string, { qualified: boolean; eliminated: boolean }>>({});

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
        .eq("tournament_id", tournamentId);
      
      if (error) throw error;
      return data;
    },
  });

  const generateKnockoutMutation = useMutation({
    mutationFn: async (qualifiedTeams: TeamStats[]) => {
      console.log("Generating knockout stage with teams:", qualifiedTeams);
      
      if (qualifiedTeams.length < 2) {
        throw new Error("Need at least 2 qualified teams to generate knockout stage");
      }

      const getRoundName = (teamCount: number) => {
        if (teamCount === 2) return "Final";
        if (teamCount <= 4) return "Semi-Final";
        if (teamCount <= 8) return "Quarter-Final";
        if (teamCount <= 16) return "Round of 16";
        return `Round of ${teamCount}`;
      };

      const roundName = getRoundName(qualifiedTeams.length);
      const knockoutMatches = [];
      
      for (let i = 0; i < qualifiedTeams.length; i += 2) {
        if (qualifiedTeams[i + 1]) {
          knockoutMatches.push({
            tournament_id: tournamentId,
            round_name: roundName,
            team1_player1_id: qualifiedTeams[i].player1Id,
            team1_player2_id: qualifiedTeams[i].player2Id || null,
            team2_player1_id: qualifiedTeams[i + 1].player1Id,
            team2_player2_id: qualifiedTeams[i + 1].player2Id || null,
            status: "scheduled" as const,
          });
        }
      }

      console.log("Creating knockout matches:", knockoutMatches);

      for (const match of knockoutMatches) {
        const { error } = await supabase
          .from("matches")
          .insert(match);
        
        if (error) throw error;
      }

      return knockoutMatches.length;
    },
    onSuccess: (matchCount) => {
      toast({ title: `Knockout stage generated successfully! Created ${matchCount} matches.` });
      queryClient.invalidateQueries({ queryKey: ["tournament-matches"] });
    },
    onError: (error) => {
      console.error("Error generating knockout stage:", error);
      toast({ 
        title: "Failed to generate knockout stage", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const calculateGroupStandings = (): Record<string, TeamStats[]> => {
    if (!matches) return {};

    const completedMatches = matches.filter(m => 
      m.round_name?.toLowerCase().includes('group') && m.status === 'completed'
    );

    const standings: Record<string, Record<string, TeamStats>> = {};

    completedMatches.forEach(match => {
      const groupName = match.round_name || "Unknown Group";
      
      if (!standings[groupName]) {
        standings[groupName] = {};
      }

      const team1Id = `${match.team1_player1_id}-${match.team1_player2_id || ''}`;
      const team2Id = `${match.team2_player1_id}-${match.team2_player2_id || ''}`;
      
      const team1Name = match.team1_player2?.full_name 
        ? `${match.team1_player1?.full_name || 'Player'} & ${match.team1_player2.full_name}`
        : match.team1_player1?.full_name || 'Team 1';
      
      const team2Name = match.team2_player2?.full_name 
        ? `${match.team2_player1?.full_name || 'Player'} & ${match.team2_player2.full_name}`
        : match.team2_player1?.full_name || 'Team 2';

      if (!standings[groupName][team1Id]) {
        standings[groupName][team1Id] = {
          teamId: team1Id,
          teamName: team1Name,
          groupName: groupName,
          matches: 0,
          wins: 0,
          losses: 0,
          setsWon: 0,
          setsLost: 0,
          pointsScored: 0,
          pointsAgainst: 0,
          points: 0,
          player1Id: match.team1_player1_id || '',
          player2Id: match.team1_player2_id || undefined,
        };
      }

      if (!standings[groupName][team2Id]) {
        standings[groupName][team2Id] = {
          teamId: team2Id,
          teamName: team2Name,
          groupName: groupName,
          matches: 0,
          wins: 0,
          losses: 0,
          setsWon: 0,
          setsLost: 0,
          pointsScored: 0,
          pointsAgainst: 0,
          points: 0,
          player1Id: match.team2_player1_id || '',
          player2Id: match.team2_player2_id || undefined,
        };
      }

      const team1Stats = standings[groupName][team1Id];
      const team2Stats = standings[groupName][team2Id];

      team1Stats.matches++;
      team2Stats.matches++;

      const team1Sets = match.team1_sets_won || 0;
      const team2Sets = match.team2_sets_won || 0;
      const team1Score = match.team1_score || 0;
      const team2Score = match.team2_score || 0;

      team1Stats.setsWon += team1Sets;
      team1Stats.setsLost += team2Sets;
      team1Stats.pointsScored += team1Score;
      team1Stats.pointsAgainst += team2Score;

      team2Stats.setsWon += team2Sets;
      team2Stats.setsLost += team1Sets;
      team2Stats.pointsScored += team2Score;
      team2Stats.pointsAgainst += team1Score;

      if (match.winner_team === 1) {
        team1Stats.wins++;
        team1Stats.points += 3;
        team2Stats.losses++;
      } else if (match.winner_team === 2) {
        team2Stats.wins++;
        team2Stats.points += 3;
        team1Stats.losses++;
      }
    });

    const sortedStandings: Record<string, TeamStats[]> = {};
    
    Object.keys(standings).forEach(groupName => {
      const teams = Object.values(standings[groupName]).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const aSetDiff = a.setsWon - a.setsLost;
        const bSetDiff = b.setsWon - b.setsLost;
        if (bSetDiff !== aSetDiff) return bSetDiff - aSetDiff;
        const aPointDiff = a.pointsScored - a.pointsAgainst;
        const bPointDiff = b.pointsScored - b.pointsAgainst;
        return bPointDiff - aPointDiff;
      });

      teams.forEach((team, index) => {
        const manualStatus = teamQualifications[team.teamId];
        if (manualStatus) {
          team.qualified = manualStatus.qualified;
          team.eliminated = manualStatus.eliminated;
        } else {
          if (index < 2) {
            team.qualified = true;
          } else if (index === teams.length - 1) {
            team.eliminated = true;
          }
        }
      });

      sortedStandings[groupName] = teams;
    });

    return sortedStandings;
  };

  const toggleTeamQualification = (teamId: string, type: 'qualified' | 'eliminated') => {
    setTeamQualifications(prev => ({
      ...prev,
      [teamId]: {
        qualified: type === 'qualified' ? !prev[teamId]?.qualified : false,
        eliminated: type === 'eliminated' ? !prev[teamId]?.eliminated : false,
      }
    }));
  };

  const handleGenerateKnockout = () => {
    const groupStandings = calculateGroupStandings();
    const qualifiedTeams: TeamStats[] = [];
    
    Object.values(groupStandings).forEach(teams => {
      qualifiedTeams.push(...teams.filter(team => team.qualified));
    });

    console.log("Qualified teams for knockout:", qualifiedTeams);

    if (qualifiedTeams.length >= 2) {
      generateKnockoutMutation.mutate(qualifiedTeams);
    } else {
      toast({
        title: "Insufficient qualified teams",
        description: "Need at least 2 qualified teams to generate knockout stage",
        variant: "destructive"
      });
    }
  };

  const groupStandings = calculateGroupStandings();

  if (Object.keys(groupStandings).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Qualification Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">
            No group stage matches completed yet. Complete group matches to manage qualifications.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Qualification Manager</h2>
        <Button onClick={handleGenerateKnockout} disabled={generateKnockoutMutation.isPending}>
          <Settings className="h-4 w-4 mr-2" />
          Generate Knockout Stage
        </Button>
      </div>

      {Object.entries(groupStandings).map(([groupName, teams]) => (
        <Card key={groupName}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              {groupName} - Qualification Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">P</TableHead>
                  <TableHead className="text-center">W</TableHead>
                  <TableHead className="text-center">L</TableHead>
                  <TableHead className="text-center">Sets</TableHead>
                  <TableHead className="text-center">Pts</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team, index) => (
                  <TableRow key={team.teamId} className={
                    team.qualified ? "bg-green-50" : 
                    team.eliminated ? "bg-red-50" : ""
                  }>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{team.teamName}</TableCell>
                    <TableCell className="text-center">{team.matches}</TableCell>
                    <TableCell className="text-center">{team.wins}</TableCell>
                    <TableCell className="text-center">{team.losses}</TableCell>
                    <TableCell className="text-center">
                      {team.setsWon}-{team.setsLost}
                    </TableCell>
                    <TableCell className="text-center font-bold">{team.points}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={team.qualified ? "default" : "outline"}
                          onClick={() => toggleTeamQualification(team.teamId, 'qualified')}
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {team.qualified ? 'Qualified' : 'Qualify'}
                        </Button>
                        <Button
                          size="sm"
                          variant={team.eliminated ? "destructive" : "outline"}
                          onClick={() => toggleTeamQualification(team.teamId, 'eliminated')}
                        >
                          <TrendingDown className="h-3 w-3 mr-1" />
                          {team.eliminated ? 'Eliminated' : 'Eliminate'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QualificationManager;
