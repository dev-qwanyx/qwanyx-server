import React, { useState } from 'react'
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Text,
  Heading,
  Grid,
  Badge,
  Modal,
  Form,
  Input,
  SimpleSelect,
  Switch,
} from '@qwanyx/ui'
import { useThotContext } from '../providers/ThotProvider'
import { EmailTemplate } from '../types'

export const TemplatesPage: React.FC = () => {
  const { templates, createTemplate, updateTemplate, deleteTemplate } = useThotContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [formData, setFormData] = useState<Partial<EmailTemplate>>({
    name: '',
    subject: '',
    body: '',
    category: 'custom',
    isActive: true,
  })

  const handleOpenModal = (template?: EmailTemplate) => {
    if (template) {
      setEditingTemplate(template)
      setFormData(template)
    } else {
      setEditingTemplate(null)
      setFormData({
        name: '',
        subject: '',
        body: '',
        category: 'custom',
        isActive: true,
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTemplate(null)
    setFormData({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingTemplate) {
      await updateTemplate(editingTemplate.id, formData)
    } else {
      await createTemplate(formData as Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>)
    }
    
    handleCloseModal()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      await deleteTemplate(id)
    }
  }

  const extractVariables = (text: string): string[] => {
    const regex = /\{(\w+)\}/g
    const matches = text.match(regex)
    return matches ? [...new Set(matches.map(m => m.slice(1, -1)))] : []
  }

  const handleBodyChange = (body: string) => {
    const variables = extractVariables(body + ' ' + (formData.subject || ''))
    setFormData({ ...formData, body, variables })
  }

  return (
    <Container>
      <div className="qwanyx-mb-8 qwanyx-flex qwanyx-justify-between qwanyx-items-center">
        <div>
          <Heading size="2xl">Templates d'emails</Heading>
          <Text className="qwanyx-mt-2" style={{ color: 'var(--qwanyx-text-secondary)' }}>
            Gérez vos modèles de réponses automatiques
          </Text>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          Nouveau template
        </Button>
      </div>

      <Grid cols={3} gap="md">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="qwanyx-flex qwanyx-justify-between qwanyx-items-start">
                <CardTitle>{template.name}</CardTitle>
                <Badge variant={template.isActive ? 'solid' : 'outline'}>
                  {template.isActive ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="qwanyx-space-y-2">
                <div>
                  <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                    Catégorie
                  </Text>
                  <Badge variant="solid">{template.category}</Badge>
                </div>
                
                <div>
                  <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                    Sujet
                  </Text>
                  <Text>{template.subject}</Text>
                </div>
                
                {template.variables && template.variables.length > 0 && (
                  <div>
                    <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                      Variables
                    </Text>
                    <div className="qwanyx-flex qwanyx-flex-wrap qwanyx-gap-1">
                      {template.variables.map((variable) => (
                        <Badge key={variable} variant="outline" size="sm">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="qwanyx-flex qwanyx-gap-2 qwanyx-mt-4">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => handleOpenModal(template)}
                  >
                    Modifier
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDelete(template.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </Grid>

      {/* Modal d'édition/création */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingTemplate ? 'Modifier le template' : 'Nouveau template'}
      >
        <Form onSubmit={handleSubmit}>
          <div className="qwanyx-space-y-4">
            <div>
              <Text className="qwanyx-mb-2">Nom du template</Text>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Réponse automatique vacances"
                required
              />
            </div>

            <div>
              <Text className="qwanyx-mb-2">Catégorie</Text>
              <SimpleSelect
                value={formData.category || 'custom'}
                onChange={(value) => setFormData({ ...formData, category: value as any })}
                options={[
                  { value: 'greeting', label: 'Salutation' },
                  { value: 'information', label: 'Information' },
                  { value: 'support', label: 'Support' },
                  { value: 'sales', label: 'Commercial' },
                  { value: 'custom', label: 'Personnalisé' },
                ]}
              />
            </div>

            <div>
              <Text className="qwanyx-mb-2">Sujet</Text>
              <Input
                value={formData.subject || ''}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Re: {original_subject}"
                required
              />
            </div>

            <div>
              <Text className="qwanyx-mb-2">Corps du message</Text>
              <textarea
                className="qwanyx-input qwanyx-w-full qwanyx-min-h-[200px]"
                value={formData.body || ''}
                onChange={(e) => handleBodyChange(e.target.value)}
                placeholder="Bonjour {sender_name},&#10;&#10;Merci pour votre message..."
                required
              />
              <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                Utilisez {`{variable}`} pour créer des variables dynamiques
              </Text>
            </div>

            <div>
              <label className="qwanyx-flex qwanyx-items-center qwanyx-gap-2">
                <Switch
                  checked={formData.isActive || false}
                  onChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Text>Template actif</Text>
              </label>
            </div>

            <div className="qwanyx-flex qwanyx-justify-end qwanyx-gap-2">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button type="submit" variant="primary">
                {editingTemplate ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </Container>
  )
}