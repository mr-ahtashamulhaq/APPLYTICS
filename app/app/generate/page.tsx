export const metadata = {
  title: 'Generate Resume — Applytics',
  description: 'Paste a job description to generate a tailored ATS-friendly resume.',
}

export default function GeneratePage() {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <p className="text-label mb-1">AI Resume Builder</p>
        <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>
          Generate Resume
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--steel)' }}>
          Paste the job description below. We&apos;ll tailor your profile to match the role.
        </p>
      </div>

      {/* Placeholder form area — Phase 4 will wire this up */}
      <div
        className="rounded-lg p-8 flex flex-col items-center justify-center text-center"
        style={{
          border: '1px solid var(--hairline)',
          background: 'var(--canvas)',
          minHeight: 320,
        }}
      >
        <span className="text-label mb-2">Coming in Phase 4</span>
        <p className="text-sm" style={{ color: 'var(--steel)' }}>
          Job description input, profile check, and AI pipeline will be built here.
        </p>
      </div>
    </div>
  )
}
