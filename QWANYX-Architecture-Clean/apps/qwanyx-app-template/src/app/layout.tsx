import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@qwanyx/ui/dist/ui.css'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QWANYX App',
  description: 'Built with QWANYX UI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}