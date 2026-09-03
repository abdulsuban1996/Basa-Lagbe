'use client'

import { motion } from 'motion/react'
import { Home } from 'lucide-react'
import { ListingCard } from '@/components/ListingCard'
import type { Listing } from '@/types'

export function ListingsGridClient({ listings }: { listings: Listing[] }) {
  if (listings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center rounded-3xl bg-gray-50 py-20 text-center border border-gray-100"
      >
        <Home className="h-12 w-12 text-gray-300" />
        <p className="mt-4 text-lg font-bold text-gray-600">কোনো লিস্টিং পাওয়া যায়নি</p>
        <p className="mt-1 text-sm text-gray-400">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.07,
          },
        },
      }}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
    >
      {listings.map((listing) => (
        <motion.div
          key={listing.id}
          variants={{
            hidden: { opacity: 0, y: 25 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
          }}
        >
          <ListingCard listing={listing} />
        </motion.div>
      ))}
    </motion.div>
  )
}
