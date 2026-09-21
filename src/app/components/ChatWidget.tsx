'use client'

import { MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { acquireBrowserSocket, releaseBrowserSocket } from '@/lib/browserSocket'
import { saveMessages, visitorChatDb } from '@/lib/chatDexie'
import { getVisitorId, type ChatConversation, type ChatMessage } from '@/lib/chatTypes'

export default function ChatWidget() {
  const pathname = usePathname()
  const hidden = pathname?.startsWith('/admin')

  const [open, setOpen] = useState(false)
  const [visitorId, setVisitorId] = useState<string | null>(null)
  const [conversation, setConversation] = useState<ChatConversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<ReturnType<typeof acquireBrowserSocket> | null>(null)

  const started = Boolean(conversation?.startedAt)

  const persistIncoming = useCallback(async (incoming: ChatMessage[], visitor: string) => {
    const mine = incoming.filter((message) => message.conversationId === visitor)
    if (!mine.length) return
    await saveMessages(visitorChatDb, mine)
    setMessages(
      (current) => {
        const map = new Map(current.map((message) => [message.id, message]))
        for (const message of mine) map.set(message.id, message)
        return [...map.values()].sort((a, b) => a.createdAt - b.createdAt)
      },
    )
  }, [])

  useEffect(() => {
    if (hidden) return
    const id = getVisitorId()
    setVisitorId(id)

    let cancelled = false
    visitorChatDb.messages
      .where('conversationId')
      .equals(id)
      .sortBy('createdAt')
      .then((rows) => {
        if (!cancelled) setMessages(rows)
      })

    const socket = acquireBrowserSocket()
    socketRef.current = socket

    const ackInbox = (inbox: ChatMessage[]) => {
      const ids = inbox.filter((message) => message.sender === 'admin').map((message) => message.id)
      if (ids.length) socket.emit('chat:ack', { ids })
    }

    const hello = () => {
      socket.emit(
        'chat:hello',
        { visitorId: id },
        (response: { ok: boolean; conversation?: ChatConversation; inbox?: ChatMessage[] }) => {
          if (!response?.ok || !response.conversation) return
          setConversation(response.conversation)
          const inbox = response.inbox || []
          void persistIncoming(inbox, id)
          ackInbox(inbox)
        },
      )
    }

    const onMessage = (message: ChatMessage) => {
      void persistIncoming([message], id)
      if (message.sender === 'admin') socket.emit('chat:ack', { ids: [message.id] })
    }

    const onStarted = (next: ChatConversation) => {
      if (next.id === id) setConversation(next)
    }

    if (socket.connected) hello()
    socket.on('connect', hello)
    socket.on('chat:message', onMessage)
    socket.on('chat:started', onStarted)

    return () => {
      cancelled = true
      socket.off('connect', hello)
      socket.off('chat:message', onMessage)
      socket.off('chat:started', onStarted)
      releaseBrowserSocket()
    }
  }, [hidden, persistIncoming])

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = useCallback(() => {
    if (!visitorId || !started) return
    const text = draft.trim()
    if (!text) return
    const socket = socketRef.current
    if (!socket) return
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      conversationId: visitorId,
      sender: 'visitor',
      text,
      createdAt: Date.now(),
    }
    setSending(true)
    setError(null)
    void saveMessages(visitorChatDb, [message])
    setMessages((current) => {
      const map = new Map(current.map((row) => [row.id, row]))
      map.set(message.id, message)
      return [...map.values()].sort((a, b) => a.createdAt - b.createdAt)
    })
    setDraft('')
    socket.emit(
      'chat:send',
      message,
      (response: { ok: boolean; error?: string; duplicate?: boolean }) => {
        setSending(false)
        if (!response?.ok) {
          setError(response?.error || 'Could not send.')
        }
      },
    )
  }, [draft, started, visitorId])

  if (hidden) return null

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3">
      {open ? (
        <div
          className="flex h-[28rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border-subtle bg-surface backdrop-blur-3xl"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="border-b border-border-subtle px-4 py-3">
            <p className="text-sm font-semibold text-fg">Chat</p>
            <p className="text-xs text-fg-muted">
              {started ? 'Messages stay on this device.' : 'Waiting for the host to start this chat.'}
            </p>
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {messages.length === 0 ? (
              <p className="px-1 text-sm text-fg-muted">No messages yet.</p>
            ) : (
              messages.map((message) => {
                const mine = message.sender === 'visitor'
                return (
                  <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                        mine ? 'bg-cta text-cta-fg' : 'bg-surface-chip text-fg'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                )
              })
            )}
            <div ref={endRef} />
          </div>

          {error ? <p className="px-4 pb-1 text-xs text-red-500">{error}</p> : null}

          <form
            className="flex gap-2 border-t border-border-subtle p-3"
            onSubmit={(event) => {
              event.preventDefault()
              send()
            }}
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              disabled={!started}
              maxLength={2000}
              placeholder={started ? 'Write a message' : 'Waiting for host'}
              className="min-w-0 flex-1 rounded-2xl border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-fg outline-none placeholder:text-fg-faint focus:border-border-strong disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!started || sending || !draft.trim()}
              className="rounded-2xl bg-cta px-3 py-2 text-sm font-medium text-cta-fg disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-cta text-cta-fg shadow-lg transition-opacity hover:opacity-90"
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    </div>
  )
}
