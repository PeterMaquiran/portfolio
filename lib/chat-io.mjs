import {
  ackMessages,
  getConversation,
  getSession,
  insertMessage,
  listConversations,
  pendingForAdmin,
  pendingForVisitor,
  publicConversation,
  startConversation,
  upsertConversation,
} from './chat-db.mjs'
import {
  ADMIN_COOKIE,
  clientIp,
  headerCountry,
  isUuid,
  lookupGeo,
  normalizeText,
  parseClientDevice,
  parseCookies,
} from './chat-util.mjs'

function visitorRoom(id) {
  return `chat:${id}`
}

function mapMessage(row) {
  return {
    id: row.id,
    conversationId: row.conversationId,
    sender: row.sender,
    text: row.text,
    createdAt: row.createdAt,
  }
}

export function attachChat(io) {
  io.use((socket, next) => {
    const token = parseCookies(socket.handshake.headers.cookie)[ADMIN_COOKIE]
    socket.data.isAdmin = Boolean(getSession(token))
    next()
  })

  io.on('connection', (socket) => {
    socket.on('chat:hello', async (payload, ack) => {
      const visitorId = payload?.visitorId
      if (!isUuid(visitorId)) {
        ack?.({ ok: false, error: 'Invalid visitor id.' })
        return
      }

      socket.data.visitorId = visitorId
      const ip = clientIp(socket.request)
      const geo = await lookupGeo(ip, headerCountry(socket.request))
      const client = parseClientDevice(payload?.client, socket.request.headers['user-agent'])
      const conversation = publicConversation(
        upsertConversation({
          id: visitorId,
          ip,
          country: geo.country,
          countryCode: geo.countryCode,
          device: client.device,
          os: client.os,
        }),
      )

      await socket.join(visitorRoom(visitorId))
      io.to('chat-admin').emit('chat:conversation', conversation)

      ack?.({
        ok: true,
        conversation,
        inbox: pendingForVisitor(visitorId).map(mapMessage),
      })
    })

    socket.on('chat:admin', (ack) => {
      if (!socket.data.isAdmin) {
        ack?.({ ok: false, error: 'Unauthorized.' })
        return
      }
      socket.join('chat-admin')
      ack?.({
        ok: true,
        conversations: listConversations().map(publicConversation),
        inbox: pendingForAdmin().map(mapMessage),
      })
    })

    socket.on('chat:start', (payload, ack) => {
      if (!socket.data.isAdmin) {
        ack?.({ ok: false, error: 'Unauthorized.' })
        return
      }
      const conversationId = payload?.conversationId
      if (!isUuid(conversationId)) {
        ack?.({ ok: false, error: 'Invalid conversation.' })
        return
      }
      const conversation = publicConversation(startConversation(conversationId))
      if (!conversation) {
        ack?.({ ok: false, error: 'Visitor not found.' })
        return
      }
      io.to(visitorRoom(conversationId)).emit('chat:started', conversation)
      io.to('chat-admin').emit('chat:conversation', conversation)
      ack?.({ ok: true, conversation })
    })

    socket.on('chat:send', (payload, ack) => {
      const id = payload?.id
      const text = normalizeText(payload?.text)
      if (!isUuid(id)) {
        ack?.({ ok: false, error: 'Missing idempotency key.' })
        return
      }
      if (!text) {
        ack?.({ ok: false, error: 'Message cannot be empty.' })
        return
      }

      const asAdmin = Boolean(socket.data.isAdmin)
      const conversationId = asAdmin ? payload?.conversationId : socket.data.visitorId
      if (!isUuid(conversationId)) {
        ack?.({ ok: false, error: 'Unknown conversation.' })
        return
      }

      const conversation = getConversation(conversationId)
      if (!conversation) {
        ack?.({ ok: false, error: 'Conversation not found.' })
        return
      }
      if (!conversation.started_at) {
        ack?.({ ok: false, error: 'Admin has not started this chat yet.' })
        return
      }

      const createdAt = Number(payload?.createdAt) || Date.now()
      const sender = asAdmin ? 'admin' : 'visitor'
      const { duplicate } = insertMessage({
        id,
        conversationId,
        sender,
        text,
        createdAt,
      })

      const message = { id, conversationId, sender, text, createdAt }
      if (!duplicate) {
        io.to(visitorRoom(conversationId)).emit('chat:message', message)
        io.to('chat-admin').emit('chat:message', message)
        io.to('chat-admin').emit(
          'chat:conversation',
          publicConversation(getConversation(conversationId)),
        )
      }

      ack?.({ ok: true, duplicate, message })
    })

    socket.on('chat:ack', (payload, ack) => {
      const ids = Array.isArray(payload?.ids)
        ? payload.ids.filter((id) => isUuid(id)).slice(0, 200)
        : []
      if (!ids.length) {
        ack?.({ ok: true, deleted: 0 })
        return
      }

      if (socket.data.isAdmin) {
        const result = ackMessages({ ids, recipient: 'admin' })
        for (const conversationId of result.conversationIds) {
          const conversation = publicConversation(getConversation(conversationId))
          if (conversation) io.to('chat-admin').emit('chat:conversation', conversation)
        }
        ack?.({ ok: true, deleted: result.deleted })
        return
      }

      const conversationId = socket.data.visitorId
      if (!isUuid(conversationId)) {
        ack?.({ ok: false, error: 'Say hello first.' })
        return
      }
      const result = ackMessages({ ids, recipient: 'visitor', conversationId })
      ack?.({
        ok: true,
        deleted: result.deleted,
      })
    })

    socket.on('chat:pull', (payload, ack) => {
      if (socket.data.isAdmin) {
        const conversationId = isUuid(payload?.conversationId)
          ? payload.conversationId
          : undefined
        ack?.({ ok: true, inbox: pendingForAdmin(conversationId).map(mapMessage) })
        return
      }
      const conversationId = socket.data.visitorId
      if (!isUuid(conversationId)) {
        ack?.({ ok: false, error: 'Say hello first.' })
        return
      }
      ack?.({ ok: true, inbox: pendingForVisitor(conversationId).map(mapMessage) })
    })
  })
}
