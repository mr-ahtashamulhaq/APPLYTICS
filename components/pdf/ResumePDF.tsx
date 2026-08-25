import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from '@react-pdf/renderer'
import type { AIResult } from '@/lib/actions/generate'

// ── Styles ───────────────────────────────────────────────────────
// Standard PDF Times fonts are embedded as reliable base-14 fonts by PDF
// viewers and remain machine-readable for ATS extraction.
const s = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 9.2,
    color: '#1b1b1b',
    paddingTop: 40,
    paddingBottom: 38,
    paddingHorizontal: 40,
    lineHeight: 1.22,
  },

  header: {
    alignItems: 'center',
    marginBottom: 9,
  },
  name: {
    fontSize: 18.5,
    fontFamily: 'Times-Bold',
    color: '#111111',
    letterSpacing: 1.1,
    lineHeight: 1.3,
    textAlign: 'center',
    marginBottom: 7,
  },
  contactRow: {
    width: '100%',
    minHeight: 11,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 1.2,
  },
  contactItem: {
    fontSize: 8.4,
    color: '#222222',
    lineHeight: 1.2,
  },
  contactLink: {
    fontSize: 8.4,
    color: '#222222',
    textDecoration: 'none',
    lineHeight: 1.2,
  },
  contactSep: {
    fontSize: 8.2,
    color: '#555555',
    marginHorizontal: 4,
  },

  section: {
    marginBottom: 8,
    minPresenceAhead: 24,
  },
  sectionTitle: {
    fontSize: 9.1,
    fontFamily: 'Times-Bold',
    color: '#191919',
    textTransform: 'uppercase',
    letterSpacing: 0.85,
    marginBottom: 4,
    paddingBottom: 2.2,
    borderBottomWidth: 0.6,
    borderBottomColor: '#333333',
    borderBottomStyle: 'solid',
  },
  summary: {
    fontSize: 9.4,
    color: '#222222',
    lineHeight: 1.3,
  },
  skillsText: {
    fontSize: 8.9,
    color: '#222222',
    lineHeight: 1.26,
  },

  entry: {
    marginBottom: 6,
    minPresenceAhead: 25,
  },
  entryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  entryPrimary: {
    flex: 1,
    paddingRight: 8,
  },
  entryTitle: {
    fontSize: 9.8,
    fontFamily: 'Times-Bold',
    color: '#111111',
    lineHeight: 1.15,
  },
  entrySub: {
    fontSize: 8.8,
    fontFamily: 'Times-Italic',
    color: '#3d3d3d',
    marginTop: 1,
    lineHeight: 1.15,
  },
  entryDate: {
    maxWidth: '42%',
    fontSize: 8.6,
    color: '#222222',
    fontFamily: 'Times-Italic',
    textAlign: 'right',
    lineHeight: 1.15,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 1.2,
    paddingLeft: 5,
    width: '100%',
  },
  bulletChar: {
    width: 8,
    fontSize: 8.6,
    color: '#222222',
    lineHeight: 1.24,
  },
  bulletText: {
    flex: 1,
    fontSize: 8.85,
    color: '#222222',
    lineHeight: 1.24,
  },

  educationTitle: {
    fontSize: 9.8,
    fontFamily: 'Times-Bold',
    color: '#111111',
  },
  educationSub: {
    fontSize: 8.8,
    fontFamily: 'Times-Italic',
    color: '#3d3d3d',
    marginTop: 1,
  },
  profileText: {
    fontSize: 8.9,
    color: '#222222',
    lineHeight: 1.26,
  },
})

function Bullet({ text }: { text: string }) {
  return (
    <View style={s.bulletRow} wrap>
      <Text style={s.bulletChar}>•</Text>
      <Text style={s.bulletText}>{text}</Text>
    </View>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  )
}

interface Props {
  ai: AIResult
  jobTitle: string
  company: string
  profile: {
    full_name: string
    email?: string
    phone?: string
    city?: string
    linkedin_url?: string
    portfolio_url?: string
    university?: string
    degree?: string
    graduation_status?: string
    certifications_text?: string
    publications_text?: string
    test_scores_text?: string
    volunteer_text?: string
    awards_text?: string
    languages_text?: string
    interests_text?: string
  }
}

export default function ResumePDF({ ai, jobTitle, company, profile }: Props) {
  const contacts: { text: string; href?: string }[] = []
  if (profile.email) contacts.push({ text: profile.email })
  if (profile.phone) contacts.push({ text: profile.phone })
  if (profile.city) contacts.push({ text: profile.city })
  if (profile.linkedin_url) contacts.push({ text: 'LinkedIn', href: profile.linkedin_url })
  if (profile.portfolio_url) contacts.push({ text: 'Portfolio / GitHub', href: profile.portfolio_url })

  const additionalSections: Array<[string, string | undefined]> = [
    ['Certifications', profile.certifications_text],
    ['Publications and Research', profile.publications_text],
    ['Test Scores', profile.test_scores_text],
    ['Volunteer Experience', profile.volunteer_text],
    ['Awards and Honours', profile.awards_text],
    ['Languages', profile.languages_text],
    ['Professional Interests', profile.interests_text],
  ]

  return (
    <Document
      title={`${profile.full_name} - ${jobTitle} at ${company}`}
      author={profile.full_name}
      creator="Applytics"
      producer="Applytics"
    >
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.name}>{profile.full_name}</Text>
          <View style={s.contactRow}>
            {contacts.map((contact, index) => (
              <View key={`${contact.text}-${index}`} style={{ flexDirection: 'row', alignItems: 'center' }}>
                {index > 0 && <Text style={s.contactSep}>|</Text>}
                {contact.href ? (
                  <Link src={contact.href} style={s.contactLink}>{contact.text}</Link>
                ) : (
                  <Text style={s.contactItem}>{contact.text}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {!!ai.summary && (
          <Section title="Professional Summary">
            <Text style={s.summary}>{ai.summary}</Text>
          </Section>
        )}

        {(ai.skills_to_emphasize ?? []).length > 0 && (
          <Section title="Technical Skills">
            <Text style={s.skillsText}>{ai.skills_to_emphasize.join(', ')}</Text>
          </Section>
        )}

        {(ai.rewritten_experience ?? []).length > 0 && (
          <Section title="Experience">
            {ai.rewritten_experience.map((experience, index) => (
              <View key={`${experience.company}-${index}`} style={s.entry} wrap>
                <View style={s.entryHeaderRow}>
                  <View style={s.entryPrimary}>
                    <Text style={s.entryTitle}>{experience.company}</Text>
                    <Text style={s.entrySub}>{experience.role}</Text>
                  </View>
                  {!!experience.duration && <Text style={s.entryDate}>{experience.duration}</Text>}
                </View>
                {experience.bullets.map((bullet, bulletIndex) => (
                  <Bullet key={`${index}-${bulletIndex}`} text={bullet} />
                ))}
              </View>
            ))}
          </Section>
        )}

        {(ai.rewritten_projects ?? []).length > 0 && (
          <Section title="Projects">
            {ai.rewritten_projects.map((project, index) => (
              <View key={`${project.title}-${index}`} style={s.entry} wrap>
                <Text style={s.entryTitle}>{project.title}</Text>
                {project.bullets.map((bullet, bulletIndex) => (
                  <Bullet key={`${index}-${bulletIndex}`} text={bullet} />
                ))}
              </View>
            ))}
          </Section>
        )}

        {(profile.university || profile.degree) && (
          <Section title="Education">
            <View style={s.entry} wrap>
              <View style={s.entryHeaderRow}>
                <View style={s.entryPrimary}>
                  {!!profile.university && <Text style={s.educationTitle}>{profile.university}</Text>}
                  {!!profile.degree && <Text style={s.educationSub}>{profile.degree}</Text>}
                </View>
                {!!profile.graduation_status && <Text style={s.entryDate}>{profile.graduation_status}</Text>}
              </View>
            </View>
          </Section>
        )}

        {additionalSections.map(([title, value]) => (
          typeof value === 'string' && value.trim() ? (
            <Section key={title} title={title}>
              <Text style={s.profileText}>{value.trim()}</Text>
            </Section>
          ) : null
        ))}
      </Page>
    </Document>
  )
}
