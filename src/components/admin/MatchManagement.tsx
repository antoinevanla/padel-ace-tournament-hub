import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, Users, Settings, Trophy, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MatchManagementProps {
  tournamentId: string;
}

interface Match {
  id: string;
  round_name: string;
  scheduled_time: string | null;
  court_number: number | null;
  status: string;
  team1_sets_won: number | null;
  team2_sets_won: number | null;
  team1_score: number | null;
  team2_score: number | null;
  winner_team: number | null;
  team1_player1: { full_name: string } | null;
  team1_player2: { full_name: string } | null;
  team2_player1: { full_name: string } | null;
  team2_player2: { full_name: string } | null;
}

const MatchManagement = ({ tournamentId }: MatchManagementProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [scoringMatch, setScoringMatch] = useState<Match | null>(null);
  const [bulkScheduleData, setBulkScheduleData] = useState({
    courts: 4,
    matchDuration: 90,
    startTime: "09:00",
    endTime: "18:00",
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
      return data as Match[];
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
      toast({ title: "Match updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["tournament-matches"] });
      setEditingMatch(null);
      setScoringMatch(null);
    },
    onError: (error) => {
      toast({ 
        title: "Failed to update match", 
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
      toast({ title: "Match deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ["tournament-matches"] });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to delete match", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const bulkScheduleMutation = useMutation({
    mutationFn: async (scheduleData: typeof bulkScheduleData) => {
      if (!matches) return;
      
      const updates = generateBulkSchedule(matches, scheduleData);
      
      for (const update of updates) {
        const { error } = await supabase
          .from("matches")
          .update({
            scheduled_time: update.scheduled_time,
            court_number: update.court_number,
          })
          .eq("id", update.id);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: "Bulk scheduling completed!" });
      queryClient.invalidateQueries({ queryKey: ["tournament-matches"] });
    },
    onError: (error) => {
      toast({ 
        title: "Bulk scheduling failed", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const generateBulkSchedule = (matches: Match[], scheduleData: typeof bulkScheduleData) => {
    const updates = [];
    const startTime = new Date();
    const [startHour, startMinute] = scheduleData.startTime.split(':').map(Number);
    startTime.setHours(startHour, startMinute, 0, 0);
    
    let currentTime = new Date(startTime);
    let currentCourt = 1;
    
    for (const match of matches) {
      updates.push({
        id: match.id,
        scheduled_time: new Date(currentTime).toISOString(),
        court_number: currentCourt,
      });
      
      // Move to next court or next time slot
      currentCourt++;
      if (currentCourt > scheduleData.courts) {
        currentCourt = 1;
        currentTime.setMinutes(currentTime.getMinutes() + scheduleData.matchDuration);
      }
    }
    
    return updates;
  };

  const groupMatchesByRound = (matches: Match[]) => {
    return matches.reduce((groups, match) => {
      const round = match.round_name || "Unassigned";
      if (!groups[round]) groups[round] = [];
      groups[round].push(match);
      return groups;
    }, {} as Record<string, Match[]>);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleScoreSubmit = (match: Match, team1Sets: number, team2Sets: number, team1Score: number, team2Score: number) => {
    const winnerTeam = team1Sets > team2Sets ? 1 : 2;
    const status = "completed";

    updateMatchMutation.mutate({
      matchId: match.id,
      updates: {
        team1_sets_won: team1Sets,
        team2_sets_won: team2Sets,
        team1_score: team1Score,
        team2_score: team2Score,
        winner_team: winnerTeam,
        status: status,
      }
    });
  };

  if (isLoading) return <div>Loading matches...</div>;

  const groupedMatches = matches ? groupMatchesByRound(matches) : {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Match Management</h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Bulk Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bulk Schedule Matches</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courts">Number of Courts</Label>
                  <Input
                    id="courts"
                    type="number"
                    value={bulkScheduleData.courts}
                    onChange={(e) => setBulkScheduleData(prev => ({
                      ...prev,
                      courts: parseInt(e.target.value)
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Match Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={bulkScheduleData.matchDuration}
                    onChange={(e) => setBulkScheduleData(prev => ({
                      ...prev,
                      matchDuration: parseInt(e.target.value)
                    }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={bulkScheduleData.startTime}
                    onChange={(e) => setBulkScheduleData(prev => ({
                      ...prev,
                      startTime: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={bulkScheduleData.endTime}
                    onChange={(e) => setBulkScheduleData(prev => ({
                      ...prev,
                      endTime: e.target.value
                    }))}
                  />
                </div>
              </div>
              <Button 
                onClick={() => bulkScheduleMutation.mutate(bulkScheduleData)}
                disabled={bulkScheduleMutation.isPending}
                className="w-full"
              >
                Generate Schedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {Object.entries(groupedMatches).map(([round, roundMatches]) => (
        <Card key={round}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              {round} ({roundMatches.length} matches)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roundMatches.map((match) => (
                <div key={match.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">
                          {match.team1_player1?.full_name}
                          {match.team1_player2 && ` & ${match.team1_player2.full_name}`}
                        </span>
                        <span className="mx-4 text-gray-400">VS</span>
                        <span className="font-medium">
                          {match.team2_player1?.full_name}
                          {match.team2_player2 && ` & ${match.team2_player2.full_name}`}
                        </span>
                      </div>
                      
                      {match.status === "completed" && (
                        <div className="text-center">
                          <div className="text-lg font-bold mb-1">
                            {match.team1_sets_won} - {match.team2_sets_won} (sets)
                          </div>
                          <div className="text-sm text-gray-600">
                            Score: {match.team1_score} - {match.team2_score}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Badge className={getStatusColor(match.status)}>
                      {match.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {match.scheduled_time 
                        ? new Date(match.scheduled_time).toLocaleString()
                        : "Not scheduled"
                      }
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Court {match.court_number || "TBD"}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingMatch(match)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    
                    {match.status !== "completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setScoringMatch(match)}
                      >
                        <Trophy className="h-4 w-4 mr-1" />
                        Add Score
                      </Button>
                    )}

                    {match.status === "completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setScoringMatch(match)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Score
                      </Button>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Match</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this match? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMatchMutation.mutate(match.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Edit Match Dialog */}
      {editingMatch && (
        <Dialog open={!!editingMatch} onOpenChange={() => setEditingMatch(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Match</DialogTitle>
            </DialogHeader>
            <MatchEditForm 
              match={editingMatch}
              onSubmit={(updates) => updateMatchMutation.mutate({
                matchId: editingMatch.id,
                updates
              })}
              onCancel={() => setEditingMatch(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Score Entry Dialog */}
      {scoringMatch && (
        <Dialog open={!!scoringMatch} onOpenChange={() => setScoringMatch(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{scoringMatch.status === 'completed' ? 'Edit' : 'Add'} Match Score</DialogTitle>
            </DialogHeader>
            <MatchScoreForm 
              match={scoringMatch}
              onSubmit={handleScoreSubmit}
              onCancel={() => setScoringMatch(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Separate component for comprehensive match editing
const MatchEditForm = ({ match, onSubmit, onCancel }: {
  match: Match;
  onSubmit: (updates: any) => void;
  onCancel: () => void;
}) => {
  const [scheduledTime, setScheduledTime] = useState(
    match.scheduled_time ? new Date(match.scheduled_time).toISOString().slice(0, 16) : ""
  );
  const [courtNumber, setCourtNumber] = useState(match.court_number?.toString() || "");
  const [status, setStatus] = useState(match.status);

  const handleSubmit = () => {
    onSubmit({
      scheduled_time: scheduledTime || null,
      court_number: courtNumber ? parseInt(courtNumber) : null,
      status: status,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="scheduledTime">Scheduled Time</Label>
        <Input
          id="scheduledTime"
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="courtNumber">Court Number</Label>
        <Input
          id="courtNumber"
          type="number"
          value={courtNumber}
          onChange={(e) => setCourtNumber(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSubmit} className="flex-1">
          Update Match
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

// Separate component for score entry
const MatchScoreForm = ({ match, onSubmit, onCancel }: {
  match: Match;
  onSubmit: (match: Match, team1Sets: number, team2Sets: number, team1Score: number, team2Score: number) => void;
  onCancel: () => void;
}) => {
  const [team1Sets, setTeam1Sets] = useState(match.team1_sets_won || 0);
  const [team2Sets, setTeam2Sets] = useState(match.team2_sets_won || 0);
  const [team1Score, setTeam1Score] = useState(match.team1_score || 0);
  const [team2Score, setTeam2Score] = useState(match.team2_score || 0);

  const handleSubmit = () => {
    onSubmit(match, team1Sets, team2Sets, team1Score, team2Score);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="font-medium">
          {match.team1_player1?.full_name}
          {match.team1_player2 && ` & ${match.team1_player2.full_name}`}
        </div>
        <div className="text-gray-400 my-2">VS</div>
        <div className="font-medium">
          {match.team2_player1?.full_name}
          {match.team2_player2 && ` & ${match.team2_player2.full_name}`}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Team 1 Sets Won</Label>
          <Input
            type="number"
            min="0"
            max="3"
            value={team1Sets}
            onChange={(e) => setTeam1Sets(parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label>Team 2 Sets Won</Label>
          <Input
            type="number"
            min="0"
            max="3"
            value={team2Sets}
            onChange={(e) => setTeam2Sets(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Team 1 Total Score</Label>
          <Input
            type="number"
            min="0"
            value={team1Score}
            onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label>Team 2 Total Score</Label>
          <Input
            type="number"
            min="0"
            value={team2Score}
            onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSubmit} className="flex-1">
          Save Score
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default MatchManagement;
