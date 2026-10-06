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
  device?: string
  os?: string
}

export const VISITOR_ID_KEY = 'portfolio-visitor-id'

export function randomId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

export function getVisitorId() {
  const existing = window.localStorage.getItem(VISITOR_ID_KEY)
  if (existing) return existing
  const id = randomId()
  window.localStorage.setItem(VISITOR_ID_KEY, id)
  return id
}
