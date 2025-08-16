import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, Heading, Text } from '@qwanyx/ui'

export const SettingsPage: React.FC = () => {
  return (
    <div>
      <div className="qwanyx-mb-8">
        <Heading size="2xl">Paramètres</Heading>
        <Text className="qwanyx-mt-2" style={{ color: 'var(--qwanyx-text-secondary)' }}>
          Configuration de l'application
        </Text>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module paramètres</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>
            Ce module peut être étendu en chargeant un package externe comme @qwanyx/settings-manager.
          </Text>
        </CardContent>
      </Card>
    </div>
  )
}