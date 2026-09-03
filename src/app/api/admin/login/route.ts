import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_SESSION_COOKIE = 'admin_session'
const SESSION_VALUE        = 'admin_authenticated'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { email, password } = body as { email?: string; password?: string }

  const adminEmail    = process.env.ADMIN_EMAIL    ?? ''
  const adminPassword = process.env.ADMIN_PASSWORD ?? ''

  if (
    !email ||
    !password ||
    email.trim().toLowerCase() !== adminEmail.toLowerCase() ||
    password !== adminPassword
  ) {
    // Small delay to slow down brute-force
    await new Promise((r) => setTimeout(r, 800))
    return NextResponse.json({ error: 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  })

  return NextResponse.json({ ok: true })
}
