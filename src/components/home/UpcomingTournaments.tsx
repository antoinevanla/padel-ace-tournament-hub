
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Users, MapPin, ArrowRight } from "lucide-react";

interface Tournament {
  id: string;
  name: string;
  description: string;
  start_date: string;
  location: string;
  status: string;
  max_participants: number;
  prize_pool: number;
  image_url?: string;
  registrations?: Array<{ count: number }>;
}

interface UpcomingTournamentsProps {
  tournaments: Tournament[];
}

const UpcomingTournaments = ({ tournaments }: UpcomingTournamentsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  if (!tournaments || tournaments.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">More Upcoming Tournaments</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our selection of upcoming tournaments and find the perfect competition for your skill level.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {tournaments.map((tournament) => (
            <Card key={tournament.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
              <CardHeader>
                {tournament.image_url && (
                  <img
                    src={tournament.image_url}
                    alt={tournament.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{tournament.name}</CardTitle>
                  <Badge className={getStatusColor(tournament.status)}>
                    {tournament.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">{tournament.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  {new Date(tournament.start_date).toLocaleDateString()}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                  {tournament.location}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-blue-500" />
                    {tournament.registrations?.[0]?.count || 0} / {tournament.max_participants}
                  </span>
                  
                  {tournament.prize_pool > 0 && (
                    <span className="flex items-center text-green-600 font-medium">
                      <Trophy className="h-4 w-4 mr-1" />
                      ${tournament.prize_pool}
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <Link to="/tournaments">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/tournaments">
            <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold">
              View All Tournaments
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingTournaments;
