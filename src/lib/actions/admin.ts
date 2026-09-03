'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

// ---------------------------------------------------------------------------
// getAdminStats
// ---------------------------------------------------------------------------
export async function getAdminStats(): Promise<{
  listings: number
  landlords: number
  renters: number
  applications: number
}> {
  const supabase = createAdminClient()

  const [listingsRes, landlordsRes, rentersRes, applicationsRes] =
    await Promise.all([
      supabase.from('listings').select('id', { count: 'exact', head: true }),
      supabase.from('landlords').select('id', { count: 'exact', head: true }),
      supabase.from('renters').select('id', { count: 'exact', head: true }),
      supabase.from('applications').select('id', { count: 'exact', head: true }),
    ])

  return {
    listings: listingsRes.count ?? 0,
    landlords: landlordsRes.count ?? 0,
    renters: rentersRes.count ?? 0,
    applications: applicationsRes.count ?? 0,
  }
}

// ---------------------------------------------------------------------------
// reviewReport
// ---------------------------------------------------------------------------
export async function reviewReport(
  reportId: string
): Promise<{ error?: string }> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('reports')
    .update({ status: 'reviewed' })
    .eq('id', reportId)

  if (error) return { error: 'রিভিউ আপডেট করা সম্ভব হয়নি।' }

  revalidatePath('/admin')
  return {}
}

// ---------------------------------------------------------------------------
// approveDirectCall
// ---------------------------------------------------------------------------
export async function approveDirectCall(
  requestId: string
): Promise<{ error?: string }> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('direct_call_requests')
    .update({ status: 'verified' })
    .eq('id', requestId)

  if (error) return { error: 'অনুমোদন করা সম্ভব হয়নি।' }

  revalidatePath('/admin')
  return {}
}

// ---------------------------------------------------------------------------
// rejectDirectCall
// ---------------------------------------------------------------------------
export async function rejectDirectCall(
  requestId: string
): Promise<{ error?: string }> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('direct_call_requests')
    .update({ status: 'rejected' })
    .eq('id', requestId)

  if (error) return { error: 'বাতিল করা সম্ভব হয়নি।' }

  revalidatePath('/admin')
  return {}
}

// ---------------------------------------------------------------------------
// adminDeleteListing
// ---------------------------------------------------------------------------
export async function adminDeleteListing(
  listingId: string
): Promise<{ error?: string }> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', listingId)

  if (error) return { error: 'লিস্টিং মুছে ফেলা সম্ভব হয়নি।' }

  revalidatePath('/admin')
  revalidatePath('/listings')
  return {}
}

// ---------------------------------------------------------------------------
// adminToggleListingStatus
// ---------------------------------------------------------------------------
export async function adminToggleListingStatus(
  listingId: string,
  currentStatus: string
): Promise<{ error?: string }> {
  const supabase = createAdminClient()
  const nextStatus = currentStatus === 'available' ? 'rented' : 'available'

  const { error } = await supabase
    .from('listings')
    .update({ status: nextStatus })
    .eq('id', listingId)

  if (error) return { error: 'স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি।' }

  revalidatePath('/admin')
  revalidatePath('/listings')
  return {}
}

// ---------------------------------------------------------------------------
// getAdminListings
// ---------------------------------------------------------------------------
export async function getAdminListings() {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('listings')
    .select(`
      id, title, category, residential_type, commercial_type,
      rent_amount, area, city, status, created_at,
      landlords ( name, phone )
    `)
    .order('created_at', { ascending: false })
    .limit(30)

  return data ?? []
}

// ---------------------------------------------------------------------------
// getAdminUsers
// ---------------------------------------------------------------------------
export async function getAdminUsers() {
  const supabase = createAdminClient()

  const [landlordsRes, rentersRes] = await Promise.all([
    supabase
      .from('landlords')
      .select('id, name, phone, address, is_verified, created_at')
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('renters')
      .select('id, name, phone, address, occupation_type, is_nid_verified, created_at')
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  return {
    landlords: landlordsRes.data ?? [],
    renters: rentersRes.data ?? [],
  }
}
