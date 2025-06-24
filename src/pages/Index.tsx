
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Calendar, Users, Camera, Target, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Calendar,
      title: "Tournament Management",
      description: "Create and manage padel tournaments with ease",
      link: "/tournaments"
    },
    {
      icon: Users,
      title: "Player Profiles",
      description: "Connect with other players and build your profile",
      link: "/players"
    },
    {
      icon: Target,
      title: "Live Results",
      description: "Follow match results and tournament progress in real-time",
      link: "/results"
    },
    {
      icon: Camera,
      title: "Media Gallery",
      description: "Share photos and memories from your tournaments",
      link: "/gallery"
    }
  ];

  const stats = [
    { label: "Active Tournaments", value: "24", icon: Trophy },
    { label: "Registered Players", value: "150+", icon: Users },
    { label: "Matches Played", value: "500+", icon: Target },
    { label: "Photo Uploads", value: "1000+", icon: Camera }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to PadelPro
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              The ultimate platform for organizing and participating in padel tournaments. 
              Connect with players, compete in events, and track your progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link to="/tournaments">
                    <Button size="lg" variant="secondary">
                      Browse Tournaments
                    </Button>
                  </Link>
                  <Link to="/players">
                    <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                      Meet Players
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button size="lg" variant="secondary">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/tournaments">
                    <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                      View Tournaments
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              PadelPro provides all the tools you need to organize tournaments, connect with players, 
              and grow the padel community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={feature.link}>
                      <Button variant="outline" className="w-full">
                        Learn More
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
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Join the Community?</h2>
            <p className="text-blue-100 mb-8">
              {user 
                ? "Start exploring tournaments and connecting with fellow padel enthusiasts today!"
                : "Sign up today and start your padel journey with players from around the world."
              }
            </p>
            {user ? (
              <Link to="/tournaments">
                <Button size="lg" variant="secondary">
                  Explore Tournaments
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" variant="secondary">
                  Sign Up Now
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
