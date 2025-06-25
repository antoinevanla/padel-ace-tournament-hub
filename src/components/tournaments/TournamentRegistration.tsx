
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Users, Calendar, DollarSign, MapPin, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegistrationFormData {
  partner_id?: string;
}

interface TournamentRegistrationProps {
  tournament: any;
}

const TournamentRegistration = ({ tournament }: TournamentRegistrationProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");

  const { data: availablePartners } = useQuery({
    queryKey: ["available-partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .neq("id", user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: existingRegistration } = useQuery({
    queryKey: ["tournament-registration", tournament.id, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("tournament_registrations")
        .select(`
          *,
          partner:profiles!tournament_registrations_partner_id_fkey(full_name)
        `)
        .eq("tournament_id", tournament.id)
        .eq("player_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      const { error } = await supabase
        .from("tournament_registrations")
        .insert([{
          tournament_id: tournament.id,
          player_id: user?.id,
          partner_id: data.partner_id || null,
          payment_status: tournament.entry_fee > 0 ? "pending" : "completed",
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Registration successful!" });
      queryClient.invalidateQueries({ queryKey: ["tournament-registration"] });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    },
    onError: (error) => {
      toast({ 
        title: "Registration failed", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const unregisterMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("tournament_registrations")
        .delete()
        .eq("tournament_id", tournament.id)
        .eq("player_id", user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Unregistered successfully!" });
      queryClient.invalidateQueries({ queryKey: ["tournament-registration"] });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    },
    onError: (error) => {
      toast({ 
        title: "Unregistration failed", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleRegister = () => {
    registerMutation.mutate({ partner_id: selectedPartnerId || undefined });
  };

  const isRegistrationOpen = new Date(tournament.registration_deadline) > new Date();
  const isTournamentFull = (tournament.registrations?.[0]?.count || 0) >= tournament.max_participants;

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Please sign in to register for this tournament.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 mr-2" />
          {tournament.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tournament.image_url && (
          <img
            src={tournament.image_url}
            alt={tournament.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}

        {tournament.description && (
          <p className="text-gray-600">{tournament.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {tournament.location}
          </div>

          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            {tournament.registrations?.[0]?.count || 0} / {tournament.max_participants} participants
          </div>

          {tournament.entry_fee > 0 && (
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-4 w-4 mr-2" />
              Entry fee: ${tournament.entry_fee}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Registration deadline:</span>
          <Badge variant={isRegistrationOpen ? "default" : "secondary"}>
            {new Date(tournament.registration_deadline).toLocaleDateString()}
          </Badge>
          {!isRegistrationOpen && <span className="text-red-500 text-sm">(Closed)</span>}
        </div>

        {tournament.prize_pool > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center text-yellow-800">
              <Trophy className="h-4 w-4 mr-2" />
              Prize pool: ${tournament.prize_pool}
            </div>
          </div>
        )}

        {existingRegistration ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">You are registered!</h4>
            {existingRegistration.partner && (
              <p className="text-sm text-green-700">
                Partner: {existingRegistration.partner.full_name}
              </p>
            )}
            <p className="text-sm text-green-700">
              Payment status: <Badge variant={existingRegistration.payment_status === "completed" ? "default" : "secondary"}>
                {existingRegistration.payment_status}
              </Badge>
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => unregisterMutation.mutate()}
              disabled={unregisterMutation.isPending}
            >
              Unregister
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {isRegistrationOpen && !isTournamentFull ? (
              <>
                <div>
                  <Label htmlFor="partner">Select Partner (Optional)</Label>
                  <Select value={selectedPartnerId} onValueChange={setSelectedPartnerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a partner or play solo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No partner (solo)</SelectItem>
                      {availablePartners?.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.full_name || partner.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleRegister}
                  disabled={registerMutation.isPending}
                  className="w-full"
                >
                  Register for Tournament
                </Button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600">
                  {!isRegistrationOpen 
                    ? "Registration is closed"
                    : "Tournament is full"
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TournamentRegistration;
