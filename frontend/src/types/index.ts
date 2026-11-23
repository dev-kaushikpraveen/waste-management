export type UserRole = 'CITIZEN' | 'COLLECTOR' | 'RECYCLER' | 'ADMIN' | 'SUPER_ADMIN';

export type BatchStatus = 
  | 'CREATED'
  | 'COLLECTED'
  | 'IN_TRANSIT'
  | 'RECEIVED'
  | 'SORTED'
  | 'PROCESSING'
  | 'PROCESSED'
  | 'RECYCLED'
  | 'REJECTED';

export type CollectionStatus = 
  | 'PENDING'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type ComplaintStatus = 
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED';

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  college_name?: string;
  hostel_name?: string;
  avatar_url?: string;
}

export interface Bin {
  id: number;
  bin_code: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  area: string;
  bin_type: string;
  capacity_liters: number;
  max_weight_kg: number;
  current_fill_percent: number;
  current_weight_kg: number;
  status: 'ACTIVE' | 'COLLECTION_NEEDED' | 'OVERFLOW' | 'MAINTENANCE';
  battery_level?: number;
  last_reported_at: string;
}

export interface BatchEvent {
  id: number;
  status: BatchStatus;
  actor_id?: number;
  actor_role?: string;
  location?: string;
  notes?: string;
  recorded_weight_kg?: number;
  timestamp: string;
}

export interface WasteBatch {
  id: number;
  batch_code: string;
  plastic_type: string;
  source_location: string;
  source_type: string;
  initial_weight_kg: number;
  received_weight_kg: number;
  processed_weight_kg: number;
  status: BatchStatus;
  qr_code_url?: string;
  created_at: string;
  events?: BatchEvent[];
}

export interface PickupRequest {
  id: number;
  request_code: string;
  waste_category: string;
  estimated_weight_kg: number;
  pickup_address: string;
  contact_phone: string;
  preferred_time_slot: string;
  status: CollectionStatus;
  created_at: string;
}

export interface Wallet {
  id: number;
  user_id: number;
  balance_points: number;
  lifetime_points: number;
  tier: string;
}

export interface RewardTransaction {
  id: number;
  amount_points: number;
  transaction_type: 'CREDIT' | 'DEBIT';
  reason: string;
  created_at: string;
}

export interface LeaderboardUser {
  rank: number;
  user_name: string;
  college_name?: string;
  hostel_name?: string;
  total_points: number;
  total_waste_kg: number;
}

export interface MarketplaceListing {
  id: number;
  seller_id: number;
  title: string;
  material_type: string;
  quantity_available_kg: number;
  price_per_kg: number;
  quality_grade: string;
  location: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface Complaint {
  id: number;
  complaint_code: string;
  category: string;
  description: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  status: ComplaintStatus;
  resolution_notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface EnvironmentalImpact {
  total_waste_collected_kg: number;
  total_plastic_recycled_kg: number;
  co2_saved_kg: number;
  trees_equivalent: number;
  landfill_diverted_m3: number;
  active_smart_bins: number;
  verified_recycling_rate_percent: number;
}
