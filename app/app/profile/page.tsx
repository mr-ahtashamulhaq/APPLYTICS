export const metadata = {
  title: 'Profile — Applytics',
  description: 'Manage your professional profile, skills, and experience.',
}

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-8">
        <p className="text-label mb-1">Your Profile</p>
        <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>
          Profile
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--steel)' }}>
          Your skills, experience, and education — the source we tailor from.
        </p>
      </div>

      {/* Placeholder — Phase 3 will build the full profile form */}
      <div
        className="rounded-lg p-8 flex flex-col items-center justify-center text-center"
        style={{
          border: '1px solid var(--hairline)',
          background: 'var(--canvas)',
          minHeight: 320,
        }}
      >
        <span className="text-label mb-2">Coming in Phase 3</span>
        <p className="text-sm" style={{ color: 'var(--steel)' }}>
          Contact info, work experience, education, and skills form will be built here.
        </p>
      </div>
    </div>
  )
}
