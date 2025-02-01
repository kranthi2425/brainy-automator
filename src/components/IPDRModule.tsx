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

const mockIPDRData = [
  {
    id: 1,
    timestamp: "2024-03-20 14:30:00",
    sourceIP: "192.168.1.100",
    destinationIP: "203.0.113.1",
    protocol: "HTTP",
    dataVolume: "1.5 GB",
  },
  {
    id: 2,
    timestamp: "2024-03-20 15:15:00",
    sourceIP: "192.168.1.101",
    destinationIP: "203.0.113.2",
    protocol: "HTTPS",
    dataVolume: "500 MB",
  },
];

export default function IPDRModule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>IP Detail Records</CardTitle>
        <CardDescription>Network traffic analysis and patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Source IP</TableHead>
              <TableHead>Destination IP</TableHead>
              <TableHead>Protocol</TableHead>
              <TableHead>Data Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockIPDRData.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.timestamp}</TableCell>
                <TableCell>{record.sourceIP}</TableCell>
                <TableCell>{record.destinationIP}</TableCell>
                <TableCell>
                  <Badge variant="outline">{record.protocol}</Badge>
                </TableCell>
                <TableCell>{record.dataVolume}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}