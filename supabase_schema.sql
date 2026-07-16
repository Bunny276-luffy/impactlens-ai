-- Create User Roles Enum if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('Super Admin', 'NGO Admin', 'Volunteer', 'Donor');
  END IF;
END $$;

-- 1. Profiles Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'Volunteer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow users to update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 2. NGOs Table
CREATE TABLE IF NOT EXISTS public.ngos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo TEXT,
  mission TEXT,
  vision TEXT,
  registration_no TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  address TEXT,
  website TEXT,
  social_links TEXT[] DEFAULT '{}',
  operating_regions TEXT[] DEFAULT '{}',
  description TEXT,
  sdg_goals TEXT[] DEFAULT '{}',
  enabled_services TEXT[] DEFAULT '{"Education", "Nutrition"}',
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for ngos
ALTER TABLE public.ngos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read access to ngos"
  ON public.ngos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow NGO owners to update their NGO profile"
  ON public.ngos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow NGO owners to insert NGO profile"
  ON public.ngos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. Beneficiaries Table
CREATE TABLE IF NOT EXISTS public.beneficiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_id UUID REFERENCES public.ngos(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  school TEXT NOT NULL,
  guardian_name TEXT,
  guardian_phone TEXT,
  guardian_email TEXT,
  guardian_relationship TEXT,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for beneficiaries
ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access to beneficiaries"
  ON public.beneficiaries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow write access to beneficiaries"
  ON public.beneficiaries FOR ALL
  TO authenticated
  USING (true);

-- 4. Volunteers Table
CREATE TABLE IF NOT EXISTS public.volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  status TEXT NOT NULL DEFAULT 'Active',
  skills TEXT[] DEFAULT '{}',
  availability TEXT,
  contribution_hours NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for volunteers
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access to volunteers"
  ON public.volunteers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow volunteers to update their own record"
  ON public.volunteers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow volunteers to insert own record"
  ON public.volunteers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 5. Donors Table
CREATE TABLE IF NOT EXISTS public.donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  total_donated NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for donors
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access to donors"
  ON public.donors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow donors to update their own record"
  ON public.donors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow donors to insert own record"
  ON public.donors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 6. Programs Table
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'Active',
  target_beneficiaries INTEGER NOT NULL DEFAULT 0,
  budget NUMERIC NOT NULL DEFAULT 0,
  location TEXT,
  objectives TEXT,
  outcomes TEXT,
  ngo_id UUID REFERENCES public.ngos(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for programs
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access to programs"
  ON public.programs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow write access to programs"
  ON public.programs FOR ALL
  TO authenticated
  USING (true);

-- 7. Field Activities Table
CREATE TABLE IF NOT EXISTS public.field_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id UUID REFERENCES public.beneficiaries(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE NOT NULL,
  volunteer_id UUID REFERENCES public.volunteers(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  start_time TEXT,
  end_time TEXT,
  location TEXT,
  attendance_count INTEGER NOT NULL DEFAULT 0,
  photos TEXT[] DEFAULT '{}',
  gps_latitude NUMERIC,
  gps_longitude NUMERIC,
  documents TEXT[] DEFAULT '{}',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for field_activities
ALTER TABLE public.field_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access to field_activities"
  ON public.field_activities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow write access to field_activities"
  ON public.field_activities FOR ALL
  TO authenticated
  USING (true);

-- 8. Evidence Table
CREATE TABLE IF NOT EXISTS public.evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES public.field_activities(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verification_status TEXT NOT NULL DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for evidence
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access to evidence"
  ON public.evidence FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow write access to evidence"
  ON public.evidence FOR ALL
  TO authenticated
  USING (true);

-- 9. Donations Table
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  usage TEXT NOT NULL, -- 'Food', 'Education', 'Health', 'General'
  donor_id UUID REFERENCES public.donors(id) ON DELETE SET NULL,
  ngo_id UUID REFERENCES public.ngos(id) ON DELETE CASCADE NOT NULL,
  beneficiary_id UUID REFERENCES public.beneficiaries(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for donations
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access to donations"
  ON public.donations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow write access to donations"
  ON public.donations FOR ALL
  TO authenticated
  USING (true);

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'UNREAD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update/write their own notifications"
  ON public.notifications FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- 11. Analytics Table
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_id UUID REFERENCES public.ngos(id) ON DELETE CASCADE NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for analytics
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access to analytics"
  ON public.analytics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow write access to analytics"
  ON public.analytics FOR ALL
  TO authenticated
  USING (true);

-- 12. AI Reports Table
CREATE TABLE IF NOT EXISTS public.ai_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id UUID REFERENCES public.beneficiaries(id) ON DELETE CASCADE NOT NULL,
  risk_score NUMERIC NOT NULL,
  dropout_prediction TEXT NOT NULL,
  malnutrition_prediction TEXT NOT NULL,
  learning_difficulty_prediction TEXT NOT NULL,
  talent_identification TEXT,
  suggested_intervention TEXT NOT NULL,
  priority_ranking INTEGER NOT NULL,
  ai_summary TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS for ai_reports
ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access to ai_reports"
  ON public.ai_reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow write access to ai_reports"
  ON public.ai_reports FOR ALL
  TO authenticated
  USING (true);


-- 13. Trigger to Auto-create Profiles & Entity Tables on User Registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_name TEXT;
  v_role TEXT;
  v_role_enum public.user_role;
BEGIN
  -- Read name and role from raw user metadata
  v_name := COALESCE(new.raw_user_meta_data->>'name', 'New User');
  v_role := COALESCE(new.raw_user_meta_data->>'role', 'Volunteer');

  -- Map to user_role enum safely
  IF v_role = 'Super Admin' THEN
    v_role_enum := 'Super Admin'::public.user_role;
  ELSIF v_role = 'NGO Admin' THEN
    v_role_enum := 'NGO Admin'::public.user_role;
  ELSIF v_role = 'Donor' THEN
    v_role_enum := 'Donor'::public.user_role;
  ELSE
    v_role_enum := 'Volunteer'::public.user_role;
  END IF;

  -- Insert profile
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (new.id, new.email, v_name, v_role_enum);
  
  -- Create supporting entity record based on role
  IF v_role_enum = 'NGO Admin' THEN
    INSERT INTO public.ngos (name, contact_email, user_id)
    VALUES (v_name || ' NGO', new.email, new.id);
  ELSIF v_role_enum = 'Volunteer' THEN
    INSERT INTO public.volunteers (name, contact_email, user_id)
    VALUES (v_name, new.email, new.id);
  ELSIF v_role_enum = 'Donor' THEN
    INSERT INTO public.donors (name, user_id)
    VALUES (v_name, new.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
