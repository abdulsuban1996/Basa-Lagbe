'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Home, ArrowLeft, User, Mail, Phone, MapPin, Lock } from 'lucide-react'
import { registerLandlord } from '@/lib/actions/auth'
import { cn } from '@/lib/utils'

const initialState: { error?: string } = {}

export default function LandlordRegisterPage() {
  const [state, formAction, isPending] = useActionState(
    registerLandlord,
    initialState
  )

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-cloud-mint/50 via-white to-gray-50 px-4 py-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-cloud-mint/80 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-slate-ocean/5 blur-3xl pointer-events-none" />

      {/* Back to Home / Login button */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-ocean/80 hover:text-slate-ocean transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> হোমপেজে ফিরুন
        </Link>
        <Link
          href="/login"
          className="text-sm font-bold text-slate-ocean hover:underline"
        >
          লগইন করুন
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-md p-8 shadow-2xl border border-gray-100 z-10"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-ocean text-white shadow-md mb-3"
            >
              <Home className="h-6 w-6" />
            </motion.div>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-ocean tracking-tight">
            বাড়িওয়ালা রেজিস্ট্রেশন
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            আপনার ফ্ল্যাট, মেস বা দোকান ভাড়া দিতে অ্যাকাউন্ট খুলুন
          </p>
        </div>

        {/* Error */}
        {state?.error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
          >
            {state.error}
          </motion.div>
        )}

        {/* Form */}
        <form action={formAction} className="space-y-3.5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold text-gray-700 mb-1"
            >
              পূর্ণ নাম <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="যেমন: মো: আরিফুল ইসলাম"
                className={cn(
                  'w-full rounded-xl border border-gray-200 bg-white/80 pl-10 pr-4 py-2.5 text-sm',
                  'focus:border-slate-ocean focus:outline-none focus:ring-2 focus:ring-slate-ocean/20',
                  'placeholder:text-gray-400 transition-colors'
                )}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-gray-700 mb-1"
            >
              ইমেইল <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="example@email.com"
                className={cn(
                  'w-full rounded-xl border border-gray-200 bg-white/80 pl-10 pr-4 py-2.5 text-sm',
                  'focus:border-slate-ocean focus:outline-none focus:ring-2 focus:ring-slate-ocean/20',
                  'placeholder:text-gray-400 transition-colors'
                )}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-bold text-gray-700 mb-1"
            >
              ফোন নম্বর <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="01XXXXXXXXX"
                className={cn(
                  'w-full rounded-xl border border-gray-200 bg-white/80 pl-10 pr-4 py-2.5 text-sm',
                  'focus:border-slate-ocean focus:outline-none focus:ring-2 focus:ring-slate-ocean/20',
                  'placeholder:text-gray-400 transition-colors'
                )}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-xs font-bold text-gray-700 mb-1"
            >
              বর্তমান ঠিকানা <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <textarea
                id="address"
                name="address"
                required
                rows={2}
                placeholder="বাড়ি নং, রোড নং, এলাকা, শহর"
                className={cn(
                  'w-full rounded-xl border border-gray-200 bg-white/80 pl-10 pr-4 py-2.5 text-sm resize-none',
                  'focus:border-slate-ocean focus:outline-none focus:ring-2 focus:ring-slate-ocean/20',
                  'placeholder:text-gray-400 transition-colors'
                )}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-gray-700 mb-1"
            >
              পাসওয়ার্ড <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="কমপক্ষে ৬ অক্ষর"
                className={cn(
                  'w-full rounded-xl border border-gray-200 bg-white/80 pl-10 pr-4 py-2.5 text-sm',
                  'focus:border-slate-ocean focus:outline-none focus:ring-2 focus:ring-slate-ocean/20',
                  'placeholder:text-gray-400 transition-colors'
                )}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isPending}
            whileHover={isPending ? undefined : { scale: 1.02 }}
            whileTap={isPending ? undefined : { scale: 0.98 }}
            className={cn(
              'w-full rounded-xl bg-slate-ocean py-3 text-sm font-bold text-white shadow-md mt-2',
              'hover:bg-slate-ocean/90 transition-colors cursor-pointer',
              isPending && 'opacity-60 cursor-not-allowed'
            )}
          >
            {isPending ? 'রেজিস্ট্রেশন হচ্ছে...' : 'রেজিস্ট্রেশন সম্পন্ন করুন'}
          </motion.button>
        </form>

        {/* Footer link */}
        <div className="mt-5 border-t border-gray-100 pt-4 text-center">
          <p className="text-xs text-gray-500">
            ভাড়াটে হিসেবে বাসা খুঁজতে চান?{' '}
            <Link href="/renter/register" className="font-bold text-slate-ocean hover:underline">
              এখানে যান
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
