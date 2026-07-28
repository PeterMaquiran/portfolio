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
  /** `aside` sits beside experience text */
  variant?: 'card' | 'aside'
}) {
  const isAside = variant === 'aside'

  if (preview.kind === 'desktop') {
    return (
      <div
        className={`project-preview relative overflow-hidden ${isAside ? 'p-4 md:p-5' : 'px-4 pt-5'}`}
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div
          className={`overflow-hidden rounded-t-xl border border-b-0 border-border-subtle bg-surface-elevated shadow-[0_12px_40px_rgba(0,0,0,0.18)] ${
            isAside ? '' : 'flex h-full flex-col'
          }`}
        >
          <div className="flex h-5 shrink-0 items-center gap-1 border-b border-border-subtle px-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-fg-faint/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-fg-faint/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-fg-faint/30" />
          </div>
          <Image
            src={preview.primary}
            alt={preview.alt}
            width={960}
            height={540}
            className={`project-preview-media w-full object-cover object-top ${
              isAside ? '' : 'min-h-0 flex-1'
            }`}
          />
        </div>
        {!isAside && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
            style={{
              background:
                'linear-gradient(to top, color-mix(in srgb, var(--background) 72%, transparent) 0%, transparent 100%)',
            }}
          />
        )}
      </div>
    )
  }

  if (preview.kind === 'mobile') {
    return (
      <div
        className={`project-preview relative flex justify-center overflow-hidden ${
          isAside ? 'project-preview--center items-center p-4 md:p-6' : 'items-end px-4 pt-4'
        }`}
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div
          className={`relative overflow-hidden rounded-[1.15rem] border border-border-subtle bg-surface-elevated shadow-[0_16px_40px_rgba(0,0,0,0.22)] ${
            isAside ? 'w-[42%] max-w-[9rem] md:w-[48%] md:max-w-[11rem]' : 'w-[4.75rem] sm:w-20'
          }`}
        >
          <div className="absolute top-1.5 left-1/2 z-10 h-1 w-8 -translate-x-1/2 rounded-full bg-fg-faint/35" />
          <Image
            src={preview.primary}
            alt={preview.alt}
            width={320}
            height={690}
            className="project-preview-media h-auto w-full object-cover object-top"
          />
        </div>
        {!isAside && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
            style={{
              background:
                'linear-gradient(to top, color-mix(in srgb, var(--background) 72%, transparent) 0%, transparent 100%)',
            }}
          />
        )}
      </div>
    )
  }

  if (preview.kind === 'phones') {
    return (
      <div
        className={`project-preview relative flex justify-center overflow-hidden ${
          isAside
            ? 'project-preview--center items-center gap-3 p-4 sm:gap-4 md:gap-5 md:p-6'
            : 'items-end gap-3 px-4 pt-4'
        }`}
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div
          className={`relative -rotate-6 overflow-hidden rounded-[1rem] border border-border-subtle bg-surface-elevated shadow-[0_14px_32px_rgba(0,0,0,0.22)] ${
            isAside
              ? 'w-[38%] max-w-[8.5rem] md:rounded-[1.25rem] md:max-w-[10rem]'
              : 'w-[3.85rem] sm:w-[4.25rem]'
          }`}
        >
          <div className="absolute top-1 left-1/2 z-10 h-0.5 w-5 -translate-x-1/2 rounded-full bg-fg-faint/35 md:top-1.5 md:h-1 md:w-8" />
          <Image
            src={preview.primary}
            alt={preview.alt}
            width={280}
            height={600}
            className="project-preview-media h-auto w-full object-cover object-top"
          />
        </div>
        {preview.secondary && (
          <div
            className={`relative z-10 rotate-3 overflow-hidden rounded-[1.05rem] border border-border-subtle bg-surface-elevated shadow-[0_16px_36px_rgba(0,0,0,0.28)] ${
              isAside
                ? 'w-[42%] max-w-[9.5rem] md:rounded-[1.35rem] md:max-w-[11rem]'
                : 'w-[4.15rem] sm:w-[4.6rem]'
            }`}
          >
            <div className="absolute top-1.5 left-1/2 z-10 h-1 w-7 -translate-x-1/2 rounded-full bg-fg-faint/35 md:top-2 md:h-1.5 md:w-9" />
            <Image
              src={preview.secondary}
              alt={`${preview.alt} secondary`}
              width={280}
              height={600}
              className="project-preview-media h-auto w-full object-cover object-top"
            />
          </div>
        )}
        {!isAside && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-14"
            style={{
              background:
                'linear-gradient(to top, color-mix(in srgb, var(--background) 72%, transparent) 0%, transparent 100%)',
            }}
          />
        )}
      </div>
    )
  }

  // duo: desktop + phone overlap
  return (
    <div
      className={`project-preview relative overflow-hidden ${isAside ? 'p-4 md:p-5' : 'px-3 pt-6'}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={`relative ${isAside ? '' : 'pr-14'}`}>
        <div className="overflow-hidden rounded-t-xl border border-b-0 border-border-subtle bg-surface-elevated shadow-[0_12px_36px_rgba(0,0,0,0.16)]">
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
            className="project-preview-media w-full object-cover object-top"
          />
        </div>
        {preview.secondary && (
          <div
            className={`absolute z-10 overflow-hidden rounded-[0.95rem] border border-border-subtle bg-surface-elevated shadow-[0_14px_32px_rgba(0,0,0,0.28)] ${
              isAside
                ? 'right-2 bottom-2 w-[28%] max-w-[5.5rem]'
                : 'right-0 bottom-0 w-16 sm:w-[4.25rem]'
            }`}
          >
            <div className="absolute top-1 left-1/2 z-10 h-0.5 w-5 -translate-x-1/2 rounded-full bg-fg-faint/35" />
            <Image
              src={preview.secondary}
              alt={`${preview.alt} mobile`}
              width={280}
              height={600}
              className="project-preview-media h-auto w-full object-cover object-top"
            />
          </div>
        )}
      </div>
      {!isAside && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-14"
          style={{
            background:
              'linear-gradient(to top, color-mix(in srgb, var(--background) 72%, transparent) 0%, transparent 100%)',
          }}
        />
      )}
    </div>
  )
}
