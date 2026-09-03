'use client'

import { useTransition } from 'react'
import { motion } from 'motion/react'
import {
  toggleListingStatus,
  renewListing,
  deleteListing,
  respondToApplication,
} from '@/lib/actions/landlord'
import { cn } from '@/lib/utils'
import type { Listing, ApplicationWithRenter } from '@/types'

// ---- Toggle Status ----
export function ToggleStatusButton({ listing }: { listing: Listing }) {
  const [isPending, startTransition] = useTransition()
  const isAvailable = listing.status === 'available'

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        startTransition(async () => { await toggleListingStatus(listing.id) })
      }}
      disabled={isPending}
      className={cn(
        'rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer',
        isAvailable
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-green-50 text-green-700 hover:bg-green-100'
      )}
    >
      {isPending ? '...' : isAvailable ? 'ভাড়া হয়েছে' : 'খালি করুন'}
    </motion.button>
  )
}

// ---- Renew Button ----
export function RenewButton({ listingId }: { listingId: string }) {
  const [isPending, startTransition] = useTransition()
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        startTransition(async () => { await renewListing(listingId) })
      }}
      disabled={isPending}
      className="rounded-xl bg-cloud-mint px-3 py-1.5 text-xs font-bold text-slate-ocean hover:bg-cloud-mint/70 transition-colors cursor-pointer"
    >
      {isPending ? '...' : 'নবায়ন করুন'}
    </motion.button>
  )
}

// ---- Delete Button ----
export function DeleteButton({ listingId }: { listingId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('আপনি কি নিশ্চিত? এই লিস্টিংটি মুছে ফেলা হবে।')) return
    startTransition(async () => { await deleteListing(listingId) })
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-xl bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
    >
      {isPending ? '...' : 'মুছুন'}
    </motion.button>
  )
}

// ---- Application Response Buttons ----
export function ApplicationActions({
  application,
}: {
  application: ApplicationWithRenter
}) {
  const [isPending, startTransition] = useTransition()

  if (application.status !== 'pending') {
    return (
      <span
        className={cn(
          'rounded-full px-3 py-1 text-xs font-bold',
          application.status === 'accepted'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-600'
        )}
      >
        {application.status === 'accepted' ? '✅ গৃহীত' : '❌ বাতিল'}
      </span>
    )
  }

  return (
    <div className="flex gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() =>
          startTransition(async () => { await respondToApplication(application.id, 'accepted') })
        }
        disabled={isPending}
        className="rounded-xl bg-green-50 px-3.5 py-1.5 text-xs font-bold text-green-700 hover:bg-green-100 cursor-pointer"
      >
        গ্রহণ করুন
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() =>
          startTransition(async () => { await respondToApplication(application.id, 'rejected') })
        }
        disabled={isPending}
        className="rounded-xl bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 cursor-pointer"
      >
        বাতিল করুন
      </motion.button>
    </div>
  )
}
