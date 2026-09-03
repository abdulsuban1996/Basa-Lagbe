'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft, Upload, X } from 'lucide-react'
import { createListing } from '@/lib/actions/landlord'
import { cn } from '@/lib/utils'

const AMENITIES_LIST = [
  'গ্যাস', 'পানি', 'বিদ্যুৎ', 'লিফট', 'পার্কিং', 'সিকিউরিটি',
  'রুফটপ', 'বালকনি', 'শীতাতপনিয়ন্ত্রণ', 'সেপটিক ট্যাংক', 'ইন্টারনেট', 'জেনারেটর'
]

const STEPS = ['বিভাগ', 'বিস্তারিত', 'সুবিধা', 'ছবি', 'প্রিভিউ']

export default function NewListingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  // Form state
  const [category, setCategory] = useState<'residential' | 'commercial' | ''>('')
  const [residentialType, setResidentialType] = useState('')
  const [commercialType, setCommercialType] = useState('')
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [area, setArea] = useState('')
  const [thana, setThana] = useState('')
  const [city, setCity] = useState('')
  const [rentAmount, setRentAmount] = useState('')
  const [roomCount, setRoomCount] = useState('')
  const [sizeSqft, setSizeSqft] = useState('')
  const [floorNumber, setFloorNumber] = useState('')
  const [roadWidth, setRoadWidth] = useState('')
  const [amenities, setAmenities] = useState<string[]>([])
  const [rules, setRules] = useState('')
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const toggleAmenity = (a: string) =>
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))

  // ImageKit upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const authRes = await fetch('/api/imagekit-auth')
      const { token, expire, signature } = await authRes.json()
      const urls: string[] = []
      for (const file of Array.from(files).slice(0, 5 - photoUrls.length)) {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('fileName', `${Date.now()}-${file.name}`)
        fd.append('folder', '/basa-lagbe')
        fd.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!)
        fd.append('signature', signature)
        fd.append('expire', String(expire))
        fd.append('token', token)
        const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
          method: 'POST',
          body: fd,
        })
        const data = await res.json()
        if (data.url) urls.push(data.url)
      }
      setPhotoUrls((prev) => [...prev, ...urls])
    } catch {
      setError('ছবি আপলোড করা সম্ভব হয়নি।')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = () => {
    setError('')
    startTransition(async () => {
      const fd = new FormData()
      fd.append('category', category)
      fd.append('title', title)
      fd.append('address', address)
      fd.append('area', area)
      if (thana) fd.append('thana', thana)
      fd.append('city', city)
      fd.append('rent_amount', rentAmount)
      if (category === 'residential') {
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

      const result = await createListing(fd)
      if (result.error) {
        setError(result.error)
      } else {
        router.push('/landlord/dashboard')
      }
    })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-slate-ocean">নতুন লিস্টিং যোগ করুন</h1>

      {/* Progress */}
      <div className="mb-8 flex items-center gap-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 flex-col items-center">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                i < step ? 'bg-slate-ocean text-white' : i === step ? 'bg-cloud-mint text-slate-ocean ring-2 ring-slate-ocean' : 'bg-gray-100 text-gray-400'
              )}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span className="mt-1 hidden text-xs text-gray-500 sm:block">{s}</span>
            {i < STEPS.length - 1 && (
              <div className={cn('absolute hidden', 'sm:block')} />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {/* Step 0: Category */}
        {step === 0 && (
          <div>
            <h2 className="mb-6 text-lg font-semibold text-gray-800">বিভাগ নির্বাচন করুন</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'residential', emoji: '🏠', label: 'আবাসিক', sub: 'বাসা, রুম, ফ্ল্যাট' },
                { value: 'commercial', emoji: '🏢', label: 'বাণিজ্যিক', sub: 'অফিস, শোরুম, গুদাম' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCategory(opt.value as 'residential' | 'commercial')}
                  className={cn(
                    'rounded-2xl border-2 p-6 text-left transition-colors',
                    category === opt.value ? 'border-slate-ocean bg-cloud-mint' : 'border-gray-100 hover:border-gray-200'
                  )}
                >
                  <div className="text-4xl">{opt.emoji}</div>
                  <div className="mt-3 font-semibold text-gray-800">{opt.label}</div>
                  <div className="text-sm text-gray-500">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">বিস্তারিত তথ্য</h2>
            <Field label="শিরোনাম *" value={title} onChange={setTitle} placeholder="উদা: মিরপুর ১০-এ ২ রুমের ব্যাচেলর ফ্ল্যাট" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="এলাকা *" value={area} onChange={setArea} placeholder="মিরপুর" />
              <Field label="থানা" value={thana} onChange={setThana} placeholder="মিরপুর" />
            </div>
            <Field label="শহর *" value={city} onChange={setCity} placeholder="ঢাকা" />
            <Field label="সম্পূর্ণ ঠিকানা *" value={address} onChange={setAddress} placeholder="বাড়ি নং, রোড নং, ব্লক" />
            <Field label="মাসিক ভাড়া (টাকা) *" type="number" value={rentAmount} onChange={setRentAmount} placeholder="8000" />

            {category === 'residential' && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">ধরন</label>
                  <div className="flex gap-3">
                    {[{ v: 'bachelor', l: 'ব্যাচেলর' }, { v: 'family', l: 'ফ্যামিলি' }, { v: 'sublet', l: 'সাবলেট' }].map((t) => (
                      <button key={t.v} onClick={() => setResidentialType(t.v)}
                        className={cn('flex-1 rounded-lg border-2 py-2 text-sm font-medium transition-colors', residentialType === t.v ? 'border-slate-ocean bg-cloud-mint text-slate-ocean' : 'border-gray-200 text-gray-600')}
                      >{t.l}</button>
                    ))}
                  </div>
                </div>
                <Field label="রুম সংখ্যা" type="number" value={roomCount} onChange={setRoomCount} placeholder="2" />
              </>
            )}

            {category === 'commercial' && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">ধরন</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ v: 'office', l: 'অফিস' }, { v: 'showroom', l: 'শোরুম' }, { v: 'godown', l: 'গুদাম' }, { v: 'empty_space', l: 'খালি জায়গা' }].map((t) => (
                      <button key={t.v} onClick={() => setCommercialType(t.v)}
                        className={cn('rounded-lg border-2 py-2 text-sm font-medium transition-colors', commercialType === t.v ? 'border-slate-ocean bg-cloud-mint text-slate-ocean' : 'border-gray-200 text-gray-600')}
                      >{t.l}</button>
                    ))}
                  </div>
                </div>
                <Field label="আয়তন (বর্গফুট)" type="number" value={sizeSqft} onChange={setSizeSqft} placeholder="500" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="তলা নম্বর" type="number" value={floorNumber} onChange={setFloorNumber} placeholder="2" />
                  <Field label="রাস্তার প্রশস্ততা (ফুট)" type="number" value={roadWidth} onChange={setRoadWidth} placeholder="20" />
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 2: Amenities + Rules */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">সুযোগ-সুবিধা ও নিয়ম</h2>
            <div>
              <p className="mb-3 text-sm font-medium text-gray-700">সুযোগ-সুবিধা</p>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_LIST.map((a) => (
                  <button key={a} onClick={() => toggleAmenity(a)}
                    className={cn('rounded-full border-2 px-4 py-1.5 text-sm font-medium transition-colors', amenities.includes(a) ? 'border-slate-ocean bg-cloud-mint text-slate-ocean' : 'border-gray-200 text-gray-600 hover:border-gray-300')}
                  >{a}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">নিয়ম-কানুন</label>
              <textarea rows={5} value={rules} onChange={(e) => setRules(e.target.value)}
                placeholder="উদা: ধূমপান নিষেধ, পোষা প্রাণী আনা যাবে না..."
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-slate-ocean focus:outline-none focus:ring-2 focus:ring-slate-ocean/20"
              />
            </div>
          </div>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">ছবি আপলোড করুন</h2>
            <p className="text-sm text-gray-500">সর্বোচ্চ ৫টি ছবি আপলোড করুন</p>
            {photoUrls.length < 5 && (
              <label className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 p-10',
                'hover:border-slate-ocean hover:bg-cloud-mint/30 transition-colors',
                uploading && 'opacity-50 cursor-not-allowed'
              )}>
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">{uploading ? 'আপলোড হচ্ছে...' : 'ছবি বেছে নিন'}</span>
                <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} disabled={uploading} className="hidden" />
              </label>
            )}
            {photoUrls.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {photoUrls.map((url, i) => (
                  <div key={i} className="relative h-24 w-24 overflow-hidden rounded-xl">
                    <img src={url} alt={`ছবি ${i + 1}`} className="h-full w-full object-cover" />
                    <button onClick={() => setPhotoUrls((p) => p.filter((_, idx) => idx !== i))}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Preview */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">প্রিভিউ ও জমা দিন</h2>
            <dl className="space-y-3 text-sm">
              <Row label="বিভাগ" value={category === 'residential' ? 'আবাসিক' : 'বাণিজ্যিক'} />
              <Row label="শিরোনাম" value={title} />
              <Row label="এলাকা" value={`${area}${thana ? ', ' + thana : ''}, ${city}`} />
              <Row label="ঠিকানা" value={address} />
              <Row label="মাসিক ভাড়া" value={`৳${Number(rentAmount).toLocaleString('bn-BD')}`} />
              {category === 'residential' && roomCount && <Row label="রুম সংখ্যা" value={roomCount} />}
              {category === 'commercial' && sizeSqft && <Row label="আয়তন" value={`${sizeSqft} বর্গফুট`} />}
              {amenities.length > 0 && <Row label="সুবিধা" value={amenities.join(', ')} />}
              <Row label="ছবি" value={`${photoUrls.length}টি`} />
            </dl>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50">
              <ChevronLeft className="h-4 w-4" /> পিছনে
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => {
                if (step === 0 && !category) { setError('বিভাগ নির্বাচন করুন।'); return }
                if (step === 1 && (!title || !address || !area || !city || !rentAmount)) { setError('সকল * চিহ্নিত তথ্য পূরণ করুন।'); return }
                setError(''); setStep((s) => s + 1)
              }}
              className="ml-auto flex items-center gap-1 rounded-xl bg-slate-ocean px-6 py-3 text-sm font-semibold text-white hover:bg-slate-ocean/90">
              পরবর্তী <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="ml-auto rounded-xl bg-slate-ocean px-8 py-3 text-sm font-semibold text-white hover:bg-slate-ocean/90 disabled:opacity-60">
              {isPending ? 'পোস্ট হচ্ছে...' : 'পোস্ট করুন'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-slate-ocean focus:outline-none focus:ring-2 focus:ring-slate-ocean/20" />
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 rounded-lg bg-gray-50 px-4 py-3">
      <dt className="w-32 flex-shrink-0 text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-800">{value || '—'}</dd>
    </div>
  )
}
