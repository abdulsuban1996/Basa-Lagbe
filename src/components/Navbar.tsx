'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Search, Building2, Users,
  LogIn, UserPlus, Menu, X
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

import type { SiteSettings } from '@/lib/actions/settings'

const NAV_LINKS = [
  { href: '/listings',           label: 'বাসা খুঁজুন',  icon: Search    },
  { href: '/landlord/dashboard', label: 'বাড়িওয়ালা',   icon: Building2 },
  { href: '/renter/dashboard',   label: 'ভাড়াটে',      icon: Users     },
]

export function Navbar({ settings }: { settings?: Partial<SiteSettings> }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)

  /* Scroll-aware shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close mobile menu on route change */
  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-gray-200/70 bg-white/96 shadow-sm backdrop-blur-xl'
          : 'border-b border-gray-100   bg-white/92 backdrop-blur-md'
      )}
    >
      {/* ─── Main bar ─────────────────────────────────────────── */}
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          {settings?.logo_url ? (
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xs flex items-center justify-center p-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.logo_url}
                alt={settings?.site_name || 'লোগো'}
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <motion.div
              whileHover={{ rotate: 14, scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-ocean text-white shadow-md"
            >
              <Home className="h-[18px] w-[18px]" />
            </motion.div>
          )}
          <div className="flex flex-col justify-center leading-none">
            <span className="text-[17px] font-extrabold tracking-tight text-slate-ocean">
              {settings?.site_name || 'বাসা লাগবে'}
            </span>
            <span className="hidden text-[10px] font-medium text-gray-400 sm:block">
              {settings?.site_tagline || 'বাংলাদেশের রেন্টাল প্ল্যাটফর্ম'}
            </span>
          </div>
        </Link>

        {/* Desktop centre nav — hidden on mobile */}
        <nav className="hidden items-center justify-center gap-1 sm:flex">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13.5px] font-medium transition-colors duration-150',
                  active
                    ? 'text-slate-ocean font-semibold'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-slate-ocean'
                )}
              >
                <Icon
                  className={cn(
                    'h-[15px] w-[15px] shrink-0 transition-colors',
                    active ? 'text-slate-ocean' : 'text-gray-400'
                  )}
                />
                {label}

                {/* Animated active underline */}
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-slate-ocean"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Desktop right — auth buttons + mobile hamburger */}
        <div className="flex items-center justify-end gap-2">
          {/* Desktop auth */}
          <div className="hidden items-center gap-2 sm:flex">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-xl px-3.5 py-[7px] text-[13.5px] font-semibold text-slate-ocean ring-1 ring-slate-ocean/25 transition-all hover:bg-slate-ocean hover:text-white hover:ring-transparent"
              >
                <LogIn className="h-[15px] w-[15px]" />
                লগইন
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/landlord/register"
                className="flex items-center gap-1.5 rounded-xl bg-slate-ocean px-3.5 py-[7px] text-[13.5px] font-semibold text-white shadow-sm transition-all hover:bg-slate-ocean/85 hover:shadow-md"
              >
                <UserPlus className="h-[15px] w-[15px]" />
                রেজিস্ট্রেশন
              </Link>
            </motion.div>
          </div>

          {/* Mobile hamburger */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label="মেনু"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-600 ring-1 ring-gray-200 transition-colors hover:bg-gray-100 sm:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span key="close"
                  initial={{ rotate: -80, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 80, opacity: 0 }} transition={{ duration: 0.14 }}
                >
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span key="open"
                  initial={{ rotate: 80, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -80, opacity: 0 }} transition={{ duration: 0.14 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ─── Mobile menu ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-nav-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border-t border-gray-100 bg-white/97 backdrop-blur-xl sm:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">

              {/* Nav links with stagger */}
              {NAV_LINKS.map(({ href, label, icon: Icon }, i) => {
                const active = pathname === href || pathname.startsWith(href + '/')
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.045, duration: 0.17 }}
                  >
                    <Link
                      href={href}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                        active
                          ? 'bg-cloud-mint/70 text-slate-ocean font-semibold'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-slate-ocean'
                      )}
                    >
                      <span className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                        active ? 'bg-slate-ocean text-white' : 'bg-gray-100 text-gray-500'
                      )}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1">{label}</span>
                      {active && (
                        <span className="text-xs font-bold text-slate-ocean/50">●</span>
                      )}
                    </Link>
                  </motion.div>
                )
              })}

              {/* Divider */}
              <div className="my-1.5 h-px bg-gray-100" />

              {/* Auth buttons */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.17 }}
                className="flex flex-col gap-2 pb-1"
              >
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-ocean/30 py-2.5 text-sm font-semibold text-slate-ocean transition-colors hover:bg-slate-ocean/5"
                >
                  <LogIn className="h-4 w-4" /> লগইন করুন
                </Link>
                <Link
                  href="/landlord/register"
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-ocean py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-ocean/85"
                >
                  <UserPlus className="h-4 w-4" /> রেজিস্ট্রেশন করুন
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
