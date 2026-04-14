import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Spectrum of Strength Run 2026 | Villa Kathreyna',
  description:
    'Register for the Spectrum of Strength Run 2026 at Villa Kathreyna Event Place & Resort. Join us on June 21, 2026 in San Fernando, Camarines Sur. Choose from 3km, 5km, or 10km categories.',
  keywords: [
    'fun run',
    'race registration',
    'Villa Kathreyna',
    'San Fernando',
    'Camarines Sur',
    '10K',
    '5K',
    '3K',
  ],
  generator: 'v0.app',
  openGraph: {
    title: 'Spectrum of Strength Run 2026',
    description: 'Register for the Spectrum of Strength Fun Run',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased bg-background">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
