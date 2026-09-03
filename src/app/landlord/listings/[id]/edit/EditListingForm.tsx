'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateListing } from '@/lib/actions/landlord'
import { cn } from '@/lib/utils'
import type { Listing } from '@/types'

const AMENITIES_LIST = [
  'গ্যাস', 'পানি', 'বিদ্যুৎ', 'লিফট', 'পার্কিং', 'সিকিউরিটি',
  'রুফটপ', 'বালকনি', 'শীতাতপনিয়ন্ত্রণ', 'সেপটিক ট্যাংক', 'ইন্টারনেট', 'জেনারেটর'
]

export default function EditListingForm({ listing }: { listing: Listing }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const [title, setTitle] = useState(listing.title)
  const [address, setAddress] = useState(listing.address)
  const [area, setArea] = useState(listing.area)
  const [thana, setThana] = useState(listing.thana ?? '')
  const [city, setCity] = useState(listing.city)
  const [rentAmount, setRentAmount] = useState(String(listing.rent_amount))
  const [residentialType, setResidentialType] = useState(listing.residential_type ?? '')
  const [commercialType, setCommercialType] = useState(listing.commercial_type ?? '')
  const [roomCount, setRoomCount] = useState(listing.room_count ? String(listing.room_count) : '')
  const [sizeSqft, setSizeSqft] = useState(listing.size_sqft ? String(listing.size_sqft) : '')
  const [floorNumber, setFloorNumber] = useState(listing.floor_number ? String(listing.floor_number) : '')
  const [roadWidth, setRoadWidth] = useState(listing.road_width ? String(listing.road_width) : '')
  const [amenities, setAmenities] = useState<string[]>(listing.amenities ?? [])
  const [rules, setRules] = useState(listing.rules ?? '')
  const [photoUrls] = useState<string[]>(listing.photos ?? [])

  const toggleAmenity = (a: string) =>
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const fd = new FormData()
      fd.append('category', listing.category)
      fd.append('title', title)
      fd.append('address', address)
      fd.append('area', area)
      if (thana) fd.append('thana', thana)
      fd.append('city', city)
      fd.append('rent_amount', rentAmount)
      if (listing.category === 'residential') {
        if (residentialType) fd.append('residential_type', residentialType)
        if (roomCount) fd.append('room_count', roomCount)
      } else {
        if (commercialType) fd.append('commercial_type', commercialType)
        if (sizeSqft) fd.append('size_sqft', sizeSqft)
        if (floorNumber) fd.append('floor_number', floorNumber)
        if (roadWidth) fd.append('road_width', roadWidth)
      }
      amenities.forEach((a) => fd.append('amenities', a))
      if (rules) fd.append('rules', rules)
      photoUrls.forEach((u) => fd.append('photos', u))

      const result = await updateListing(listing.id, fd)
      if (result.error) {
        setError(result.error)
      } else {
        router.push('/landlord/dashboard')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <Field label="শিরোনাম *" value={title} onChange={setTitle} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="এলাকা *" value={area} onChange={setArea} />
        <Field label="থানা" value={thana} onChange={setThana} />
      </div>
      <Field label="শহর *" value={city} onChange={setCity} />
      <Field label="সম্পূর্ণ ঠিকানা *" value={address} onChange={setAddress} />
      <Field label="মাসিক ভাড়া (টাকা) *" type="number" value={rentAmount} onChange={setRentAmount} />

      {listing.category === 'residential' && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">ধরন</label>
            <div className="flex gap-3">
              {[{ v: 'bachelor', l: 'ব্যাচেলর' }, { v: 'family', l: 'ফ্যামিলি' }, { v: 'sublet', l: 'সাবলেট' }].map((t) => (
                <button type="button" key={t.v} onClick={() => setResidentialType(t.v)}
                  className={cn('flex-1 rounded-lg border-2 py-2 text-sm font-medium', residentialType === t.v ? 'border-slate-ocean bg-cloud-mint text-slate-ocean' : 'border-gray-200 text-gray-600')}
                >{t.l}</button>
              ))}
            </div>
          </div>
          <Field label="রুম সংখ্যা" type="number" value={roomCount} onChange={setRoomCount} />
        </>
      )}

      {listing.category === 'commercial' && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">ধরন</label>
            <div className="grid grid-cols-2 gap-2">
              {[{ v: 'office', l: 'অফিস' }, { v: 'showroom', l: 'শোরুম' }, { v: 'godown', l: 'গুদাম' }, { v: 'empty_space', l: 'খালি জায়গা' }].map((t) => (
                <button type="button" key={t.v} onClick={() => setCommercialType(t.v)}
                  className={cn('rounded-lg border-2 py-2 text-sm font-medium', commercialType === t.v ? 'border-slate-ocean bg-cloud-mint text-slate-ocean' : 'border-gray-200 text-gray-600')}
                >{t.l}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="আয়তন (বর্গফুট)" type="number" value={sizeSqft} onChange={setSizeSqft} />
            <Field label="তলা নম্বর" type="number" value={floorNumber} onChange={setFloorNumber} />
          </div>
          <Field label="রাস্তার প্রশস্ততা (ফুট)" type="number" value={roadWidth} onChange={setRoadWidth} />
        </>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">সুযোগ-সুবিধা</p>
        <div className="flex flex-wrap gap-2">
          {AMENITIES_LIST.map((a) => (
            <button type="button" key={a} onClick={() => toggleAmenity(a)}
              className={cn('rounded-full border-2 px-3 py-1 text-sm transition-colors', amenities.includes(a) ? 'border-slate-ocean bg-cloud-mint text-slate-ocean' : 'border-gray-200 text-gray-600')}
            >{a}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">নিয়ম-কানুন</label>
        <textarea rows={4} value={rules} onChange={(e) => setRules(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-slate-ocean focus:outline-none focus:ring-2 focus:ring-slate-ocean/20"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.back()}
          className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50">
          বাতিল
        </button>
        <button type="submit" disabled={isPending}
          className="flex-1 rounded-xl bg-slate-ocean py-3 text-sm font-semibold text-white hover:bg-slate-ocean/90 disabled:opacity-60">
          {isPending ? 'আপডেট হচ্ছে...' : 'আপডেট করুন'}
        </button>
      </div>
    </form>
  )
}

function Field({ label, value, onChange, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-slate-ocean focus:outline-none focus:ring-2 focus:ring-slate-ocean/20" />
    </div>
  )
}
