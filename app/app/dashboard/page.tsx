import { auth } from '@clerk/nextjs/server'

export const metadata = {
  title: 'Dashboard — Applytics',
  description: 'Your resume generation and job application overview.',
}

export default async function DashboardPage() {
  const { userId } = await auth()

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-label mb-1">Overview</p>
        <h1 className="text-h1" style={{ color: 'var(--ink-deep)' }}>
          Dashboard
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--steel)' }}>
          Your recent resumes and application activity.
        </p>
      </div>

      {/* Stat row */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-px mb-8"
        style={{
          background: 'var(--hairline)',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        {[
          { label: 'Resumes Generated', value: '0' },
          { label: 'Applications', value: '0' },
          { label: 'Interviews', value: '0' },
          { label: 'Avg. Match Score', value: '—' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 px-5 py-4"
            style={{ background: 'var(--canvas)' }}
          >
            <span
              className="text-sm"
              style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--ink-deep)',
                letterSpacing: '-0.5px',
              }}
            >
              {stat.value}
            </span>
            <span className="text-xs" style={{ color: 'var(--steel)' }}>
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Recent resumes empty state */}
      <div
        className="rounded-lg p-8 flex flex-col items-center justify-center text-center"
        style={{
          border: '1px solid var(--hairline)',
          background: 'var(--canvas)',
          minHeight: 240,
        }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
          style={{ background: 'var(--brand-red-subtle)' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M5 4h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"
              stroke="var(--brand-red)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M7 8h6M7 11h4"
              stroke="var(--brand-red)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2
          className="text-h4 mb-1"
          style={{ color: 'var(--ink-deep)' }}
        >
          No resumes yet
        </h2>
        <p className="text-sm mb-5" style={{ color: 'var(--steel)', maxWidth: '34ch' }}>
          Paste a job description and let Applytics tailor your resume in seconds.
        </p>
        <a
          href="/app/generate"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors"
          style={{
            background: 'var(--brand-red)',
            color: 'var(--on-dark)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          Generate your first resume
        </a>
      </div>
    </div>
  )
}
