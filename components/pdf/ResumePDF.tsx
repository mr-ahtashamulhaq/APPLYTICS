import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { AIResult } from '@/lib/actions/generate'

// ── Fonts (system-safe for ATS) ─────────────────────────────────
// react-pdf uses its own font engine — Helvetica is built-in
Font.registerHyphenationCallback((word) => [word])

// ── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 48,
    lineHeight: 1.45,
  },
  // ── Header ──────────────────────────────────────────────────────
  header: { marginBottom: 16 },
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#0f0f0f',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  headerMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    fontSize: 9,
    color: '#555',
  },
  headerMetaItem: { color: '#444' },
  // ── Section ─────────────────────────────────────────────────────
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#de0d12',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
    paddingBottom: 3,
    borderBottomWidth: 0.75,
    borderBottomColor: '#e5e5e5',
    borderBottomStyle: 'solid',
  },
  // ── Summary ─────────────────────────────────────────────────────
  summary: { fontSize: 10, color: '#333', lineHeight: 1.55 },
  // ── Skills ──────────────────────────────────────────────────────
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  skillChip: {
    fontSize: 9,
    color: '#333',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  // ── Experience / Project entries ─────────────────────────────────
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  entryTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0f0f0f',
  },
  entrySub: { fontSize: 9, color: '#666' },
  entryDate: { fontSize: 9, color: '#888' },
  bullet: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 2.5,
    paddingLeft: 4,
  },
  bulletDot: { fontSize: 10, color: '#de0d12', marginTop: 0.5 },
  bulletText: { fontSize: 9.5, color: '#333', flex: 1, lineHeight: 1.5 },
  // ── Education ───────────────────────────────────────────────────
  eduRow: { flexDirection: 'row', justifyContent: 'space-between' },
  eduTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0f0f0f' },
  eduSub: { fontSize: 9, color: '#555', marginTop: 1 },
  // ── Divider between entries ──────────────────────────────────────
  entryGap: { marginBottom: 8 },
})

// ── Component ────────────────────────────────────────────────────
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
  }
}

export default function ResumePDF({ ai, jobTitle, company, profile }: Props) {
  return (
    <Document
      title={`${profile.full_name} — ${jobTitle} at ${company}`}
      author={profile.full_name}
      creator="Applytics"
      producer="Applytics"
    >
      <Page size="A4" style={s.page}>

        {/* ── Header ─────────────────────────────────────────── */}
        <View style={s.header}>
          <Text style={s.name}>{profile.full_name}</Text>
          <View style={s.headerMeta}>
            {profile.email && <Text style={s.headerMetaItem}>{profile.email}</Text>}
            {profile.phone && <Text style={s.headerMetaItem}>{profile.phone}</Text>}
            {profile.city && <Text style={s.headerMetaItem}>{profile.city}</Text>}
            {profile.linkedin_url && (
              <Text style={s.headerMetaItem}>{profile.linkedin_url.replace('https://', '')}</Text>
            )}
            {profile.portfolio_url && (
              <Text style={s.headerMetaItem}>{profile.portfolio_url.replace('https://', '')}</Text>
            )}
          </View>
        </View>

        {/* ── Professional Summary ─────────────────────────── */}
        {ai.summary && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Professional Summary</Text>
            <Text style={s.summary}>{ai.summary}</Text>
          </View>
        )}

        {/* ── Skills ──────────────────────────────────────── */}
        {(ai.skills_to_emphasize ?? []).length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Skills</Text>
            <View style={s.skillsRow}>
              {ai.skills_to_emphasize.map((skill, i) => (
                <Text key={i} style={s.skillChip}>{skill}</Text>
              ))}
            </View>
          </View>
        )}

        {/* ── Work Experience ──────────────────────────────── */}
        {(ai.rewritten_experience ?? []).length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Work Experience</Text>
            {ai.rewritten_experience.map((exp, i) => (
              <View key={i} style={s.entryGap}>
                <View style={s.entryHeader}>
                  <View>
                    <Text style={s.entryTitle}>{exp.role}</Text>
                    <Text style={s.entrySub}>{exp.company}</Text>
                  </View>
                  {exp.duration && <Text style={s.entryDate}>{exp.duration}</Text>}
                </View>
                {exp.bullets.map((bullet, j) => (
                  <View key={j} style={s.bullet}>
                    <Text style={s.bulletDot}>▸</Text>
                    <Text style={s.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* ── Projects ────────────────────────────────────── */}
        {(ai.rewritten_projects ?? []).length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Projects</Text>
            {ai.rewritten_projects.map((proj, i) => (
              <View key={i} style={s.entryGap}>
                <Text style={s.entryTitle}>{proj.title}</Text>
                {proj.bullets.map((bullet, j) => (
                  <View key={j} style={s.bullet}>
                    <Text style={s.bulletDot}>▸</Text>
                    <Text style={s.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* ── Education ───────────────────────────────────── */}
        {(profile.university || profile.degree) && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Education</Text>
            <View style={s.eduRow}>
              <View>
                <Text style={s.eduTitle}>{profile.university}</Text>
                <Text style={s.eduSub}>{profile.degree}</Text>
              </View>
              {profile.graduation_status && (
                <Text style={s.entryDate}>{profile.graduation_status}</Text>
              )}
            </View>
          </View>
        )}

      </Page>
    </Document>
  )
}
