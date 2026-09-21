'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { acquireBrowserSocket, releaseBrowserSocket } from '@/lib/browserSocket'
import ThemeToggle from '../components/ThemeToggle'

type RoomUser = {
  id: string
  name: string
}

type RoomState = {
  room: string
  count: number
  users: RoomUser[]
}

type ChatMessage = {
  id: string
  room: string
  text: string
  at: number
  from: RoomUser
}

type JoinAck =
  | ({ ok: true } & RoomState)
  | { ok: false; error: string }

const SUGGESTED_ROOMS = ['lobby', 'demo', 'workshop'] as const

export default function PlaygroundClient() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [roomInput, setRoomInput] = useState('lobby')
  const [room, setRoom] = useState<RoomState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [joining, setJoining] = useState(false)
  const [totalConnections, setTotalConnections] = useState(0)
  const [latencyMs, setLatencyMs] = useState<number | null>(null)
  const [transport, setTransport] = useState('—')
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sending, setSending] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const next = acquireBrowserSocket()

    const measureLatency = () => {
      const started = performance.now()
      next.emit('latency:ping', Date.now(), () => {
        setLatencyMs(Math.round(performance.now() - started))
      })
    }

    const syncTransport = () => {
      setTransport(next.io.engine.transport.name)
    }

    const onConnect = () => {
      setConnected(true)
      setSessionId(next.id ?? null)
      setError(null)
      syncTransport()
      measureLatency()
      next.emit('presence:get', (payload: { total?: number }) => {
        if (typeof payload?.total === 'number') setTotalConnections(payload.total)
      })
    }

    const onDisconnect = () => {
      setConnected(false)
      setTransport('—')
      setLatencyMs(null)
    }

    const onSession = (payload: { id: string; name: string }) => {
      setSessionId(payload.id)
      setName((current) => current || payload.name)
    }

    const onRoomState = (payload: RoomState) => {
      setRoom(payload)
    }

    const onPresence = (payload: { total: number }) => {
      setTotalConnections(payload.total)
    }

    const onChat = (payload: ChatMessage) => {
      setMessages((current) => [...current.slice(-99), payload])
    }

    const onConnectError = () => {
      setConnected(false)
      setError('Could not reach the Socket.IO server. Run npm run dev (custom server).')
    }

    const onUpgrade = (nextTransport: { name: string }) => {
      setTransport(nextTransport.name)
    }

    next.on('connect', onConnect)
    next.on('disconnect', onDisconnect)
    next.on('session', onSession)
    next.on('room:state', onRoomState)
    next.on('presence:global', onPresence)
    next.on('chat:message', onChat)
    next.on('connect_error', onConnectError)
    next.io.engine.on('upgrade', onUpgrade)

    const pingTimer = window.setInterval(() => {
      if (next.connected) measureLatency()
    }, 2000)

    setSocket(next)

    return () => {
      window.clearInterval(pingTimer)
      next.off('connect', onConnect)
      next.off('disconnect', onDisconnect)
      next.off('session', onSession)
      next.off('room:state', onRoomState)
      next.off('presence:global', onPresence)
      next.off('chat:message', onChat)
      next.off('connect_error', onConnectError)
      next.io.engine.off('upgrade', onUpgrade)
      releaseBrowserSocket()
    }
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const joinRoom = useCallback(
    (targetRoom: string) => {
      if (!socket || !connected) return
      setJoining(true)
      setError(null)
      socket.emit('join-room', { room: targetRoom, name }, (ack: JoinAck) => {
        setJoining(false)
        if (!ack?.ok) {
          setError(ack?.error || 'Could not join that room.')
          return
        }
        setMessages([])
        setRoom({ room: ack.room, count: ack.count, users: ack.users })
      })
    },
    [connected, name, socket],
  )

  const leaveRoom = useCallback(() => {
    if (!socket) return
    socket.emit('leave-room', () => {
      setRoom(null)
      setMessages([])
    })
  }, [socket])

  const sendMessage = useCallback(() => {
    if (!socket || !connected || !room) return
    const text = draft.trim()
    if (!text) return
    setSending(true)
    socket.emit('chat:message', { text, name }, (ack: { ok: boolean; error?: string }) => {
      setSending(false)
      if (!ack?.ok) {
        setError(ack?.error || 'Could not send that message.')
        return
      }
      setDraft('')
    })
  }, [connected, draft, name, room, socket])

  const inRoom = Boolean(room)

  return (
    <div
      className="relative min-h-screen font-sans text-fg antialiased"
      style={{ background: 'var(--page-bg)' }}
    >
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 pt-8">
        <Link href="/" className="text-sm font-medium text-fg-secondary transition-colors hover:text-fg">
          ← Portfolio
        </Link>
        <ThemeToggle className="hover:bg-surface-hover" />
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12">
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-widest text-fg-muted uppercase">Playground</p>
          <h1 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">Socket.IO rooms</h1>
          <p className="max-w-xl text-base leading-relaxed text-fg-secondary">
            Join a room, exchange messages, and watch total sockets plus round-trip latency.
          </p>
        </div>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Status" value={connected ? 'Online' : 'Offline'} />
          <StatCard
            label="Total sockets"
            value={connected ? String(totalConnections) : '—'}
          />
          <StatCard
            label="Latency"
            value={latencyMs == null ? '—' : `${latencyMs} ms`}
            hint={latencyHint(latencyMs)}
          />
          <StatCard label="Transport" value={transport} />
        </section>

        <section
          className="overflow-hidden rounded-3xl border border-border-subtle bg-surface p-6 backdrop-blur-3xl sm:p-8"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <StatusPill connected={connected} />
            {sessionId ? (
              <span className="rounded-full bg-surface-chip px-3 py-1 font-mono text-xs text-fg-muted">
                {sessionId.slice(0, 8)}
              </span>
            ) : null}
          </div>

          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              joinRoom(roomInput)
            }}
          >
            <label className="block space-y-2">
              <span className="text-xs font-medium tracking-wide text-fg-muted uppercase">Display name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={24}
                placeholder="Optional nickname"
                className="w-full rounded-2xl border border-border-subtle bg-surface-elevated px-4 py-3 text-sm text-fg outline-none ring-0 placeholder:text-fg-faint focus:border-border-strong"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-medium tracking-wide text-fg-muted uppercase">Room</span>
              <input
                value={roomInput}
                onChange={(event) => setRoomInput(event.target.value)}
                required
                minLength={2}
                maxLength={32}
                placeholder="lobby"
                className="w-full rounded-2xl border border-border-subtle bg-surface-elevated px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-border-strong"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              {SUGGESTED_ROOMS.map((suggested) => (
                <button
                  key={suggested}
                  type="button"
                  onClick={() => {
                    setRoomInput(suggested)
                    joinRoom(suggested)
                  }}
                  className="rounded-full border border-cta-ghost-border bg-cta-ghost px-3 py-1.5 text-xs font-medium text-cta-ghost-fg transition-colors hover:bg-cta-ghost-hover"
                >
                  {suggested}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={!connected || joining}
                className="rounded-full bg-cta px-5 py-2.5 text-sm font-medium text-cta-fg transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {inRoom ? 'Switch room' : 'Join room'}
              </button>
              {inRoom ? (
                <button
                  type="button"
                  onClick={leaveRoom}
                  className="rounded-full border border-cta-ghost-border bg-cta-ghost px-5 py-2.5 text-sm font-medium text-cta-ghost-fg transition-colors hover:bg-cta-ghost-hover"
                >
                  Leave
                </button>
              ) : null}
            </div>
          </form>

          {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
        </section>

        {room ? (
          <>
            <section
              className="overflow-hidden rounded-3xl border border-border-subtle bg-surface p-6 backdrop-blur-3xl sm:p-8"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div>
                <p className="text-xs font-semibold tracking-widest text-fg-muted uppercase">
                  {room.room}
                </p>
                <p className="mt-1 text-5xl font-bold tracking-tight text-fg">{room.count}</p>
                <p className="mt-1 text-sm text-fg-secondary">in this room</p>
              </div>

              <ul className="mt-8 divide-y divide-border-subtle border-t border-border-subtle">
                {room.users.map((user) => {
                  const isYou = user.id === sessionId
                  return (
                    <li key={user.id} className="flex items-center justify-between py-3 text-sm">
                      <span className="text-fg">
                        {user.name}
                        {isYou ? <span className="ml-2 text-xs text-fg-muted">(you)</span> : null}
                      </span>
                      <span className="font-mono text-xs text-fg-faint">{user.id.slice(0, 8)}</span>
                    </li>
                  )
                })}
              </ul>
            </section>

            <section
              className="flex flex-col overflow-hidden rounded-3xl border border-border-subtle bg-surface backdrop-blur-3xl"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <div className="border-b border-border-subtle px-6 py-4 sm:px-8">
                <p className="text-xs font-semibold tracking-widest text-fg-muted uppercase">
                  Messages
                </p>
                <p className="mt-1 text-sm text-fg-secondary">Everyone in {room.room} sees these.</p>
              </div>

              <div className="max-h-80 space-y-3 overflow-y-auto px-6 py-5 sm:px-8">
                {messages.length === 0 ? (
                  <p className="text-sm text-fg-muted">No messages yet. Say hello.</p>
                ) : (
                  messages.map((message) => {
                    const isYou = message.from.id === sessionId
                    return (
                      <div key={message.id} className={`flex ${isYou ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                            isYou ? 'bg-cta text-cta-fg' : 'bg-surface-chip text-fg'
                          }`}
                        >
                          <p className={`text-[11px] ${isYou ? 'opacity-70' : 'text-fg-muted'}`}>
                            {isYou ? 'You' : message.from.name}
                          </p>
                          <p className="mt-0.5 break-words text-sm leading-relaxed">{message.text}</p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={chatEndRef} />
              </div>

              <form
                className="flex gap-2 border-t border-border-subtle p-4 sm:p-5"
                onSubmit={(event) => {
                  event.preventDefault()
                  sendMessage()
                }}
              >
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  maxLength={500}
                  placeholder="Write a message"
                  className="min-w-0 flex-1 rounded-2xl border border-border-subtle bg-surface-elevated px-4 py-3 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-border-strong"
                />
                <button
                  type="submit"
                  disabled={!connected || sending || !draft.trim()}
                  className="rounded-2xl bg-cta px-4 py-3 text-sm font-medium text-cta-fg transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  Send
                </button>
              </form>
            </section>
          </>
        ) : (
          <p className="text-sm text-fg-muted">Join a room to chat.</p>
        )}
      </main>
    </div>
  )
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div
      className="rounded-2xl border border-border-subtle bg-surface px-4 py-4 backdrop-blur-3xl"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <p className="text-[11px] font-semibold tracking-widest text-fg-muted uppercase">{label}</p>
      <p className="mt-2 text-xl font-semibold tracking-tight text-fg">{value}</p>
      {hint ? <p className="mt-1 text-xs text-fg-muted">{hint}</p> : null}
    </div>
  )
}

function latencyHint(ms: number | null) {
  if (ms == null) return undefined
  if (ms < 40) return 'Very fast'
  if (ms < 100) return 'Good'
  if (ms < 200) return 'Okay'
  return 'Slow'
}

function StatusPill({ connected }: { connected: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-surface-chip px-3 py-1 text-xs font-medium text-fg-secondary">
      <span
        className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-fg-faint'}`}
        aria-hidden
      />
      {connected ? 'Connected' : 'Disconnected'}
    </span>
  )
}
