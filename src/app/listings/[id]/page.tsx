import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, CheckCircle, MapPin, Home, Building2,
  BedDouble, Maximize2, Layers, RoadIcon, Star,
  ShieldCheck, PhoneCall, Bookmark, Phone,
} from 'lucide-react'
import { PhotoGallery } from '@/components/PhotoGallery'
import { getListingById } from '@/lib/actions/listings'
import {
  isBookmarked,
  getListingDirectCallStatus,
  type ListingDirectCallInfo,
} from '@/lib/actions/renter'
import { getSiteSettings } from '@/lib/actions/settings'
import { createClient } from '@/lib/supabase/server'
import {
  ApplyButton,
  DirectNumberButton,
  BookmarkButton,
  ReportButton,
} from './ListingActions'

const RESIDENTIAL_TYPE_LABELS: Record<string, string> = {
  bachelor: 'ব্যাচেলর',
  family: 'ফ্যামিলি',
  sublet: 'সাবলেট',
}

const COMMERCIAL_TYPE_LABELS: Record<string, string> = {
  office: 'অফিস',
  showroom: 'শোরুম',
  godown: 'গুদাম',
  empty_space: 'খালি জায়গা',
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [listing, siteSettings] = await Promise.all([
    getListingById(id),
    getSiteSettings(),
  ])

  if (!listing) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isLoggedIn = !!user

  let bookmarked = false
  let directCallInfo: ListingDirectCallInfo = {}

  if (isLoggedIn) {
    const [bm, dc] = await Promise.all([
      isBookmarked(id),
      getListingDirectCallStatus(id),
    ])
    bookmarked = bm
    directCallInfo = dc
  }

  const isResidential = listing.category === 'residential'

  const typeLabel = isResidential
    ? RESIDENTIAL_TYPE_LABELS[listing.residential_type ?? ''] ?? ''
    : COMMERCIAL_TYPE_LABELS[listing.commercial_type ?? ''] ?? ''

  const isAvailable = listing.status === 'available'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── BACK LINK ─── */}
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/listings"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-slate-ocean transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          সব লিস্টিং
        </Link>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* ─── LEFT COLUMN ─── */}
          <div className="space-y-6 lg:col-span-2">

            {/* Photo Gallery */}
            <div className="overflow-hidden rounded-3xl shadow-md">
              <PhotoGallery photos={listing.photos ?? []} title={listing.title} />
            </div>

            {/* Title Block */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                  isResidential
                    ? 'bg-cloud-mint text-slate-ocean'
                    : 'bg-slate-ocean text-white'
                }`}>
                  {isResidential ? 'আবাসিক' : 'বাণিজ্যিক'}
                </span>
                {typeLabel && (
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-600">
                    {typeLabel}
                  </span>
                )}
                <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                  isAvailable
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {isAvailable ? '● খালি আছে' : '● ভাড়া হয়েছে'}
                </span>
              </div>

              {/* Title */}
              <h1 className="mt-4 text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl">
                {listing.title}
              </h1>

              {/* Location */}
              <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-ocean" />
                <div>
                  <p className="font-semibold">
                    {listing.area}{listing.thana ? `, ${listing.thana}` : ''}, {listing.city}
                  </p>
                  {listing.address && (
                    <p className="mt-0.5 text-xs text-gray-400">{listing.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 text-base font-extrabold text-gray-800">
                <Star className="h-4 w-4 text-slate-ocean" />
                বিস্তারিত তথ্য
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {/* Rent */}
                <div className="flex flex-col gap-1 rounded-2xl bg-slate-ocean/5 p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">মাসিক ভাড়া</span>
                  <span className="text-lg font-extrabold text-slate-ocean">
                    ৳{listing.rent_amount.toLocaleString('bn-BD')}<span className="text-xs font-normal text-gray-400">/মাস</span>
                  </span>
                </div>

                {/* Room count */}
                {isResidential && listing.room_count && (
                  <div className="flex flex-col gap-1 rounded-2xl bg-gray-50 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <BedDouble className="h-3 w-3" /> রুম সংখ্যা
                    </span>
                    <span className="text-lg font-extrabold text-gray-800">{listing.room_count}টি</span>
                  </div>
                )}

                {/* Size */}
                {!isResidential && listing.size_sqft && (
                  <div className="flex flex-col gap-1 rounded-2xl bg-gray-50 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <Maximize2 className="h-3 w-3" /> আয়তন
                    </span>
                    <span className="text-lg font-extrabold text-gray-800">{listing.size_sqft} বর্গফুট</span>
                  </div>
                )}

                {/* Floor */}
                {listing.floor_number != null && (
                  <div className="flex flex-col gap-1 rounded-2xl bg-gray-50 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <Layers className="h-3 w-3" /> তলা
                    </span>
                    <span className="text-lg font-extrabold text-gray-800">{listing.floor_number}তম তলা</span>
                  </div>
                )}

                {/* Road width */}
                {listing.road_width != null && (
                  <div className="flex flex-col gap-1 rounded-2xl bg-gray-50 p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <RoadIcon className="h-3 w-3" /> রাস্তার প্রশস্ততা
                    </span>
                    <span className="text-lg font-extrabold text-gray-800">{listing.road_width} ফুট</span>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-gray-800">
                  <ShieldCheck className="h-4 w-4 text-slate-ocean" />
                  সুযোগ-সুবিধা
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {listing.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-cloud-mint bg-cloud-mint/30 px-3.5 py-2 text-sm font-bold text-slate-ocean"
                    >
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rules */}
            {listing.rules && (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-gray-800">
                  📋 নিয়ম-কানুন
                </h2>
                <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {listing.rules}
                </div>
              </div>
            )}
          </div>

          {/* ─── RIGHT COLUMN (sticky panel) ─── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-md">

                {/* Price */}
                <div className="border-b border-gray-100 pb-4">
                  <p className="text-3xl font-extrabold tracking-tight text-slate-ocean">
                    ৳{listing.rent_amount.toLocaleString('bn-BD')}
                    <span className="ml-1 text-base font-normal text-gray-400">/মাস</span>
                  </p>
                  <p className="mt-1 text-xs font-semibold text-gray-500">
                    {isAvailable ? '✅ এই মুহূর্তে ভাড়া পাওয়া যাচ্ছে' : '❌ বর্তমানে ভাড়া নেওয়া নেই'}
                  </p>
                </div>

                {/* Landlord info */}
                {listing.landlords && (
                  <div className="my-4 rounded-2xl bg-gray-50 p-3.5 border border-gray-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-ocean text-sm font-extrabold text-white shadow-sm">
                          {listing.landlords.name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-gray-800">
                            {listing.landlords.name}
                          </p>
                          {listing.landlords.is_verified ? (
                            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                              <CheckCircle className="h-3 w-3" /> যাচাইকৃত বাড়িওয়ালা
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400">বাড়িওয়ালা</p>
                          )}
                        </div>
                      </div>

                      {directCallInfo.status === 'verified' && directCallInfo.landlordPhone && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-emerald-600" /> আনলকড
                        </span>
                      )}
                    </div>

                    {/* Verified direct phone info inside landlord box */}
                    {directCallInfo.status === 'verified' && directCallInfo.landlordPhone && (
                      <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-emerald-200">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="font-mono text-sm font-bold text-slate-ocean">
                            {directCallInfo.landlordPhone}
                          </span>
                        </div>
                        <a
                          href={`tel:${directCallInfo.landlordPhone}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700 transition"
                        >
                          কল দিন
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                {isAvailable ? (
                  <div className="space-y-3">
                    <ApplyButton listingId={id} isLoggedIn={isLoggedIn} />
                    <DirectNumberButton
                      listingId={id}
                      isLoggedIn={isLoggedIn}
                      directCallStatus={directCallInfo.status}
                      verifiedPhone={directCallInfo.landlordPhone}
                      paymentInfo={{
                        method: siteSettings.payment_method,
                        number: siteSettings.payment_number,
                        amount: siteSettings.payment_amount,
                      }}
                    />
                    <BookmarkButton listingId={id} initialBookmarked={bookmarked} />
                    <div className="flex justify-center pt-1">
                      <ReportButton listingId={id} />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-center">
                    <p className="text-sm font-bold text-red-600">এই বাসাটি ইতিমধ্যে ভাড়া হয়ে গেছে</p>
                    <p className="mt-1 text-xs text-red-400">অনুগ্রহ করে অন্য লিস্টিং দেখুন</p>
                  </div>
                )}
              </div>

              {/* Location card */}
              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-gray-400">অবস্থান</h3>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-ocean/10">
                    {isResidential ? (
                      <Home className="h-4 w-4 text-slate-ocean" />
                    ) : (
                      <Building2 className="h-4 w-4 text-slate-ocean" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {listing.address && <p className="font-semibold text-gray-800">{listing.address}</p>}
                    <p>{listing.area}{listing.thana ? `, ${listing.thana}` : ''}</p>
                    <p className="font-bold text-slate-ocean">{listing.city}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
