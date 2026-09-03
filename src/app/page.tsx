import { getRecentListings } from '@/lib/actions/listings'
import { HomeClient } from '@/components/HomeClient'

export default async function HomePage() {
  const recentListings = await getRecentListings()
  return <HomeClient recentListings={recentListings} />
}
