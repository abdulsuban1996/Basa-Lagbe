'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import {
  Plus, Home, Pencil, Users, AlertTriangle,
  Clock, Building2, TrendingUp, CheckCircle2,
  MapPin, BanknoteIcon, Eye, ChevronRight,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import {
  ToggleStatusButton,
  RenewButton,
  DeleteButton,
  ApplicationActions,
} from '@/app/landlord/dashboard/LandlordActions'
import type { Listing, ApplicationWithRenter } from '@/types'

interface ListingWithAppsItem {
  listing: Listing | null
  applications: ApplicationWithRenter[]
}

export function LandlordDashboardClient({
  landlordName,
  stats,
  listingsWithApps,
}: {
  landlordName: string
  stats: {
    activeCount: number
    totalApplications: number
    pendingApplications: number
  }
  listingsWithApps: ListingWithAppsItem[]
}) {
  const now = new Date()
  const firstName = landlordName.split(' ')[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── HERO HEADER BANNER ─── */}
      <div className="relative overflow-hidden bg-slate-ocean px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 left-1/4 h-48 w-48 rounded-full bg-cloud-mint/10" />
        <div className="pointer-events-none absolute right-1/3 top-0 h-32 w-32 rounded-full bg-white/[0.03]" />

        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold text-cloud-mint backdrop-blur-sm">
                <Building2 className="h-3.5 w-3.5" />
                বাড়িওয়ালা অ্যাকাউন্ট
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                আমার ড্যাশবোর্ড
              </h1>
              <p className="mt-1.5 text-base text-white/60">
                স্বাগতম,{' '}
                <span className="font-bold text-cloud-mint">{firstName}</span>!
                আপনার সব লিস্টিং এখানে।
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/landlord/listings/new"
                className="inline-flex items-center gap-2.5 rounded-2xl bg-cloud-mint px-6 py-3.5 text-sm font-extrabold text-slate-ocean shadow-lg shadow-black/20 transition hover:bg-cloud-mint/90"
              >
                <Plus className="h-4 w-4" />
                নতুন বাসা যোগ করুন
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ─── STATS CARDS (overlap over hero) ─── */}
      <div className="relative mx-auto -mt-12 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: 'সক্রিয় লিস্টিং',
              value: stats.activeCount,
              icon: Home,
              color: 'text-slate-ocean',
              iconBg: 'bg-cloud-mint',
              border: 'border-cloud-mint/30',
            },
            {
              label: 'মোট আবেদন',
              value: stats.totalApplications,
              icon: TrendingUp,
              color: 'text-blue-600',
              iconBg: 'bg-blue-50',
              border: 'border-blue-100',
            },
            {
              label: 'পেন্ডিং আবেদন',
              value: stats.pendingApplications,
              icon: Clock,
              color: stats.pendingApplications > 0 ? 'text-amber-600' : 'text-gray-500',
              iconBg: stats.pendingApplications > 0 ? 'bg-amber-50' : 'bg-gray-50',
              border: stats.pendingApplications > 0 ? 'border-amber-200' : 'border-gray-100',
            },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 + i * 0.1 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className={`flex items-center gap-4 rounded-2xl border ${stat.border} bg-white p-5 shadow-md shadow-black/5`}
              >
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${stat.iconBg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{stat.label}</p>
                  <p className={`mt-0.5 text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ─── LISTINGS SECTION ─── */}
      <div className="mx-auto mt-8 max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-gray-800">
            আমার লিস্টিংসমূহ
            <span className="ml-2 rounded-full bg-slate-ocean/10 px-2.5 py-0.5 text-sm font-bold text-slate-ocean">
              {listingsWithApps.length}
            </span>
          </h2>
          <Link
            href="/landlord/listings/new"
            className="hidden items-center gap-1.5 text-xs font-bold text-slate-ocean hover:underline sm:flex"
          >
            <Plus className="h-3.5 w-3.5" />
            নতুন যোগ করুন
          </Link>
        </div>

        {/* Empty State */}
        {listingsWithApps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cloud-mint/30">
              <Home className="h-8 w-8 text-slate-ocean" />
            </div>
            <p className="mt-5 text-lg font-bold text-gray-700">
              এখনো কোনো লিস্টিং নেই
            </p>
            <p className="mt-1.5 max-w-xs text-sm text-gray-400">
              আপনার ফাঁকা বাসা বা স্পেস পোস্ট করুন এবং সহজেই ভাড়াটে খুঁজে নিন
            </p>
            <Link
              href="/landlord/listings/new"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-ocean px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-slate-ocean/90"
            >
              <Plus className="h-4 w-4" />
              বাসা পোস্ট করুন
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {listingsWithApps.map(({ listing, applications }, idx) => {
              if (!listing) return null

              const isExpired =
                listing.expires_at && new Date(listing.expires_at) < now
              const isExpiringSoon =
                listing.expires_at &&
                !isExpired &&
                new Date(listing.expires_at) < new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

              return (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.07 }}
                  className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* ── Listing Card Top ── */}
                  <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:p-6">
                    {/* Thumbnail */}
                    <div className="relative h-32 w-full flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-28 sm:w-44">
                      {listing.photos && listing.photos[0] ? (
                        <Image
                          src={listing.photos[0]}
                          alt={listing.title}
                          fill
                          className="object-cover transition duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Home className="h-10 w-10 text-gray-300" />
                        </div>
                      )}
                      {/* Status overlay pill */}
                      <div className="absolute right-2 top-2">
                        <Badge variant={listing.status === 'available' ? 'available' : 'rented'}>
                          {listing.status === 'available' ? 'খালি আছে' : 'ভাড়া হয়েছে'}
                        </Badge>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {/* Title row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={`/listings/${listing.id}`}
                            className="group flex items-center gap-1 text-lg font-extrabold text-gray-900 hover:text-slate-ocean transition-colors"
                          >
                            <span className="truncate">{listing.title}</span>
                            <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-gray-400" />
                              {listing.area}, {listing.city}
                            </span>
                            <span className="flex items-center gap-1 font-bold text-slate-ocean">
                              <BanknoteIcon className="h-3.5 w-3.5" />
                              ৳{listing.rent_amount.toLocaleString('bn-BD')}/মাস
                            </span>
                          </div>
                        </div>

                        {/* View link on desktop */}
                        <Link
                          href={`/listings/${listing.id}`}
                          className="hidden flex-shrink-0 items-center gap-1 rounded-xl border border-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-50 sm:flex"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          দেখুন
                        </Link>
                      </div>

                      {/* Expiry warning */}
                      {(isExpired || isExpiringSoon) && (
                        <div
                          className={`mt-3 inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold ${
                            isExpired
                              ? 'bg-red-50 text-red-600 ring-1 ring-red-200'
                              : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                          }`}
                        >
                          {isExpired ? (
                            <AlertTriangle className="h-3.5 w-3.5" />
                          ) : (
                            <Clock className="h-3.5 w-3.5" />
                          )}
                          <span>
                            {isExpired
                              ? 'মেয়াদ শেষ হয়েছে — নবায়ন করুন'
                              : 'মেয়াদ শীঘ্রই শেষ হবে'}
                          </span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <ToggleStatusButton listing={listing} />
                        {(isExpiringSoon || isExpired) && (
                          <RenewButton listingId={listing.id} />
                        )}
                        <Link
                          href={`/landlord/listings/${listing.id}/edit`}
                          className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          সম্পাদনা
                        </Link>
                        <DeleteButton listingId={listing.id} />
                      </div>
                    </div>
                  </div>

                  {/* ── Applications Panel ── */}
                  {applications.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50/60">
                      <div className="px-5 py-3 sm:px-6">
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-ocean/10">
                            <Users className="h-3.5 w-3.5 text-slate-ocean" />
                          </div>
                          <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
                            আবেদনকারী ({applications.length} জন)
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {applications.map((app) => (
                            <div
                              key={app.id}
                              className="flex flex-col justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs sm:flex-row sm:items-center"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-ocean/10 text-sm font-extrabold text-slate-ocean">
                                  {(app.renters?.name ?? 'ব')[0]}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-800">
                                    {app.renters?.name}
                                  </p>
                                  <p className="text-xs font-medium text-gray-500">
                                    {app.renters?.phone}
                                    {app.renters?.occupation_type && (
                                      <> &nbsp;·&nbsp; {app.renters.occupation_type === 'job'
                                        ? `চাকরিজীবী${app.renters.job_title ? ' — ' + app.renters.job_title : ''}`
                                        : `শিক্ষার্থী${app.renters.institution_name ? ' — ' + app.renters.institution_name : ''}`}
                                      </>
                                    )}
                                  </p>
                                </div>
                              </div>
                              <ApplicationActions application={app} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* No applications yet */}
                  {applications.length === 0 && (
                    <div className="flex items-center gap-2 border-t border-gray-100 px-6 py-3 text-xs text-gray-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-gray-300" />
                      এখনো কোনো আবেদন আসেনি
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
