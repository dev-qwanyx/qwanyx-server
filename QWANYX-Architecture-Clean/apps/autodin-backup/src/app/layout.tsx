import type { Metadata } from 'next'
import { Providers } from './providers'
import '@qwanyx/ui/dist/ui.css'

export const metadata: Metadata = {
  title: 'Autodin - Pièces Auto Belgique',
  description: 'Trouvez et vendez des pièces auto en Belgique',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Note: html and body tags are REQUIRED by Next.js framework
  // This is the ONLY place where we must use native HTML
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}