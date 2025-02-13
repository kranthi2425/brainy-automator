
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Call, PlatformType } from "@/types/cdr";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export default function CDRModule() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [platform, setPlatform] = useState<PlatformType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchCalls = async () => {
    try {
      setLoading(true);
      let query = supabase.from("calls").select("*");

      // Apply filters
      if (dateRange?.from && dateRange?.to) {
        query = query
          .gte("start_time", dateRange.from.toISOString())
          .lte("start_time", dateRange.to.toISOString());
      }

      if (platform !== "all") {
        query = query.eq("platform", platform);
      }

      if (searchQuery) {
        query = query.or(`caller_id.ilike.%${searchQuery}%,callee_id.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.order("start_time", { ascending: false });

      if (error) throw error;
      setCalls(data);
    } catch (error) {
      console.error("Error fetching calls:", error);
      toast({
        title: "Error",
        description: "Failed to fetch call records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel("calls")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "calls" },
        (payload) => {
          console.log("Real-time update:", payload);
          fetchCalls(); // Refresh the data
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch initial data and when filters change
  useEffect(() => {
    fetchCalls();
  }, [dateRange, platform, searchQuery]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Detail Records</CardTitle>
        <CardDescription>
          Real-time call tracking and analysis across platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
              />
            </div>
            <Select
              value={platform}
              onValueChange={(value: PlatformType | "all") => setPlatform(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="voip">VoIP</SelectItem>
                <SelectItem value="pstn">PSTN</SelectItem>
                <SelectItem value="sip">SIP</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="iot">IoT</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1">
              <Input
                placeholder="Search by caller or callee ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setDateRange(undefined);
                setPlatform("all");
                setSearchQuery("");
              }}
              variant="outline"
            >
              Reset Filters
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Caller ID</TableHead>
                <TableHead>Callee ID</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : calls.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No call records found
                  </TableCell>
                </TableRow>
              ) : (
                calls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell>
                      {format(new Date(call.start_time), "yyyy-MM-dd HH:mm:ss")}
                    </TableCell>
                    <TableCell>{call.caller_id}</TableCell>
                    <TableCell>{call.callee_id}</TableCell>
                    <TableCell>{call.duration || "In Progress"}</TableCell>
                    <TableCell>{call.status}</TableCell>
                    <TableCell>{call.platform}</TableCell>
                    <TableCell>{call.call_type}</TableCell>
                    <TableCell>{call.geographic_location || "N/A"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
