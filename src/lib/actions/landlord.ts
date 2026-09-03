'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Listing, ApplicationWithRenter } from '@/types'

// ---------------------------------------------------------------------------
// Helper: get authenticated landlord record
// ---------------------------------------------------------------------------
async function getAuthenticatedLandlord() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return { supabase, user: null, landlord: null }

  const { data: landlord } = await supabase
    .from('landlords')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return { supabase, user, landlord }
}

// ---------------------------------------------------------------------------
// getLandlordStats
// ---------------------------------------------------------------------------
export async function getLandlordStats(): Promise<{
  activeCount: number
  totalApplications: number
  pendingApplications: number
}> {
  const { supabase, landlord } = await getAuthenticatedLandlord()
  if (!landlord) return { activeCount: 0, totalApplications: 0, pendingApplications: 0 }

  const { data: listings } = await supabase
    .from('listings')
    .select('id, status')
    .eq('landlord_id', landlord.id)

  const listingIds = (listings ?? []).map((l: { id: string }) => l.id)
  const activeCount = (listings ?? []).filter((l: { status: string }) => l.status === 'available').length

  if (listingIds.length === 0) return { activeCount, totalApplications: 0, pendingApplications: 0 }

  const { data: apps } = await supabase
    .from('applications')
    .select('id, status')
    .in('listing_id', listingIds)

  const totalApplications = apps?.length ?? 0
  const pendingApplications = (apps ?? []).filter((a: { status: string }) => a.status === 'pending').length

  return { activeCount, totalApplications, pendingApplications }
}

// ---------------------------------------------------------------------------
// getMyListings
// ---------------------------------------------------------------------------
export async function getMyListings(): Promise<Listing[]> {
  const { supabase, landlord } = await getAuthenticatedLandlord()
  if (!landlord) return []

  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('landlord_id', landlord.id)
    .order('created_at', { ascending: false })

  return (data ?? []) as Listing[]
}

// ---------------------------------------------------------------------------
// getMyListingWithApplications
// ---------------------------------------------------------------------------
export async function getMyListingWithApplications(listingId: string): Promise<{
  listing: Listing | null
  applications: ApplicationWithRenter[]
}> {
  const { supabase, landlord } = await getAuthenticatedLandlord()
  if (!landlord) return { listing: null, applications: [] }

  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', listingId)
    .eq('landlord_id', landlord.id)
    .single()

  if (!listing) return { listing: null, applications: [] }

  const { data: apps } = await supabase
    .from('applications')
    .select(`
      id, listing_id, renter_id, status, created_at,
      renters (
        id, name, phone, address, occupation_type,
        job_title, job_location, institution_name, institution_location, is_nid_verified
      )
    `)
    .eq('listing_id', listingId)
    .order('created_at', { ascending: false })

  return {
    listing: listing as Listing,
    applications: (apps ?? []) as unknown as ApplicationWithRenter[],
  }
}

// ---------------------------------------------------------------------------
// createListing
// ---------------------------------------------------------------------------
export async function createListing(
  formData: FormData
): Promise<{ error?: string; id?: string }> {
  const { supabase, landlord } = await getAuthenticatedLandlord()
  if (!landlord) return { error: 'লগইন করুন।' }

  const category = formData.get('category') as 'residential' | 'commercial'
  const photos = formData.getAll('photos') as string[]
  const amenities = formData.getAll('amenities') as string[]

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 15)

  const insertData: Record<string, unknown> = {
    landlord_id: landlord.id,
    title: formData.get('title') as string,
    category,
    rent_amount: Number(formData.get('rent_amount')),
    address: formData.get('address') as string,
    area: formData.get('area') as string,
    thana: (formData.get('thana') as string) || null,
    city: formData.get('city') as string,
    rules: (formData.get('rules') as string) || null,
    amenities: amenities.length ? amenities : null,
    photos: photos.length ? photos : null,
    status: 'available',
    expires_at: expiresAt.toISOString(),
  }

  if (category === 'residential') {
    insertData.residential_type = formData.get('residential_type') || null
    insertData.room_count = formData.get('room_count') ? Number(formData.get('room_count')) : null
  } else {
    insertData.commercial_type = formData.get('commercial_type') || null
    insertData.size_sqft = formData.get('size_sqft') ? Number(formData.get('size_sqft')) : null
    insertData.floor_number = formData.get('floor_number') ? Number(formData.get('floor_number')) : null
    insertData.road_width = formData.get('road_width') ? Number(formData.get('road_width')) : null
  }

  const { data, error } = await supabase.from('listings').insert(insertData).select('id').single()

  if (error) return { error: 'লিস্টিং তৈরি করা সম্ভব হয়নি: ' + error.message }

  revalidatePath('/landlord/dashboard')
  revalidatePath('/listings')
  return { id: data.id }
}

// ---------------------------------------------------------------------------
// updateListing
// ---------------------------------------------------------------------------
export async function updateListing(
  listingId: string,
  formData: FormData
): Promise<{ error?: string }> {
  const { supabase, landlord } = await getAuthenticatedLandlord()
  if (!landlord) return { error: 'লগইন করুন।' }

  // Verify ownership
  const { data: existing } = await supabase
    .from('listings')
    .select('id, landlord_id')
    .eq('id', listingId)
    .single()

  if (!existing || existing.landlord_id !== landlord.id) {
    return { error: 'অনুমতি নেই।' }
  }

  const category = formData.get('category') as 'residential' | 'commercial'
  const photos = formData.getAll('photos') as string[]
  const amenities = formData.getAll('amenities') as string[]

  const updateData: Record<string, unknown> = {
    title: formData.get('title') as string,
    category,
    rent_amount: Number(formData.get('rent_amount')),
    address: formData.get('address') as string,
    area: formData.get('area') as string,
    thana: (formData.get('thana') as string) || null,
    city: formData.get('city') as string,
    rules: (formData.get('rules') as string) || null,
    amenities: amenities.length ? amenities : null,
    photos: photos.length ? photos : null,
    residential_type: null,
    room_count: null,
    commercial_type: null,
    size_sqft: null,
    floor_number: null,
    road_width: null,
  }

  if (category === 'residential') {
    updateData.residential_type = formData.get('residential_type') || null
    updateData.room_count = formData.get('room_count') ? Number(formData.get('room_count')) : null
  } else {
    updateData.commercial_type = formData.get('commercial_type') || null
    updateData.size_sqft = formData.get('size_sqft') ? Number(formData.get('size_sqft')) : null
    updateData.floor_number = formData.get('floor_number') ? Number(formData.get('floor_number')) : null
    updateData.road_width = formData.get('road_width') ? Number(formData.get('road_width')) : null
  }

  const { error } = await supabase.from('listings').update(updateData).eq('id', listingId)

  if (error) return { error: 'আপডেট করা সম্ভব হয়নি: ' + error.message }

  revalidatePath('/landlord/dashboard')
  revalidatePath(`/listings/${listingId}`)
  return {}
}

// ---------------------------------------------------------------------------
// deleteListing
// ---------------------------------------------------------------------------
export async function deleteListing(listingId: string): Promise<{ error?: string }> {
  const { supabase, landlord } = await getAuthenticatedLandlord()
  if (!landlord) return { error: 'লগইন করুন।' }

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', listingId)
    .eq('landlord_id', landlord.id)

  if (error) return { error: 'মুছতে সমস্যা হয়েছে।' }

  revalidatePath('/landlord/dashboard')
  revalidatePath('/listings')
  return {}
}

// ---------------------------------------------------------------------------
// toggleListingStatus
// ---------------------------------------------------------------------------
export async function toggleListingStatus(listingId: string): Promise<{ error?: string }> {
  const { supabase, landlord } = await getAuthenticatedLandlord()
  if (!landlord) return { error: 'লগইন করুন।' }

  const { data: listing } = await supabase
    .from('listings')
    .select('status, landlord_id')
    .eq('id', listingId)
    .single()

  if (!listing || listing.landlord_id !== landlord.id) return { error: 'অনুমতি নেই।' }

  const newStatus = listing.status === 'available' ? 'rented' : 'available'

  const { error } = await supabase
    .from('listings')
    .update({ status: newStatus })
    .eq('id', listingId)

  if (error) return { error: 'স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি।' }

  revalidatePath('/landlord/dashboard')
  return {}
}

// ---------------------------------------------------------------------------
// renewListing
// ---------------------------------------------------------------------------
export async function renewListing(listingId: string): Promise<{ error?: string }> {
  const { supabase, landlord } = await getAuthenticatedLandlord()
  if (!landlord) return { error: 'লগইন করুন।' }

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 15)

  const { error } = await supabase
    .from('listings')
    .update({ expires_at: expiresAt.toISOString() })
    .eq('id', listingId)
    .eq('landlord_id', landlord.id)

  if (error) return { error: 'নবায়ন করা সম্ভব হয়নি।' }

  revalidatePath('/landlord/dashboard')
  return {}
}

// ---------------------------------------------------------------------------
// respondToApplication
// ---------------------------------------------------------------------------
export async function respondToApplication(
  applicationId: string,
  status: 'accepted' | 'rejected'
): Promise<{ error?: string }> {
  const { supabase, landlord } = await getAuthenticatedLandlord()
  if (!landlord) return { error: 'লগইন করুন।' }

  // Get the application and verify the listing belongs to this landlord
  const { data: app } = await supabase
    .from('applications')
    .select('listing_id')
    .eq('id', applicationId)
    .single()

  if (!app) return { error: 'আবেদন পাওয়া যায়নি।' }

  const { data: listing } = await supabase
    .from('listings')
    .select('landlord_id')
    .eq('id', app.listing_id)
    .single()

  if (!listing || listing.landlord_id !== landlord.id) return { error: 'অনুমতি নেই।' }

  const { error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', applicationId)

  if (error) return { error: 'সিদ্ধান্ত নেওয়া সম্ভব হয়নি।' }

  revalidatePath('/landlord/dashboard')
  return {}
}

// ---------------------------------------------------------------------------
// redirectToNewListing (for form redirect after create)
// ---------------------------------------------------------------------------
export async function redirectAfterCreate(id: string) {
  redirect(`/listings/${id}`)
}
