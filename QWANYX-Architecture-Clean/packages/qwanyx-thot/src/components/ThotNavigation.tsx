import React from 'react'
import { Container } from '@qwanyx/ui'
import { ConfigurationPage } from '../pages/ConfigurationPage'

export const ThotNavigation: React.FC = () => {
  // Temporairement, affichons directement la page de configuration pour tester
  return (
    <Container>
      <ConfigurationPage />
    </Container>
  )
}