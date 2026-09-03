import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMyApplications, getMyBookmarks, getMyDirectCalls } from '@/lib/actions/renter'
import { RenterDashboardClient } from '@/components/RenterDashboardClient'

export default async function RenterDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: renter } = await supabase
    .from('renters')
    .select('name')
    .eq('user_id', user.id)
    .single()

  if (!renter) redirect('/renter/register')

  const [applications, bookmarks, directCalls] = await Promise.all([
    getMyApplications(),
    getMyBookmarks(),
    getMyDirectCalls(),
  ])

  return (
    <RenterDashboardClient
      renterName={renter.name}
      applications={applications}
      bookmarks={bookmarks}
      directCalls={directCalls}
    />
  )
}
