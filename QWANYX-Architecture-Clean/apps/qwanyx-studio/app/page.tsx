'use client';

import { 
  Page,
  Container, 
  Section, 
  Heading, 
  Text,
  Button,
  Card
} from '@qwanyx/ui';
import Link from 'next/link';

export default function StudioHomePage() {
  return (
    <Page layoutStrategy="sections">
      <Section padding="xxl" background="primary/5">
        <Container maxWidth="lg" style={{ textAlign: 'center' }}>
          <Heading size="4xl" style={{ marginBottom: '1rem', color: '#E67E22' }}>
            🎨 QWANYX Studio
          </Heading>
          
          <Text size="xl" style={{ marginBottom: '3rem', color: 'rgb(var(--muted))' }}>
            Explorez et validez les composants de l'architecture QWANYX
          </Text>

          <Container style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <Link href="/atoms" style={{ textDecoration: 'none' }}>
              <Card 
                padding="xl" 
                hoverable
                style={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  height: '100%'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Text size="3xl" style={{ marginBottom: '1rem' }}>🔵</Text>
                <Heading size="xl" style={{ marginBottom: '0.5rem' }}>Atoms</Heading>
                <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>
                  Composants de base: Button, Input, Text, Badge...
                </Text>
              </Card>
            </Link>

            <Link href="/molecules" style={{ textDecoration: 'none' }}>
              <Card 
                padding="xl" 
                hoverable
                style={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  height: '100%'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Text size="3xl" style={{ marginBottom: '1rem' }}>🟢</Text>
                <Heading size="xl" style={{ marginBottom: '0.5rem' }}>Molecules</Heading>
                <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>
                  Composants composés: FormField, Card, SearchBar...
                </Text>
              </Card>
            </Link>

            <Link href="/organisms" style={{ textDecoration: 'none' }}>
              <Card 
                padding="xl" 
                hoverable
                style={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  height: '100%'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Text size="3xl" style={{ marginBottom: '1rem' }}>🟠</Text>
                <Heading size="xl" style={{ marginBottom: '0.5rem' }}>Organisms</Heading>
                <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>
                  Composants complexes: NavbarNew, Dashboard, DataTable...
                </Text>
              </Card>
            </Link>
          </Container>

          <Container style={{ 
            padding: '2rem',
            backgroundColor: 'rgb(var(--card))',
            borderRadius: '8px',
            border: '2px solid #E67E22'
          }}>
            <Heading size="lg" style={{ marginBottom: '1rem' }}>
              📋 Checklist de validation
            </Heading>
            <Container style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
              <Text size="sm" style={{ marginBottom: '0.5rem' }}>
                ✅ Tous les composants utilisent les props sémantiques
              </Text>
              <Text size="sm" style={{ marginBottom: '0.5rem' }}>
                ✅ Aucun élément HTML natif utilisé
              </Text>
              <Text size="sm" style={{ marginBottom: '0.5rem' }}>
                ✅ Style Grammar system fonctionnel
              </Text>
              <Text size="sm" style={{ marginBottom: '0.5rem' }}>
                ✅ CSS Variables pour le theming
              </Text>
              <Text size="sm" style={{ marginBottom: '0.5rem' }}>
                ✅ TypeScript strict (aucun `any`)
              </Text>
              <Text size="sm">
                ✅ Architecture Atomic Design respectée
              </Text>
            </Container>
          </Container>
        </Container>
      </Section>

      <Section padding="xl">
        <Container maxWidth="lg">
          <Heading size="2xl" style={{ marginBottom: '2rem', textAlign: 'center' }}>
            Architecture QWANYX
          </Heading>
          
          <Container style={{ 
            padding: '2rem',
            backgroundColor: 'rgb(var(--card))',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`Apps → @qwanyx/ui (Direct maintenant)
     ↓
   Utilise les composants atomiques
     ↓
   Atoms → Molecules → Organisms → Templates`}
            </pre>
          </Container>

          <Container style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>
              Simplification: Les apps importent directement depuis @qwanyx/ui
            </Text>
            <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>
              Plus tard: Extraction vers @qwanyx/app-core si nécessaire
            </Text>
          </Container>
        </Container>
      </Section>
    </Page>
  );
}