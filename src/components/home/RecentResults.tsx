
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, ArrowRight } from "lucide-react";

interface Match {
  id: string;
  round_name: string;
  team1_sets_won: number;
  team2_sets_won: number;
  winner_team?: number;
  tournament?: {
    name: string;
  };
  team1_player1?: {
    full_name: string;
  };
  team2_player1?: {
    full_name: string;
  };
}

interface RecentResultsProps {
  matches: Match[];
}

const RecentResults = ({ matches }: RecentResultsProps) => {
  if (!matches || matches.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Results</h2>
          <p className="text-gray-600">Stay updated with the most recent match outcomes</p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {matches.map((match) => (
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
  );
};

export default RecentResults;
