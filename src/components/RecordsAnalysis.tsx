import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const mockData = [
  { name: "00:00", calls: 120, data: 250 },
  { name: "04:00", calls: 80, data: 300 },
  { name: "08:00", calls: 200, data: 450 },
  { name: "12:00", calls: 350, data: 500 },
  { name: "16:00", calls: 280, data: 600 },
  { name: "20:00", calls: 190, data: 400 },
];

const chartConfig = {
  calls: {
    label: "Call Volume",
    color: "hsl(var(--primary))",
  },
  data: {
    label: "Data Usage",
    color: "hsl(var(--secondary))",
  },
};

export default function RecordsAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Analysis</CardTitle>
        <CardDescription>
          Call volume and data usage patterns over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ChartContainer config={chartConfig}>
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip />
              <ChartLegend />
              <Bar dataKey="calls" fill={chartConfig.calls.color} />
              <Bar dataKey="data" fill={chartConfig.data.color} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}