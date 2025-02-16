
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
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Threat {
  id: string;
  timestamp: string;
  type: string;
  severity: "high" | "medium" | "low";
  description: string;
  source_ip?: string;
  data_volume?: number;
  detection_method: "ml" | "rule-based";
}

export default function ThreatDetection() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreats = async () => {
      const { data, error } = await supabase
        .from("threats")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching threats:", error);
        return;
      }

      setThreats(data || []);
      setLoading(false);
    };

    // Set up real-time subscription for new threats
    const subscription = supabase
      .channel("threats")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "threats",
        },
        (payload) => {
          setThreats((current) => [payload.new as Threat, ...current].slice(0, 10));
        }
      )
      .subscribe();

    fetchThreats();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getMethodBadgeColor = (method: string) => {
    return method === "ml" ? "default" : "secondary";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detected Threats</CardTitle>
        <CardDescription>
          Real-time anomaly detection and security threats
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Source IP</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading threats...
                </TableCell>
              </TableRow>
            ) : threats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No threats detected
                </TableCell>
              </TableRow>
            ) : (
              threats.map((threat) => (
                <TableRow key={threat.id}>
                  <TableCell>{new Date(threat.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{threat.type}</TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(threat.severity)}>
                      {threat.severity.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getMethodBadgeColor(threat.detection_method)}>
                      {threat.detection_method === "ml" ? "ML" : "Rule-Based"}
                    </Badge>
                  </TableCell>
                  <TableCell>{threat.source_ip || "N/A"}</TableCell>
                  <TableCell>{threat.description}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
