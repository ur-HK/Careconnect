-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('customer', 'caretaker');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create caretaker_profiles table
CREATE TABLE public.caretaker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.user_roles(user_id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  certifications TEXT[],
  specializations TEXT[],
  hourly_rate DECIMAL(10,2) NOT NULL,
  daily_rate DECIMAL(10,2),
  availability TEXT DEFAULT 'available',
  phone TEXT,
  address TEXT,
  profile_image_url TEXT,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_completed_jobs INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.caretaker_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view caretaker profiles"
  ON public.caretaker_profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Caretakers can update their own profile"
  ON public.caretaker_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Caretakers can insert their own profile"
  ON public.caretaker_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  caretaker_id UUID NOT NULL REFERENCES public.caretaker_profiles(user_id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  booking_type TEXT NOT NULL CHECK (booking_type IN ('hourly', 'daily')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  hours INTEGER,
  total_amount DECIMAL(10,2),
  special_requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view their own bookings"
  ON public.bookings
  FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Caretakers can view bookings for them"
  ON public.bookings
  FOR SELECT
  USING (auth.uid() = caretaker_id);

CREATE POLICY "Customers can create bookings"
  ON public.bookings
  FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Caretakers can update bookings for them"
  ON public.bookings
  FOR UPDATE
  USING (auth.uid() = caretaker_id);

CREATE POLICY "Customers can update their bookings"
  ON public.bookings
  FOR UPDATE
  USING (auth.uid() = customer_id);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL,
  caretaker_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON public.reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Customers can create reviews for their bookings"
  ON public.reviews
  FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- Create function to update caretaker rating
CREATE OR REPLACE FUNCTION public.update_caretaker_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.caretaker_profiles
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.reviews
      WHERE caretaker_id = NEW.caretaker_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE caretaker_id = NEW.caretaker_id
    )
  WHERE user_id = NEW.caretaker_id;
  RETURN NEW;
END;
$$;

-- Create trigger to update rating on new review
CREATE TRIGGER update_rating_on_review
AFTER INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_caretaker_rating();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_caretaker_profiles_updated_at
BEFORE UPDATE ON public.caretaker_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for bookings (for notifications)
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;