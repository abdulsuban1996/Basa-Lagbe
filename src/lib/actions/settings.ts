'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export type SiteSettings = {
  site_name: string
  site_tagline: string
  company_address: string
  company_email: string
  company_phone: string
  payment_method: string
  payment_number: string
  payment_amount: string
  footer_about: string
  favicon_url: string
  logo_url: string
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createAdminClient()
  const { data } = await supabase.from('site_settings').select('key, value')
  const map: Record<string, string> = {}
  for (const row of data ?? []) map[row.key] = row.value ?? ''
  return {
    site_name:       map.site_name       ?? 'বাসা লাগবে',
    site_tagline:    map.site_tagline    ?? 'বাংলাদেশের রেন্টাল প্ল্যাটফর্ম',
    company_address: map.company_address ?? '',
    company_email:   map.company_email   ?? '',
    company_phone:   map.company_phone   ?? '',
    payment_method:  map.payment_method  ?? 'bkash',
    payment_number:  map.payment_number  ?? '',
    payment_amount:  map.payment_amount  ?? '30',
    footer_about:    map.footer_about    ?? '',
    favicon_url:     map.favicon_url     ?? '',
    logo_url:        map.logo_url        ?? '',
  }
}

export async function updateSiteSettings(
  settings: Partial<SiteSettings>
): Promise<{ error?: string }> {
  try {
    const supabase = createAdminClient()
    const rows = Object.entries(settings).map(([key, value]) => ({
      key,
      value: value ?? '',
      updated_at: new Date().toISOString(),
    }))
    const { error } = await supabase
      .from('site_settings')
      .upsert(rows, { onConflict: 'key' })
    if (error) return { error: error.message }
    revalidatePath('/', 'layout')
    return {}
  } catch (e) {
    return { error: String(e) }
  }
}
