
import { useState } from "react";
import { Trophy, Calendar, Users, Filter, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Results = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const recentResults = [
    {
      id: 1,
      tournament: "Madrid Open Padel Championship",
      date: "2024-06-15",
      category: "Professional",
      winner: "Carlos Rodriguez / Maria Lopez",
      runnerUp: "Juan Martinez / Ana Garcia",
      score: "6-4, 7-5",
      prize: "€25,000",
      participants: 64
    },
    {
      id: 2,
      tournament: "Barcelona Amateur Cup",
      date: "2024-06-08",
      category: "Amateur",
      winner: "Diego Silva / Carmen Torres",
      runnerUp: "Luis Fernandez / Sofia Morales",
      score: "6-3, 4-6, 6-2",
      prize: "€2,500",
      participants: 32
    },
    {
      id: 3,
      tournament: "Valencia Masters",
      date: "2024-05-28",
      category: "Professional",
      winner: "Roberto Sanchez / Elena Ruiz",
      runnerUp: "Miguel Herrera / Paula Jimenez",
      score: "7-6, 6-4",
      prize: "€15,000",
      participants: 48
    }
  ];

  const liveMatches = [
    {
      id: 1,
      tournament: "Sevilla Open",
      match: "Semifinal 1",
      team1: "Alex Martin / Laura Vega",
      team2: "David Gil / Cristina Ramos",
      score: "6-4, 3-2",
      status: "Live"
    },
    {
      id: 2,
      tournament: "Sevilla Open",
      match: "Semifinal 2",
      team1: "Pedro Alvarez / Nina Castro",
      team2: "Oscar Delgado / Sara Mendez",
      score: "5-6, 2-1",
      status: "Live"
    }
  ];

  const rankings = [
    { rank: 1, player: "Carlos Rodriguez", points: 2850, tournaments: 12 },
    { rank: 2, player: "Juan Martinez", points: 2720, tournaments: 15 },
    { rank: 3, player: "Roberto Sanchez", points: 2680, tournaments: 11 },
    { rank: 4, player: "Miguel Herrera", points: 2590, tournaments: 14 },
    { rank: 5, player: "Diego Silva", points: 2520, tournaments: 13 }
  ];

  const filteredResults = recentResults.filter(result => {
    const matchesSearch = result.tournament.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.winner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || result.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tournament Results
          </h1>
          <p className="text-xl text-gray-600">
            Live matches, recent results, and player rankings
          </p>
        </div>

        {/* Live Matches */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            Live Matches
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {liveMatches.map((match) => (
              <Card key={match.id} className="border-l-4 border-l-red-500">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{match.tournament}</CardTitle>
                    <Badge className="bg-red-500 animate-pulse">LIVE</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{match.match}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{match.team1}</span>
                      <span className="text-lg font-bold text-blue-600">{match.score.split(', ')[0]}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{match.team2}</span>
                      <span className="text-lg font-bold text-blue-600">{match.score.split(', ')[1]}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tournaments or players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="amateur">Amateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Results */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Results</h2>
            <div className="space-y-4">
              {filteredResults.map((result) => (
                <Card key={result.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{result.tournament}</CardTitle>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="text-sm">{new Date(result.date).toLocaleDateString()}</span>
                          <Users className="h-4 w-4 ml-4 mr-1" />
                          <span className="text-sm">{result.participants} players</span>
                        </div>
                      </div>
                      <Badge variant="outline">{result.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center">
                          <Trophy className="h-5 w-5 text-yellow-600 mr-2" />
                          <div>
                            <span className="font-semibold text-gray-900">Champion:</span>
                            <p className="text-sm text-gray-600">{result.winner}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-blue-600">{result.score}</div>
                          <div className="text-sm text-gray-600">{result.prize}</div>
                        </div>
                      </div>
                      <div className="pl-7">
                        <span className="font-semibold text-gray-900">Runner-up:</span>
                        <p className="text-sm text-gray-600">{result.runnerUp}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Rankings */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Player Rankings</h2>
            <Card>
              <CardHeader>
                <CardTitle>Top Players</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankings.map((player) => (
                      <TableRow key={player.rank}>
                        <TableCell className="font-medium">
                          {player.rank <= 3 ? (
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                              player.rank === 1 ? 'bg-yellow-500' :
                              player.rank === 2 ? 'bg-gray-400' :
                              'bg-orange-600'
                            }`}>
                              {player.rank}
                            </div>
                          ) : (
                            player.rank
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{player.player}</div>
                            <div className="text-sm text-gray-600">{player.tournaments} tournaments</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {player.points.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
