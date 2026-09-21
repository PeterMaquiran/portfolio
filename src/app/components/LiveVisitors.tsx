'use client'

import { useEffect, useState } from 'react'
import { acquireBrowserSocket, releaseBrowserSocket } from '@/lib/browserSocket'
import type { Dictionary } from '@/lib/getDictionary'

type Presence = {
  total: number
}

type Props = {
  labels: Dictionary['liveVisitors']
}

export default function LiveVisitors({ labels }: Props) {
  const [count, setCount] = useState<number | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const socket = acquireBrowserSocket()

    const applyPresence = (payload: Presence) => {
      if (typeof payload?.total === 'number') setCount(payload.total)
    }

    const onConnect = () => {
      setConnected(true)
      socket.emit('presence:get', applyPresence)
    }

    const onDisconnect = () => {
      setConnected(false)
    }

    if (socket.connected) onConnect()

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('presence:global', applyPresence)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('presence:global', applyPresence)
      releaseBrowserSocket()
    }
  }, [])

  const label =
    count == null
      ? labels.checking
      : count === 1
        ? labels.one
        : labels.many.replace('{count}', String(count))

  return (
    <p className="inline-flex items-center gap-2 text-sm text-fg-muted">
      <span
        className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-fg-faint'}`}
        aria-hidden
      />
      <span>{label}</span>
    </p>
  )
}
