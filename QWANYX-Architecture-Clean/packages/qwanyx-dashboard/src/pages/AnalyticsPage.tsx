import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, Heading, Text } from '@qwanyx/ui'

export const AnalyticsPage: React.FC = () => {
  return (
    <div>
      <div className="qwanyx-mb-8">
        <Heading size="2xl">Analytiques</Heading>
        <Text className="qwanyx-mt-2" style={{ color: 'var(--qwanyx-text-secondary)' }}>
          Statistiques et analyses
        </Text>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module analytiques</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>
            Ce module peut être étendu en chargeant un package externe comme @qwanyx/analytics.
          </Text>
        </CardContent>
      </Card>
    </div>
  )
}