'use client'

import dynamic from 'next/dynamic'

const EarthBackground = dynamic(() => import('./EarthBackground').then((m) => m.default), {
  ssr: false,
})

export default function EarthBackgroundLazy() {
  return <EarthBackground />
}
