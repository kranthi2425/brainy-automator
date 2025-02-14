
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlatformType, PrivacyLevel } from "@/types/cdr";
import { DateRange } from "react-day-picker";

interface CallFiltersProps {
  dateRange: DateRange | undefined;
  setDateRange: (value: DateRange | undefined) => void;
  platform: PlatformType | "all";
  setPlatform: (value: PlatformType | "all") => void;
  privacyLevel: PrivacyLevel | "all";
  setPrivacyLevel: (value: PrivacyLevel | "all") => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function CallFilters({
  dateRange,
  setDateRange,
  platform,
  setPlatform,
  privacyLevel,
  setPrivacyLevel,
  searchQuery,
  setSearchQuery,
}: CallFiltersProps) {
  const resetFilters = () => {
    setDateRange(undefined);
    setPlatform("all");
    setPrivacyLevel("all");
    setSearchQuery("");
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>
      <Select value={platform} onValueChange={(value: PlatformType | "all") => setPlatform(value)}>
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
      <Select
        value={privacyLevel}
        onValueChange={(value: PrivacyLevel | "all") => setPrivacyLevel(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Privacy Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="public">Public</SelectItem>
          <SelectItem value="private">Private</SelectItem>
          <SelectItem value="sensitive">Sensitive</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex-1">
        <Input
          placeholder="Search by caller or callee ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button onClick={resetFilters} variant="outline">
        Reset Filters
      </Button>
    </div>
  );
}
