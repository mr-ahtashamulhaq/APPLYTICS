import { SignIn } from '@clerk/nextjs'

export const metadata = {
  title: 'Sign In — Applytics',
  description: 'Sign in to your Applytics account.',
}

export default function SignInPage() {
  return (
    <div
      className="min-h-dvh flex"
      style={{ background: 'var(--surface)' }}
    >
      {/* Left panel — branding */}
      <div
        data-testid="dark-panel"
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-12"
        style={{
          background: 'var(--brand-black)',
          color: 'var(--on-dark)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <rect width="28" height="28" rx="6" fill="var(--brand-red)" />
            <path
              d="M14 6L20 22H17.5L16 18H12L10.5 22H8L14 6ZM14 10.5L12.7 14.5H15.3L14 10.5Z"
              fill="white"
            />
          </svg>
          <span className="font-semibold text-sm tracking-tight text-white">Applytics</span>
        </div>

        {/* Tagline */}
        <div>
          <h2
            className="text-h2 mb-3"
            style={{ color: 'var(--on-dark)', letterSpacing: '-0.5px' }}
          >
            Tailored resumes for every job.
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--on-dark-muted)' }}>
            Paste a job description. Get an ATS-optimized resume in seconds. Built for Pakistani students and graduates.
          </p>
        </div>

        {/* Bottom note */}
        <p className="text-xs" style={{ color: 'var(--steel)' }}>
          © {new Date().getFullYear()} Applytics. All rights reserved.
        </p>
      </div>

      {/* Right panel — Clerk form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-6 lg:hidden">
            <div className="flex items-center gap-2 mb-4">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <rect width="28" height="28" rx="6" fill="var(--brand-red)" />
                <path
                  d="M14 6L20 22H17.5L16 18H12L10.5 22H8L14 6ZM14 10.5L12.7 14.5H15.3L14 10.5Z"
                  fill="white"
                />
              </svg>
              <span className="font-semibold text-sm" style={{ color: 'var(--ink-deep)' }}>Applytics</span>
            </div>
          </div>

          <SignIn
            appearance={{
              variables: {
                colorPrimary: '#de0d12',
                colorBackground: '#ffffff',
                colorText: '#1a1a1a',
                colorTextSecondary: '#787671',
                colorInputBackground: '#ffffff',
                colorInputText: '#1a1a1a',
                borderRadius: '6px',
                fontFamily: 'var(--font-geist-sans)',
              },
              elements: {
                card: 'shadow-none border border-[--hairline] rounded-lg',
                headerTitle: 'text-h3',
                formButtonPrimary:
                  'bg-[--brand-red] hover:bg-[--brand-red-deep] text-white rounded-md font-medium transition-colors',
                footerActionLink: 'text-[--brand-red] font-medium',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
