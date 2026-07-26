'use client'

import { ReactNode, useEffect, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'

interface Tab {
  label: string
  content: ReactNode
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  tabs: Tab[]
  background?: string
}

const OVERLAY_STYLE: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 2147483646,
  width: '100vw',
  height: '100dvh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'auto',
  background: 'var(--overlay)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
}

export default function Modal({ isOpen, onClose, tabs, background }: ModalProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = prevOverflow
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) setActiveTab(0)
  }, [isOpen])

  if (!mounted || !isOpen || tabs.length === 0) return null

  const hasMultipleTabs = tabs.length > 1

  return createPortal(
    <div
      style={{
        ...OVERLAY_STYLE,
        ...(background ? { background } : null),
      }}
      role="dialog"
      aria-modal="true"
    >
      {hasMultipleTabs && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2147483647,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 12,
            padding: '8px 16px',
          }}
        >
          {tabs.map((tab, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveTab(i)}
              className="cursor-pointer rounded-full px-4 py-2 text-sm font-medium backdrop-blur-md transition-all duration-300"
              style={{
                background:
                  activeTab === i ? 'var(--modal-tab-active)' : 'var(--modal-tab-idle)',
                color: activeTab === i ? 'var(--cta-fg)' : 'var(--modal-tab-idle-fg)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          onClose()
          setActiveTab(0)
        }}
        style={{
          position: 'fixed',
          top: 16,
          right: 24,
          zIndex: 2147483647,
          color: 'var(--modal-close)',
          fontSize: 24,
          fontWeight: 700,
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          lineHeight: 1,
        }}
        aria-label="Close"
      >
        ×
      </button>

      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {tabs[activeTab]?.content}
      </div>
    </div>,
    document.body,
  )
}
