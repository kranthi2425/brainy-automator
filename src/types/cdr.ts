
export type CallStatus = 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'missed';
export type PlatformType = 'voip' | 'pstn' | 'sip' | 'mobile' | 'desktop' | 'iot';

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
