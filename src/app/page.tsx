import { MessageCircle } from 'lucide-react'
import Header from './components/Header'
import ProjectsSection from './components/ProjectsSection'
import TelecomSection from './components/TelecomSection'
import CertificatesSection from './components/CertificatesSection'
import { LINKEDIN_URL, WHATSAPP_URL } from './components/ContactButton'
import { getDictionary } from '@/lib/getDictionary'
import Image from 'next/image'

function Github({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.82.58A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function Linkedin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z" />
    </svg>
  )
}

export default async function Home() {
  const dict = await getDictionary()

  // SVG Grain/Noise overlay encoded as a subtle data URL
  const noiseBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`

  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-fg antialiased">
      <div aria-hidden className="page-backdrop pointer-events-none fixed inset-0 z-0" />
      {/* Grain is a full-viewport blend. That forces a repaint on every scroll frame on phones. */}
      <div
        className="pointer-events-none fixed inset-0 z-50 hidden mix-blend-overlay md:block"
        style={{ backgroundImage: noiseBg, opacity: 'var(--noise-opacity)' }}
      />

      <Header labels={dict.navBar} />

      <main className="relative z-10 mx-auto max-w-6xl space-y-32 px-6 pt-40 pb-24 md:pt-36">
        {/* HERO SECTION */}
        <section
          id="about"
          className="scroll-mt-36 grid grid-cols-1 items-center gap-12 md:scroll-mt-28 lg:grid-cols-12"
        >
          <div className="space-y-6 lg:col-span-7">
            <h1
              className="bg-clip-text text-4xl sm:text-6xl  leading-[1.05] font-extrabold tracking-tight text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(to bottom, var(--hero-from), var(--hero-via), var(--hero-to))',
              }}
            >
              {dict.hero.name} <br />
              {dict.hero.tagline}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed font-normal text-fg-secondary sm:text-xl">
              {dict.hero.description}
            </p>
            <ul className="flex max-w-2xl flex-wrap gap-2">
              {dict.hero.focus.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border-subtle bg-surface-chip px-3 py-1 text-[11px] font-medium text-fg-secondary"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex justify-center lg:col-span-5 lg:justify-end">
            <div
              className="relative w-64 overflow-hidden rounded-[2rem] border border-border-subtle sm:w-72 lg:w-[23rem]"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <Image
                src="/peter-portrait.jpg"
                alt="Peter Maquiran"
                width={960}
                height={1024}
                priority
                sizes="(min-width: 1024px) 368px, (min-width: 640px) 288px, 256px"
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>

        <TelecomSection telecom={dict.telecom} noiseBg={noiseBg} />

        <ProjectsSection
          projects={dict.projects}
          noiseBg={noiseBg}
          title={dict.sectionsTitle.Projects}
          eyebrow={dict.sectionsTitle.ProjectsEyebrow}
          intro={dict.sectionsTitle.ProjectsIntro}
        />

        <CertificatesSection
          certificates={dict.certificates}
          noiseBg={noiseBg}
          title={dict.sectionsTitle.Certificates}
          eyebrow={dict.sectionsTitle.CertificatesEyebrow}
          intro={dict.sectionsTitle.CertificatesIntro}
        />
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 border-t py-10 text-center text-sm"
        style={{ color: 'var(--footer-fg)', borderColor: 'var(--footer-border)' }}
      >
        <div className="mb-2 flex justify-center gap-4 [&_a]:transition-opacity hover:[&_a]:opacity-70">
          <a href="https://github.com/PeterMaquiran">
            <Github className="h-5 w-5" />
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-5 w-5" />
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
        © {new Date().getFullYear()} Peter Maquiran
      </footer>
    </div>
  )
}
