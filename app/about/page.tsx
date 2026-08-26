import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'About Applytics',
  description: 'Why Applytics is being built for Pakistani students and early-career job seekers.',
  openGraph: {
    title: 'About Applytics',
    description: 'Why Applytics is being built for Pakistani students and early-career job seekers.',
  },
}

export default function AboutPage() {
  return (
    <main className="min-h-[100dvh] flex flex-col" style={{ background: 'var(--canvas)' }}>
      <Navbar />

      <section className="w-full pt-28 md:pt-36 pb-16 md:pb-24" style={{ background: 'var(--canvas)' }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="max-w-[780px]">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: 'var(--brand-red)', fontFamily: 'var(--font-geist-mono)' }}
            >
              About Applytics
            </p>
            <h1
              className="text-4xl md:text-6xl font-bold"
              style={{ color: 'var(--ink-deep)', letterSpacing: '-1.8px', lineHeight: 1.02 }}
            >
              A simpler way to manage the search for your next opportunity.
            </h1>
            <p className="mt-8 max-w-[680px] text-lg md:text-xl" style={{ color: 'var(--charcoal)', lineHeight: 1.7 }}>
              Applytics exists because looking for an internship or job can become a second job in itself. The work is spread across job boards, company pages, resume documents, application notes, and follow-up reminders. For students and early-career applicants in Pakistan, that process often means using several disconnected tools and trying to remember what happened in each one.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full" style={{ background: 'var(--surface)', borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)', padding: 'clamp(72px, 9vw, 120px) 0' }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-12 lg:gap-24">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--ink-deep)', letterSpacing: '-0.7px', lineHeight: 1.15 }}>
                Why I started building it
              </h2>
            </div>
            <div className="space-y-6 text-base md:text-lg" style={{ color: 'var(--charcoal)', lineHeight: 1.8 }}>
              <p>
                I am Ahtasham Ul Haq, an AI Engineer and student. I faced these problems while looking for internships. Tailoring a resume for each job took time, and it was easy to lose track of which roles I had applied for and which resume I had sent. I also saw the same pattern among students at my university.
              </p>
              <p>
                That repeated experience led me to build Applytics. I wanted one practical place where Pakistani job seekers could manage the parts of the process that are usually scattered: finding relevant opportunities, understanding what a role asks for, preparing a role-specific resume, and keeping application details visible.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full" style={{ background: 'var(--canvas)', padding: 'clamp(72px, 9vw, 120px) 0' }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="max-w-[800px]">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--ink-deep)', letterSpacing: '-0.7px', lineHeight: 1.15 }}>
              What we are trying to build
            </h2>
            <div className="mt-7 space-y-6 text-base md:text-lg" style={{ color: 'var(--charcoal)', lineHeight: 1.8 }}>
              <p>
                Applytics is focused on making it easier to move from finding an opportunity to preparing for it and keeping track of the application. The goal is not to promise a job or replace a person&apos;s judgment. The goal is to reduce the avoidable work around the search so users can give more attention to the applications that matter to them.
              </p>
              <p>
                We are building for the Pakistani market because the local context matters. International platforms and general-purpose tools do not always fit the way students here search for internships and early-career roles. Local tools may solve one part of the process, but job discovery, resume preparation, recommendations, and application tracking are often still separated across different places. Applytics brings those pieces together in one workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full" style={{ background: 'var(--surface)', borderTop: '1px solid var(--hairline)', padding: 'clamp(72px, 9vw, 120px) 0' }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-12 lg:gap-24">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--ink-deep)', letterSpacing: '-0.7px', lineHeight: 1.15 }}>
                How we think about AI
              </h2>
            </div>
            <div className="space-y-6 text-base md:text-lg" style={{ color: 'var(--charcoal)', lineHeight: 1.8 }}>
              <p>
                Our standard is practical usefulness. AI should help a user prepare and review their application, not create a false version of their background. Generated content must remain connected to the user&apos;s profile and should be reviewed before it is used. When information is missing, the product should make that clear instead of filling the gap with an invented claim.
              </p>
              <p>
                We also do not sell personal profile data. A career tool should help people organise their search without treating their personal information as a product.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full" style={{ background: 'var(--brand-black)', padding: 'clamp(72px, 9vw, 120px) 0' }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-10 md:gap-16 items-center">
            <div className="relative mx-auto md:mx-0 w-[190px] h-[220px] overflow-hidden flex items-end justify-center" style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}>
              <Image
                src="/ahtasham-founder.png"
                alt="Ahtasham Ul Haq, founder of Applytics"
                width={800}
                height={800}
                className="h-auto w-[250px] max-w-none object-contain object-bottom"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'var(--brand-red)', fontFamily: 'var(--font-geist-mono)' }}>
                Founder note
              </p>
              <p className="max-w-[760px] text-xl md:text-2xl font-light" style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.55 }}>
                Applytics is currently being built by me, from the product and engineering work to the decisions about how it should serve job seekers. The product is still growing, but its purpose is simple: make the search for an internship or job easier to manage for people in Pakistan who are already doing enough work just to get noticed.
              </p>
              <div className="mt-7 flex items-center gap-6">
                <div>
                  <p className="text-base font-semibold" style={{ color: 'white' }}>Ahtasham Ul Haq</p>
                  <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>AI Engineer · Founder, Applytics</p>
                </div>
                <Link href="https://www.linkedin.com/in/mr-ahtashamulhaq/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--brand-red)' }}>
                  Connect on LinkedIn
                  <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
