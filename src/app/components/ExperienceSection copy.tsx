'use client'

import { useState, type JSX, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import Modal from './Modal'
import type { Dictionary } from '@/lib/getDictionary'

const Monitor = dynamic(() => import('./Monitor'), { ssr: false })
const Phone = dynamic(() => import('./Phone'), { ssr: false })

// —————————————————————————————————————————————
// Previews (built oldest→newest, then reversed to match list order)
// —————————————————————————————————————————————
function experiencePreviews(): (JSX.Element | null)[][] {
  return [
    [
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
    [
      <Monitor
        key="monitor"
        screenSource="/prescricao.jpg"
        cameraStepBack={window.innerWidth < 640 ? 12 : window.innerWidth < 1024 ? 8 : 6}
      />,
    ],
    [],
    [
      <Phone
        key="phone"
        screenSource="/digipay.png"
        enableZoom
        enablePan
        cameraStepBack={10}
        targetCameraStepBack={window.innerHeight < 640 ? 7 : window.innerHeight < 880 ? 5.5 : 6.5}
      />,
    ],
  ].reverse()
}

function previewLabel(el: JSX.Element, index: number): string {
  const key = el.key
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
  // Availability without calling window during render
  const previewAvailable = [true, false, true, true] // after reverse: digipay, empty, prescricão, ponto fresco

  function openPreview(index: number) {
    const previews = (experiencePreviews()[index] ?? []).filter(
      (el): el is JSX.Element => el != null,
    )
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
      <section
        id="experience"
        className="relative scroll-mt-36 space-y-8 overflow-hidden rounded-3xl py-6 sm:py-10 md:scroll-mt-28"
      >
        <div className="relative z-10 space-y-1">
          <p className="text-xs font-semibold tracking-widest text-fg-muted uppercase">{eyebrow}</p>
          <h2
            className="bg-clip-text text-3xl leading-tight font-extrabold tracking-tight text-transparent sm:text-4xl"
            style={{
              backgroundImage:
                'linear-gradient(to right, var(--hero-from), var(--hero-via), var(--hero-to))',
            }}
          >
            {title}
          </h2>
        </div>

        <div className="relative z-10">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(ellipse 100% 100% at 50% 12%, var(--card-glow) 0%, transparent 55%)',
            }}
          />
          <div
            className="relative space-y-12 overflow-hidden rounded-3xl border border-border-subtle bg-surface p-6 backdrop-blur-3xl transition-all duration-300 sm:p-10"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
              style={{ backgroundImage: noiseBg }}
            />

            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-black/[0.03] to-transparent opacity-40 dark:via-white/[0.03]" />
            </div>

            {experiences.map((experience, index) => {
              const canPreview = previewAvailable[index] ?? false

              return (
                <div
                  key={`${experience.company}-${experience.period}`}
                  role={canPreview ? 'button' : undefined}
                  tabIndex={canPreview ? 0 : undefined}
                  onClick={() => canPreview && openPreview(index)}
                  onKeyDown={(e) => {
                    if (!canPreview) return
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openPreview(index)
                    }
                  }}
                  className={`group relative z-10 w-full space-y-6 border-l border-border-subtle pl-8 text-left transition-colors duration-300 ${
                    canPreview ? 'cursor-pointer hover:border-border-strong' : 'cursor-default'
                  }`}
                >
                  <div
                    className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: 'var(--timeline-dot-bg)',
                      borderColor: 'var(--timeline-dot-border)',
                      color: 'var(--timeline-dot-fg)',
                    }}
                  >
                    <span className="text-xs font-bold"></span>
                  </div>

                  <div className="flex flex-col justify-between gap-3 align-baseline sm:flex-row sm:items-start">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">
                        {experience.role}
                      </h3>
                      <p className="text-xs font-medium text-fg-secondary">{experience.company}</p>
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

                  <ul className="relative z-10 list-outside list-disc space-y-3 pl-4 text-lx leading-relaxed text-fg-secondary marker:text-fg-faint">
                    {experience.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} tabs={tabs} />
    </>
  )
}
