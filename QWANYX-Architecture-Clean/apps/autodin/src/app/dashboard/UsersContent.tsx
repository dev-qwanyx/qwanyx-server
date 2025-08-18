'use client'

import { useState, useEffect } from 'react'
import { 
  Container, Text, Card, CardContent, CardHeader, CardTitle, 
  Grid, Button, Badge, Input, SimpleSelect, Modal, ModalHeader, 
  ModalTitle, ModalBody, ModalFooter, Form, FormField, Avatar, Flex 
} from '@qwanyx/ui'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: 'owner' | 'admin' | 'member' | 'viewer' | 'guest'
  status: 'active' | 'blocked' | 'suspended' | 'deleted'
  createdAt: string
  lastLogin?: string
  stats: {
    totalListings: number
    totalSales: number
    totalRevenue: number
    rating: number
  }
}

export default function UsersContent() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch real users from API
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('autodin_token')
      
      const response = await fetch('http://localhost:5002/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        // Transform API data to match our User interface
        const transformedUsers = data.users?.map((u: any) => ({
          id: u._id || u.id,
          email: u.email,
          firstName: u.firstName || u.name?.split(' ')[0],
          lastName: u.lastName || u.name?.split(' ')[1],
          role: u.role || 'member',
          status: u.status || 'active',
          createdAt: u.createdAt || new Date().toISOString(),
          lastLogin: u.lastLogin,
          stats: {
            totalListings: u.stats?.totalListings || 0,
            totalSales: u.stats?.totalSales || 0,
            totalRevenue: u.stats?.totalRevenue || 0,
            rating: u.stats?.rating || 0
          }
        })) || []
        
        setUsers(transformedUsers)
        setFilteredUsers(transformedUsers)
      } else {
        // Fallback to mock data if API fails
        loadMockData()
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      loadMockData()
    } finally {
      setLoading(false)
    }
  }

  const loadMockData = () => {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'jean.dupont@example.com',
        firstName: 'Jean',
        lastName: 'Dupont',
        role: 'owner',
        status: 'active',
        createdAt: '2024-01-15',
        lastLogin: '2024-12-10',
        stats: {
          totalListings: 45,
          totalSales: 23,
          totalRevenue: 15420,
          rating: 4.8
        }
      },
      {
        id: '2',
        email: 'marie.martin@example.com',
        firstName: 'Marie',
        lastName: 'Martin',
        role: 'admin',
        status: 'active',
        createdAt: '2024-02-20',
        lastLogin: '2024-12-09',
        stats: {
          totalListings: 12,
          totalSales: 8,
          totalRevenue: 3200,
          rating: 4.5
        }
      },
      {
        id: '3',
        email: 'pierre.bernard@example.com',
        firstName: 'Pierre',
        lastName: 'Bernard',
        role: 'member',
        status: 'active',
        createdAt: '2024-03-10',
        lastLogin: '2024-12-08',
        stats: {
          totalListings: 8,
          totalSales: 3,
          totalRevenue: 890,
          rating: 4.2
        }
      }
    ]
    
    setUsers(mockUsers)
    setFilteredUsers(mockUsers)
  }

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }, [searchQuery, roleFilter, statusFilter, users])

  const handleBlockUser = async (user: User) => {
    try {
      const token = localStorage.getItem('autodin_token')
      const newStatus = user.status === 'blocked' ? 'active' : 'blocked'
      
      const response = await fetch(`http://localhost:5002/api/users/${user.id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setUsers(prev => prev.map(u => 
          u.id === user.id 
            ? { ...u, status: newStatus }
            : u
        ))
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      // Fallback to local update
      setUsers(prev => prev.map(u => 
        u.id === user.id 
          ? { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' }
          : u
      ))
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return
    
    try {
      const token = localStorage.getItem('autodin_token')
      
      const response = await fetch(`http://localhost:5002/api/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setUsers(prev => prev.filter(u => u.id !== selectedUser.id))
        setShowDeleteModal(false)
        setSelectedUser(null)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      // Fallback to local delete
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id))
      setShowDeleteModal(false)
      setSelectedUser(null)
    }
  }

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('autodin_token')
      
      const response = await fetch(`http://localhost:5002/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      })

      if (response.ok) {
        setUsers(prev => prev.map(u => 
          u.id === userId 
            ? { ...u, role: newRole as User['role'] }
            : u
        ))
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      // Fallback to local update
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, role: newRole as User['role'] }
          : u
      ))
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'error'
      case 'admin': return 'warning'
      case 'member': return 'primary'
      case 'viewer': return 'secondary'
      default: return 'default'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'blocked': return 'error'
      case 'suspended': return 'warning'
      default: return 'default'
    }
  }

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <Text size="lg">Chargement des utilisateurs...</Text>
        </div>
      </Container>
    )
  }

  return (
    <div>
      {/* Stats Cards */}
      <Grid cols={4} style={{ marginBottom: '1.5rem', gap: '1rem' }}>
        <Card>
          <CardContent style={{ padding: '0.75rem' }}>
            <Text size="xs" color="secondary">Total</Text>
            <Text size="lg" weight="bold">{users.length}</Text>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ padding: '0.75rem' }}>
            <Text size="xs" color="secondary">Actifs</Text>
            <Text size="lg" weight="bold" style={{ color: '#27ae60' }}>
              {users.filter(u => u.status === 'active').length}
            </Text>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ padding: '0.75rem' }}>
            <Text size="xs" color="secondary">Bloqués</Text>
            <Text size="lg" weight="bold" style={{ color: '#e74c3c' }}>
              {users.filter(u => u.status === 'blocked').length}
            </Text>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{ padding: '0.75rem' }}>
            <Text size="xs" color="secondary">Nouveaux</Text>
            <Text size="lg" weight="bold" style={{ color: '#3498db' }}>
              {users.filter(u => {
                const createdDate = new Date(u.createdAt)
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return createdDate > weekAgo
              }).length}
            </Text>
          </CardContent>
        </Card>
      </Grid>

      {/* Filters */}
      <Card style={{ marginBottom: '2rem' }}>
        <CardContent>
          <Grid cols={4} style={{ gap: '1rem', alignItems: 'end' }}>
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 2 }}
            />
            <SimpleSelect
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Tous les rôles</option>
              <option value="owner">Propriétaire</option>
              <option value="admin">Administrateur</option>
              <option value="member">Membre</option>
              <option value="viewer">Observateur</option>
              <option value="guest">Invité</option>
            </SimpleSelect>
            <SimpleSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="blocked">Bloqué</option>
              <option value="suspended">Suspendu</option>
            </SimpleSelect>
            <Button 
              variant="primary"
              onClick={() => setShowAddModal(true)}
            >
              + Ajouter un utilisateur
            </Button>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgb(var(--qwanyx-border))' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>
                    <Text size="sm" weight="semibold">Utilisateur</Text>
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>
                    <Text size="sm" weight="semibold">Rôle</Text>
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>
                    <Text size="sm" weight="semibold">Statut</Text>
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>
                    <Text size="sm" weight="semibold">Annonces</Text>
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>
                    <Text size="sm" weight="semibold">Ventes</Text>
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>
                    <Text size="sm" weight="semibold">Revenus</Text>
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>
                    <Text size="sm" weight="semibold">Note</Text>
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center' }}>
                    <Text size="sm" weight="semibold">Actions</Text>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id}
                    style={{ 
                      borderBottom: '1px solid rgb(var(--qwanyx-border))',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(var(--qwanyx-primary), 0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <td style={{ padding: '1rem' }}>
                      <Flex align="center" gap="sm">
                        <Avatar 
                          name={`${user.firstName || ''} ${user.lastName || ''}`}
                          size="sm"
                        />
                        <div>
                          <Text size="sm" weight="medium">
                            {user.firstName} {user.lastName}
                          </Text>
                          <Text size="xs" color="secondary">
                            {user.email}
                          </Text>
                        </div>
                      </Flex>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <SimpleSelect
                        value={user.role}
                        onChange={(e) => handleChangeRole(user.id, e.target.value)}
                        size="sm"
                        style={{ minWidth: '120px' }}
                        disabled={user.role === 'owner'}
                      >
                        <option value="owner">Propriétaire</option>
                        <option value="admin">Admin</option>
                        <option value="member">Membre</option>
                        <option value="viewer">Observateur</option>
                        <option value="guest">Invité</option>
                      </SimpleSelect>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <Badge color={getStatusBadgeColor(user.status)}>
                        {user.status === 'active' ? 'Actif' : 
                         user.status === 'blocked' ? 'Bloqué' : 
                         user.status === 'suspended' ? 'Suspendu' : user.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <Text size="sm">{user.stats.totalListings}</Text>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <Text size="sm">{user.stats.totalSales}</Text>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <Text size="sm" weight="semibold">
                        €{user.stats.totalRevenue.toLocaleString()}
                      </Text>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <Badge size="sm" color={user.stats.rating >= 4 ? 'success' : 'warning'}>
                        ⭐ {user.stats.rating || '-'}
                      </Badge>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <Flex gap="sm" justify="center">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowEditModal(true)
                          }}
                        >
                          Voir
                        </Button>
                        <Button 
                          size="sm" 
                          variant={user.status === 'blocked' ? 'success' : 'warning'}
                          onClick={() => handleBlockUser(user)}
                          disabled={user.role === 'owner'}
                        >
                          {user.status === 'blocked' ? 'Débloquer' : 'Bloquer'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="error"
                          onClick={() => {
                            setSelectedUser(user)
                            setShowDeleteModal(true)
                          }}
                          disabled={user.role === 'owner'}
                        >
                          Supprimer
                        </Button>
                      </Flex>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <ModalHeader>
          <ModalTitle>Ajouter un utilisateur</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => {
            e.preventDefault()
            setShowAddModal(false)
          }}>
            <FormField
              label="Email"
              name="email"
              type="email"
              required
              placeholder="utilisateur@example.com"
            />
            <FormField
              label="Prénom"
              name="firstName"
              required
              placeholder="Jean"
            />
            <FormField
              label="Nom"
              name="lastName"
              required
              placeholder="Dupont"
            />
            <div style={{ marginBottom: '1rem' }}>
              <Text size="sm" style={{ marginBottom: '0.5rem', display: 'block' }}>
                Rôle
              </Text>
              <SimpleSelect name="role" required>
                <option value="member">Membre</option>
                <option value="admin">Administrateur</option>
                <option value="viewer">Observateur</option>
              </SimpleSelect>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowAddModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={() => setShowAddModal(false)}>
            Ajouter
          </Button>
        </ModalFooter>
      </Modal>

      {selectedUser && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
          <ModalHeader>
            <ModalTitle>Détails de l'utilisateur</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Flex align="center" gap="md">
                <Avatar 
                  name={`${selectedUser.firstName} ${selectedUser.lastName}`}
                  size="lg"
                />
                <div>
                  <Text size="lg" weight="bold">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </Text>
                  <Text size="sm" color="secondary">{selectedUser.email}</Text>
                  <Badge color={getRoleBadgeColor(selectedUser.role)}>
                    {selectedUser.role}
                  </Badge>
                </div>
              </Flex>
              
              <Card>
                <CardContent>
                  <Grid cols={2} style={{ gap: '1rem' }}>
                    <div>
                      <Text size="xs" color="secondary">Membre depuis</Text>
                      <Text size="sm">{selectedUser.createdAt}</Text>
                    </div>
                    <div>
                      <Text size="xs" color="secondary">Dernière connexion</Text>
                      <Text size="sm">{selectedUser.lastLogin || 'Jamais'}</Text>
                    </div>
                    <div>
                      <Text size="xs" color="secondary">Total des ventes</Text>
                      <Text size="sm" weight="bold">€{selectedUser.stats.totalRevenue}</Text>
                    </div>
                    <div>
                      <Text size="xs" color="secondary">Note moyenne</Text>
                      <Text size="sm">⭐ {selectedUser.stats.rating || '-'}/5</Text>
                    </div>
                  </Grid>
                </CardContent>
              </Card>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Fermer
            </Button>
          </ModalFooter>
        </Modal>
      )}

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <ModalHeader>
          <ModalTitle>Confirmer la suppression</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Text>
            Êtes-vous sûr de vouloir supprimer l'utilisateur {selectedUser?.firstName} {selectedUser?.lastName}?
            Cette action est irréversible.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="error" onClick={handleDeleteUser}>
            Supprimer définitivement
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}