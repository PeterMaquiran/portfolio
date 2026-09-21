'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import type { Socket } from 'socket.io-client'
import { adminChatDb, saveConversation, saveMessages } from '@/lib/chatDexie'
import { acquireBrowserSocket, releaseBrowserSocket } from '@/lib/browserSocket'
import type { ChatConversation, ChatMessage } from '@/lib/chatTypes'
import ThemeToggle from '../components/ThemeToggle'

type MeResponse = { ok: boolean }

export default function AdminClient() {
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const activeIdRef = useRef<string | null>(null)
  activeIdRef.current = activeId

  const active = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId) || null,
    [activeId, conversations],
  )

  const upsertConversation = useCallback((next: ChatConversation) => {
    void saveConversation(adminChatDb, next)
    setConversations((current) => {
      const map = new Map(current.map((conversation) => [conversation.id, conversation]))
      const prev = map.get(next.id)
      map.set(next.id, {
        ...prev,
        ...next,
        ip: next.ip || prev?.ip || '',
        country: next.country || prev?.country || 'Unknown',
        countryCode: next.countryCode || prev?.countryCode || '',
      })
      return [...map.values()].sort(
        (a, b) => (b.lastMessageAt || b.createdAt) - (a.lastMessageAt || a.createdAt),
      )
    })
  }, [])

  const persistIncoming = useCallback(async (incoming: ChatMessage[]) => {
    if (!incoming.length) return
    await saveMessages(adminChatDb, incoming)
    const openId = activeIdRef.current
    setMessages((current) => {
      const scoped = openId ? incoming.filter((message) => message.conversationId === openId) : []
      if (!scoped.length) return current
      const map = new Map(current.map((message) => [message.id, message]))
      for (const message of scoped) map.set(message.id, message)
      return [...map.values()].sort((a, b) => a.createdAt - b.createdAt)
    })
    for (const message of incoming) {
      const conversation = await adminChatDb.conversations.get(message.conversationId)
      await saveConversation(adminChatDb, {
        id: message.conversationId,
        ip: conversation?.ip || '',
        country: conversation?.country || 'Unknown',
        countryCode: conversation?.countryCode || '',
        createdAt: conversation?.createdAt || message.createdAt,
        startedAt: conversation?.startedAt || message.createdAt,
        lastMessageAt: message.createdAt,
      })
    }
  }, [])

  useEffect(() => {
    fetch('/api/chat/me')
      .then((response) => response.json() as Promise<MeResponse>)
      .then((body) => {
        setAuthed(Boolean(body.ok))
        setReady(true)
      })
      .catch(() => setReady(true))
  }, [])

  useEffect(() => {
    if (!authed) return

    const next = acquireBrowserSocket()
    setSocket(next)

    const ackVisitorMail = (inbox: ChatMessage[]) => {
      const ids = inbox
        .filter((message) => message.sender === 'visitor')
        .map((message) => message.id)
      if (ids.length) next.emit('chat:ack', { ids })
    }

    const subscribe = () => {
      next.emit(
        'chat:admin',
        (response: { ok: boolean; conversations?: ChatConversation[]; inbox?: ChatMessage[] }) => {
          if (!response?.ok) {
            setError(response ? 'Could not load chats.' : 'Unauthorized.')
            return
          }
          const rows = response.conversations || []
          setConversations(rows)
          for (const row of rows) void saveConversation(adminChatDb, row)
          const inbox = response.inbox || []
          void persistIncoming(inbox)
          ackVisitorMail(inbox)
        },
      )
    }

    const onConversation = (conversation: ChatConversation) => {
      upsertConversation(conversation)
    }

    const onMessage = (message: ChatMessage) => {
      void persistIncoming([message])
      if (message.sender === 'visitor') next.emit('chat:ack', { ids: [message.id] })
    }

    if (next.connected) subscribe()
    next.on('connect', subscribe)
    next.on('chat:conversation', onConversation)
    next.on('chat:message', onMessage)

    adminChatDb.conversations.toArray().then((rows) => {
      if (rows.length) {
        setConversations((current) => (current.length ? current : (rows as ChatConversation[])))
      }
    })

    return () => {
      next.off('connect', subscribe)
      next.off('chat:conversation', onConversation)
      next.off('chat:message', onMessage)
      releaseBrowserSocket()
    }
  }, [authed, persistIncoming, upsertConversation])

  useEffect(() => {
    if (!activeId) {
      setMessages([])
      return
    }
    adminChatDb.messages
      .where('conversationId')
      .equals(activeId)
      .sortBy('createdAt')
      .then(setMessages)
  }, [activeId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const login = async (event: FormEvent) => {
    event.preventDefault()
    setLoginError(null)
    const response = await fetch('/api/chat/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const body = (await response.json()) as { ok: boolean; error?: string }
    if (!body.ok) {
      setLoginError(body.error || 'Login failed.')
      return
    }
    setAuthed(true)
  }

  const logout = async () => {
    await fetch('/api/chat/logout', { method: 'POST' })
    setAuthed(false)
    setActiveId(null)
  }

  const startChat = () => {
    if (!socket || !activeId) return
    socket.emit(
      'chat:start',
      { conversationId: activeId },
      (response: { ok: boolean; conversation?: ChatConversation; error?: string }) => {
        if (!response?.ok) {
          setError(response?.error || 'Could not start chat.')
          return
        }
        if (response.conversation) upsertConversation(response.conversation)
      },
    )
  }

  const send = () => {
    if (!socket || !active?.startedAt) return
    const text = draft.trim()
    if (!text) return
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      conversationId: active.id,
      sender: 'admin',
      text,
      createdAt: Date.now(),
    }
    setSending(true)
    void saveMessages(adminChatDb, [message])
    setMessages((current) => {
      const map = new Map(current.map((row) => [row.id, row]))
      map.set(message.id, message)
      return [...map.values()].sort((a, b) => a.createdAt - b.createdAt)
    })
    setDraft('')
    socket.emit('chat:send', message, (response: { ok: boolean; error?: string }) => {
      setSending(false)
      if (!response?.ok) setError(response?.error || 'Could not send.')
    })
  }

  if (!ready) {
    return <div className="min-h-screen" style={{ background: 'var(--page-bg)' }} />
  }

  if (!authed) {
    return (
      <div
        className="min-h-screen px-6 py-16 font-sans text-fg"
        style={{ background: 'var(--page-bg)' }}
      >
        <form
          onSubmit={login}
          className="mx-auto w-full max-w-sm space-y-4 rounded-3xl border border-border-subtle bg-surface p-6"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <h1 className="text-xl font-bold">Admin chat</h1>
          <p className="text-sm text-fg-muted">Default login is stored in SQLite: admin / admin.</p>
          <label className="block space-y-1 text-sm">
            <span className="text-fg-muted">Username</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-2xl border border-border-subtle bg-surface-elevated px-3 py-2 outline-none"
              autoComplete="username"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-fg-muted">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-border-subtle bg-surface-elevated px-3 py-2 outline-none"
              autoComplete="current-password"
            />
          </label>
          {loginError ? <p className="text-sm text-red-500">{loginError}</p> : null}
          <button
            type="submit"
            className="w-full rounded-full bg-cta py-2.5 text-sm font-medium text-cta-fg"
          >
            Sign in
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen font-sans text-fg" style={{ background: 'var(--page-bg)' }}>
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 pt-8">
        <Link href="/" className="text-sm text-fg-secondary hover:text-fg">
          ← Portfolio
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle className="hover:bg-surface-hover" />
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-cta-ghost-border bg-cta-ghost px-3 py-1.5 text-xs text-cta-ghost-fg"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-5xl gap-4 px-6 py-8 md:grid-cols-[18rem_minmax(0,1fr)]">
        <section
          className="overflow-hidden rounded-3xl border border-border-subtle bg-surface"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="border-b border-border-subtle px-4 py-3">
            <p className="text-xs font-semibold tracking-widest text-fg-muted uppercase">
              Conversations
            </p>
          </div>
          <ul className="divide-y divide-border-subtle">
            {conversations.length === 0 ? (
              <li className="px-4 py-6 text-sm text-fg-muted">No visitors yet.</li>
            ) : (
              conversations.map((conversation) => (
                <li key={conversation.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(conversation.id)}
                    className={`flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left ${
                      conversation.id === activeId ? 'bg-surface-hover' : ''
                    }`}
                  >
                    <span className="text-sm font-medium text-fg">
                      {conversation.country || 'Unknown'}
                    </span>
                    <span className="font-mono text-xs text-fg-muted">
                      {conversation.ip || '—'}
                    </span>
                    <span className="text-[11px] text-fg-faint">
                      {conversation.startedAt ? 'Open' : 'Not started'}
                      {conversation.pending ? ` · ${conversation.pending} waiting` : ''}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>

        <section
          className="flex min-h-[28rem] flex-col overflow-hidden rounded-3xl border border-border-subtle bg-surface"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          {!active ? (
            <p className="m-auto px-6 text-sm text-fg-muted">
              Select a visitor to start or continue a chat.
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-fg">{active.country || 'Unknown'}</p>
                  <p className="font-mono text-xs text-fg-muted">{active.ip || '—'}</p>
                </div>
                {!active.startedAt ? (
                  <button
                    type="button"
                    onClick={startChat}
                    className="rounded-full bg-cta px-4 py-2 text-sm font-medium text-cta-fg"
                  >
                    Start conversation
                  </button>
                ) : null}
              </div>

              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-4">
                {messages.map((message) => {
                  const mine = message.sender === 'admin'
                  return (
                    <div
                      key={message.id}
                      className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                          mine ? 'bg-cta text-cta-fg' : 'bg-surface-chip text-fg'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  )
                })}
                <div ref={endRef} />
              </div>

              {error ? <p className="px-5 text-xs text-red-500">{error}</p> : null}

              <form
                className="flex gap-2 border-t border-border-subtle p-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  send()
                }}
              >
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  disabled={!active.startedAt}
                  placeholder={
                    active.startedAt ? 'Write a message' : 'Start the conversation first'
                  }
                  className="min-w-0 flex-1 rounded-2xl border border-border-subtle bg-surface-elevated px-4 py-3 text-sm outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!active.startedAt || sending || !draft.trim()}
                  className="rounded-2xl bg-cta px-4 py-3 text-sm font-medium text-cta-fg disabled:opacity-40"
                >
                  Send
                </button>
              </form>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
