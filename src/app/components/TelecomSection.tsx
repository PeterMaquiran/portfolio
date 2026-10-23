import type { Dictionary } from '@/lib/getDictionary'

type Props = {
  telecom: Dictionary['telecom']
  noiseBg: string
}

export default function TelecomSection({ telecom, noiseBg }: Props) {
  return (
    <section id="telecom" className="scroll-mt-36 space-y-8 md:scroll-mt-28">
      <div className="max-w-3xl">
        <p className="mb-2 text-xs font-semibold tracking-widest text-fg-muted uppercase">
          {telecom.eyebrow}
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">{telecom.title}</h2>
        <p className="mt-4 text-sm leading-relaxed text-fg-secondary sm:text-base">
          {telecom.description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {telecom.groups.map((group) => (
          <article
            key={group.title}
            className="relative overflow-hidden rounded-3xl border border-border-subtle bg-surface p-6 md:backdrop-blur-3xl"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div
              className="pointer-events-none absolute inset-0 hidden opacity-20 mix-blend-overlay md:block"
              style={{ backgroundImage: noiseBg }}
            />
            <div className="relative z-10">
              <h3 className="text-sm font-bold tracking-tight text-fg">{group.title}</h3>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-xs leading-relaxed text-fg-secondary">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
