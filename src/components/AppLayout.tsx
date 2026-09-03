'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import type { SiteSettings } from '@/lib/actions/settings'

// Routes where Navbar + Footer are both hidden
const NO_NAV_FOOTER_ROUTES = ['/login', '/landlord/register', '/renter/register']

// Routes where Navbar is shown but Footer is hidden (dashboard pages)
const NO_FOOTER_PREFIXES = ['/landlord/dashboard', '/renter/dashboard']

export function AppLayout({
  children,
  siteSettings,
}: {
  children: React.ReactNode
  siteSettings?: SiteSettings
}) {
  const pathname = usePathname()

  const hideAll =
    NO_NAV_FOOTER_ROUTES.includes(pathname) || pathname.startsWith('/admin')

  const hideFooterOnly = NO_FOOTER_PREFIXES.some((p) => pathname.startsWith(p))

  if (hideAll) {
    return <main className="min-h-full flex-1">{children}</main>
  }

  return (
    <>
      <Navbar settings={siteSettings} />
      <main className="flex-1">{children}</main>
      {!hideFooterOnly && <Footer settings={siteSettings} />}
    </>
  )
}
