
import { Trophy, Users, Target, Star } from "lucide-react";

const StatsSection = () => {
  const stats = [
    { label: "Active Tournaments", value: "12+", icon: Trophy },
    { label: "Registered Players", value: "250+", icon: Users },
    { label: "Matches Played", value: "800+", icon: Target },
    { label: "Communities", value: "15+", icon: Star }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Growing Community</h2>
          <p className="text-gray-600">Be part of the fastest-growing padel tournament platform</p>
        </div>
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
  );
};

export default StatsSection;
