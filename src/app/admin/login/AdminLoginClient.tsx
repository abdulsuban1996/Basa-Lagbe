'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Mail, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { motion } from 'motion/react'

export function AdminLoginClient() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok || data.error) {
          setError(data.error ?? 'লগইন ব্যর্থ হয়েছে।')
        } else {
          router.push('/admin')
          router.refresh()
        }
      } catch {
        setError('সার্ভার সমস্যা। আবার চেষ্টা করুন।')
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Header Card */}
        <div className="rounded-t-3xl bg-slate-ocean px-8 py-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cloud-mint shadow-lg">
            <ShieldCheck className="h-9 w-9 text-slate-ocean" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-white">অ্যাডমিন লগইন</h1>
          <p className="mt-1 text-sm text-white/60">শুধুমাত্র অনুমোদিত অ্যাডমিনের জন্য</p>
        </div>

        {/* Form Card */}
        <div className="rounded-b-3xl border border-t-0 border-gray-200 bg-white px-8 py-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                অ্যাডমিন ইমেইল
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-slate-ocean focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-ocean/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:border-slate-ocean focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-ocean/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
              >
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-ocean py-3.5 text-sm font-extrabold text-white shadow-md transition hover:bg-slate-ocean/90 disabled:opacity-60"
            >
              <ShieldCheck className="h-4 w-4 text-cloud-mint" />
              {isPending ? 'যাচাই হচ্ছে...' : 'অ্যাডমিন হিসেবে প্রবেশ করুন'}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-[11px] text-gray-400">
            এই পেজটি শুধুমাত্র সিস্টেম অ্যাডমিনের জন্য। অননুমোদিত প্রবেশের চেষ্টা লগ করা হয়।
          </p>
        </div>
      </motion.div>
    </div>
  )
}
