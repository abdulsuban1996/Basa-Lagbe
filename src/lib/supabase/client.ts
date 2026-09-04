import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://zpcdlgtocpxkqizaeamn.supabase.co'
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwY2RsZ3RvY3B4a3FpemFlYW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNDY2NjEsImV4cCI6MjEwMzkyMjY2MX0.urUt6swJ725kVfz7dupxIuJYvEG2j3uAGt-7wM0Syes'

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
