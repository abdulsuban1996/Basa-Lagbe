import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMyListings, getLandlordStats, getMyListingWithApplications } from '@/lib/actions/landlord'
import { LandlordDashboardClient } from '@/components/LandlordDashboardClient'

export default async function LandlordDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: landlord } = await supabase
    .from('landlords')
    .select('id, name')
    .eq('user_id', user.id)
    .single()

  if (!landlord) redirect('/landlord/register')

  const [listings, stats] = await Promise.all([
    getMyListings(),
    getLandlordStats(),
  ])

  const listingsWithApps = await Promise.all(
    listings.map((l) => getMyListingWithApplications(l.id))
  )

  return (
    <LandlordDashboardClient
      landlordName={landlord.name}
      stats={stats}
      listingsWithApps={listingsWithApps}
    />
  )
}
