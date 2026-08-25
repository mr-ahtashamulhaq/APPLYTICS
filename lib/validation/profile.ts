import { z } from 'zod'

const optionalText = (max: number) => z.string().trim().max(max).optional().default('')
const optionalUrl = z.union([
  z.string().trim().url('Enter a valid URL.').max(500),
  z.literal(''),
]).optional().default('')
const stringList = (itemMax: number, maxItems: number) => z.array(z.string().trim().min(1).max(itemMax)).max(maxItems).optional().default([])

export const profileFormSchema = z.object({
  full_name: z.string().trim().min(2).max(160),
  headline: optionalText(160),
  summary: optionalText(3000),
  pronouns: optionalText(80),
  phone: optionalText(80),
  city: optionalText(120),
  linkedin_url: optionalUrl,
  portfolio_url: optionalUrl,
  university: optionalText(200),
  degree: optionalText(200),
  graduation_status: optionalText(80),
  availability: optionalText(100),
  work_authorization: optionalText(160),
  desired_roles: stringList(100, 20),
  skills: stringList(80, 40),
  experience_text: optionalText(12000),
  projects_text: optionalText(12000),
  certifications_text: optionalText(8000),
  publications_text: optionalText(8000),
  test_scores_text: optionalText(4000),
  volunteer_text: optionalText(8000),
  awards_text: optionalText(6000),
  languages_text: optionalText(3000),
  interests_text: optionalText(3000),
}).strict()

export type ProfileFormInput = z.infer<typeof profileFormSchema>
