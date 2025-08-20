'use client';

import {
  FormField,
  Card,
  SearchBar,
  Page,
  Section,
  Container,
  Heading,
  Text,
  Button
} from '@qwanyx/ui';

export default function MoleculesShowcase() {
  return (
    <Page layoutStrategy="sections">
      <Section padding="xl">
        <Container maxWidth="lg">
          <Heading size="4xl" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            🟢 MOLECULES - Composants Composés
          </Heading>

          {/* FormFields */}
          <Container style={{ marginBottom: '4rem' }}>
            <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
              FormFields
            </Heading>
            <Container style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
              <FormField
                label="Email"
                name="email"
                type="email"
                placeholder="votre@email.com"
                required
              />
              
              <FormField
                label="Mot de passe"
                name="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                helperText="Minimum 8 caractères"
              />
              
              <FormField
                label="Nom complet"
                name="fullname"
                placeholder="Jean Dupont"
                error="Ce champ est requis"
              />
              
              <FormField
                label="Description"
                name="description"
                type="textarea"
                placeholder="Décrivez votre projet..."
                rows={4}
              />
              
              <FormField
                label="Téléphone"
                name="phone"
                type="tel"
                placeholder="+32 4XX XX XX XX"
                leftIcon={<span>📱</span>}
              />
            </Container>
          </Container>

          {/* Cards */}
          <Container style={{ marginBottom: '4rem' }}>
            <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
              Cards
            </Heading>
            <Container style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {/* Basic Card */}
              <Card padding="lg">
                <Heading size="xl" style={{ marginBottom: '1rem' }}>
                  Basic Card
                </Heading>
                <Text style={{ marginBottom: '1rem' }}>
                  Ceci est une carte basique avec du contenu simple. Les cartes sont parfaites pour organiser l'information.
                </Text>
                <Button variant="primary" size="sm">Action</Button>
              </Card>

              {/* Card with Border */}
              <Card 
                padding="lg" 
                border="2/primary/solid"
                style={{ backgroundColor: 'rgba(230, 126, 34, 0.05)' }}
              >
                <Heading size="xl" style={{ marginBottom: '1rem', color: '#E67E22' }}>
                  Card avec Bordure
                </Heading>
                <Text style={{ marginBottom: '1rem' }}>
                  Cette carte a une bordure primary et un fond légèrement coloré.
                </Text>
                <Button variant="secondary" size="sm">En savoir plus</Button>
              </Card>

              {/* Elevated Card */}
              <Card 
                padding="lg"
                elevation="lg"
              >
                <Heading size="xl" style={{ marginBottom: '1rem' }}>
                  Card Surélevée
                </Heading>
                <Text style={{ marginBottom: '1rem' }}>
                  Cette carte utilise l'élévation pour créer un effet de profondeur avec une ombre.
                </Text>
                <Container style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button variant="success" size="sm">Accepter</Button>
                  <Button variant="danger" size="sm">Refuser</Button>
                </Container>
              </Card>

              {/* Interactive Card */}
              <Card 
                padding="lg"
                hoverable
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Heading size="xl" style={{ marginBottom: '1rem' }}>
                  Card Interactive
                </Heading>
                <Text style={{ marginBottom: '1rem' }}>
                  Survolez cette carte pour voir l'effet hover. Parfait pour les liens ou actions.
                </Text>
                <Text size="sm" style={{ color: '#E67E22' }}>
                  → Cliquez pour plus de détails
                </Text>
              </Card>
            </Container>
          </Container>

          {/* SearchBar */}
          <Container style={{ marginBottom: '4rem' }}>
            <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
              SearchBar
            </Heading>
            <Container style={{ display: 'grid', gap: '1.5rem', maxWidth: '600px' }}>
              <SearchBar
                placeholder="Recherche simple..."
                onSearch={(query) => console.log('Search:', query)}
              />
              
              <SearchBar
                placeholder="Recherche avec suggestions..."
                onSearch={(query) => console.log('Search:', query)}
                suggestions={[
                  'React Components',
                  'TypeScript Guide',
                  'QWANYX Architecture',
                  'Atomic Design',
                  'Style Grammar'
                ]}
              />
              
              <SearchBar
                placeholder="Recherche avec catégories..."
                onSearch={(query) => console.log('Search:', query)}
                suggestions={[
                  { label: 'Documentation', category: 'Pages' },
                  { label: 'Components Guide', category: 'Pages' },
                  { label: 'Button', category: 'Components' },
                  { label: 'Card', category: 'Components' },
                  { label: 'createApp()', category: 'API' },
                  { label: 'useTheme()', category: 'API' }
                ]}
              />
            </Container>
          </Container>

          {/* User Profile (Molecule) */}
          <Container style={{ marginBottom: '4rem' }}>
            <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
              User Profile
            </Heading>
            <Container style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {/* Simple Profile */}
              <Card padding="md" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Container style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  backgroundColor: '#E67E22',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem'
                }}>
                  JD
                </Container>
                <Container>
                  <Text weight="semibold">Jean Dupont</Text>
                  <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>jean@example.com</Text>
                </Container>
              </Card>

              {/* Profile with Badge */}
              <Card padding="md" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Container style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '50%', 
                  backgroundColor: '#27AE60',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem'
                }}>
                  AD
                </Container>
                <Container>
                  <Container style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Text weight="semibold">Admin User</Text>
                    <Container style={{ 
                      padding: '2px 8px',
                      backgroundColor: '#27AE60',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '0.75rem'
                    }}>
                      PRO
                    </Container>
                  </Container>
                  <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>admin@qwanyx.com</Text>
                </Container>
              </Card>
            </Container>
          </Container>

          {/* Progress Bars */}
          <Container style={{ marginBottom: '4rem' }}>
            <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
              Progress Indicators
            </Heading>
            <Container style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
              <Container>
                <Text size="sm" style={{ marginBottom: '0.5rem' }}>Progression: 25%</Text>
                <Container style={{ 
                  height: '8px', 
                  backgroundColor: 'rgb(var(--muted))', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <Container style={{ 
                    width: '25%', 
                    height: '100%', 
                    backgroundColor: '#E67E22',
                    transition: 'width 0.3s'
                  }} />
                </Container>
              </Container>

              <Container>
                <Text size="sm" style={{ marginBottom: '0.5rem' }}>Progression: 60%</Text>
                <Container style={{ 
                  height: '8px', 
                  backgroundColor: 'rgb(var(--muted))', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <Container style={{ 
                    width: '60%', 
                    height: '100%', 
                    backgroundColor: '#27AE60',
                    transition: 'width 0.3s'
                  }} />
                </Container>
              </Container>

              <Container>
                <Text size="sm" style={{ marginBottom: '0.5rem' }}>Progression: 90%</Text>
                <Container style={{ 
                  height: '8px', 
                  backgroundColor: 'rgb(var(--muted))', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <Container style={{ 
                    width: '90%', 
                    height: '100%', 
                    backgroundColor: '#2ECC71',
                    transition: 'width 0.3s'
                  }} />
                </Container>
              </Container>
            </Container>
          </Container>
        </Container>
      </Section>
    </Page>
  );
}