'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Landlord, Renter } from '@/types'

// ---------------------------------------------------------------------------
// Register Landlord
// ---------------------------------------------------------------------------
export async function registerLandlord(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  if (!email || !password || !name || !phone || !address) {
    return { error: 'সকল তথ্য পূরণ করুন।' }
  }

  const supabase = await createClient()
  const adminClient = createAdminClient()

  // 1. Create auth user with email_confirm: true via Admin API (instantly confirmed, no email verify lock)
  const { data: authData, error: signUpError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (signUpError) {
    if (signUpError.message.includes('already been registered') || signUpError.message.includes('already registered')) {
      return { error: 'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে। অনুগ্রহ করে লগইন করুন।' }
    }
    return { error: signUpError.message }
  }

  const userId = authData.user?.id
  if (!userId) {
    return { error: 'অ্যাকাউন্ট তৈরি করা সম্ভব হয়নি। আবার চেষ্টা করুন।' }
  }

  // 2. Insert landlord profile using adminClient
  const { error: insertError } = await adminClient.from('landlords').insert({
    user_id: userId,
    name,
    phone,
    address,
  })

  if (insertError) {
    return { error: 'প্রোফাইল সংরক্ষণ করা সম্ভব হয়নি: ' + insertError.message }
  }

  // 3. Sign in to set user session cookies
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError) {
    return { error: 'লগইন সেশন তৈরি করা যায়নি: ' + signInError.message }
  }

  redirect('/landlord/dashboard')
}

// ---------------------------------------------------------------------------
// Register Renter
// ---------------------------------------------------------------------------
export async function registerRenter(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const occupation_type = formData.get('occupation_type') as 'job' | 'student' | null

  // Occupation-specific fields
  const job_title = (formData.get('job_title') as string) || null
  const job_location = (formData.get('job_location') as string) || null
  const institution_name = (formData.get('institution_name') as string) || null
  const institution_location = (formData.get('institution_location') as string) || null

  if (!email || !password || !name || !phone || !address) {
    return { error: 'সকল তথ্য পূরণ করুন।' }
  }

  const supabase = await createClient()
  const adminClient = createAdminClient()

  // 1. Create auth user with email_confirm: true via Admin API
  const { data: authData, error: signUpError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (signUpError) {
    if (signUpError.message.includes('already been registered') || signUpError.message.includes('already registered')) {
      return { error: 'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে। অনুগ্রহ করে লগইন করুন।' }
    }
    return { error: signUpError.message }
  }

  const userId = authData.user?.id
  if (!userId) {
    return { error: 'অ্যাকাউন্ট তৈরি করা সম্ভব হয়নি। আবার চেষ্টা করুন।' }
  }

  // 2. Insert renter profile using adminClient
  const { error: insertError } = await adminClient.from('renters').insert({
    user_id: userId,
    name,
    phone,
    address,
    occupation_type: occupation_type || null,
    job_title,
    job_location,
    institution_name,
    institution_location,
  })

  if (insertError) {
    return { error: 'প্রোফাইল সংরক্ষণ করা সম্ভব হয়নি: ' + insertError.message }
  }

  // 3. Sign in to set user session cookies
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError) {
    return { error: 'লগইন সেশন তৈরি করা যায়নি: ' + signInError.message }
  }

  redirect('/renter/dashboard')
}

// ---------------------------------------------------------------------------
// Login User
// ---------------------------------------------------------------------------
export async function loginUser(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'ইমেইল ও পাসওয়ার্ড দিন।' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (
      error.message.includes('Invalid login credentials') ||
      error.message.includes('invalid_credentials')
    ) {
      return { error: 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।' }
    }
    if (error.message.includes('Email not confirmed')) {
      // Auto confirm the user if blocked by email confirmation
      const adminClient = createAdminClient()
      const { data: userRes } = await adminClient.from('auth.users').select('id').eq('email', email).maybeSingle()
      if (userRes?.id) {
        await adminClient.auth.admin.updateUserById(userRes.id, { email_confirm: true })
        // retry sign in
        const retry = await supabase.auth.signInWithPassword({ email, password })
        if (!retry.error) {
          const profile = await getCurrentProfile()
          if (profile.userType === 'landlord') redirect('/landlord/dashboard')
          if (profile.userType === 'renter') redirect('/renter/dashboard')
          redirect('/')
        }
      }
      return { error: 'অনুগ্রহ করে আবার লগইন বাটনে ক্লিক করুন।' }
    }
    return { error: error.message }
  }

  // Determine user type and redirect
  const profile = await getCurrentProfile()
  if (profile.userType === 'landlord') {
    redirect('/landlord/dashboard')
  } else if (profile.userType === 'renter') {
    redirect('/renter/dashboard')
  } else {
    redirect('/')
  }
}

// ---------------------------------------------------------------------------
// Logout User
// ---------------------------------------------------------------------------
export async function logoutUser(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

// ---------------------------------------------------------------------------
// Get Current Profile
// ---------------------------------------------------------------------------
export async function getCurrentProfile(): Promise<{
  landlord?: Landlord
  renter?: Renter
  userType?: 'landlord' | 'renter'
}> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) return {}

  // Try landlord first
  const { data: landlord } = await supabase
    .from('landlords')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (landlord) {
    return { landlord: landlord as Landlord, userType: 'landlord' }
  }

  // Try renter
  const { data: renter } = await supabase
    .from('renters')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (renter) {
    return { renter: renter as Renter, userType: 'renter' }
  }

  return {}
}
