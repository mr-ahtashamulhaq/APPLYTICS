import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.applytics.online'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/app/', '/api/', '/sign-in', '/sign-up'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
