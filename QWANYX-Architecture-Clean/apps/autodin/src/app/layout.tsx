import type { Metadata } from 'next'
import { Providers } from './providers'
// Import QWANYX UI base styles with theme variables
import '@qwanyx/ui/dist/index.css'
// Import app-specific theme overrides
import '../styles/globals.css'

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
      <head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Filled:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}