'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Search, Home, MapPin, ArrowRight, ShieldCheck,
  Sparkles, Star, Users, BadgeCheck, Zap,
  CheckCircle, PhoneCall
} from 'lucide-react'
import { ListingCard } from '@/components/ListingCard'
import type { Listing } from '@/types'

interface HomeClientProps {
  recentListings: Listing[]
}

const AREAS = [
  { name: 'মিরপুর', count: '৩২০+' },
  { name: 'মোহাম্মদপুর', count: '২৮৫+' },
  { name: 'ধানমন্ডি', count: '২১০+' },
  { name: 'গুলশান', count: '১৮৫+' },
  { name: 'উত্তরা', count: '৩৪০+' },
  { name: 'বনানী', count: '১৫০+' },
  { name: 'রামপুরা', count: '২৪০+' },
  { name: 'বাড়্ডা', count: '১৯০+' },
  { name: 'মালিবাগ', count: '১৬০+' },
  { name: 'শ্যামলী', count: '১৩০+' },
  { name: 'আজিমপুর', count: '১১০+' },
  { name: 'লালমাটিয়া', count: '৯৫+' },
]

export function HomeClient({ recentListings }: HomeClientProps) {
  return (
    <div className="flex flex-col">

      {/* ─── HERO ─── */}
      <section className="relative isolate overflow-hidden bg-slate-ocean">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -25, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-white/[0.04] blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -25, 0], y: [0, 30, 0], scale: [1, 1.18, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-40 -right-28 h-[600px] w-[600px] rounded-full bg-cloud-mint/[0.07] blur-3xl"
          />
          <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 pt-20 pb-0 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-7 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-cloud-mint backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              বাংলাদেশের #১ রেন্টাল প্ল্যাটফর্ম
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.08 }}
            className="text-center text-[2.6rem] font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl md:text-[4.2rem]">
            স্বপ্নের বাসা খুঁজুন{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-cloud-mint">সহজে</span>
              <motion.svg viewBox="0 0 120 12" className="absolute -bottom-2 left-0 w-full" fill="none">
                <motion.path d="M2 8 Q30 2 60 8 Q90 14 118 8" stroke="#DDFBEF" strokeWidth="3" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.7 }} />
              </motion.svg>
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-center text-base text-white/70 sm:text-lg">
            আপনার পছন্দের এলাকায় ফ্ল্যাট, সাবলেট, মেস বা বাণিজ্যিক স্পেস খুঁজে নিন — সম্পূর্ণ বিনামূল্যে।
          </motion.p>

          <motion.form action="/listings" method="GET" initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.32 }} className="mt-9">
            <div className="flex flex-col gap-2 overflow-hidden rounded-2xl bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-1 ring-1 ring-gray-100">
                <MapPin className="h-[18px] w-[18px] shrink-0 text-slate-ocean/50" />
                <input type="text" name="area" placeholder="এলাকা বা ল্যান্ডমার্ক লিখুন..."
                  className="flex-1 bg-transparent py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none" />
              </div>
              <select name="category" className="rounded-xl border-0 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none cursor-pointer">
                <option value="">সব ধরন</option>
                <option value="residential">আবাসিক</option>
                <option value="commercial">বাণিজ্যিক</option>
              </select>
              <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-ocean px-7 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-ocean/85 cursor-pointer">
                <Search className="h-4 w-4" />
                <span>খুঁজুন</span>
              </motion.button>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
              className="mt-3 flex flex-wrap justify-center gap-2">
              {['মিরপুর', 'ধানমন্ডি', 'উত্তরা', 'গুলশান', 'বনানী', 'মোহাম্মদপুর'].map((area) => (
                <Link key={area} href={`/listings?area=${encodeURIComponent(area)}`}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/70 backdrop-blur-sm transition-colors hover:bg-white/15 hover:text-white">
                  {area}
                </Link>
              ))}
            </motion.div>
          </motion.form>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { href: '/listings?category=residential', emoji: '🏠', title: 'আবাসিক বাসা', sub: 'ফ্ল্যাট, ব্যাচেলর, ফ্যামিলি, সাবলেট', color: 'from-blue-500/20 to-blue-400/10', border: 'border-blue-400/20' },
              { href: '/listings?category=commercial', emoji: '🏢', title: 'বাণিজ্যিক স্পেস', sub: 'অফিস, শোরুম, গুদাম, স্পেস', color: 'from-emerald-500/20 to-emerald-400/10', border: 'border-emerald-400/20' },
            ].map((cat, i) => (
              <motion.div key={cat.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 + i * 0.08 }} whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href={cat.href} className={`group flex items-center gap-4 rounded-2xl border bg-gradient-to-br ${cat.color} ${cat.border} p-5 text-white backdrop-blur-md transition-all hover:border-white/30`}>
                  <span className="text-4xl">{cat.emoji}</span>
                  <div className="flex-1 text-left">
                    <div className="text-[15px] font-bold">{cat.title}</div>
                    <div className="mt-0.5 text-xs text-white/60">{cat.sub}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/40 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white/80" />
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.65 }}
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { value: '৫,০০০+', label: 'সক্রিয় লিস্টিং', icon: Home },
              { value: '১২,০০০+', label: 'নিবন্ধিত ব্যবহারকারী', icon: Users },
              { value: '৬৪+', label: 'জেলা কভার', icon: MapPin },
              { value: '৯৮%', label: 'সন্তুষ্ট ভাড়াটে', icon: Star },
            ].map(({ value, label, icon: Icon }, i) => (
              <motion.div key={label} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 + i * 0.07 }}
                className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/6 px-3 py-4 backdrop-blur-sm">
                <Icon className="h-4 w-4 text-cloud-mint/80" />
                <span className="text-xl font-extrabold text-white">{value}</span>
                <span className="text-center text-[10px] leading-tight text-white/55">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="relative mt-12 border-t border-white/8 bg-white/[0.04] px-4 py-5 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between sm:items-start">
              {[
                { icon: BadgeCheck, label: 'যাচাইকৃত তালিকা', desc: 'প্রতিটি লিস্টিং অ্যাডমিন যাচাই করা' },
                { icon: Zap, label: 'তাৎক্ষণিক আবেদন', desc: 'এক ক্লিকে বিনামূল্যে আবেদন করুন' },
                { icon: ShieldCheck, label: 'নিরাপদ প্ল্যাটফর্ম', desc: 'আপনার তথ্য সম্পূর্ণ সুরক্ষিত' },
              ].map(({ icon: Icon, label, desc }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.08 }}
                  className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cloud-mint/15">
                    <Icon className="h-4 w-4 text-cloud-mint" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-white">{label}</div>
                    <div className="text-[10px] text-white/50">{desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── RECENT LISTINGS ─── */}
      <section className="relative px-4 py-20 bg-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-ocean/[0.03] to-transparent" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <motion.span initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="inline-flex items-center gap-1.5 rounded-full bg-cloud-mint px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-ocean">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-ocean animate-pulse" />
                লাইভ লিস্টিং
              </motion.span>
              <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}
                className="mt-3 text-3xl font-extrabold tracking-tight text-slate-ocean md:text-4xl">
                সাম্প্রতিক লিস্টিং
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.14 }}
                className="mt-1.5 text-sm text-gray-500">
                সবশেষ যাচাইকৃত ও উপলব্ধ ভাড়ার বাসাসমূহ
              </motion.p>
            </div>
            <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} whileHover={{ x: 4 }}>
              <Link href="/listings"
                className="group inline-flex items-center gap-2 rounded-2xl border border-slate-ocean/20 bg-white px-5 py-2.5 text-sm font-semibold text-slate-ocean shadow-xs transition-all hover:bg-slate-ocean hover:text-white hover:shadow-md">
                সব লিস্টিং দেখুন
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {recentListings.length > 0 ? (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {recentListings.map((listing, index) => (
                <motion.div key={listing.id} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.48, delay: index * 0.09 }}>
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/60 px-8 py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cloud-mint/50">
                <Home className="h-9 w-9 text-slate-ocean/60" />
              </div>
              <p className="mt-5 text-lg font-bold text-gray-700">এখনো কোনো লিস্টিং নেই</p>
              <p className="mt-1 text-sm text-gray-400">প্রথম বাসা পোস্ট করতে বাড়িওয়ালা হিসেবে যোগ দিন</p>
              <Link href="/landlord/register" className="mt-6 rounded-xl bg-slate-ocean px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-ocean/85 transition-colors">
                বাসা পোস্ট করুন
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-ocean to-[#1e3346] px-4 py-24">
        <div className="pointer-events-none absolute inset-0">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-24 -right-24 h-96 w-96 rounded-full border border-white/5" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full border border-white/5" />
        </div>
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <motion.span initial={{ opacity: 0, y: -8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center rounded-full border border-cloud-mint/20 bg-cloud-mint/10 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-cloud-mint">
              ৩ ধাপে সহজ
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="mt-4 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              কীভাবে কাজ করে?
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.18 }}
              className="mt-2 text-sm text-white/60">
              মাত্র ৩টি ধাপে আপনার পছন্দসই বাসা খুঁজে নিন
            </motion.p>
          </div>
          <div className="relative grid grid-cols-1 gap-6 pt-6 sm:grid-cols-3">
            <div className="absolute top-16 left-[16.66%] right-[16.66%] hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent sm:block" />
            {[
              { num: '০১', icon: <Search className="h-6 w-6 text-white" />, title: 'খুঁজুন', desc: 'এলাকা, বাজেট ও ধরন দিয়ে ফিল্টার করুন এবং পছন্দের বাসা বেছে নিন', color: 'from-blue-500/30 to-blue-400/10' },
              { num: '০২', icon: <CheckCircle className="h-6 w-6 text-white" />, title: 'Apply করুন', desc: 'পছন্দের বাসায় বিনামূল্যে এক ক্লিকে আবেদন করুন', color: 'from-emerald-500/30 to-emerald-400/10' },
              { num: '০৩', icon: <PhoneCall className="h-6 w-6 text-white" />, title: 'যোগাযোগ করুন', desc: 'বাড়িওয়ালার নম্বর নিন, বাসা দেখুন এবং আজই উঠে পড়ুন', color: 'from-purple-500/30 to-purple-400/10' },
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.14 }} whileHover={{ y: -6 }}
                className="relative flex h-full flex-col items-center text-center">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span className="inline-flex items-center justify-center rounded-full border border-white/20 bg-slate-ocean px-3 py-1 text-[11px] font-bold tracking-widest text-white shadow-lg shadow-black/20 ring-1 ring-white/10">
                    {step.num}
                  </span>
                </div>
                <div className={`h-full w-full rounded-3xl border border-white/10 bg-gradient-to-br ${step.color} backdrop-blur-sm p-8 pt-12`}>
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 shadow-inner">{step.icon}</div>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/65">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── POPULAR AREAS ─── */}
      <section className="bg-gray-50 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 rounded-full bg-cloud-mint px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-ocean">
              <MapPin className="h-3 w-3" /> জনপ্রিয় এলাকা
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}
              className="mt-3 text-3xl font-extrabold tracking-tight text-slate-ocean md:text-4xl">
              কোথায় খুঁজছেন?
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.14 }}
              className="mt-1.5 text-sm text-gray-500">
              সবচেয়ে বেশি মানুষ যেসব এলাকায় বাসা খোঁজেন
            </motion.p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {AREAS.map(({ name, count }, idx) => (
              <motion.div key={name} initial={{ opacity: 0, scale: 0.88 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.32, delay: idx * 0.035 }}
                whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                <Link href={`/listings?area=${encodeURIComponent(name)}`}
                  className="group flex flex-col items-center justify-center gap-1 rounded-2xl border border-gray-200 bg-white px-3 py-4 text-center shadow-xs transition-all hover:border-slate-ocean hover:shadow-md">
                  <MapPin className="h-4 w-4 text-gray-300 transition-colors group-hover:text-slate-ocean" />
                  <span className="text-sm font-bold text-gray-800 group-hover:text-slate-ocean transition-colors">{name}</span>
                  <span className="text-[10px] font-semibold text-gray-400 group-hover:text-slate-ocean/60">{count}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LANDLORD CTA ─── */}
      <section className="relative overflow-hidden bg-slate-ocean px-4 py-24">
        <div className="pointer-events-none absolute inset-0">
          <motion.div animate={{ x: [0, 20, 0], y: [0, -15, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-cloud-mint/10 blur-3xl" />
          <motion.div animate={{ x: [0, -20, 0], y: [0, 20, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
            <div className="flex-1 text-center lg:text-left">
              <motion.div initial={{ opacity: 0, y: -8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="inline-flex items-center gap-1.5 rounded-full border border-cloud-mint/20 bg-cloud-mint/15 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-cloud-mint mb-5">
                <ShieldCheck className="h-3.5 w-3.5" /> বাড়িওয়ালাদের জন্য
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}
                className="text-3xl font-extrabold leading-tight text-white md:text-4xl">
                আপনার বাসা কি এখনো খালি?
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
                className="mt-4 text-base leading-relaxed text-white/65">
                আজই বিনামূল্যে পোস্ট করুন এবং দ্রুত বিশ্বস্ত ভাড়াটে খুঁজে নিন।
              </motion.p>
              <motion.ul initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.22 }}
                className="mt-6 flex flex-col gap-2.5">
                {[
                  'বিনামূল্যে ছবি সহ লিস্টিং করুন',
                  'যাচাইকৃত ভাড়াটেদের আবেদন পান',
                  'সরাসরি নম্বর থেকে আয় করুন',
                ].map(feat => (
                  <li key={feat} className="flex items-center gap-2.5 text-sm text-white/75">
                    <CheckCircle className="h-4 w-4 shrink-0 text-cloud-mint" />{feat}
                  </li>
                ))}
              </motion.ul>
              <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link href="/landlord/register"
                    className="inline-flex items-center gap-2 rounded-2xl bg-cloud-mint px-7 py-3.5 text-sm font-bold text-slate-ocean shadow-lg transition-all hover:bg-cloud-mint/90 hover:shadow-xl">
                    বিনামূল্যে শুরু করুন
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link href="/login"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10">
                    আগে থেকে আছি? লগইন
                  </Link>
                </motion.div>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="grid w-full max-w-xs grid-cols-2 gap-3 lg:w-auto">
              {[
                { value: '৭২ ঘণ্টা', label: 'গড় ভাড়াটে পাওয়ার সময়', icon: '⚡' },
                { value: '০ টাকা', label: 'বেসিক লিস্টিং খরচ', icon: '🎁' },
                { value: '৫,০০০+', label: 'সক্রিয় বাড়িওয়ালা', icon: '🏠' },
                { value: '৯৮%', label: 'সন্তুষ্টির হার', icon: '⭐' },
              ].map(({ value, label, icon }) => (
                <div key={label} className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/8 p-5 text-center backdrop-blur-sm">
                  <span className="text-2xl">{icon}</span>
                  <span className="mt-2 text-xl font-extrabold text-white">{value}</span>
                  <span className="mt-1 text-[10px] leading-tight text-white/50">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
