import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { ThemeProvider } from './components/ThemeProvider'
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
  title: 'Portfolio | Peter Maquiran — Software Developer',
  description:
    'Software web and mobile developer skilled in Angular, Vue, Flutter, NestJS, Docker, and OpenTelemetry. Explore my portfolio, and self-hosted DevOps projects.',
  keywords: [
    'Peter Maquiran',
    'Full Stack Developer',
    'Software Engineer',
    'Angular Developer',
    'Vue Developer',
    'NestJS',
    'Node.js',
    'Docker',
    'Nginx',
    'OpenTelemetry',
    'Prometheus',
    'Grafana',
    'Next.js Portfolio',
    'Web Developer',
    'Mobile Developer',
    'Ionic',
    'Flutter',
  ],
  // Add PNG icons (Favicon & Apple Touch Icon)
  icons: {
    icon: '/peter.png', // Put icon.png inside the public/ folder
    shortcut: '/peter.png',
    apple: '/peter.png', // Optional: separate PNG for iOS home screen
  },
  openGraph: {
    title: 'Portfolio | Peter Maquiran — Software Developer',
    description:
      'Discover projects, skills, and DevOps expertise from Peter Maquiran — a Software developer passionate about observability and performance.',
    url: 'https://petermaquiran.xyz',
    siteName: 'Peter Maquiran Portfolio',
    locale: 'en_US',
    type: 'website',
    // Add PNG image for OpenGraph social sharing
    images: [
      {
        url: '/peter.png', // Resolves to https://peter.tvone.ao/og-image.png via metadataBase
        width: 1200,
        height: 630,
        alt: 'Peter Maquiran — Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peter Maquiran — Portfolio',
    description:
      'Software web and mobile developer specializing in Angular, Vue, Flutter, Docker, and OpenTelemetry.',
    creator: '@PeterMaquiran',
    // Add PNG image for Twitter card
    images: ['/peter.png'],
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
        <ThemeProvider>{children}</ThemeProvider>
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
