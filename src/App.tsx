
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import Index from "./pages/Index";
import Tournaments from "./pages/Tournaments";
import Results from "./pages/Results";
import Players from "./pages/Players";
import Gallery from "./pages/Gallery";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import TournamentDetail from "./pages/TournamentDetail";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/tournament/:id" element={<TournamentDetail />} />
              <Route path="/results" element={<Results />} />
              <Route path="/players" element={<Players />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
