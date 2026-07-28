import Image from 'next/image'

export type PreviewKind = 'desktop' | 'mobile' | 'duo' | 'phones'

export type CardPreview = {
  kind: PreviewKind
  primary: string
  secondary?: string
  alt: string
}

export default function CardPreviewVisual({
  preview,
  index,
  variant = 'card',
}: {
  preview: CardPreview
  index: number
  /** `aside` fills a side panel (taller, vertically centered on md+) */
  variant?: 'card' | 'aside'
}) {
  const isAside = variant === 'aside'
  // Height for aside is controlled by `.experience-card-media .project-preview` in globals.css
  const frameHeight = isAside ? 'overflow-hidden' : 'h-40 overflow-hidden sm:h-44'

  if (preview.kind === 'desktop') {
    return (
      <div
        className={`project-preview relative ${frameHeight}`}
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
        className={`project-preview relative flex justify-center overflow-hidden ${frameHeight} ${
          isAside ? 'project-preview--center items-end' : 'items-end'
        }`}
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div
          className={`relative mb-0 overflow-hidden rounded-[1.15rem] border border-border-subtle bg-surface-elevated shadow-[0_16px_40px_rgba(0,0,0,0.22)] ${
            isAside
              ? 'h-[9.5rem] w-[4.75rem] sm:h-44 sm:w-[5.25rem] md:h-[16rem] md:w-[7.5rem] md:rounded-[1.35rem] lg:h-[18rem] lg:w-[8.5rem]'
              : 'h-[9.5rem] w-[4.75rem] sm:h-40 sm:w-20'
          }`}
        >
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
        className={`project-preview relative flex justify-center overflow-hidden px-3 ${frameHeight} ${
          isAside
            ? 'project-preview--center items-end gap-3 sm:gap-4 md:gap-5'
            : 'items-end gap-3 px-4'
        }`}
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div
          className={`relative -rotate-6 overflow-hidden rounded-[1rem] border border-border-subtle bg-surface-elevated shadow-[0_14px_32px_rgba(0,0,0,0.22)] ${
            isAside
              ? 'mb-1 h-[8.25rem] w-[3.85rem] sm:h-40 sm:w-[4.6rem] md:mb-0 md:h-[15.5rem] md:w-[7.25rem] md:rounded-[1.25rem] lg:h-[17.5rem] lg:w-[8.25rem]'
              : 'mb-1 h-[8.25rem] w-[3.85rem] sm:h-36 sm:w-[4.25rem]'
          }`}
        >
          <div
            className={`absolute left-1/2 z-10 -translate-x-1/2 rounded-full bg-fg-faint/35 ${
              isAside
                ? 'top-1 h-0.5 w-5 md:top-1.5 md:h-1 md:w-8'
                : 'top-1 h-0.5 w-5'
            }`}
          />
          <Image
            src={preview.primary}
            alt={preview.alt}
            width={280}
            height={600}
            className="project-preview-media h-full w-full object-cover object-top"
          />
        </div>
        {preview.secondary && (
          <div
            className={`relative z-10 rotate-3 overflow-hidden rounded-[1.05rem] border border-border-subtle bg-surface-elevated shadow-[0_16px_36px_rgba(0,0,0,0.28)] ${
              isAside
                ? 'mb-0 h-[9rem] w-[4.15rem] sm:h-44 sm:w-[5rem] md:h-[17rem] md:w-[7.75rem] md:rounded-[1.35rem] lg:h-[19rem] lg:w-[8.75rem]'
                : 'mb-0 h-[9rem] w-[4.15rem] sm:h-40 sm:w-[4.6rem]'
            }`}
          >
            <div
              className={`absolute left-1/2 z-10 -translate-x-1/2 rounded-full bg-fg-faint/35 ${
                isAside
                  ? 'top-1.5 h-1 w-7 md:top-2 md:h-1.5 md:w-9'
                  : 'top-1.5 h-1 w-7'
              }`}
            />
            <Image
              src={preview.secondary}
              alt={`${preview.alt} secondary`}
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
      className={`project-preview relative ${frameHeight}`}
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
