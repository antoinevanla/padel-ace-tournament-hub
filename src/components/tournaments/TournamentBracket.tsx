
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users } from "lucide-react";

interface Match {
  id: string;
  round_name: string;
  status: string;
  team1_sets_won: number | null;
  team2_sets_won: number | null;
  winner_team: number | null;
  team1_player1?: { full_name: string };
  team1_player2?: { full_name: string };
  team2_player1?: { full_name: string };
  team2_player2?: { full_name: string };
}

interface TournamentBracketProps {
  matches: Match[];
}

const TournamentBracket = ({ matches }: TournamentBracketProps) => {
  const groupMatches = matches?.filter(m => m.round_name.toLowerCase().includes('group')) || [];
  const knockoutMatches = matches?.filter(m => !m.round_name.toLowerCase().includes('group')) || [];

  const groupMatchesByRound = groupMatches.reduce((acc, match) => {
    if (!acc[match.round_name]) acc[match.round_name] = [];
    acc[match.round_name].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const knockoutMatchesByRound = knockoutMatches.reduce((acc, match) => {
    if (!acc[match.round_name]) acc[match.round_name] = [];
    acc[match.round_name].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTeamName = (match: Match, teamNumber: 1 | 2) => {
    const player1 = teamNumber === 1 ? match.team1_player1 : match.team2_player1;
    const player2 = teamNumber === 1 ? match.team1_player2 : match.team2_player2;
    
    if (!player1) return "TBD";
    return player2 ? `${player1.full_name} & ${player2.full_name}` : player1.full_name;
  };

  const renderMatch = (match: Match) => (
    <div key={match.id} className="border rounded-lg p-3 bg-white">
      <div className="flex justify-between items-center mb-2">
        <Badge className={getStatusColor(match.status)} variant="secondary">
          {match.status}
        </Badge>
        {match.winner_team && (
          <Trophy className="h-4 w-4 text-yellow-500" />
        )}
      </div>
      
      <div className="space-y-2">
        <div className={`flex justify-between items-center p-2 rounded ${
          match.winner_team === 1 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
        }`}>
          <span className="text-sm font-medium">{getTeamName(match, 1)}</span>
          <span className="font-bold">{match.team1_sets_won || 0}</span>
        </div>
        
        <div className={`flex justify-between items-center p-2 rounded ${
          match.winner_team === 2 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
        }`}>
          <span className="text-sm font-medium">{getTeamName(match, 2)}</span>
          <span className="font-bold">{match.team2_sets_won || 0}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Group Stage */}
      {Object.keys(groupMatchesByRound).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Group Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(groupMatchesByRound).map(([roundName, roundMatches]) => (
                <div key={roundName}>
                  <h3 className="font-semibold text-lg mb-4 text-center">{roundName}</h3>
                  <div className="space-y-3">
                    {roundMatches.map(renderMatch)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Knockout Stage */}
      {Object.keys(knockoutMatchesByRound).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Knockout Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(knockoutMatchesByRound)
                .sort(([a], [b]) => {
                  const order = ['Quarter-Final', 'Semi-Final', 'Final'];
                  return order.indexOf(a) - order.indexOf(b);
                })
                .map(([roundName, roundMatches]) => (
                  <div key={roundName}>
                    <h3 className="font-semibold text-xl mb-4 text-center border-b pb-2">
                      {roundName}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {roundMatches.map(renderMatch)}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {matches?.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tournament structure yet</h3>
          <p className="text-gray-600">Matches will appear here once the tournament structure is generated.</p>
        </div>
      )}
    </div>
  );
};

export default TournamentBracket;
