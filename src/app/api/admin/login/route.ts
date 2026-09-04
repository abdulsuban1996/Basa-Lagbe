import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_SESSION_COOKIE = 'admin_session'
const SESSION_VALUE        = 'admin_authenticated'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { email, password } = body as { email?: string; password?: string }

  const adminEmail = (process.env.ADMIN_EMAIL || 'hello.saddamhosen@gmail.com').trim().toLowerCase()
  const adminPassword = (process.env.ADMIN_PASSWORD || '12345678').trim()

  const inputEmail = (email ?? '').trim().toLowerCase()
  const inputPassword = (password ?? '').trim()

  if (
    !inputEmail ||
    !inputPassword ||
    inputEmail !== adminEmail ||
    inputPassword !== adminPassword
  ) {
    // Small delay to slow down brute-force
    await new Promise((r) => setTimeout(r, 600))
    return NextResponse.json({ error: 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return NextResponse.json({ ok: true })
}
