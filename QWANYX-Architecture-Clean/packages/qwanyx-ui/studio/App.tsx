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
import { Container, Section, Heading, Text, Button } from '../src';
import { SimpleNavbar } from '../src/components/Navbar';
import { AuthModal, AuthStatus } from '../src/components/Auth';
import { Favicon } from '../src/components/Favicon';

function StudioApp() {
  const [currentView, setCurrentView] = useState<'showcase' | 'editor' | 'templates' | 'parallax' | 'pages' | 'sections' | 'misc' | 'test' | 'icons'>('showcase');
  const [showAuth, setShowAuth] = useState(false);
  const { workspace, user, login, logout } = useWorkspace();
  
  return (
    <>
      <Favicon autoDetect={true} />
      <div className="qwanyx-min-h-screen qwanyx-bg-background">
        {/* Using our new Navbar component */}
        <SimpleNavbar
          title="QWANYX UI"
          subtitle={`Studio - ${workspace}`}
          fixed={true}
          items={[
            {
              label: 'Components',
              active: currentView === 'showcase',
              onClick: () => setCurrentView('showcase')
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
        <main className="qwanyx-pt-16">
          {currentView === 'showcase' && <ComponentShowcase />}
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
                <div className="qwanyx-text-center qwanyx-py-12">
                  <Heading as="h2" className="qwanyx-mb-4">Template Library</Heading>
                  <Text color="secondary" className="qwanyx-mb-6">
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
        <footer className="qwanyx-bg-card qwanyx-border-t qwanyx-mt-20">
          <Container>
            <Section spacing="md">
              <Text align="center" size="sm" color="muted">
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