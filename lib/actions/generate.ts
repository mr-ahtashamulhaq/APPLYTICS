'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { ensureUser } from '@/lib/auth/ensureUser'
import { groq } from '@/lib/groq/client'

// ── Types ───────────────────────────────────────────────────────

export interface GenerateInput {
  job_title: string
  company_name: string
  job_description: string
  required_skills?: string
}

export interface AIResult {
  summary: string
  skills_to_emphasize: string[]
  rewritten_experience: {
    role: string
    company: string
    duration?: string
    bullets: string[]
  }[]
  rewritten_projects: {
    title: string
    bullets: string[]
  }[]
  suggested_keywords: string[]
  missing_keywords: string[]
  match_score: number
  section_order_recommendation: string[]
}

export interface GenerateResult {
  success: boolean
  resumeId?: string
  error?: string
}

// ── System prompt ───────────────────────────────────────────────

function buildPrompt(profile: Record<string, unknown>, input: GenerateInput): string {
  return `You are an expert resume writer and ATS specialist. Your task is to tailor a candidate's profile to a specific job description.

STRICT RULES - NEVER VIOLATE:
- Do NOT invent any numbers, metrics, or percentages that are not in the original profile
- Do NOT invent companies, employers, or clients
- Do NOT invent tools, technologies, or programming languages
- Do NOT invent results, achievements, or outcomes
- You MAY rewrite weak bullets into stronger, more impactful language
- You MAY reorder information for better relevance
- You MAY suggest keywords that are missing but realistic for the candidate to add
- Respond ONLY with valid JSON matching the schema exactly

CANDIDATE PROFILE:
Name: ${profile.full_name ?? 'Not provided'}
City: ${profile.city ?? 'Not provided'}
Education: ${profile.degree ?? ''} at ${profile.university ?? ''} (${profile.graduation_status ?? ''})
Skills: ${(profile.skills as string[] ?? []).join(', ') || 'Not provided'}

Work Experience:
${profile.experience_text ?? 'Not provided'}

Projects:
${profile.projects_text ?? 'Not provided'}

JOB DETAILS:
Title: ${input.job_title}
Company: ${input.company_name}
Required Skills: ${input.required_skills ?? 'Not specified'}

Job Description:
${input.job_description}

Return a JSON object with this exact structure:
{
  "summary": "2-3 sentence professional summary tailored to this role",
  "skills_to_emphasize": ["skill1", "skill2", ...],
  "rewritten_experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "duration": "Month Year – Month Year",
      "bullets": ["Strong action verb bullet 1", "Bullet 2"]
    }
  ],
  "rewritten_projects": [
    {
      "title": "Project Name",
      "bullets": ["XYZ formula bullet: did X using Y achieving Z"]
    }
  ],
  "suggested_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword from JD not in profile"],
  "match_score": 75,
  "section_order_recommendation": ["Summary", "Skills", "Experience", "Projects", "Education"]
}`
}

// ── Main action ─────────────────────────────────────────────────

export async function generateResume(input: GenerateInput): Promise<GenerateResult> {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Not authenticated' }

  const clerkUser = await currentUser()

  // Ensure user exists in Supabase
  await ensureUser(
    userId,
    clerkUser?.emailAddresses[0]?.emailAddress,
    clerkUser?.fullName
  )

  try {
    // 1. Get Supabase user
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single()

    if (!user) return { success: false, error: 'User not found. Try signing out and back in.' }

    // 2. Get user profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!profile) {
      return {
        success: false,
        error: 'Please complete your profile before generating a resume.',
      }
    }

    // 3. Validate profile has enough data
    if (!profile.experience_text && !profile.projects_text) {
      return {
        success: false,
        error: 'Add your work experience or projects to your profile first.',
      }
    }

    // 4. Build prompt
    const userMessage = buildPrompt(
      {
        full_name: (await supabaseAdmin.from('users').select('name').eq('id', user.id).single()).data?.name,
        city: profile.city,
        degree: profile.degree,
        university: profile.university,
        graduation_status: profile.graduation_status,
        skills: profile.skills ?? [],
        experience_text: profile.experience_text,
        projects_text: profile.projects_text,
      },
      input
    )

    // 5. Call Groq
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert ATS resume writer. Always respond with valid JSON only. No markdown, no code blocks, just raw JSON.',
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: 3000,
    })

    const rawJson = completion.choices[0]?.message?.content
    if (!rawJson) return { success: false, error: 'AI returned empty response. Please try again.' }

    // 6. Parse + validate AI result
    let aiResult: AIResult
    try {
      aiResult = JSON.parse(rawJson)
    } catch {
      console.error('[generateResume] JSON parse error:', rawJson.slice(0, 200))
      return { success: false, error: 'AI returned invalid format. Please try again.' }
    }

    // Validate required fields
    if (
      typeof aiResult.match_score !== 'number' ||
      !Array.isArray(aiResult.suggested_keywords) ||
      !Array.isArray(aiResult.missing_keywords)
    ) {
      return { success: false, error: 'AI response incomplete. Please try again.' }
    }

    // 7. Save job_inputs record
    const { data: jobInput, error: jobError } = await supabaseAdmin
      .from('job_inputs')
      .insert({
        user_id: user.id,
        job_title: input.job_title,
        company_name: input.company_name,
        job_description: input.job_description,
        required_skills: input.required_skills ?? null,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (jobError || !jobInput) {
      console.error('[generateResume] job_inputs error:', jobError)
      return { success: false, error: 'Failed to save job input.' }
    }

    // 8. Save generated_resumes record with AI output
    const { data: resume, error: resumeError } = await supabaseAdmin
      .from('generated_resumes')
      .insert({
        user_id: user.id,
        job_input_id: jobInput.id,
        match_score: aiResult.match_score,
        missing_keywords: aiResult.missing_keywords,
        suggested_keywords: aiResult.suggested_keywords,
        ai_output: aiResult,          // full JSON stored for result page
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (resumeError || !resume) {
      console.error('[generateResume] generated_resumes error:', resumeError)
      return { success: false, error: 'Failed to save resume record.' }
    }

    return { success: true, resumeId: resume.id }
  } catch (err) {
    console.error('[generateResume] unexpected error:', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
