
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Target, Camera, ArrowRight } from "lucide-react";

const FeaturesSection = () => {
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

  return (
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
  );
};

export default FeaturesSection;
