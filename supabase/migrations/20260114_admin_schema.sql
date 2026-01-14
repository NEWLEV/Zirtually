-- Create Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  manager_id UUID REFERENCES public.profiles(id),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Positions (Job Titles) Table
CREATE TABLE IF NOT EXISTS public.positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  level TEXT, -- e.g., 'Junior', 'Senior', 'Lead', 'Executive'
  salary_range_min INTEGER,
  salary_range_max INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update Profiles to link to these new tables
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS position_id UUID REFERENCES public.positions(id),
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave', 'terminated'));

-- RLS Policies for Admin Access
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;

-- Admins manage, everyone views
CREATE POLICY "Admins can manage departments" ON public.departments USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);
CREATE POLICY "Everyone can view departments" ON public.departments FOR SELECT USING (true);

CREATE POLICY "Admins can manage positions" ON public.positions USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);
CREATE POLICY "Everyone can view positions" ON public.positions FOR SELECT USING (true);
