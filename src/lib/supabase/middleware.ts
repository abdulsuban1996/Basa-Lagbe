import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://zpcdlgtocpxkqizaeamn.supabase.co'
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwY2RsZ3RvY3B4a3FpemFlYW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNDY2NjEsImV4cCI6MjEwMzkyMjY2MX0.urUt6swJ725kVfz7dupxIuJYvEG2j3uAGt-7wM0Syes'

export async function updateSession(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protect landlord and renter routes
    const protectedPaths = [
      '/landlord/dashboard',
      '/landlord/listings',
      '/renter/dashboard',
    ]

    const isProtected = protectedPaths.some((p) =>
      request.nextUrl.pathname.startsWith(p)
    )

    if (isProtected && !user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (err) {
    console.error('Middleware updateSession error:', err)
    return NextResponse.next({ request })
  }
}

