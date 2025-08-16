import { useState, useEffect } from 'react'
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Icon,
  Text
} from '@qwanyx/ui'
import { User, UserRole, UserStatus } from '../types'

interface UserFormProps {
  isOpen: boolean
  onClose: () => void
  user?: User | null
  onSubmit: (user: Partial<User>) => Promise<void>
  mode?: 'add' | 'edit'
}

export function UserForm({ isOpen, onClose, user, onSubmit, mode = 'add' }: UserFormProps) {
  console.log('UserForm rendered, isOpen:', isOpen, 'mode:', mode, 'user:', user)
  const [formData, setFormData] = useState<Partial<User>>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'user',
    status: 'active'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        name: user.name || '',
        role: user.role || 'user',
        status: user.status || 'active',
        phone: user.phone || '',
        department: user.department || '',
        jobTitle: user.jobTitle || ''
      })
    } else {
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'user',
        status: 'active'
      })
    }
    setErrors({})
  }, [user, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }

    if (mode === 'add' && !formData.firstName && !formData.lastName && !formData.name) {
      newErrors.name = 'Le nom est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({ submit: error instanceof Error ? error.message : 'Une erreur est survenue' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
    >
      <form onSubmit={handleSubmit}>
        <ModalHeader>
          <ModalTitle>
            {mode === 'add' ? 'Ajouter un utilisateur' : 'Modifier l\'utilisateur'}
          </ModalTitle>
        </ModalHeader>

        <ModalBody>
          <div className="qwanyx-space-y-4">
            {errors.submit && (
              <div className="qwanyx-bg-red-50 qwanyx-border qwanyx-border-red-200 qwanyx-text-red-600 qwanyx-p-3 qwanyx-rounded">
                <Text size="sm">{errors.submit}</Text>
              </div>
            )}

            <div>
              <label htmlFor="email" className="qwanyx-label">
                Email <span className="qwanyx-text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={mode === 'edit'}
                placeholder="utilisateur@exemple.com"
              />
              {errors.email && (
                <Text size="sm" color="error" className="qwanyx-mt-1">
                  {errors.email}
                </Text>
              )}
            </div>

            <div className="qwanyx-grid qwanyx-grid-cols-2 qwanyx-gap-4">
              <div>
                <label htmlFor="firstName" className="qwanyx-label">Prénom</label>
                <Input
                  id="firstName"
                  value={formData.firstName || ''}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="Jean"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="qwanyx-label">Nom</label>
                <Input
                  id="lastName"
                  value={formData.lastName || ''}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Dupont"
                />
              </div>
            </div>

            {errors.name && (
              <Text size="sm" color="error" className="qwanyx-mt-1">
                {errors.name}
              </Text>
            )}

            <div>
              <label htmlFor="phone" className="qwanyx-label">Téléphone</label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            <div className="qwanyx-grid qwanyx-grid-cols-2 qwanyx-gap-4">
              <div>
                <label htmlFor="role" className="qwanyx-label">Rôle</label>
                <select
                  id="role"
                  className="qwanyx-input"
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value as UserRole)}
                >
                  <option value="admin">Admin</option>
                  <option value="moderator">Modérateur</option>
                  <option value="user">Utilisateur</option>
                  <option value="viewer">Observateur</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="qwanyx-label">Statut</label>
                <select
                  id="status"
                  className="qwanyx-input"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as UserStatus)}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="suspended">Suspendu</option>
                  <option value="pending">En attente</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="department" className="qwanyx-label">Département</label>
              <Input
                id="department"
                value={formData.department || ''}
                onChange={(e) => handleChange('department', e.target.value)}
                placeholder="Marketing"
              />
            </div>

            <div>
              <label htmlFor="jobTitle" className="qwanyx-label">Poste</label>
              <Input
                id="jobTitle"
                value={formData.jobTitle || ''}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                placeholder="Responsable marketing"
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <Icon name="refresh" size="sm" className="qwanyx-icon-spin" />
                {mode === 'add' ? 'Ajout...' : 'Modification...'}
              </>
            ) : (
              <>
                <Icon name={mode === 'add' ? 'person_add' : 'save'} size="sm" />
                {mode === 'add' ? 'Ajouter' : 'Enregistrer'}
              </>
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}