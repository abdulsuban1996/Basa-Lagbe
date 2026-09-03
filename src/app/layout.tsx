import type { Metadata } from 'next'
import { Hind_Siliguri } from 'next/font/google'
import './globals.css'
import { AppLayout } from '@/components/AppLayout'
import { getSiteSettings } from '@/lib/actions/settings'

const hindSiliguri = Hind_Siliguri({
  variable: '--font-hind-siliguri',
  subsets: ['bengali', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: `${settings.site_name} — ${settings.site_tagline}`,
    description: settings.footer_about || 'বাসা, মেস, ফ্ল্যাট, অফিস, শোরুম, গুদাম — সহজে খুঁজুন বাংলাদেশে।',
    icons: settings.favicon_url ? [{ rel: 'icon', url: settings.favicon_url }] : undefined,
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteSettings = await getSiteSettings()

  return (
    <html lang="bn" className={`${hindSiliguri.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <AppLayout siteSettings={siteSettings}>{children}</AppLayout>
      </body>
    </html>
  )
}
