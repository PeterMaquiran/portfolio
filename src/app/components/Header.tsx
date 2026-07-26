'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import ContactButton from './ContactButton'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
] as const

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300"
      style={{
        backgroundColor: scrolled ? 'var(--header-bg-scrolled)' : 'var(--header-bg)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'var(--border-strong)' : 'var(--header-border)'}`,
      }}
    >
      <div className="mx-auto flex h-12 max-w-[1140px] items-center justify-between px-5 sm:px-6">
        <Link
          href="#about"
          className="shrink-0 text-[15px] font-semibold tracking-tight text-fg transition-opacity hover:opacity-80"
        >
          Peter Maquiran
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[12px] font-normal tracking-[-0.01em] text-fg/80 transition-colors hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle className="hover:bg-surface-hover" />
          <ContactButton className="rounded-full bg-cta px-3.5 py-1.5 text-[12px] font-medium tracking-[-0.01em] text-cta-fg transition-opacity hover:opacity-90">
            Contact
          </ContactButton>
        </div>
      </div>

      {/* Mobile nav — Apple-like secondary row */}
      <nav
        className="flex items-center justify-center gap-5 border-t border-border-subtle px-4 py-2.5 md:hidden"
        aria-label="Mobile"
        style={{ backgroundColor: 'var(--header-mobile)' }}
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-[11px] font-normal text-fg/75 transition-colors hover:text-fg"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
