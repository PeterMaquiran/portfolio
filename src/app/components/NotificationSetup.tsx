'use client'

import { getToken, onMessage } from 'firebase/messaging'
import { getMessagingInstance } from '@/src/lib/firebase'
import { acquireBrowserSocket, releaseBrowserSocket } from '@/lib/browserSocket'
import { FcmSubscribeAck } from '@/src/type/notirication'
import { getVisitorId } from '@/lib/chatTypes'

const started = { admin: false, visitor: false }
let foregroundBound = false

export async function enablePushNotifications(options?: { asAdmin?: boolean }) {
  if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
    return
  }
  const role = options?.asAdmin ? 'admin' : 'visitor'
  if (started[role]) return
  started[role] = true

  const socket = acquireBrowserSocket()

  try {
    let permission = Notification.permission
    if (permission === 'default') {
      permission = await Notification.requestPermission()
    }
    if (permission !== 'granted') {
      started[role] = false
      releaseBrowserSocket()
      return
    }

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
    })
    await navigator.serviceWorker.ready

    const messaging = await getMessagingInstance()
    if (!messaging) {
      started[role] = false
      releaseBrowserSocket()
      return
    }

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    if (!vapidKey) {
      console.error('Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY')
      started[role] = false
      releaseBrowserSocket()
      return
    }

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    })

    if (!token) {
      started[role] = false
      releaseBrowserSocket()
      return
    }

    const subscribe = () => {
      socket.emit(
        'fcm:subscribe',
        role === 'admin'
          ? { token, role: 'admin' }
          : { token, role: 'visitor', visitorId: getVisitorId() },
        (res: FcmSubscribeAck) => {
        if (!res?.ok) {
          console.error('Failed to subscribe for notifications', res?.error)
        }
      })
    }

    if (socket.connected) subscribe()
    else socket.once('connect', subscribe)

    if (!foregroundBound) {
      foregroundBound = true
      onMessage(messaging, (payload) => {
        const title = payload.notification?.title || 'Peter Maquiran'
        const body = payload.notification?.body || ''
        if (Notification.permission === 'granted') {
          new Notification(title, { body, icon: '/peter.png' })
        }
      })
    }
  } catch (error) {
    console.error('Error setting up notifications:', error)
    started[role] = false
    releaseBrowserSocket()
  }
}

export default function NotificationSetup() {
  return null
}
