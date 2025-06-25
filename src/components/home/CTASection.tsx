
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const CTASection = () => {
  const { user } = useAuth();

  return (
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
  );
};

export default CTASection;
