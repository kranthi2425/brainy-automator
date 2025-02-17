
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Threat, ThreatSeverity, DetectionMethod } from "@/types/cdr";

export default function ThreatDetection() {
  const [threats, setThreats] = useState<Threat[]>([]);

  useEffect(() => {
    // Fetch initial threats
    fetchThreats();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('public:threats')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'threats' },
        (payload) => {
          const newThreat = {
            ...payload.new,
            severity: payload.new.severity.toLowerCase() as ThreatSeverity,
            detection_method: payload.new.detection_method.toLowerCase() as DetectionMethod
          };
          setThreats(current => [...current, newThreat as Threat]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchThreats = async () => {
    const { data, error } = await supabase
      .from('threats')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching threats:', error);
      return;
    }

    // Cast both severity and detection_method to ensure they match the expected types
    const typedThreats = data.map(threat => ({
      ...threat,
      severity: threat.severity.toLowerCase() as ThreatSeverity,
      detection_method: threat.detection_method.toLowerCase() as DetectionMethod
    }));
    
    setThreats(typedThreats);
  };

  const getSeverityColor = (severity: ThreatSeverity) => {
    switch (severity) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Threat Detection</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {threats.map((threat) => (
            <li key={threat.id} className="mb-4 border rounded-md p-4">
              <div className="flex items-center space-x-2">
                <Shield className={`h-4 w-4 ${getSeverityColor(threat.severity)}`} />
                <span className="font-semibold">{threat.type}</span>
                <span className="text-sm text-gray-500">
                  ({new Date(threat.timestamp).toLocaleString()})
                </span>
              </div>
              <p className="text-sm mt-1">
                {threat.description} (Data Volume: {threat.data_volume})
              </p>
              {threat.source_ip && (
                <p className="text-xs text-gray-600 mt-1">Source IP: {threat.source_ip}</p>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
