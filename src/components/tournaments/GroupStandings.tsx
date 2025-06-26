
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Match {
  id: string;
  round_name: string;
  status: string;
  team1_sets_won: number | null;
  team2_sets_won: number | null;
  team1_score: number | null;
  team2_score: number | null;
  winner_team: number | null;
  team1_player1_id: string;
  team1_player2_id?: string;
  team2_player1_id: string;
  team2_player2_id?: string;
  team1_player1?: { full_name: string };
  team1_player2?: { full_name: string };
  team2_player1?: { full_name: string };
  team2_player2?: { full_name: string };
}

interface GroupStandingsProps {
  matches: Match[];
}

interface TeamStats {
  teamId: string;
  teamName: string;
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
}

const GroupStandings = ({ matches }: GroupStandingsProps) => {
  const groupMatches = matches?.filter(m => 
    m.round_name.toLowerCase().includes('group') && m.status === 'completed'
  ) || [];

  const calculateGroupStandings = () => {
    const standings: Record<string, Record<string, TeamStats>> = {};

    groupMatches.forEach(match => {
      const groupName = match.round_name;
      
      if (!standings[groupName]) {
        standings[groupName] = {};
      }

      // Create team IDs and names
      const team1Id = `${match.team1_player1_id}-${match.team1_player2_id || ''}`;
      const team2Id = `${match.team2_player1_id}-${match.team2_player2_id || ''}`;
      
      const team1Name = match.team1_player2 
        ? `${match.team1_player1?.full_name} & ${match.team1_player2.full_name}`
        : match.team1_player1?.full_name || 'Team 1';
      
      const team2Name = match.team2_player2 
        ? `${match.team2_player1?.full_name} & ${match.team2_player2.full_name}`
        : match.team2_player1?.full_name || 'Team 2';

      // Initialize teams if not exists
      if (!standings[groupName][team1Id]) {
        standings[groupName][team1Id] = {
          teamId: team1Id,
          teamName: team1Name,
          matches: 0,
          wins: 0,
          losses: 0,
          setsWon: 0,
          setsLost: 0,
          pointsScored: 0,
          pointsAgainst: 0,
          points: 0,
        };
      }

      if (!standings[groupName][team2Id]) {
        standings[groupName][team2Id] = {
          teamId: team2Id,
          teamName: team2Name,
          matches: 0,
          wins: 0,
          losses: 0,
          setsWon: 0,
          setsLost: 0,
          pointsScored: 0,
          pointsAgainst: 0,
          points: 0,
        };
      }

      // Update stats
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
        team1Stats.points += 3; // 3 points for a win
        team2Stats.losses++;
      } else if (match.winner_team === 2) {
        team2Stats.wins++;
        team2Stats.points += 3;
        team1Stats.losses++;
      }
    });

    // Sort teams within each group and mark qualification status
    Object.keys(standings).forEach(groupName => {
      const teams = Object.values(standings[groupName]).sort((a, b) => {
        // Sort by points, then by set difference, then by point difference
        if (b.points !== a.points) return b.points - a.points;
        const aSetDiff = a.setsWon - a.setsLost;
        const bSetDiff = b.setsWon - b.setsLost;
        if (bSetDiff !== aSetDiff) return bSetDiff - aSetDiff;
        const aPointDiff = a.pointsScored - a.pointsAgainst;
        const bPointDiff = b.pointsScored - b.pointsAgainst;
        return bPointDiff - aPointDiff;
      });

      // Mark top 2 as qualified, bottom as eliminated (simple logic)
      teams.forEach((team, index) => {
        if (index < 2) {
          team.qualified = true;
        } else if (index === teams.length - 1) {
          team.eliminated = true;
        }
      });

      // Update the standings object with sorted teams
      standings[groupName] = {};
      teams.forEach(team => {
        standings[groupName][team.teamId] = team;
      });
    });

    return standings;
  };

  const groupStandings = calculateGroupStandings();

  if (Object.keys(groupStandings).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Group Standings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">
            No completed group matches yet. Standings will appear here once matches are played.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupStandings).map(([groupName, teams]) => (
        <Card key={groupName}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              {groupName} Standings
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
                  <TableHead className="text-center">Points</TableHead>
                  <TableHead className="text-center">Pts</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(teams).map((team, index) => (
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
                    <TableCell className="text-center">
                      {team.pointsScored}-{team.pointsAgainst}
                    </TableCell>
                    <TableCell className="text-center font-bold">{team.points}</TableCell>
                    <TableCell className="text-center">
                      {team.qualified && (
                        <Badge className="bg-green-100 text-green-800">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Qualified
                        </Badge>
                      )}
                      {team.eliminated && (
                        <Badge className="bg-red-100 text-red-800">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          Eliminated
                        </Badge>
                      )}
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

export default GroupStandings;
