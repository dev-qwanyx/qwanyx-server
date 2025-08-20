import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'QWANYX Studio - Component Lab',
  description: 'Test and document QWANYX components',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Note: html and body tags are REQUIRED by Next.js
  // AppProvider will handle all the global styles
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}