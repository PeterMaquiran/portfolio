import { listVisitorTokens } from './chat-db.mjs'
import { NotificationClient } from './notification-client.mjs'

const ADMIN_TOPIC = 'portfolio-admin'
const siteUrl = (process.env.SITE_URL || 'https://peter.tvone.ao').replace(/\/$/, '')
const image = `${siteUrl}/peter.png`

const notifications = new NotificationClient(process.env.NOTIFICATION_API_URL)

export { ADMIN_TOPIC }

export async function subscribeAdminToken(token) {
  return notifications.subscribeToTopic({
    token,
    topic: ADMIN_TOPIC,
  })
}

function preview(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 140)
}

export async function notifyAdminsOfVisitorMessage(conversation, text) {
  const where = [conversation.country, conversation.ip].filter(Boolean).join(' · ')
  await notifications.broadcastNotification({
    title: where ? `Chat · ${where}` : 'New chat message',
    body: preview(text) || 'New message',
    image,
    url: `${siteUrl}/admin`,
    topic: ADMIN_TOPIC,
  })
}

export async function notifyVisitorIfInactive(io, conversationId, text) {
  const sockets = await io.in(`chat:${conversationId}`).fetchSockets()
  const pageActive = sockets.some((socket) => socket.data.pageActive)
  if (pageActive) return

  const tokens = listVisitorTokens(conversationId)
  await Promise.all(
    tokens.map((token) =>
      notifications.sendNotification({
        token,
        title: 'Peter Maquiran',
        body: preview(text) || 'New message',
        image,
        url: `${siteUrl}/`,
      }),
    ),
  )
}
