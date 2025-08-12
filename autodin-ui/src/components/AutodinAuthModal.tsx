import React, { useState } from 'react'
import { AuthModal, Input, Checkbox, Text } from '@qwanyx/ui'

interface AutodinAuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  onSuccess: (user: any, token: string) => void
}

const AutodinAuthModal: React.FC<AutodinAuthModalProps> = ({
  isOpen,
  onClose,
  mode,
  onSuccess
}) => {
  // Extension fields for professional registration
  const [isProfessional, setIsProfessional] = useState(false)
  const [proTypes, setProTypes] = useState<string[]>([])
  const [companyName, setCompanyName] = useState('')
  const [vatNumber, setVatNumber] = useState('')

  // Custom registration handler that includes professional fields
  const handleRegister = async (email: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002';
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        workspace: 'autodin-be',
        accountType: isProfessional ? 'professionnel' : 'particulier',
        proTypes: isProfessional ? proTypes : [],
        companyName: isProfessional ? companyName : '',
        vatNumber: isProfessional ? vatNumber : ''
      })
    })
    return response
  }

  // Render professional fields extension
  const renderExtension = () => {
    if (mode !== 'register') return null

    return (
      <>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--gray-700)'
          }}>
            Type de compte
          </label>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="accountType"
                value="particulier"
                checked={!isProfessional}
                onChange={() => setIsProfessional(false)}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--autodin-primary)'
                }}
              />
              <span>Particulier</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="accountType"
                value="professionnel"
                checked={isProfessional}
                onChange={() => setIsProfessional(true)}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: 'var(--autodin-primary)'
                }}
              />
              <span>Professionnel</span>
            </label>
          </div>
        </div>

        {isProfessional && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--gray-700)'
              }}>
                Type d'activité
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Checkbox
                  checked={proTypes.includes('garagiste')}
                  onChange={(checked) => {
                    if (checked) {
                      setProTypes([...proTypes, 'garagiste'])
                    } else {
                      setProTypes(proTypes.filter(t => t !== 'garagiste'))
                    }
                  }}
                  label="Garagiste"
                />
                <Checkbox
                  checked={proTypes.includes('fournisseur')}
                  onChange={(checked) => {
                    if (checked) {
                      setProTypes([...proTypes, 'fournisseur'])
                    } else {
                      setProTypes(proTypes.filter(t => t !== 'fournisseur'))
                    }
                  }}
                  label="Fournisseur de pièces"
                />
                <Checkbox
                  checked={proTypes.includes('carrossier')}
                  onChange={(checked) => {
                    if (checked) {
                      setProTypes([...proTypes, 'carrossier'])
                    } else {
                      setProTypes(proTypes.filter(t => t !== 'carrossier'))
                    }
                  }}
                  label="Carrossier"
                />
              </div>
              <Text style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginTop: '0.25rem' }}>
                Sélectionnez toutes les activités qui vous concernent
              </Text>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.25rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--gray-700)'
              }}>
                Nom de l'entreprise
              </label>
              <Input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Nom de votre entreprise"
                required={isProfessional}
                size="md"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.25rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--gray-700)'
              }}>
                Numéro de TVA
              </label>
              <Input
                type="text"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                placeholder="BE0123456789"
                required={isProfessional}
                size="md"
              />
              <Text style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginTop: '0.25rem' }}>
                Format: BE0123456789
              </Text>
            </div>
          </>
        )}
      </>
    )
  }

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={onClose}
      mode={mode}
      workspace="autodin-be"
      apiUrl={import.meta.env.VITE_API_URL || 'http://localhost:5002'}
      onSuccess={onSuccess}
      customRegisterHandler={mode === 'register' ? handleRegister : undefined}
      registerExtension={renderExtension()}
    />
  )
}

export default AutodinAuthModal