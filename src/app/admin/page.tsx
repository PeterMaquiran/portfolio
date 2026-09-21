import type { Metadata } from 'next'
import AdminView from './AdminView'

export const metadata: Metadata = {
  title: 'Chat admin | Peter Maquiran',
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return <AdminView />
}
