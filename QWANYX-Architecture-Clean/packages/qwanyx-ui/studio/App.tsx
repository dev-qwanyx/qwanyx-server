import { useState } from 'react';
import { ThemeProvider } from '../src/providers/ThemeProvider';
import { WorkspaceProvider, useWorkspace } from '../src/providers/WorkspaceProvider';
import { ComponentShowcase } from './ComponentShowcase';
import { ThemeEditor } from './ThemeEditor';
import { ParallaxShowcase } from './src/components/ParallaxShowcase';
import { PageShowcase } from './pages/PageShowcase'
import { SectionShowcase } from './sections/SectionShowcase'
import { MiscShowcase } from './misc/MiscShowcase';
import { IconTest } from './test/IconTest';
import { IconLibraryPage } from './icons/IconLibraryPage';
import { AtomsShowcase } from './atoms/AtomsShowcase';
import { MoleculesShowcase } from './molecules/MoleculesShowcase';
import { LayoutGallery } from './LayoutGallery';
import { DashboardShowcase } from './dashboard/DashboardShowcase';
import CanvasShowcase from './canvas/CanvasShowcase';
import { Container, Section, Heading, Text, Button } from '../src';
import { NavigationBar } from '../src/components/NavigationBar';
import { AuthModal, AuthStatus } from '../src/components/Auth';
import { Favicon } from '../src/components/Favicon';

function StudioApp() {
  const [currentView, setCurrentView] = useState<'showcase' | 'editor' | 'templates' | 'parallax' | 'pages' | 'sections' | 'misc' | 'test' | 'icons' | 'atoms' | 'molecules' | 'organisms' | 'layouts' | 'canvas'>('showcase');
  const [showAuth, setShowAuth] = useState(false);
  const { workspace, user, login, logout } = useWorkspace();
  
  return (
    <>
      <Favicon autoDetect={true} />
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: 'rgb(var(--background))',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Using our new NavigationBar component */}
        <NavigationBar
          title="QWANYX UI"
          subtitle={`Studio - ${workspace}`}
          position="fixed"
          variant="default"
          search={true}
          searchPlaceholder="Search components..."
          mobileMenuType="drawer"
          items={[
            {
              label: 'Components',
              active: currentView === 'showcase',
              onClick: () => setCurrentView('showcase')
            },
            {
              label: '⚛️ Atoms',
              active: currentView === 'atoms',
              onClick: () => setCurrentView('atoms')
            },
            {
              label: '🧬 Molecules',
              active: currentView === 'molecules',
              onClick: () => setCurrentView('molecules')
            },
            {
              label: '🦠 Organisms',
              active: currentView === 'organisms',
              onClick: () => setCurrentView('organisms')
            },
            {
              label: '📐 Layouts',
              active: currentView === 'layouts',
              onClick: () => setCurrentView('layouts')
            },
            {
              label: '🎯 Dashboard',
              active: currentView === 'dashboard',
              onClick: () => setCurrentView('dashboard')
            },
            {
              label: '🔀 Canvas',
              active: currentView === 'canvas',
              onClick: () => setCurrentView('canvas')
            },
            {
              label: 'Icons',
              active: currentView === 'icons',
              onClick: () => setCurrentView('icons')
            },
            {
              label: 'Sections',
              active: currentView === 'sections',
              onClick: () => setCurrentView('sections')
            },
            {
              label: 'Pages',
              active: currentView === 'pages',
              onClick: () => setCurrentView('pages')
            },
            {
              label: 'Parallax',
              active: currentView === 'parallax',
              onClick: () => setCurrentView('parallax')
            },
            {
              label: 'Theme Editor',
              active: currentView === 'editor',
              onClick: () => setCurrentView('editor')
            },
            {
              label: 'Misc',
              active: currentView === 'misc',
              onClick: () => setCurrentView('misc')
            }
          ]}
          actions={
            <AuthStatus 
              workspace={workspace}
              onLogin={() => setShowAuth(true)}
              onLogout={logout}
            />
          }
        />
        
        {/* Main Content - add padding-top for fixed navbar */}
        <main style={{ 
          paddingTop: '64px',
          flex: 1,
          overflow: 'auto'
        }}>
          {currentView === 'showcase' && <ComponentShowcase />}
          {currentView === 'atoms' && <AtomsShowcase />}
          {currentView === 'molecules' && <MoleculesShowcase />}
          {currentView === 'organisms' && (
            <Container>
              <Section spacing="xl">
                <Heading as="h1" style={{ marginBottom: '16px' }}>🦠 Organisms</Heading>
                <Text color="secondary">Organisms showcase coming soon...</Text>
              </Section>
            </Container>
          )}
          {currentView === 'layouts' && <LayoutGallery />}
          {currentView === 'dashboard' && <DashboardShowcase />}
          {currentView === 'canvas' && <CanvasShowcase />}
          {currentView === 'icons' && <IconLibraryPage />}
          {currentView === 'editor' && <ThemeEditor />}
          {currentView === 'parallax' && <ParallaxShowcase />}
          {currentView === 'pages' && <PageShowcase />}
          {currentView === 'sections' && <SectionShowcase />}
          {currentView === 'misc' && <MiscShowcase />}
          {currentView === 'test' && <IconTest />}
          {currentView === 'templates' && (
            <Container>
              <Section spacing="xl">
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <Heading as="h2" style={{ marginBottom: '16px' }}>Template Library</Heading>
                  <Text color="secondary" style={{ marginBottom: '24px' }}>
                    {user 
                      ? "Your templates will appear here" 
                      : "Sign in to save and manage templates"}
                  </Text>
                  {!user && (
                    <Button onClick={() => setShowAuth(true)}>
                      Sign In to Continue
                    </Button>
                  )}
                </div>
              </Section>
            </Container>
          )}
        </main>
        
        {/* Footer */}
        <footer style={{ 
          backgroundColor: 'rgb(var(--card))',
          borderTop: '1px solid rgb(var(--border))',
          marginTop: '80px'
        }}>
          <Container>
            <Section spacing="md">
              <Text align="center" size="sm" color="muted" style={{ textAlign: 'center' }}>
                QWANYX UI - Build beautiful, themeable interfaces with ease
              </Text>
            </Section>
          </Container>
        </footer>
      </div>
      
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        workspace={workspace}
        onSuccess={(user, token) => {
          login(user, token);
          setShowAuth(false);
        }}
      />
    </>
  );
}

function App() {
  return (
    <WorkspaceProvider defaultWorkspace="qwanyx-ui">
      <ThemeProvider>
        <StudioApp />
      </ThemeProvider>
    </WorkspaceProvider>
  );
}

export default App;