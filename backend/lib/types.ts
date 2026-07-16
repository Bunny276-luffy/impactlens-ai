// ============================================================
// ImpactLens AI — Shared Type Contracts
// All entity types map to future Supabase table schemas.
// No database code here — pure TypeScript interfaces.
// ============================================================

export type UserRole = 'Super Admin' | 'NGO Admin' | 'Volunteer' | 'Donor';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  ngo_id: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: UserProfile;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface NGO {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  contact_email: string;
  contact_phone: string | null;
  address: string | null;
  city: string | null;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface Beneficiary {
  id: string;
  ngo_id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  guardian_name: string | null;
  guardian_phone: string | null;
  school: string | null;
  address: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  attendance_rate: number | null;
  nutrition_score: number | null;
  ai_risk_level: 'Critical' | 'High' | 'Moderate' | 'Low' | 'Stable' | null;
  ai_risk_score: number | null;
  program_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  ngo_id: string;
  name: string;
  description: string | null;
  category: 'Education' | 'Nutrition' | 'Health' | 'Vocational' | 'General';
  status: 'Active' | 'Paused' | 'Completed' | 'Draft';
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  beneficiary_count: number;
  created_at: string;
  updated_at: string;
}

export interface Volunteer {
  id: string;
  user_id: string;
  ngo_id: string;
  name: string;
  email: string;
  phone: string | null;
  specialization: string | null;
  status: 'Active' | 'Inactive' | 'On Leave';
  tasks_completed: number;
  joined_at: string;
  created_at: string;
}

export interface VolunteerTask {
  id: string;
  volunteer_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: 'Pending' | 'In Progress' | 'Done' | 'Overdue';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  created_at: string;
  updated_at: string;
}

export interface FieldActivity {
  id: string;
  ngo_id: string;
  volunteer_id: string;
  beneficiary_id: string | null;
  program_id: string | null;
  title: string;
  description: string | null;
  activity_date: string;
  location: string | null;
  impact_score: number | null;
  evidence_urls: string[];
  status: 'Pending Verification' | 'Verified' | 'Flagged';
  created_at: string;
}

export interface Evidence {
  id: string;
  activity_id: string;
  uploader_id: string;
  file_url: string;
  file_type: 'Image' | 'Document' | 'Video';
  file_name: string;
  file_size_bytes: number;
  hash: string | null;
  is_duplicate: boolean;
  created_at: string;
}

export interface Donation {
  id: string;
  ngo_id: string;
  donor_id: string | null;
  beneficiary_id: string | null;
  program_id: string | null;
  amount: number;
  currency: string;
  category: 'Food' | 'Education' | 'Health' | 'Infrastructure' | 'General';
  status: 'Pending' | 'Confirmed' | 'Disbursed' | 'Refunded';
  note: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'Info' | 'Warning' | 'Critical' | 'Success';
  is_read: boolean;
  created_at: string;
}

export interface AnalyticsSnapshot {
  stats: {
    total_beneficiaries: number;
    total_ngos: number;
    total_donations: number;
    total_raised: number;
    active_volunteers: number;
    active_programs: number;
    health_risk_alerts: number;
    avg_nutrition_score: number;
    avg_attendance_rate: number;
  };
  priority_distribution: {
    critical: number;
    high: number;
    moderate: number;
    stable: number;
  };
  monthly_donations: Array<{ month: string; amount: number; count: number }>;
  nutrition_attendance_scatter: Array<{ nutrition: number; attendance: number; risk: number }>;
}

export interface AIRecommendation {
  id: string;
  beneficiary_id: string;
  beneficiary_name: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
  category: 'Health' | 'Academic' | 'Nutrition' | 'Social';
  recommendation: string;
  confidence_score: number;
  generated_at: string;
}

// Pagination wrapper
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}
