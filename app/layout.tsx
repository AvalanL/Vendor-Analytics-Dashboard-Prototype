import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Karat Vendor Analytics',
  description: 'Advanced vendor analytics and performance insights dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
