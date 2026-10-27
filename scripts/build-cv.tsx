import { Document, Font, Link, Page, pdf, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { ReactNode } from 'react'
import en from '../public/locales/en/translation.json'
import es from '../public/locales/es/translation.json'
import {
  buildCvContent,
  type CvContent,
  type CvLanguage,
  type CvTranslation,
} from '../src/cv/cvContent'
import { cvFileName, cvLanguages } from '../src/cv/cvFile'

declare const Bun: {
  readonly stdout: unknown
  write(destination: URL | unknown, data: Blob | string): Promise<number>
}

const OUTPUT = new URL('../public/cv/', import.meta.url)
const INK = '#1a1a1a'
const MUTED = '#555555'
const RULE = '#bbbbbb'

const translations: Readonly<Record<CvLanguage, CvTranslation>> = { en, es }

Font.registerHyphenationCallback((word) => [word])

const styles = StyleSheet.create({
  page: {
    paddingVertical: 40,
    paddingHorizontal: 48,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
    color: INK,
  },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 22, lineHeight: 1.2 },
  title: { fontSize: 12, color: MUTED, marginTop: 2 },
  contacts: { marginTop: 6, color: MUTED },
  link: { color: INK, textDecoration: 'none' },
  section: { marginTop: 14 },
  heading: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    borderBottomWidth: 0.75,
    borderBottomColor: RULE,
    paddingBottom: 2,
    marginBottom: 6,
  },
  entry: { marginBottom: 8 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  strong: { fontFamily: 'Helvetica-Bold' },
  period: { color: MUTED },
  bullet: { flexDirection: 'row', marginTop: 2 },
  bulletMark: { width: 10 },
  bulletText: { flex: 1 },
  line: { marginTop: 2 },
})

type SectionProps = {
  readonly title: string
  readonly children: ReactNode
}

const Section = ({ title, children }: SectionProps) => (
  <View style={styles.section}>
    <Text style={styles.heading} minPresenceAhead={40}>
      {title}
    </Text>
    {children}
  </View>
)

const Bullet = ({ children }: { readonly children: string }) => (
  <View style={styles.bullet} wrap={false}>
    <Text style={styles.bulletMark}>•</Text>
    <Text style={styles.bulletText}>{children}</Text>
  </View>
)

const Header = ({ cv }: { readonly cv: CvContent }) => (
  <View>
    <Text style={styles.name}>{cv.name}</Text>
    <Text style={styles.title}>{cv.title}</Text>
    <Text style={styles.contacts}>
      {cv.contacts.map((contact, order) => (
        <Text key={contact.href}>
          {`${order > 0 ? '  |  ' : ''}${contact.label}: `}
          <Link src={contact.href} style={styles.link}>
            {contact.value}
          </Link>
        </Text>
      ))}
    </Text>
  </View>
)

const Experience = ({ cv }: { readonly cv: CvContent }) => (
  <Section title={cv.headings.experience}>
    {cv.experience.map((entry) => (
      <View key={entry.company} style={styles.entry}>
        <View style={styles.entryHeader} wrap={false}>
          <Text>
            <Text style={styles.strong}>{entry.position}</Text>
            {` · ${entry.company}`}
          </Text>
          <Text style={styles.period}>{entry.period}</Text>
        </View>
        {entry.highlights.map((highlight) => (
          <Bullet key={highlight}>{highlight}</Bullet>
        ))}
      </View>
    ))}
  </Section>
)

const Skills = ({ cv }: { readonly cv: CvContent }) => (
  <Section title={cv.headings.skills}>
    {cv.skills.map((group) => (
      <Text key={group.category} style={styles.line}>
        <Text style={styles.strong}>{`${group.category}: `}</Text>
        {group.skills.join(', ')}
      </Text>
    ))}
  </Section>
)

const Project = ({ cv }: { readonly cv: CvContent }) => (
  <Section title={cv.headings.project}>
    <View style={styles.entryHeader} wrap={false}>
      <Text style={styles.strong}>{cv.project.name}</Text>
      <Text style={styles.period}>{cv.project.status}</Text>
    </View>
    <Text style={styles.line}>{cv.project.summary.join(' ')}</Text>
    <Text style={styles.line}>
      <Text style={styles.strong}>{`${cv.project.stackLabel}: `}</Text>
      {cv.project.stack.join(', ')}
    </Text>
    <Text style={styles.line}>
      <Text style={styles.strong}>{`${cv.project.urlLabel}: `}</Text>
      <Link src={cv.project.url} style={styles.link}>
        {cv.project.url.replace(/^https:\/\//, '')}
      </Link>
    </Text>
  </Section>
)

const Education = ({ cv }: { readonly cv: CvContent }) => (
  <Section title={cv.headings.education}>
    <View style={styles.entryHeader} wrap={false}>
      <Text style={styles.strong}>{cv.education.degree}</Text>
      <Text style={styles.period}>{cv.education.period}</Text>
    </View>
    <Text>{`${cv.education.institution}, ${cv.education.location}`}</Text>
  </Section>
)

const Languages = ({ cv }: { readonly cv: CvContent }) => (
  <Section title={cv.headings.languages}>
    <Text>{cv.languages.map((entry) => `${entry.name} (${entry.level})`).join(', ')}</Text>
  </Section>
)

const CvDocument = ({ cv }: { readonly cv: CvContent }) => (
  <Document
    title={`${cv.name} – ${cv.title}`}
    author={cv.name}
    subject={cv.title}
    language={cv.language}
  >
    <Page size="A4" style={styles.page}>
      <Header cv={cv} />
      <Section title={cv.headings.summary}>
        <Text>{cv.summary}</Text>
      </Section>
      <Experience cv={cv} />
      <Skills cv={cv} />
      <Project cv={cv} />
      <Education cv={cv} />
      <Languages cv={cv} />
    </Page>
  </Document>
)

const written: string[] = []
for (const language of cvLanguages) {
  const cv = buildCvContent(language, translations[language])
  const file = cvFileName(language)
  const blob = await pdf(<CvDocument cv={cv} />).toBlob()
  await Bun.write(new URL(file, OUTPUT), blob)
  written.push(`${file} ${blob.size} B`)
}

await Bun.write(Bun.stdout, `${written.join('\n')}\n`)
