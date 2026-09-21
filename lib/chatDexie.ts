import Dexie, { type EntityTable } from 'dexie'
import type { ChatConversation, ChatMessage } from './chatTypes'

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
  await db.conversations.put(row)
}
