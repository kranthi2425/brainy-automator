
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function StudiesList() {
  const { data: studies, isLoading } = useQuery({
    queryKey: ['feasibilityStudies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feasibility_studies')
        .select(`
          *,
          customer:customer_locations!customer_id(customer_name),
          source:customer_locations!source_location(city, country),
          destination:customer_locations!destination_location(city, country)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[300px]" />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Study Name</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Connection</TableHead>
            <TableHead>Bandwidth</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studies?.map((study) => (
            <TableRow key={study.id}>
              <TableCell>{study.study_name}</TableCell>
              <TableCell>{study.customer?.customer_name}</TableCell>
              <TableCell>{study.connection_type}</TableCell>
              <TableCell>{study.bandwidth_value} {study.bandwidth_unit}</TableCell>
              <TableCell>
                {study.source?.city}, {study.source?.country} →{" "}
                {study.destination?.city}, {study.destination?.country}
              </TableCell>
              <TableCell>
                <Badge variant={study.status === 'pending' ? 'secondary' : 'default'}>
                  {study.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
