// Autodin Configuration
export const config = {
  siteName: 'Autodin',
  siteTagline: 'La marketplace de référence pour l\'achat et la vente de pièces détachées automobiles',
  siteDescription: 'Trouvez rapidement la pièce qu\'il vous faut ou vendez vos pièces à des milliers d\'acheteurs.',
  
  contact: {
    address: 'Boulevard Anspach 111, 1000 Bruxelles',
    phone: '+32 2 xxx xx xx',
    email: 'info@belgicomics.be'
  },
  
  services: [
    {
      icon: 'fa-search',
      title: 'Recherche rapide',
      description: 'Trouvez instantanément parmi plus de 50 000 pièces disponibles en stock.',
      link: '/mon-autodin/recherche'
    },
    {
      icon: 'fa-comments',
      title: 'Faire une demande',
      description: 'Diffusez facilement vos besoins spécifiques. Notre réseau vous répond rapidement.',
      link: '/mon-autodin/nouvelle-demande'
    },
    {
      icon: 'fa-car',
      title: 'Proposer un véhicule',
      description: 'Valorisez vos véhicules endommagés ou destinés aux pièces auprès d\'acheteurs qualifiés.',
      link: '/mon-autodin/nouvelle-annonce?type=vehicule'
    },
    {
      icon: 'fa-tags',
      title: 'Véhicules d\'occasion',
      description: 'Découvrez notre sélection de véhicules d\'occasion vérifiés par des vendeurs de confiance.',
      link: '/mon-autodin/vehicules'
    },
    {
      icon: 'fa-handshake',
      title: 'Devenir partenaire',
      description: 'Rejoignez notre réseau et accédez à des milliers d\'acheteurs potentiels.',
      link: '/mon-autodin/profil'
    },
    {
      icon: 'fa-truck',
      title: 'Livraison rapide',
      description: 'Expédition sous 24-48h avec nos partenaires transporteurs de confiance.',
      link: ''
    }
  ]
}