
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Save, X, Trash2 } from "lucide-react";

interface Match {
  id: string;
  round_name: string;
  status: string;
  team1_sets_won: number | null;
  team2_sets_won: number | null;
  team1_score: number | null;
  team2_score: number | null;
  winner_team: number | null;
  scheduled_time: string | null;
  court_number: number | null;
  team1_player1?: { full_name: string };
  team1_player2?: { full_name: string };
  team2_player1?: { full_name: string };
  team2_player2?: { full_name: string };
}

interface MatchCardProps {
  match: Match;
  editingMatch: string | null;
  editForm: {
    scheduled_time: string;
    court_number: string;
    status: string;
    team1_sets_won: string;
    team2_sets_won: string;
    team1_score: string;
    team2_score: string;
  };
  onStartEdit: (match: Match) => void;
  onCancelEdit: () => void;
  onSaveEdit: (matchId: string) => void;
  onDelete: (matchId: string) => void;
  onFormChange: (field: string, value: string) => void;
}

const MatchCard = ({
  match,
  editingMatch,
  editForm,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onFormChange,
}: MatchCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTeamName = (teamNumber: 1 | 2) => {
    const player1 = teamNumber === 1 ? match.team1_player1 : match.team2_player1;
    const player2 = teamNumber === 1 ? match.team1_player2 : match.team2_player2;
    
    if (!player1) return "TBD";
    return player2 ? `${player1.full_name} & ${player2.full_name}` : player1.full_name;
  };

  const isEditing = editingMatch === match.id;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(match.status)} variant="secondary">
              {match.status}
            </Badge>
            {match.court_number && (
              <Badge variant="outline">Court {match.court_number}</Badge>
            )}
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStartEdit(match)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(match.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={() => onSaveEdit(match.id)}
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onCancelEdit}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Scheduled Time</label>
                <Input
                  type="datetime-local"
                  value={editForm.scheduled_time}
                  onChange={(e) => onFormChange('scheduled_time', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Court Number</label>
                <Input
                  type="number"
                  value={editForm.court_number}
                  onChange={(e) => onFormChange('court_number', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={editForm.status} onValueChange={(value) => onFormChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Team 1 Sets Won</label>
                <Input
                  type="number"
                  min="0"
                  value={editForm.team1_sets_won}
                  onChange={(e) => onFormChange('team1_sets_won', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Team 2 Sets Won</label>
                <Input
                  type="number"
                  min="0"
                  value={editForm.team2_sets_won}
                  onChange={(e) => onFormChange('team2_sets_won', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Team 1 Score</label>
                <Input
                  type="number"
                  min="0"
                  value={editForm.team1_score}
                  onChange={(e) => onFormChange('team1_score', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Team 2 Score</label>
                <Input
                  type="number"
                  min="0"
                  value={editForm.team2_score}
                  onChange={(e) => onFormChange('team2_score', e.target.value)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <p className="font-medium">{getTeamName(1)}</p>
                {match.status === "completed" && (
                  <div className="flex items-center justify-center space-x-2 mt-1">
                    <span className="text-lg font-bold">{match.team1_sets_won || 0}</span>
                    <span className="text-sm text-gray-500">({match.team1_score || 0})</span>
                  </div>
                )}
              </div>
              <span className="text-gray-400 mx-4">VS</span>
              <div className="text-center flex-1">
                <p className="font-medium">{getTeamName(2)}</p>
                {match.status === "completed" && (
                  <div className="flex items-center justify-center space-x-2 mt-1">
                    <span className="text-lg font-bold">{match.team2_sets_won || 0}</span>
                    <span className="text-sm text-gray-500">({match.team2_score || 0})</span>
                  </div>
                )}
              </div>
            </div>

            {match.scheduled_time && (
              <div className="text-center text-sm text-gray-600">
                {new Date(match.scheduled_time).toLocaleString()}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchCard;
