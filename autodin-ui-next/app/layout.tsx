import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Autodin - Marketplace de pièces détachées automobiles",
  description: "La marketplace de référence pour l'achat et la vente de pièces détachées automobiles en Belgique",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  )
}
