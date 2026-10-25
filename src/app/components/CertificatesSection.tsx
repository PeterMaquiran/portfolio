import Image from 'next/image'
import type { Dictionary } from '@/lib/getDictionary'

type Props = {
  certificates: Dictionary['certificates']
  noiseBg: string
  title: string
  eyebrow: string
}

export default function CertificatesSection({ certificates, noiseBg, title, eyebrow }: Props) {
  return (
    <section id="certificates" className="scroll-mt-36 space-y-8 md:scroll-mt-28">
      <div>
        <p className="mb-2 text-xs font-semibold tracking-widest text-fg-muted uppercase">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">{title}</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {certificates.map((certificate) => (
          <div key={certificate.code} className="relative z-10 flex">
            <div
              className="absolute inset-0 -z-10"
              style={{
                background:
                  'radial-gradient(ellipse 100% 100% at 50% 12%, var(--card-glow) 0%, transparent 55%)',
              }}
            />
            <article
              className="relative w-full overflow-hidden rounded-3xl border border-border-subtle bg-surface md:backdrop-blur-3xl"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div
                className="pointer-events-none absolute inset-0 hidden opacity-20 mix-blend-overlay md:block"
                style={{ backgroundImage: noiseBg }}
              />

              <div className="relative z-10 flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8 md:p-10">
                <Image
                  src={certificate.image}
                  alt={certificate.imageAlt}
                  width={certificate.width}
                  height={certificate.height}
                  className="h-40 w-auto shrink-0 self-center object-contain sm:h-44 sm:self-auto"
                />
                <div className="min-w-0 space-y-3">
                  <h3 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">
                    {certificate.name}
                  </h3>
                  <p className="text-xs font-medium text-fg-secondary">
                    {certificate.issuer}
                    <span className="text-fg-muted"> · {certificate.code}</span>
                  </p>
                  <p className="max-w-2xl text-sm leading-relaxed text-fg-secondary">
                    {certificate.description}
                  </p>
                  <span
                    className="inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold tracking-wide whitespace-nowrap uppercase shadow-inner md:backdrop-blur-md"
                    style={
                      certificate.ongoing
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
                    {certificate.status}
                  </span>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}
