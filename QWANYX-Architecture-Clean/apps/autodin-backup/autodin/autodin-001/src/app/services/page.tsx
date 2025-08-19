'use client'

import { 
  Page,
  PageContent,
  PageSection,
  Container,
  Heading,
  Text,
  Grid,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button
} from '@qwanyx/ui'
import '../autodin.css'

export default function ServicesPage() {
  const navigation = {
    title: 'Autodin',
    items: [
      { label: 'Accueil', href: '/' },
      { label: 'Rechercher', href: '/search' },
      { label: 'Vendre', href: '/sell' },
      { label: 'Services', href: '/services', active: true },
      { label: 'Contact', href: '/contact' },
    ],
    actions: (
      <Button size="sm" variant="outline">Se connecter</Button>
    )
  }

  const services = [
    {
      title: 'Diagnostic Gratuit',
      description: 'Nous diagnostiquons votre problème gratuitement',
      price: 'Gratuit',
      features: ['Analyse complète', 'Rapport détaillé', 'Conseils personnalisés']
    },
    {
      title: 'Livraison Express',
      description: 'Recevez vos pièces en 24h',
      price: '€9.99',
      features: ['Livraison 24h', 'Suivi en temps réel', 'Assurance incluse']
    },
    {
      title: 'Garantie Étendue',
      description: 'Protection maximale pour vos achats',
      price: '€19.99',
      features: ['2 ans de garantie', 'Remplacement immédiat', 'Support prioritaire']
    }
  ]

  return (
    <Page 
      navigation={navigation}
      backgroundColor="#f5f5f5"
    >
      <PageSection spacing="xl">
        <Container>
          <Heading size="2xl">Nos Services</Heading>
          <Text size="lg">Découvrez nos services pour faciliter vos achats</Text>
        </Container>
      </PageSection>

      <PageContent>
        <Container>
          <Grid cols={3}>
            {services.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Text size="2xl" weight="bold">{service.price}</Text>
                  <ul>
                    {service.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                  <Button fullWidth>Choisir</Button>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </PageContent>
    </Page>
  )
}