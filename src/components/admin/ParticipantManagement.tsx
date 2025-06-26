
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Star, Mail } from "lucide-react";

interface ParticipantManagementProps {
  tournamentId: string;
  participants: any[] | undefined;
}

const ParticipantManagement = ({ tournamentId, participants }: ParticipantManagementProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      console.log("Payment status updated successfully");
    },
    onSuccess: () => {
      toast({ title: "Payment status updated successfully" });
      // Invalidate multiple queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ["tournament-participants", tournamentId] });
      queryClient.invalidateQueries({ queryKey: ["tournament", tournamentId] });
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
    onError: (error) => {
      console.error("Payment status update error:", error);
      toast({ 
        title: "Error updating payment status", 
        description: error.message,
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
    updatePaymentStatusMutation.mutate({ registrationId, status: newStatus });
  };

  console.log("ParticipantManagement - Tournament ID:", tournamentId);
  console.log("ParticipantManagement - Participants:", participants);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Registered Participants ({participants?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {participants && participants.length > 0 ? (
          <div className="space-y-4">
            {participants.map((registration) => (
              <div key={registration.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={registration.player?.avatar_url || ""} />
                      <AvatarFallback>
                        {registration.player?.full_name?.[0] || registration.player?.email?.[0] || "P"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {registration.player?.full_name || registration.player?.email?.split('@')[0] || "Unknown Player"}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {registration.player?.email || "No email"}
                      </div>
                      {registration.partner && (
                        <div className="text-sm text-gray-600 mt-1">
                          Partner: {registration.partner.full_name || registration.partner.email?.split('@')[0] || "Unknown"}
                          {registration.partner.email && (
                            <span className="text-xs ml-2">({registration.partner.email})</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    {registration.player?.skill_level && (
                      <Badge className={getSkillColor(registration.player.skill_level)}>
                        <Star className="h-3 w-3 mr-1" />
                        {getSkillLevel(registration.player.skill_level)}
                      </Badge>
                    )}
                    
                    <Select
                      value={registration.payment_status || "pending"}
                      onValueChange={(value) => handlePaymentStatusChange(registration.id, value)}
                      disabled={updatePaymentStatusMutation.isPending}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
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

                {registration.partner && registration.partner.skill_level && (
                  <div className="text-sm text-gray-600 flex items-center">
                    <span className="mr-2">Partner skill level:</span>
                    <Badge className={getSkillColor(registration.partner.skill_level)} variant="outline">
                      <Star className="h-3 w-3 mr-1" />
                      {getSkillLevel(registration.partner.skill_level)}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No participants registered yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ParticipantManagement;
