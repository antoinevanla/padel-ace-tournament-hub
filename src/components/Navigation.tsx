import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Trophy, Calendar, Target, Users, Camera, LogIn, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const {
    user,
    signOut
  } = useAuth();
  const {
    data: userProfile
  } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const {
        data,
        error
      } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });
  const navItems = [{
    path: "/",
    label: "Home",
    icon: Trophy
  }, {
    path: "/tournaments",
    label: "Tournaments",
    icon: Calendar
  }, {
    path: "/results",
    label: "Results",
    icon: Target
  }, {
    path: "/players",
    label: "Players",
    icon: Users
  }, {
    path: "/gallery",
    label: "Gallery",
    icon: Camera
  }];
  const isActive = (path: string) => location.pathname === path;
  return <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PadelBro
            </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => {
            const Icon = item.icon;
            return <Link key={item.path} to={item.path} className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.path) ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>;
          })}
            
            {/* Auth Section */}
            {user ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {userProfile && ['admin', 'organizer'].includes(userProfile.role || '') && <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>}
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <Link to="/auth">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navItems.map(item => {
            const Icon = item.icon;
            return <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.path) ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"}`}>
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>;
          })}
              
              {/* Mobile Auth */}
              {user ? <>
                  {userProfile && ['admin', 'organizer'].includes(userProfile.role || '') && <Link to="/admin" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2 justify-start w-full">
                        <Settings className="h-4 w-4" />
                        <span>Admin Panel</span>
                      </Button>
                    </Link>}
                  <Button variant="ghost" size="sm" onClick={signOut} className="flex items-center space-x-2 justify-start">
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Button>
                </> : <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2 justify-start w-full">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Button>
                </Link>}
            </div>
          </div>}
      </div>
    </nav>;
};