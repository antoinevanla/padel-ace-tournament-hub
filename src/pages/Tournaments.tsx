
import { useState } from "react";
import { Calendar, MapPin, Users, Trophy, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Tournaments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const tournaments = [
    {
      id: 1,
      name: "Madrid Open Padel Championship",
      date: "2024-07-15",
      location: "Madrid, Spain",
      participants: 64,
      maxParticipants: 64,
      prize: "€50,000",
      status: "Registration Open",
      category: "Professional",
      level: "Advanced"
    },
    {
      id: 2,
      name: "Barcelona Masters",
      date: "2024-08-22",
      location: "Barcelona, Spain",
      participants: 0,
      maxParticipants: 32,
      prize: "€25,000",
      status: "Coming Soon",
      category: "Professional",
      level: "Advanced"
    },
    {
      id: 3,
      name: "Valencia Cup",
      date: "2024-09-10",
      location: "Valencia, Spain",
      participants: 28,
      maxParticipants: 48,
      prize: "€35,000",
      status: "Registration Open",
      category: "Professional",
      level: "Intermediate"
    },
    {
      id: 4,
      name: "Sevilla Amateur Open",
      date: "2024-07-28",
      location: "Sevilla, Spain",
      participants: 16,
      maxParticipants: 24,
      prize: "€5,000",
      status: "Registration Open",
      category: "Amateur",
      level: "Beginner"
    },
    {
      id: 5,
      name: "Bilbao Championship",
      date: "2024-06-30",
      location: "Bilbao, Spain",
      participants: 32,
      maxParticipants: 32,
      prize: "€15,000",
      status: "Registration Closed",
      category: "Professional",
      level: "Advanced"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Registration Open":
        return "bg-green-500";
      case "Registration Closed":
        return "bg-red-500";
      case "Coming Soon":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tournament.status.toLowerCase().includes(statusFilter.toLowerCase());
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Padel Tournaments
          </h1>
          <p className="text-xl text-gray-600">
            Discover and register for exciting padel competitions worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tournaments or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tournaments</SelectItem>
                  <SelectItem value="registration open">Registration Open</SelectItem>
                  <SelectItem value="coming soon">Coming Soon</SelectItem>
                  <SelectItem value="registration closed">Registration Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tournament Cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredTournaments.map((tournament) => (
            <Card key={tournament.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{tournament.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">{tournament.category}</Badge>
                      <Badge variant="secondary">{tournament.level}</Badge>
                    </div>
                  </div>
                  <Badge className={getStatusColor(tournament.status)}>
                    {tournament.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{new Date(tournament.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{tournament.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-blue-600" />
                      <span>{tournament.participants}/{tournament.maxParticipants} players</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Trophy className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-semibold text-blue-600">{tournament.prize}</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {tournament.maxParticipants - tournament.participants} spots remaining
                  </p>

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">View Details</Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      disabled={tournament.status === "Registration Closed"}
                    >
                      {tournament.status === "Registration Open" ? "Register" : 
                       tournament.status === "Coming Soon" ? "Notify Me" : "Closed"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTournaments.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tournaments found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;
