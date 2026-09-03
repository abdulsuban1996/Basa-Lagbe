'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Home, ArrowRight, Lock, Mail, ArrowLeft } from 'lucide-react'
import { loginUser } from '@/lib/actions/auth'
import { cn } from '@/lib/utils'

const initialState: { error?: string } = {}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, initialState)

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-cloud-mint/50 via-white to-gray-50 px-4 py-8 overflow-hidden">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-cloud-mint/80 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-slate-ocean/5 blur-3xl pointer-events-none" />

      {/* Back to Home button */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-ocean/80 hover:text-slate-ocean transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> হোমপেজে ফিরুন
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-md p-8 shadow-2xl border border-gray-100 z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-ocean text-white shadow-md mb-3"
            >
              <Home className="h-6 w-6" />
            </motion.div>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-ocean tracking-tight">
            বাসা লাগবে
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">আপনার অ্যাকাউন্টে লগইন করুন</p>
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
        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              ইমেইল
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
                  'w-full rounded-xl border border-gray-200 bg-white/80 pl-10 pr-4 py-3 text-sm',
                  'focus:border-slate-ocean focus:outline-none focus:ring-2 focus:ring-slate-ocean/20',
                  'placeholder:text-gray-400 transition-colors'
                )}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={cn(
                  'w-full rounded-xl border border-gray-200 bg-white/80 pl-10 pr-4 py-3 text-sm',
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
              'w-full rounded-xl bg-slate-ocean py-3.5 text-base font-bold text-white shadow-md',
              'hover:bg-slate-ocean/90 transition-colors cursor-pointer',
              isPending && 'opacity-60 cursor-not-allowed'
            )}
          >
            {isPending ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 border-t border-gray-100" />
          <span className="text-xs text-gray-400">নতুন অ্যাকাউন্ট তৈরি করতে চান?</span>
          <div className="flex-1 border-t border-gray-100" />
        </div>

        {/* Register links */}
        <div className="space-y-2.5">
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/landlord/register"
              className="flex items-center justify-between w-full rounded-xl border-2 border-slate-ocean px-4 py-3 text-sm font-bold text-slate-ocean hover:bg-slate-ocean hover:text-white transition-colors"
            >
              <span>বাসা পোস্ট করতে বাড়িওয়ালা রেজিস্ট্রেশন</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/renter/register"
              className="flex items-center justify-between w-full rounded-xl border-2 border-cloud-mint px-4 py-3 text-sm font-bold text-slate-ocean hover:bg-cloud-mint transition-colors"
            >
              <span>বাসা খুঁজতে ভাড়াটে রেজিস্ট্রেশন</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
