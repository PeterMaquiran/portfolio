'use client'

import { useState, type JSX, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { ArrowUpRight } from 'lucide-react'
import Modal from './Modal'
import CardPreviewVisual, { type CardPreview } from './CardPreviewVisual'
import type { Dictionary } from '@/lib/getDictionary'

const Monitor = dynamic(() => import('./Monitor'), { ssr: false })
const Phone = dynamic(() => import('./Phone'), { ssr: false })

const projectCardPreviews: CardPreview[] = [
  {
    kind: 'desktop',
    primary: '/grafana-monitoring.png',
    alt: 'Grafana monitoring dashboard',
  },
  {
    kind: 'duo',
    secondary: '/mobile-portfolio.png',
    primary: '/desktop-porfolio.png',
    alt: 'Portfolio mobile UI',
  },
  {
    kind: 'duo',
    primary: '/tvone.png',
    secondary: '/tvone-mobile.png',
    alt: 'TVOne news portal',
  },
  {
    kind: 'duo',
    primary: '/ponto-fresco-desktop.png',
    secondary: '/pontrofrescho-mobile.png',
    alt: 'E-commerce platform UI',
  },
  {
    kind: 'phones',
    primary: '/orga-login.png',
    secondary: '/orga-habit.png',
    alt: 'Holistic Life Organizer app',
  },
]

// —————————————————————————————————————————————
// Full 3D previews (modal)
// —————————————————————————————————————————————
const projectPreviewFactories: Array<() => JSX.Element[]> = [
  () => [
    <Monitor
      key="monitor"
      screenSource="/grafana-monitoring.jpeg"
      cameraStepBack={window.innerWidth < 640 ? 12 : window.innerWidth < 1024 ? 8 : 6}
    />,
  ],
  () => [
    <Phone
      key="phone"
      screenSource="/mobile-portfolio.png"
      enableZoom
      enablePan
      cameraStepBack={10}
      targetCameraStepBack={window.innerHeight < 640 ? 7 : window.innerHeight < 880 ? 5.5 : 6.5}
    />,
    <Monitor
      key="monitor"
      screenSource="/desktop-porfolio.png"
      cameraStepBack={window.innerWidth < 640 ? 12 : window.innerWidth < 1024 ? 8 : 6}
    />,
  ],
  () => [
    <Monitor
      key="monitor"
      screenSource="/tvone.png"
      cameraStepBack={window.innerWidth < 640 ? 12 : window.innerWidth < 1024 ? 8 : 6}
    />,
    <Phone
      key="phone"
      screenSource="/tvone-mobile.png"
      enableZoom
      enablePan
      cameraStepBack={10}
      targetCameraStepBack={window.innerHeight < 640 ? 7 : window.innerHeight < 880 ? 5.5 : 6.5}
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
  () => [
    <Phone
      key="phone"
      screenSource="/orga-login.png"
      enableZoom
      enablePan
      cameraStepBack={10}
      targetCameraStepBack={window.innerHeight < 640 ? 7 : window.innerHeight < 880 ? 5.5 : 6.5}
    />,
    <Phone
      key="phone-habit"
      screenSource="/orga-habit.png"
      enableZoom
      enablePan
      cameraStepBack={10}
      targetCameraStepBack={window.innerHeight < 640 ? 7 : window.innerHeight < 880 ? 5.5 : 6.5}
    />,
  ],
]

type Tab = { label: string; content: ReactNode }

type Props = {
  projects: Dictionary['projects']
  noiseBg: string
  title: string
}

export default function ProjectsSection({ projects, noiseBg, title }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [tabs, setTabs] = useState<Tab[]>([])

  function openPreview(index: number) {
    const factory = projectPreviewFactories[index]
    if (!factory) return

    const previews = factory()
    if (previews.length === 0) return

    setTabs(
      previews.map((content, i) => ({
        label: `Preview ${i + 1}`,
        content,
      })),
    )
    setIsOpen(true)
  }

  return (
    <>
      <section id="projects" className="scroll-mt-36 space-y-8 md:scroll-mt-28">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-widest text-fg-muted uppercase">
            Showcase
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">{title}</h2>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => {
            const canPreview = index < projectPreviewFactories.length
            const cardPreview = projectCardPreviews[index]

            return (
              <div key={project.title} className="relative z-10 flex h-full">
                <div
                  className="absolute inset-0 -z-10"
                  style={{
                    background:
                      'radial-gradient(ellipse 100% 100% at 50% 12%, var(--card-glow) 0%, transparent 55%)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => openPreview(index)}
                  disabled={!canPreview}
                  className={`project-card group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-border-subtle bg-surface text-left backdrop-blur-3xl transition-all duration-300 ${
                    canPreview ? 'cursor-pointer hover:border-border-strong' : 'cursor-default'
                  }`}
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                    style={{ backgroundImage: noiseBg }}
                  />

                  {cardPreview && <CardPreviewVisual preview={cardPreview} index={index} />}

                  <div className="relative z-10 flex flex-1 flex-col p-6 pt-4 sm:p-8 sm:pt-5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-fg">{project.title}</h3>
                      <ArrowUpRight
                        className={`mt-1 h-5 w-5 shrink-0 text-fg-muted transition-colors ${
                          canPreview ? 'group-hover:text-icon-hover' : ''
                        }`}
                      />
                    </div>
                    <p className="mb-6 flex-1 text-xs leading-relaxed text-fg-secondary">
                      {project.blurb}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-1.5 border-t border-border-subtle pt-5">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-border-subtle bg-surface-chip px-2.5 py-1 text-[10px] text-fg-secondary backdrop-blur-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} tabs={tabs} />
    </>
  )
}
