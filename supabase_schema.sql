-- SQL Schema for Great British Festival (Supabase/PostgreSQL)

-- ENUMs
CREATE TYPE ticket_tier AS ENUM ('General Admission', 'Weekend Pass', 'VIP Pass');
CREATE TYPE application_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');

-- 1. Artists Table
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  band_name TEXT NOT NULL,
  genre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  links JSONB, -- { spotify: string, youtube: string, instagram: string }
  desc_portfolio TEXT,
  status application_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Vendors Table
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  vendor_type TEXT NOT NULL, -- 'Food', 'Merch', 'Service'
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  product_desc TEXT,
  status application_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Mock Purchases Table
CREATE TABLE mock_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  ticket_tier ticket_tier NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_price DECIMAL(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'completed', -- 'completed', 'failed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Inquiries / Contact Table
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES (BASIC)
-- Enable RLS
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for registration/purchase)
CREATE POLICY "Public can apply as artist" ON artists FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can apply as vendor" ON vendors FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can purchase tickets" ON mock_purchases FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can send inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- Admin access (Simplified - assumes 'service_role' or specific admin auth)
-- In a real app, use: auth.jwt() -> role = 'admin'
