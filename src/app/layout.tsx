import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mahakal Property — Find Your Space. Own Your Future.',
  description:
    'Premium real estate services in Indore, Madhya Pradesh. Buy, sell, or rent luxury properties with Mahakal Property. Expert agents, AI-powered agreements, and personalized service.',
  keywords: [
    'Mahakal Property',
    'Indore real estate',
    'buy property Indore',
    'sell property Indore',
    'rent property Indore',
    'luxury homes Indore',
    'real estate agent Indore',
  ],
  openGraph: {
    title: 'Mahakal Property — Find Your Space. Own Your Future.',
    description:
      'Premium real estate services in Indore. Buy, sell, or rent luxury properties.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Mahakal Property',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mahakal Property',
    description: 'Premium real estate services in Indore, MP.',
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
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Google Fonts — Bebas Neue (display) + Inter (body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full" suppressHydrationWarning>{children}</body>
    </html>
  )
}
