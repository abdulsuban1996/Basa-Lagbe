'use client'

import Link from 'next/link'
import { MapPin, BedDouble, Building2, ArrowRight, Maximize2 } from 'lucide-react'
import { motion } from 'motion/react'
import type { Listing } from '@/types'

interface ListingCardProps {
  listing: Listing
}

const categoryLabel: Record<string, string> = {
  residential: 'আবাসিক',
  commercial: 'বাণিজ্যিক',
}

const residentialTypeLabel: Record<string, string> = {
  bachelor: 'ব্যাচেলর',
  family: 'ফ্যামিলি',
  sublet: 'সাবলেট',
}

const commercialTypeLabel: Record<string, string> = {
  office: 'অফিস',
  showroom: 'শোরুম',
  godown: 'গুদাম',
  empty_space: 'খালি জায়গা',
}

const categoryColors: Record<string, string> = {
  residential: 'bg-cloud-mint text-slate-ocean',
  commercial: 'bg-slate-ocean text-white',
}

function formatBengaliNumber(n: number): string {
  return n.toLocaleString('bn-BD')
}

export function ListingCard({ listing }: ListingCardProps) {
  const isResidential = listing.category === 'residential'
  const typeLabel = isResidential
    ? listing.residential_type
      ? residentialTypeLabel[listing.residential_type]
      : null
    : listing.commercial_type
    ? commercialTypeLabel[listing.commercial_type]
    : null

  const photo = listing.photos?.[0] ?? null

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.22, ease: 'easeOut' } }}
      className="h-full"
    >
      <Link
        href={`/listings/${listing.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-ocean/30 hover:shadow-xl"
      >
        {/* ── Photo ── */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={listing.title}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
              {isResidential ? (
                <BedDouble className="h-12 w-12 text-gray-300" />
              ) : (
                <Building2 className="h-12 w-12 text-gray-300" />
              )}
            </div>
          )}

          {/* Gradient overlay at bottom for readability */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Category badge — top left */}
          <div className="absolute top-3 left-3">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold shadow-sm ${categoryColors[listing.category]}`}>
              {categoryLabel[listing.category]}
            </span>
          </div>

          {/* Type badge — top right */}
          {typeLabel && (
            <div className="absolute top-3 right-3">
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-ocean shadow-sm backdrop-blur-sm">
                {typeLabel}
              </span>
            </div>
          )}

          {/* Status — bottom right */}
          <div className="absolute bottom-3 right-3">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm ${
              listing.status === 'available'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-600 text-white'
            }`}>
              {listing.status === 'available' ? '● খালি আছে' : '● ভাড়া হয়েছে'}
            </span>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex flex-1 flex-col p-4">
          {/* Title */}
          <h3 className="line-clamp-2 text-[15px] font-extrabold leading-snug text-gray-900 transition-colors group-hover:text-slate-ocean">
            {listing.title}
          </h3>

          {/* Location */}
          <div className="mt-2 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-slate-ocean" />
            <span className="truncate text-xs font-semibold text-gray-600">
              {listing.area}{listing.thana ? `, ${listing.thana}` : ''}, {listing.city}
            </span>
          </div>

          {/* Info pills row */}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {isResidential && listing.room_count && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-ocean/8 px-2.5 py-1 text-xs font-bold text-slate-ocean">
                <BedDouble className="h-3 w-3" />
                {formatBengaliNumber(listing.room_count)} রুম
              </span>
            )}
            {!isResidential && listing.size_sqft && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-ocean/8 px-2.5 py-1 text-xs font-bold text-slate-ocean">
                <Maximize2 className="h-3 w-3" />
                {formatBengaliNumber(listing.size_sqft)} বর্গফুট
              </span>
            )}
            {listing.floor_number != null && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600">
                {formatBengaliNumber(listing.floor_number)}{' '}তলা
              </span>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* ── Price + CTA row ── */}
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-ocean">
                ৳{formatBengaliNumber(listing.rent_amount)}
              </span>
              <span className="ml-1 text-xs font-medium text-gray-500">/মাস</span>
            </div>

            <span className="inline-flex items-center gap-1 rounded-xl bg-slate-ocean px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-all group-hover:bg-slate-ocean/85 group-hover:shadow-md">
              বিস্তারিত
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
