// ============================================================
// Basa Lagbe — Database Types (matches Supabase schema exactly)
// ============================================================

// ---- Enums ----
export type ListingCategory = 'residential' | 'commercial'
export type ResidentialType = 'bachelor' | 'family' | 'sublet'
export type CommercialType = 'office' | 'showroom' | 'godown' | 'empty_space'
export type ListingStatus = 'available' | 'rented'
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected'
export type DirectCallStatus = 'pending' | 'verified' | 'rejected'
export type ReportStatus = 'pending' | 'reviewed'
export type OccupationType = 'job' | 'student'
export type PaymentMethod = 'bkash' | 'nagad'

// ---- Table: landlords ----
export interface Landlord {
  id: string
  user_id: string
  name: string
  phone: string
  address: string
  is_verified: boolean | null
  created_at: string | null
}

export interface LandlordInsert {
  id?: string
  user_id: string
  name: string
  phone: string
  address: string
  is_verified?: boolean | null
  created_at?: string | null
}

// ---- Table: renters ----
export interface Renter {
  id: string
  user_id: string
  name: string
  phone: string
  address: string
  occupation_type: OccupationType | null
  job_title: string | null
  job_location: string | null
  institution_name: string | null
  institution_location: string | null
  is_nid_verified: boolean | null
  created_at: string | null
}

export interface RenterInsert {
  id?: string
  user_id: string
  name: string
  phone: string
  address: string
  occupation_type?: OccupationType | null
  job_title?: string | null
  job_location?: string | null
  institution_name?: string | null
  institution_location?: string | null
  is_nid_verified?: boolean | null
  created_at?: string | null
}

// ---- Table: listings ----
export interface Listing {
  id: string
  landlord_id: string
  title: string
  category: ListingCategory
  residential_type: ResidentialType | null
  room_count: number | null
  commercial_type: CommercialType | null
  size_sqft: number | null
  floor_number: number | null
  road_width: number | null
  rent_amount: number
  address: string
  area: string
  thana: string | null
  city: string
  latitude: number | null
  longitude: number | null
  amenities: string[] | null
  rules: string | null
  photos: string[] | null
  status: ListingStatus | null
  created_at: string | null
  expires_at: string | null
}

export interface ListingInsert {
  id?: string
  landlord_id: string
  title: string
  category: ListingCategory
  residential_type?: ResidentialType | null
  room_count?: number | null
  commercial_type?: CommercialType | null
  size_sqft?: number | null
  floor_number?: number | null
  road_width?: number | null
  rent_amount: number
  address: string
  area: string
  thana?: string | null
  city: string
  latitude?: number | null
  longitude?: number | null
  amenities?: string[] | null
  rules?: string | null
  photos?: string[] | null
  status?: ListingStatus | null
  created_at?: string | null
  expires_at?: string | null
}

// ---- Table: applications ----
export interface Application {
  id: string
  listing_id: string
  renter_id: string
  status: ApplicationStatus | null
  created_at: string | null
}

export interface ApplicationInsert {
  id?: string
  listing_id: string
  renter_id: string
  status?: ApplicationStatus | null
  created_at?: string | null
}

// ---- Table: bookmarks ----
export interface Bookmark {
  id: string
  renter_id: string
  listing_id: string
  created_at: string | null
}

export interface BookmarkInsert {
  id?: string
  renter_id: string
  listing_id: string
  created_at?: string | null
}

// ---- Table: direct_call_requests ----
export interface DirectCallRequest {
  id: string
  renter_id: string
  listing_id: string
  amount: number
  payment_method: PaymentMethod | null
  payment_number: string | null
  payment_transaction_id: string | null
  nid_front_url: string | null
  nid_back_url: string | null
  status: DirectCallStatus | null
  verified_by: string | null
  created_at: string | null
}

export interface DirectCallRequestInsert {
  id?: string
  renter_id: string
  listing_id: string
  amount: number
  payment_method?: PaymentMethod | null
  payment_number?: string | null
  payment_transaction_id?: string | null
  nid_front_url?: string | null
  nid_back_url?: string | null
  status?: DirectCallStatus | null
  verified_by?: string | null
  created_at?: string | null
}

// ---- Table: reports ----
export interface Report {
  id: string
  listing_id: string
  reported_by_renter_id: string | null
  reason: string
  status: ReportStatus | null
  created_at: string | null
}

export interface ReportInsert {
  id?: string
  listing_id: string
  reported_by_renter_id?: string | null
  reason: string
  status?: ReportStatus | null
  created_at?: string | null
}
