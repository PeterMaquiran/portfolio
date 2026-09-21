'use client'

import { io, type Socket } from 'socket.io-client'

let socket: Socket | null = null
let users = 0

export function acquireBrowserSocket(): Socket {
  if (!socket) {
    socket = io({
      path: '/socket.io',
      autoConnect: true,
      closeOnBeforeunload: true,
    })
  } else if (!socket.connected && !socket.active) {
    socket.connect()
  }

  users += 1
  return socket
}

export function releaseBrowserSocket() {
  users = Math.max(0, users - 1)
  if (users > 0 || !socket) return
  socket.disconnect()
  socket = null
}
