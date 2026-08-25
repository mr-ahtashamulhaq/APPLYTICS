-- APPLYTICS — Rich candidate profile sections
-- Adds optional structured-by-section text fields without changing existing profile data.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS headline TEXT,
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS pronouns TEXT,
  ADD COLUMN IF NOT EXISTS desired_roles TEXT[],
  ADD COLUMN IF NOT EXISTS availability TEXT,
  ADD COLUMN IF NOT EXISTS work_authorization TEXT,
  ADD COLUMN IF NOT EXISTS certifications_text TEXT,
  ADD COLUMN IF NOT EXISTS publications_text TEXT,
  ADD COLUMN IF NOT EXISTS test_scores_text TEXT,
  ADD COLUMN IF NOT EXISTS volunteer_text TEXT,
  ADD COLUMN IF NOT EXISTS awards_text TEXT,
  ADD COLUMN IF NOT EXISTS languages_text TEXT,
  ADD COLUMN IF NOT EXISTS interests_text TEXT;

COMMENT ON COLUMN public.profiles.headline IS 'Short professional headline shown on the candidate profile';
COMMENT ON COLUMN public.profiles.summary IS 'Candidate-authored professional summary';
COMMENT ON COLUMN public.profiles.desired_roles IS 'Roles the candidate wants to target';
COMMENT ON COLUMN public.profiles.certifications_text IS 'Certifications and credentials, one per line or block';
COMMENT ON COLUMN public.profiles.publications_text IS 'Publications, talks, research, or writing';
COMMENT ON COLUMN public.profiles.test_scores_text IS 'Language, admissions, technical, or other test scores';
COMMENT ON COLUMN public.profiles.volunteer_text IS 'Volunteer, community, or leadership experience';
COMMENT ON COLUMN public.profiles.awards_text IS 'Awards, honors, scholarships, or achievements';
COMMENT ON COLUMN public.profiles.languages_text IS 'Languages and proficiency levels';
COMMENT ON COLUMN public.profiles.interests_text IS 'Professional interests and relevant activities';
