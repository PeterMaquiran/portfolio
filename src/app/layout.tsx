import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Suspense } from 'react'
import { ThemeProvider } from './components/ThemeProvider'
import ChatWidget from './components/ChatWidget'
import './globals.css'

const themeInitScript = `
(function(){
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var theme = dark ? 'dark' : 'light';
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://peter.tvone.ao'),
  title: 'Peter Maquiran — Telecom Systems Engineer',
  description:
    'Private 5G, Open RAN, IP networking, MQTT and CoAP, and software-defined radio. CCNA 200-301.',
  keywords: [
    'Peter Maquiran',
    'Telecommunications',
    '5G NR',
    'Private 5G',
    'Open RAN',
    'Software Defined Radio',
    'CCNA',
    'MQTT',
    'CoAP',
    'Kubernetes',
    'Observability',
    'Prometheus',
    'Grafana',
    'Edge Computing',
  ],
  // Add PNG icons (Favicon & Apple Touch Icon)
  icons: {
    icon: '/peter-portrait.jpg', // Put icon.png inside the public/ folder
    shortcut: '/peter-portrait.jpg',
    apple: '/peter-portrait.jpg', // Optional: separate PNG for iOS home screen
  },
  openGraph: {
    title: 'Peter Maquiran — Telecom Systems Engineer',
    description:
      'Private 5G and Open RAN, built on IP. 5G NR, TCP and UDP, MQTT and CoAP, and software-defined radio.',
    url: 'https://peter.tvone.ao',
    siteName: 'Peter Maquiran',
    locale: 'en_US',
    type: 'website',
    // Add PNG image for OpenGraph social sharing
    images: [
      {
        url: '/peter-portrait.jpg', // Resolves to https://peter.tvone.ao/og-image.png via metadataBase
        width: 1200,
        height: 630,
        alt: 'Peter Maquiran',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peter Maquiran',
    description:
      'Telecom systems: private 5G, Open RAN, IP networking, MQTT, CoAP, and software-defined radio.',
    creator: '@PeterMaquiran',
    // Add PNG image for Twitter card
    images: ['/peter-portrait.jpg'],
  },
  alternates: {
    canonical: 'https://peter.tvone.ao',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased select-none`}>
        <ThemeProvider>
          {children}
          <Suspense fallback={null}>
            <ChatWidget />
          </Suspense>
        </ThemeProvider>
        <Script
          src="https://platform.linkedin.com/badges/js/profile.js"
          async
          defer
          type="text/javascript"
        />
      </body>
    </html>
  )
}
