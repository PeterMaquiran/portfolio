'use client'

import dynamic from 'next/dynamic'

const PlaygroundClient = dynamic(() => import('./PlaygroundClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen" style={{ background: 'var(--page-bg)' }} />
  ),
})

export default function PlaygroundView() {
  return <PlaygroundClient />
}
