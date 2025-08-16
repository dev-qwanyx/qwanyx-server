'use client';

import { Card, CardHeader, CardTitle, CardContent, Heading, Text, Button, Icon, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@qwanyx/ui';

export default function RequestsPage() {
  const requests = {
    pending: [
      {
        id: 1,
        title: 'Demande d\'accès administrateur',
        user: 'Marie Martin',
        date: 'Il y a 2 heures',
        priority: 'high'
      },
      {
        id: 2,
        title: 'Réinitialisation de mot de passe',
        user: 'Pierre Bernard',
        date: 'Il y a 5 heures',
        priority: 'medium'
      },
      {
        id: 3,
        title: 'Augmentation de quota de stockage',
        user: 'Sophie Leroy',
        date: 'Il y a 1 jour',
        priority: 'low'
      }
    ],
    approved: [
      {
        id: 4,
        title: 'Création de nouveau projet',
        user: 'Jean Dupont',
        date: 'Il y a 2 jours',
        approvedBy: 'Admin'
      },
      {
        id: 5,
        title: 'Modification des permissions',
        user: 'Alice Moreau',
        date: 'Il y a 3 jours',
        approvedBy: 'Admin'
      }
    ],
    rejected: [
      {
        id: 6,
        title: 'Suppression de compte',
        user: 'Test User',
        date: 'Il y a 5 jours',
        rejectedBy: 'Admin',
        reason: 'Compte actif avec des données'
      }
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div>
      <div className="qwanyx-mb-8">
        <Heading size="2xl">Demandes</Heading>
        <Text color="secondary">
          Gérez les demandes des utilisateurs
        </Text>
      </div>

      <Card>
        <CardContent className="qwanyx-p-0">
          <Tabs defaultValue="pending">
            <TabsList className="qwanyx-w-full qwanyx-justify-start qwanyx-px-6 qwanyx-pt-6">
              <TabsTrigger value="pending">
                En attente
                <Badge variant="solid" className="qwanyx-ml-2">
                  {requests.pending.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approuvées
                <Badge variant="solid" className="qwanyx-ml-2">
                  {requests.approved.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejetées
                <Badge variant="outline" className="qwanyx-ml-2">
                  {requests.rejected.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="qwanyx-p-6">
              <div className="qwanyx-space-y-4">
                {requests.pending.map((request) => (
                  <div 
                    key={request.id}
                    className="qwanyx-p-4 qwanyx-border qwanyx-rounded-lg qwanyx-border-default"
                  >
                    <div className="qwanyx-flex qwanyx-justify-between qwanyx-items-start">
                      <div>
                        <div className="qwanyx-flex qwanyx-items-center qwanyx-gap-2 qwanyx-mb-2">
                          <Text weight="semibold">{request.title}</Text>
                          <Badge variant={getPriorityColor(request.priority) as any}>
                            {request.priority === 'high' ? 'Urgent' : 
                             request.priority === 'medium' ? 'Normal' : 'Faible'}
                          </Badge>
                        </div>
                        <Text size="sm" color="secondary">
                          Par {request.user} • {request.date}
                        </Text>
                      </div>
                      <div className="qwanyx-flex qwanyx-gap-2">
                        <Button size="sm" variant="primary">
                          <Icon name="check" />
                          Approuver
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Icon name="close" />
                          Rejeter
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="approved" className="qwanyx-p-6">
              <div className="qwanyx-space-y-4">
                {requests.approved.map((request) => (
                  <div 
                    key={request.id}
                    className="qwanyx-p-4 qwanyx-border qwanyx-rounded-lg qwanyx-border-default"
                  >
                    <div className="qwanyx-flex qwanyx-justify-between qwanyx-items-start">
                      <div>
                        <Text weight="semibold" className="qwanyx-mb-2">{request.title}</Text>
                        <Text size="sm" color="secondary">
                          Par {request.user} • {request.date}
                        </Text>
                        <Text size="sm" color="success">
                          Approuvé par {request.approvedBy}
                        </Text>
                      </div>
                      <Badge variant="solid">Approuvée</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rejected" className="qwanyx-p-6">
              <div className="qwanyx-space-y-4">
                {requests.rejected.map((request) => (
                  <div 
                    key={request.id}
                    className="qwanyx-p-4 qwanyx-border qwanyx-rounded-lg qwanyx-border-default"
                  >
                    <div className="qwanyx-flex qwanyx-justify-between qwanyx-items-start">
                      <div>
                        <Text weight="semibold" className="qwanyx-mb-2">{request.title}</Text>
                        <Text size="sm" color="secondary">
                          Par {request.user} • {request.date}
                        </Text>
                        <Text size="sm" color="error">
                          Rejeté par {request.rejectedBy}
                        </Text>
                        <Text size="sm" color="secondary">
                          Raison: {request.reason}
                        </Text>
                      </div>
                      <Badge variant="outline">Rejetée</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}