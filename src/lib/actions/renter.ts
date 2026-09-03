'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSiteSettings } from '@/lib/actions/settings'
import type { ApplicationWithListing, Listing } from '@/types'

// ---------------------------------------------------------------------------
// Helper: get authenticated renter record
// ---------------------------------------------------------------------------
async function getAuthenticatedRenter() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) return { supabase, user: null, renter: null }

  const { data: renter } = await supabase
    .from('renters')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return { supabase, user, renter }
}

// ---------------------------------------------------------------------------
// getMyApplications
// ---------------------------------------------------------------------------
export async function getMyApplications(): Promise<ApplicationWithListing[]> {
  const { supabase, renter } = await getAuthenticatedRenter()
  if (!renter) return []

  const { data, error } = await supabase
    .from('applications')
    .select(
      `
      id,
      listing_id,
      renter_id,
      status,
      created_at,
      listings (
        id,
        title,
        area,
        city,
        rent_amount,
        photos,
        category,
        status
      )
    `
    )
    .eq('renter_id', renter.id)
    .order('created_at', { ascending: false })

  if (error) return []
  return (data ?? []) as unknown as ApplicationWithListing[]
}

// ---------------------------------------------------------------------------
// applyToListing
// ---------------------------------------------------------------------------
export async function applyToListing(
  listingId: string
): Promise<{ error?: string }> {
  const { supabase, renter } = await getAuthenticatedRenter()

  if (!renter) {
    return { error: 'প্রথমে রেজিস্ট্রেশন করুন' }
  }

  const { error } = await supabase.from('applications').insert({
    listing_id: listingId,
    renter_id: renter.id,
    status: 'pending',
  })

  if (error) {
    // Postgres unique violation code: 23505
    if (error.code === '23505') {
      return { error: 'আপনি ইতিমধ্যে এই লিস্টিংয়ে Apply করেছেন' }
    }
    return { error: 'আবেদন করা সম্ভব হয়নি। আবার চেষ্টা করুন।' }
  }

  return {}
}

// ---------------------------------------------------------------------------
// getMyBookmarks
// ---------------------------------------------------------------------------
export async function getMyBookmarks(): Promise<Listing[]> {
  const { supabase, renter } = await getAuthenticatedRenter()
  if (!renter) return []

  const { data, error } = await supabase
    .from('bookmarks')
    .select(
      `
      listings (
        id,
        landlord_id,
        title,
        category,
        residential_type,
        room_count,
        commercial_type,
        size_sqft,
        floor_number,
        road_width,
        rent_amount,
        address,
        area,
        thana,
        city,
        latitude,
        longitude,
        amenities,
        rules,
        photos,
        status,
        created_at,
        expires_at
      )
    `
    )
    .eq('renter_id', renter.id)
    .order('created_at', { ascending: false })

  if (error) return []

  // Supabase returns nested join as array; take first element
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? [])
    .map((row: any) => {
      const l = Array.isArray(row.listings) ? row.listings[0] : row.listings
      return l ?? null
    })
    .filter(Boolean) as Listing[]
}

// ---------------------------------------------------------------------------
// toggleBookmark
// ---------------------------------------------------------------------------
export async function toggleBookmark(
  listingId: string
): Promise<{ bookmarked: boolean; error?: string }> {
  const { supabase, renter } = await getAuthenticatedRenter()

  if (!renter) {
    return { bookmarked: false, error: 'প্রথমে লগইন করুন' }
  }

  // Check if bookmark already exists
  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('renter_id', renter.id)
    .eq('listing_id', listingId)
    .maybeSingle()

  if (existing) {
    // Remove bookmark
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', existing.id)

    if (error) return { bookmarked: true, error: 'সেভ মুছতে সমস্যা হয়েছে।' }
    return { bookmarked: false }
  }

  // Add bookmark
  const { error } = await supabase.from('bookmarks').insert({
    renter_id: renter.id,
    listing_id: listingId,
  })

  if (error) return { bookmarked: false, error: 'সেভ করতে সমস্যা হয়েছে।' }
  return { bookmarked: true }
}

// ---------------------------------------------------------------------------
// isBookmarked
// ---------------------------------------------------------------------------
export async function isBookmarked(listingId: string): Promise<boolean> {
  const { supabase, renter } = await getAuthenticatedRenter()
  if (!renter) return false

  const { data } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('renter_id', renter.id)
    .eq('listing_id', listingId)
    .maybeSingle()

  return !!data
}

// ---------------------------------------------------------------------------
// requestDirectNumber
// ---------------------------------------------------------------------------
export async function requestDirectNumber(
  listingId: string,
  data: {
    payment_method: 'bkash' | 'nagad'
    payment_number: string
    payment_transaction_id: string
  }
): Promise<{ error?: string }> {
  const { supabase, renter } = await getAuthenticatedRenter()

  if (!renter) {
    return { error: 'প্রথমে রেজিস্ট্রেশন করুন' }
  }

  const settings = await getSiteSettings()
  const chargeAmount = parseFloat(settings.payment_amount) || 20

  const { error } = await supabase.from('direct_call_requests').insert({
    renter_id: renter.id,
    listing_id: listingId,
    amount: chargeAmount,
    payment_method: data.payment_method,
    payment_number: data.payment_number,
    payment_transaction_id: data.payment_transaction_id,
    status: 'pending',
  })

  if (error) {
    return { error: 'অনুরোধ পাঠানো সম্ভব হয়নি। আবার চেষ্টা করুন।' }
  }

  return {}
}

// ---------------------------------------------------------------------------
// getMyDirectCalls
// ---------------------------------------------------------------------------
export type DirectCallWithListing = {
  id: string
  listing_id: string
  status: 'pending' | 'verified' | 'rejected'
  created_at: string
  payment_method: string
  payment_number: string
  payment_transaction_id: string
  amount: number
  listings: {
    id: string
    title: string
    area: string
    city: string
    rent_amount: number
    photos: string[]
    status: string
    landlords?: {
      name: string
      phone: string
      is_verified?: boolean
    }
  }
}

export async function getMyDirectCalls(): Promise<DirectCallWithListing[]> {
  const { renter } = await getAuthenticatedRenter()
  if (!renter) return []

  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from('direct_call_requests')
    .select(
      `
      id,
      listing_id,
      status,
      created_at,
      payment_method,
      payment_number,
      payment_transaction_id,
      amount,
      listings (
        id,
        title,
        area,
        city,
        rent_amount,
        photos,
        status,
        landlords (
          name,
          phone,
          is_verified
        )
      )
    `
    )
    .eq('renter_id', renter.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getMyDirectCalls error:', error)
    return []
  }

  // Sanitize: only reveal phone if status is 'verified'
  const list = (data ?? []).map((req: any) => {
    if (req.status !== 'verified' && req.listings?.landlords) {
      req.listings.landlords.phone = ''
    }
    return req
  })

  return list as unknown as DirectCallWithListing[]
}

// ---------------------------------------------------------------------------
// getListingDirectCallStatus
// ---------------------------------------------------------------------------
export async function getListingDirectCallStatus(listingId: string): Promise<{
  status?: 'pending' | 'verified' | 'rejected'
  landlordPhone?: string
  landlordName?: string
}> {
  const { renter } = await getAuthenticatedRenter()
  if (!renter) return {}

  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from('direct_call_requests')
    .select(
      `
      status,
      listings (
        landlords (
          name,
          phone
        )
      )
    `
    )
    .eq('renter_id', renter.id)
    .eq('listing_id', listingId)
    .order('created_at', { ascending: false })

  if (error || !data || data.length === 0) return {}

  // Prioritize verified request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const verifiedReq = data.find((r: any) => r.status === 'verified')
  const targetReq = verifiedReq || data[0]

  const status = targetReq.status as 'pending' | 'verified' | 'rejected'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listingData = targetReq.listings as any
  const landlordPhone = status === 'verified' ? listingData?.landlords?.phone : undefined
  const landlordName = status === 'verified' ? listingData?.landlords?.name : undefined

  return { status, landlordPhone, landlordName }
}
