'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ListingCategory, ResidentialType, CommercialType } from '@/types'

export function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState<ListingCategory | ''>(
    (searchParams.get('category') as ListingCategory) || ''
  )
  const [residentialType, setResidentialType] = useState<ResidentialType | ''>(
    (searchParams.get('residential_type') as ResidentialType) || ''
  )
  const [commercialType, setCommercialType] = useState<CommercialType | ''>(
    (searchParams.get('commercial_type') as CommercialType) || ''
  )
  const [minRent, setMinRent] = useState(searchParams.get('min_rent') || '')
  const [maxRent, setMaxRent] = useState(searchParams.get('max_rent') || '')
  const [area, setArea] = useState(searchParams.get('area') || '')

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (category === 'residential' && residentialType) params.set('residential_type', residentialType)
    if (category === 'commercial' && commercialType) params.set('commercial_type', commercialType)
    if (minRent) params.set('min_rent', minRent)
    if (maxRent) params.set('max_rent', maxRent)
    if (area) params.set('area', area)
    router.push(`/listings?${params.toString()}`)
  }

  const resetFilters = () => {
    setCategory('')
    setResidentialType('')
    setCommercialType('')
    setMinRent('')
    setMaxRent('')
    setArea('')
    router.push('/listings')
  }

  const hasFilters = !!(category || minRent || maxRent || area)

  return (
    <aside className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-ocean">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="font-semibold">ফিল্টার</span>
        </div>
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
          >
            <X className="h-3 w-3" />
            রিসেট
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Category */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">বিভাগ</p>
          <div className="flex flex-col gap-2">
            {[
              { value: '', label: 'সব' },
              { value: 'residential', label: '🏠 আবাসিক' },
              { value: 'commercial', label: '🏢 বাণিজ্যিক' },
            ].map((opt) => (
              <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  value={opt.value}
                  checked={category === opt.value}
                  onChange={() => {
                    setCategory(opt.value as ListingCategory | '')
                    setResidentialType('')
                    setCommercialType('')
                  }}
                  className="accent-slate-ocean"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Type — residential */}
        {category === 'residential' && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">ধরন</p>
            <div className="flex flex-col gap-2">
              {[
                { value: '', label: 'সব' },
                { value: 'bachelor', label: 'ব্যাচেলর' },
                { value: 'family', label: 'ফ্যামিলি' },
                { value: 'sublet', label: 'সাবলেট' },
              ].map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="residential_type"
                    value={opt.value}
                    checked={residentialType === opt.value}
                    onChange={() => setResidentialType(opt.value as ResidentialType | '')}
                    className="accent-slate-ocean"
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Type — commercial */}
        {category === 'commercial' && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">ধরন</p>
            <div className="flex flex-col gap-2">
              {[
                { value: '', label: 'সব' },
                { value: 'office', label: 'অফিস' },
                { value: 'showroom', label: 'শোরুম' },
                { value: 'godown', label: 'গুদাম' },
                { value: 'empty_space', label: 'খালি জায়গা' },
              ].map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="commercial_type"
                    value={opt.value}
                    checked={commercialType === opt.value}
                    onChange={() => setCommercialType(opt.value as CommercialType | '')}
                    className="accent-slate-ocean"
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Area */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">এলাকা</p>
          <input
            type="text"
            placeholder="এলাকার নাম লিখুন"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={cn(
              'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm',
              'focus:border-slate-ocean focus:outline-none focus:ring-2 focus:ring-slate-ocean/20'
            )}
          />
        </div>

        {/* Budget */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">বাজেট (টাকা)</p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="সর্বনিম্ন"
              value={minRent}
              onChange={(e) => setMinRent(e.target.value)}
              className={cn(
                'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm',
                'focus:border-slate-ocean focus:outline-none focus:ring-2 focus:ring-slate-ocean/20'
              )}
            />
            <input
              type="number"
              placeholder="সর্বোচ্চ"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
              className={cn(
                'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm',
                'focus:border-slate-ocean focus:outline-none focus:ring-2 focus:ring-slate-ocean/20'
              )}
            />
          </div>
        </div>

        {/* Apply button */}
        <button
          onClick={applyFilters}
          className="w-full rounded-lg bg-slate-ocean py-3 text-sm font-semibold text-white hover:bg-slate-ocean/90 transition-colors"
        >
          ফিল্টার করুন
        </button>
      </div>
    </aside>
  )
}
