import Link from 'next/link'
import { Home, Mail, MapPin, Search, Building2, Users, LayoutDashboard, LogIn, Phone } from 'lucide-react'
import type { SiteSettings } from '@/lib/actions/settings'

export function Footer({ settings }: { settings?: Partial<SiteSettings> }) {
  const siteName = settings?.site_name || 'বাসা লাগবে'
  const siteTagline = settings?.site_tagline || 'রেন্টাল প্ল্যাটফর্ম'
  const companyEmail = settings?.company_email || 'support@basalagbe.com.bd'
  const companyAddress = settings?.company_address || 'ঢাকা, বাংলাদেশ'
  const companyPhone = settings?.company_phone
  const footerAbout = settings?.footer_about || 'বাংলাদেশের সেরা রেন্টাল প্ল্যাটফর্ম। সহজে বাসা খুঁজুন এবং পোস্ট করুন।'

  return (
    <footer className="relative bg-white border-t-2 border-gray-100">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-slate-ocean via-slate-ocean/60 to-cloud-mint" />

      <div className="mx-auto max-w-7xl px-4 pt-8 pb-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5">
              {settings?.logo_url ? (
                <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs flex items-center justify-center p-0.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={settings.logo_url}
                    alt={siteName}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-ocean shadow-md">
                  <Home className="h-5 w-5 text-white" />
                </div>
              )}
              <div className="flex flex-col leading-none">
                <span className="text-[17px] font-extrabold tracking-tight text-slate-ocean">{siteName}</span>
                <span className="text-[10px] font-semibold text-gray-500">{siteTagline}</span>
              </div>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {footerAbout}
            </p>
            <div className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-cloud-mint px-3 py-1.5 text-xs font-bold text-slate-ocean">
              🇧🇩 বাংলাদেশের জন্য তৈরি
            </div>
          </div>

          {/* Renters */}
          <div className="flex flex-col gap-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-ocean">
              <Users className="h-4 w-4 text-slate-ocean" />
              ভাড়াটেদের জন্য
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { href: '/listings',         label: 'বাসা খুঁজুন',  icon: Search         },
                { href: '/renter/register',  label: 'রেজিস্ট্রেশন', icon: Users          },
                { href: '/renter/dashboard', label: 'ড্যাশবোর্ড',   icon: LayoutDashboard },
              ].map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} className="group flex items-center gap-2.5 text-sm font-medium text-gray-600 transition-colors hover:text-slate-ocean">
                    <Icon className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-slate-ocean" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Landlords */}
          <div className="flex flex-col gap-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-ocean">
              <Building2 className="h-4 w-4 text-slate-ocean" />
              বাড়িওয়ালাদের জন্য
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { href: '/landlord/register',  label: 'বাসা পোস্ট করুন', icon: Building2       },
                { href: '/landlord/dashboard', label: 'ড্যাশবোর্ড',       icon: LayoutDashboard },
                { href: '/login',              label: 'লগইন করুন',        icon: LogIn           },
              ].map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} className="group flex items-center gap-2.5 text-sm font-medium text-gray-600 transition-colors hover:text-slate-ocean">
                    <Icon className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-slate-ocean" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-ocean">
              <Phone className="h-4 w-4 text-slate-ocean" />
              যোগাযোগ
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2.5 text-sm font-medium text-gray-600">
                <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                {companyEmail}
              </li>
              <li className="flex items-center gap-2.5 text-sm font-medium text-gray-600">
                <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                {companyAddress}
              </li>
              {companyPhone && (
                <li className="flex items-center gap-2.5 text-sm font-medium text-gray-600">
                  <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                  {companyPhone}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:justify-between">
          <p className="text-xs font-medium text-gray-500">
            © {new Date().getFullYear()} বাসা লাগবে — সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="text-xs font-medium text-gray-500">
            Made with ❤️ for Bangladesh
          </p>
        </div>
      </div>
    </footer>
  )
}
