
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

interface FeaturedTournamentProps {
  tournament: Tournament;
}

const FeaturedTournament = ({ tournament }: FeaturedTournamentProps) => {
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

  return (
    <section className="py-16 bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge className="bg-yellow-400 text-yellow-900 px-4 py-2 text-sm font-semibold mb-4">
            NEXT TOURNAMENT
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Don't Miss Out!</h2>
          <p className="text-gray-600">Register now for the upcoming tournament</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-2xl border-0 bg-white">
            <div className="md:flex">
              <div className="md:w-1/3">
                {tournament.image_url ? (
                  <img
                    src={tournament.image_url}
                    alt={tournament.name}
                    className="w-full h-64 md:h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-64 md:h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Trophy className="h-16 w-16 text-white" />
                  </div>
                )}
              </div>
              <div className="md:w-2/3 p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {tournament.name}
                    </h3>
                    <Badge className={`${getStatusColor(tournament.status)} border`}>
                      {tournament.status}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {tournament.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 mr-3 text-blue-500" />
                    <div>
                      <div className="font-medium">Start Date</div>
                      <div className="text-sm text-gray-500">
                        {new Date(tournament.start_date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-5 w-5 mr-3 text-blue-500" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-sm text-gray-500">{tournament.location}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Users className="h-5 w-5 mr-3 text-blue-500" />
                    <div>
                      <div className="font-medium">Participants</div>
                      <div className="text-sm text-gray-500">
                        {tournament.registrations?.[0]?.count || 0} / {tournament.max_participants}
                      </div>
                    </div>
                  </div>
                  
                  {tournament.prize_pool > 0 && (
                    <div className="flex items-center text-gray-700">
                      <Trophy className="h-5 w-5 mr-3 text-green-500" />
                      <div>
                        <div className="font-medium">Prize Pool</div>
                        <div className="text-sm text-green-600 font-semibold">
                          ${tournament.prize_pool}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/tournaments" className="flex-1">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-3">
                      <Trophy className="mr-2 h-4 w-4" />
                      Register Now
                    </Button>
                  </Link>
                  <Link to="/tournaments" className="flex-1">
                    <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTournament;
