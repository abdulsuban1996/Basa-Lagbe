// App-level types and re-exports
export * from './database'

// Listing with landlord joined
export interface ListingWithLandlord {
  id: string
  landlord_id: string
  title: string
  category: import('./database').ListingCategory
  residential_type: import('./database').ResidentialType | null
  room_count: number | null
  commercial_type: import('./database').CommercialType | null
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
  status: import('./database').ListingStatus | null
  created_at: string | null
  expires_at: string | null
  landlords: {
    name: string
    phone: string
    is_verified: boolean | null
  } | null
}

// Application with listing joined
export interface ApplicationWithListing {
  id: string
  listing_id: string
  renter_id: string
  status: import('./database').ApplicationStatus | null
  created_at: string | null
  listings: {
    id: string
    title: string
    area: string
    city: string
    rent_amount: number
    photos: string[] | null
    category: import('./database').ListingCategory
    status: import('./database').ListingStatus | null
  } | null
}

// Application with renter joined (for landlord view)
export interface ApplicationWithRenter {
  id: string
  listing_id: string
  renter_id: string
  status: import('./database').ApplicationStatus | null
  created_at: string | null
  renters: {
    id: string
    name: string
    phone: string
    address: string
    occupation_type: import('./database').OccupationType | null
    job_title: string | null
    job_location: string | null
    institution_name: string | null
    institution_location: string | null
    is_nid_verified: boolean | null
  } | null
}

// Filter state for listings page
export interface ListingFilters {
  category?: import('./database').ListingCategory
  residential_type?: import('./database').ResidentialType
  commercial_type?: import('./database').CommercialType
  area?: string
  city?: string
  min_rent?: number
  max_rent?: number
}
