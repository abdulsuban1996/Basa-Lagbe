'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bookmark,
  BookmarkCheck,
  Flag,
  Copy,
  Check,
  PhoneCall,
  Phone,
  CreditCard,
  Hash,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Clock,
} from 'lucide-react'
import { motion } from 'motion/react'
import { Modal } from '@/components/ui/Modal'
import { applyToListing, toggleBookmark, requestDirectNumber } from '@/lib/actions/renter'
import { createReport } from '@/lib/actions/listings'
import { cn } from '@/lib/utils'

// ---- Apply Button ----
export function ApplyButton({
  listingId,
  isLoggedIn,
}: {
  listingId: string
  isLoggedIn: boolean
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ error?: string; success?: boolean }>({})

  const handleApply = () => {
    if (!isLoggedIn) {
      router.push('/renter/register')
      return
    }
    setIsOpen(true)
  }

  const confirmApply = () => {
    startTransition(async () => {
      const res = await applyToListing(listingId)
      if (res.error) {
        setResult({ error: res.error })
      } else {
        setResult({ success: true })
      }
    })
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleApply}
        className="w-full rounded-2xl bg-slate-ocean py-4 text-base font-bold text-white shadow-md hover:bg-slate-ocean/90 transition-colors cursor-pointer"
      >
        Apply করুন (বিনামূল্যে)
      </motion.button>

      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); setResult({}) }} title="আবেদন নিশ্চিত করুন">
        {result.success ? (
          <div className="text-center py-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="text-5xl mb-2"
            >
              ✅
            </motion.div>
            <p className="mt-2 font-bold text-green-700 text-lg">আবেদন সফলভাবে পাঠানো হয়েছে!</p>
            <p className="mt-1 text-sm text-gray-500">বাড়িওয়ালা শীঘ্রই আপনার প্রোফাইল দেখবেন।</p>
            <button
              onClick={() => { setIsOpen(false); setResult({}) }}
              className="mt-5 w-full rounded-xl bg-slate-ocean py-3 text-sm font-semibold text-white cursor-pointer"
            >
              ঠিক আছে
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              আপনি কি এই বাসায় আবেদন করতে চান? বাড়িওয়ালা আপনার নাম, ফোন ও পেশার তথ্য যাচাই করে সিদ্ধান্ত নেবেন।
            </p>
            {result.error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{result.error}</div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={confirmApply}
                disabled={isPending}
                className="flex-1 rounded-xl bg-slate-ocean py-3 text-sm font-semibold text-white disabled:opacity-60 cursor-pointer"
              >
                {isPending ? 'পাঠানো হচ্ছে...' : 'হ্যাঁ, Apply করুন'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

// ---- Direct Number Button ----
export function DirectNumberButton({
  listingId,
  isLoggedIn,
  paymentInfo,
  directCallStatus,
  verifiedPhone,
}: {
  listingId: string
  isLoggedIn: boolean
  paymentInfo?: {
    method?: string
    number?: string
    amount?: string
  }
  directCallStatus?: 'pending' | 'verified' | 'rejected'
  verifiedPhone?: string
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ error?: string; success?: boolean }>({})
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad'>(
    paymentInfo?.method === 'nagad' ? 'nagad' : 'bkash'
  )
  const [paymentNumber, setPaymentNumber] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [copied, setCopied] = useState(false)

  const receiverNumber = paymentInfo?.number || '017XXXXXXXX'
  const feeAmount = paymentInfo?.amount || '30'

  const handleOpen = () => {
    if (!isLoggedIn) {
      router.push('/renter/register')
      return
    }
    setIsOpen(true)
  }

  const handleCopy = () => {
    if (!receiverNumber) return
    navigator.clipboard.writeText(receiverNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const handleSubmit = () => {
    if (!paymentNumber.trim() || !transactionId.trim()) return
    startTransition(async () => {
      const res = await requestDirectNumber(listingId, {
        payment_method: paymentMethod,
        payment_number: paymentNumber.trim(),
        payment_transaction_id: transactionId.trim(),
      })
      if (res.error) setResult({ error: res.error })
      else setResult({ success: true })
    })
  }

  // 🌟 If verified, show the unlocked landlord phone number directly
  if (directCallStatus === 'verified' && verifiedPhone) {
    return (
      <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/80 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            বাড়িওয়ালার সরাসরি ফোন নম্বর
          </span>
          <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
            অনুমোদিত
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-emerald-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Phone className="h-4 w-4" />
            </div>
            <span className="font-mono text-base font-black text-slate-ocean">
              {verifiedPhone}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(verifiedPhone)
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            className="flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-200 transition cursor-pointer"
          >
            {copied ? (
              <><Check className="h-3.5 w-3.5 text-emerald-600" /> কপি হয়েছে</>
            ) : (
              <><Copy className="h-3.5 w-3.5" /> কপি</>
            )}
          </button>
        </div>

        <a
          href={`tel:${verifiedPhone}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-emerald-700 transition"
        >
          <PhoneCall className="h-4 w-4" />
          সরাসরি কল করুন
        </a>
      </div>
    )
  }

  // ⏳ If pending
  if (directCallStatus === 'pending') {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-800">
          <Clock className="h-4 w-4 text-amber-600" />
          ডাইরেক্ট নম্বরের অনুরোধ যাচাইাধীন
        </div>
        <p className="text-[11px] text-amber-700/90 leading-relaxed">
          আপনার পেমেন্ট অ্যাডমিন ভেরিফাই করছেন। অনুমোদন সম্পন্ন হলে এখানে বাড়িওয়ালার নম্বর দৃশ্যমান হবে।
        </p>
      </div>
    )
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleOpen}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-ocean bg-white py-4 text-base font-bold text-slate-ocean hover:bg-cloud-mint/60 transition-colors cursor-pointer"
      >
        <PhoneCall className="h-4 w-4" />
        Direct Number নিন
      </motion.button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setResult({})
          setPaymentNumber('')
          setTransactionId('')
        }}
        title="সরাসরি কল নম্বর নিন"
      >
        {result.success ? (
          <div className="py-3 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">অনুরোধ সফলভাবে পাঠানো হয়েছে!</h3>
              <p className="mt-1 text-xs text-gray-500 max-w-xs mx-auto">
                অ্যাডমিন আপনার TrxID এবং পেমেন্ট যাচাই করে দ্রুত বাড়িওয়ালার সরাসরি ফোন নম্বর আপনার ড্যাশবোর্ডে উন্মুক্ত করে দেবেন।
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-3 text-xs font-semibold text-slate-ocean border border-gray-100">
              💡 আপনি আপনার <span className="font-bold underline">ভাড়াটে ড্যাশবোর্ড</span> থেকে স্ট্যাটাস দেখতে পারবেন।
            </div>
            <button
              onClick={() => {
                setIsOpen(false)
                setResult({})
              }}
              className="w-full rounded-xl bg-slate-ocean py-3 text-sm font-bold text-white shadow-sm hover:bg-slate-ocean/90 transition cursor-pointer"
            >
              ঠিক আছে
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            {/* ─── PAYMENT DESTINATION CARD ─── */}
            <div className="rounded-2xl border border-slate-ocean/15 bg-gradient-to-br from-slate-ocean/[0.04] to-cloud-mint/30 p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-ocean">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  পেমেন্ট পাঠানোর নম্বর (Personal)
                </span>
                <span className="rounded-full bg-slate-ocean px-2.5 py-0.5 text-[11px] font-extrabold text-white">
                  ৳{feeAmount} সেন্ড মানি
                </span>
              </div>

              {/* Number display & Copy box */}
              <div className="mt-3 flex items-center justify-between rounded-xl bg-white p-3 border border-gray-200/80 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-ocean/10 text-slate-ocean">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 font-medium block">
                      {paymentMethod === 'bkash' ? 'বিকাশ পার্সোনাল নম্বর' : 'নগদ পার্সোনাল নম্বর'}
                    </span>
                    <span className="font-mono text-base font-black text-slate-ocean tracking-wide">
                      {receiverNumber}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg bg-cloud-mint px-3 py-1.5 text-xs font-bold text-slate-ocean transition hover:bg-cloud-mint/80 cursor-pointer shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      কপি হয়েছে!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      কপি করুন
                    </>
                  )}
                </motion.button>
              </div>

              {/* Steps explanation */}
              <div className="mt-3 space-y-1 text-[11px] text-gray-600 leading-relaxed bg-white/60 rounded-xl p-2.5 border border-slate-ocean/5">
                <p>১. উপরের নম্বরে <b>৳{feeAmount} Send Money</b> করুন।</p>
                <p>২. টাকা পাঠানোর পর ফিরতি SMS এর <b>TrxID</b> নিচে দিন।</p>
              </div>
            </div>

            {/* ─── PAYMENT METHOD TOGGLE ─── */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-gray-600">
                পেমেন্ট মেথড নির্বাচন করুন
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'bkash', label: 'বিকাশ (bKash)', color: 'border-pink-500 bg-pink-50 text-pink-700' },
                  { id: 'nagad', label: 'নগদ (Nagad)', color: 'border-orange-500 bg-orange-50 text-orange-700' },
                ].map((m) => {
                  const isSelected = paymentMethod === m.id
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as 'bkash' | 'nagad')}
                      className={cn(
                        'flex items-center justify-center gap-1.5 rounded-xl border-2 py-2.5 text-xs font-bold transition-all cursor-pointer',
                        isSelected
                          ? m.color
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                      )}
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      {m.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ─── FORM INPUTS ─── */}
            <div className="space-y-3">
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-bold text-gray-700">
                  <Phone className="h-3.5 w-3.5 text-slate-ocean" />
                  আপনার প্রেরক নম্বর (যে নম্বর থেকে টাকা পাঠিয়েছেন)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: 017XXXXXXXX"
                  value={paymentNumber}
                  onChange={(e) => setPaymentNumber(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-slate-ocean focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-ocean/10"
                />
              </div>

              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-bold text-gray-700">
                  <Hash className="h-3.5 w-3.5 text-slate-ocean" />
                  ট্রানজেকশন আইডি (TrxID)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: 9M7A6BX9Z..."
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm uppercase font-mono text-gray-900 placeholder:text-gray-400 focus:border-slate-ocean focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-ocean/10"
                />
              </div>
            </div>

            {/* Error Message */}
            {result.error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{result.error}</span>
              </div>
            )}

            {/* ─── ACTION BUTTONS ─── */}
            <div className="flex gap-2.5 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
              >
                বাতিল
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending || !paymentNumber.trim() || !transactionId.trim()}
                className="flex-[1.5] rounded-xl bg-slate-ocean py-3 text-xs font-extrabold text-white shadow-sm transition hover:bg-slate-ocean/90 disabled:opacity-50 cursor-pointer"
              >
                {isPending ? 'যাচাই হচ্ছে...' : 'পেমেন্ট নিশ্চিত করুন'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}


// ---- Bookmark Button ----
export function BookmarkButton({
  listingId,
  initialBookmarked,
}: {
  listingId: string
  initialBookmarked: boolean
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked)
  const [isPending, startTransition] = useTransition()

  const toggle = () => {
    startTransition(async () => {
      const res = await toggleBookmark(listingId)
      if (!res.error) setBookmarked(res.bookmarked)
    })
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggle}
      disabled={isPending}
      title={bookmarked ? 'সেভ বাতিল করুন' : 'সেভ করুন'}
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-2xl border-2 py-3.5 text-sm font-semibold transition-colors cursor-pointer',
        bookmarked
          ? 'border-slate-ocean bg-slate-ocean text-white'
          : 'border-gray-200 text-gray-700 hover:border-slate-ocean hover:text-slate-ocean'
      )}
    >
      {bookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
      {bookmarked ? 'সেভ করা হয়েছে' : 'সেভ করে রাখুন'}
    </motion.button>
  )
}

// ---- Report Button ----
export function ReportButton({ listingId }: { listingId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ error?: string; success?: boolean }>({})

  const handleSubmit = () => {
    if (!reason.trim()) return
    startTransition(async () => {
      const res = await createReport(listingId, reason)
      if (res.error) setResult({ error: res.error })
      else setResult({ success: true })
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors cursor-pointer"
      >
        <Flag className="h-3.5 w-3.5" /> লিস্টিং রিপোর্ট করুন
      </button>

      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); setResult({}); setReason('') }} title="লিস্টিং রিপোর্ট করুন">
        {result.success ? (
          <div className="text-center py-2">
            <p className="font-bold text-green-700">রিপোর্ট সফলভাবে জমা হয়েছে। ধন্যবাদ।</p>
            <button onClick={() => { setIsOpen(false); setResult({}) }} className="mt-4 w-full rounded-xl bg-slate-ocean py-2.5 text-sm font-semibold text-white cursor-pointer">ঠিক আছে</button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              rows={4}
              placeholder="কী সমস্যা হয়েছে? বিস্তারিত লিখুন..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-slate-ocean focus:outline-none"
            />
            {result.error && <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{result.error}</div>}
            <div className="flex gap-3">
              <button onClick={() => setIsOpen(false)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer">বাতিল</button>
              <button onClick={handleSubmit} disabled={isPending || !reason.trim()} className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white disabled:opacity-60 cursor-pointer">
                {isPending ? 'পাঠানো হচ্ছে...' : 'রিপোর্ট পাঠান'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
