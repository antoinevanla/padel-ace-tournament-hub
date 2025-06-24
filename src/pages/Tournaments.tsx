
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Trophy, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Tournaments = () => {
  const { user } = useAuth();

  const { data: tournaments, isLoading } = useQuery({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select(`
          *,
          organizer:profiles(full_name),
          registrations:tournament_registrations(count)
        `)
        .order("start_date", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading tournaments...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tournaments</h1>
          <p className="text-gray-600">Join exciting padel tournaments and compete with players from around the world</p>
        </div>
        {user && (
          <Button>
            Create Tournament
          </Button>
        )}
      </div>

      {!user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            <Link to="/auth" className="font-medium hover:underline">
              Sign in
            </Link>
            {" "}to register for tournaments and create your own events.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments?.map((tournament) => (
          <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              {tournament.image_url && (
                <img
                  src={tournament.image_url}
                  alt={tournament.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{tournament.name}</CardTitle>
                <Badge className={getStatusColor(tournament.status)}>
                  {tournament.status}
                </Badge>
              </div>
              <CardDescription>{tournament.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {tournament.location}
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                {tournament.registrations?.[0]?.count || 0} / {tournament.max_participants} participants
              </div>

              {tournament.entry_fee > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Entry fee: ${tournament.entry_fee}
                </div>
              )}

              {tournament.prize_pool > 0 && (
                <div className="flex items-center text-sm text-green-600">
                  <Trophy className="h-4 w-4 mr-2" />
                  Prize pool: ${tournament.prize_pool}
                </div>
              )}

              <div className="pt-4">
                {tournament.status === "upcoming" && user ? (
                  <Button className="w-full">
                    Register Now
                  </Button>
                ) : tournament.status === "upcoming" ? (
                  <Link to="/auth">
                    <Button variant="outline" className="w-full">
                      Sign in to Register
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!tournaments || tournaments.length === 0) && (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tournaments yet</h3>
          <p className="text-gray-600">Be the first to create a tournament!</p>
        </div>
      )}
    </div>
  );
};

export default Tournaments;
