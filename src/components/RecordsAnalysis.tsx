import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--destructive))",
  "hsl(var(--muted))",
  "hsl(var(--accent))",
];

export default function RecordsAnalysis() {
  const [activeTab, setActiveTab] = useState("trends");

  // Fetch call volume trends
  const { data: trendData, isLoading: trendLoading } = useQuery({
    queryKey: ["call-trends"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calls")
        .select("start_time, platform")
        .order("start_time", { ascending: true });

      if (error) throw error;

      // Group calls by hour
      const grouped = (data || []).reduce((acc: any, call) => {
        const hour = new Date(call.start_time).toLocaleString("en-US", {
          hour: "numeric",
          hour12: true,
        });
        if (!acc[hour]) {
          acc[hour] = { name: hour, calls: 0 };
        }
        acc[hour].calls++;
        return acc;
      }, {});

      return Object.values(grouped);
    },
  });

  // Fetch platform distribution
  const { data: platformData, isLoading: platformLoading } = useQuery({
    queryKey: ["platform-distribution"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calls")
        .select("platform")
        .order("platform");

      if (error) throw error;

      // Count calls by platform
      const platforms = (data || []).reduce((acc: any, call) => {
        if (!acc[call.platform]) {
          acc[call.platform] = { name: call.platform, value: 0 };
        }
        acc[call.platform].value++;
        return acc;
      }, {});

      return Object.values(platforms);
    },
  });

  // Fetch top callers
  const { data: topCallersData, isLoading: topCallersLoading } = useQuery({
    queryKey: ["top-callers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calls")
        .select('caller_id, count:caller_id')
        .order('count', { ascending: false })
        .limit(10);

      if (error) throw error;

      return data?.map((item: any) => ({
        name: item.caller_id,
        calls: parseInt(item.count),
      }));
    },
  });

  const renderLoading = () => (
    <div className="flex items-center justify-center h-[400px]">
      Loading data...
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Records Analysis</CardTitle>
        <CardDescription>
          Visual analysis of call patterns and trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="trends">Call Volume Trends</TabsTrigger>
            <TabsTrigger value="platforms">Platform Distribution</TabsTrigger>
            <TabsTrigger value="top-callers">Top Callers</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="h-[400px]">
            {trendLoading ? (
              renderLoading()
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="calls"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </TabsContent>

          <TabsContent value="platforms" className="h-[400px]">
            {platformLoading ? (
              renderLoading()
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} (${value})`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {platformData?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </TabsContent>

          <TabsContent value="top-callers" className="h-[400px]">
            {topCallersLoading ? (
              renderLoading()
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCallersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calls" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
