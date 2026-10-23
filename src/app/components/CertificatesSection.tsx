import Image from 'next/image'
import type { Dictionary } from '@/lib/getDictionary'

type Certificate = Dictionary['certificates'][number]

type Props = {
  certificates: Dictionary['certificates']
  noiseBg: string
  title: string
  eyebrow: string
  intro?: string
}

function badgeStyle(certificate: Certificate) {
  const tone = 'tone' in certificate ? certificate.tone : undefined
  if (tone === 'progress') {
    return {
      borderColor: 'var(--badge-current-border)',
      backgroundColor: 'var(--badge-current-bg)',
      color: 'var(--badge-current-fg)',
    }
  }
  if (tone === 'next') {
    return {
      borderColor: 'var(--badge-next-border)',
      backgroundColor: 'var(--badge-next-bg)',
      color: 'var(--badge-next-fg)',
    }
  }
  return {
    borderColor: 'var(--border)',
    backgroundColor: 'var(--surface-chip)',
    color: 'var(--fg-secondary)',
  }
}

export default function CertificatesSection({
  certificates,
  noiseBg,
  title,
  eyebrow,
  intro,
}: Props) {
  return (
    <section id="certificates" className="scroll-mt-36 space-y-8 md:scroll-mt-28">
      <div>
        <p className="mb-2 text-xs font-semibold tracking-widest text-fg-muted uppercase">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">{title}</h2>
        {intro ? (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-fg-secondary">{intro}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {certificates.map((certificate) => (
          <div
            key={certificate.code}
            className={`relative z-10 flex ${'featured' in certificate && certificate.featured ? 'lg:col-span-2' : ''}`}
          >
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

              <div className="relative z-10 flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-7">
                {'image' in certificate && certificate.image ? (
                  <Image
                    src={certificate.image}
                    alt={certificate.imageAlt}
                    width={320}
                    height={320}
                    sizes="(min-width: 640px) 160px, 128px"
                    className={`shrink-0 self-center rounded-2xl bg-white object-contain p-2 ${
                      'featured' in certificate && certificate.featured
                        ? 'h-32 w-32 sm:h-40 sm:w-40'
                        : 'h-28 w-28 sm:h-32 sm:w-32'
                    }`}
                  />
                ) : (
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center self-center rounded-2xl border border-border-subtle bg-surface-chip sm:h-32 sm:w-32 sm:self-auto">
                    <span className="text-sm font-bold tracking-tight text-fg">{certificate.mark}</span>
                  </div>
                )}
                <div className="min-w-0 space-y-3">
                  <span
                    className="inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold tracking-wide whitespace-nowrap uppercase shadow-inner md:backdrop-blur-md"
                    style={badgeStyle(certificate)}
                  >
                    {certificate.status}
                  </span>
                  <h3 className="text-lg font-bold tracking-tight text-fg sm:text-xl">
                    {certificate.name}
                  </h3>
                  <p className="text-xs font-medium text-fg-secondary">
                    {certificate.issuer}
                    <span className="text-fg-muted"> · {certificate.code}</span>
                  </p>
                  <p className="text-sm leading-relaxed text-fg-secondary">{certificate.description}</p>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}
