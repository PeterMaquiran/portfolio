import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import Header from './components/Header'
import { ObservabilitySection } from './components/ObservabilitySection'
import EarthBackground from './components/EarthBackgroundLazy'
import ProjectsSection from './components/ProjectsSection'
import ExperienceSection from './components/ExperienceSection'
import ContactButton, { LINKEDIN_URL, WHATSAPP_URL } from './components/ContactButton'
import { getDictionary } from '@/lib/getDictionary'

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
    <div
      className="relative min-h-screen overflow-hidden font-sans text-fg antialiased"
      style={{ background: 'var(--page-bg)' }}
    >
      {/* Global Grain Texture Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay"
        style={{ backgroundImage: noiseBg, opacity: 'var(--noise-opacity)' }}
      />

      <Header labels={dict.navBar} />

      <main className="relative z-10 mx-auto max-w-6xl space-y-32 px-6 pt-40 pb-24 md:pt-36">
        {/* HERO SECTION */}
        <section
          id="about"
          className="scroll-mt-36 grid grid-cols-1 items-center gap-12 md:scroll-mt-28 lg:grid-cols-12"
        >
          <div className="space-y-6 lg:col-span-8">
            <h1
              className="bg-clip-text text-4xl leading-[1.05] font-extrabold tracking-tight text-transparent md:text-6xl"
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
          </div>

          {/* Globe Graphic Accent */}
          <div className="relative flex justify-center lg:col-span-4 lg:justify-end">
            <div
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ backgroundColor: 'var(--globe-blur)' }}
            />

            <div className="relative flex items-center justify-center">
              {/* Outer Glow Halo behind the globe */}
              <div
                className="absolute h-72 w-72 rounded-full bg-blue-500/20 blur-3xl sm:h-96 sm:w-96 animate-pulse"
                style={{
                  backgroundColor: 'var(--globe-glow, rgba(59, 130, 246, 0.30))',
                  animationDuration: '3s',
                }}
              />

              {/* Outer Ring / Atmospheric Layer */}
              <div className="relative flex h-70 w-70 items-center justify-center overflow-hidden rounded-full backdrop-blur-3xl sm:h-80 sm:w-80">
                <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light" />
                {/* <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent dark:via-white/[0.03]" /> */}

                {/* Inner Globe Container with dynamic rim glow */}
                <div className="relative z-10 flex h-[14.4rem] w-[14.4rem] items-center justify-center overflow-hidden rounded-full sm:h-60 sm:w-60">
                  <EarthBackground />
                </div>
              </div>
            </div>
          </div>
        </section>

        <ObservabilitySection />

        <ProjectsSection
          projects={dict.projects}
          noiseBg={noiseBg}
          title={dict.sectionsTitle.Projects}
        />

        <ExperienceSection
          experiences={dict.experiences}
          noiseBg={noiseBg}
          title={dict.sectionsTitle.Experience}
          eyebrow={dict.sectionsTitle.ExperienceEyebrow}
        />

        {/* TESTIMONIALS */}
        <section className="space-y-8">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-widest text-fg-muted uppercase">
              Feedback
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
              {dict.sectionsTitle.Testimonials}
            </h2>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
            {dict.testimonials.map((testimonial) => (
              <div key={testimonial.author} className="relative z-10 flex h-full">
                <div
                  className="absolute inset-0 -z-10"
                  style={{
                    background:
                      'radial-gradient(ellipse 100% 100% at 50% 12%, var(--card-glow) 0%, transparent 55%)',
                  }}
                />
                <blockquote
                  className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl border border-border-subtle bg-surface p-6 backdrop-blur-3xl transition-all duration-300 sm:p-10"
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                    style={{ backgroundImage: noiseBg }}
                  />
                  <p className="relative z-10 text-sm leading-relaxed text-fg-secondary italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <footer className="relative z-10 mt-6 border-t border-border-subtle pt-4 text-xs font-medium text-fg-muted">
                    {testimonial.link ? (
                      <a
                        href={testimonial.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-fg"
                      >
                        — {testimonial.author}
                      </a>
                    ) : (
                      <>— {testimonial.author}</>
                    )}
                  </footer>
                </blockquote>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="border-t py-10 text-center text-sm"
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
