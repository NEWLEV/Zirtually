-- 1. Upgrade Goals Table with new tracking fields
ALTER TABLE public.goals 
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Professional',
ADD COLUMN IF NOT EXISTS estimated_time INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_team_goal BOOLEAN DEFAULT false;

-- 2. Upgrade Performance Reviews Table with assessment storage
ALTER TABLE public.performance_reviews
ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS self_assessment JSONB,
ADD COLUMN IF NOT EXISTS manager_assessment JSONB;

-- 3. Add index for JSONB fields to allow faster reporting queries later
CREATE INDEX IF NOT EXISTS idx_reviews_self_assessment ON public.performance_reviews USING gin (self_assessment);
