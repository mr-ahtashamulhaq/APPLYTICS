export const metadata = {
  title: 'Application Tracker — Applytics',
  description: 'Track every job application and its status in one place.',
}

export default function TrackerPage() {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <p className="text-label mb-1">Applications</p>
        <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>
          Tracker
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--steel)' }}>
          Every application you&apos;ve submitted, in one place.
        </p>
      </div>

      {/* Empty state */}
      <div
        className="rounded-lg p-8 flex flex-col items-center justify-center text-center"
        style={{
          border: '1px solid var(--hairline)',
          background: 'var(--canvas)',
          minHeight: 280,
        }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
          style={{ background: 'var(--brand-red-subtle)' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M3 6h14M3 10h10M3 14h7"
              stroke="var(--brand-red)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2 className="text-h4 mb-1" style={{ color: 'var(--ink-deep)' }}>
          No applications tracked
        </h2>
        <p className="text-sm" style={{ color: 'var(--steel)', maxWidth: '36ch' }}>
          Applications you generate will appear here automatically. You can update their status as you progress.
        </p>
      </div>
    </div>
  )
}
