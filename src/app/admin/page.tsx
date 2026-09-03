import { createAdminClient } from '@/lib/supabase/admin'
import { getAdminStats, getAdminListings, getAdminUsers } from '@/lib/actions/admin'
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient'
import { requireAdmin } from '@/lib/adminGuard'
import { getSiteSettings } from '@/lib/actions/settings'

export default async function AdminPage() {
  // 🔒 Cookie-based admin guard — redirects to /admin/login if not authenticated
  await requireAdmin()

  const adminEmail = process.env.ADMIN_EMAIL ?? 'Admin'

  const adminClient = createAdminClient()

  const [stats, listings, users, reportsRes, callRequestsRes, siteSettings] = await Promise.all([
    getAdminStats(),
    getAdminListings(),
    getAdminUsers(),
    adminClient
      .from('reports')
      .select(`
        id, reason, status, created_at,
        listings ( id, title )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false }),
    adminClient
      .from('direct_call_requests')
      .select(`
        id, payment_method, payment_number, payment_transaction_id, amount, created_at,
        renters ( name, phone ),
        listings ( id, title, landlords ( name, phone ) )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false }),
    getSiteSettings(),
  ])

  const pendingReports = reportsRes.data ?? []
  const pendingCallRequests = callRequestsRes.data ?? []

  return (
    <AdminDashboardClient
      adminEmail={adminEmail}
      stats={stats}
      initialReports={pendingReports}
      initialCallRequests={pendingCallRequests}
      initialListings={listings}
      initialUsers={users}
      initialSettings={siteSettings}
    />
  )
}
