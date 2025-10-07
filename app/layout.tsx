import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '1st Asenso Lopez Jaena Pickleball Tournament',
  description: '1st Asenso Lopez Jaena Pickleball Tournament'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Head>
        <meta property="og:image" content="/banner.jpeg" />
        <meta name="twitter:image" content="/banner.jpeg" />
        {/* Add more meta tags as needed */}
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
