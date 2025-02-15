
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";

interface NewStudyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewStudyDialog({ open, onOpenChange }: NewStudyDialogProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: locations } = useQuery({
    queryKey: ['customerLocations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_locations')
        .select('*')
        .order('customer_name');
      
      if (error) throw error;
      return data;
    },
  });

  const selectedCustomerId = watch('customer_id');

  const onSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from('feasibility_studies')
        .insert([{
          ...data,
          status: 'pending',
          equipment_details: {}
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Feasibility study created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['feasibilityStudies'] });
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Feasibility Study</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="study_name">Study Name</Label>
            <Input id="study_name" {...register("study_name")} required />
          </div>
          
          <div>
            <Label htmlFor="customer_id">Customer</Label>
            <Select onValueChange={(value) => setValue('customer_id', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {locations?.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.customer_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="connection_type">Connection Type</Label>
              <Select onValueChange={(value) => setValue('connection_type', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DIA">Dedicated Internet Access (DIA)</SelectItem>
                  <SelectItem value="EPL">Ethernet Private Line (EPL)</SelectItem>
                  <SelectItem value="MPLS">MPLS</SelectItem>
                  <SelectItem value="P2P">Point to Point</SelectItem>
                  <SelectItem value="WAVELENGTH">Wavelength</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="bandwidth_value">Bandwidth</Label>
                <Input 
                  id="bandwidth_value" 
                  type="number" 
                  {...register("bandwidth_value")} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="bandwidth_unit">Unit</Label>
                <Select onValueChange={(value) => setValue('bandwidth_unit', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mbps">Mbps</SelectItem>
                    <SelectItem value="Gbps">Gbps</SelectItem>
                    <SelectItem value="Tbps">Tbps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source_location">Source Location</Label>
              <Select onValueChange={(value) => setValue('source_location', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {locations?.filter(loc => loc.id === selectedCustomerId)
                    .map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.city}, {location.country}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="destination_location">Destination Location</Label>
              <Select onValueChange={(value) => setValue('destination_location', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {locations?.filter(loc => loc.id === selectedCustomerId)
                    .map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.city}, {location.country}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register("notes")} />
          </div>

          <Button type="submit" className="w-full">Create Study</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
