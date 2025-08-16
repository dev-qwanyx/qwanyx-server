export const siteConfig = {
  workspace: 'autodin-be',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5002',
  
  services: [
    {
      icon: 'fa-search',
      title: 'Recherche avancée',
      description: 'Trouvez rapidement la pièce qu\'il vous faut parmi notre large catalogue.',
      link: '/recherche',
      requireAuth: false
    },
    {
      icon: 'fa-shopping-cart',
      title: 'Marketplace',
      description: 'Achetez et vendez des pièces détachées en toute sécurité.',
      link: '/marketplace',
      requireAuth: true
    },
    {
      icon: 'fa-shield-alt',
      title: 'Transactions sécurisées',
      description: 'Paiements sécurisés et protection des acheteurs et vendeurs.',
      link: '/securite',
      requireAuth: false
    },
    {
      icon: 'fa-truck',
      title: 'Livraison rapide',
      description: 'Options de livraison flexibles partout en Belgique.',
      link: '/livraison',
      requireAuth: false
    },
    {
      icon: 'fa-tools',
      title: 'Outils de recherche',
      description: 'Recherchez par marque, modèle, année ou référence de pièce.',
      link: '/outils',
      requireAuth: false
    },
    {
      icon: 'fa-users',
      title: 'Communauté',
      description: 'Rejoignez notre communauté de passionnés et professionnels.',
      link: '/communaute',
      requireAuth: true
    }
  ]
};