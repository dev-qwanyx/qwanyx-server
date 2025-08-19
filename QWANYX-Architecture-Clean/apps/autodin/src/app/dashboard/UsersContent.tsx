'use client'

import { useState, useEffect } from 'react'
import { 
  Container, Text, Card, CardContent, CardHeader, CardTitle, 
  Grid, Button, Badge, Input, SimpleSelect, Modal, ModalHeader, 
  ModalTitle, ModalBody, ModalFooter, Form, Avatar, Flex,
  UserProfile, Icon
} from '@qwanyx/ui'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: 'administrateur' | 'particulier' | 'professionnel' | 'partenaire' | 'editeur'
  status: 'active' | 'blocked' | 'suspended' | 'deleted'
  createdAt: string
  lastLogin?: string
  activity?: Array<{
    type: string
    timestamp: string
    ip?: string
    user_agent?: string
    [key: string]: any // Pour les futures propriétés (annonces, etc.)
  }>
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
  const [currentUserRole, setCurrentUserRole] = useState<string>('particulier')

  // Fetch real users from API
  useEffect(() => {
    fetchUsers()
    // Get current user's role
    const userEmail = localStorage.getItem('autodin_user_email')
    if (userEmail) {
      // Will be set when users are loaded
    }
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('autodin_token')
      const workspace = localStorage.getItem('autodin_workspace') || 'autodin'
      
      console.log('Fetching users with token:', token ? 'Present' : 'Missing')
      console.log('Using workspace:', workspace)
      
      const response = await fetch('http://localhost:5002/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Workspace': workspace
        }
      })
      
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Users data received:', data)
        
        // Transform API data to match our User interface
        // L'API retourne directement un array d'utilisateurs
        const usersArray = Array.isArray(data) ? data : (data.users || [])
        console.log('Users array:', usersArray)
        
        const transformedUsers = usersArray.map((u: any) => {
          // Format dates
          const formatDate = (date: any) => {
            if (!date) return null
            const d = date.$date ? new Date(date.$date) : new Date(date)
            if (isNaN(d.getTime())) return null
            return d.toLocaleDateString('fr-FR', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }
          
          return {
            id: u._id?.$oid || u._id || u.id,
            email: u.email,
            firstName: u.first_name || u.firstName || u.name?.split(' ')[0] || '',
            lastName: u.last_name || u.lastName || u.name?.split(' ').slice(1).join(' ') || '',
            role: u.role || 'particulier',
            status: u.is_active ? 'active' : (u.status || 'inactive'),
            createdAt: formatDate(u.created_at || u.createdAt) || 'Inconnue',
            lastLogin: formatDate(u.last_login || u.lastLogin),
            activity: u.activity || [],
            stats: {
              totalListings: u.stats?.totalListings || 0,
              totalSales: u.stats?.totalSales || 0,
              totalRevenue: u.stats?.totalRevenue || 0,
              rating: u.stats?.rating || 0
            }
          }
        })
        
        setUsers(transformedUsers)
        setFilteredUsers(transformedUsers)
        
        // Find current user's role
        const userEmail = localStorage.getItem('autodin_user_email')
        if (userEmail) {
          const currentUser = transformedUsers.find((u: any) => u.email === userEmail)
          if (currentUser) {
            setCurrentUserRole(currentUser.role)
            console.log('Current user role:', currentUser.role)
          }
        }
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
        role: 'administrateur' as const,
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
        role: 'administrateur' as const,
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
        role: 'particulier' as const,
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
    // Optimistic update - change immediately in UI
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, role: newRole as User['role'] }
        : u
    ))
    setFilteredUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, role: newRole as User['role'] }
        : u
    ))

    // Then send to database in background
    try {
      const token = localStorage.getItem('autodin_token')
      const workspace = localStorage.getItem('autodin_workspace') || 'autodin'
      
      console.log('Updating role for user:', userId, 'to:', newRole)
      
      const response = await fetch(`http://localhost:5002/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Workspace': workspace
        },
        body: JSON.stringify({ role: newRole })
      })

      if (!response.ok) {
        // If failed, rollback the change (optional - you said it's ok if it doesn't match)
        console.error('Failed to update role in database:', response.status)
        // Not reverting since user said "c'est pas grave si ça n'a pas vraiment matché"
      } else {
        console.log('Role updated successfully in database')
      }
    } catch (error) {
      console.error('Error updating user role in database:', error)
      // Not reverting since user said "c'est pas grave si ça n'a pas vraiment matché"
    }
  }

  const getRoleOptions = () => {
    const baseOptions = [
      { value: 'particulier', label: 'Particulier' },
      { value: 'professionnel', label: 'Professionnel' },
      { value: 'partenaire', label: 'Partenaire' },
      { value: 'editeur', label: 'Éditeur' }
    ]
    
    // Only show Administrateur option if current user is an admin
    if (currentUserRole === 'administrateur') {
      return [
        { value: 'administrateur', label: 'Administrateur' },
        ...baseOptions
      ]
    }
    
    return baseOptions
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'administrateur': return 'error'
      case 'professionnel': return 'warning'
      case 'partenaire': return 'success'
      case 'editeur': return 'info'
      case 'particulier': return 'primary'
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
              options={[
                { value: 'all', label: 'Tous les rôles' },
                ...(currentUserRole === 'administrateur' ? [{ value: 'administrateur', label: 'Administrateur' }] : []),
                { value: 'particulier', label: 'Particulier' },
                { value: 'professionnel', label: 'Professionnel' },
                { value: 'partenaire', label: 'Partenaire' },
                { value: 'editeur', label: 'Éditeur' }
              ]}
            />
            <SimpleSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'Tous les statuts' },
                { value: 'active', label: 'Actif' },
                { value: 'blocked', label: 'Bloqué' },
                { value: 'suspended', label: 'Suspendu' }
              ]}
            />
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
                    <Text size="sm" weight="semibold"></Text>
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
                      <UserProfile
                        user={{
                          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
                          email: user.email
                        }}
                        size="sm"
                        showEmail={true}
                        orientation="horizontal"
                      />
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <SimpleSelect
                        value={user.role || 'particulier'}
                        onChange={(e) => handleChangeRole(user.id, e.target.value)}
                        selectSize="sm"
                        options={getRoleOptions()}
                        style={{ minWidth: '140px' }}
                      />
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
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowEditModal(true)
                        }}
                        style={{ 
                          padding: '0.5rem',
                          cursor: 'pointer'
                        }}
                      >
                        <Icon name="Eye" size="sm" />
                      </Button>
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
            <div style={{ marginBottom: '1rem' }}>
              <Text size="sm" style={{ marginBottom: '0.5rem', display: 'block' }}>
                Email
              </Text>
              <Input
                name="email"
                type="email"
                required
                placeholder="utilisateur@example.com"
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <Text size="sm" style={{ marginBottom: '0.5rem', display: 'block' }}>
                Prénom
              </Text>
              <Input
                name="firstName"
                required
                placeholder="Jean"
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <Text size="sm" style={{ marginBottom: '0.5rem', display: 'block' }}>
                Nom
              </Text>
              <Input
                name="lastName"
                required
                placeholder="Dupont"
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <Text size="sm" style={{ marginBottom: '0.5rem', display: 'block' }}>
                Rôle
              </Text>
              <SimpleSelect 
                name="role" 
                required
                options={getRoleOptions()}
                defaultValue="particulier"
              />
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <UserProfile
                  user={{
                    name: `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim() || selectedUser.email,
                    email: selectedUser.email
                  }}
                  size="lg"
                  showEmail={true}
                  orientation="horizontal"
                />
                <div style={{ marginTop: '0.5rem', marginLeft: '3.5rem' }}>
                  <Badge color={getRoleBadgeColor(selectedUser.role)}>
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>
              
              <Grid cols={2} style={{ gap: '1.5rem' }}>
                <div>
                  <Text size="xs" weight="bold" style={{ marginBottom: '0.25rem' }}>
                    Membre depuis
                  </Text>
                  <Text size="sm" color="secondary">{selectedUser.createdAt}</Text>
                </div>
                <div>
                  <Text size="xs" weight="bold" style={{ marginBottom: '0.25rem' }}>
                    Dernière connexion
                  </Text>
                  <Text size="sm" color="secondary">{selectedUser.lastLogin || 'Jamais'}</Text>
                </div>
                <div>
                  <Text size="xs" weight="bold" style={{ marginBottom: '0.25rem' }}>
                    Total des ventes
                  </Text>
                  <Text size="sm" color="secondary">€{selectedUser.stats.totalRevenue}</Text>
                </div>
                <div>
                  <Text size="xs" weight="bold" style={{ marginBottom: '0.25rem' }}>
                    Note moyenne
                  </Text>
                  <Text size="sm" color="secondary">⭐ {selectedUser.stats.rating || '-'}/5</Text>
                </div>
                <div>
                  <Text size="xs" weight="bold" style={{ marginBottom: '0.25rem' }}>
                    Annonces publiées
                  </Text>
                  <Text size="sm" color="secondary">{selectedUser.stats.totalListings}</Text>
                </div>
                <div>
                  <Text size="xs" weight="bold" style={{ marginBottom: '0.25rem' }}>
                    Nombre de ventes
                  </Text>
                  <Text size="sm" color="secondary">{selectedUser.stats.totalSales}</Text>
                </div>
              </Grid>
              
              <div style={{ 
                paddingTop: '1rem', 
                borderTop: '1px solid rgb(var(--qwanyx-border))',
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end'
              }}>
                <Button
                  variant={selectedUser.status === 'blocked' ? 'success' : 'warning'}
                  onClick={() => {
                    handleBlockUser(selectedUser)
                    setShowEditModal(false)
                  }}
                  disabled={selectedUser.role === 'administrateur' && currentUserRole !== 'administrateur'}
                >
                  <Icon name={selectedUser.status === 'blocked' ? 'Unlock' : 'Lock'} size="sm" />
                  {selectedUser.status === 'blocked' ? 'Débloquer' : 'Bloquer'}
                </Button>
                <Button
                  variant="error"
                  onClick={() => {
                    setShowEditModal(false)
                    setShowDeleteModal(true)
                  }}
                  disabled={selectedUser.role === 'administrateur' && currentUserRole !== 'administrateur'}
                >
                  <Icon name="Trash" size="sm" />
                  Supprimer
                </Button>
              </div>
            </div>
          </ModalBody>
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