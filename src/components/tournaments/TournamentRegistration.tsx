import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users, User, Euro } from "lucide-react";

interface TournamentRegistrationProps {
  tournament: any;
}

const TournamentRegistration = ({ tournament }: TournamentRegistrationProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState(false);

  console.log("TournamentRegistration - User:", user);
  console.log("TournamentRegistration - Tournament:", tournament);

  // Get user profile to check admin status
  const { data: userProfile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Query to get all available partners (other users)
  const { data: availablePartners, isLoading: partnersLoading } = useQuery({
    queryKey: ["available-partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .neq("id", user?.id || ""); // Exclude current user
      
      if (error) {
        console.error("Error fetching partners:", error);
        return [];
      }
      console.log("Available partners:", data);
      return data || [];
    },
    enabled: !!user,
  });

  // Check if user is already registered
  const { data: existingRegistration, isLoading: registrationLoading } = useQuery({
    queryKey: ["user-registration", tournament?.id, user?.id],
    queryFn: async () => {
      if (!user?.id || !tournament?.id) return null;
      
      const { data, error } = await supabase
        .from("tournament_registrations")
        .select("*")
        .eq("tournament_id", tournament.id)
        .eq("player_id", user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking registration:", error);
        return null;
      }
      return data;
    },
    enabled: !!user?.id && !!tournament?.id,
  });

  // Add payment status update mutation for admins
  const updatePaymentStatusMutation = useMutation({
    mutationFn: async ({ registrationId, status }: { registrationId: string; status: string }) => {
      console.log("Updating payment status for registration:", registrationId, "to:", status);
      
      const { error } = await supabase
        .from("tournament_registrations")
        .update({ payment_status: status })
        .eq("id", registrationId);
      
      if (error) {
        console.error("Error updating payment status:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({ title: "Payment status updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["user-registration"] });
      queryClient.invalidateQueries({ queryKey: ["tournament-participants"] });
    },
    onError: (error: any) => {
      console.error("Payment status update error:", error);
      toast({ 
        title: "Error updating payment status", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ partnerId }: { partnerId?: string }) => {
      if (!user?.id || !tournament?.id) {
        throw new Error("User or tournament not found");
      }

      const registrationData = {
        tournament_id: tournament.id,
        player_id: user.id,
        partner_id: partnerId || null,
        payment_status: "pending"
      };

      const { data, error } = await supabase
        .from("tournament_registrations")
        .insert([registrationData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful!",
        description: "You have been registered for the tournament.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-registration"] });
      queryClient.invalidateQueries({ queryKey: ["tournament-participants"] });
      setSelectedPartnerId("");
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error with your registration.",
        variant: "destructive",
      });
    },
  });

  const handleRegistration = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to register for tournaments.",
        variant: "destructive",
      });
      return;
    }

    setIsRegistering(true);
    try {
      await registerMutation.mutateAsync({ 
        partnerId: selectedPartnerId || undefined 
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handlePaymentStatusChange = (newStatus: string) => {
    if (existingRegistration?.id) {
      updatePaymentStatusMutation.mutate({ 
        registrationId: existingRegistration.id, 
        status: newStatus 
      });
    }
  };

  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'organizer';

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Tournament Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Please log in to register for this tournament.</p>
        </CardContent>
      </Card>
    );
  }

  if (!tournament) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tournament Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Tournament information not available.</p>
        </CardContent>
      </Card>
    );
  }

  if (registrationLoading || partnersLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Tournament Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading registration information...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (existingRegistration) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Tournament Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">Already Registered!</h3>
              <p className="text-gray-600">
                You are already registered for this tournament.
              </p>
              <div className="mt-4 space-y-2">
                <div className="text-sm text-gray-500">
                  Payment Status: 
                  {isAdmin ? (
                    <Select 
                      value={existingRegistration.payment_status || "pending"} 
                      onValueChange={handlePaymentStatusChange}
                      disabled={updatePaymentStatusMutation.isPending}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs ml-2 inline-flex">
                        {updatePaymentStatusMutation.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <SelectValue />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="font-medium ml-1">{existingRegistration.payment_status}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Tournament Registration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="player-name">Player Name</Label>
          <Input
            id="player-name"
            value={user.user_metadata?.full_name || user.email || ""}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div>
          <Label htmlFor="partner-select">Partner (Optional)</Label>
          <Select 
            value={selectedPartnerId} 
            onValueChange={setSelectedPartnerId}
          >
            <SelectTrigger id="partner-select">
              <SelectValue placeholder="Select a partner (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No Partner</SelectItem>
              {availablePartners?.map((partner) => (
                <SelectItem key={partner.id} value={partner.id}>
                  {partner.full_name || partner.email?.split('@')[0] || 'Unknown Player'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Entry Fee:</span>
            <span className="text-lg font-bold flex items-center">
              <Euro className="h-4 w-4 mr-1" />
              {tournament.entry_fee || 0}
            </span>
          </div>
          
          <Button 
            onClick={handleRegistration}
            disabled={isRegistering || registerMutation.isPending}
            className="w-full"
          >
            {isRegistering || registerMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Registering...
              </>
            ) : (
              "Register for Tournament"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentRegistration;
