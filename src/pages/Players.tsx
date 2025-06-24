
import { useState } from "react";
import { Search, Filter, MapPin, Trophy, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Players = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const players = [
    {
      id: 1,
      name: "Carlos Rodriguez",
      country: "Spain",
      city: "Madrid",
      level: "Advanced",
      rank: 1,
      points: 2850,
      tournaments: 12,
      wins: 45,
      losses: 8,
      avatar: "/placeholder.svg",
      joinDate: "2023-01-15",
      specialties: ["Power shots", "Net play"],
      achievements: ["Madrid Open Champion 2024", "Top 3 Player 2023"]
    },
    {
      id: 2,
      name: "Maria Lopez",
      country: "Spain",
      city: "Barcelona",
      level: "Advanced",
      rank: 2,
      points: 2720,
      tournaments: 15,
      wins: 42,
      losses: 12,
      avatar: "/placeholder.svg",
      joinDate: "2022-11-08",
      specialties: ["Strategy", "Consistency"],
      achievements: ["Barcelona Masters Winner", "Regional Champion"]
    },
    {
      id: 3,
      name: "Juan Martinez",
      country: "Spain",
      city: "Valencia",
      level: "Advanced",
      rank: 3,
      points: 2680,
      tournaments: 11,
      wins: 38,
      losses: 9,
      avatar: "/placeholder.svg",
      joinDate: "2023-03-22",
      specialties: ["Defensive play", "Endurance"],
      achievements: ["Valencia Cup Finalist", "Rising Star 2023"]
    },
    {
      id: 4,
      name: "Ana Garcia",
      country: "Spain",
      city: "Sevilla",
      level: "Intermediate",
      rank: 15,
      points: 1850,
      tournaments: 8,
      wins: 28,
      losses: 15,
      avatar: "/placeholder.svg",
      joinDate: "2023-06-10",
      specialties: ["Quick reflexes", "Team coordination"],
      achievements: ["Regional Tournament Winner", "Most Improved Player"]
    },
    {
      id: 5,
      name: "Diego Silva",
      country: "Portugal",
      city: "Lisboa",
      level: "Intermediate",
      rank: 18,
      points: 1720,
      tournaments: 10,
      wins: 25,
      losses: 18,
      avatar: "/placeholder.svg",
      joinDate: "2023-04-05",
      specialties: ["Serve precision", "Court awareness"],
      achievements: ["Portugal Open Semifinalist"]
    },
    {
      id: 6,
      name: "Sofia Morales",
      country: "Spain",
      city: "Bilbao",
      level: "Beginner",
      rank: 45,
      points: 950,
      tournaments: 5,
      wins: 12,
      losses: 8,
      avatar: "/placeholder.svg",
      joinDate: "2024-01-20",
      specialties: ["Learning fast", "Team spirit"],
      achievements: ["Newcomer Award 2024"]
    }
  ];

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || player.level.toLowerCase() === levelFilter.toLowerCase();
    
    return matchesSearch && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Advanced":
        return "bg-red-500";
      case "Intermediate":
        return "bg-orange-500";
      case "Beginner":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Player Profiles
          </h1>
          <p className="text-xl text-gray-600">
            Discover and connect with padel players from around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search players, cities, or countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Player Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player) => (
            <Card key={player.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={player.avatar} alt={player.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {player.name}
                      {player.rank <= 3 && (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                          player.rank === 1 ? 'bg-yellow-500' :
                          player.rank === 2 ? 'bg-gray-400' :
                          'bg-orange-600'
                        }`}>
                          {player.rank}
                        </div>
                      )}
                    </CardTitle>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{player.city}, {player.country}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Badge className={getLevelColor(player.level)}>
                    {player.level}
                  </Badge>
                  <Badge variant="outline">
                    Rank #{player.rank}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{player.points}</div>
                      <div className="text-sm text-gray-600">Points</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{player.tournaments}</div>
                      <div className="text-sm text-gray-600">Tournaments</div>
                    </div>
                  </div>

                  {/* Win/Loss Record */}
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Record:</span>
                    <span className="font-bold text-blue-600">
                      {player.wins}W - {player.losses}L
                    </span>
                  </div>

                  {/* Specialties */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-1">
                      {player.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Recent Achievements */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Achievements</h4>
                    <div className="space-y-1">
                      {player.achievements.slice(0, 2).map((achievement, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-600">
                          <Trophy className="h-3 w-3 mr-1 text-yellow-500" />
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="flex items-center text-xs text-gray-500 pt-2 border-t">
                    <Calendar className="h-3 w-3 mr-1" />
                    Member since {new Date(player.joinDate).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1" size="sm">View Profile</Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Users className="h-4 w-4 mr-1" />
                      Connect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No players found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;
