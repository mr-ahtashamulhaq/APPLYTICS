'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { ensureUser } from '@/lib/auth/ensureUser'
import { profileFormSchema } from '@/lib/validation/profile'

export interface ProfileFormData {
  full_name: string
  headline: string
  summary: string
  pronouns: string
  phone: string
  city: string
  linkedin_url: string
  portfolio_url: string
  university: string
  degree: string
  graduation_status: string
  availability: string
  work_authorization: string
  desired_roles: string[]
  skills: string[]
  experience_text: string
  projects_text: string
  certifications_text: string
  publications_text: string
  test_scores_text: string
  volunteer_text: string
  awards_text: string
  languages_text: string
  interests_text: string
}

export async function loadProfile(): Promise<ProfileFormData | null> {
  const { userId } = await auth()
  if (!userId) return null

  let clerkUser = null
  try {
    clerkUser = await currentUser()
  } catch {
    return null
  }

  await ensureUser(
    userId,
    clerkUser?.emailAddresses[0]?.emailAddress,
    clerkUser?.fullName
  )

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id, name, email')
    .eq('clerk_user_id', userId)
    .single()

  if (!user) return null

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  return {
    full_name: user.name ?? clerkUser?.fullName ?? '',
    headline: profile?.headline ?? '',
    summary: profile?.summary ?? '',
    pronouns: profile?.pronouns ?? '',
    phone: profile?.phone ?? '',
    city: profile?.city ?? '',
    linkedin_url: profile?.linkedin_url ?? '',
    portfolio_url: profile?.portfolio_url ?? '',
    university: profile?.university ?? '',
    degree: profile?.degree ?? '',
    graduation_status: profile?.graduation_status ?? '',
    availability: profile?.availability ?? '',
    work_authorization: profile?.work_authorization ?? '',
    desired_roles: profile?.desired_roles ?? [],
    skills: profile?.skills ?? [],
    experience_text: profile?.experience_text ?? '',
    projects_text: profile?.projects_text ?? '',
    certifications_text: profile?.certifications_text ?? '',
    publications_text: profile?.publications_text ?? '',
    test_scores_text: profile?.test_scores_text ?? '',
    volunteer_text: profile?.volunteer_text ?? '',
    awards_text: profile?.awards_text ?? '',
    languages_text: profile?.languages_text ?? '',
    interests_text: profile?.interests_text ?? '',
  }
}

export async function saveProfile(data: ProfileFormData): Promise<{ success: boolean; error?: string }> {
  const parsed = profileFormSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: 'Please check the profile fields.' }
  const input = parsed.data

  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Not authenticated' }

  try {
    const clerkUser = await currentUser()
    await ensureUser(
      userId,
      clerkUser?.emailAddresses[0]?.emailAddress,
      clerkUser?.fullName
    )

    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (userError || !user) return { success: false, error: 'User not found' }

    await supabaseAdmin
      .from('users')
      .update({ name: input.full_name, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    const profilePayload = {
      user_id: user.id,
      headline: input.headline || null,
      summary: input.summary || null,
      pronouns: input.pronouns || null,
      phone: input.phone || null,
      city: input.city || null,
      linkedin_url: input.linkedin_url || null,
      portfolio_url: input.portfolio_url || null,
      university: input.university || null,
      degree: input.degree || null,
      graduation_status: input.graduation_status || null,
      availability: input.availability || null,
      work_authorization: input.work_authorization || null,
      desired_roles: input.desired_roles.length > 0 ? input.desired_roles : null,
      skills: input.skills.length > 0 ? input.skills : null,
      experience_text: input.experience_text || null,
      projects_text: input.projects_text || null,
      certifications_text: input.certifications_text || null,
      publications_text: input.publications_text || null,
      test_scores_text: input.test_scores_text || null,
      volunteer_text: input.volunteer_text || null,
      awards_text: input.awards_text || null,
      languages_text: input.languages_text || null,
      interests_text: input.interests_text || null,
      updated_at: new Date().toISOString(),
    }

    const profileError = existing
      ? (await supabaseAdmin.from('profiles').update(profilePayload).eq('user_id', user.id)).error
      : (await supabaseAdmin.from('profiles').insert({ ...profilePayload, created_at: new Date().toISOString() })).error

    if (profileError) {
      console.error('[saveProfile] profile persistence failed')
      return { success: false, error: 'Could not save your profile.' }
    }

    revalidatePath('/app/profile')
    revalidatePath('/app/dashboard')
    revalidatePath('/app/recommendations')
    return { success: true }
  } catch (err) {
    console.error('[saveProfile] unexpected error:', err)
    return { success: false, error: 'Something went wrong' }
  }
}
