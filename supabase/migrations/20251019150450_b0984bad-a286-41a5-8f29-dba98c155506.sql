-- Add location and verification fields to caretaker_profiles
ALTER TABLE public.caretaker_profiles 
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS latitude NUMERIC,
ADD COLUMN IF NOT EXISTS longitude NUMERIC,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_documents JSONB,
ADD COLUMN IF NOT EXISTS languages_spoken TEXT[],
ADD COLUMN IF NOT EXISTS service_radius_km INTEGER DEFAULT 10;

-- Add notification tracking for bookings
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS notification_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS caretaker_notified_at TIMESTAMP WITH TIME ZONE;

-- Create index for location-based searches
CREATE INDEX IF NOT EXISTS idx_caretaker_location ON public.caretaker_profiles(city, state);

-- Create index for verified caretakers
CREATE INDEX IF NOT EXISTS idx_verified_caretakers ON public.caretaker_profiles(is_verified) WHERE is_verified = true;