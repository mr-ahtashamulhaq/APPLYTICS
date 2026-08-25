import { describe, expect, it } from 'vitest'
import { aiResultSchema, filterSupportedSkills, termSupportedByEvidence, validateResumeEvidence } from './resume'

const validResult = {
  summary: 'Frontend developer with React experience.',
  skills_to_emphasize: ['React'],
  rewritten_experience: [{
    role: 'Frontend Developer',
    company: 'Example Labs',
    duration: '2024 – 2025',
    bullets: ['Built React interfaces for internal users.'],
  }],
  rewritten_projects: [{
    title: 'Portfolio App',
    bullets: ['Created a portfolio app with React.'],
  }],
  suggested_keywords: ['TypeScript'],
  missing_keywords: ['Testing'],
  match_score: 72,
  section_order_recommendation: ['Summary', 'Skills', 'Experience'],
}

describe('resume validation', () => {
  it('accepts the complete resume contract', () => {
    expect(aiResultSchema.safeParse(validResult).success).toBe(true)
  })

  it('rejects unknown model keys', () => {
    expect(aiResultSchema.safeParse({ ...validResult, invented_field: 'no' }).success).toBe(false)
  })

  it('rejects evidence that is not in the profile', () => {
    const parsed = aiResultSchema.parse(validResult)
    expect(validateResumeEvidence(parsed, 'React. Frontend Developer at Example Labs. Portfolio App. 2024 2025.')).toBeNull()
    expect(validateResumeEvidence({ ...parsed, skills_to_emphasize: ['Go'] }, 'React.')).toContain('Unsupported skill')
  })

  it('accepts harmless plural variants but not invented multi-word skills', () => {
    expect(termSupportedByEvidence('REST API', 'REST APIs and Python')).toBe(true)
    expect(termSupportedByEvidence('REST API development', 'REST APIs and Python')).toBe(false)
  })

  it('filters unsupported emphasis skills without changing keyword suggestions', () => {
    const parsed = aiResultSchema.parse({ ...validResult, skills_to_emphasize: ['React', 'Go'] })
    const filtered = filterSupportedSkills(parsed, 'React. Frontend Developer at Example Labs. Portfolio App.')
    expect(filtered.skills_to_emphasize).toEqual(['React'])
    expect(filtered.suggested_keywords).toEqual(['TypeScript'])
  })
})
