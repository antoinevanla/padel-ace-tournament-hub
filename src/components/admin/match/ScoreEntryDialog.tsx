
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Match {
  id: string;
  team1_player1?: { full_name: string };
  team1_player2?: { full_name: string };
  team2_player1?: { full_name: string };
  team2_player2?: { full_name: string };
}

interface ScoreEntryDialogProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (matchId: string, scores: {
    team1_sets_won: number;
    team2_sets_won: number;
    team1_score: number;
    team2_score: number;
  }) => void;
}

const ScoreEntryDialog = ({ match, isOpen, onClose, onSave }: ScoreEntryDialogProps) => {
  const [scores, setScores] = useState({
    team1_sets_won: 0,
    team2_sets_won: 0,
    team1_score: 0,
    team2_score: 0
  });

  const handleSave = () => {
    if (match) {
      onSave(match.id, scores);
      onClose();
    }
  };

  const getTeamName = (teamNumber: 1 | 2) => {
    if (!match) return "";
    const player1 = teamNumber === 1 ? match.team1_player1 : match.team2_player1;
    const player2 = teamNumber === 1 ? match.team1_player2 : match.team2_player2;
    
    if (!player1) return "TBD";
    return player2 ? `${player1.full_name} & ${player2.full_name}` : player1.full_name;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Match Scores</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <h3 className="font-medium mb-2">{getTeamName(1)}</h3>
              <div className="space-y-2">
                <div>
                  <Label>Sets Won</Label>
                  <Input
                    type="number"
                    min="0"
                    max="3"
                    value={scores.team1_sets_won}
                    onChange={(e) => setScores({...scores, team1_sets_won: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label>Total Score</Label>
                  <Input
                    type="number"
                    min="0"
                    value={scores.team1_score}
                    onChange={(e) => setScores({...scores, team1_score: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="font-medium mb-2">{getTeamName(2)}</h3>
              <div className="space-y-2">
                <div>
                  <Label>Sets Won</Label>
                  <Input
                    type="number"
                    min="0"
                    max="3"
                    value={scores.team2_sets_won}
                    onChange={(e) => setScores({...scores, team2_sets_won: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label>Total Score</Label>
                  <Input
                    type="number"
                    min="0"
                    value={scores.team2_score}
                    onChange={(e) => setScores({...scores, team2_score: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save Scores</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScoreEntryDialog;
