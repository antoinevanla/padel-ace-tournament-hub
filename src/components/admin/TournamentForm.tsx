
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Upload, X } from "lucide-react";

interface TournamentFormData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  location: string;
  max_participants: number;
  entry_fee: number;
  prize_pool: number;
  image_url?: string;
}

interface TournamentFormProps {
  tournament?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TournamentForm = ({ tournament, onSuccess, onCancel }: TournamentFormProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TournamentFormData>({
    defaultValues: tournament ? {
      name: tournament.name,
      description: tournament.description || "",
      start_date: tournament.start_date,
      end_date: tournament.end_date,
      registration_deadline: tournament.registration_deadline,
      location: tournament.location,
      max_participants: tournament.max_participants,
      entry_fee: tournament.entry_fee || 0,
      prize_pool: tournament.prize_pool || 0,
      image_url: tournament.image_url || "",
    } : {
      entry_fee: 0,
      prize_pool: 0,
    }
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(tournament?.image_url || "");

  const createTournamentMutation = useMutation({
    mutationFn: async (data: TournamentFormData) => {
      let imageUrl = data.image_url;
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `tournament-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('tournament-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('tournament-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { data: result, error } = await supabase
        .from("tournaments")
        .insert([{
          ...data,
          image_url: imageUrl,
          organizer_id: user?.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast({ title: "Tournament created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast({ 
        title: "Failed to create tournament", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateTournamentMutation = useMutation({
    mutationFn: async (data: TournamentFormData) => {
      let imageUrl = data.image_url;
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `tournament-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('tournament-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('tournament-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { data: result, error } = await supabase
        .from("tournaments")
        .update({
          ...data,
          image_url: imageUrl,
        })
        .eq("id", tournament.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast({ title: "Tournament updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast({ 
        title: "Failed to update tournament", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: TournamentFormData) => {
    if (tournament) {
      updateTournamentMutation.mutate(data);
    } else {
      createTournamentMutation.mutate(data);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{tournament ? "Edit Tournament" : "Create New Tournament"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Tournament Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Tournament name is required" })}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                {...register("start_date", { required: "Start date is required" })}
              />
              {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date.message}</p>}
            </div>

            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                {...register("end_date", { required: "End date is required" })}
              />
              {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date.message}</p>}
            </div>

            <div>
              <Label htmlFor="registration_deadline">Registration Deadline</Label>
              <Input
                id="registration_deadline"
                type="date"
                {...register("registration_deadline", { required: "Registration deadline is required" })}
              />
              {errors.registration_deadline && <p className="text-red-500 text-sm">{errors.registration_deadline.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="max_participants">Max Participants</Label>
              <Input
                id="max_participants"
                type="number"
                {...register("max_participants", { 
                  required: "Max participants is required",
                  valueAsNumber: true,
                  min: { value: 4, message: "Minimum 4 participants required" }
                })}
              />
              {errors.max_participants && <p className="text-red-500 text-sm">{errors.max_participants.message}</p>}
            </div>

            <div>
              <Label htmlFor="entry_fee">Entry Fee ($)</Label>
              <Input
                id="entry_fee"
                type="number"
                step="0.01"
                {...register("entry_fee", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="prize_pool">Prize Pool ($)</Label>
              <Input
                id="prize_pool"
                type="number"
                step="0.01"
                {...register("prize_pool", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image">Tournament Image</Label>
            <div className="mt-2">
              {imagePreview && (
                <div className="relative mb-4">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview("");
                      setImageFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Label htmlFor="image" className="cursor-pointer">
                  <Button type="button" variant="outline" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Image
                    </span>
                  </Button>
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={createTournamentMutation.isPending || updateTournamentMutation.isPending}
            >
              {tournament ? "Update Tournament" : "Create Tournament"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TournamentForm;
