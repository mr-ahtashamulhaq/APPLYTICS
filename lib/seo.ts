import type { Metadata } from 'next'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.applytics.online'
export const OG_IMAGE_PATH = '/og-applytics.png'

const defaultDescription = 'Find jobs in Pakistan, tailor a resume to a selected listing, and track applications in one place.'

export function createPageMetadata({
  title,
  description = defaultDescription,
  path,
  noIndex = false,
}: {
  title: string
  description?: string
  path: string
  noIndex?: boolean
}): Metadata {
  const canonical = new URL(path, SITE_URL).toString()
  const fullTitle = title === 'Applytics' ? 'Applytics' : `${title} | Applytics`

  return {
    title,
    description,
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: 'Applytics',
      locale: 'en_PK',
      type: 'website',
      images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630, alt: 'Applytics, a clearer job search for Pakistan' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [OG_IMAGE_PATH],
    },
  }
}
