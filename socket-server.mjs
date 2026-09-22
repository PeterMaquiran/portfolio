import { createServer } from 'node:http'
import next from 'next'
import { Server } from 'socket.io'
import { getDb, saveFcmToken } from './lib/chat-db.mjs'
import { handleChatRequest } from './lib/chat-http.mjs'
import { attachChat } from './lib/chat-io.mjs'

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = Number(process.env.PORT) || 4000

const ROOM_PATTERN = /^[a-z0-9][a-z0-9-]{1,31}$/

function normalizeRoom(raw) {
  const room = String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
  if (!ROOM_PATTERN.test(room)) return null
  return room
}

function normalizeName(raw) {
  const name = String(raw ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 24)
  return name || null
}

const app = next({
  dev,
  hostname,
  port,
  ...(dev ? { webpack: true } : {}),
})
const handler = app.getRequestHandler()

await app.prepare()
const upgradeHandler = app.getUpgradeHandler()

getDb()

const httpServer = createServer((req, res) => {
  if (req.url?.startsWith('/socket.io')) return
  if (req.url?.startsWith('/api/chat')) {
    handleChatRequest(req, res)
    return
  }
  handler(req, res)
})

httpServer.on('upgrade', (req, socket, head) => {
  if (req.url?.startsWith('/socket.io')) return
  upgradeHandler(req, socket, head)
})

const io = new Server(httpServer, {
  cors: { origin: true },
  serveClient: false,
})

async function roomState(room) {
  const sockets = await io.in(room).fetchSockets()
  return {
    room,
    count: sockets.length,
    users: sockets.map((socket) => ({
      id: socket.id,
      name: socket.data.name || `Guest ${socket.id.slice(0, 4)}`,
    })),
  }
}

async function broadcastRoom(room) {
  io.to(room).emit('room:state', await roomState(room))
}

function totalSockets() {
  return io.of('/').sockets.size
}

function broadcastPresence() {
  io.emit('presence:global', { total: totalSockets() })
}

attachChat(io)

io.on('connection', (socket) => {
  socket.data.name = `Guest ${socket.id.slice(0, 4)}`

  socket.emit('session', {
    id: socket.id,
    name: socket.data.name,
    total: totalSockets(),
  })
  broadcastPresence()

  socket.on('presence:get', (ack) => {
    ack?.({ total: totalSockets() })
  })

  socket.on('latency:ping', (_sentAt, ack) => {
    ack?.({ serverAt: Date.now() })
  })

  socket.on('chat:message', (payload, ack) => {
    const rooms = [...socket.rooms].filter((joined) => joined !== socket.id)
    const room = rooms[0]
    if (!room) {
      ack?.({ ok: false, error: 'Join a room first.' })
      return
    }

    const text = String(payload?.text ?? '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 500)

    if (!text) {
      ack?.({ ok: false, error: 'Message cannot be empty.' })
      return
    }

    socket.data.name = normalizeName(payload?.name) ?? socket.data.name

    const message = {
      id: `${Date.now()}-${socket.id}`,
      room,
      text,
      at: Date.now(),
      from: { id: socket.id, name: socket.data.name },
    }

    io.to(room).emit('chat:message', message)
    ack?.({ ok: true })
  })

  socket.on('join-room', async (payload, ack) => {
    const room = normalizeRoom(payload?.room)
    const name = normalizeName(payload?.name) ?? socket.data.name

    if (!room) {
      ack?.({ ok: false, error: 'Use 2–32 letters, numbers, or hyphens.' })
      return
    }

    socket.data.name = name

    const previousRooms = [...socket.rooms].filter((joined) => joined !== socket.id)
    for (const previous of previousRooms) {
      await socket.leave(previous)
      await broadcastRoom(previous)
    }

    await socket.join(room)
    await broadcastRoom(room)
    ack?.({ ok: true, ...(await roomState(room)) })
  })

  socket.on('leave-room', async (ack) => {
    const rooms = [...socket.rooms].filter((joined) => joined !== socket.id)
    for (const room of rooms) {
      await socket.leave(room)
      await broadcastRoom(room)
    }
    ack?.({ ok: true })
  })

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms].filter((joined) => joined !== socket.id)
    socket.once('disconnect', () => {
      for (const room of rooms) void broadcastRoom(room)
      broadcastPresence()
    })
  })

  socket.on('fcm:subscribe', (payload, ack) => {
    const deviceToken = payload?.token

    if (!deviceToken || typeof deviceToken !== 'string') {
      ack?.({ ok: false, error: 'Missing token' })
      return
    }

    saveFcmToken(deviceToken, payload?.visitorId || socket.data.visitorId)
    ack?.({ ok: true, topic: 'all' })
  })
})

httpServer
  .once('error', (err) => {
    console.error(err)
    process.exit(1)
  })
  .listen(port, hostname === 'localhost' ? undefined : hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
