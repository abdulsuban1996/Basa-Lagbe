import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-ocean/10 text-slate-ocean mb-6 shadow-inner">
        <Home className="h-10 w-10 text-slate-ocean" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-ocean sm:text-5xl">৪০৪</h1>
      <h2 className="mt-3 text-xl font-bold text-gray-800">পেজটি খুঁজে পাওয়া যায়নি</h2>
      <p className="mt-2 max-w-md text-sm text-gray-500 leading-relaxed">
        আপনি যে লিংকটি খুঁজছেন তা হয়তো সরানো হয়েছে অথবা লিঙ্কটি ভুল দেওয়া হয়েছে।
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-ocean px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-slate-ocean/90"
        >
          <Home className="h-4 w-4" />
          হোমপেজে যান
        </Link>
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 shadow-xs transition hover:bg-gray-50"
        >
          <Search className="h-4 w-4 text-gray-500" />
          বাসা খুঁজুন
        </Link>
      </div>
    </div>
  )
}
