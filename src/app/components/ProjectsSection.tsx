'use client'

import { useState, type JSX, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import Modal from './Modal'
import type { Dictionary } from '@/lib/getDictionary'

const Monitor = dynamic(() => import('./Monitor'), { ssr: false })
const Phone = dynamic(() => import('./Phone'), { ssr: false })

type PreviewKind = 'desktop' | 'mobile' | 'duo' | 'phones'

type CardPreview = {
  kind: PreviewKind
  primary: string
  secondary?: string
  alt: string
}

const projectCardPreviews: CardPreview[] = [
  {
    kind: 'desktop',
    primary: '/grafana-monitoring.png',
    alt: 'Grafana monitoring dashboard',
  },
  {
    kind: 'mobile',
    primary: '/mobile-porfolio.png',
    alt: 'Portfolio mobile UI',
  },
  {
    kind: 'desktop',
    primary: '/tvone.png',
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
      screenSource="/grafana-monitoring.png"
      cameraStepBack={window.innerWidth < 640 ? 12 : window.innerWidth < 1024 ? 8 : 6}
    />,
  ],
  () => [
    <Phone
      key="phone"
      screenSource="/mobile-porfolio.png"
      enableZoom
      enablePan
      cameraStepBack={10}
      targetCameraStepBack={window.innerHeight < 640 ? 7 : window.innerHeight < 880 ? 5.5 : 6.5}
      spin={true}
    />,
  ],
  () => [
    <Monitor
      key="monitor"
      screenSource="/tvone.png"
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

function CardPreviewVisual({ preview, index }: { preview: CardPreview; index: number }) {
  if (preview.kind === 'desktop') {
    return (
      <div
        className="project-preview relative h-40 overflow-hidden sm:h-44"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div className="absolute inset-x-4 top-5 bottom-0 overflow-hidden rounded-t-xl border border-b-0 border-border-subtle bg-surface-elevated shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
          <div className="flex h-5 items-center gap-1 border-b border-border-subtle px-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-fg-faint/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-fg-faint/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-fg-faint/30" />
          </div>
          <Image
            src={preview.primary}
            alt={preview.alt}
            width={960}
            height={540}
            className="project-preview-media h-[calc(100%-1.25rem)] w-full object-cover object-top"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
          style={{
            background:
              'linear-gradient(to top, color-mix(in srgb, var(--background) 72%, transparent) 0%, transparent 100%)',
          }}
        />
      </div>
    )
  }

  if (preview.kind === 'mobile') {
    return (
      <div
        className="project-preview relative flex h-40 items-end justify-center overflow-hidden sm:h-44"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div className="relative mb-0 h-[9.5rem] w-[4.75rem] overflow-hidden rounded-[1.15rem] border border-border-subtle bg-surface-elevated shadow-[0_16px_40px_rgba(0,0,0,0.22)] sm:h-40 sm:w-20">
          <div className="absolute top-1.5 left-1/2 z-10 h-1 w-8 -translate-x-1/2 rounded-full bg-fg-faint/35" />
          <Image
            src={preview.primary}
            alt={preview.alt}
            width={320}
            height={690}
            className="project-preview-media h-full w-full object-cover object-top"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
          style={{
            background:
              'linear-gradient(to top, color-mix(in srgb, var(--background) 72%, transparent) 0%, transparent 100%)',
          }}
        />
      </div>
    )
  }

  if (preview.kind === 'phones') {
    return (
      <div
        className="project-preview relative flex h-40 items-end justify-center gap-3 overflow-hidden px-4 sm:h-44"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div className="relative mb-1 h-[8.25rem] w-[3.85rem] -rotate-6 overflow-hidden rounded-[1rem] border border-border-subtle bg-surface-elevated shadow-[0_14px_32px_rgba(0,0,0,0.22)] sm:h-36 sm:w-[4.25rem]">
          <div className="absolute top-1 left-1/2 z-10 h-0.5 w-5 -translate-x-1/2 rounded-full bg-fg-faint/35" />
          <Image
            src={preview.primary}
            alt={preview.alt}
            width={280}
            height={600}
            className="project-preview-media h-full w-full object-cover object-top"
          />
        </div>
        {preview.secondary && (
          <div className="relative z-10 mb-0 h-[9rem] w-[4.15rem] rotate-3 overflow-hidden rounded-[1.05rem] border border-border-subtle bg-surface-elevated shadow-[0_16px_36px_rgba(0,0,0,0.28)] sm:h-40 sm:w-[4.6rem]">
            <div className="absolute top-1.5 left-1/2 z-10 h-1 w-7 -translate-x-1/2 rounded-full bg-fg-faint/35" />
            <Image
              src={preview.secondary}
              alt={`${preview.alt} habits`}
              width={280}
              height={600}
              className="project-preview-media h-full w-full object-cover object-top"
            />
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-14"
          style={{
            background:
              'linear-gradient(to top, color-mix(in srgb, var(--background) 72%, transparent) 0%, transparent 100%)',
          }}
        />
      </div>
    )
  }

  // duo: desktop + phone overlap
  return (
    <div
      className="project-preview relative h-40 overflow-hidden sm:h-44"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="absolute inset-x-3 top-6 right-14 bottom-0 overflow-hidden rounded-t-xl border border-b-0 border-border-subtle bg-surface-elevated shadow-[0_12px_36px_rgba(0,0,0,0.16)]">
        <div className="flex h-4 items-center gap-1 border-b border-border-subtle px-2">
          <span className="h-1 w-1 rounded-full bg-fg-faint/50" />
          <span className="h-1 w-1 rounded-full bg-fg-faint/40" />
          <span className="h-1 w-1 rounded-full bg-fg-faint/30" />
        </div>
        <Image
          src={preview.primary}
          alt={preview.alt}
          width={960}
          height={540}
          className="project-preview-media h-[calc(100%-1rem)] w-full object-cover object-top"
        />
      </div>
      {preview.secondary && (
        <div className="absolute right-3 bottom-0 z-10 h-[7.75rem] w-[3.65rem] overflow-hidden rounded-[0.95rem] border border-border-subtle bg-surface-elevated shadow-[0_14px_32px_rgba(0,0,0,0.28)] sm:h-[8.5rem] sm:w-16">
          <div className="absolute top-1 left-1/2 z-10 h-0.5 w-5 -translate-x-1/2 rounded-full bg-fg-faint/35" />
          <Image
            src={preview.secondary}
            alt={`${preview.alt} mobile`}
            width={280}
            height={600}
            className="project-preview-media h-full w-full object-cover object-top"
          />
        </div>
      )}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-14"
        style={{
          background:
              'linear-gradient(to top, color-mix(in srgb, var(--background) 72%, transparent) 0%, transparent 100%)',
        }}
      />
    </div>
  )
}

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
