
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, MapPin, DollarSign, User, Clock, Target } from "lucide-react";

interface TournamentOverviewProps {
  tournament: any;
  participants: any[] | undefined;
  matches: any[] | undefined;
}

const TournamentOverview = ({ tournament, participants, matches }: TournamentOverviewProps) => {
  if (!tournament) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading tournament...</h3>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalMatches = matches?.length || 0;
  const completedMatches = matches?.filter(m => m.status === 'completed').length || 0;
  const inProgressMatches = matches?.filter(m => m.status === 'in_progress').length || 0;
  const scheduledMatches = matches?.filter(m => m.status === 'scheduled').length || 0;

  const groupMatches = matches?.filter(m => m.round_name.toLowerCase().includes('group')) || [];
  const knockoutMatches = matches?.filter(m => !m.round_name.toLowerCase().includes('group')) || [];

  const completedParticipants = participants?.filter(p => p.payment_status === 'completed').length || 0;
  const pendingParticipants = participants?.filter(p => p.payment_status === 'pending').length || 0;
  const failedParticipants = participants?.filter(p => p.payment_status === 'failed').length || 0;

  const totalRevenue = completedParticipants * (tournament.entry_fee || 0);

  return (
    <div className="space-y-6">
      {/* Tournament Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{tournament.name}</CardTitle>
              <p className="text-gray-600 mb-4">{tournament.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {tournament.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(tournament.status)} variant="secondary">
              {tournament.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="text-2xl font-bold">{participants?.length || 0}</p>
                <p className="text-xs text-gray-500">of {tournament.max_participants} max</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Matches</p>
                <p className="text-2xl font-bold">{totalMatches}</p>
                <p className="text-xs text-gray-500">{completedMatches} completed</p>
              </div>
              <Trophy className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entry Fee</p>
                <p className="text-2xl font-bold">${tournament.entry_fee || 0}</p>
                <p className="text-xs text-gray-500">per participant</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prize Pool</p>
                <p className="text-2xl font-bold">${tournament.prize_pool || 0}</p>
                <p className="text-xs text-gray-500">total prizes</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration & Payment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Registration Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Registration Deadline:</span>
              <Badge variant="outline">
                {new Date(tournament.registration_deadline).toLocaleDateString()}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Paid Participants:</span>
                <Badge className="bg-green-100 text-green-800">{completedParticipants}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending Payment:</span>
                <Badge className="bg-yellow-100 text-yellow-800">{pendingParticipants}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Failed Payment:</span>
                <Badge className="bg-red-100 text-red-800">{failedParticipants}</Badge>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between items-center font-medium">
                <span>Total Revenue:</span>
                <span className="text-green-600">${totalRevenue}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Match Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Completed:</span>
                <Badge className="bg-green-100 text-green-800">{completedMatches}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">In Progress:</span>
                <Badge className="bg-yellow-100 text-yellow-800">{inProgressMatches}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Scheduled:</span>
                <Badge className="bg-blue-100 text-blue-800">{scheduledMatches}</Badge>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm">Group Stage:</span>
                <span className="text-sm font-medium">{groupMatches.length} matches</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Knockout Stage:</span>
                <span className="text-sm font-medium">{knockoutMatches.length} matches</span>
              </div>
            </div>

            {totalMatches > 0 && (
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center font-medium">
                  <span>Completion:</span>
                  <span className="text-blue-600">
                    {Math.round((completedMatches / totalMatches) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(completedMatches / totalMatches) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tournament Details */}
      <Card>
        <CardHeader>
          <CardTitle>Tournament Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Tournament ID:</span>
              <span className="ml-2 text-gray-600">{tournament.id}</span>
            </div>
            <div>
              <span className="font-medium">Created:</span>
              <span className="ml-2 text-gray-600">
                {new Date(tournament.created_at).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>
              <span className="ml-2 text-gray-600">
                {new Date(tournament.updated_at).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="font-medium">Organizer ID:</span>
              <span className="ml-2 text-gray-600">{tournament.organizer_id}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentOverview;
