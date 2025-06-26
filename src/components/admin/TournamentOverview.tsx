
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, DollarSign, Trophy, MapPin, Clock, Target } from "lucide-react";

interface TournamentOverviewProps {
  tournament: any;
  participants: any[] | undefined;
  matches: any[] | undefined;
}

const TournamentOverview = ({ tournament, participants, matches }: TournamentOverviewProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const completedMatches = matches?.filter(m => m.status === "completed").length || 0;
  const totalMatches = matches?.length || 0;
  const matchesRemaining = totalMatches - completedMatches;

  const qualifiedTeams = matches?.filter(m => m.winner_team !== null).length || 0;
  const eliminatedTeams = participants ? Math.max(0, participants.length - qualifiedTeams) : 0;

  return (
    <div className="space-y-6">
      {/* Tournament Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Tournament Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              <Badge className={getStatusColor(tournament.status)} variant="secondary">
                {tournament.status}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Location:
              </span>
              <span className="text-gray-600">{tournament.location}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Duration:
              </span>
              <span className="text-gray-600">
                {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Registration Deadline:
              </span>
              <span className="text-gray-600">
                {new Date(tournament.registration_deadline).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Participants:
              </span>
              <span className="text-gray-600">
                {participants?.length || 0} / {tournament.max_participants}
              </span>
            </div>

            {tournament.entry_fee > 0 && (
              <div className="flex items-center justify-between">
                <span className="font-medium flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Entry Fee:
                </span>
                <span className="text-gray-600">${tournament.entry_fee}</span>
              </div>
            )}

            {tournament.prize_pool > 0 && (
              <div className="flex items-center justify-between">
                <span className="font-medium flex items-center">
                  <Trophy className="h-4 w-4 mr-1" />
                  Prize Pool:
                </span>
                <span className="text-green-600 font-semibold">${tournament.prize_pool}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="font-medium flex items-center">
                <Target className="h-4 w-4 mr-1" />
                Max Participants:
              </span>
              <span className="text-gray-600">{tournament.max_participants}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tournament Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{participants?.length || 0}</div>
            <div className="text-sm text-gray-600">Total Participants</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedMatches}</div>
            <div className="text-sm text-gray-600">Matches Completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{matchesRemaining}</div>
            <div className="text-sm text-gray-600">Matches Remaining</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{qualifiedTeams}</div>
            <div className="text-sm text-gray-600">Teams Advanced</div>
          </CardContent>
        </Card>
      </div>

      {/* Tournament Description */}
      {tournament.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{tournament.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Payment Status Summary */}
      {participants && participants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {participants.filter(p => p.payment_status === "completed").length}
                </div>
                <div className="text-sm text-gray-600">Paid</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-yellow-600">
                  {participants.filter(p => p.payment_status === "pending").length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-red-600">
                  {participants.filter(p => p.payment_status === "failed").length}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TournamentOverview;
