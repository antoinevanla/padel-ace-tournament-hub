
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Target, Star, Play, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Active Tournaments", value: "12+", icon: Trophy },
    { label: "Registered Players", value: "250+", icon: Users },
    { label: "Matches Played", value: "800+", icon: Target },
    { label: "Communities", value: "15+", icon: Star }
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="absolute inset-0 opacity-50">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
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
  );
};

export default HeroSection;
