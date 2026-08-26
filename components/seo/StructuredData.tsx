import { SITE_URL } from '@/lib/seo'

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Applytics',
      url: SITE_URL,
      logo: `${SITE_URL}/applytics-logo.png`,
      description: 'A career support platform for job seekers in Pakistan.',
      founder: {
        '@type': 'Person',
        name: 'Ahtasham Ul Haq',
        jobTitle: 'AI Engineer',
        url: 'https://www.linkedin.com/in/mr-ahtashamulhaq/',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Applytics',
      url: SITE_URL,
      description: 'Find jobs in Pakistan, tailor a resume to a selected listing, and track applications in one place.',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-PK',
    },
  ],
}

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
