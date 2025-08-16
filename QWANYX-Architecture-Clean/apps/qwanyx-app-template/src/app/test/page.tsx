'use client'

import { ThemeProvider, Container, Heading, Text, Button, Icon } from '@qwanyx/ui'

export default function TestPage() {
  return (
    <ThemeProvider>
      <Container>
        <Heading>Test Page</Heading>
        <Text>This is a test page to verify Icon component works</Text>
        <div>
          <Icon name="home" size="lg" color="primary" />
          <Icon name="settings" size="lg" color="secondary" />
          <Icon name="person" size="lg" color="accent" />
        </div>
        <Button>
          <Icon name="add" size="sm" />
          Test Button
        </Button>
      </Container>
    </ThemeProvider>
  )
}