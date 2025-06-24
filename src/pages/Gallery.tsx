
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Calendar, User } from "lucide-react";

const Gallery = () => {
  const { data: media, isLoading } = useQuery({
    queryKey: ["media-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_gallery")
        .select(`
          *,
          tournament:tournaments(name),
          uploader:profiles!media_gallery_uploaded_by_fkey(full_name)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Gallery</h1>
        <p className="text-gray-600">Capture and share memorable moments from tournaments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {media?.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow overflow-hidden">
            <div className="aspect-video bg-gray-100">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                {item.tournament && (
                  <Badge variant="secondary">
                    {item.tournament.name}
                  </Badge>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-gray-600">{item.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                By {item.uploader?.full_name || 'Anonymous'}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(item.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!media || media.length === 0) && (
        <div className="text-center py-12">
          <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No media yet</h3>
          <p className="text-gray-600">Photos and videos from tournaments will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
