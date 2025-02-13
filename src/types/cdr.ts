
export type CallStatus = 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'missed';
export type PlatformType = 'voip' | 'pstn' | 'sip' | 'mobile' | 'desktop' | 'iot';
export type PrivacyLevel = 'public' | 'private' | 'sensitive';
export type ConsentStatus = 'obtained' | 'pending' | 'not_required';

export interface Call {
  id: string;
  caller_id: string;
  callee_id: string;
  start_time: string;
  end_time?: string;
  duration?: string;
  status: CallStatus;
  platform: PlatformType;
  call_type: string;
  geographic_location?: string;
  case_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  // New compliance fields
  data_retention_period?: string;
  privacy_level?: PrivacyLevel;
  data_jurisdiction?: string;
  consent_status?: ConsentStatus;
  last_accessed_at?: string;
  anonymized?: boolean;
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
