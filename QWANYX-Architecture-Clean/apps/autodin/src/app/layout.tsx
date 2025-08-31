import type { Metadata } from 'next'
import { Providers } from './providers'
// CSS import temporarily removed due to Next.js parsing issue
// import '../styles/globals.css'

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
    <html lang="fr" style={{
      '--primary': '230, 126, 34',
      '--secondary': '52, 73, 94',
      '--accent': '243, 156, 18',
      '--success': '39, 174, 96',
      '--warning': '241, 196, 15',
      '--error': '231, 76, 60',
      '--info': '52, 152, 219',
      '--background': '249, 250, 251',
      '--foreground': '44, 62, 80',
      '--card': '255, 255, 255',
      '--qwanyx-card': '255, 200, 200',
      '--card-foreground': '44, 62, 80',
      '--border': '229, 231, 235',
      '--input': '255, 255, 255',
      '--ring': '230, 126, 34',
      '--text': '44, 62, 80',
      '--text-primary': '44, 62, 80',
      '--text-secondary': '71, 85, 105',
      '--text-muted': '148, 163, 184'
    } as React.CSSProperties}>
      <head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Filled:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
        <style dangerouslySetInnerHTML={{ __html: `
          * {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
          }
          
          html, body {
            max-width: 100vw;
            overflow-x: hidden;
            background-color: rgb(var(--background, 249, 250, 251));
            color: rgb(var(--text, 44, 62, 80));
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          
          a {
            color: inherit;
            text-decoration: none;
          }
        `}} />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}