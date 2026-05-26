import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import Features from '@/components/landing/Features'
import PricingSection from '@/components/landing/PricingSection'
import MissionBand from '@/components/landing/MissionBand'
import SuggestionForm from '@/components/landing/SuggestionForm'
import Footer from '@/components/landing/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Applytics',
  description: 'Paste a job description, get a tailored ATS-safe resume in seconds. Built for students and fresh graduates in Pakistan.',
  keywords: ['resume', 'ATS', 'job application', 'Pakistan', 'CV', 'career', 'AI resume'],
  openGraph: {
    title: 'Applytics - AI Resume Tailoring',
    description: 'Turning applications into interviews for Pakistan\'s job seekers.',
    type: 'website',
  },
}

export default async function RootPage() {
  const { userId } = await auth()

  // Authenticated users go straight to the dashboard
  if (userId) redirect('/app/dashboard')

  // Unauthenticated users see the landing page
  return (
    <main className="min-h-[100dvh] flex flex-col" style={{ background: 'var(--canvas)' }}>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <PricingSection />
      <MissionBand />
      <SuggestionForm />
      <Footer />
    </main>
  )
}
