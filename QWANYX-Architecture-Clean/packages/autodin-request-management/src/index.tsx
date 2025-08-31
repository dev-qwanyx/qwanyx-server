'use client'

import React, { useState, useEffect } from 'react'
import { 
  Container, 
  Text, 
  Button, 
  Input, 
  Card, 
  CardContent,
  Grid,
  Badge,
  Form,
  Select
} from '@qwanyx/ui'

interface Request {
  _id?: string
  title: string
  partName: string
  carBrand: string
  carModel?: string
  year?: number
  urgency: 'low' | 'medium' | 'high'
  description?: string
  status?: string
  userId?: string
  createdAt?: string
  workspace?: string
}

const SPU_API_URL = process.env.NEXT_PUBLIC_SPU_API_URL || 'http://localhost:5002'

export function RequestManagement() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Request>({
    title: '',
    partName: '',
    carBrand: '',
    carModel: '',
    year: new Date().getFullYear(),
    urgency: 'medium',
    description: ''
  })

  // Fetch requests on mount
  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${SPU_API_URL}/data/requests?workspace=autodin`)
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const user = localStorage.getItem('autodin_user')
      const userId = user ? JSON.parse(user).id : 'anonymous'
      
      const response = await fetch(`${SPU_API_URL}/data/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspace: 'autodin',
          data: {
            ...formData,
            userId,
            status: 'open'
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Request created:', result)
        
        // Reset form and refresh list
        setFormData({
          title: '',
          partName: '',
          carBrand: '',
          carModel: '',
          year: new Date().getFullYear(),
          urgency: 'medium',
          description: ''
        })
        setShowForm(false)
        fetchRequests()
      } else {
        const error = await response.json()
        console.error('Failed to create request:', error)
        alert(error.error || 'Failed to create request')
      }
    } catch (error) {
      console.error('Error creating request:', error)
      alert('Failed to create request')
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'open': return 'primary'
      case 'processing': return 'warning'
      case 'completed': return 'success'
      case 'cancelled': return 'default'
      default: return 'default'
    }
  }

  if (loading) {
    return (
      <Container padding="lg">
        <Text>Chargement des demandes...</Text>
      </Container>
    )
  }

  return (
    <Container padding="lg">
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Text size="2xl" weight="bold">Gestion des Demandes</Text>
          <Button 
            variant="primary" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Annuler' : 'Nouvelle Demande'}
          </Button>
        </div>

        {showForm && (
          <Card variant="elevated" style={{ marginBottom: '2rem' }}>
            <CardContent>
              <Text size="lg" weight="bold" style={{ marginBottom: '1rem' }}>
                Créer une nouvelle demande
              </Text>
              
              <form onSubmit={handleSubmit}>
                <Grid cols={2} gap="md">
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      <Text size="sm">Titre *</Text>
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Ex: Phare avant Golf 5"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      <Text size="sm">Nom de la pièce *</Text>
                    </label>
                    <Input
                      value={formData.partName}
                      onChange={(e) => setFormData({...formData, partName: e.target.value})}
                      placeholder="Ex: Phare avant"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      <Text size="sm">Marque *</Text>
                    </label>
                    <Input
                      value={formData.carBrand}
                      onChange={(e) => setFormData({...formData, carBrand: e.target.value})}
                      placeholder="Ex: Volkswagen"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      <Text size="sm">Modèle</Text>
                    </label>
                    <Input
                      value={formData.carModel}
                      onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                      placeholder="Ex: Golf 5"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      <Text size="sm">Année</Text>
                    </label>
                    <Input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                      placeholder="2008"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      <Text size="sm">Urgence</Text>
                    </label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({...formData, urgency: e.target.value as 'low' | 'medium' | 'high'})}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        border: '1px solid rgb(var(--border))',
                        backgroundColor: 'rgb(var(--surface))',
                        color: 'rgb(var(--foreground))'
                      }}
                    >
                      <option value="low">Faible</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Urgente</option>
                    </select>
                  </div>
                </Grid>

                <div style={{ marginTop: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    <Text size="sm">Description</Text>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Décrivez votre demande..."
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '0.25rem',
                      border: '1px solid rgb(var(--border))',
                      backgroundColor: 'rgb(var(--surface))',
                      color: 'rgb(var(--foreground))',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <Button type="submit" variant="primary">
                    Créer la demande
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost"
                    onClick={() => setShowForm(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <Text size="sm" color="muted">
            {requests.length} demande{requests.length !== 1 ? 's' : ''} trouvée{requests.length !== 1 ? 's' : ''}
          </Text>
        </div>

        <Grid cols={1} gap="md">
          {requests.map((request) => (
            <Card key={request._id} variant="elevated">
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <Text size="lg" weight="bold">{request.title}</Text>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                      <Badge variant={getUrgencyColor(request.urgency)}>
                        {request.urgency === 'high' ? 'Urgent' : 
                         request.urgency === 'medium' ? 'Moyen' : 'Faible'}
                      </Badge>
                      <Badge variant={getStatusColor(request.status || 'open')}>
                        {request.status || 'open'}
                      </Badge>
                    </div>
                    <Text size="sm" color="muted">
                      {request.carBrand} {request.carModel} {request.year && `(${request.year})`}
                    </Text>
                    {request.description && (
                      <Text size="sm" style={{ marginTop: '0.5rem' }}>
                        {request.description}
                      </Text>
                    )}
                    <Text size="xs" color="muted" style={{ marginTop: '0.5rem' }}>
                      Créé le {request.createdAt ? new Date(request.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button size="sm" variant="ghost">Voir</Button>
                    <Button size="sm" variant="ghost">Modifier</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </Grid>

        {requests.length === 0 && (
          <Card variant="elevated">
            <CardContent>
              <Text align="center" color="muted">
                Aucune demande trouvée. Créez votre première demande !
              </Text>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  )
}

export default RequestManagement