import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, Heading, Text } from '@qwanyx/ui'

export const UsersPage: React.FC = () => {
  return (
    <div>
      <div className="qwanyx-mb-8">
        <Heading size="2xl">Utilisateurs</Heading>
        <Text className="qwanyx-mt-2" style={{ color: 'var(--qwanyx-text-secondary)' }}>
          Module de gestion des utilisateurs
        </Text>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>
            Ce module peut être étendu en chargeant un package externe comme @qwanyx/users-manager.
          </Text>
        </CardContent>
      </Card>
    </div>
  )
}