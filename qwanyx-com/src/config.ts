export const siteConfig = {
  workspace: 'qwanyx-com',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5002',
  
  navbar: {
    logo: '/qwanyx-logo.png',
    logoAlt: 'QWANYX',
    links: [
      { label: 'Accueil', href: '/', active: true },
      { label: 'Modules', href: '/modules' },
      { label: 'Applications', href: '/apps' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Contact', href: '#contact' }
    ],
    showAuth: true
  },

  hero: {
    title: 'QWANYX Architecture',
    subtitle: 'Plateforme de micro-frontends modulaires',
    description: 'Créez des applications web modernes avec une architecture de modules réutilisables. Basé sur Module Federation, React et TypeScript.',
    backgroundImage: '/hero-bg.jpg',
    height: 'large' as const,
    buttons: [
      {
        label: 'Découvrir',
        variant: 'primary' as const,
        href: '#services'
      },
      {
        label: 'Documentation',
        variant: 'ghost' as const,
        href: '/docs'
      }
    ]
  },

  services: {
    title: 'Notre Écosystème',
    subtitle: 'Des solutions modulaires pour tous vos besoins',
    columns: 3 as const,
    items: [
      {
        icon: 'cube',
        iconColor: '#6366F1',
        title: 'Modules Réutilisables',
        description: 'Bibliothèque de modules prêts à l\'emploi pour accélérer vos développements.',
        link: {
          label: 'Explorer les modules',
          href: '/modules'
        }
      },
      {
        icon: 'layer-group',
        iconColor: '#F59E0B',
        title: 'Architecture Micro-Frontend',
        description: 'Module Federation pour une architecture scalable et maintenable.',
        link: {
          label: 'En savoir plus',
          href: '/docs/architecture'
        }
      },
      {
        icon: 'palette',
        iconColor: '#10B981',
        title: 'Thèmes Personnalisables',
        description: 'Système de thèmes JSON pour personnaliser l\'apparence sans toucher au code.',
        link: {
          label: 'Voir les thèmes',
          href: '/docs/themes'
        }
      },
      {
        icon: 'shield-alt',
        iconColor: '#EF4444',
        title: 'Authentification Centralisée',
        description: 'Système d\'authentification JWT partagé entre toutes vos applications.',
        link: {
          label: 'Documentation API',
          href: '/docs/api'
        }
      },
      {
        icon: 'rocket',
        iconColor: '#3B82F6',
        title: 'Applications Prêtes',
        description: 'Autodin, Belgicomics et plus encore. Des applications complètes basées sur QWANYX.',
        link: {
          label: 'Voir les apps',
          href: '/apps'
        }
      },
      {
        icon: 'code',
        iconColor: '#8B5CF6',
        title: 'Open Source',
        description: 'Code source disponible et communauté active pour vous accompagner.',
        link: {
          label: 'GitHub',
          href: 'https://github.com/qwanyx'
        }
      }
    ]
  },

  footer: {
    logo: '/qwanyx-logo.png',
    logoAlt: 'QWANYX',
    description: 'Architecture de micro-frontends modulaires pour créer des applications web modernes et scalables.',
    sections: [
      {
        title: 'Produits',
        links: [
          { label: 'Modules', href: '/modules' },
          { label: 'Applications', href: '/apps' },
          { label: 'Thèmes', href: '/themes' },
          { label: 'Templates', href: '/templates' }
        ]
      },
      {
        title: 'Développeurs',
        links: [
          { label: 'Documentation', href: '/docs' },
          { label: 'API Reference', href: '/docs/api' },
          { label: 'Guides', href: '/docs/guides' },
          { label: 'Exemples', href: '/docs/examples' }
        ]
      },
      {
        title: 'Communauté',
        links: [
          { label: 'GitHub', href: 'https://github.com/qwanyx' },
          { label: 'Discord', href: '#' },
          { label: 'Forum', href: '#' },
          { label: 'Blog', href: '/blog' }
        ]
      },
      {
        title: 'Entreprise',
        links: [
          { label: 'À propos', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Mentions légales', href: '/legal' },
          { label: 'Confidentialité', href: '/privacy' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', href: 'https://github.com/qwanyx', label: 'GitHub' },
      { icon: 'twitter', href: '#', label: 'Twitter' },
      { icon: 'linkedin', href: '#', label: 'LinkedIn' }
    ],
    copyright: `© ${new Date().getFullYear()} QWANYX. Tous droits réservés.`
  }
};