'use client'

import { useState, useTransition, useRef } from 'react'
import { motion } from 'motion/react'
import {
  Save, Globe, Mail, MapPin, Phone,
  CreditCard, Hash, FileText, Image as ImageIcon,
  CheckCircle2, AlertCircle, Settings, Upload,
  Trash2, RefreshCw, Loader2, Sparkles,
} from 'lucide-react'
import { updateSiteSettings } from '@/lib/actions/settings'
import type { SiteSettings } from '@/lib/actions/settings'

interface Props {
  initialSettings: SiteSettings
}

export function AdminSettingsTab({ initialSettings }: Props) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  // Upload states
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (key: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
    setError('')
  }

  // Generic ImageKit uploader
  const uploadImage = async (file: File, folder: string = '/basa-lagbe/branding'): Promise<string | null> => {
    try {
      const authRes = await fetch('/api/imagekit-auth')
      if (!authRes.ok) throw new Error('Auth failed')
      const { token, expire, signature, publicKey } = await authRes.json()

      const pk =
        publicKey ||
        process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
        'public_SwUJt+vXf8Vmk3+Hzz05edUB57Y='

      const fd = new FormData()
      fd.append('file', file)
      fd.append('fileName', `${Date.now()}-${file.name.replace(/\s+/g, '_')}`)
      fd.append('folder', folder)
      fd.append('publicKey', pk)
      fd.append('signature', signature)
      fd.append('expire', String(expire))
      fd.append('token', token)

      const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()
      if (data.url) return data.url
      throw new Error(data.message || 'Upload error')
    } catch (err) {
      console.error('Upload error:', err)
      return null
    }
  }

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    setError('')
    const url = await uploadImage(file, '/basa-lagbe/branding/logo')
    if (url) {
      handleChange('logo_url', url)
    } else {
      setError('লোগো আপলোড ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।')
    }
    setUploadingLogo(false)
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  const handleFaviconFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingFavicon(true)
    setError('')
    const url = await uploadImage(file, '/basa-lagbe/branding/favicon')
    if (url) {
      handleChange('favicon_url', url)
    } else {
      setError('Favicon আপলোড ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।')
    }
    setUploadingFavicon(false)
    if (faviconInputRef.current) faviconInputRef.current.value = ''
  }

  const handleSave = () => {
    startTransition(async () => {
      const res = await updateSiteSettings(settings)
      if (res.error) {
        setError(res.error)
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-10"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-5">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-black text-gray-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-ocean text-white shadow-xs">
              <Settings className="h-5 w-5" />
            </span>
            সাইট সেটিং ও ব্র্যান্ডিং
          </h2>
          <p className="mt-1 text-xs text-gray-500 font-medium">
            লোগো, Favicon, ওয়েবসাইটের সাধারণ তথ্য, যোগাযোগ ও পেমেন্ট নম্বর সহজে আপলোড ও পরিবর্তন করুন
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={isPending || uploadingLogo || uploadingFavicon}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-ocean px-6 py-3 text-sm font-extrabold text-white shadow-md transition hover:bg-slate-ocean/90 disabled:opacity-60 cursor-pointer"
        >
          {saved ? (
            <><CheckCircle2 className="h-4 w-4 text-cloud-mint" /> সংরক্ষিত হয়েছে!</>
          ) : isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin text-cloud-mint" /> সংরক্ষণ হচ্ছে...</>
          ) : (
            <><Save className="h-4 w-4 text-cloud-mint" /> পরিবর্তন সংরক্ষণ করুন</>
          )}
        </motion.button>
      </div>

      {/* Error notice */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 shadow-xs"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* ─── SECTION 1: আপলোড ও ব্র্যান্ডিং (LOGO & FAVICON UPLOAD SYSTEM) ─── */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-7 shadow-xs">
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="flex items-center gap-2 text-base font-extrabold text-slate-ocean">
              <Sparkles className="h-4 w-4 text-amber-500" />
              লোগো ও Favicon আপলোড সিস্টেম
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              ডিভাইস থেকে সরাসরি ফাইল সিলেক্ট করে আপলোড করুন
            </p>
          </div>
          <span className="rounded-full bg-cloud-mint px-3 py-1 text-[11px] font-bold text-slate-ocean">
            সরাসরি আপলোড
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* 1.1 LOGO UPLOAD BOX */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/70 p-5 transition hover:border-slate-ocean/40">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-ocean">
                  <ImageIcon className="h-4 w-4" />
                  ওয়েবসাইট লোগো
                </label>
                <span className="text-[11px] font-medium text-gray-400">PNG, JPG, SVG</span>
              </div>

              {/* Logo Preview or Empty State */}
              <div className="relative mb-4 flex min-h-[140px] w-full items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
                {uploadingLogo ? (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-ocean" />
                    <span className="text-xs font-bold text-slate-ocean">লোগো আপলোড হচ্ছে...</span>
                  </div>
                ) : settings.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={settings.logo_url}
                    alt="Logo Preview"
                    className="max-h-24 max-w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center text-center text-gray-400">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mb-2">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-bold text-gray-600">কোনো লোগো আপলোড করা নেই</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">ডিফল্ট টেক্সট ও হোম আইকন ব্যবহৃত হচ্ছে</p>
                  </div>
                )}
              </div>

              {/* URL Direct preview / edit */}
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="অথবা লোগো ইমেজ URL দিন..."
                  value={settings.logo_url}
                  onChange={(e) => handleChange('logo_url', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 placeholder:text-gray-400 focus:border-slate-ocean focus:outline-none"
                />
              </div>
            </div>

            {/* Logo Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200/80">
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                className="hidden"
                id="logo-file-input"
              />
              <label
                htmlFor="logo-file-input"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-ocean px-3.5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-ocean/90 transition cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-cloud-mint" />
                {settings.logo_url ? 'নতুন লোগো আপলোড' : 'লোগো ফাইল নির্বাচন করুন'}
              </label>

              {settings.logo_url && (
                <button
                  type="button"
                  onClick={() => handleChange('logo_url', '')}
                  className="flex items-center justify-center rounded-xl border border-red-200 bg-red-50 p-2.5 text-red-600 hover:bg-red-100 transition cursor-pointer"
                  title="লোগো রিমুভ করুন"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* 1.2 FAVICON UPLOAD BOX */}
          <div className="flex flex-col justify-between rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/70 p-5 transition hover:border-slate-ocean/40">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-ocean">
                  <Globe className="h-4 w-4" />
                  Favicon (ট্যাব আইকন)
                </label>
                <span className="text-[11px] font-medium text-gray-400">ICO, PNG (৩২x৩২)</span>
              </div>

              {/* Favicon Browser Tab Mock Preview */}
              <div className="relative mb-4 flex min-h-[140px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
                {uploadingFavicon ? (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-ocean" />
                    <span className="text-xs font-bold text-slate-ocean">Favicon আপলোড হচ্ছে...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    {/* Simulated browser tab */}
                    <div className="flex items-center gap-2 rounded-t-lg border border-gray-300 bg-gray-100 px-3 py-1.5 shadow-2xs">
                      {settings.favicon_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={settings.favicon_url}
                          alt="Favicon"
                          className="h-4 w-4 rounded-xs object-contain"
                        />
                      ) : (
                        <div className="h-4 w-4 rounded-xs bg-slate-ocean text-white flex items-center justify-center text-[9px] font-bold">
                          ব
                        </div>
                      )}
                      <span className="text-[11px] font-semibold text-gray-700 max-w-[120px] truncate">
                        {settings.site_name || 'বাসা লাগবে'}
                      </span>
                    </div>

                    {/* Big preview */}
                    {settings.favicon_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={settings.favicon_url}
                        alt="Favicon preview"
                        className="h-10 w-10 object-contain rounded-md border border-gray-200 p-1 bg-white"
                      />
                    )}

                    {!settings.favicon_url && (
                      <p className="text-[11px] text-gray-400">ব্রাউজার ট্যাবে এই আইকনটি দেখাবে</p>
                    )}
                  </div>
                )}
              </div>

              {/* URL direct edit */}
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="অথবা Favicon URL দিন..."
                  value={settings.favicon_url}
                  onChange={(e) => handleChange('favicon_url', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 placeholder:text-gray-400 focus:border-slate-ocean focus:outline-none"
                />
              </div>
            </div>

            {/* Favicon Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200/80">
              <input
                ref={faviconInputRef}
                type="file"
                accept="image/*,.ico"
                onChange={handleFaviconFileChange}
                className="hidden"
                id="favicon-file-input"
              />
              <label
                htmlFor="favicon-file-input"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-slate-ocean px-3.5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-ocean/90 transition cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-cloud-mint" />
                {settings.favicon_url ? 'নতুন Favicon আপলোড' : 'Favicon ফাইল নির্বাচন করুন'}
              </label>

              {settings.favicon_url && (
                <button
                  type="button"
                  onClick={() => handleChange('favicon_url', '')}
                  className="flex items-center justify-center rounded-xl border border-red-200 bg-red-50 p-2.5 text-red-600 hover:bg-red-100 transition cursor-pointer"
                  title="Favicon রিমুভ করুন"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: মৌলিক তথ্য (NAME, TAGLINE & FOOTER ABOUT) ─── */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-7 shadow-xs space-y-5">
        <h3 className="flex items-center gap-2 text-base font-extrabold text-slate-ocean border-b border-gray-100 pb-3">
          <Globe className="h-4 w-4 text-blue-600" />
          ওয়েবসাইট পরিচিতি ও নাম
        </h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Site Name */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
              সাইটের নাম
            </label>
            <input
              type="text"
              value={settings.site_name}
              onChange={(e) => handleChange('site_name', e.target.value)}
              placeholder="বাসা লাগবে"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-slate-ocean focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-ocean/10"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
              ট্যাগলাইন
            </label>
            <input
              type="text"
              value={settings.site_tagline}
              onChange={(e) => handleChange('site_tagline', e.target.value)}
              placeholder="বাংলাদেশের রেন্টাল প্ল্যাটফর্ম"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-slate-ocean focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-ocean/10"
            />
          </div>

          {/* Footer About */}
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
              Footer বিবরণ (সংক্ষিপ্ত পরিচিতি)
            </label>
            <textarea
              rows={3}
              value={settings.footer_about}
              onChange={(e) => handleChange('footer_about', e.target.value)}
              placeholder="বাসা লাগবে সম্পর্কে সংক্ষিপ্ত বিবরণ যা ফুটারে দেখাবে..."
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-slate-ocean focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-ocean/10"
            />
          </div>
        </div>
      </div>

      {/* ─── SECTION 3: কোম্পানি ও যোগাযোগ (FOOTER EMAIL, ADDRESS & PHONE) ─── */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-7 shadow-xs space-y-5">
        <h3 className="flex items-center gap-2 text-base font-extrabold text-slate-ocean border-b border-gray-100 pb-3">
          <MapPin className="h-4 w-4 text-emerald-600" />
          কোম্পানির ঠিকানা ও যোগাযোগ (ফুটারে প্রদর্শিত হবে)
        </h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Address */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-600">
              <MapPin className="h-3.5 w-3.5 text-slate-ocean" />
              কোম্পানির ঠিকানা
            </label>
            <input
              type="text"
              value={settings.company_address}
              onChange={(e) => handleChange('company_address', e.target.value)}
              placeholder="ঢাকা, বাংলাদেশ"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-slate-ocean focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-ocean/10"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-600">
              <Mail className="h-3.5 w-3.5 text-slate-ocean" />
              কোম্পানির ইমেইল
            </label>
            <input
              type="email"
              value={settings.company_email}
              onChange={(e) => handleChange('company_email', e.target.value)}
              placeholder="hello.saddamhosen@gmail.com"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-slate-ocean focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-ocean/10"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-600">
              <Phone className="h-3.5 w-3.5 text-slate-ocean" />
              কোম্পানির ফোন নম্বর
            </label>
            <input
              type="text"
              value={settings.company_phone}
              onChange={(e) => handleChange('company_phone', e.target.value)}
              placeholder="+880 1XXX-XXXXXX"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-slate-ocean focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-ocean/10"
            />
          </div>
        </div>
      </div>

      {/* ─── SECTION 4: পেমেন্ট মেথড ও নম্বর (DIRECT CALL PAYMENT SYSTEM) ─── */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-7 shadow-xs space-y-5">
        <h3 className="flex items-center gap-2 text-base font-extrabold text-slate-ocean border-b border-gray-100 pb-3">
          <CreditCard className="h-4 w-4 text-purple-600" />
          পেমেন্ট মেথড ও নম্বর সেটিং
        </h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Payment Method */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-600">
              <CreditCard className="h-3.5 w-3.5 text-slate-ocean" />
              পেমেন্ট মেথড
            </label>
            <select
              value={settings.payment_method}
              onChange={(e) => handleChange('payment_method', e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-800 focus:border-slate-ocean focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-ocean/10"
            >
              <option value="bkash">বিকাশ (bKash)</option>
              <option value="nagad">নগদ (Nagad)</option>
              <option value="both">বিকাশ ও নগদ উভয়ই</option>
            </select>
          </div>

          {/* Payment Number */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-600">
              <Hash className="h-3.5 w-3.5 text-slate-ocean" />
              পেমেন্ট গ্রহণকারী নম্বর
            </label>
            <input
              type="text"
              value={settings.payment_number}
              onChange={(e) => handleChange('payment_number', e.target.value)}
              placeholder="যেমন: 017XXXXXXXX"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-slate-ocean focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-ocean/10"
            />
            <p className="mt-1 text-[11px] text-gray-400">এই নম্বরে ব্যবহারকারীরা টাকা পাঠাবে</p>
          </div>

          {/* Payment Amount */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-600">
              <CreditCard className="h-3.5 w-3.5 text-slate-ocean" />
              Direct Number ফি (৳)
            </label>
            <input
              type="number"
              value={settings.payment_amount}
              onChange={(e) => handleChange('payment_amount', e.target.value)}
              placeholder="30"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-slate-ocean focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-ocean/10"
            />
            <p className="mt-1 text-[11px] text-gray-400">প্রতি কল নম্বরের জন্য চার্জ</p>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM SAVE BAR ─── */}
      <div className="flex items-center justify-between rounded-2xl bg-gray-100 p-4">
        <p className="text-xs text-gray-500 font-medium">
          সকল পরিবর্তন সম্পন্ন হলে সংরক্ষণ বাটনে ক্লিক করুন
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={isPending || uploadingLogo || uploadingFavicon}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-ocean px-6 py-2.5 text-sm font-extrabold text-white shadow-md transition hover:bg-slate-ocean/90 disabled:opacity-60 cursor-pointer"
        >
          {saved ? (
            <><CheckCircle2 className="h-4 w-4 text-cloud-mint" /> সংরক্ষিত হয়েছে!</>
          ) : isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin text-cloud-mint" /> সংরক্ষণ হচ্ছে...</>
          ) : (
            <><Save className="h-4 w-4 text-cloud-mint" /> পরিবর্তন সংরক্ষণ করুন</>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
