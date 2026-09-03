import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditListingForm from './EditListingForm'
import type { Listing } from '@/types'

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: landlord } = await supabase
    .from('landlords')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!landlord) redirect('/landlord/register')

  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .eq('landlord_id', landlord.id)
    .single()

  if (!listing) notFound()

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-slate-ocean">লিস্টিং সম্পাদনা করুন</h1>
      <EditListingForm listing={listing as Listing} />
    </div>
  )
}
