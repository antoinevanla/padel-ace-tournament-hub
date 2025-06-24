import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Users, Camera, Target, Star, MapPin, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
const Index = () => {
  const {
    user
  } = useAuth();
  const {
    data: upcomingTournaments
  } = useQuery({
    queryKey: ["upcoming-tournaments"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("tournaments").select(`
          *,
          organizer:profiles(full_name),
          registrations:tournament_registrations(count)
        `).eq("status", "upcoming").order("start_date", {
        ascending: true
      }).limit(3);
      if (error) throw error;
      return data;
    }
  });
  const features = [{
    icon: Calendar,
    title: "Tournament Management",
    description: "Create and manage padel tournaments with ease",
    link: "/tournaments"
  }, {
    icon: Users,
    title: "Player Profiles",
    description: "Connect with other players and build your profile",
    link: "/players"
  }, {
    icon: Target,
    title: "Live Results",
    description: "Follow match results and tournament progress in real-time",
    link: "/results"
  }, {
    icon: Camera,
    title: "Media Gallery",
    description: "Share photos and memories from your tournaments",
    link: "/gallery"
  }];
  const stats = [{
    label: "Active Tournaments",
    value: "24",
    icon: Trophy
  }, {
    label: "Registered Players",
    value: "150+",
    icon: Users
  }, {
    label: "Matches Played",
    value: "500+",
    icon: Target
  }, {
    label: "Photo Uploads",
    value: "1000+",
    icon: Camera
  }];
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
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Trophy className="h-16 w-16 text-yellow-400" />
            </div>
            <h1 className="text-5xl font-bold mb-6">Join the Padel entre copains</h1>
            <p className="text-xl mb-8 text-blue-100">
              Compete in exciting tournaments, track your progress, and connect with the global padel community. 
              From amateur to professional level - find your perfect competition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? <>
                  <Link to="/tournaments">
                    <Button size="lg" variant="secondary" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300">
                      <Trophy className="mr-2 h-5 w-5" />
                      Browse Tournaments
                    </Button>
                  </Link>
                  <Link to="/players">
                    <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                      Meet Players
                    </Button>
                  </Link>
                </> : <>
                  <Link to="/auth">
                    <Button size="lg" variant="secondary" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300">
                      <Trophy className="mr-2 h-5 w-5" />
                      Join Now
                    </Button>
                  </Link>
                  <Link to="/tournaments">
                    <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                      View Tournaments
                    </Button>
                  </Link>
                </>}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Tournaments */}
      {upcomingTournaments && upcomingTournaments.length > 0 && <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Tournaments</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Don't miss out on these exciting tournaments. Register now and compete with players from around the world.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTournaments.map(tournament => <Card key={tournament.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                  <CardHeader>
                    {tournament.image_url && <img src={tournament.image_url} alt={tournament.name} className="w-full h-40 object-cover rounded-lg mb-4" />}
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

                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-blue-500" />
                      {tournament.registrations?.[0]?.count || 0} / {tournament.max_participants} players
                    </div>

                    {tournament.prize_pool > 0 && <div className="flex items-center text-sm text-green-600 font-medium">
                        <Trophy className="h-4 w-4 mr-2" />
                        Prize: ${tournament.prize_pool}
                      </div>}

                    <div className="pt-2">
                      <Link to="/tournaments">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>)}
            </div>

            <div className="text-center mt-8">
              <Link to="/tournaments">
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  View All Tournaments
                </Button>
              </Link>
            </div>
          </div>
        </section>}

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Growing Community</h2>
            <p className="text-gray-600">Be part of the fastest-growing padel tournament platform</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
            const Icon = stat.icon;
            return <div key={index} className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>;
          })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Compete</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              PadelPro provides all the tools you need to organize tournaments, connect with players, 
              and grow the padel community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
            const Icon = feature.icon;
            return <Card key={index} className="hover:shadow-lg transition-shadow group">
                  <CardHeader className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                      <Icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={feature.link}>
                      <Button variant="outline" className="w-full hover:bg-blue-50 hover:border-blue-600">
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Ready to Start Competing?</h2>
            <p className="text-blue-100 mb-8">
              {user ? "Start exploring tournaments and connecting with fellow padel enthusiasts today!" : "Sign up today and start your padel journey with players from around the world."}
            </p>
            {user ? <Link to="/tournaments">
                <Button size="lg" variant="secondary" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300">
                  <Trophy className="mr-2 h-5 w-5" />
                  Explore Tournaments
                </Button>
              </Link> : <Link to="/auth">
                <Button size="lg" variant="secondary" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300">
                  <Trophy className="mr-2 h-5 w-5" />
                  Sign Up Now
                </Button>
              </Link>}
          </div>
        </div>
      </section>
    </div>;
};
export default Index;