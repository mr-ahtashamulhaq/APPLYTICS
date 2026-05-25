import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Applytics — AI Resume Tailoring for Pakistani Job Seekers',
  description:
    'Paste a job description, get a tailored ATS-friendly resume in seconds. Built for students and fresh graduates in Pakistan.',
  keywords: ['resume', 'ATS', 'job application', 'Pakistan', 'CV', 'career'],
  openGraph: {
    title: 'Applytics — AI Resume Tailoring',
    description: 'Tailored resumes for every job. Built for Pakistani students and graduates.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  )
}
