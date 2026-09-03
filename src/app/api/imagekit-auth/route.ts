import { NextResponse } from 'next/server'
import { getImageKitAuthParams } from '@/lib/imagekit'

export async function GET() {
  try {
    const params = getImageKitAuthParams()
    return NextResponse.json(params)
  } catch {
    return NextResponse.json({ error: 'Auth params নেওয়া সম্ভব হয়নি।' }, { status: 500 })
  }
}
