
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface NewLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewLocationDialog({ open, onOpenChange }: NewLocationDialogProps) {
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const onSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from('customer_locations')
        .insert([data]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Location added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['customerLocations'] });
      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="customer_name">Customer Name</Label>
            <Input id="customer_name" {...register("customer_name")} required />
          </div>
          <div>
            <Label htmlFor="location_type">Location Type</Label>
            <Input id="location_type" {...register("location_type")} placeholder="e.g., Headquarters, Branch" required />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} required />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} />
            </div>
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...register("country")} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input id="latitude" type="number" step="any" {...register("latitude")} />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input id="longitude" type="number" step="any" {...register("longitude")} />
            </div>
          </div>
          <Button type="submit" className="w-full">Add Location</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
