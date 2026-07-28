import Image from 'next/image'
import type { CardPreview } from './CardPreviewVisual'

function Fade({ tall }: { tall?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 ${tall ? 'h-16' : 'h-14'}`}
      style={{
        background:
          'linear-gradient(to top, color-mix(in srgb, var(--background) 30%, transparent) 0%, transparent 100%)',
      }}
    />
  )
}

export default function ProjectCardPreview({
  preview,
  index,
}: {
  preview: CardPreview
  index: number
}) {
  if (preview.kind === 'desktop') {
    return (
      <div
        className="project-preview relative h-48 shrink-0 overflow-hidden px-4 pt-5 sm:h-52"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-t-xl border border-b-0 border-border-subtle bg-surface-elevated shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
          <div className="flex h-5 shrink-0 items-center gap-1 border-b border-border-subtle px-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-fg-faint/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-fg-faint/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-fg-faint/30" />
          </div>
          <div className="relative min-h-0 flex-1">
            <Image
              src={preview.primary}
              alt={preview.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="project-preview-media object-cover object-top"
            />
          </div>
        </div>
        <Fade tall />
      </div>
    )
  }

  if (preview.kind === 'mobile') {
    return (
      <div
        className="project-preview relative flex h-48 shrink-0 items-end justify-center overflow-hidden px-4 pt-4 sm:h-52"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div className="relative h-[92%] w-[4.75rem] overflow-hidden rounded-[1.15rem] border border-border-subtle bg-surface-elevated shadow-[0_16px_40px_rgba(0,0,0,0.22)] sm:w-20">
          <div className="absolute top-1.5 left-1/2 z-10 h-1 w-8 -translate-x-1/2 rounded-full bg-fg-faint/35" />
          <Image
            src={preview.primary}
            alt={preview.alt}
            fill
            sizes="80px"
            className="project-preview-media object-cover object-top"
          />
        </div>
        <Fade />
      </div>
    )
  }

  if (preview.kind === 'phones') {
    return (
      <div
        className="project-preview relative flex h-48 shrink-0 items-end justify-center gap-3 overflow-hidden px-4 pt-4 sm:h-52"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div className="relative h-[86%] md:h-[75%] w-[3.85rem] -rotate-6 overflow-hidden rounded-[1rem] border border-border-subtle bg-surface-elevated shadow-[0_14px_32px_rgba(0,0,0,0.22)] sm:w-[4.25rem]">
          <div className="absolute top-1 left-1/2 z-10 h-0.5 w-5 -translate-x-1/2 rounded-full bg-fg-faint/35 sm:top-1.5 sm:h-1 sm:w-8" />
          <Image
            src={preview.primary}
            alt={preview.alt}
            fill
            sizes="68px"
            className="project-preview-media object-cover object-top"
          />
        </div>
        {preview.secondary && (
          <div className="relative z-10 h-[86%] md:h-[75%] w-[4.15rem] rotate-3 overflow-hidden rounded-[1.05rem] border border-border-subtle bg-surface-elevated shadow-[0_16px_36px_rgba(0,0,0,0.28)] sm:w-[4.6rem]">
            <div className="absolute top-1.5 left-1/2 z-10 h-1 w-7 -translate-x-1/2 rounded-full bg-fg-faint/35 sm:top-2 sm:h-1.5 sm:w-9" />
            <Image
              src={preview.secondary}
              alt={`${preview.alt} secondary`}
              fill
              sizes="74px"
              className="object-cover"
            />
          </div>
        )}
        <Fade />
      </div>
    )
  }

  // duo: desktop + phone overlap
  return (
    <div
      className="project-preview relative h-48 shrink-0 overflow-hidden px-3 pt-6 sm:h-52"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative h-full pr-14">
        <div className="flex h-full flex-col overflow-hidden rounded-t-xl border border-b-0 border-border-subtle bg-surface-elevated shadow-[0_12px_36px_rgba(0,0,0,0.16)]">
          <div className="flex h-4 shrink-0 items-center gap-1 border-b border-border-subtle px-2">
            <span className="h-1 w-1 rounded-full bg-fg-faint/50" />
            <span className="h-1 w-1 rounded-full bg-fg-faint/40" />
            <span className="h-1 w-1 rounded-full bg-fg-faint/30" />
          </div>
          <div className="relative min-h-0 flex-1">
            <Image
              src={preview.primary}
              alt={preview.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="project-preview-media object-cover object-top"
            />
          </div>
        </div>
        {preview.secondary && (
          <div className="absolute right-0 bottom-0 z-10 h-[78%] w-16 overflow-hidden rounded-[0.95rem] border border-border-subtle bg-surface-elevated shadow-[0_14px_32px_rgba(0,0,0,0.28)] sm:w-[4.25rem]">
            <div className="absolute top-1 left-1/2 z-10 h-0.5 w-5 -translate-x-1/2 rounded-full bg-fg-faint/35" />
            <Image
              src={preview.secondary}
              alt={`${preview.alt} mobile`}
              fill
              sizes="68px"
              className="project-preview-media object-cover object-top"
            />
          </div>
        )}
      </div>
      <Fade />
    </div>
  )
}
