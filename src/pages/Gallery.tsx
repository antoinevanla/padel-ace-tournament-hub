
import { useState } from "react";
import { Camera, Play, Calendar, MapPin, Users, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const mediaItems = [
    {
      id: 1,
      type: "image",
      title: "Madrid Open Championship Final",
      tournament: "Madrid Open",
      date: "2024-06-15",
      location: "Madrid, Spain",
      thumbnail: "/placeholder.svg",
      description: "Epic final match between Carlos Rodriguez and Juan Martinez",
      tags: ["final", "championship", "madrid"]
    },
    {
      id: 2,
      type: "video",
      title: "Best Shots Compilation",
      tournament: "Barcelona Masters",
      date: "2024-06-08",
      location: "Barcelona, Spain",
      thumbnail: "/placeholder.svg",
      description: "Amazing shots and rallies from the Barcelona Masters tournament",
      tags: ["highlights", "shots", "barcelona"],
      duration: "3:45"
    },
    {
      id: 3,
      type: "image",
      title: "Victory Ceremony",
      tournament: "Valencia Cup",
      date: "2024-05-28",
      location: "Valencia, Spain",
      thumbnail: "/placeholder.svg",
      description: "Winners celebrating their victory at Valencia Cup",
      tags: ["ceremony", "winners", "valencia"]
    },
    {
      id: 4,
      type: "video",
      title: "Tournament Highlights",
      tournament: "Madrid Open",
      date: "2024-06-15",
      location: "Madrid, Spain",
      thumbnail: "/placeholder.svg",
      description: "Complete highlights from the Madrid Open Championship",
      tags: ["highlights", "tournament", "madrid"],
      duration: "8:22"
    },
    {
      id: 5,
      type: "image",
      title: "Player Action Shots",
      tournament: "Sevilla Amateur Open",
      date: "2024-05-20",
      location: "Sevilla, Spain",
      thumbnail: "/placeholder.svg",
      description: "Dynamic action shots from amateur tournament",
      tags: ["action", "amateur", "sevilla"]
    },
    {
      id: 6,
      type: "image",
      title: "Court Atmosphere",
      tournament: "Barcelona Masters",
      date: "2024-06-08",
      location: "Barcelona, Spain",
      thumbnail: "/placeholder.svg",
      description: "Packed crowd enjoying the tournament atmosphere",
      tags: ["crowd", "atmosphere", "barcelona"]
    },
    {
      id: 7,
      type: "video",
      title: "Player Interviews",
      tournament: "Valencia Cup",
      date: "2024-05-28",
      location: "Valencia, Spain",
      thumbnail: "/placeholder.svg",
      description: "Post-match interviews with tournament winners",
      tags: ["interviews", "players", "valencia"],
      duration: "5:15"
    },
    {
      id: 8,
      type: "image",
      title: "Equipment Showcase",
      tournament: "Madrid Open",
      date: "2024-06-15",
      location: "Madrid, Spain",
      thumbnail: "/placeholder.svg",
      description: "Latest padel equipment and technology showcase",
      tags: ["equipment", "technology", "showcase"]
    }
  ];

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tournament.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Media Gallery
          </h1>
          <p className="text-xl text-gray-600">
            Relive the best moments from padel tournaments
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search photos, videos, or tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Media</SelectItem>
                  <SelectItem value="image">Photos</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((item) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                  <div className="relative aspect-video bg-gradient-to-br from-blue-400 to-blue-600 rounded-t-lg overflow-hidden">
                    {/* Placeholder for actual image */}
                    <div className="w-full h-full flex items-center justify-center">
                      {item.type === "video" ? (
                        <div className="relative">
                          <Camera className="h-16 w-16 text-white/70" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/20 rounded-full p-3 group-hover:bg-white/30 transition-colors">
                              <Play className="h-8 w-8 text-white fill-white" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Camera className="h-16 w-16 text-white/70" />
                      )}
                    </div>
                    
                    {/* Video duration overlay */}
                    {item.type === "video" && item.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {item.duration}
                      </div>
                    )}

                    {/* Type badge */}
                    <div className="absolute top-2 left-2">
                      <Badge className={item.type === "video" ? "bg-red-500" : "bg-green-500"}>
                        {item.type === "video" ? "Video" : "Photo"}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{item.tournament}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                <div className="space-y-4">
                  {/* Media viewer */}
                  <div className="relative aspect-video bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    {item.type === "video" ? (
                      <div className="text-center">
                        <Play className="h-24 w-24 text-white mb-4 mx-auto" />
                        <p className="text-white text-lg">Video Player Placeholder</p>
                        <p className="text-white/70">Duration: {item.duration}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Camera className="h-24 w-24 text-white mb-4 mx-auto" />
                        <p className="text-white text-lg">High-res Image Placeholder</p>
                      </div>
                    )}
                  </div>

                  {/* Media details */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h2>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{item.tournament}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {filteredMedia.length === 0 && (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No media found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
