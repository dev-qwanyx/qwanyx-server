import React, { useState, useEffect } from 'react'
import {
  Card,
  Button,
  Input,
  Text,
  Heading,
  Flex,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Icon,
  Tooltip,
  Switch,
  UserProfile,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@qwanyx/ui'
import { getApiUrl } from '../config/api.config'

interface DigitalHuman {
  _id?: string
  email: string
  name: string
  firstName: string
  type: 'DH'
  system: 'THOT'
  workspace: string
  active: boolean
  created: Date
  stats?: {
    emailsProcessed: number
    avgResponseTime: number
    satisfactionRate: number
  }
}

export const DigitalHumansPage: React.FC = () => {
  const [digitalHumans, setDigitalHumans] = useState<DigitalHuman[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [_currentUserRole, setCurrentUserRole] = useState<string>('particulier')
  const [expandedDH] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDH, setEditingDH] = useState<DigitalHuman | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    firstName: ''
  })

  const API_URL = getApiUrl()
  const WORKSPACE = 'autodin'

  // Convert email to collection name format
  const emailToCollectionName = (email: string) => {
    return `${email.replace('@', '-').replace(/\./g, '-')}-memory`
  }

  // Fetch Digital Humans from database
  useEffect(() => {
    fetchDigitalHumans()
    // Get current user role (for display purposes, not restrictions)
    const storedUser = localStorage.getItem('autodin_user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      const token = localStorage.getItem('autodin_token')
      // Fetch users to get the current role
      fetch(`${API_URL}/users`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        const users = Array.isArray(data) ? data : (data.users || [])
        const currentUser = users.find((u: any) => u.email === user.email)
        if (currentUser && currentUser.role) {
          setCurrentUserRole(currentUser.role)
          console.log('Current user role in Digital Team:', currentUser.role)
        }
      })
      .catch(err => console.error('Error fetching user role:', err))
    }
  }, [])

  const fetchDigitalHumans = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem('autodin_token')
      // Fetch all users and filter for type: 'DH' on client side
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch Digital Humans')
      }
      
      const data = await response.json()
      // Handle both array and object response formats
      const users = Array.isArray(data) ? data : (data.users || [])
      // Filter for DH users on client side
      const dhUsers = users.filter((user: any) => user.type === 'DH')
      
      setDigitalHumans(dhUsers.map((dh: any) => ({
        ...dh,
        _id: dh._id || dh.id,
        created: new Date(dh.created_at || dh.created),
        stats: dh.stats || {
          emailsProcessed: 0,
          avgResponseTime: 0,
          satisfactionRate: 0
        }
      })))
    } catch (err) {
      console.error('Error fetching Digital Humans:', err)
      setError('Erreur lors du chargement des Digital Humans')
    } finally {
      setLoading(false)
    }
  }


  const handleCreateDH = () => {
    setEditingDH(null)
    setFormData({
      email: '',
      name: '',
      firstName: ''
    })
    setIsModalOpen(true)
  }

  const handleEditDH = (dh: DigitalHuman) => {
    // Store the complete DH data in sessionStorage
    sessionStorage.setItem('editing_dh', JSON.stringify(dh))
    
    // Open full-screen editor - only need the ID in URL for reference
    window.location.href = `/digital-human-editor?id=${dh._id}`
  }

  const handleSaveDH = async () => {
    try {
      if (editingDH) {
        // Update existing DH
        const response = await fetch(`${API_URL}/users/${editingDH._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            firstName: formData.firstName
          })
        })
        
        if (!response.ok) {
          throw new Error('Failed to update Digital Human')
        }
        
        // Refresh list
        await fetchDigitalHumans()
      } else {
        // Create new DH using the register endpoint
        const response = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            workspace: WORKSPACE,
            metadata: {
              name: formData.name,
              firstName: formData.firstName,
              first_name: formData.firstName,
              last_name: formData.name,
              type: 'DH',
              system: 'THOT',
              active: true,
              permissions: [
                'email:read',
                'email:send',
                'memory:read',
                'memory:write'
              ]
            }
          })
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create Digital Human')
        }
        
        await response.json()
        
        // Create memory collection for the DH
        // The collection name will be: dh_email-with-dashes
        const collectionName = emailToCollectionName(formData.email)
        // TODO: We need to create an API endpoint to create this collection
        console.log(`Need to create collection: ${WORKSPACE}.${collectionName}`)
        
        // Refresh list
        await fetchDigitalHumans()
      }
      
      setIsModalOpen(false)
    } catch (err: any) {
      console.error('Error saving Digital Human:', err)
      alert(err.message || 'Erreur lors de la sauvegarde')
    }
  }

  const handleDeleteDH = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce Digital Human?')) {
      try {
        const dh = digitalHumans.find(d => d._id === id)
        if (!dh) return
        
        // Delete user
        const response = await fetch(`${API_URL}/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to delete Digital Human')
        }
        
        // Delete memory collection
        await fetch(`${API_URL}/api/workspaces/${WORKSPACE}/dh/${dh.email}/memory`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        // Refresh list
        await fetchDigitalHumans()
      } catch (err) {
        console.error('Error deleting Digital Human:', err)
        alert('Erreur lors de la suppression')
      }
    }
  }

  const handleToggleActive = async (id: string) => {
    try {
      const dh = digitalHumans.find(d => d._id === id)
      if (!dh) return
      
      const response = await fetch(`${API_URL}/api/workspaces/${WORKSPACE}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          active: !dh.active
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to toggle Digital Human status')
      }
      
      // Refresh list
      await fetchDigitalHumans()
    } catch (err) {
      console.error('Error toggling Digital Human status:', err)
      alert('Erreur lors du changement de statut')
    }
  }

  if (loading) {
    return null
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <Text size="lg" style={{ color: 'var(--qwanyx-text-danger)' }}>{error}</Text>
        <Button onClick={fetchDigitalHumans} style={{ marginTop: '1rem' }}>Réessayer</Button>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: '0px' }}>
      <div style={{ marginBottom: '0.5rem' }}>
        <div>
          <Heading size="2xl">Digital Team</Heading>
          <Text style={{ marginTop: '0.5rem', color: 'var(--qwanyx-text-secondary)' }}>
            Gérez votre équipe digitale
          </Text>
        </div>
      </div>

      {/* Statistiques globales */}
      <Flex gap="xl" style={{ marginTop: '0px', marginBottom: '0.5rem' }}>
        <Text size="sm">
          <strong>Total DH:</strong> {digitalHumans.length}
        </Text>
        <Text size="sm">
          <strong>Actifs:</strong> {digitalHumans.filter(dh => dh.active).length}
        </Text>
        <Text size="sm">
          <strong>Emails traités:</strong> {digitalHumans.length > 0 
            ? digitalHumans.reduce((acc, dh) => acc + (dh.stats?.emailsProcessed || 0), 0)
            : 0
          }
        </Text>
        <Text size="sm">
          <strong>Satisfaction moy.:</strong> {digitalHumans.length > 0
            ? Math.round(
                digitalHumans.reduce((acc, dh) => acc + (dh.stats?.satisfactionRate || 0), 0) / 
                digitalHumans.length
              )
            : 0
          }%
        </Text>
      </Flex>

      {/* Liste des Digital Humans avec tabs */}
      <Tabs defaultValue="active" fullWidth style={{ marginTop: '0px' }}>
        <TabsList fullWidth>
          <TabsTrigger value="active">
            Actifs ({digitalHumans.filter(dh => dh.active).length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactifs ({digitalHumans.filter(dh => !dh.active).length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Tous ({digitalHumans.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {/* Bouton ajouter sous les tabs */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', marginBottom: '1rem' }}>
            <Button onClick={handleCreateDH} variant="ghost">
              <Flex align="center" gap="sm">
                <span>+</span>
                <span>Ajouter un membre</span>
              </Flex>
            </Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {digitalHumans.filter(dh => dh.active).map(dh => (
              <Card key={dh._id} style={{ padding: '20px', backgroundColor: 'rgb(248, 248, 248)', border: '1px solid rgb(229, 231, 235)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <UserProfile
                      user={{
                        name: `${dh.firstName} ${dh.name}`,
                        email: dh.email,
                        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${dh.firstName}${dh.name}`
                      }}
                      size="lg"
                      showEmail={true}
                    />
                    <Flex gap="lg" style={{ paddingLeft: '56px' }}>
                      <Text size="sm">
                        <strong>Emails:</strong> {dh.stats?.emailsProcessed || 0}
                      </Text>
                      <Text size="sm">
                        <strong>Temps réponse:</strong> {dh.stats?.avgResponseTime || 0}s
                      </Text>
                      <Text size="sm">
                        <strong>Satisfaction:</strong> {dh.stats?.satisfactionRate || 0}%
                      </Text>
                      <Text size="sm">
                        <strong>Créé le:</strong> {new Date(dh.created).toLocaleDateString()}
                      </Text>
                    </Flex>
                  </div>
                  
                  <Flex gap="md" align="center">
                    <Tooltip content="Modifier">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEditDH(dh)}
                        style={{ padding: '0.5rem' }}
                      >
                        <Icon name="Edit" size="md" />
                      </Button>
                    </Tooltip>
                    
                    <Tooltip content={dh.active ? 'Désactiver' : 'Activer'}>
                      <Switch
                        checked={dh.active}
                        onChange={() => handleToggleActive(dh._id!)}
                      />
                    </Tooltip>
                    
                    <Tooltip content="Supprimer">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDeleteDH(dh._id!)}
                        style={{ 
                        padding: '0.5rem',
                        color: 'var(--qwanyx-text-danger)' 
                      }}
                    >
                      <Icon name="Delete" size="md" />
                    </Button>
                  </Tooltip>
                  </Flex>
                </div>
                
                {/* Tabs d'édition - affichés seulement si cette carte est étendue */}
                {expandedDH === dh._id && (
                  <div style={{ marginTop: '20px', borderTop: '1px solid rgb(229, 231, 235)', paddingTop: '20px' }}>
                    <Tabs defaultValue="personality" fullWidth>
                      <TabsList fullWidth>
                        <TabsTrigger value="personality">Personnalité</TabsTrigger>
                        <TabsTrigger value="roles">Rôles</TabsTrigger>
                        <TabsTrigger value="jobs">Métiers</TabsTrigger>
                        <TabsTrigger value="process">Process</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="personality">
                        <div style={{ padding: '20px' }}>
                          <Heading size="lg" style={{ marginBottom: '10px' }}>Personnalité</Heading>
                          <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</Text>
                          <div style={{ marginTop: '15px' }}>
                            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                              • Trait principal: Professionnel et courtois<br/>
                              • Style de communication: Formel avec une touche personnelle<br/>
                              • Ton: Chaleureux mais respectueux<br/>
                              • Approche: Solution-oriented
                            </Text>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="roles">
                        <div style={{ padding: '20px' }}>
                          <Heading size="lg" style={{ marginBottom: '10px' }}>Rôles</Heading>
                          <Text>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.</Text>
                          <div style={{ marginTop: '15px' }}>
                            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                              • Agent de support client<br/>
                              • Assistant commercial<br/>
                              • Conseiller technique<br/>
                              • Gestionnaire de réclamations
                            </Text>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="jobs">
                        <div style={{ padding: '20px' }}>
                          <Heading size="lg" style={{ marginBottom: '10px' }}>Métiers</Heading>
                          <Text>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</Text>
                          <div style={{ marginTop: '15px' }}>
                            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                              • Automobile - Vente de pièces détachées<br/>
                              • Service après-vente<br/>
                              • Expertise technique mécanique<br/>
                              • Conseil en réparation
                            </Text>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="process">
                        <div style={{ padding: '20px' }}>
                          <Heading size="lg" style={{ marginBottom: '10px' }}>Process</Heading>
                          <Text>Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</Text>
                          <div style={{ marginTop: '15px' }}>
                            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                              1. Réception et analyse de l'email<br/>
                              2. Identification du type de demande<br/>
                              3. Recherche dans la base de connaissances<br/>
                              4. Formulation de la réponse personnalisée<br/>
                              5. Validation et envoi
                            </Text>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </Card>
            ))}
            {digitalHumans.filter(dh => dh.active).length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <Text size="lg" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                  Aucun membre actif
                </Text>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="inactive">
          {/* Bouton ajouter sous les tabs */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', marginBottom: '1rem' }}>
            <Button onClick={handleCreateDH} variant="ghost">
              <Flex align="center" gap="sm">
                <span>+</span>
                <span>Ajouter un membre</span>
              </Flex>
            </Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {digitalHumans.filter(dh => !dh.active).map(dh => (
              <Card key={dh._id} style={{ padding: '20px', backgroundColor: 'rgb(248, 248, 248)', border: '1px solid rgb(229, 231, 235)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <UserProfile
                      user={{
                        name: `${dh.firstName} ${dh.name}`,
                        email: dh.email,
                        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${dh.firstName}${dh.name}`
                      }}
                      size="lg"
                      showEmail={true}
                    />
                    <Flex gap="lg" style={{ paddingLeft: '56px' }}>
                      <Text size="sm">
                        <strong>Emails:</strong> {dh.stats?.emailsProcessed || 0}
                      </Text>
                      <Text size="sm">
                        <strong>Temps réponse:</strong> {dh.stats?.avgResponseTime || 0}s
                      </Text>
                      <Text size="sm">
                        <strong>Satisfaction:</strong> {dh.stats?.satisfactionRate || 0}%
                      </Text>
                      <Text size="sm">
                        <strong>Créé le:</strong> {new Date(dh.created).toLocaleDateString()}
                      </Text>
                    </Flex>
                  </div>
                  
                  <Flex gap="md" align="center">
                    <Tooltip content="Modifier">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEditDH(dh)}
                        style={{ padding: '0.5rem' }}
                      >
                        <Icon name="Edit" size="md" />
                      </Button>
                    </Tooltip>
                    
                    <Tooltip content={dh.active ? 'Désactiver' : 'Activer'}>
                      <Switch
                        checked={dh.active}
                        onChange={() => handleToggleActive(dh._id!)}
                      />
                    </Tooltip>
                    
                    <Tooltip content="Supprimer">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDeleteDH(dh._id!)}
                        style={{ 
                        padding: '0.5rem',
                        color: 'var(--qwanyx-text-danger)' 
                      }}
                    >
                      <Icon name="Delete" size="md" />
                    </Button>
                  </Tooltip>
                  </Flex>
                </div>
                
                {/* Tabs d'édition - affichés seulement si cette carte est étendue */}
                {expandedDH === dh._id && (
                  <div style={{ marginTop: '20px', borderTop: '1px solid rgb(229, 231, 235)', paddingTop: '20px' }}>
                    <Tabs defaultValue="personality" fullWidth>
                      <TabsList fullWidth>
                        <TabsTrigger value="personality">Personnalité</TabsTrigger>
                        <TabsTrigger value="roles">Rôles</TabsTrigger>
                        <TabsTrigger value="jobs">Métiers</TabsTrigger>
                        <TabsTrigger value="process">Process</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="personality">
                        <div style={{ padding: '20px' }}>
                          <Heading size="lg" style={{ marginBottom: '10px' }}>Personnalité</Heading>
                          <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</Text>
                          <div style={{ marginTop: '15px' }}>
                            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                              • Trait principal: Professionnel et courtois<br/>
                              • Style de communication: Formel avec une touche personnelle<br/>
                              • Ton: Chaleureux mais respectueux<br/>
                              • Approche: Solution-oriented
                            </Text>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="roles">
                        <div style={{ padding: '20px' }}>
                          <Heading size="lg" style={{ marginBottom: '10px' }}>Rôles</Heading>
                          <Text>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.</Text>
                          <div style={{ marginTop: '15px' }}>
                            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                              • Agent de support client<br/>
                              • Assistant commercial<br/>
                              • Conseiller technique<br/>
                              • Gestionnaire de réclamations
                            </Text>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="jobs">
                        <div style={{ padding: '20px' }}>
                          <Heading size="lg" style={{ marginBottom: '10px' }}>Métiers</Heading>
                          <Text>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</Text>
                          <div style={{ marginTop: '15px' }}>
                            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                              • Automobile - Vente de pièces détachées<br/>
                              • Service après-vente<br/>
                              • Expertise technique mécanique<br/>
                              • Conseil en réparation
                            </Text>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="process">
                        <div style={{ padding: '20px' }}>
                          <Heading size="lg" style={{ marginBottom: '10px' }}>Process</Heading>
                          <Text>Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</Text>
                          <div style={{ marginTop: '15px' }}>
                            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                              1. Réception et analyse de l'email<br/>
                              2. Identification du type de demande<br/>
                              3. Recherche dans la base de connaissances<br/>
                              4. Formulation de la réponse personnalisée<br/>
                              5. Validation et envoi
                            </Text>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </Card>
            ))}
            {digitalHumans.filter(dh => !dh.active).length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <Text size="lg" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                  Aucun membre inactif
                </Text>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="all">
          {/* Bouton ajouter sous les tabs */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', marginBottom: '1rem' }}>
            <Button onClick={handleCreateDH} variant="ghost">
              <Flex align="center" gap="sm">
                <span>+</span>
                <span>Ajouter un membre</span>
              </Flex>
            </Button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {digitalHumans.map(dh => (
              <Card key={dh._id} style={{ padding: '20px', backgroundColor: 'rgb(248, 248, 248)', border: '1px solid rgb(229, 231, 235)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <UserProfile
                      user={{
                        name: `${dh.firstName} ${dh.name}`,
                        email: dh.email,
                        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${dh.firstName}${dh.name}`
                      }}
                      size="lg"
                      showEmail={true}
                    />
                    <Flex gap="lg" style={{ paddingLeft: '56px' }}>
                      <Text size="sm">
                        <strong>Emails:</strong> {dh.stats?.emailsProcessed || 0}
                      </Text>
                      <Text size="sm">
                        <strong>Temps réponse:</strong> {dh.stats?.avgResponseTime || 0}s
                      </Text>
                      <Text size="sm">
                        <strong>Satisfaction:</strong> {dh.stats?.satisfactionRate || 0}%
                      </Text>
                      <Text size="sm">
                        <strong>Créé le:</strong> {new Date(dh.created).toLocaleDateString()}
                      </Text>
                    </Flex>
                  </div>
                  
                  <Flex gap="md" align="center">
                    <Tooltip content="Modifier">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleEditDH(dh)}
                        style={{ padding: '0.5rem' }}
                      >
                        <Icon name="Edit" size="md" />
                      </Button>
                    </Tooltip>
                    
                    <Tooltip content={dh.active ? 'Désactiver' : 'Activer'}>
                      <Switch
                        checked={dh.active}
                        onChange={() => handleToggleActive(dh._id!)}
                      />
                    </Tooltip>
                    
                    <Tooltip content="Supprimer">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDeleteDH(dh._id!)}
                        style={{ 
                        padding: '0.5rem',
                        color: 'var(--qwanyx-text-danger)' 
                      }}
                    >
                      <Icon name="Delete" size="md" />
                    </Button>
                  </Tooltip>
                  </Flex>
                </div>
                
                {/* Tabs d'édition - affichés seulement si cette carte est étendue */}
                {expandedDH === dh._id && (
                  <div style={{ marginTop: '20px', borderTop: '1px solid rgb(229, 231, 235)', paddingTop: '20px' }}>
                    <Tabs defaultValue="personality" fullWidth>
                      <TabsList fullWidth>
                        <TabsTrigger value="personality">Personnalité</TabsTrigger>
                        <TabsTrigger value="roles">Rôles</TabsTrigger>
                        <TabsTrigger value="jobs">Métiers</TabsTrigger>
                        <TabsTrigger value="process">Process</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="personality">
                        <div style={{ padding: '20px' }}>
                          <Heading size="lg" style={{ marginBottom: '10px' }}>Personnalité</Heading>
                          <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</Text>
                          <div style={{ marginTop: '15px' }}>
                            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                              • Trait principal: Professionnel et courtois<br/>
                              • Style de communication: Formel avec une touche personnelle<br/>
                              • Ton: Chaleureux mais respectueux<br/>
                              • Approche: Solution-oriented
                            </Text>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="roles">
                        <div style={{ padding: '20px' }}>
                          <Heading size="lg" style={{ marginBottom: '10px' }}>Rôles</Heading>
                          <Text>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.</Text>
                          <div style={{ marginTop: '15px' }}>
                            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                              • Agent de support client<br/>
                              • Assistant commercial<br/>
                              • Conseiller technique<br/>
                              • Gestionnaire de réclamations
                            </Text>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="jobs">
                        <div style={{ padding: '20px' }}>
                          <Heading size="lg" style={{ marginBottom: '10px' }}>Métiers</Heading>
                          <Text>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</Text>
                          <div style={{ marginTop: '15px' }}>
                            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                              • Automobile - Vente de pièces détachées<br/>
                              • Service après-vente<br/>
                              • Expertise technique mécanique<br/>
                              • Conseil en réparation
                            </Text>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="process">
                        <div style={{ padding: '20px' }}>
                          <Heading size="lg" style={{ marginBottom: '10px' }}>Process</Heading>
                          <Text>Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</Text>
                          <div style={{ marginTop: '15px' }}>
                            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                              1. Réception et analyse de l'email<br/>
                              2. Identification du type de demande<br/>
                              3. Recherche dans la base de connaissances<br/>
                              4. Formulation de la réponse personnalisée<br/>
                              5. Validation et envoi
                            </Text>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </Card>
            ))}
            {digitalHumans.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <Text size="lg" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                  Aucun membre dans l'équipe
                </Text>
                <Button onClick={handleCreateDH} variant="primary" style={{ marginTop: '1rem' }}>
                  Créer votre premier membre
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de création/édition */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalHeader>
            <ModalTitle>
              {editingDH ? 'Modifier le membre' : 'Ajouter un membre'}
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <Text className="qwanyx-mb-2">Nom</Text>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nom de famille"
                />
              </div>
              
              <div>
                <Text className="qwanyx-mb-2">Prénom</Text>
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Prénom"
                />
              </div>
              
              <div>
                <Text className="qwanyx-mb-2">Email</Text>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="agent@autodin.com"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Flex gap="md" justify="end">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Annuler
              </Button>
              <Button variant="primary" onClick={handleSaveDH}>
                {editingDH ? 'Enregistrer' : 'Créer'}
              </Button>
            </Flex>
          </ModalFooter>
        </Modal>
      )}
    </div>
  )
}