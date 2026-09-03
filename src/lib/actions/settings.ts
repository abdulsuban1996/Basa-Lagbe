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

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name: 'বাসা লাগবে',
  site_tagline: 'বাংলাদেশের রেন্টাল প্ল্যাটফর্ম',
  company_address: 'ত্রিশাল, ময়মনসিংহ',
  company_email: 'hello.saddamhosen@gmail.com',
  company_phone: '০১৮৯৩০৭৩৯৫২',
  payment_method: 'bkash',
  payment_number: '01893073952',
  payment_amount: '20',
  footer_about: 'বাংলাদেশের সেরা রেন্টাল প্ল্যাটফর্ম। সহজে বাসা খুঁজুন এবং পোস্ট করুন।',
  favicon_url: '',
  logo_url: '',
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('site_settings').select('key, value')
    if (error || !data) return DEFAULT_SITE_SETTINGS

    const map: Record<string, string> = {}
    for (const row of data ?? []) map[row.key] = row.value ?? ''
    return {
      site_name:       map.site_name       || DEFAULT_SITE_SETTINGS.site_name,
      site_tagline:    map.site_tagline    || DEFAULT_SITE_SETTINGS.site_tagline,
      company_address: map.company_address || DEFAULT_SITE_SETTINGS.company_address,
      company_email:   map.company_email   || DEFAULT_SITE_SETTINGS.company_email,
      company_phone:   map.company_phone   || DEFAULT_SITE_SETTINGS.company_phone,
      payment_method:  map.payment_method  || DEFAULT_SITE_SETTINGS.payment_method,
      payment_number:  map.payment_number  || DEFAULT_SITE_SETTINGS.payment_number,
      payment_amount:  map.payment_amount  || DEFAULT_SITE_SETTINGS.payment_amount,
      footer_about:    map.footer_about    || DEFAULT_SITE_SETTINGS.footer_about,
      favicon_url:     map.favicon_url     || DEFAULT_SITE_SETTINGS.favicon_url,
      logo_url:        map.logo_url        || DEFAULT_SITE_SETTINGS.logo_url,
    }
  } catch {
    return DEFAULT_SITE_SETTINGS
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
