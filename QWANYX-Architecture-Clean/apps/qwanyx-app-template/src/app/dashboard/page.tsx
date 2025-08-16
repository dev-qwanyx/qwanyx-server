'use client';

import { Card, CardHeader, CardTitle, CardContent, Grid, Heading, Text, Button, Icon } from '@qwanyx/ui';

export default function DashboardPage() {
  const stats = [
    {
      label: 'Total des ventes',
      value: '€12,456',
      change: '+12%',
      trend: 'up' as const,
      icon: <Icon name="trending_up" color="primary" />
    },
    {
      label: 'Utilisateurs actifs',
      value: '1,234',
      change: '+5%',
      trend: 'up' as const,
      icon: <Icon name="people" color="primary" />
    },
    {
      label: 'Taux de conversion',
      value: '3.4%',
      change: '-2%',
      trend: 'down' as const,
      icon: <Icon name="analytics" color="primary" />
    },
    {
      label: 'Commandes moyennes',
      value: '€156',
      change: '0%',
      trend: 'neutral' as const,
      icon: <Icon name="shopping_cart" color="primary" />
    }
  ];

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
  ];

  // Removed - using Text color prop instead

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'order': return <Icon name="shopping_cart" color="primary" />;
      case 'payment': return <Icon name="payment" color="primary" />;
      case 'user': return <Icon name="person_add" color="primary" />;
      case 'report': return <Icon name="assessment" color="primary" />;
      default: return <Icon name="info" color="primary" />;
    }
  };

  return (
    <div>
      <div className="qwanyx-mb-8">
        <Heading size="2xl">Tableau de bord</Heading>
        <Text color="secondary">
          Bienvenue sur votre espace d'administration
        </Text>
      </div>

      {/* Stats Grid */}
      <Grid cols={4} gap="lg">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent>
              {stat.icon}
              <Heading size="2xl">{stat.value}</Heading>
              <Text color="secondary">{stat.label}</Text>
              <Text size="sm" color={stat.trend === 'up' ? 'success' : stat.trend === 'down' ? 'error' : 'secondary'}>
                {stat.change}
              </Text>
            </CardContent>
          </Card>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid cols={2} gap="xl">
        {/* Chart Section */}
        <Card>
          <CardHeader>
            <CardTitle>Aperçu des ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <Card>
              <CardContent>
                <Text>Graphique des ventes (à implémenter)</Text>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.map((activity, index) => (
              <Card key={index}>
                <CardContent>
                  {getActivityIcon(activity.type)}
                  <Text weight="semibold" size="sm">{activity.title}</Text>
                  <Text size="sm" color="secondary">
                    {activity.description}
                  </Text>
                  <Text size="xs" color="secondary">
                    {activity.time}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <Grid cols={4} gap="md">
            <Button>
              <Icon name="add" />
              Nouvelle commande
            </Button>
            <Button variant="outline">
              <Icon name="person_add" />
              Ajouter utilisateur
            </Button>
            <Button variant="outline">
              <Icon name="assessment" />
              Générer rapport
            </Button>
            <Button variant="outline">
              <Icon name="settings" />
              Paramètres
            </Button>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}