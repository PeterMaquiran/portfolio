import type { Metadata } from 'next'
import PlaygroundView from './PlaygroundView'

export const metadata: Metadata = {
  title: 'Socket.IO Playground | Peter Maquiran',
  description: 'Join a room and see how many users are connected in real time.',
  robots: { index: false, follow: false },
}

export default function PlaygroundPage() {
  return <PlaygroundView />
}
