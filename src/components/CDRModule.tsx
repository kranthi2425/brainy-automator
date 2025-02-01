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

const mockCDRData = [
  {
    id: 1,
    timestamp: "2024-03-20 14:30:00",
    sourceNumber: "+1234567890",
    destinationNumber: "+0987654321",
    duration: "00:05:23",
    callType: "Voice",
  },
  {
    id: 2,
    timestamp: "2024-03-20 15:15:00",
    sourceNumber: "+1234567891",
    destinationNumber: "+0987654322",
    duration: "00:02:45",
    callType: "SMS",
  },
];

export default function CDRModule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Detail Records</CardTitle>
        <CardDescription>
          Analysis of communication patterns and metadata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCDRData.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.timestamp}</TableCell>
                <TableCell>{record.sourceNumber}</TableCell>
                <TableCell>{record.destinationNumber}</TableCell>
                <TableCell>{record.duration}</TableCell>
                <TableCell>{record.callType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}