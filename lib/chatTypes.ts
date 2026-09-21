export type ChatSender = 'admin' | 'visitor'

export type ChatMessage = {
  id: string
  conversationId: string
  sender: ChatSender
  text: string
  createdAt: number
}

export type ChatIp = {
  ip: string
  country: string
  countryCode: string
  firstSeen: number
  lastSeen: number
}

export type ChatConversation = {
  id: string
  ip: string
  country: string
  countryCode: string
  createdAt: number
  startedAt: number | null
  lastMessageAt: number | null
  pending: number
  ips?: ChatIp[]
}

export const VISITOR_ID_KEY = 'portfolio-visitor-id'

export function getVisitorId() {
  const existing = window.localStorage.getItem(VISITOR_ID_KEY)
  if (existing) return existing
  const id = crypto.randomUUID()
  window.localStorage.setItem(VISITOR_ID_KEY, id)
  return id
}
