'use client';

import {
  NavbarNew,
  Page,
  Section,
  Container,
  Heading,
  Text,
  Button,
  Card
} from '@qwanyx/ui';
import { useState } from 'react';

export default function OrganismsShowcase() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [navbarVariant, setNavbarVariant] = useState<'default' | 'dark' | 'light' | 'transparent'>('default');

  return (
    <>
      <NavbarNew
        variant={navbarVariant}
        brandName="QWANYX Studio"
        brandLogo="🎨"
        menuItems={[
          { label: 'Atoms', href: '/atoms' },
          { label: 'Molecules', href: '/molecules' },
          { label: 'Organisms', href: '/organisms' },
          { label: 'Templates', href: '#templates' }
        ]}
        searchPlaceholder="Rechercher un composant..."
        onSearch={(query) => console.log('Search:', query)}
        isAuthenticated={isAuthenticated}
        user={isAuthenticated ? { name: 'John Doe', email: 'john@qwanyx.com', avatar: 'JD' } : undefined}
        onLogin={() => {
          console.log('Login clicked');
          setIsAuthenticated(true);
        }}
        onRegister={() => console.log('Register clicked')}
        onLogout={() => {
          console.log('Logout clicked');
          setIsAuthenticated(false);
        }}
      />

      <Page layoutStrategy="sections">
        <Section padding="xl" style={{ paddingTop: '120px' }}>
          <Container maxWidth="lg">
            <Heading size="4xl" style={{ marginBottom: '3rem', textAlign: 'center' }}>
              🟠 ORGANISMS - Composants Complexes
            </Heading>

            {/* Navbar Showcase */}
            <Container style={{ marginBottom: '4rem' }}>
              <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
                NavbarNew Component
              </Heading>
              
              <Text style={{ marginBottom: '1.5rem' }}>
                Le NavbarNew est actuellement affiché en haut de cette page. Testez ses fonctionnalités:
              </Text>

              <Container style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                <Card padding="md">
                  <Text weight="semibold">🎨 Variants de Navbar</Text>
                  <Container style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <Button 
                      variant={navbarVariant === 'default' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setNavbarVariant('default')}
                    >
                      Default
                    </Button>
                    <Button 
                      variant={navbarVariant === 'dark' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setNavbarVariant('dark')}
                    >
                      Dark
                    </Button>
                    <Button 
                      variant={navbarVariant === 'light' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setNavbarVariant('light')}
                    >
                      Light
                    </Button>
                    <Button 
                      variant={navbarVariant === 'transparent' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setNavbarVariant('transparent')}
                    >
                      Transparent
                    </Button>
                  </Container>
                </Card>

                <Card padding="md">
                  <Text weight="semibold">👤 État d'authentification</Text>
                  <Container style={{ marginTop: '0.5rem' }}>
                    <Button 
                      variant={isAuthenticated ? 'danger' : 'success'}
                      size="sm"
                      onClick={() => setIsAuthenticated(!isAuthenticated)}
                    >
                      {isAuthenticated ? 'Simuler Déconnexion' : 'Simuler Connexion'}
                    </Button>
                  </Container>
                </Card>

                <Card padding="md">
                  <Text weight="semibold">🔍 Fonctionnalités</Text>
                  <Container style={{ marginTop: '0.5rem' }}>
                    <Text size="sm">• Barre de recherche avec suggestions</Text>
                    <Text size="sm">• Menu responsive (réduisez la fenêtre)</Text>
                    <Text size="sm">• Sticky avec effet blur au scroll</Text>
                    <Text size="sm">• Menu utilisateur dropdown</Text>
                  </Container>
                </Card>
              </Container>
            </Container>

            {/* Dashboard Layout */}
            <Container style={{ marginBottom: '4rem' }}>
              <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
                Dashboard Layout
              </Heading>
              
              <Card padding="none" style={{ height: '400px', overflow: 'hidden' }}>
                <Container style={{ display: 'flex', height: '100%' }}>
                  {/* Sidebar */}
                  <Container style={{ 
                    width: '250px', 
                    backgroundColor: 'rgb(var(--card))',
                    borderRight: '1px solid rgb(var(--border))',
                    padding: '1.5rem'
                  }}>
                    <Heading size="lg" style={{ marginBottom: '1.5rem' }}>Dashboard</Heading>
                    <Container style={{ display: 'grid', gap: '0.5rem' }}>
                      <Container style={{ 
                        padding: '0.75rem',
                        backgroundColor: '#E67E22',
                        color: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}>
                        📊 Analytics
                      </Container>
                      <Container style={{ 
                        padding: '0.75rem',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}>
                        👥 Users
                      </Container>
                      <Container style={{ 
                        padding: '0.75rem',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}>
                        📦 Products
                      </Container>
                      <Container style={{ 
                        padding: '0.75rem',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}>
                        ⚙️ Settings
                      </Container>
                    </Container>
                  </Container>

                  {/* Main Content */}
                  <Container style={{ flex: 1, padding: '2rem' }}>
                    <Heading size="xl" style={{ marginBottom: '1rem' }}>Analytics Overview</Heading>
                    <Container style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <Card padding="md" style={{ textAlign: 'center' }}>
                        <Text size="2xl" weight="bold" style={{ color: '#E67E22' }}>1,234</Text>
                        <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>Total Users</Text>
                      </Card>
                      <Card padding="md" style={{ textAlign: 'center' }}>
                        <Text size="2xl" weight="bold" style={{ color: '#27AE60' }}>€45,678</Text>
                        <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>Revenue</Text>
                      </Card>
                      <Card padding="md" style={{ textAlign: 'center' }}>
                        <Text size="2xl" weight="bold" style={{ color: '#3498DB' }}>89%</Text>
                        <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>Satisfaction</Text>
                      </Card>
                    </Container>
                  </Container>
                </Container>
              </Card>
            </Container>

            {/* Data Table */}
            <Container style={{ marginBottom: '4rem' }}>
              <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
                Data Table
              </Heading>
              
              <Card padding="lg">
                {/* Table Header */}
                <Container style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <Heading size="lg">Users List</Heading>
                  <Container style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="primary" size="sm">+ Add User</Button>
                    <Button variant="secondary" size="sm">Export</Button>
                  </Container>
                </Container>

                {/* Table */}
                <Container style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid rgb(var(--border))' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Role</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid rgb(var(--border))' }}>
                        <td style={{ padding: '0.75rem' }}>John Doe</td>
                        <td style={{ padding: '0.75rem' }}>john@example.com</td>
                        <td style={{ padding: '0.75rem' }}>Admin</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{ 
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#27AE60',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '0.875rem'
                          }}>Active</span>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                          <Container style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <Button size="sm" variant="ghost">Edit</Button>
                            <Button size="sm" variant="danger">Delete</Button>
                          </Container>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid rgb(var(--border))' }}>
                        <td style={{ padding: '0.75rem' }}>Jane Smith</td>
                        <td style={{ padding: '0.75rem' }}>jane@example.com</td>
                        <td style={{ padding: '0.75rem' }}>User</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{ 
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#27AE60',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '0.875rem'
                          }}>Active</span>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                          <Container style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <Button size="sm" variant="ghost">Edit</Button>
                            <Button size="sm" variant="danger">Delete</Button>
                          </Container>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid rgb(var(--border))' }}>
                        <td style={{ padding: '0.75rem' }}>Bob Johnson</td>
                        <td style={{ padding: '0.75rem' }}>bob@example.com</td>
                        <td style={{ padding: '0.75rem' }}>User</td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{ 
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#95A5A6',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '0.875rem'
                          }}>Inactive</span>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                          <Container style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <Button size="sm" variant="ghost">Edit</Button>
                            <Button size="sm" variant="danger">Delete</Button>
                          </Container>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Container>

                {/* Pagination */}
                <Container style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '1.5rem'
                }}>
                  <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>
                    Showing 1-3 of 150 results
                  </Text>
                  <Container style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button size="sm" variant="ghost">Previous</Button>
                    <Button size="sm" variant="primary">1</Button>
                    <Button size="sm" variant="ghost">2</Button>
                    <Button size="sm" variant="ghost">3</Button>
                    <Button size="sm" variant="ghost">...</Button>
                    <Button size="sm" variant="ghost">15</Button>
                    <Button size="sm" variant="ghost">Next</Button>
                  </Container>
                </Container>
              </Card>
            </Container>

            {/* Footer */}
            <Container style={{ marginBottom: '4rem' }}>
              <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
                Footer Component
              </Heading>
              
              <Card padding="none" style={{ backgroundColor: 'rgb(var(--card))' }}>
                <Container style={{ padding: '3rem 2rem', borderBottom: '1px solid rgb(var(--border))' }}>
                  <Container maxWidth="lg" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    margin: '0 auto'
                  }}>
                    <Container>
                      <Heading size="lg" style={{ marginBottom: '1rem', color: '#E67E22' }}>QWANYX</Heading>
                      <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>
                        Building the future of web applications with modern architecture and beautiful components.
                      </Text>
                    </Container>
                    
                    <Container>
                      <Heading size="md" style={{ marginBottom: '1rem' }}>Products</Heading>
                      <Container style={{ display: 'grid', gap: '0.5rem' }}>
                        <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>Autodin</Text>
                        <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>Belgicomics</Text>
                        <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>Personal-CASH</Text>
                      </Container>
                    </Container>
                    
                    <Container>
                      <Heading size="md" style={{ marginBottom: '1rem' }}>Resources</Heading>
                      <Container style={{ display: 'grid', gap: '0.5rem' }}>
                        <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>Documentation</Text>
                        <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>Components</Text>
                        <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>API Reference</Text>
                      </Container>
                    </Container>
                    
                    <Container>
                      <Heading size="md" style={{ marginBottom: '1rem' }}>Connect</Heading>
                      <Container style={{ display: 'flex', gap: '1rem', fontSize: '1.5rem' }}>
                        <span>📧</span>
                        <span>🐦</span>
                        <span>💼</span>
                        <span>📱</span>
                      </Container>
                    </Container>
                  </Container>
                </Container>
                
                <Container style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <Text size="sm" style={{ color: 'rgb(var(--muted))' }}>
                    © 2025 QWANYX. All rights reserved. Built with ❤️ and TypeScript.
                  </Text>
                </Container>
              </Card>
            </Container>
          </Container>
        </Section>
      </Page>
    </>
  );
}