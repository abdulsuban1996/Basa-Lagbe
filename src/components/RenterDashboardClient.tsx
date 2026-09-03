'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import {
  Home, Bookmark, ArrowRight, Clock, Search,
  FileText, CheckCircle2, XCircle, MapPin,
  BanknoteIcon, CalendarDays, ChevronRight, Users,
  PhoneCall, Phone, Copy, Check, ShieldCheck,
  AlertCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ListingCard } from '@/components/ListingCard'
import type { ApplicationWithListing, Listing } from '@/types'
import type { DirectCallWithListing } from '@/lib/actions/renter'

const STATUS_CONFIG: Record<string, {
  label: string
  variant: 'pending' | 'accepted' | 'rejected'
  icon: React.ElementType
  bg: string
  text: string
}> = {
  pending:  { label: 'পেন্ডিং',  variant: 'pending',  icon: Clock,         bg: 'bg-amber-50',   text: 'text-amber-600' },
  accepted: { label: 'গৃহীত',    variant: 'accepted',  icon: CheckCircle2,  bg: 'bg-emerald-50', text: 'text-emerald-600' },
  rejected: { label: 'বাতিল',    variant: 'rejected',  icon: XCircle,       bg: 'bg-red-50',     text: 'text-red-500' },
}

export function RenterDashboardClient({
  renterName,
  applications,
  bookmarks,
  directCalls = [],
}: {
  renterName: string
  applications: ApplicationWithListing[]
  bookmarks: Listing[]
  directCalls?: DirectCallWithListing[]
}) {
  const [activeTab, setActiveTab] = useState<'applications' | 'calls' | 'bookmarks'>('calls')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const firstName = renterName.split(' ')[0]
  const pendingCount   = applications.filter((a) => a.status === 'pending').length
  const acceptedCount  = applications.filter((a) => a.status === 'accepted').length
  const verifiedCallsCount = directCalls.filter((c) => c.status === 'verified').length

  const handleCopyPhone = (id: string, phone: string) => {
    if (!phone) return
    navigator.clipboard.writeText(phone)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── HERO HEADER BANNER ─── */}
      <div className="relative overflow-hidden bg-slate-ocean px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 left-1/4 h-48 w-48 rounded-full bg-cloud-mint/10" />
        <div className="pointer-events-none absolute right-1/3 top-0 h-32 w-32 rounded-full bg-white/[0.03]" />

        <div className="relative mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold text-cloud-mint backdrop-blur-sm">
                <Users className="h-3.5 w-3.5" />
                ভাড়াটে অ্যাকাউন্ট
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                আমার ড্যাশবোর্ড
              </h1>
              <p className="mt-1.5 text-base text-white/60">
                স্বাগতম,{' '}
                <span className="font-bold text-cloud-mint">{firstName}</span>!
                আপনার সব আবেদন ও অনুমোদিত কল নম্বর এখানে।
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/listings"
                className="inline-flex items-center gap-2.5 rounded-2xl bg-cloud-mint px-6 py-3.5 text-sm font-extrabold text-slate-ocean shadow-lg shadow-black/20 transition hover:bg-cloud-mint/90"
              >
                <Search className="h-4 w-4" />
                বাসা খুঁজুন
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ─── STAT CARDS (overlap hero) ─── */}
      <div className="relative mx-auto -mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: 'ডাইরেক্ট নম্বর',
              value: directCalls.length,
              sub: verifiedCallsCount > 0 ? `${verifiedCallsCount}টি অনুমোদিত` : 'পেন্ডিং',
              icon: PhoneCall,
              color: 'text-emerald-700',
              iconBg: 'bg-emerald-100',
              border: 'border-emerald-200',
            },
            {
              label: 'মোট আবেদন',
              value: applications.length,
              sub: 'সব আবেদন',
              icon: FileText,
              color: 'text-slate-ocean',
              iconBg: 'bg-cloud-mint',
              border: 'border-cloud-mint/30',
            },
            {
              label: 'পেন্ডিং আবেদন',
              value: pendingCount,
              sub: 'বিবেচনাধীন',
              icon: Clock,
              color: pendingCount > 0 ? 'text-amber-600' : 'text-gray-400',
              iconBg: pendingCount > 0 ? 'bg-amber-50' : 'bg-gray-50',
              border: pendingCount > 0 ? 'border-amber-200' : 'border-gray-200',
            },
            {
              label: 'গৃহীত আবেদন',
              value: acceptedCount,
              sub: 'সফল',
              icon: CheckCircle2,
              color: acceptedCount > 0 ? 'text-emerald-600' : 'text-gray-400',
              iconBg: acceptedCount > 0 ? 'bg-emerald-50' : 'bg-gray-50',
              border: acceptedCount > 0 ? 'border-emerald-200' : 'border-gray-200',
            },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`flex items-center gap-3.5 rounded-2xl border ${stat.border} bg-white p-4 sm:p-5 shadow-md shadow-black/5`}
              >
                <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${stat.iconBg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{stat.label}</p>
                  <p className={`mt-0.5 text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-5xl px-4 pb-16 sm:px-6 lg:px-8 space-y-8">

        {/* ─── TAB NAVIGATION ─── */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 overflow-x-auto">
          {[
            {
              id: 'calls',
              label: 'ডাইরেক্ট কল নম্বর',
              icon: PhoneCall,
              count: directCalls.length,
              badgeColor: verifiedCallsCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600',
            },
            {
              id: 'applications',
              label: 'আমার আবেদন সমূহ',
              icon: FileText,
              count: applications.length,
              badgeColor: 'bg-slate-ocean/10 text-slate-ocean',
            },
            {
              id: 'bookmarks',
              label: 'সেভ করা বাসা',
              icon: Bookmark,
              count: bookmarks.length,
              badgeColor: 'bg-gray-100 text-gray-600',
            },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-ocean text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cloud-mint' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tab.badgeColor}`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* ─── TAB 1: DIRECT CALL NUMBERS (ডাইরেক্ট কল নম্বর সমূহ) ─── */}
        {activeTab === 'calls' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-gray-800">
                  <PhoneCall className="h-5 w-5 text-emerald-600" />
                  <span>ডাইরেক্ট কল নম্বর অনুরোধ সমূহ</span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    {directCalls.length}টি
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  অ্যাডমিন অনুমোদনের পর এখানে বাড়িওয়ালার সরাসরি ফোন নম্বর দেখতে পারবেন এবং কল করতে পারবেন।
                </p>
              </div>
            </div>

            {directCalls.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white py-16 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <PhoneCall className="h-8 w-8" />
                </div>
                <p className="mt-4 text-base font-bold text-gray-700">কোনো ডাইরেক্ট নম্বর অনুরোধ নেই</p>
                <p className="mt-1 max-w-xs text-xs text-gray-400">
                  যেকোনো লিস্টিং পেজে গিয়ে সরাসরি বাড়িওয়ালার নম্বরের জন্য অনুরোধ করতে পারেন।
                </p>
                <Link
                  href="/listings"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-ocean px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-ocean/90"
                >
                  লিস্টিং দেখুন <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {directCalls.map((req, idx) => {
                  const listing = req.listings
                  const isVerified = req.status === 'verified'
                  const isPending = req.status === 'pending'
                  const isRejected = req.status === 'rejected'
                  const landlordPhone = listing?.landlords?.phone

                  return (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.05 }}
                      className={`overflow-hidden rounded-3xl border bg-white shadow-xs transition hover:shadow-md ${
                        isVerified
                          ? 'border-emerald-200 ring-1 ring-emerald-100'
                          : isPending
                          ? 'border-amber-200'
                          : 'border-red-200'
                      }`}
                    >
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                          {/* Left: Listing thumbnail & details */}
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                              {listing?.photos?.[0] ? (
                                <Image
                                  src={listing.photos[0]}
                                  alt={listing.title ?? ''}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-gray-400">
                                  <Home className="h-6 w-6" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                                  isVerified
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : isPending
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {isVerified && <><CheckCircle2 className="h-3 w-3 text-emerald-600" /> অনুমোদিত</>}
                                  {isPending && <><Clock className="h-3 w-3 text-amber-600" /> যাচাইাধীন (পেন্ডিং)</>}
                                  {isRejected && <><XCircle className="h-3 w-3 text-red-600" /> বাতিল করা হয়েছে</>}
                                </span>
                                <span className="text-[11px] text-gray-400">
                                  পেমেন্ট: {req.payment_method === 'bkash' ? 'বিকাশ' : 'নগদ'} (৳{req.amount || 20})
                                </span>
                              </div>

                              <Link
                                href={`/listings/${req.listing_id}`}
                                className="block truncate text-base font-extrabold text-slate-ocean hover:underline"
                              >
                                {listing?.title || 'লিস্টিং'}
                              </Link>

                              <p className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                {listing?.area}, {listing?.city} • ৳{listing?.rent_amount?.toLocaleString('bn-BD')}/মাস
                              </p>
                            </div>
                          </div>

                          {/* Right: Phone Box or Status Explanation */}
                          {/* Right: Phone Box or Status Explanation */}
                          <div className="flex-shrink-0">
                            {isVerified ? (
                              <div className="flex flex-col sm:items-end gap-2 rounded-2xl bg-emerald-50/80 border border-emerald-200 p-3 sm:px-4">
                                <div className="text-left sm:text-right">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                                    বাড়িওয়ালার নম্বর ({listing?.landlords?.name || 'বাড়িওয়ালা'})
                                  </span>
                                  <span className="font-mono text-lg font-black text-slate-ocean tracking-wide">
                                    {landlordPhone || 'নম্বর লোড হচ্ছে...'}
                                  </span>
                                </div>

                                {landlordPhone && (
                                  <div className="flex items-center gap-2">
                                    <a
                                      href={`tel:${landlordPhone}`}
                                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                                    >
                                      <Phone className="h-3.5 w-3.5" />
                                      সরাসরি কল করুন
                                    </a>

                                    <button
                                      type="button"
                                      onClick={() => handleCopyPhone(req.id, landlordPhone)}
                                      className="inline-flex items-center gap-1 rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition cursor-pointer"
                                    >
                                      {copiedId === req.id ? (
                                        <><Check className="h-3.5 w-3.5 text-emerald-600" /> কপি হয়েছে</>
                                      ) : (
                                        <><Copy className="h-3.5 w-3.5" /> কপি</>
                                      )}
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : isPending ? (
                              <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-3 max-w-xs text-xs text-amber-800 space-y-1">
                                <p className="font-bold flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                                  পেমেন্ট যাচাই চলছে
                                </p>
                                <p className="text-[11px] text-amber-700/80 leading-relaxed">
                                  TrxID: <span className="font-mono font-bold">{req.payment_transaction_id}</span>। অ্যাডমিন অনুমোদন দিলেই এখানে নম্বর প্রদর্শিত হবে।
                                </p>
                              </div>
                            ) : isRejected ? (
                              <div className="rounded-2xl bg-red-50 border border-red-200/80 p-3 max-w-xs text-xs text-red-800 space-y-1">
                                <p className="font-bold flex items-center gap-1">
                                  <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                                  অনুরোধ বাতিল করা হয়েছে
                                </p>
                                <p className="text-[11px] text-red-600/80 leading-relaxed">
                                  পেমেন্ট ট্রানজেকশন আইডি অমিল হওয়ার কারণে অ্যাডমিন বাতিল করেছেন।
                                </p>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* ─── TAB 2: APPLICATIONS SECTION ─── */}
        {activeTab === 'applications' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-gray-800">
                <FileText className="h-5 w-5 text-slate-ocean" />
                <span>আমার আবেদন সমূহ</span>
                <span className="rounded-full bg-slate-ocean/10 px-2.5 py-0.5 text-xs font-bold text-slate-ocean">
                  {applications.length}টি
                </span>
              </h2>
            </div>

            {applications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white py-16 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cloud-mint/30">
                  <Clock className="h-8 w-8 text-slate-ocean" />
                </div>
                <p className="mt-4 text-base font-bold text-gray-700">এখনো কোনো আবেদন করেননি</p>
                <p className="mt-1 max-w-xs text-xs text-gray-400">
                  পছন্দের বাসা খুঁজে বিনামূল্যে এখনই আবেদন করুন
                </p>
                <Link
                  href="/listings"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-ocean px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-ocean/90"
                >
                  বাসা খুঁজুন <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {applications.map((app, idx) => {
                  const listing = app.listings
                  const statusCfg = STATUS_CONFIG[app.status ?? 'pending']
                  const StatusIcon = statusCfg.icon

                  return (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.05 }}
                      className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xs transition hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                        {/* Thumbnail & Title */}
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                            {listing?.photos?.[0] ? (
                              <Image
                                src={listing.photos[0]}
                                alt={listing.title ?? ''}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-400">
                                <Home className="h-6 w-6" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 space-y-1">
                            <span className="rounded-full bg-slate-ocean/8 px-2.5 py-0.5 text-[10px] font-bold text-slate-ocean">
                              {listing?.category === 'residential' ? 'আবাসিক' : 'বাণিজ্যিক'}
                            </span>
                            <Link
                              href={`/listings/${app.listing_id}`}
                              className="block truncate text-base font-extrabold text-slate-ocean hover:underline"
                            >
                              {listing?.title || 'লিস্টিং'}
                            </Link>
                            <p className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="h-3.5 w-3.5 text-gray-400" />
                              {listing?.area}, {listing?.city} • ৳{listing?.rent_amount?.toLocaleString('bn-BD')}/মাস
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 border-t border-gray-100 pt-3 sm:border-0 sm:pt-0">
                          <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold ${statusCfg.bg} ${statusCfg.text}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusCfg.label}
                          </span>
                          <Link
                            href={`/listings/${app.listing_id}`}
                            className="text-xs font-bold text-slate-ocean hover:underline flex items-center gap-1"
                          >
                            লিস্টিং দেখুন <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* ─── TAB 3: BOOKMARKS SECTION ─── */}
        {activeTab === 'bookmarks' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-gray-800">
                <Bookmark className="h-5 w-5 text-slate-ocean" />
                <span>সেভ করা বাসা সমূহ</span>
                <span className="rounded-full bg-slate-ocean/10 px-2.5 py-0.5 text-xs font-bold text-slate-ocean">
                  {bookmarks.length}টি
                </span>
              </h2>
            </div>

            {bookmarks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white py-16 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cloud-mint/30">
                  <Bookmark className="h-8 w-8 text-slate-ocean" />
                </div>
                <p className="mt-4 text-base font-bold text-gray-700">কোনো বাসা সেভ করেননি</p>
                <p className="mt-1 max-w-xs text-xs text-gray-400">
                  পছন্দের বাসা সেভ করে রাখুন যাতে পরে সহজে খুঁজে পান
                </p>
                <Link
                  href="/listings"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-ocean px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-slate-ocean/90"
                >
                  বাসা খুঁজুন <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {bookmarks.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  )
}
