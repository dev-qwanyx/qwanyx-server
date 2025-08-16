'use client';

import { UserManagement } from '@qwanyx/user-management';
import { Heading, Text } from '@qwanyx/ui';
import { useEffect, useState } from 'react';

export default function UsersPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const config = {
    apiUrl: 'http://localhost:5002',
    workspace: 'default',
    allowAdd: true,
    allowEdit: true,
    allowDelete: true,
    fetchUsers: async () => {
      if (!token) return [];
      
      const response = await fetch('http://localhost:5002/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      return data.users || [];
    }
  };

  if (!token) {
    return (
      <div>
        <div className="qwanyx-mb-8">
          <Heading size="2xl">Utilisateurs</Heading>
          <Text color="secondary">
            Chargement...
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="qwanyx-mb-8">
        <Heading size="2xl">Utilisateurs</Heading>
        <Text color="secondary">
          Gérez les utilisateurs de votre application
        </Text>
      </div>

      <UserManagement config={config} />
    </div>
  );
}