'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { registerRenter } from '@/lib/actions/auth'
import { cn } from '@/lib/utils'
import { ChevronLeft, Home, ArrowLeft, User, Mail, Phone, MapPin, Lock, Briefcase, GraduationCap } from 'lucide-react'

const initialState: { error?: string } = {}

type Step = 1 | 2
type OccupationType = 'job' | 'student'

export default function RenterRegisterPage() {
  const [state, formAction, isPending] = useActionState(
    registerRenter,
    initialState
  )

  const [step, setStep] = useState<Step>(1)
  const [occupation, setOccupation] = useState<OccupationType>('job')

  // Step 1 field values
  const [step1, setStep1] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  })

  const step1Valid =
    step1.name.trim() &&
    step1.email.trim() &&
    step1.phone.trim() &&
    step1.address.trim() &&
    step1.password.length >= 6

  const inputClass = cn(
    'w-full rounded-xl border border-gray-200 bg-white/80 pl-10 pr-4 py-2.5 text-sm',
    'focus:border-slate-ocean focus:outline-none focus:ring-2 focus:ring-slate-ocean/20',
    'placeholder:text-gray-400 transition-colors'
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
        <div className="text-center mb-5">
          <Link href="/" className="inline-block">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-ocean text-white shadow-md mb-3"
            >
              <Home className="h-6 w-6" />
            </motion.div>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-ocean tracking-tight">
            ভাড়াটিয়া রেজিস্ট্রেশন
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            বাসা খুঁজতে ও আবেদন করতে আপনার অ্যাকাউন্ট তৈরি করুন
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors',
              step === 1
                ? 'bg-slate-ocean text-white'
                : 'bg-cloud-mint text-slate-ocean'
            )}
          >
            ১
          </div>
          <div className="h-0.5 w-12 bg-gray-200" />
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors',
              step === 2
                ? 'bg-slate-ocean text-white'
                : 'bg-gray-100 text-gray-400'
            )}
          >
            ২
          </div>
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

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                পূর্ণ নাম <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={step1.name}
                  onChange={(e) => setStep1({ ...step1, name: e.target.value })}
                  placeholder="আপনার নাম লিখুন"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ইমেইল <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={step1.email}
                  onChange={(e) => setStep1({ ...step1, email: e.target.value })}
                  autoComplete="email"
                  placeholder="example@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ফোন নম্বর <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  value={step1.phone}
                  onChange={(e) => setStep1({ ...step1, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                বর্তমান ঠিকানা <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  value={step1.address}
                  onChange={(e) =>
                    setStep1({ ...step1, address: e.target.value })
                  }
                  rows={2}
                  placeholder="আপনার বর্তমান ঠিকানা"
                  className={cn(inputClass, 'resize-none')}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                পাসওয়ার্ড <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  value={step1.password}
                  onChange={(e) =>
                    setStep1({ ...step1, password: e.target.value })
                  }
                  autoComplete="new-password"
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  minLength={6}
                  className={inputClass}
                />
              </div>
            </div>

            <motion.button
              type="button"
              disabled={!step1Valid}
              whileHover={step1Valid ? { scale: 1.02 } : undefined}
              whileTap={step1Valid ? { scale: 0.98 } : undefined}
              onClick={() => setStep(2)}
              className={cn(
                'w-full rounded-xl bg-slate-ocean py-3 text-sm font-bold text-white shadow-md mt-2 cursor-pointer',
                'hover:bg-slate-ocean/90 transition-colors',
                !step1Valid && 'opacity-50 cursor-not-allowed'
              )}
            >
              পরবর্তী ধাপ (পেশা ও বিবরণ) →
            </motion.button>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <form action={formAction} className="space-y-4">
            {/* Hidden step-1 fields */}
            <input type="hidden" name="name" value={step1.name} />
            <input type="hidden" name="email" value={step1.email} />
            <input type="hidden" name="phone" value={step1.phone} />
            <input type="hidden" name="address" value={step1.address} />
            <input type="hidden" name="password" value={step1.password} />

            {/* Occupation type */}
            <div>
              <p className="block text-xs font-bold text-gray-700 mb-2">
                আপনার পেশা নির্বাচন করুন <span className="text-red-500">*</span>
              </p>
              <div className="flex gap-3">
                <label
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold cursor-pointer transition-all',
                    occupation === 'job'
                      ? 'border-slate-ocean bg-slate-ocean text-white shadow-xs'
                      : 'border-gray-200 text-gray-600 hover:border-slate-ocean/40'
                  )}
                >
                  <Briefcase className="h-4 w-4" />
                  <input
                    type="radio"
                    name="occupation_type"
                    value="job"
                    checked={occupation === 'job'}
                    onChange={() => setOccupation('job')}
                    className="sr-only"
                  />
                  চাকরিজীবী
                </label>
                <label
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold cursor-pointer transition-all',
                    occupation === 'student'
                      ? 'border-slate-ocean bg-slate-ocean text-white shadow-xs'
                      : 'border-gray-200 text-gray-600 hover:border-slate-ocean/40'
                  )}
                >
                  <GraduationCap className="h-4 w-4" />
                  <input
                    type="radio"
                    name="occupation_type"
                    value="student"
                    checked={occupation === 'student'}
                    onChange={() => setOccupation('student')}
                    className="sr-only"
                  />
                  শিক্ষার্থী
                </label>
              </div>
            </div>

            {/* Job fields */}
            {occupation === 'job' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    পদবি / পদমর্যাদা
                  </label>
                  <input
                    type="text"
                    name="job_title"
                    placeholder="যেমন: সিনিয়র অফিসার / সফটওয়্যার ডেভেলপার"
                    className={cn(inputClass, 'pl-4')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    প্রতিষ্ঠানের নাম ও অবস্থান
                  </label>
                  <input
                    type="text"
                    name="job_location"
                    placeholder="যেমন: ব্র্যাক ব্যাংক, গুলশান"
                    className={cn(inputClass, 'pl-4')}
                  />
                </div>
              </>
            )}

            {/* Student fields */}
            {occupation === 'student' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    শিক্ষা প্রতিষ্ঠানের নাম
                  </label>
                  <input
                    type="text"
                    name="institution_name"
                    placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয়"
                    className={cn(inputClass, 'pl-4')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ক্যাম্পাসের অবস্থান
                  </label>
                  <input
                    type="text"
                    name="institution_location"
                    placeholder="যেমন: নীলক্ষেত, ঢাকা"
                    className={cn(inputClass, 'pl-4')}
                  />
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 hover:border-slate-ocean hover:text-slate-ocean transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                পেছনে
              </button>
              <motion.button
                type="submit"
                disabled={isPending}
                whileHover={isPending ? undefined : { scale: 1.02 }}
                whileTap={isPending ? undefined : { scale: 0.98 }}
                className={cn(
                  'flex-1 rounded-xl bg-slate-ocean py-3 text-sm font-bold text-white shadow-md cursor-pointer',
                  'hover:bg-slate-ocean/90 transition-colors',
                  isPending && 'opacity-60 cursor-not-allowed'
                )}
              >
                {isPending ? 'রেজিস্ট্রেশন হচ্ছে...' : 'সম্পূর্ণ করুন'}
              </motion.button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="mt-5 border-t border-gray-100 pt-4 text-center">
          <p className="text-xs text-gray-500">
            বাড়িওয়ালা হিসেবে বাসা পোস্ট করতে চান?{' '}
            <Link href="/landlord/register" className="font-bold text-slate-ocean hover:underline">
              এখানে যান
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
