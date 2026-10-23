'use client'

import { useState, type JSX, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { ArrowUpRight } from 'lucide-react'
import Modal from './Modal'
import ProjectCardPreview from './ProjectCardPreview'
import type { CardPreview } from './CardPreviewVisual'
import type { Dictionary } from '@/lib/getDictionary'

const Monitor = dynamic(() => import('./Monitor'), { ssr: false })

const projectCardPreviews: Record<string, CardPreview> = {
  grafana: {
    kind: 'desktop',
    primary: '/grafana-monitoring.jpeg',
    alt: 'Grafana monitoring dashboard',
  },
}

// —————————————————————————————————————————————
// Full 3D previews (modal)
// —————————————————————————————————————————————
const projectPreviewFactories: Record<string, () => JSX.Element[]> = {
  grafana: () => [
    <Monitor
      key="monitor"
      screenSource="/grafana-monitoring.jpeg"
      cameraStepBack={window.innerWidth < 640 ? 12 : window.innerWidth < 1024 ? 8 : 6}
    />,
  ],
}

type Tab = { label: string; content: ReactNode }

type Props = {
  projects: Dictionary['projects']
  noiseBg: string
  title: string
  eyebrow: string
  intro?: string
}

function projectUrl(project: Dictionary['projects'][number]) {
  return 'url' in project && typeof project.url === 'string' ? project.url : undefined
}

function projectPreview(project: Dictionary['projects'][number]) {
  return 'preview' in project && typeof project.preview === 'string' ? project.preview : undefined
}

export default function ProjectsSection({ projects, noiseBg, title, eyebrow, intro }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [tabs, setTabs] = useState<Tab[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | undefined>()

  function openPreview(id: string) {
    const factory = projectPreviewFactories[id]
    if (!factory) return

    const previews = factory()
    if (previews.length === 0) return

    setTabs(
      previews.map((content, i) => ({
        label: `Preview ${i + 1}`,
        content,
      })),
    )
    const project = projects.find((item) => projectPreview(item) === id)
    setPreviewUrl(project ? projectUrl(project) : undefined)
    setIsOpen(true)
  }

  return (
    <>
      <section id="projects" className="scroll-mt-36 space-y-8 md:scroll-mt-28">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-widest text-fg-muted uppercase">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">{title}</h2>
          {intro ? (
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-fg-secondary">{intro}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {projects.map((project, index) => {
            const previewId = projectPreview(project)
            const canPreview = Boolean(previewId && projectPreviewFactories[previewId])
            const cardPreview = previewId ? projectCardPreviews[previewId] : undefined
            const externalUrl = projectUrl(project)
            const canOpen = canPreview || Boolean(externalUrl)

            return (
              <div key={project.title} className="relative z-10 flex h-full">
                <div
                  className="absolute inset-0 -z-10"
                  style={{
                    background:
                      'radial-gradient(ellipse 100% 100% at 50% 12%, var(--card-glow) 0%, transparent 55%)',
                  }}
                />
                <article
                  className={`project-card group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-border-subtle bg-surface text-left md:backdrop-blur-3xl transition-all duration-300 ${
                    canOpen ? 'hover:border-border-strong' : ''
                  }`}
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 hidden opacity-20 mix-blend-overlay md:block"
                    style={{ backgroundImage: noiseBg }}
                  />

                  {cardPreview && <ProjectCardPreview preview={cardPreview} index={index} />}

                  <div className="relative z-10 flex flex-1 flex-col p-6 pt-4 sm:p-8 sm:pt-5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span
                          className="mb-2 inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
                          style={
                            project.live
                              ? {
                                  borderColor: 'var(--badge-current-border)',
                                  backgroundColor: 'var(--badge-current-bg)',
                                  color: 'var(--badge-current-fg)',
                                }
                              : {
                                  borderColor: 'var(--badge-next-border)',
                                  backgroundColor: 'var(--badge-next-bg)',
                                  color: 'var(--badge-next-fg)',
                                }
                          }
                        >
                          {project.status}
                        </span>
                        <h3 className="text-xl font-bold text-fg">{project.title}</h3>
                      </div>
                      {canOpen ? (
                        <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-fg-muted transition-colors group-hover:text-icon-hover" />
                      ) : null}
                    </div>
                    <p className="mb-4 text-sm leading-relaxed text-fg-secondary">{project.blurb}</p>
                    <ul className="mb-6 flex-1 list-disc space-y-2 pl-4 text-xs leading-relaxed text-fg-secondary marker:text-fg-faint">
                      {project.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className="mt-auto flex flex-wrap gap-1.5 border-t border-border-subtle pt-5">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-border-subtle bg-surface-chip px-2.5 py-1 text-[10px] text-fg-secondary md:backdrop-blur-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  {canOpen ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (canPreview && previewId) {
                          openPreview(previewId)
                          return
                        }
                        if (externalUrl) {
                          window.open(externalUrl, '_blank', 'noopener,noreferrer')
                        }
                      }}
                      className="absolute inset-0 z-30 cursor-pointer"
                      aria-label={`Open ${project.title}`}
                    />
                  ) : null}
                </article>
              </div>
            )
          })}
        </div>
      </section>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        tabs={tabs}
        href={previewUrl}
      />
    </>
  )
}
