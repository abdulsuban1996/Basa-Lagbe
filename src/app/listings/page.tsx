import { Suspense } from 'react'
import { FilterSidebar } from '@/components/FilterSidebar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ListingsGridClient } from '@/components/ListingsGridClient'
import { getListings } from '@/lib/actions/listings'
import type { ListingCategory, ResidentialType, CommercialType } from '@/types'

interface SearchParams {
  category?: string
  residential_type?: string
  commercial_type?: string
  area?: string
  city?: string
  min_rent?: string
  max_rent?: string
}

async function ListingsGrid({ searchParams }: { searchParams: SearchParams }) {
  const filters = {
    category: searchParams.category as ListingCategory | undefined,
    residential_type: searchParams.residential_type as ResidentialType | undefined,
    commercial_type: searchParams.commercial_type as CommercialType | undefined,
    area: searchParams.area,
    city: searchParams.city,
    min_rent: searchParams.min_rent ? Number(searchParams.min_rent) : undefined,
    max_rent: searchParams.max_rent ? Number(searchParams.max_rent) : undefined,
  }

  const listings = await getListings(filters)

  return <ListingsGridClient listings={listings} />
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-ocean tracking-tight">সব লিস্টিং</h1>
        <p className="mt-1 text-sm text-gray-500">
          লগইন ছাড়াই যেকোনো বাসা ব্রাউজ করুন — সরাসরি বাড়িওয়ালার সাথে কথা বলুন
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filter sidebar */}
        <div className="w-full lg:w-72 lg:flex-shrink-0">
          <Suspense fallback={<div className="h-80 animate-pulse rounded-2xl bg-gray-100" />}>
            <FilterSidebar />
          </Suspense>
        </div>

        {/* Listings */}
        <div className="flex-1">
          <Suspense fallback={<LoadingSpinner text="লিস্টিং লোড হচ্ছে..." />}>
            <ListingsGrid searchParams={params} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
