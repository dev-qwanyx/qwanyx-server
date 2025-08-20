/**
 * 🎨 Navbar Test Page - Studio
 * Testing all Navbar variants and behaviors
 */

'use client'

import { useState } from 'react'

// We'll use direct imports for now until package resolution is fixed
import '../../../packages/qwanyx-ui/src/styles.css'

// Créons des composants temporaires inline pour tester
const NavbarNew = require('../../../packages/qwanyx-ui/src/components/NavbarNew').NavbarNew
const Page = require('../../../packages/qwanyx-ui/src/components/Page').Page
const Container = require('../../../packages/qwanyx-ui/src/components/Container').Container
const Heading = require('../../../packages/qwanyx-ui/src/components/Text').Heading
const Text = require('../../../packages/qwanyx-ui/src/components/Text').Text
const Button = require('../../../packages/qwanyx-ui/src/components/Button').Button

type NavbarMenuItem = any
type NavbarUser = any

export default function NavbarTestPage() {
  const [user, setUser] = useState<NavbarUser | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [variant, setVariant] = useState<'default' | 'dark' | 'light' | 'transparent'>('default')
  
  const menuItems: NavbarMenuItem[] = [
    { label: 'Accueil', href: '/', active: true },
    { label: 'Services', href: '/services' },
    { label: 'À propos', href: '/about' },
    { label: 'Contact', href: '/contact', badge: '3' }
  ]

  const mockUser: NavbarUser = {
    name: 'John Doe',
    email: 'john@example.com',
    initials: 'JD'
  }

  return (
    <>
      {/* Test Navbar */}
      <NavbarNew
        logo={{
          text: 'AUTODIN',
          src: '/logo.png',
          href: '/'
        }}
        menuItems={menuItems}
        showSearch={true}
        searchPlaceholder="Rechercher des pièces..."
        onSearch={(query) => {
          setSearchQuery(query)
          console.log('Search:', query)
        }}
        user={user}
        onLogin={() => {
          console.log('Login clicked')
          setUser(mockUser)
        }}
        onRegister={() => console.log('Register clicked')}
        onLogout={() => {
          console.log('Logout clicked')
          setUser(null)
        }}
        onProfileClick={() => console.log('Profile clicked')}
        sticky={true}
        blur={true}
        variant={variant}
      />

      {/* Page Content */}
      <Page layout="grow" padding="xl">
        <Container>
          <Heading size="4xl" style={{ marginBottom: '1rem' }}>
            🎯 Navbar Component Test
          </Heading>
          
          <Text size="xl" style={{ marginBottom: '2rem', opacity: 0.8 }}>
            Testing all navbar features and variants
          </Text>

          {/* Controls */}
          <div style={{ 
            padding: '2rem',
            backgroundColor: 'rgb(var(--muted) / 0.1)',
            borderRadius: 'var(--radius)',
            marginBottom: '2rem'
          }}>
            <Heading size="2xl" style={{ marginBottom: '1rem' }}>
              Controls
            </Heading>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <Button
                onClick={() => setUser(user ? null : mockUser)}
                variant={user ? 'secondary' : 'primary'}
              >
                {user ? 'Logout' : 'Login'}
              </Button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <Text>Variant:</Text>
              {(['default', 'dark', 'light', 'transparent'] as const).map(v => (
                <Button
                  key={v}
                  onClick={() => setVariant(v)}
                  variant={variant === v ? 'primary' : 'ghost'}
                  size="sm"
                >
                  {v}
                </Button>
              ))}
            </div>

            {searchQuery && (
              <Text style={{ marginTop: '1rem' }}>
                Last search: <strong>{searchQuery}</strong>
              </Text>
            )}
          </div>

          {/* Features */}
          <div style={{ marginBottom: '2rem' }}>
            <Heading size="2xl" style={{ marginBottom: '1rem' }}>
              Features Implemented
            </Heading>
            
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Text>✅ Logo with text and image</Text>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Text>✅ Navigation menu with active state</Text>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Text>✅ Search bar with placeholder</Text>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Text>✅ Login/Register buttons</Text>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Text>✅ User menu with dropdown</Text>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Text>✅ Sticky positioning</Text>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Text>✅ Blur effect on scroll</Text>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Text>✅ Badge support on menu items</Text>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Text>✅ Multiple variants (default, dark, light, transparent)</Text>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Text>✅ Mobile responsive with hamburger menu</Text>
              </li>
            </ul>
          </div>

          {/* Scroll Test */}
          <div style={{ marginBottom: '2rem' }}>
            <Heading size="2xl" style={{ marginBottom: '1rem' }}>
              Scroll Test
            </Heading>
            <Text style={{ marginBottom: '1rem' }}>
              Scroll down to see the sticky navbar with blur effect
            </Text>
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} style={{ 
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: 'rgb(var(--muted) / 0.05)',
                borderRadius: 'var(--radius)'
              }}>
                <Text>Content block {i + 1} - Keep scrolling to test navbar behavior</Text>
              </div>
            ))}
          </div>
        </Container>
      </Page>
    </>
  )
}