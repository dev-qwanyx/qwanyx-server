import { useState } from 'react'
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
  Text,
  Grid
} from '@qwanyx/ui'
import { Proposal } from '../types'

interface ProposalFormProps {
  isOpen: boolean
  onClose: () => void
  requestId: string
  onSubmit: (proposal: Partial<Proposal>) => Promise<void>
}

export function ProposalForm({ isOpen, onClose, requestId, onSubmit }: ProposalFormProps) {
  const [formData, setFormData] = useState<Partial<Proposal>>({
    requestId,
    price: 0,
    description: '',
    availability: '',
    condition: 'used',
    warranty: '',
    status: 'pending'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.price || formData.price <= 0) newErrors.price = 'Le prix est requis'
    if (!formData.description) newErrors.description = 'La description est requise'
    if (!formData.availability) newErrors.availability = 'La disponibilité est requise'
    if (!formData.condition) newErrors.condition = 'L\'état est requis'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setLoading(true)
    try {
      await onSubmit({ ...formData, requestId })
      onClose()
    } catch (error) {
      console.error('Error submitting proposal:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>
          Faire une proposition
        </ModalTitle>
      </ModalHeader>
      
      <ModalBody>
        <Grid cols={1} style={{ gap: '1rem' }}>
          <Grid cols={2} style={{ gap: '1rem' }}>
            <div>
              <Text size="sm" style={{ marginBottom: '0.25rem' }}>Prix (€) *</Text>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                placeholder="Ex: 150"
                error={errors.price}
              />
            </div>
            
            <div>
              <Text size="sm" style={{ marginBottom: '0.25rem' }}>État de la pièce *</Text>
              <Select
                value={formData.condition}
                onChange={(e) => handleChange('condition', e.target.value)}
                options={[
                  { value: 'new', label: 'Neuf' },
                  { value: 'used', label: 'Occasion' },
                  { value: 'refurbished', label: 'Reconditionné' }
                ]}
                error={errors.condition}
              />
            </div>
          </Grid>

          <div>
            <Text size="sm" style={{ marginBottom: '0.25rem' }}>Disponibilité *</Text>
            <Input
              value={formData.availability}
              onChange={(e) => handleChange('availability', e.target.value)}
              placeholder="Ex: En stock, livraison sous 48h"
              error={errors.availability}
            />
          </div>

          <div>
            <Text size="sm" style={{ marginBottom: '0.25rem' }}>Garantie</Text>
            <Input
              value={formData.warranty}
              onChange={(e) => handleChange('warranty', e.target.value)}
              placeholder="Ex: 6 mois pièces et main d'œuvre"
            />
          </div>

          <div>
            <Text size="sm" style={{ marginBottom: '0.25rem' }}>Description de votre offre *</Text>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Décrivez la pièce proposée, son état, les conditions de vente..."
              rows={4}
              error={errors.description}
            />
          </div>
        </Grid>
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
            {loading ? 'Envoi...' : 'Envoyer la proposition'}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}