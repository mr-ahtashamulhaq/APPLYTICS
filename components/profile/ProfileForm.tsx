'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase,
  BookOpen,
  Certificate,
  CheckCircle,
  FloppyDisk,
  GraduationCap,
  Heart,
  LinkSimple,
  MapPin,
  Sparkle,
  Translate,
  Trophy,
  UserCircle,
  WarningCircle,
} from '@phosphor-icons/react'
import SkillsInput from './SkillsInput'
import { saveProfile, type ProfileFormData } from '@/lib/actions/profile'
import { profileFormSchema } from '@/lib/validation/profile'
import { toast } from 'sonner'

const profileSchema = profileFormSchema

type FormValues = z.input<typeof profileSchema>

type IconComponent = typeof UserCircle

function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--ink)' }}>
      {children}
      {required && <span style={{ color: 'var(--brand-red)' }}> *</span>}
    </label>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="mt-1 flex items-center gap-1 text-xs" style={{ color: 'var(--brand-red)' }}>
      <WarningCircle size={12} aria-hidden="true" />
      {message}
    </p>
  )
}

function Input({ hasError, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2.5 text-sm outline-none transition-colors"
      style={{
        border: `1px solid ${hasError ? 'var(--brand-red)' : 'var(--hairline-strong)'}`,
        borderRadius: 'var(--radius-sm)',
        background: 'var(--canvas)',
        color: 'var(--ink)',
      }}
      onFocus={(event) => {
        event.currentTarget.style.borderColor = 'var(--brand-red)'
        event.currentTarget.style.borderWidth = '2px'
        props.onFocus?.(event)
      }}
      onBlur={(event) => {
        event.currentTarget.style.borderColor = hasError ? 'var(--brand-red)' : 'var(--hairline-strong)'
        event.currentTarget.style.borderWidth = '1px'
        props.onBlur?.(event)
      }}
    />
  )
}

function Textarea({ hasError, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { hasError?: boolean }) {
  return (
    <textarea
      {...props}
      className="w-full resize-y px-3 py-2.5 text-sm leading-6 outline-none transition-colors"
      style={{
        border: `1px solid ${hasError ? 'var(--brand-red)' : 'var(--hairline-strong)'}`,
        borderRadius: 'var(--radius-sm)',
        background: 'var(--canvas)',
        color: 'var(--ink)',
        minHeight: props.rows ? undefined : '132px',
      }}
      onFocus={(event) => {
        event.currentTarget.style.borderColor = 'var(--brand-red)'
        event.currentTarget.style.borderWidth = '2px'
        props.onFocus?.(event)
      }}
      onBlur={(event) => {
        event.currentTarget.style.borderColor = hasError ? 'var(--brand-red)' : 'var(--hairline-strong)'
        event.currentTarget.style.borderWidth = '1px'
        props.onBlur?.(event)
      }}
    />
  )
}

function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string
  description?: string
  icon: IconComponent
  children: React.ReactNode
}) {
  return (
    <section className="rounded-lg p-5 sm:p-7" style={{ border: '1px solid var(--hairline)', background: 'var(--canvas)' }}>
      <div className="mb-5 flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md" style={{ background: 'var(--brand-red-subtle)', color: 'var(--brand-red)' }}>
          <Icon size={19} weight="duotone" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-h4" style={{ color: 'var(--ink-deep)' }}>{title}</h2>
          {description && <p className="mt-1 text-sm" style={{ color: 'var(--steel)', maxWidth: '65ch' }}>{description}</p>}
        </div>
      </div>
      <div className="divider-h mb-5" />
      {children}
    </section>
  )
}

function RichTextSection({
  id,
  title,
  description,
  hint,
  placeholder,
  icon,
  register,
  name,
  value,
}: {
  id: string
  title: string
  description: string
  hint: string
  placeholder: string
  icon: IconComponent
  register: ReturnType<typeof useForm<FormValues>>['register']
  name: keyof FormValues
  value?: string
}) {
  return (
    <Section title={title} description={description} icon={icon}>
      <Textarea id={id} rows={6} aria-label={title} placeholder={placeholder} {...register(name as never)} />
      <p className="mt-2 text-xs" style={{ color: 'var(--stone)' }}>{hint}{value ? ` ${value.length} characters.` : ''}</p>
    </Section>
  )
}

const GRADUATION_OPTIONS = [
  { value: '', label: 'Select status' },
  { value: 'current', label: 'Currently enrolled' },
  { value: '2026', label: 'Graduated 2026' },
  { value: '2025', label: 'Graduated 2025' },
  { value: '2024', label: 'Graduated 2024' },
  { value: '2023', label: 'Graduated 2023' },
  { value: '2022', label: 'Graduated 2022' },
  { value: '2021', label: 'Graduated 2021' },
  { value: 'other', label: 'Other' },
]

const AVAILABILITY_OPTIONS = [
  { value: '', label: 'Select availability' },
  { value: 'immediately', label: 'Available immediately' },
  { value: 'two_weeks', label: 'Available in two weeks' },
  { value: 'one_month', label: 'Available in one month' },
  { value: 'not_looking', label: 'Not actively looking' },
]

interface ProfileFormProps {
  initialData: ProfileFormData | null
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [saveError, setSaveError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: initialData?.full_name ?? '',
      headline: initialData?.headline ?? '',
      summary: initialData?.summary ?? '',
      pronouns: initialData?.pronouns ?? '',
      phone: initialData?.phone ?? '',
      city: initialData?.city ?? '',
      linkedin_url: initialData?.linkedin_url ?? '',
      portfolio_url: initialData?.portfolio_url ?? '',
      university: initialData?.university ?? '',
      degree: initialData?.degree ?? '',
      graduation_status: initialData?.graduation_status ?? '',
      availability: initialData?.availability ?? '',
      work_authorization: initialData?.work_authorization ?? '',
      desired_roles: initialData?.desired_roles ?? [],
      skills: initialData?.skills ?? [],
      experience_text: initialData?.experience_text ?? '',
      projects_text: initialData?.projects_text ?? '',
      certifications_text: initialData?.certifications_text ?? '',
      publications_text: initialData?.publications_text ?? '',
      test_scores_text: initialData?.test_scores_text ?? '',
      volunteer_text: initialData?.volunteer_text ?? '',
      awards_text: initialData?.awards_text ?? '',
      languages_text: initialData?.languages_text ?? '',
      interests_text: initialData?.interests_text ?? '',
    },
  })

  const skills = watch('skills') ?? []
  const desiredRoles = watch('desired_roles') ?? []
  const summary = watch('summary') ?? ''
  const experience = watch('experience_text') ?? ''
  const projects = watch('projects_text') ?? ''
  const certifications = watch('certifications_text') ?? ''
  const publications = watch('publications_text') ?? ''
  const tests = watch('test_scores_text') ?? ''
  const volunteering = watch('volunteer_text') ?? ''
  const awards = watch('awards_text') ?? ''
  const languages = watch('languages_text') ?? ''
  const interests = watch('interests_text') ?? ''

  const onSubmit = async (data: FormValues) => {
    setSaveStatus('saving')
    setSaveError('')
    const result = await saveProfile(data as ProfileFormData)
    if (result.success) {
      setSaveStatus('success')
      toast.success('Profile saved')
      window.setTimeout(() => setSaveStatus('idle'), 3000)
    } else {
      setSaveStatus('error')
      setSaveError(result.error ?? 'Failed to save profile')
      toast.error(result.error ?? 'Failed to save profile')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pb-8">
      <Section title="About you" description="Start with the details recruiters see first. Only add what you are comfortable sharing." icon={UserCircle}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="full_name" required>Full name</Label>
            <Input id="full_name" placeholder="Muhammad Ahmad" hasError={!!errors.full_name} {...register('full_name')} />
            <FieldError message={errors.full_name?.message} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="headline">Professional headline</Label>
            <Input id="headline" placeholder="AI Engineer building practical NLP and data products" {...register('headline')} />
            <p className="mt-2 text-xs" style={{ color: 'var(--stone)' }}>A clear one-line description helps you target the right roles.</p>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="summary">About / professional summary</Label>
            <Textarea id="summary" rows={5} placeholder="Summarise your experience, strengths, and the kind of work you want next." {...register('summary')} />
            <p className="mt-2 text-xs" style={{ color: summary.length > 0 ? 'var(--success)' : 'var(--stone)' }}>{summary.length}/3,000 characters</p>
          </div>
          <div>
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" type="tel" placeholder="+92 300 1234567" {...register('phone')} />
          </div>
          <div>
            <Label htmlFor="pronouns">Pronouns <span className="font-normal" style={{ color: 'var(--stone)' }}>(optional)</span></Label>
            <Input id="pronouns" placeholder="e.g. he/him, she/her, they/them" {...register('pronouns')} />
          </div>
          <div>
            <Label htmlFor="city"><span className="inline-flex items-center gap-1.5"><MapPin size={14} aria-hidden="true" /> City</span></Label>
            <Input id="city" placeholder="Lahore, Pakistan" {...register('city')} />
          </div>
          <div>
            <Label htmlFor="availability">Availability</Label>
            <select id="availability" className="w-full px-3 py-2.5 text-sm outline-none" style={{ border: '1px solid var(--hairline-strong)', borderRadius: 'var(--radius-sm)', background: 'var(--canvas)', color: 'var(--ink)' }} {...register('availability')}>
              {AVAILABILITY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="work_authorization">Work authorisation</Label>
            <Input id="work_authorization" placeholder="e.g. Pakistani citizen · Open to remote work" {...register('work_authorization')} />
          </div>
        </div>
      </Section>

      <Section title="Links and target roles" description="Help employers and the recommendation engine understand where you want to go." icon={LinkSimple}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input id="linkedin_url" type="url" placeholder="https://linkedin.com/in/username" hasError={!!errors.linkedin_url} {...register('linkedin_url')} />
            <FieldError message={errors.linkedin_url?.message} />
          </div>
          <div>
            <Label htmlFor="portfolio_url">Portfolio or GitHub URL</Label>
            <Input id="portfolio_url" type="url" placeholder="https://github.com/username" hasError={!!errors.portfolio_url} {...register('portfolio_url')} />
            <FieldError message={errors.portfolio_url?.message} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="desired-roles-input">Roles you are targeting</Label>
            <SkillsInput value={desiredRoles} onChange={(value) => setValue('desired_roles', value, { shouldDirty: true })} placeholder="e.g. AI Engineer, Data Analyst, Backend Developer" />
            <p className="mt-2 text-xs" style={{ color: 'var(--stone)' }}>{desiredRoles.length} target role{desiredRoles.length === 1 ? '' : 's'} added</p>
          </div>
        </div>
      </Section>

      <Section title="Education" description="Add degrees, institutions, bootcamps, or other formal study relevant to your target roles." icon={GraduationCap}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="university">University or institution</Label>
            <Input id="university" placeholder="University of Lahore" {...register('university')} />
          </div>
          <div>
            <Label htmlFor="degree">Degree and field</Label>
            <Input id="degree" placeholder="BS Computer Science" {...register('degree')} />
          </div>
          <div>
            <Label htmlFor="graduation_status">Graduation status</Label>
            <select id="graduation_status" className="w-full px-3 py-2.5 text-sm outline-none" style={{ border: '1px solid var(--hairline-strong)', borderRadius: 'var(--radius-sm)', background: 'var(--canvas)', color: 'var(--ink)' }} {...register('graduation_status')}>
              {GRADUATION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
        </div>
      </Section>

      <Section title="Skills" description="Add technical, professional, and domain skills. Use the skills that you can explain in an interview." icon={Sparkle}>
        <Label htmlFor="skills-input">Skills</Label>
        <SkillsInput value={skills} onChange={(value) => setValue('skills', value, { shouldDirty: true })} />
        <p className="mt-2 text-xs" style={{ color: 'var(--stone)' }}>{skills.length} skill{skills.length === 1 ? '' : 's'} added</p>
      </Section>

      <RichTextSection
        id="experience_text"
        title="Work experience"
        description="Include full-time roles, internships, freelance work, contract work, and meaningful part-time work."
        hint="Include role, organisation, dates, location, responsibilities, tools, and outcomes. Separate roles with a blank line."
        placeholder={'AI Engineer Intern — DevelopersHub Corporation\nMar 2026 – Apr 2026 · Islamabad · Remote\n\nBuilt and delivered machine-learning and NLP projects using Python, scikit-learn, LangChain, and FAISS.\n\nTip: write the facts naturally. Applytics will tailor the wording to each job.'}
        icon={Briefcase}
        register={register}
        name="experience_text"
        value={experience}
      />

      <RichTextSection
        id="projects_text"
        title="Projects and open source"
        description="Show personal, academic, client, research, and open-source projects that prove how you work."
        hint="Include project name, dates, tools, your contribution, links, and measurable outcomes when you have them."
        placeholder={'Syntexa — Text Similarity Analyzer · C++, DSA\nBuilt a document comparison tool using sliding-window phrase matching.\ngithub.com/username/project\n\nTip: include the problem, your contribution, and the result.'}
        icon={BookOpen}
        register={register}
        name="projects_text"
        value={projects}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <RichTextSection
          id="certifications_text"
          title="Certifications and courses"
          description="Add credentials, professional courses, and technical training."
          hint="Name · issuer · date · credential link (if available)."
          placeholder={'Google Data Analytics Certificate — Coursera · 2025\nAWS Cloud Practitioner — AWS · 2024'}
          icon={Certificate}
          register={register}
          name="certifications_text"
          value={certifications}
        />
        <RichTextSection
          id="publications_text"
          title="Publications and research"
          description="Include papers, articles, talks, conference work, or public writing."
          hint="Title · publication or event · date · link (if available)."
          placeholder={'Improving retrieval for Urdu question answering — University research project · 2025\nMedium article: Building reliable RAG systems · 2024'}
          icon={BookOpen}
          register={register}
          name="publications_text"
          value={publications}
        />
        <RichTextSection
          id="test_scores_text"
          title="Test scores"
          description="Add language, admissions, professional, or technical test results when relevant."
          hint="Name · score or level · date. Add only results you want employers to see."
          placeholder={'IELTS Academic — Band 7.5 · 2025\nGoogle Cloud Digital Leader assessment — 2024'}
          icon={Translate}
          register={register}
          name="test_scores_text"
          value={tests}
        />
        <RichTextSection
          id="volunteer_text"
          title="Volunteering and leadership"
          description="Show community work, student societies, mentoring, and leadership outside paid roles."
          hint="Organisation · role · dates · what you contributed."
          placeholder={'Volunteer Mentor — Code for Pakistan · 2024 – Present\nHelped university students prepare for technical interviews.'}
          icon={Heart}
          register={register}
          name="volunteer_text"
          value={volunteering}
        />
        <RichTextSection
          id="awards_text"
          title="Awards and honours"
          description="Add scholarships, competitions, academic honours, and other recognition."
          hint="Award · organisation · date · why it was awarded."
          placeholder={'Dean’s List — University of Lahore · 2024\nWinner, university hackathon · 2023'}
          icon={Trophy}
          register={register}
          name="awards_text"
          value={awards}
        />
        <RichTextSection
          id="languages_text"
          title="Languages"
          description="List spoken and written languages with honest proficiency levels."
          hint="Language · proficiency level."
          placeholder={'English — Professional working proficiency\nUrdu — Native\nPunjabi — Conversational'}
          icon={Translate}
          register={register}
          name="languages_text"
          value={languages}
        />
      </div>

      <RichTextSection
        id="interests_text"
        title="Professional interests"
        description="Share areas you want to learn, industries you care about, or communities you participate in."
        hint="Keep this relevant to the roles you want."
        placeholder="Natural language processing, developer tools, responsible AI, education technology"
        icon={UserCircle}
        register={register}
        name="interests_text"
        value={interests}
      />

      <div className="sticky bottom-3 z-10 flex flex-col gap-3 rounded-lg p-3 sm:flex-row sm:items-center sm:justify-between" style={{ border: '1px solid var(--hairline-strong)', background: 'rgba(255,255,255,0.96)', boxShadow: 'var(--shadow-card)', backdropFilter: 'blur(8px)' }}>
        <AnimatePresence mode="wait">
          {saveStatus === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 px-2 text-sm font-medium" style={{ color: 'var(--success)' }}>
              <CheckCircle size={16} weight="fill" aria-hidden="true" /> Profile saved
            </motion.div>
          )}
          {saveStatus === 'error' && (
            <motion.div key="error" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 px-2 text-sm" style={{ color: 'var(--brand-red)' }}>
              <WarningCircle size={16} aria-hidden="true" /> {saveError}
            </motion.div>
          )}
          {(saveStatus === 'idle' || saveStatus === 'saving') && (
            <span className="px-2 text-sm" style={{ color: isDirty ? 'var(--brand-red)' : 'var(--stone)' }}>
              {isDirty ? 'Unsaved changes' : 'All changes saved'}
            </span>
          )}
        </AnimatePresence>
        <button type="submit" disabled={saveStatus === 'saving'} className="inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium transition-all" style={{ background: saveStatus === 'saving' ? 'var(--steel)' : 'var(--brand-red)', color: 'var(--on-dark)', borderRadius: 'var(--radius-md)', border: 'none', cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer' }}>
          <FloppyDisk size={16} aria-hidden="true" />
          {saveStatus === 'saving' ? 'Saving…' : 'Save profile'}
        </button>
      </div>
    </form>
  )
}
