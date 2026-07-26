'use client'

import { useState, type JSX, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { Server, Layout, Cpu, ArrowUpRight } from 'lucide-react'
import Modal from './Modal'
import type { Dictionary } from '@/lib/getDictionary'

const Monitor = dynamic(() => import('./Monitor'), { ssr: false })
const Phone = dynamic(() => import('./Phone'), { ssr: false })

const projectIcons = [Server, Layout, Cpu]

// —————————————————————————————————————————————
// Previews (add a third factory when ready)
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
      screenSource="/mobile-porfoio.png"
      enableZoom
      enablePan
      cameraStepBack={10}
      targetCameraStepBack={window.innerHeight < 640 ? 7 : window.innerHeight < 880 ? 5.5 : 6.5}
      spin={true}
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

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {projects.map((project, index) => {
            const Icon = projectIcons[index % projectIcons.length]
            const canPreview = index < projectPreviewFactories.length

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
                  className={`group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-border-subtle bg-surface p-6 text-left backdrop-blur-3xl transition-all duration-300 sm:p-10 ${
                    canPreview ? 'cursor-pointer hover:border-border-strong' : 'cursor-default'
                  }`}
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                    style={{ backgroundImage: noiseBg }}
                  />
                  <div className="relative z-10 flex-1 pb-6">
                    <div className="mb-4 flex items-center justify-between">
                      <Icon className="h-6 w-6 text-icon-muted" />
                      <ArrowUpRight
                        className={`h-5 w-5 text-fg-muted transition-colors ${
                          canPreview ? 'group-hover:text-icon-hover' : ''
                        }`}
                      />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-fg">{project.title}</h3>
                    <p className="text-xs leading-relaxed text-fg-secondary">{project.blurb}</p>
                  </div>
                  <div className="relative z-10 mt-auto flex flex-wrap gap-1.5 border-t border-border-subtle pt-6">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-border-subtle bg-surface-chip px-2.5 py-1 text-[10px] text-fg-secondary backdrop-blur-sm"
                      >
                        {tech}
                      </span>
                    ))}
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
