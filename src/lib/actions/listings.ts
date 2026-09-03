'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Listing, ListingWithLandlord, ListingFilters } from '@/types'

// ---------------------------------------------------------------------------
// getListings — public, filterable
// ---------------------------------------------------------------------------
export async function getListings(filters?: ListingFilters): Promise<Listing[]> {
  const supabase = await createClient()

  let query = supabase
    .from('listings')
    .select('*')
    .eq('status', 'available')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(20)

  if (filters?.category) query = query.eq('category', filters.category)
  if (filters?.residential_type) query = query.eq('residential_type', filters.residential_type)
  if (filters?.commercial_type) query = query.eq('commercial_type', filters.commercial_type)
  if (filters?.area) query = query.ilike('area', `%${filters.area}%`)
  if (filters?.city) query = query.ilike('city', `%${filters.city}%`)
  if (filters?.min_rent) query = query.gte('rent_amount', filters.min_rent)
  if (filters?.max_rent) query = query.lte('rent_amount', filters.max_rent)

  const { data } = await query
  return (data ?? []) as Listing[]
}

// ---------------------------------------------------------------------------
// getListingById — with landlord join
// ---------------------------------------------------------------------------
export async function getListingById(id: string): Promise<ListingWithLandlord | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      landlords (
        name,
        phone,
        is_verified
      )
    `)
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as ListingWithLandlord
}

// ---------------------------------------------------------------------------
// getRecentListings — latest 6 available
// ---------------------------------------------------------------------------
export async function getRecentListings(): Promise<Listing[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'available')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(6)

  return (data ?? []) as Listing[]
}

// ---------------------------------------------------------------------------
// getAreas — distinct areas for filter dropdown
// ---------------------------------------------------------------------------
export async function getAreas(): Promise<string[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('listings')
    .select('area')
    .eq('status', 'available')
    .order('area')

  if (!data) return []
  const unique = [...new Set(data.map((r: { area: string }) => r.area).filter(Boolean))]
  return unique
}

// ---------------------------------------------------------------------------
// createReport
// ---------------------------------------------------------------------------
export async function createReport(
  listingId: string,
  reason: string
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Get renter id if logged in
  let renterIdValue: string | null = null
  if (user) {
    const { data: renter } = await supabase
      .from('renters')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()
    renterIdValue = renter?.id ?? null
  }

  const { error } = await supabase.from('reports').insert({
    listing_id: listingId,
    reported_by_renter_id: renterIdValue,
    reason,
    status: 'pending',
  })

  if (error) return { error: 'রিপোর্ট পাঠানো সম্ভব হয়নি।' }

  revalidatePath(`/listings/${listingId}`)
  return {}
}
