import React, { useState } from 'react';
import { ThemeProvider } from '../src/providers/ThemeProvider';
import { WorkspaceProvider, useWorkspace } from '../src/providers/WorkspaceProvider';
import { ComponentShowcase } from './ComponentShowcase';
import { ThemeEditor } from './ThemeEditor';
import { Container, Section, Heading, Text, Button, Flex } from '../src';
import { SimpleNavbar } from '../src/components/Navbar';
import { AuthModal, AuthStatus } from '../src/components/Auth';
import { Favicon } from '../src/components/Favicon';

function StudioApp() {
  const [currentView, setCurrentView] = useState<'showcase' | 'editor' | 'templates'>('showcase');
  const [showAuth, setShowAuth] = useState(false);
  const { workspace, user, login, logout } = useWorkspace();
  
  return (
    <>
      <Favicon autoDetect={true} />
      <div className="min-h-screen bg-background">
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
              label: 'Theme Editor',
              active: currentView === 'editor',
              onClick: () => setCurrentView('editor')
            },
            {
              label: 'Templates',
              active: currentView === 'templates',
              onClick: () => setCurrentView('templates')
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
        <main className="pt-16">
          {currentView === 'showcase' && <ComponentShowcase />}
          {currentView === 'editor' && <ThemeEditor />}
          {currentView === 'templates' && (
            <Container>
              <Section spacing="xl">
                <div className="text-center py-12">
                  <Heading as="h2" className="mb-4">Template Library</Heading>
                  <Text color="secondary" className="mb-6">
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
        <footer className="bg-card border-t border-border mt-20">
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