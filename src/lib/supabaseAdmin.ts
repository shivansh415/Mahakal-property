import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ── Server-Side Supabase Admin Client ────────────────────────
// Uses the SERVICE ROLE KEY — bypasses Row Level Security
// ONLY use in API routes and server components

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const isConfigured = supabaseUrl.startsWith('http') && supabaseServiceKey.length > 10

export const supabaseAdmin: SupabaseClient = isConfigured
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : (new Proxy({} as SupabaseClient, {
      get: () => () => ({
        insert: () => ({ data: null, error: new Error('Supabase not configured') }),
      }),
    }) as SupabaseClient)
