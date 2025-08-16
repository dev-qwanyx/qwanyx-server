import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, Heading, Text } from '@qwanyx/ui'

export const RequestsPage: React.FC = () => {
  return (
    <div>
      <div className="qwanyx-mb-8">
        <Heading size="2xl">Demandes</Heading>
        <Text className="qwanyx-mt-2" style={{ color: 'var(--qwanyx-text-secondary)' }}>
          Module de gestion des demandes
        </Text>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module demandes</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>
            Ce module peut être étendu en chargeant un package externe comme @qwanyx/requests-manager.
          </Text>
        </CardContent>
      </Card>
    </div>
  )
}