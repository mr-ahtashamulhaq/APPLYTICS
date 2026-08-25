import { loadProfile } from '@/lib/actions/profile'
import ProfileForm from '@/components/profile/ProfileForm'

export const metadata = {
  title: 'Profile | Applytics',
  description: 'Manage the professional information Applytics uses to tailor your resumes and recommendations.',
}

export default async function ProfilePage() {
  const initialData = await loadProfile()

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-8 border-b pb-7" style={{ borderColor: 'var(--hairline)' }}>
        <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>Build your professional profile</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6" style={{ color: 'var(--steel)' }}>
          Give Applytics the evidence behind your work. More context helps us rank relevant roles and tailor resumes without inventing facts.
        </p>
      </header>

      <ProfileForm initialData={initialData} />
    </div>
  )
}
