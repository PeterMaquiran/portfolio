'use client'

import { useState, type ReactNode } from 'react'
import { MessageCircle } from 'lucide-react'
import Modal from './Modal'

export const LINKEDIN_URL = 'https://www.linkedin.com/in/petermaquiran/'
export const WHATSAPP_URL = 'https://wa.me/244948432650'
export const WHATSAPP_DISPLAY = '+244 948 432 650'

const noiseBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0z" />
    </svg>
  )
}

function ContactPanel() {
  return (
    <div className="relative z-10 mx-4 w-full max-w-md">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 100% 100% at 50% 12%, var(--card-glow) 0%, transparent 55%)',
        }}
      />
      <div
        className="relative overflow-hidden rounded-3xl border border-border-subtle bg-surface p-6 backdrop-blur-3xl sm:p-10"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
          style={{ backgroundImage: noiseBg }}
        />

        <div className="relative z-10">
          <p className="mb-2 text-xs font-semibold tracking-widest text-fg-muted uppercase">
            Contact
          </p>
          <h2 className="mb-8 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            Get in touch
          </h2>

          <div className="flex flex-col gap-3">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-chip px-4 py-4 transition-all duration-300 hover:border-border-strong hover:bg-surface-hover"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface text-icon-muted transition-colors group-hover:text-icon-hover">
                <LinkedinIcon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-fg">LinkedIn</span>
                <span className="block truncate text-xs text-fg-muted">
                  linkedin.com/in/petermaquiran
                </span>
              </span>
            </a>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface-chip px-4 py-4 transition-all duration-300 hover:border-border-strong hover:bg-surface-hover"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface text-icon-muted transition-colors group-hover:text-icon-hover">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-fg">WhatsApp</span>
                <span className="block truncate text-xs text-fg-muted">{WHATSAPP_DISPLAY}</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

type Props = {
  children: ReactNode
  className?: string
}

export default function ContactButton({ children, className }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        tabs={[{ label: 'Contact', content: <ContactPanel /> }]}
      />
    </>
  )
}
