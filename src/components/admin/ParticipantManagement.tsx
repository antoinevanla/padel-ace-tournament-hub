import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Star, Mail, Loader2 } from "lucide-react";

interface ParticipantManagementProps {
  tournamentId: string;
  participants: any[] | undefined;
}

const ParticipantManagement = ({ tournamentId, participants }: ParticipantManagementProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  console.log("ParticipantManagement - Tournament ID:", tournamentId);
  console.log("ParticipantManagement - Participants:", participants);

  const updatePaymentStatusMutation = useMutation({
    mutationFn: async ({ registrationId, status }: { registrationId: string; status: string }) => {
      console.log("Updating payment status for registration:", registrationId, "to:", status);
      
      if (!registrationId || !status) {
        throw new Error("Invalid registration ID or status");
      }

      // Validate the status
      const validStatuses = ["pending", "completed", "failed"];
      if (!validStatuses.includes(status)) {
        throw new Error("Invalid payment status");
      }

      // First check if the registration exists
      const { data: existing, error: checkError } = await supabase
        .from("tournament_registrations")
        .select("id, payment_status")
        .eq("id", registrationId);
      
      if (checkError) {
        console.error("Error checking registration:", checkError);
        throw new Error(`Failed to find registration: ${checkError.message}`);
      }
      
      if (!existing || existing.length === 0) {
        throw new Error("Registration not found");
      }
      
      if (existing.length > 1) {
        console.warn("Multiple registrations found with same ID:", existing);
      }

      // Update the payment status
      const { data, error } = await supabase
        .from("tournament_registrations")
        .update({ payment_status: status })
        .eq("id", registrationId)
        .select("*");
      
      if (error) {
        console.error("Error updating payment status:", error);
        throw new Error(`Failed to update payment status: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        throw new Error("No registration was updated");
      }
      
      console.log("Payment status updated successfully:", data[0]);
      return data[0];
    },
    onSuccess: (data) => {
      console.log("Payment status update successful:", data);
      toast({ title: "Payment status updated successfully" });
      
      // Invalidate all relevant queries to ensure UI updates everywhere
      queryClient.invalidateQueries({ queryKey: ["tournament-participants", tournamentId] });
      queryClient.invalidateQueries({ queryKey: ["tournament", tournamentId] });
      queryClient.invalidateQueries({ queryKey: ["tournament-registration"] });
      queryClient.invalidateQueries({ queryKey: ["players"] });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      queryClient.invalidateQueries({ queryKey: ["homepage-stats"] });
    },
    onError: (error: any) => {
      console.error("Payment status update error:", error);
      toast({ 
        title: "Error updating payment status", 
        description: error.message || "An error occurred while updating payment status",
        variant: "destructive" 
      });
    },
  });

  const updateSkillLevelMutation = useMutation({
    mutationFn: async ({ playerId, skillLevel }: { playerId: string; skillLevel: number }) => {
      console.log("Updating skill level for player:", playerId, "to level:", skillLevel);
      
      if (!playerId || !skillLevel || skillLevel < 1 || skillLevel > 10) {
        throw new Error("Invalid player ID or skill level (must be 1-10)");
      }

      // First check if the player exists
      const { data: existing, error: checkError } = await supabase
        .from("profiles")
        .select("id, skill_level, full_name, email")
        .eq("id", playerId);
      
      if (checkError) {
        console.error("Error checking player:", checkError);
        throw new Error(`Failed to find player: ${checkError.message}`);
      }
      
      if (!existing || existing.length === 0) {
        throw new Error("Player not found");
      }
      
      console.log("Found player:", existing[0]);

      // Update the skill level
      const { data, error } = await supabase
        .from("profiles")
        .update({ skill_level: skillLevel })
        .eq("id", playerId)
        .select("*");
      
      if (error) {
        console.error("Error updating skill level:", error);
        throw new Error(`Failed to update skill level: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        throw new Error("No player profile was updated");
      }
      
      console.log("Skill level updated successfully:", data[0]);
      return data[0];
    },
    onSuccess: (data) => {
      console.log("Skill level update successful:", data);
      toast({ title: "Skill level updated successfully" });
      
      // Invalidate all relevant queries to ensure UI updates everywhere
      queryClient.invalidateQueries({ queryKey: ["tournament-participants", tournamentId] });
      queryClient.invalidateQueries({ queryKey: ["players"] });
      queryClient.invalidateQueries({ queryKey: ["homepage-stats"] });
    },
    onError: (error: any) => {
      console.error("Skill level update error:", error);
      toast({ 
        title: "Error updating skill level", 
        description: error.message || "An error occurred while updating skill level",
        variant: "destructive" 
      });
    },
  });

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSkillLevel = (level: number | null) => {
    if (!level) return "Beginner";
    if (level <= 3) return "Beginner";
    if (level <= 6) return "Intermediate";
    if (level <= 8) return "Advanced";
    return "Expert";
  };

  const getSkillColor = (level: number | null) => {
    if (!level) return "bg-gray-100 text-gray-800";
    if (level <= 3) return "bg-green-100 text-green-800";
    if (level <= 6) return "bg-blue-100 text-blue-800";
    if (level <= 8) return "bg-purple-100 text-purple-800";
    return "bg-red-100 text-red-800";
  };

  const handlePaymentStatusChange = (registrationId: string, newStatus: string) => {
    console.log("Handling payment status change:", registrationId, newStatus);
    
    if (!registrationId || !newStatus) {
      console.error("Invalid registration ID or status:", registrationId, newStatus);
      toast({ 
        title: "Error", 
        description: "Invalid registration ID or status",
        variant: "destructive" 
      });
      return;
    }
    
    updatePaymentStatusMutation.mutate({ registrationId, status: newStatus });
  };

  const handleSkillLevelChange = (playerId: string, newLevel: string) => {
    const skillLevel = parseInt(newLevel);
    console.log("Handling skill level change:", playerId, skillLevel);
    
    if (!playerId || !skillLevel || isNaN(skillLevel) || skillLevel < 1 || skillLevel > 10) {
      console.error("Invalid player ID or skill level:", playerId, skillLevel);
      toast({ 
        title: "Error", 
        description: "Invalid player ID or skill level",
        variant: "destructive" 
      });
      return;
    }
    
    updateSkillLevelMutation.mutate({ playerId, skillLevel });
  };

  if (!participants) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Registered Participants (0)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">Loading participants...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Registered Participants ({participants.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {participants.length > 0 ? (
          <div className="space-y-4">
            {participants.map((registration) => {
              const player = registration.player;
              const partner = registration.partner;
              
              if (!player) {
                console.warn("Registration without player data:", registration);
                return null;
              }

              return (
                <div key={registration.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={player.avatar_url || ""} />
                        <AvatarFallback>
                          {player.full_name?.[0] || player.email?.[0] || "P"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {player.full_name || player.email?.split('@')[0] || "Unknown Player"}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {player.email || "No email"}
                        </div>
                        {partner && (
                          <div className="text-sm text-gray-600 mt-1">
                            Partner: {partner.full_name || partner.email?.split('@')[0] || "Unknown"}
                            {partner.email && (
                              <span className="text-xs ml-2">({partner.email})</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      {player.skill_level && (
                        <div className="flex items-center space-x-2">
                          <Badge className={getSkillColor(player.skill_level)}>
                            <Star className="h-3 w-3 mr-1" />
                            {getSkillLevel(player.skill_level)}
                          </Badge>
                          <Select
                            value={player.skill_level?.toString() || "1"}
                            onValueChange={(value) => handleSkillLevelChange(player.id, value)}
                            disabled={updateSkillLevelMutation.isPending}
                          >
                            <SelectTrigger className="w-24 h-8 text-xs">
                              {updateSkillLevelMutation.isPending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <SelectValue />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 (Beginner)</SelectItem>
                              <SelectItem value="2">2 (Beginner)</SelectItem>
                              <SelectItem value="3">3 (Beginner)</SelectItem>
                              <SelectItem value="4">4 (Intermediate)</SelectItem>
                              <SelectItem value="5">5 (Intermediate)</SelectItem>
                              <SelectItem value="6">6 (Intermediate)</SelectItem>
                              <SelectItem value="7">7 (Advanced)</SelectItem>
                              <SelectItem value="8">8 (Advanced)</SelectItem>
                              <SelectItem value="9">9 (Expert)</SelectItem>
                              <SelectItem value="10">10 (Expert)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600">Payment:</span>
                        <Select
                          value={registration.payment_status || "pending"}
                          onValueChange={(value) => handlePaymentStatusChange(registration.id, value)}
                          disabled={updatePaymentStatusMutation.isPending}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
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
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Registered: {new Date(registration.registration_date).toLocaleDateString()}
                    </span>
                    <Badge 
                      className={getPaymentStatusColor(registration.payment_status || "pending")}
                      variant="secondary"
                    >
                      {registration.payment_status || "pending"}
                    </Badge>
                  </div>

                  {partner && partner.skill_level && (
                    <div className="text-sm text-gray-600 flex items-center">
                      <span className="mr-2">Partner skill level:</span>
                      <Badge className={getSkillColor(partner.skill_level)} variant="outline">
                        <Star className="h-3 w-3 mr-1" />
                        {getSkillLevel(partner.skill_level)}
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No participants registered yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ParticipantManagement;
