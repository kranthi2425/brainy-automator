
import { Call, PrivacyLevel } from "@/types/cdr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Shield } from "lucide-react";

interface CallTableProps {
  calls: Call[];
  loading: boolean;
}

export default function CallTable({ calls, loading }: CallTableProps) {
  const getPrivacyBadgeColor = (level?: PrivacyLevel | null) => {
    switch (level) {
      case "sensitive":
        return "text-red-500";
      case "private":
        return "text-yellow-500";
      case "public":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Privacy</TableHead>
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
            <TableCell colSpan={9} className="text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : calls.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center">
              No call records found
            </TableCell>
          </TableRow>
        ) : (
          calls.map((call) => (
            <TableRow key={call.id}>
              <TableCell>
                <Shield
                  className={`h-4 w-4 ${getPrivacyBadgeColor(call.privacy_level)}`}
                />
              </TableCell>
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
  );
}
