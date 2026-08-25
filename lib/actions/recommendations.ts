'use server'

import { auth } from '@clerk/nextjs/server'
import { loadJobs } from '@/lib/actions/jobs'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Job } from '@/lib/types/database'
import { recordUsageEvent } from '@/lib/telemetry/usageEvents'

export interface JobRecommendation {
  job: Job
  score: number
  matchedSkills: string[]
  reasons: string[]
}

export interface RecommendationResult {
  recommendations: JobRecommendation[]
  profileMissing: boolean
  catalogCount: number
  error?: string
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+#.]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function skillMatches(skill: string, jobText: string) {
  const normalizedSkill = normalize(skill)
  return normalizedSkill.length > 1 && jobText.includes(normalizedSkill)
}

export async function loadRecommendations(): Promise<RecommendationResult> {
  const { userId } = await auth()
  if (!userId) return { recommendations: [], profileMissing: false, catalogCount: 0, error: 'Not authenticated.' }

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('clerk_user_id', userId)
    .maybeSingle()

  if (!user) return { recommendations: [], profileMissing: true, catalogCount: 0, error: 'Complete your profile to see recommendations.' }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('city, skills, desired_roles, headline, summary, experience_text, projects_text')
    .eq('user_id', user.id)
    .maybeSingle()

  const profileSkills = Array.isArray(profile?.skills) ? profile.skills.filter((value): value is string => typeof value === 'string' && value.trim().length > 0) : []
  const desiredRoles = Array.isArray(profile?.desired_roles) ? profile.desired_roles.filter((value): value is string => typeof value === 'string' && value.trim().length > 0) : []
  const profileCity = typeof profile?.city === 'string' ? profile.city.trim() : ''
  const profileEvidence = [
    profile?.headline,
    profile?.summary,
    profile?.experience_text,
    profile?.projects_text,
    ...profileSkills,
    ...desiredRoles,
  ].filter((value): value is string => typeof value === 'string' && value.trim().length > 0).join(' ')
  const profileMissing = profileSkills.length === 0 && desiredRoles.length === 0 && profileCity.length === 0 && profileEvidence.length === 0

  const catalog = await loadJobs({ page: 1, page_size: 50 })
  if (catalog.error) return { recommendations: [], profileMissing, catalogCount: 0, error: catalog.error }

  const recommendations = catalog.jobs
    .map((job): JobRecommendation => {
      const jobText = normalize([
        job.title,
        job.description ?? '',
        job.experience_required ?? '',
        job.education_required ?? '',
        ...job.skills_required,
      ].join(' '))
      const matchedSkills = profileSkills.filter((skill) => skillMatches(skill, jobText)).slice(0, 5)
      const matchedRoles = desiredRoles.filter((role) => skillMatches(role, jobText)).slice(0, 3)
      const locationMatches = profileCity.length > 0 && normalize(job.location).includes(normalize(profileCity))
      const remoteMatch = profileCity.length > 0 && normalize(job.location).includes('remote')
      const score = Math.min(100, matchedSkills.length * 20 + matchedRoles.length * 15 + (locationMatches ? 20 : 0) + (remoteMatch ? 10 : 0))
      const reasons: string[] = []
      if (matchedSkills.length > 0) reasons.push(`Matches ${matchedSkills.join(', ')}`)
      if (matchedRoles.length > 0) reasons.push(`Fits target role ${matchedRoles.join(', ')}`)
      if (locationMatches) reasons.push(`Location includes ${profileCity}`)
      if (remoteMatch && !locationMatches) reasons.push('Remote listing')
      if (reasons.length === 0) reasons.push('Catalog listing to review; add more profile signals to improve its ranking')
      return { job, score, matchedSkills, reasons }
    })
    .sort((a, b) => b.score - a.score || b.job.last_seen_at.localeCompare(a.job.last_seen_at))
    .slice(0, 20)

  await recordUsageEvent(user.id, 'recommendations_viewed', {
    recommendation_count: recommendations.length,
  })

  return { recommendations, profileMissing, catalogCount: catalog.total }
}
