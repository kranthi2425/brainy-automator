export type CallStatus = 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'missed';
export type PlatformType = 'voip' | 'pstn' | 'sip' | 'mobile' | 'desktop' | 'iot';
export type PrivacyLevel = 'public' | 'private' | 'sensitive';
export type ConsentStatus = 'obtained' | 'pending' | 'not_required';

export interface Call {
  id: string;
  caller_id: string;
  callee_id: string;
  start_time: string;
  end_time?: string | null;
  duration?: string | null;
  status: CallStatus;
  platform: PlatformType;
  call_type: string;
  geographic_location?: string | null;
  case_id?: string | null;
  metadata?: any;  // Changed from Record<string, any> to any to match Supabase's Json type
  created_at: string;
  updated_at: string;
  // New compliance fields
  data_retention_period?: string | null;
  privacy_level?: PrivacyLevel | null;
  data_jurisdiction?: string | null;
  consent_status?: ConsentStatus | null;
  last_accessed_at?: string | null;
  anonymized?: boolean | null;
}

export interface CallAnalytics {
  time_bucket: string;
  call_count: number;
  platform: PlatformType;
  status: CallStatus;
  call_type: string;
  geographic_location: string | null;
  avg_duration_seconds: number;
}

export interface CallAuditLog {
  id: string;
  call_id: string;
  action_type: 'access' | 'modification' | 'deletion' | 'export';
  action_timestamp: string;
  actor_id?: string;
  actor_ip?: string;
  action_details?: Record<string, any>;
  created_at: string;
}

export type ThreatSeverity = "high" | "medium" | "low";
export type DetectionMethod = "ml" | "rule-based";

export interface Threat {
  id: string;
  timestamp: string;
  type: string;
  severity: ThreatSeverity;
  description: string;
  source_ip: string | null;
  data_volume: number | null;
  detection_method: DetectionMethod;
  created_at: string;
}
