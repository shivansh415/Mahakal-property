import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ── Browser Supabase Client ──────────────────────────────────
// Uses the ANON KEY — safe for client-side use

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = supabaseUrl.startsWith('http') && supabaseAnonKey.length > 10

if (!isSupabaseConfigured) {
  console.error(
    "🚨 SUPABASE NOT CONFIGURED: 'NEXT_PUBLIC_SUPABASE_URL' and 'NEXT_PUBLIC_SUPABASE_ANON_KEY' must be set in .env.local"
  )
}

// Will throw an error if keys are missing/invalid
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// ── TypeScript Types for Supabase Tables ─────────────────────

export interface Property {
  id: string
  title: string
  location: string
  price: string
  price_type: 'sale' | 'rent' | 'lease'
  category: 'residential' | 'commercial' | 'plot'
  beds: number | null
  baths: number | null
  area: string | null
  description: string | null
  image_url: string | null
  is_featured: boolean
  is_active: boolean
  whatsapp_message: string | null
  created_at: string
}

export interface Reel {
  id: string
  title: string | null
  instagram_url: string
  embed_url: string | null
  thumbnail_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

export interface Enquiry {
  id: string
  name: string | null
  phone: string | null
  property_id: string | null
  property_title: string | null
  message: string | null
  created_at: string
}

export interface Agreement {
  id: string
  landlord_name: string | null
  tenant_name: string | null
  property_address: string | null
  rent_amount: string | null
  agreement_text: string | null
  generated_at: string
}
