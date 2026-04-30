-- ============================================================
-- MAHAKAL PROPERTY — Supabase Database Setup
-- ============================================================
-- INSTRUCTIONS:
-- 1. Go to supabase.com → Your Project → SQL Editor
-- 2. Paste this ENTIRE file
-- 3. Click "Run"
-- ============================================================

-- ── 1. Properties Table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price TEXT NOT NULL,
  price_type TEXT DEFAULT 'sale' CHECK (price_type IN ('sale', 'rent', 'lease')),
  category TEXT DEFAULT 'residential' CHECK (category IN ('residential', 'commercial', 'plot')),
  beds INT,
  baths INT,
  area TEXT,
  description TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  whatsapp_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 2. Reels Table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  instagram_url TEXT NOT NULL,
  embed_url TEXT,
  thumbnail_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 3. Enquiries Table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  phone TEXT,
  property_id UUID,
  property_title TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 4. Agreements Table ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS agreements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  landlord_name TEXT,
  tenant_name TEXT,
  property_address TEXT,
  rent_amount TEXT,
  agreement_text TEXT,
  generated_at TIMESTAMPTZ DEFAULT now()
);

-- ── 5. Row Level Security (RLS) Policies ─────────────────────
-- Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;

-- Properties: Everyone can READ active properties, authenticated/service role can CRUD
CREATE POLICY "Public can read active properties"
  ON properties FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role can do anything with properties"
  ON properties FOR ALL
  USING (true)
  WITH CHECK (true);

-- Reels: Everyone can READ active reels
CREATE POLICY "Public can read active reels"
  ON reels FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role can do anything with reels"
  ON reels FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enquiries: Public can INSERT, only service role can READ
CREATE POLICY "Public can submit enquiries"
  ON enquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can read enquiries"
  ON enquiries FOR SELECT
  USING (true);

-- Agreements: Only service role can access
CREATE POLICY "Service role can do anything with agreements"
  ON agreements FOR ALL
  USING (true)
  WITH CHECK (true);

-- ── 6. Seed Default Properties ───────────────────────────────
INSERT INTO properties (title, location, price, price_type, category, beds, baths, area, description, image_url, is_featured, is_active)
VALUES
  ('Emerald Heights Penthouse', 'Vijay Nagar, Indore', '₹2.8 Cr', 'sale', 'residential', 4, 3, '3200 sq ft', 'Luxury penthouse with panoramic city views.', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', true, true),
  ('Sapphire Garden Villa', 'Scheme 54, Indore', '₹1.6 Cr', 'sale', 'residential', 3, 2, '2100 sq ft', 'Independent villa with private garden.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', true, true),
  ('Golden Square Office', 'Palasia Square, Indore', '₹85,000/mo', 'rent', 'commercial', NULL, 2, '1800 sq ft', 'Premium commercial office space.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', false, true),
  ('Riverside Residency', 'Super Corridor, Indore', '₹72 Lakh', 'sale', 'residential', 2, 2, '1050 sq ft', 'Modern 2BHK with riverside view.', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', true, true),
  ('Crown Plaza Apartment', 'Bicholi Mardana, Indore', '₹18,000/mo', 'rent', 'residential', 3, 2, '1400 sq ft', 'Fully furnished 3BHK, ready to move.', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', false, true),
  ('The Pinnacle Tower', 'AB Road, Indore', '₹4.2 Cr', 'sale', 'residential', 5, 4, '5500 sq ft', 'Ultra luxury duplex with private terrace.', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', true, true);

-- ── 7. Seed Default Reels ────────────────────────────────────
INSERT INTO reels (title, instagram_url, thumbnail_url, display_order, is_active)
VALUES
  ('Luxury Penthouse Tour', 'https://www.instagram.com/reel/example1/', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80', 1, true),
  ('Villa Walkthrough', 'https://www.instagram.com/reel/example2/', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80', 2, true),
  ('Modern Office Space', 'https://www.instagram.com/reel/example3/', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', 3, true),
  ('Riverside Apartment', 'https://www.instagram.com/reel/example4/', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80', 4, true);

-- ✅ DONE! Your database is ready.
-- Now update your .env.local with real Supabase keys and restart the dev server.
