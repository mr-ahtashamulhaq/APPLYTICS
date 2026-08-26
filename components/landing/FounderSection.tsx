import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'

export default function FounderSection() {
  return (
    <section
      id="mission"
      className="w-full"
      style={{ background: 'var(--surface)', padding: 'clamp(80px, 10vw, 136px) 0' }}
    >
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <span
            className="text-xs font-semibold uppercase tracking-widest whitespace-nowrap"
            style={{ color: 'var(--steel)', fontFamily: 'var(--font-geist-mono)' }}
          >
            The person behind Applytics
          </span>
          <div className="h-px flex-1" style={{ background: 'var(--hairline-strong)' }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] gap-12 lg:gap-20 items-center">
          <div className="max-w-[700px]">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-7"
              style={{ color: 'var(--ink-deep)', letterSpacing: '-1.35px', lineHeight: 1.08 }}
            >
              Built from a problem we kept running into.
            </h2>

            <div className="space-y-5 text-base md:text-lg" style={{ color: 'var(--charcoal)', lineHeight: 1.75 }}>
              <p>
                Applytics is built by Ahtasham Ul Haq, an AI Engineer and student who faced the same job-search problems this product is meant to make easier. Finding internships was difficult. Tailoring a resume for every role took time. It was also easy to lose track of which jobs had been applied for and which resume had been used.
              </p>
              <p>
                The same problems kept coming up among students at his university. That made the gap clear: Pakistani students and early-career applicants often have to move between several tools to find opportunities, prepare an application, and keep track of what happens next. Applytics brings that work into one place, with a focus on practical usefulness rather than exaggerated promises.
              </p>
              <p>
                We want Applytics to make the process easier to manage and help job seekers spend less time keeping their search organised. The product should support the work without taking control away from the person applying.
              </p>
            </div>

            <div className="mt-9 flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-8">
              <div>
                <p className="text-base font-semibold" style={{ color: 'var(--ink-deep)' }}>
                  Ahtasham Ul Haq
                </p>
                <p className="mt-1 text-sm" style={{ color: 'var(--steel)' }}>
                  AI Engineer · Founder, Applytics
                </p>
              </div>
              <Link
                href="https://www.linkedin.com/in/mr-ahtashamulhaq/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                style={{ color: 'var(--brand-red)' }}
              >
                LinkedIn
                <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-9 pt-6" style={{ borderTop: '1px solid var(--hairline)' }}>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                style={{ color: 'var(--ink-deep)' }}
              >
                About the person building Applytics
                <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="relative min-h-[320px] sm:min-h-[400px] lg:min-h-[460px] overflow-hidden flex items-end justify-center">
            <div
              className="absolute inset-x-8 bottom-0 h-[72%]"
              style={{ background: 'var(--canvas)', border: '1px solid var(--hairline)' }}
              aria-hidden="true"
            />
            <Image
              src="/ahtasham-founder.png"
              alt="Ahtasham Ul Haq, founder of Applytics"
              width={800}
              height={800}
              className="relative z-10 h-auto w-[220px] sm:w-[260px] lg:w-full lg:max-w-[320px] object-contain object-bottom"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
