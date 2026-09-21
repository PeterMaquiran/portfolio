'use client'

import dynamic from 'next/dynamic'

const AdminClient = dynamic(() => import('./AdminClient'), {
  ssr: false,
  loading: () => <div className="min-h-screen" style={{ background: 'var(--page-bg)' }} />,
})

export default function AdminView() {
  return <AdminClient />
}
