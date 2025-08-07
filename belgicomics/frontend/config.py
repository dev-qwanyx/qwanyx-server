# Belgicomics Configuration
import os

# Workspace configuration
WORKSPACE_ID = 'belgicomics'
WORKSPACE_NAME = 'Belgicomics'

# API Configuration
API_BASE_URL = os.environ.get('API_BASE_URL', 'http://localhost:5002')

# Site Configuration
SITE_NAME = 'Belgicomics'
SITE_TAGLINE = 'La plus grande librairie de BD en ligne de Belgique'
SITE_DESCRIPTION = 'Découvrez notre collection de plus de 50.000 bandes dessinées, mangas et comics'

# Colors and Branding
BRAND_COLORS = {
    'primary': '#E74C3C',     # Rouge BD
    'secondary': '#2C3E50',   # Bleu foncé
    'accent': '#F39C12',      # Jaune/Orange
    'dark': '#2C3E50',
    'light': '#ECF0F1'
}

# Contact Information
CONTACT_INFO = {
    'address': 'Boulevard Anspach 111, 1000 Bruxelles',
    'phone': '+32 2 xxx xx xx',
    'email': 'info@belgicomics.be'
}

# Features Configuration
FEATURES = {
    'show_used_books': True,
    'show_rare_editions': True,
    'show_manga_section': True,
    'show_comics_section': True,
    'show_bd_section': True,
    'enable_preorders': True,
    'enable_subscriptions': True
}

# Services for homepage
SERVICES = [
    {
        'icon': 'fa-book',
        'title': 'Catalogue Complet',
        'description': 'Plus de 50.000 BD, mangas et comics disponibles',
        'link': 'catalogue'
    },
    {
        'icon': 'fa-gem',
        'title': 'Éditions Rares',
        'description': 'Premières éditions et tirages limités',
        'link': 'rare-editions'
    },
    {
        'icon': 'fa-star',
        'title': 'Nouveautés',
        'description': 'Les dernières sorties chaque semaine',
        'link': 'nouveautes'
    },
    {
        'icon': 'fa-box',
        'title': 'Abonnements',
        'description': 'Recevez vos séries préférées automatiquement',
        'link': 'abonnements'
    },
    {
        'icon': 'fa-calendar',
        'title': 'Précommandes',
        'description': 'Réservez les prochaines sorties',
        'link': 'precommandes'
    },
    {
        'icon': 'fa-users',
        'title': 'Club Lecteurs',
        'description': 'Rejoignez notre communauté de passionnés',
        'link': 'club'
    }
]