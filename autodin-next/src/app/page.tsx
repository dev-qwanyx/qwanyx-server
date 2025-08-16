import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export default function AutodinHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-autodin-primary">Autodin</h1>
              <div className="hidden md:flex space-x-6">
                <Link href="#" className="text-gray-600 hover:text-autodin-primary transition">
                  Accueil
                </Link>
                <Link href="#services" className="text-gray-600 hover:text-autodin-primary transition">
                  Services
                </Link>
                <Link href="#contact" className="text-gray-600 hover:text-autodin-primary transition">
                  Contact
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" color="primary">
                  Connexion
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="solid" color="primary">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 text-autodin-secondary">
            Votre marketplace de pièces automobiles
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Trouvez rapidement les pièces détachées dont vous avez besoin parmi des milliers de références disponibles
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" color="primary">
              Rechercher une pièce
            </Button>
            <Button size="lg" variant="outline" color="primary">
              Devenir vendeur
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-autodin-secondary">
            Nos Services
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card shadow="lg" padding="lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-autodin-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl">🔍</span>
                </div>
                <h4 className="text-xl font-bold mb-2">Recherche avancée</h4>
                <p className="text-gray-600">
                  Trouvez exactement la pièce qu'il vous faut grâce à notre moteur de recherche intelligent
                </p>
              </div>
            </Card>
            
            <Card shadow="lg" padding="lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-autodin-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl">✅</span>
                </div>
                <h4 className="text-xl font-bold mb-2">Pièces vérifiées</h4>
                <p className="text-gray-600">
                  Toutes nos pièces sont contrôlées et garanties pour votre tranquillité
                </p>
              </div>
            </Card>
            
            <Card shadow="lg" padding="lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-autodin-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl">🚚</span>
                </div>
                <h4 className="text-xl font-bold mb-2">Livraison rapide</h4>
                <p className="text-gray-600">
                  Recevez vos pièces en 24-48h partout en Belgique
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-autodin-secondary text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Autodin. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
