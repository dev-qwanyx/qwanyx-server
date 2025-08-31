import { useState, useEffect } from 'react'
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  Icon,
  Text,
  Grid
} from '@qwanyx/ui'
import { PartRequest } from '../types'

interface RequestFormProps {
  isOpen: boolean
  onClose: () => void
  request?: PartRequest | null
  onSubmit: (request: Partial<PartRequest>) => Promise<void>
  mode?: 'add' | 'edit'
}

export function RequestForm({ isOpen, onClose, request, onSubmit, mode = 'add' }: RequestFormProps) {
  const [formData, setFormData] = useState<Partial<PartRequest>>({
    title: '',
    description: '',
    partName: '',
    carBrand: '',
    carModel: '',
    year: '',
    urgency: 'medium',
    status: 'open'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (request) {
      setFormData({
        title: request.title || '',
        description: request.description || '',
        partName: request.partName || '',
        carBrand: request.carBrand || '',
        carModel: request.carModel || '',
        year: request.year || '',
        urgency: request.urgency || 'medium',
        status: request.status || 'open'
      })
    } else {
      setFormData({
        title: '',
        description: '',
        partName: '',
        carBrand: '',
        carModel: '',
        year: '',
        urgency: 'medium',
        status: 'open'
      })
    }
    setErrors({})
  }, [request, isOpen])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title) newErrors.title = 'Le titre est requis'
    if (!formData.partName) newErrors.partName = 'Le nom de la pièce est requis'
    if (!formData.carBrand) newErrors.carBrand = 'La marque est requise'
    if (!formData.carModel) newErrors.carModel = 'Le modèle est requis'
    if (!formData.description) newErrors.description = 'La description est requise'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setLoading(true)
    try {
      // For edit mode, include the original request ID and all fields
      const dataToSubmit = mode === 'edit' && request 
        ? { ...request, ...formData }
        : formData
      
      await onSubmit(dataToSubmit)
      // Parent component will handle closing the modal
    } catch (error) {
      console.error('Error submitting request:', error)
      // Keep modal open on error so user can retry
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>
          {mode === 'edit' ? 'Modifier la demande' : 'Nouvelle demande de pièce'}
        </ModalTitle>
      </ModalHeader>
      
      <ModalBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <Text size="sm" style={{ marginBottom: '0.25rem' }}>Nom de la pièce *</Text>
            <Input
              value={formData.partName}
              onChange={(e) => handleChange('partName', e.target.value)}
              placeholder="Ex: Phare avant"
              size="sm"
              error={errors.partName}
            />
          </div>

          <div>
            <Text size="sm" style={{ marginBottom: '0.25rem' }}>Marque *</Text>
            <Input
              value={formData.carBrand}
              onChange={(e) => handleChange('carBrand', e.target.value)}
              placeholder="Ex: Volkswagen"
              size="sm"
              error={errors.carBrand}
            />
          </div>
          
          <div>
            <Text size="sm" style={{ marginBottom: '0.25rem' }}>Modèle *</Text>
            <Input
              value={formData.carModel}
              onChange={(e) => handleChange('carModel', e.target.value)}
              placeholder="Ex: Golf"
              size="sm"
              error={errors.carModel}
            />
          </div>
          
          <div>
            <Text size="sm" style={{ marginBottom: '0.25rem' }}>Année</Text>
            <Input
              value={formData.year}
              onChange={(e) => handleChange('year', e.target.value)}
              placeholder="Ex: 2015"
              size="sm"
              type="text"
            />
          </div>

          <div>
            <Text size="sm" style={{ marginBottom: '0.25rem' }}>Titre de la demande *</Text>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ex: Recherche phare avant gauche"
              size="sm"
              error={errors.title}
            />
          </div>
          
          <div>
            <Text size="sm" style={{ marginBottom: '0.25rem' }}>Urgence</Text>
            <Select
              value={formData.urgency}
              onChange={(e) => handleChange('urgency', e.target.value)}
              size="sm"
              options={[
                { value: 'low', label: 'Faible' },
                { value: 'medium', label: 'Moyenne' },
                { value: 'high', label: 'Urgente' }
              ]}
            />
          </div>

          <div>
            <Text size="sm" style={{ marginBottom: '0.25rem' }}>Description détaillée *</Text>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Décrivez précisément la pièce recherchée, l'état souhaité, etc."
              rows={4}
              error={errors.description}
            />
          </div>

          {mode === 'edit' && (
            <div>
              <Text size="sm" style={{ marginBottom: '0.25rem' }}>Statut</Text>
              <Select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                size="sm"
                options={[
                  { value: 'open', label: 'Ouverte' },
                  { value: 'closed', label: 'Fermée' },
                  { value: 'fulfilled', label: 'Satisfaite' },
                  { value: 'cancelled', label: 'Annulée' }
                ]}
              />
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'En cours...' : mode === 'edit' ? 'Modifier' : 'Créer la demande'}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}