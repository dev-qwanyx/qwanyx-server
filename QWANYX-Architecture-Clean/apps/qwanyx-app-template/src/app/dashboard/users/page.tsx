'use client';

import { Card, CardHeader, CardTitle, CardContent, Heading, Text, Button, Icon, Badge } from '@qwanyx/ui';

export default function UsersPage() {
  const users = [
    {
      id: 1,
      name: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      role: 'Admin',
      status: 'active',
      lastLogin: 'Il y a 5 min'
    },
    {
      id: 2,
      name: 'Marie Martin',
      email: 'marie.martin@example.com',
      role: 'Utilisateur',
      status: 'active',
      lastLogin: 'Il y a 2 heures'
    },
    {
      id: 3,
      name: 'Pierre Bernard',
      email: 'pierre.bernard@example.com',
      role: 'Utilisateur',
      status: 'inactive',
      lastLogin: 'Il y a 3 jours'
    },
    {
      id: 4,
      name: 'Sophie Leroy',
      email: 'sophie.leroy@example.com',
      role: 'Modérateur',
      status: 'active',
      lastLogin: 'Il y a 1 heure'
    }
  ];

  return (
    <div>
      <div className="qwanyx-mb-8 qwanyx-flex qwanyx-justify-between qwanyx-items-center">
        <div>
          <Heading size="2xl">Utilisateurs</Heading>
          <Text color="secondary">
            Gérez les utilisateurs de votre application
          </Text>
        </div>
        <Button>
          <Icon name="person_add" />
          Ajouter un utilisateur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="qwanyx-overflow-x-auto">
            <table className="qwanyx-w-full">
              <thead>
                <tr className="qwanyx-table-header">
                  <th className="qwanyx-text-left qwanyx-p-3">Nom</th>
                  <th className="qwanyx-text-left qwanyx-p-3">Email</th>
                  <th className="qwanyx-text-left qwanyx-p-3">Rôle</th>
                  <th className="qwanyx-text-left qwanyx-p-3">Statut</th>
                  <th className="qwanyx-text-left qwanyx-p-3">Dernière connexion</th>
                  <th className="qwanyx-text-left qwanyx-p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="qwanyx-table-row">
                    <td className="qwanyx-p-3">
                      <Text weight="semibold">{user.name}</Text>
                    </td>
                    <td className="qwanyx-p-3">
                      <Text>{user.email}</Text>
                    </td>
                    <td className="qwanyx-p-3">
                      <Badge variant={user.role === 'Admin' ? 'solid' : 'outline'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="qwanyx-p-3">
                      <Badge variant={user.status === 'active' ? 'solid' : 'outline'}>
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </td>
                    <td className="qwanyx-p-3">
                      <Text size="sm" color="secondary">
                        {user.lastLogin}
                      </Text>
                    </td>
                    <td className="qwanyx-p-3">
                      <div className="qwanyx-flex qwanyx-gap-2">
                        <Button size="sm" variant="ghost">
                          <Icon name="edit" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Icon name="delete" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}