import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Badge,
  Avatar,
  Text,
  Heading,
  Grid,
  Flex,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  SimpleSelect,
} from '@qwanyx/ui'

interface DigitalHuman {
  _id?: string
  email: string
  name: string
  type: 'DH'
  system: 'THOT'
  role: 'support' | 'commercial' | 'assistant' | 'rh' | 'info' | 'custom'
  workspace: string
  active: boolean
  created: Date
  personality?: {
    tone: 'formal' | 'friendly' | 'casual' | 'professional'
    responseStyle: 'concise' | 'detailed' | 'balanced'
  }
  stats?: {
    emailsProcessed: number
    avgResponseTime: number
    satisfactionRate: number
  }
}

export const DigitalHumansPage: React.FC = () => {
  const [digitalHumans, setDigitalHumans] = useState<DigitalHuman[]>([
    // Données de démonstration
    {
      _id: '1',
      email: 'support@autodin.com',
      name: 'Support Autodin',
      type: 'DH',
      system: 'THOT',
      role: 'support',
      workspace: 'autodin',
      active: true,
      created: new Date('2024-08-01'),
      personality: {
        tone: 'friendly',
        responseStyle: 'balanced'
      },
      stats: {
        emailsProcessed: 1234,
        avgResponseTime: 120,
        satisfactionRate: 92
      }
    },
    {
      _id: '2',
      email: 'commercial@autodin.com',
      name: 'Commercial Autodin',
      type: 'DH',
      system: 'THOT',
      role: 'commercial',
      workspace: 'autodin',
      active: true,
      created: new Date('2024-08-15'),
      personality: {
        tone: 'professional',
        responseStyle: 'detailed'
      },
      stats: {
        emailsProcessed: 567,
        avgResponseTime: 180,
        satisfactionRate: 88
      }
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDH, setEditingDH] = useState<DigitalHuman | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'support' as DigitalHuman['role'],
    tone: 'professional' as NonNullable<DigitalHuman['personality']>['tone'],
    responseStyle: 'balanced' as NonNullable<DigitalHuman['personality']>['responseStyle']
  })

  const roleColors: Record<string, string> = {
    support: 'info',
    commercial: 'success',
    assistant: 'warning',
    rh: 'secondary',
    info: 'primary',
    custom: 'subtle'
  }

  const roleLabels: Record<string, string> = {
    support: 'Support Client',
    commercial: 'Commercial',
    assistant: 'Assistant',
    rh: 'Ressources Humaines',
    info: 'Information',
    custom: 'Personnalisé'
  }

  const handleCreateDH = () => {
    setEditingDH(null)
    setFormData({
      email: '',
      name: '',
      role: 'support',
      tone: 'professional',
      responseStyle: 'balanced'
    })
    setIsModalOpen(true)
  }

  const handleEditDH = (dh: DigitalHuman) => {
    setEditingDH(dh)
    setFormData({
      email: dh.email,
      name: dh.name,
      role: dh.role,
      tone: dh.personality?.tone || 'professional',
      responseStyle: dh.personality?.responseStyle || 'balanced'
    })
    setIsModalOpen(true)
  }

  const handleSaveDH = () => {
    if (editingDH) {
      // Mise à jour
      setDigitalHumans(prev => prev.map(dh => 
        dh._id === editingDH._id 
          ? {
              ...dh,
              ...formData,
              personality: {
                tone: formData.tone,
                responseStyle: formData.responseStyle
              }
            }
          : dh
      ))
    } else {
      // Création
      const newDH: DigitalHuman = {
        _id: Date.now().toString(),
        email: formData.email,
        name: formData.name,
        type: 'DH',
        system: 'THOT',
        role: formData.role,
        workspace: 'autodin',
        active: true,
        created: new Date(),
        personality: {
          tone: formData.tone,
          responseStyle: formData.responseStyle
        },
        stats: {
          emailsProcessed: 0,
          avgResponseTime: 0,
          satisfactionRate: 0
        }
      }
      setDigitalHumans(prev => [...prev, newDH])
    }
    setIsModalOpen(false)
  }

  const handleDeleteDH = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce Digital Human?')) {
      setDigitalHumans(prev => prev.filter(dh => dh._id !== id))
    }
  }

  const handleToggleActive = (id: string) => {
    setDigitalHumans(prev => prev.map(dh => 
      dh._id === id ? { ...dh, active: !dh.active } : dh
    ))
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Flex justify="between" align="center">
          <div>
            <Heading size="2xl">Digital Humans</Heading>
            <Text style={{ marginTop: '0.5rem', color: 'var(--qwanyx-text-secondary)' }}>
              Gérez vos agents intelligents basés sur le système THOT
            </Text>
          </div>
          <Button onClick={handleCreateDH} variant="primary">
            <Flex align="center" gap="sm">
              <span>+</span>
              <span>Créer un DH</span>
            </Flex>
          </Button>
        </Flex>
      </div>

      {/* Statistiques globales */}
      <Grid cols={4} gap="lg" style={{ marginBottom: '2rem' }}>
        <Card>
          <CardContent>
            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>Total DH</Text>
            <Heading size="2xl">{digitalHumans.length}</Heading>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>Actifs</Text>
            <Heading size="2xl">{digitalHumans.filter(dh => dh.active).length}</Heading>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>Emails traités</Text>
            <Heading size="2xl">
              {digitalHumans.reduce((acc, dh) => acc + (dh.stats?.emailsProcessed || 0), 0)}
            </Heading>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>Satisfaction moy.</Text>
            <Heading size="2xl">
              {Math.round(
                digitalHumans.reduce((acc, dh) => acc + (dh.stats?.satisfactionRate || 0), 0) / 
                digitalHumans.length || 0
              )}%
            </Heading>
          </CardContent>
        </Card>
      </Grid>

      {/* Liste des Digital Humans */}
      <Card>
        <CardHeader>
          <CardTitle>Digital Humans actifs</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {digitalHumans.map(dh => (
              <Card key={dh._id} style={{ padding: '1rem' }}>
                <Flex justify="between" align="center">
                  <Flex align="center" gap="lg">
                    <Avatar
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${dh.email}`}
                      alt={dh.name}
                      size="lg"
                    />
                    <div>
                      <Flex align="center" gap="md">
                        <Heading size="lg">{dh.name}</Heading>
                        <Badge variant={dh.active ? 'solid' : 'subtle'}>
                          {dh.active ? 'Actif' : 'Inactif'}
                        </Badge>
                        <Badge variant={roleColors[dh.role] as any}>
                          {roleLabels[dh.role]}
                        </Badge>
                      </Flex>
                      <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                        {dh.email}
                      </Text>
                      <Flex gap="lg" style={{ marginTop: '0.5rem' }}>
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
                  </Flex>
                  
                  <Flex gap="sm">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleToggleActive(dh._id!)}
                    >
                      {dh.active ? 'Désactiver' : 'Activer'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditDH(dh)}
                    >
                      Modifier
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteDH(dh._id!)}
                      style={{ color: 'var(--qwanyx-text-danger)' }}
                    >
                      Supprimer
                    </Button>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </div>

          {digitalHumans.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <Text size="lg" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                Aucun Digital Human créé
              </Text>
              <Text size="sm" style={{ marginTop: '0.5rem', color: 'var(--qwanyx-text-secondary)' }}>
                Créez votre premier agent intelligent pour commencer
              </Text>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de création/édition */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalHeader>
            <ModalTitle>
              {editingDH ? 'Modifier le Digital Human' : 'Créer un Digital Human'}
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <Text className="qwanyx-mb-2">Email</Text>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="agent@autodin.com"
                />
              </div>
              
              <div>
                <Text className="qwanyx-mb-2">Nom</Text>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nom du Digital Human"
                />
              </div>

              <div>
                <Text className="qwanyx-mb-2">Rôle</Text>
                <SimpleSelect
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as DigitalHuman['role'] })}
                  options={[
                    { value: 'support', label: 'Support Client' },
                    { value: 'commercial', label: 'Commercial' },
                    { value: 'assistant', label: 'Assistant' },
                    { value: 'rh', label: 'Ressources Humaines' },
                    { value: 'info', label: 'Information' },
                    { value: 'custom', label: 'Personnalisé' }
                  ]}
                />
              </div>

              <div>
                <Text className="qwanyx-mb-2">Ton</Text>
                <SimpleSelect
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value as NonNullable<DigitalHuman['personality']>['tone'] })}
                  options={[
                    { value: 'formal', label: 'Formel' },
                    { value: 'friendly', label: 'Amical' },
                    { value: 'casual', label: 'Décontracté' },
                    { value: 'professional', label: 'Professionnel' }
                  ]}
                />
              </div>

              <div>
                <Text className="qwanyx-mb-2">Style de réponse</Text>
                <SimpleSelect
                  value={formData.responseStyle}
                  onChange={(e) => setFormData({ ...formData, responseStyle: e.target.value as NonNullable<DigitalHuman['personality']>['responseStyle'] })}
                  options={[
                    { value: 'concise', label: 'Concis' },
                    { value: 'detailed', label: 'Détaillé' },
                    { value: 'balanced', label: 'Équilibré' }
                  ]}
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