import Dexie, { type EntityTable } from 'dexie'
import type { ChatConversation, ChatIp, ChatMessage } from './chatTypes'

export type LocalConversation = Omit<ChatConversation, 'pending'> & {
  pending?: number
}

function createChatDb(name: string) {
  const db = new Dexie(name) as Dexie & {
    conversations: EntityTable<LocalConversation, 'id'>
    messages: EntityTable<ChatMessage, 'id'>
  }

  db.version(1).stores({
    conversations: 'id, lastMessageAt, startedAt',
    messages: 'id, conversationId, createdAt, [conversationId+createdAt]',
  })

  return db
}

export const visitorChatDb = createChatDb('portfolio-chat-visitor')
export const adminChatDb = createChatDb('portfolio-chat-admin')

export async function saveMessages(
  db: ReturnType<typeof createChatDb>,
  messages: ChatMessage[],
) {
  if (!messages.length) return
  await db.messages.bulkPut(messages)
}

export async function saveConversation(
  db: ReturnType<typeof createChatDb>,
  conversation: ChatConversation | LocalConversation,
) {
  const { pending: _pending, ...row } = conversation
  const existing = await db.conversations.get(conversation.id)
  await db.conversations.put({
    ...existing,
    ...row,
    ips: mergeIps(existing?.ips, conversation.ips),
  })
}

export function mergeIps(...lists: Array<ChatIp[] | undefined>) {
  const map = new Map<string, ChatIp>()
  for (const list of lists) {
    for (const entry of list || []) {
      if (!entry?.ip) continue
      const prev = map.get(entry.ip)
      map.set(entry.ip, {
        ...prev,
        ...entry,
        firstSeen: Math.min(prev?.firstSeen || entry.firstSeen, entry.firstSeen),
        lastSeen: Math.max(prev?.lastSeen || 0, entry.lastSeen || 0),
      })
    }
  }
  return [...map.values()].sort((a, b) => b.lastSeen - a.lastSeen)
}
