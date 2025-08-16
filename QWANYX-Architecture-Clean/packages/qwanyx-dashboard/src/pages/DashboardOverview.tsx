import React from 'react'
import { Card, CardHeader, CardTitle, CardContent, Grid, Heading, Text, Button, Icon } from '@qwanyx/ui'

export const DashboardOverview: React.FC = () => {
  const stats = [
    {
      label: 'Total des ventes',
      value: '€12,456',
      change: '+12%',
      trend: 'up' as const,
      icon: <Icon name="TrendingUp" />
    },
    {
      label: 'Utilisateurs actifs',
      value: '1,234',
      change: '+5%',
      trend: 'up' as const,
      icon: <Icon name="People" />
    },
    {
      label: 'Taux de conversion',
      value: '3.4%',
      change: '-2%',
      trend: 'down' as const,
      icon: <Icon name="Analytics" />
    },
    {
      label: 'Commandes moyennes',
      value: '€156',
      change: '0%',
      trend: 'neutral' as const,
      icon: <Icon name="ShoppingCart" />
    }
  ]

  const recentActivity = [
    {
      title: 'Nouvelle commande reçue',
      description: 'Commande #1234 du client Jean Dupont',
      time: 'Il y a 2 min',
      type: 'order'
    },
    {
      title: 'Paiement traité',
      description: 'Paiement pour la commande #1233',
      time: 'Il y a 15 min',
      type: 'payment'
    },
    {
      title: 'Nouvel utilisateur inscrit',
      description: 'Nouvel utilisateur: marie@example.com',
      time: 'Il y a 1 heure',
      type: 'user'
    },
    {
      title: 'Rapport généré',
      description: 'Rapport mensuel des ventes prêt',
      time: 'Il y a 2 heures',
      type: 'report'
    }
  ]

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch(trend) {
      case 'up': return 'var(--qwanyx-success)'
      case 'down': return 'var(--qwanyx-destructive)'
      default: return 'var(--qwanyx-text-secondary)'
    }
  }

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'order': return <Icon name="ShoppingCart" />
      case 'payment': return <Icon name="Payment" />
      case 'user': return <Icon name="PersonAdd" />
      case 'report': return <Icon name="Assessment" />
      default: return <Icon name="Info" />
    }
  }

  return (
    <div>
      <div className="qwanyx-mb-8">
        <Heading size="2xl">Tableau de bord</Heading>
        <Text className="qwanyx-mt-2" style={{ color: 'var(--qwanyx-text-secondary)' }}>
          Bienvenue sur votre espace d'administration
        </Text>
      </div>

      {/* Stats Grid */}
      <div className="qwanyx-dashboard-grid qwanyx-dashboard-grid--cols-4 qwanyx-mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="qwanyx-stat-card">
            <div className="qwanyx-flex qwanyx-justify-between qwanyx-items-start qwanyx-mb-3">
              <div style={{ color: 'var(--qwanyx-primary)' }}>
                {stat.icon}
              </div>
              <span 
                className="qwanyx-stat-card__change"
                style={{ color: getTrendColor(stat.trend) }}
              >
                {stat.change}
              </span>
            </div>
            <div className="qwanyx-stat-card__value">{stat.value}</div>
            <div className="qwanyx-stat-card__label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <Grid cols={2} className="qwanyx-gap-6">
        {/* Chart Section */}
        <Card>
          <CardHeader>
            <CardTitle>Aperçu des ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ 
              height: '300px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'var(--qwanyx-muted)',
              borderRadius: 'var(--qwanyx-radius-md)'
            }}>
              <Text>Graphique des ventes (à implémenter)</Text>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="qwanyx-space-y-4">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="qwanyx-flex qwanyx-gap-3 qwanyx-p-3"
                  style={{ 
                    background: 'var(--qwanyx-muted)',
                    borderRadius: 'var(--qwanyx-radius-md)'
                  }}
                >
                  <div style={{ color: 'var(--qwanyx-primary)' }}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="qwanyx-flex-1">
                    <Text weight="semibold" size="sm">{activity.title}</Text>
                    <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                      {activity.description}
                    </Text>
                  </div>
                  <Text size="xs" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                    {activity.time}
                  </Text>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Actions */}
      <Card className="qwanyx-mt-6">
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="qwanyx-flex qwanyx-gap-3 qwanyx-flex-wrap">
            <Button>
              <Icon name="Add" />
              Nouvelle commande
            </Button>
            <Button variant="outline">
              <Icon name="PersonAdd" />
              Ajouter utilisateur
            </Button>
            <Button variant="outline">
              <Icon name="Assessment" />
              Générer rapport
            </Button>
            <Button variant="outline">
              <Icon name="Settings" />
              Paramètres
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}