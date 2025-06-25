
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Users, Camera, Target, Star, MapPin, DollarSign, ArrowRight, Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user } = useAuth();

  const { data: upcomingTournaments } = useQuery({
    queryKey: ["upcoming-tournaments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select(`
          *,
          organizer:profiles(full_name),
          registrations:tournament_registrations(count)
        `)
        .eq("status", "upcoming")
        .order("start_date", { ascending: true })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: recentResults } = useQuery({
    queryKey: ["recent-results"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(`
          *,
          tournament:tournaments(name, location),
          team1_player1:profiles!matches_team1_player1_id_fkey(full_name),
          team2_player1:profiles!matches_team2_player1_id_fkey(full_name)
        `)
        .eq("status", "completed")
        .order("updated_at", { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const nextTournament = upcomingTournaments?.[0];

  const features = [
    {
      icon: Calendar,
      title: "Tournament Management",
      description: "Create and manage professional padel tournaments",
      link: "/tournaments"
    },
    {
      icon: Users,
      title: "Player Community",
      description: "Connect with players and build your ranking",
      link: "/players"
    },
    {
      icon: Target,
      title: "Live Scoring",
      description: "Real-time match results and tournament progress",
      link: "/results"
    },
    {
      icon: Camera,
      title: "Tournament Gallery",
      description: "Capture and share your tournament memories",
      link: "/gallery"
    }
  ];

  const stats = [
    { label: "Active Tournaments", value: "12+", icon: Trophy },
    { label: "Registered Players", value: "250+", icon: Users },
    { label: "Matches Played", value: "800+", icon: Target },
    { label: "Communities", value: "15+", icon: Star }
  ];

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-yellow-400 p-4 rounded-full shadow-lg">
                <Trophy className="h-12 w-12 text-blue-900" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              The Ultimate
              <span className="text-yellow-400 block">Padel Tournament</span>
              Experience
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join competitive tournaments, track your progress, and connect with the global padel community. 
              From amateur to professional level - find your perfect match.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {user ? (
                <>
                  <Link to="/tournaments">
                    <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 font-semibold px-8 py-4 text-lg shadow-lg">
                      <Trophy className="mr-2 h-5 w-5" />
                      Browse Tournaments
                    </Button>
                  </Link>
                  <Link to="/players">
                    <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold px-8 py-4 text-lg">
                      Join Community
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 font-semibold px-8 py-4 text-lg shadow-lg">
                      <Play className="mr-2 h-5 w-5" />
                      Start Playing
                    </Button>
                  </Link>
                  <Link to="/tournaments">
                    <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold px-8 py-4 text-lg">
                      View Tournaments
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">{stat.value}</div>
                    <div className="text-sm text-blue-200 flex items-center justify-center">
                      <Icon className="h-4 w-4 mr-1" />
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Next Tournament */}
      {nextTournament && (
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
                    {nextTournament.image_url ? (
                      <img
                        src={nextTournament.image_url}
                        alt={nextTournament.name}
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
                          {nextTournament.name}
                        </h3>
                        <Badge className={`${getStatusColor(nextTournament.status)} border`}>
                          {nextTournament.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {nextTournament.description}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-5 w-5 mr-3 text-blue-500" />
                        <div>
                          <div className="font-medium">Start Date</div>
                          <div className="text-sm text-gray-500">
                            {new Date(nextTournament.start_date).toLocaleDateString('en-US', { 
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
                          <div className="text-sm text-gray-500">{nextTournament.location}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <Users className="h-5 w-5 mr-3 text-blue-500" />
                        <div>
                          <div className="font-medium">Participants</div>
                          <div className="text-sm text-gray-500">
                            {nextTournament.registrations?.[0]?.count || 0} / {nextTournament.max_participants}
                          </div>
                        </div>
                      </div>
                      
                      {nextTournament.prize_pool > 0 && (
                        <div className="flex items-center text-gray-700">
                          <Trophy className="h-5 w-5 mr-3 text-green-500" />
                          <div>
                            <div className="font-medium">Prize Pool</div>
                            <div className="text-sm text-green-600 font-semibold">
                              ${nextTournament.prize_pool}
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
      )}

      {/* Other Upcoming Tournaments */}
      {upcomingTournaments && upcomingTournaments.length > 1 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">More Upcoming Tournaments</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose from our selection of upcoming tournaments and find the perfect competition for your skill level.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {upcomingTournaments.slice(1).map((tournament) => (
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
      )}

      {/* Recent Results */}
      {recentResults && recentResults.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Results</h2>
              <p className="text-gray-600">Stay updated with the most recent match outcomes</p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-4">
              {recentResults.map((match) => (
                <Card key={match.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-2">
                          {match.tournament?.name} • {match.round_name}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className={`text-lg font-semibold ${match.winner_team === 1 ? 'text-green-600' : 'text-gray-900'}`}>
                            {match.team1_player1?.full_name}
                          </div>
                          <div className="text-2xl font-bold mx-4">
                            {match.team1_sets_won} - {match.team2_sets_won}
                          </div>
                          <div className={`text-lg font-semibold ${match.winner_team === 2 ? 'text-green-600' : 'text-gray-900'}`}>
                            {match.team2_player1?.full_name}
                          </div>
                        </div>
                      </div>
                      {match.winner_team && (
                        <div className="ml-4">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/results">
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold">
                  View All Results
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

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
              return (
                <div key={index} className="text-center">
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
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 group border-0 shadow-md">
                  <CardHeader className="text-center pb-4">
                    <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                      <Icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Link to={feature.link}>
                      <Button variant="outline" className="w-full hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600 transition-colors">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-8 w-8 text-blue-900" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Competing?</h2>
            <p className="text-blue-100 mb-8 text-lg leading-relaxed">
              {user 
                ? "Explore tournaments and connect with fellow padel enthusiasts in your area!"
                : "Join thousands of players and start your padel journey today."
              }
            </p>
            {user ? (
              <Link to="/tournaments">
                <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 font-semibold px-8 py-4 text-lg shadow-lg">
                  <Trophy className="mr-2 h-5 w-5" />
                  Explore Tournaments
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 font-semibold px-8 py-4 text-lg shadow-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Join PadelPro
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
