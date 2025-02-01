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

const mockThreats = [
  {
    id: 1,
    timestamp: "2024-03-20 14:30:00",
    type: "Suspicious Traffic Pattern",
    severity: "high",
    description: "Unusual data transfer volume detected",
  },
  {
    id: 2,
    timestamp: "2024-03-20 15:15:00",
    type: "Multiple Failed Attempts",
    severity: "medium",
    description: "Multiple failed connection attempts from single source",
  },
];

export default function ThreatDetection() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detected Threats</CardTitle>
        <CardDescription>
          Recent suspicious activities and potential threats
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockThreats.map((threat) => (
              <TableRow key={threat.id}>
                <TableCell>{threat.timestamp}</TableCell>
                <TableCell>{threat.type}</TableCell>
                <TableCell>
                  <Badge variant={getSeverityColor(threat.severity)}>
                    {threat.severity.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{threat.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}