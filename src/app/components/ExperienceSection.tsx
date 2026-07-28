'use client'

import { useState, type JSX, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { ArrowUpRight } from 'lucide-react'
import Modal from './Modal'
import CardPreviewVisual, { type CardPreview } from './CardPreviewVisual'
import type { Dictionary } from '@/lib/getDictionary'

const Monitor = dynamic(() => import('./Monitor'), { ssr: false })
const Phone = dynamic(() => import('./Phone'), { ssr: false })

// Card thumbnails (list order: Equilibrium, Powercon, Multiperfil, Theus)
const experienceCardPreviews: (CardPreview | null)[] = [
  {
    kind: 'phones',
    primary: '/digipay-home.png',
    secondary: '/digipay.png',
    alt: 'Digipay fintech app',
  },
  {
    kind: 'desktop',
    primary: '/zipkin.png',
    alt: 'Zipkin distributed tracing',
  },
  {
    kind: 'desktop',
    primary: '/prescricao.jpg',
    alt: 'Prescription documents system',
  },
  {
    kind: 'duo',
    primary: '/ponto-fresco-desktop.png',
    secondary: '/pontrofrescho-mobile.png',
    alt: 'Ponto Fresco e-commerce',
  },
]

// Full 3D previews (modal) — same order as the list
const experiencePreviewFactories: Array<() => JSX.Element[]> = [
  () => [
    <Phone
      key="phone-home"
      screenSource="/digipay-home.png"
      enableZoom
      enablePan
      cameraStepBack={10}
      targetCameraStepBack={window.innerHeight < 640 ? 7 : window.innerHeight < 880 ? 5.5 : 6.5}
    />,
    <Phone
      key="phone"
      screenSource="/digipay.png"
      enableZoom
      enablePan
      cameraStepBack={10}
      targetCameraStepBack={window.innerHeight < 640 ? 7 : window.innerHeight < 880 ? 5.5 : 6.5}
    />,
  ],
  () => [
    <Monitor
      key="monitor"
      screenSource="/zipkin.png"
      cameraStepBack={window.innerWidth < 640 ? 12 : window.innerWidth < 1024 ? 8 : 6}
    />,
  ],
  () => [
    <Monitor
      key="monitor"
      screenSource="/prescricao.jpg"
      cameraStepBack={window.innerWidth < 640 ? 12 : window.innerWidth < 1024 ? 8 : 6}
    />,
  ],
  () => [
    <Phone
      key="phone"
      screenSource="/pontrofrescho-mobile.png"
      enableZoom
      enablePan
      cameraStepBack={10}
      targetCameraStepBack={window.innerHeight < 640 ? 7 : window.innerHeight < 880 ? 5.5 : 6.5}
    />,
    <Monitor
      key="monitor"
      screenSource="/ponto-fresco-desktop.png"
      cameraStepBack={window.innerWidth < 640 ? 12 : window.innerWidth < 1024 ? 8 : 6}
    />,
  ],
]

function previewLabel(el: JSX.Element, index: number): string {
  const key = el.key
  if (key === 'phone-home') return 'Home'
  if (key === 'phone') return 'Mobile'
  if (key === 'monitor') return 'Desktop'
  return `Preview ${index + 1}`
}

type Tab = { label: string; content: ReactNode }

type Props = {
  experiences: Dictionary['experiences']
  noiseBg: string
  title: string
  eyebrow: string
}

export default function ExperienceSection({ experiences, noiseBg, title, eyebrow }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [tabs, setTabs] = useState<Tab[]>([])

  function openPreview(index: number) {
    const factory = experiencePreviewFactories[index]
    if (!factory) return

    const previews = factory()
    if (previews.length === 0) return

    setTabs(
      previews.map((content, i) => ({
        label: previewLabel(content, i),
        content,
      })),
    )
    setIsOpen(true)
  }

  return (
    <>
      <section id="experience" className="scroll-mt-36 space-y-8 md:scroll-mt-28">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-widest text-fg-muted uppercase">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">{title}</h2>
        </div>

        <div className="flex flex-col gap-6">
          {experiences.map((experience, index) => {
            const canPreview = index < experiencePreviewFactories.length
            const cardPreview = experienceCardPreviews[index]

            return (
              <div
                key={`${experience.company}-${experience.period}`}
                className="relative z-10 flex"
              >
                <div
                  className="absolute inset-0 -z-10"
                  style={{
                    background:
                      'radial-gradient(ellipse 100% 100% at 50% 12%, var(--card-glow) 0%, transparent 55%)',
                  }}
                />
                <div
                  className={`project-card group relative w-full overflow-hidden rounded-3xl border border-border-subtle bg-surface text-left backdrop-blur-3xl transition-all duration-300 ${
                    canPreview ? 'hover:border-border-strong' : ''
                  }`}
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                    style={{ backgroundImage: noiseBg }}
                  />

                  <div
                    className={
                      cardPreview ? 'experience-card-layout relative z-10' : 'relative z-10'
                    }
                  >
                    {cardPreview && (
                      <div className="experience-card-media relative">
                        {canPreview && (
                          <ArrowUpRight className="pointer-events-none absolute top-4 right-4 z-20 h-5 w-5 text-fg-muted transition-colors group-hover:text-icon-hover" />
                        )}
                        <CardPreviewVisual preview={cardPreview} index={index} variant="aside" />
                      </div>
                    )}

                    <div className="experience-card-body flex min-w-0 flex-col space-y-6 p-6 sm:p-8 md:p-10">
                      <div className="flex flex-col justify-between gap-3 align-baseline sm:flex-row sm:items-start">
                        <div>
                          <h3 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">
                            {experience.role}
                          </h3>
                          <p className="text-xs font-medium text-fg-secondary">
                            {experience.company}
                          </p>
                        </div>
                        <span
                          className="self-start rounded-full border px-3 py-1 text-[10px] font-semibold shadow-inner backdrop-blur-md sm:self-auto"
                          style={
                            experience.current
                              ? {
                                  borderColor: 'var(--badge-current-border)',
                                  backgroundColor: 'var(--badge-current-bg)',
                                  color: 'var(--badge-current-fg)',
                                }
                              : {
                                  borderColor: 'var(--border)',
                                  backgroundColor: 'var(--surface-chip)',
                                  color: 'var(--fg-secondary)',
                                }
                          }
                        >
                          {experience.period}
                        </span>
                      </div>

                      <ul className="list-outside list-disc space-y-3 pl-4 text-lx leading-relaxed text-fg-secondary marker:text-fg-faint">
                        {experience.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {canPreview && (
                    <button
                      type="button"
                      onClick={() => openPreview(index)}
                      className="absolute inset-0 z-30 cursor-pointer"
                      aria-label={`Open preview for ${experience.company}`}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} tabs={tabs} />
    </>
  )
}
