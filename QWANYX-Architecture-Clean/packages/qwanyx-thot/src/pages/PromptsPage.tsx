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
  Progress,
} from '@qwanyx/ui'
import { useThotContext } from '../providers/ThotProvider'
import { AiPrompt } from '../types'

export const PromptsPage: React.FC = () => {
  const { prompts, createPrompt, updatePrompt, deletePrompt } = useThotContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<AiPrompt | null>(null)
  const [formData, setFormData] = useState<Partial<AiPrompt>>({
    name: '',
    prompt: '',
    context: '',
    tone: 'professional',
    maxTokens: 500,
    temperature: 0.7,
    isActive: true,
  })

  const handleOpenModal = (prompt?: AiPrompt) => {
    if (prompt) {
      setEditingPrompt(prompt)
      setFormData(prompt)
    } else {
      setEditingPrompt(null)
      setFormData({
        name: '',
        prompt: '',
        context: '',
        tone: 'professional',
        maxTokens: 500,
        temperature: 0.7,
        isActive: true,
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPrompt(null)
    setFormData({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingPrompt) {
      await updatePrompt(editingPrompt.id, formData)
    } else {
      await createPrompt(formData as Omit<AiPrompt, 'id' | 'createdAt' | 'updatedAt'>)
    }
    
    handleCloseModal()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce prompt ?')) {
      await deletePrompt(id)
    }
  }


  return (
    <Container>
      <div className="qwanyx-mb-8 qwanyx-flex qwanyx-justify-between qwanyx-items-center">
        <div>
          <Heading size="2xl">Prompts AI</Heading>
          <Text className="qwanyx-mt-2" style={{ color: 'var(--qwanyx-text-secondary)' }}>
            Configurez les instructions pour l'IA
          </Text>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          Nouveau prompt
        </Button>
      </div>

      <Grid cols={2} gap="md">
        {prompts.map((prompt) => (
          <Card key={prompt.id}>
            <CardHeader>
              <div className="qwanyx-flex qwanyx-justify-between qwanyx-items-start">
                <CardTitle>{prompt.name}</CardTitle>
                <Badge variant={prompt.isActive ? 'solid' : 'outline'}>
                  {prompt.isActive ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="qwanyx-space-y-3">
                <div>
                  <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                    Ton
                  </Text>
                  <Badge variant="subtle">
                    {prompt.tone}
                  </Badge>
                </div>
                
                <div>
                  <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                    Prompt
                  </Text>
                  <Text className="qwanyx-line-clamp-3">
                    {prompt.prompt}
                  </Text>
                </div>

                {prompt.context && (
                  <div>
                    <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                      Contexte
                    </Text>
                    <Text className="qwanyx-line-clamp-2">
                      {prompt.context}
                    </Text>
                  </div>
                )}
                
                <div className="qwanyx-grid qwanyx-grid-cols-2 qwanyx-gap-2">
                  <div>
                    <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                      Max tokens
                    </Text>
                    <Text>{prompt.maxTokens}</Text>
                  </div>
                  <div>
                    <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                      Température
                    </Text>
                    <Progress 
                      value={prompt.temperature * 50} 
                      className="qwanyx-mt-1"
                    />
                    <Text size="sm">{prompt.temperature}</Text>
                  </div>
                </div>
                
                <div className="qwanyx-flex qwanyx-gap-2 qwanyx-mt-4">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => handleOpenModal(prompt)}
                  >
                    Modifier
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDelete(prompt.id)}
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
        title={editingPrompt ? 'Modifier le prompt' : 'Nouveau prompt'}
      >
        <Form onSubmit={handleSubmit}>
          <div className="qwanyx-space-y-4">
            <div>
              <Text className="qwanyx-mb-2">Nom du prompt</Text>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Assistant commercial"
                required
              />
            </div>

            <div>
              <Text className="qwanyx-mb-2">Ton</Text>
              <SimpleSelect
                value={formData.tone || 'professional'}
                onChange={(value) => setFormData({ ...formData, tone: value as any })}
                options={[
                  { value: 'professional', label: 'Professionnel' },
                  { value: 'friendly', label: 'Amical' },
                  { value: 'casual', label: 'Décontracté' },
                  { value: 'formal', label: 'Formel' },
                ]}
              />
            </div>

            <div>
              <Text className="qwanyx-mb-2">Instructions pour l'IA</Text>
              <textarea
                className="qwanyx-input qwanyx-w-full qwanyx-min-h-[150px]"
                value={formData.prompt || ''}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                placeholder="Tu es un assistant professionnel qui répond aux emails..."
                required
              />
            </div>

            <div>
              <Text className="qwanyx-mb-2">Contexte (optionnel)</Text>
              <textarea
                className="qwanyx-input qwanyx-w-full qwanyx-min-h-[100px]"
                value={formData.context || ''}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                placeholder="Entreprise de technologie, secteur B2B..."
              />
            </div>

            <Grid cols={2} gap="md">
              <div>
                <Text className="qwanyx-mb-2">Max tokens</Text>
                <Input
                  type="number"
                  min="50"
                  max="4000"
                  value={formData.maxTokens || 500}
                  onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                />
                <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                  Longueur maximale de la réponse
                </Text>
              </div>

              <div>
                <Text className="qwanyx-mb-2">Température ({formData.temperature || 0.7})</Text>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={formData.temperature || 0.7}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                  className="qwanyx-w-full"
                />
                <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                  0 = Précis, 2 = Créatif
                </Text>
              </div>
            </Grid>

            <div>
              <label className="qwanyx-flex qwanyx-items-center qwanyx-gap-2">
                <Switch
                  checked={formData.isActive || false}
                  onChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Text>Prompt actif</Text>
              </label>
            </div>

            <div className="qwanyx-flex qwanyx-justify-end qwanyx-gap-2">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button type="submit" variant="primary">
                {editingPrompt ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </Container>
  )
}