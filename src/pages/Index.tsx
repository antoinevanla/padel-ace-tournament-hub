
import { Calendar, MapPin, Users, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const featuredTournaments = [
    {
      id: 1,
      name: "Madrid Open Padel Championship",
      date: "2024-07-15",
      location: "Madrid, Spain",
      participants: 64,
      prize: "€50,000",
      status: "Registration Open",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Barcelona Masters",
      date: "2024-08-22",
      location: "Barcelona, Spain",
      participants: 32,
      prize: "€25,000",
      status: "Coming Soon",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Valencia Cup",
      date: "2024-09-10",
      location: "Valencia, Spain",
      participants: 48,
      prize: "€35,000",
      status: "Registration Open",
      image: "/placeholder.svg"
    }
  ];

  const stats = [
    { label: "Active Tournaments", value: "24", icon: Trophy },
    { label: "Registered Players", value: "1,247", icon: Users },
    { label: "Matches Played", value: "3,892", icon: Calendar },
    { label: "Prize Money", value: "€285K", icon: Trophy }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Professional Padel Tournaments
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-fade-in">
              Join the most exciting padel competitions worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Calendar className="mr-2 h-5 w-5" />
                View Tournaments
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Users className="mr-2 h-5 w-5" />
                Register Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center animate-fade-in">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Tournaments
            </h2>
            <p className="text-xl text-gray-600">
              Don't miss these exciting upcoming competitions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredTournaments.map((tournament) => (
              <Card key={tournament.id} className="hover:shadow-lg transition-shadow duration-300 animate-fade-in">
                <div className="aspect-video bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-lg flex items-center justify-center">
                  <Trophy className="h-16 w-16 text-white" />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{tournament.name}</CardTitle>
                    <Badge 
                      variant={tournament.status === "Registration Open" ? "default" : "secondary"}
                      className={tournament.status === "Registration Open" ? "bg-green-500" : ""}
                    >
                      {tournament.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(tournament.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{tournament.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{tournament.participants} participants</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Trophy className="h-4 w-4 mr-2" />
                      <span className="font-semibold text-blue-600">{tournament.prize} prize pool</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/tournaments">
              <Button size="lg">
                View All Tournaments
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Compete?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of players in the most exciting padel tournaments
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Users className="mr-2 h-5 w-5" />
            Create Player Profile
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
