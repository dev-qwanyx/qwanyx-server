import React, { useState } from 'react';
import { ThemeProvider } from '../src/providers/ThemeProvider';
import { ComponentShowcase } from './ComponentShowcase';
import { ThemeEditor } from './ThemeEditor';
import { Container, Section, Heading, Text, Button, Flex } from '../src';

function App() {
  const [currentView, setCurrentView] = useState<'showcase' | 'editor'>('showcase');
  
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <Container>
            <Flex justify="between" align="center" className="py-4">
              <div>
                <Heading as="h1" size="2xl" weight="bold">
                  QWANYX UI
                </Heading>
                <Text size="sm" color="secondary">
                  Theme Studio - Design System Builder
                </Text>
              </div>
              
              <Flex gap="sm">
                <Button
                  variant={currentView === 'showcase' ? 'solid' : 'ghost'}
                  onClick={() => setCurrentView('showcase')}
                >
                  Components
                </Button>
                <Button
                  variant={currentView === 'editor' ? 'solid' : 'ghost'}
                  onClick={() => setCurrentView('editor')}
                >
                  Theme Editor
                </Button>
              </Flex>
            </Flex>
          </Container>
        </header>
        
        {/* Main Content */}
        <main>
          {currentView === 'showcase' ? (
            <ComponentShowcase />
          ) : (
            <ThemeEditor />
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
    </ThemeProvider>
  );
}

export default App;