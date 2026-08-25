import { z } from 'zod'

const boundedText = (max: number) => z.string().trim().min(1).max(max)
const boundedList = (maxItems: number, itemMax: number) => z.array(boundedText(itemMax)).max(maxItems)

export const aiResultSchema = z.object({
  summary: boundedText(3000),
  skills_to_emphasize: boundedList(30, 80),
  rewritten_experience: z.array(z.object({
    role: boundedText(160),
    company: boundedText(160),
    duration: z.string().trim().min(1).max(120).optional(),
    bullets: z.array(boundedText(600)).min(1).max(8),
  }).strict()).max(20),
  rewritten_projects: z.array(z.object({
    title: boundedText(200),
    bullets: z.array(boundedText(600)).min(1).max(8),
  }).strict()).max(20),
  suggested_keywords: boundedList(30, 80),
  missing_keywords: boundedList(30, 80),
  match_score: z.number().int().min(0).max(100),
  section_order_recommendation: boundedList(10, 80).min(1),
}).strict()

export type AIResult = z.infer<typeof aiResultSchema>

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+#.]+/g, ' ').replace(/\s+/g, ' ').trim()
}

function numbersIn(value: string) {
  return value.match(/\d+(?:\.\d+)?/g) ?? []
}

function singularToken(token: string) {
  return token.length > 3 && token.endsWith('s') ? token.slice(0, -1) : token
}

/**
 * Check whether a short generated term is supported by the supplied evidence.
 * This accepts harmless variants such as "REST API" / "REST APIs" while
 * requiring every meaningful word to exist in the evidence.
 */
export function termSupportedByEvidence(term: string, profileEvidence: string) {
  const normalizedTerm = normalize(term)
  const normalizedEvidence = normalize(profileEvidence)
  if (!normalizedTerm || !normalizedEvidence) return false
  if (normalizedEvidence.includes(normalizedTerm)) return true

  const evidenceTokens = new Set(normalizedEvidence.split(' ').map(singularToken))
  return normalizedTerm.split(' ').every((token) => evidenceTokens.has(singularToken(token)))
}

export function filterSupportedSkills(result: AIResult, profileEvidence: string): AIResult {
  return {
    ...result,
    skills_to_emphasize: result.skills_to_emphasize.filter((skill) => termSupportedByEvidence(skill, profileEvidence)),
  }
}

export function validateResumeEvidence(result: AIResult, profileEvidence: string): string | null {
  const evidence = normalize(profileEvidence)
  const supportedNumbers = new Set(numbersIn(profileEvidence))

  const unsupportedSkill = result.skills_to_emphasize.find((skill) => !termSupportedByEvidence(skill, evidence))
  if (unsupportedSkill) return `Unsupported skill: ${unsupportedSkill}`

  const unsupportedExperience = result.rewritten_experience.find((entry) => (
    !evidence.includes(normalize(entry.role)) || !evidence.includes(normalize(entry.company))
  ))
  if (unsupportedExperience) return `Unsupported experience entry: ${unsupportedExperience.role}`

  const unsupportedProject = result.rewritten_projects.find((entry) => !evidence.includes(normalize(entry.title)))
  if (unsupportedProject) return `Unsupported project entry: ${unsupportedProject.title}`

  const generatedText = [
    result.summary,
    ...result.rewritten_experience.flatMap((entry) => [entry.role, entry.company, entry.duration ?? '', ...entry.bullets]),
    ...result.rewritten_projects.flatMap((entry) => [entry.title, ...entry.bullets]),
  ].join(' ')
  const unsupportedNumber = numbersIn(generatedText).find((number) => !supportedNumbers.has(number))
  if (unsupportedNumber) return `Unsupported number: ${unsupportedNumber}`

  return null
}
