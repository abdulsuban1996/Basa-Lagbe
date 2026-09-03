'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import {
  ShieldCheck,
  Home,
  Building2,
  Users,
  AlertTriangle,
  PhoneCall,
  CheckCircle,
  Trash2,
  ExternalLink,
  LogOut,
  Globe,
  Search,
  Check,
  X,
  Clock,
  FileText,
  BadgeCheck,
  Settings,
} from 'lucide-react'
import {
  reviewReport,
  approveDirectCall,
  rejectDirectCall,
  adminDeleteListing,
  adminToggleListingStatus,
} from '@/lib/actions/admin'
import { AdminSettingsTab } from '@/components/admin/AdminSettingsTab'
import type { SiteSettings } from '@/lib/actions/settings'


interface AdminStats {
  listings: number
  landlords: number
  renters: number
  applications: number
}

interface AdminDashboardClientProps {
  adminEmail: string
  stats: AdminStats
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  initialReports: any[]
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  initialCallRequests: any[]
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  initialListings: any[]
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  initialUsers: {
    landlords: any[]
    renters: any[]
  }
  initialSettings: SiteSettings
}

export function AdminDashboardClient({
  adminEmail,
  stats,
  initialReports,
  initialCallRequests,
  initialListings,
  initialUsers,
  initialSettings,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'reports' | 'calls' | 'listings' | 'users' | 'settings'>('reports')
  const [reports, setReports] = useState(initialReports)
  const [callRequests, setCallRequests] = useState(initialCallRequests)
  const [listings, setListings] = useState(initialListings)
  const [listingSearch, setListingSearch] = useState('')
  const [userTab, setUserTab] = useState<'landlords' | 'renters'>('landlords')

  const [isPending, startTransition] = useTransition()
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const showNotice = (text: string, type: 'success' | 'error' = 'success') => {
    setActionMessage({ text, type })
    setTimeout(() => setActionMessage(null), 4000)
  }

  // Handle Review Report
  const handleReviewReport = (reportId: string) => {
    startTransition(async () => {
      const res = await reviewReport(reportId)
      if (res.error) {
        showNotice(res.error, 'error')
      } else {
        setReports((prev) => prev.filter((r) => r.id !== reportId))
        showNotice('রিপোর্ট সফলভাবে রিভিউ সম্পন্ন হিসেবে চিহ্নিত হয়েছে!')
      }
    })
  }

  // Handle Approve Call Request
  const handleApproveCall = (requestId: string) => {
    startTransition(async () => {
      const res = await approveDirectCall(requestId)
      if (res.error) {
        showNotice(res.error, 'error')
      } else {
        setCallRequests((prev) => prev.filter((r) => r.id !== requestId))
        showNotice('ডাইরেক্ট নম্বর অনুরোধ অনুমোদন করা হয়েছে!')
      }
    })
  }

  // Handle Reject Call Request
  const handleRejectCall = (requestId: string) => {
    startTransition(async () => {
      const res = await rejectDirectCall(requestId)
      if (res.error) {
        showNotice(res.error, 'error')
      } else {
        setCallRequests((prev) => prev.filter((r) => r.id !== requestId))
        showNotice('অনুরোধ বাতিল করা হয়েছে!')
      }
    })
  }

  // Handle Admin Delete Listing
  const handleDeleteListing = (listingId: string, title: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে "${title}" লিস্টিংটি মুছে ফেলতে চান?`)) return
    startTransition(async () => {
      const res = await adminDeleteListing(listingId)
      if (res.error) {
        showNotice(res.error, 'error')
      } else {
        setListings((prev) => prev.filter((l) => l.id !== listingId))
        setReports((prev) => prev.filter((r) => r.listings?.id !== listingId))
        showNotice('লিস্টিং মুছে ফেলা হয়েছে!')
      }
    })
  }

  // Handle Toggle Listing Status
  const handleToggleStatus = (listingId: string, currentStatus: string) => {
    startTransition(async () => {
      const res = await adminToggleListingStatus(listingId, currentStatus)
      if (res.error) {
        showNotice(res.error, 'error')
      } else {
        setListings((prev) =>
          prev.map((l) =>
            l.id === listingId
              ? { ...l, status: currentStatus === 'available' ? 'rented' : 'available' }
              : l
          )
        )
        showNotice('লিস্টিংয়ের স্ট্যাটাস পরিবর্তন করা হয়েছে!')
      }
    })
  }

  // Filtered listings
  const filteredListings = listings.filter((l) => {
    const q = listingSearch.toLowerCase()
    return (
      (l.title && l.title.toLowerCase().includes(q)) ||
      (l.area && l.area.toLowerCase().includes(q)) ||
      (l.city && l.city.toLowerCase().includes(q)) ||
      (l.landlords?.name && l.landlords.name.toLowerCase().includes(q))
    )
  })

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* ─── ADMIN HEADER BAR ─── */}
      <header className="sticky top-0 z-40 border-b border-slate-700/40 bg-slate-ocean text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand — Main Site Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cloud-mint shadow-sm">
              <Home className="h-5 w-5 text-slate-ocean" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">বাসা লাগবে</span>
                <span className="rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-cloud-mint">
                  অ্যাডমিন প্যানেল
                </span>
              </div>
              <p className="text-[11px] text-white/60">সিস্টেম ব্যবস্থাপনা ও নিয়ন্ত্রণ</p>
            </div>
          </div>

          {/* Right — Website button only (opens in new tab) */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            <Globe className="h-3.5 w-3.5 text-cloud-mint" />
            ওয়েবসাইট দেখুন
          </Link>
        </div>
      </header>

      {/* ─── TOAST NOTIFICATION ─── */}
      <AnimatePresence>
        {actionMessage && (
          <motion.div
            key="admin-toast-message"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg backdrop-blur-md ${
              actionMessage.type === 'success'
                ? 'bg-emerald-600 text-white shadow-emerald-900/20'
                : 'bg-red-600 text-white shadow-red-900/20'
            }`}
          >
            {actionMessage.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <span>{actionMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ─── STATS SECTION ─── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            {
              label: 'মোট লিস্টিং',
              value: stats.listings,
              icon: Home,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
            },
            {
              label: 'বাড়িওয়ালা',
              value: stats.landlords,
              icon: Building2,
              color: 'text-emerald-600',
              bg: 'bg-emerald-50',
            },
            {
              label: 'ভাড়াটে',
              value: stats.renters,
              icon: Users,
              color: 'text-purple-600',
              bg: 'bg-purple-50',
            },
            {
              label: 'মোট আবেদন',
              value: stats.applications,
              icon: FileText,
              color: 'text-indigo-600',
              bg: 'bg-indigo-50',
            },
            {
              label: 'পেন্ডিং রিপোর্ট',
              value: reports.length,
              icon: AlertTriangle,
              color: reports.length > 0 ? 'text-amber-600' : 'text-gray-500',
              bg: reports.length > 0 ? 'bg-amber-50 ring-1 ring-amber-200' : 'bg-gray-50',
              highlight: reports.length > 0,
            },
            {
              label: 'কল অনুরোধ',
              value: callRequests.length,
              icon: PhoneCall,
              color: callRequests.length > 0 ? 'text-teal-600' : 'text-gray-500',
              bg: callRequests.length > 0 ? 'bg-teal-50 ring-1 ring-teal-200' : 'bg-gray-50',
              highlight: callRequests.length > 0,
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className={`flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs transition hover:shadow-md ${
                  item.highlight ? 'ring-2 ring-slate-ocean/10' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500">{item.label}</span>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${item.bg}`}>
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-black text-gray-900">{item.value}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* ─── TAB CONTROLS ─── */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
          {[
            {
              id: 'reports',
              label: 'পেন্ডিং রিপোর্ট',
              icon: AlertTriangle,
              count: reports.length,
              badgeColor: reports.length > 0 ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600',
            },
            {
              id: 'calls',
              label: 'ডাইরেক্ট নম্বর অনুরোধ',
              icon: PhoneCall,
              count: callRequests.length,
              badgeColor: callRequests.length > 0 ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600',
            },
            {
              id: 'listings',
              label: 'সকল লিস্টিং ব্যবস্থাপনা',
              icon: Home,
              count: listings.length,
              badgeColor: 'bg-gray-100 text-gray-600',
            },
            {
              id: 'users',
              label: 'ব্যবহারকারী তালিকা',
              icon: Users,
              count: initialUsers.landlords.length + initialUsers.renters.length,
              badgeColor: 'bg-gray-100 text-gray-600',
            },
            {
              id: 'settings',
              label: 'সাইট সেটিং',
              icon: Settings,
              count: null,
              badgeColor: 'bg-gray-100 text-gray-600',
            },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-slate-ocean text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cloud-mint' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tab.badgeColor}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ─── TAB 1: REPORTS ─── */}
        {activeTab === 'reports' && (
          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  অভিযোগ ও রিপোর্ট ({reports.length})
                </h2>
                <p className="text-xs text-gray-500">ভাড়াটেদের করা আপত্তিজনক লিস্টিং রিপোর্টসমূহ</p>
              </div>
            </div>

            {reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-800">কোনো পেন্ডিং রিপোর্ট নেই</h3>
                <p className="mt-1 text-xs text-gray-500">বর্তমানে কোনো লিস্টিং নিয়ে আপত্তি বা রিপোর্ট জমা নেই।</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                      <tr>
                        <th className="px-5 py-3.5 font-bold">লিস্টিংয়ের তথ্য</th>
                        <th className="px-5 py-3.5 font-bold">রিপোর্টের কারণ</th>
                        <th className="px-5 py-3.5 font-bold">জমা দেওয়ার সময়</th>
                        <th className="px-5 py-3.5 text-right font-bold">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {reports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50/60 transition">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-gray-900">
                              {report.listings?.title || 'লিস্টিং পাওয়া যায়নি'}
                            </div>
                            {report.listings?.id && (
                              <Link
                                href={`/listings/${report.listings.id}`}
                                target="_blank"
                                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-ocean hover:underline"
                              >
                                <span>সরাসরি দেখুন</span>
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2 text-xs font-medium text-amber-900">
                              {report.reason}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-gray-400" />
                              <span>
                                {report.created_at
                                  ? new Date(report.created_at).toLocaleDateString('bn-BD', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })
                                  : '—'}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                disabled={isPending}
                                onClick={() => handleReviewReport(report.id)}
                                className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>রিভিউ সম্পন্ন</span>
                              </button>
                              {report.listings?.id && (
                                <button
                                  disabled={isPending}
                                  onClick={() =>
                                    handleDeleteListing(report.listings.id, report.listings.title)
                                  }
                                  className="inline-flex items-center gap-1 rounded-xl bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100"
                                  title="লিস্টিং মুছে ফেলুন"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>লিস্টিং রিমুভ</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ─── TAB 2: CALL REQUESTS ─── */}
        {activeTab === 'calls' && (
          <section className="mt-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                ডাইরেক্ট নম্বর দেখার অনুরোধ ({callRequests.length})
              </h2>
              <p className="text-xs text-gray-500">
                ভাড়াটেদের ৩০ টাকা পেমেন্ট যাচাই করে বাড়িওয়ালার নম্বর অনুমোদন করুন
              </p>
            </div>

            {callRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                  <PhoneCall className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-800">কোনো পেন্ডিং নম্বর অনুরোধ নেই</h3>
                <p className="mt-1 text-xs text-gray-500">সব আবেদন যাচাই করা হয়েছে।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {callRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition hover:shadow-md"
                  >
                    <div>
                      {/* Top bar: Method & Amount */}
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-teal-700">
                            {req.payment_method}
                          </span>
                          <span className="text-sm font-black text-gray-900">৳{req.amount}</span>
                        </div>
                        <span className="text-[11px] text-gray-400">
                          {req.created_at
                            ? new Date(req.created_at).toLocaleDateString('bn-BD', {
                                month: 'short',
                                day: 'numeric',
                              })
                            : '—'}
                        </span>
                      </div>

                      {/* Details Grid */}
                      <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                        <div className="rounded-xl bg-gray-50 p-3">
                          <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                            ভাড়াটের তথ্য
                          </span>
                          <p className="mt-1 font-bold text-gray-900">{req.renters?.name || 'নাম নেই'}</p>
                          <p className="mt-0.5 text-gray-600">{req.renters?.phone || 'নম্বর নেই'}</p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-3">
                          <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                            পেমেন্ট তথ্য
                          </span>
                          <p className="mt-1 font-bold text-gray-900">নম্বর: {req.payment_number}</p>
                          <p className="mt-0.5 font-mono text-[11px] text-gray-600">TrxID: {req.payment_transaction_id}</p>
                        </div>
                      </div>

                      {/* Listing target */}
                      <div className="mt-3 rounded-xl border border-gray-100 p-3 text-xs">
                        <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">
                          টার্গেট লিস্টিং ও বাড়িওয়ালা
                        </span>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="font-bold text-slate-ocean">
                            {req.listings?.title || 'লিস্টিং পাওয়া যায়নি'}
                          </span>
                          {req.listings?.id && (
                            <Link
                              href={`/listings/${req.listings.id}`}
                              target="_blank"
                              className="text-slate-ocean hover:underline"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          )}
                        </div>
                        <p className="mt-1 text-gray-600">
                          বাড়িওয়ালা: {req.listings?.landlords?.name} ({req.listings?.landlords?.phone})
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-5 flex gap-3 border-t border-gray-100 pt-3">
                      <button
                        disabled={isPending}
                        onClick={() => handleApproveCall(req.id)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700"
                      >
                        <Check className="h-4 w-4" />
                        <span>অনুমোদন করুন</span>
                      </button>
                      <button
                        disabled={isPending}
                        onClick={() => handleRejectCall(req.id)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                      >
                        <X className="h-4 w-4" />
                        <span>বাতিল করুন</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ─── TAB 3: ALL LISTINGS ─── */}
        {activeTab === 'listings' && (
          <section className="mt-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  সকল লিস্টিং ব্যবস্থাপনা ({listings.length})
                </h2>
                <p className="text-xs text-gray-500">সিস্টেমের যেকোনো লিস্টিং সক্রিয়/নিষ্ক্রিয় বা মুছে ফেলুন</p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="শিরোনাম, এলাকা বা মালিক দিয়ে খুঁজুন..."
                  value={listingSearch}
                  onChange={(e) => setListingSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2 pr-3 pl-9 text-xs focus:border-slate-ocean focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-5 py-3.5 font-bold">লিস্টিং</th>
                      <th className="px-5 py-3.5 font-bold">ভাড়া ও এলাকা</th>
                      <th className="px-5 py-3.5 font-bold">বাড়িওয়ালা</th>
                      <th className="px-5 py-3.5 font-bold">স্ট্যাটাস</th>
                      <th className="px-5 py-3.5 text-right font-bold">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredListings.map((listing) => (
                      <tr key={listing.id} className="hover:bg-gray-50/60 transition">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-900">{listing.title}</div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                              {listing.category === 'residential' ? 'আবাসিক' : 'বাণিজ্যিক'}
                            </span>
                            <Link
                              href={`/listings/${listing.id}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 text-[11px] text-slate-ocean hover:underline"
                            >
                              <span>দেখুন</span>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-ocean">৳{Number(listing.rent_amount).toLocaleString('bn-BD')}/মাস</p>
                          <p className="text-xs text-gray-500">{listing.area}, {listing.city}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-800">{listing.landlords?.name || 'মালিকের নাম নেই'}</p>
                          <p className="text-xs text-gray-500">{listing.landlords?.phone || '—'}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                              listing.status === 'available'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                listing.status === 'available' ? 'bg-emerald-500' : 'bg-gray-400'
                              }`}
                            />
                            {listing.status === 'available' ? 'খালি আছে' : 'ভাড়া হয়েছে'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              disabled={isPending}
                              onClick={() => handleToggleStatus(listing.id, listing.status)}
                              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                            >
                              {listing.status === 'available' ? 'ভাড়া চিহ্নিত' : 'খালি চিহ্নিত'}
                            </button>
                            <button
                              disabled={isPending}
                              onClick={() => handleDeleteListing(listing.id, listing.title)}
                              className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                              title="লিস্টিং মুছে ফেলুন"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ─── TAB 4: USERS DIRECTORY ─── */}
        {activeTab === 'users' && (
          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">ব্যবহারকারী তালিকা</h2>
                <p className="text-xs text-gray-500">নিবন্ধিত বাড়িওয়ালা ও ভাড়াটেদের সারাংশ</p>
              </div>

              {/* Sub tabs */}
              <div className="flex rounded-xl bg-gray-200 p-1 text-xs font-bold">
                <button
                  onClick={() => setUserTab('landlords')}
                  className={`rounded-lg px-3 py-1.5 transition ${
                    userTab === 'landlords' ? 'bg-white text-slate-ocean shadow-xs' : 'text-gray-600'
                  }`}
                >
                  বাড়িওয়ালা ({initialUsers.landlords.length})
                </button>
                <button
                  onClick={() => setUserTab('renters')}
                  className={`rounded-lg px-3 py-1.5 transition ${
                    userTab === 'renters' ? 'bg-white text-slate-ocean shadow-xs' : 'text-gray-600'
                  }`}
                >
                  ভাড়াটে ({initialUsers.renters.length})
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                      <th className="px-5 py-3.5 font-bold">ব্যবহারকারী</th>
                      <th className="px-5 py-3.5 font-bold">ফোন নম্বর</th>
                      <th className="px-5 py-3.5 font-bold">ঠিকানা</th>
                      <th className="px-5 py-3.5 font-bold">যাচাইকরণ</th>
                      <th className="px-5 py-3.5 font-bold">নিবন্ধন তারিখ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(userTab === 'landlords' ? initialUsers.landlords : initialUsers.renters).map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/60 transition">
                        <td className="px-5 py-4 font-semibold text-gray-900">
                          {u.name}
                          {u.occupation_type && (
                            <span className="ml-2 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                              {u.occupation_type === 'job' ? 'চাকরিজীবী' : 'শিক্ষার্থী'}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-xs font-mono text-gray-700">{u.phone}</td>
                        <td className="px-5 py-4 text-xs text-gray-600">{u.address || '—'}</td>
                        <td className="px-5 py-4">
                          {u.is_verified || u.is_nid_verified ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              <BadgeCheck className="h-3 w-3" />
                              যাচাইকৃত
                            </span>
                          ) : (
                            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                              সাধারণ
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-400">
                          {u.created_at
                            ? new Date(u.created_at).toLocaleDateString('bn-BD', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ─── TAB 5: SITE SETTINGS ─── */}
        {activeTab === 'settings' && (
          <AdminSettingsTab initialSettings={initialSettings} />
        )}
      </main>
    </div>
  )
}
