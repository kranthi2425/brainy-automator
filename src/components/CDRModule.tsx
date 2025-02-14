
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Call, PlatformType, PrivacyLevel } from "@/types/cdr";
import { useToast } from "@/components/ui/use-toast";
import { DateRange } from "react-day-picker";
import CallFilters from "./calls/CallFilters";
import CallTable from "./calls/CallTable";

export default function CDRModule() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [platform, setPlatform] = useState<PlatformType | "all">("all");
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchCalls = async () => {
    try {
      setLoading(true);
      let query = supabase.from("calls").select("*");

      if (dateRange?.from && dateRange?.to) {
        query = query
          .gte("start_time", dateRange.from.toISOString())
          .lte("start_time", dateRange.to.toISOString());
      }

      if (platform !== "all") {
        query = query.eq("platform", platform);
      }

      if (privacyLevel !== "all") {
        query = query.eq("privacy_level", privacyLevel);
      }

      if (searchQuery) {
        query = query.or(
          `caller_id.ilike.%${searchQuery}%,callee_id.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query.order("start_time", {
        ascending: false,
      });

      if (error) throw error;

      // Transform the data to ensure it matches the Call interface
      const transformedData: Call[] = (data || []).map((call) => ({
        ...call,
        duration: call.duration?.toString() || null,
      }));

      setCalls(transformedData);
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

  useEffect(() => {
    const subscription = supabase
      .channel("calls")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "calls" },
        (payload) => {
          console.log("Real-time update:", payload);
          fetchCalls();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    fetchCalls();
  }, [dateRange, platform, privacyLevel, searchQuery]);

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
          <CallFilters
            dateRange={dateRange}
            setDateRange={setDateRange}
            platform={platform}
            setPlatform={setPlatform}
            privacyLevel={privacyLevel}
            setPrivacyLevel={setPrivacyLevel}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <CallTable calls={calls} loading={loading} />
        </div>
      </CardContent>
    </Card>
  );
}
