'use client'

import { 
  Container,
  Section,
  Text,
  Button,
  VStack
} from '@qwanyx/ui'

export default function TestPage() {
  return (
    <VStack spacing="md">
      <Container>
        <Section>
          <Text>Test Page - If you see this, components are working!</Text>
          <Button>Test Button</Button>
        </Section>
      </Container>
    </VStack>
  )
}