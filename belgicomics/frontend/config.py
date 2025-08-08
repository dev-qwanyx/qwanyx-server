# Belgicomics Configuration
import os

# Workspace configuration
WORKSPACE_ID = 'belgicomics'
WORKSPACE_NAME = 'Belgicomics'

# API Configuration
API_BASE_URL = os.environ.get('API_BASE_URL', 'http://localhost:5002')

# Site Configuration
SITE_NAME = 'Belgicomics'
SITE_TAGLINE = 'Plateforme collaborative patrimoniale de la bande dessinée belge'
SITE_DESCRIPTION = 'Explorez l\'histoire et les trésors du 9ème art belge à travers nos collections et images mystère'

# Colors and Branding - Belgicomics Gray Theme
BRAND_COLORS = {
    'primary': '#7a7a7a',     # Gris moyen doux
    'secondary': '#2C3E50',   # Gris foncé
    'accent': '#9a9a9a',      # Gris clair
    'dark': '#4a4a4a',       # Gris foncé
    'light': '#f8f8f8',      # Gris très clair
    'hero_overlay': 'rgba(0,0,0,0.3)'  # Overlay plus léger pour le hero
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
        'icon': 'fa-user-pen',
        'title': 'Biographies',
        'description': 'Découvrez les auteurs en détail',
        'link': 'biographies'
    },
    {
        'icon': 'fa-magnifying-glass',
        'title': 'Recherches',
        'description': 'Recherches approfondies dans notre base de données',
        'link': 'recherches'
    },
    {
        'icon': 'fa-user-graduate',
        'title': 'Chercheurs',
        'description': 'Inscrivez-vous comme chercheur',
        'link': 'chercheurs'
    },
    {
        'icon': 'fa-hands-helping',
        'title': 'Bénévolat',
        'description': 'Vous avez une expertise en relation avec la bande dessinée',
        'link': 'benevolat'
    },
    {
        'icon': 'fa-handshake',
        'title': 'Sponsoring',
        'description': 'Devenez sponsor officiel de Belgicomics',
        'link': 'sponsoring'
    },
    {
        'icon': 'fa-palette',
        'title': 'Auteurs',
        'description': 'Vous êtes scénariste, dessinateur, coloriste ? Parlez-nous de vous',
        'link': 'auteurs'
    }
]