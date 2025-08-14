import React, { useState } from 'react'
import { AuthModal, Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Input, Button, Checkbox, Text } from '@qwanyx/ui'

interface AutodinAuthProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  onSuccess: (user: any, token: string) => void
}

const AutodinAuth: React.FC<AutodinAuthProps> = ({
  isOpen,
  onClose,
  mode,
  onSuccess
}) => {
  const [showProfessionalForm, setShowProfessionalForm] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentToken, setCurrentToken] = useState<string>('')
  const [wasRegisterMode, setWasRegisterMode] = useState(false)
  
  // Professional fields
  const [accountType, setAccountType] = useState<'particulier' | 'professionnel'>('particulier')
  const [proTypes, setProTypes] = useState<string[]>([])
  const [companyName, setCompanyName] = useState('')
  const [vatNumber, setVatNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002'
  const workspace = import.meta.env.VITE_WORKSPACE || 'autodin-be'

  // Track if we're in register mode when auth modal opens
  React.useEffect(() => {
    if (isOpen && mode === 'register') {
      setWasRegisterMode(true)
    } else if (!isOpen) {
      setWasRegisterMode(false)
    }
  }, [isOpen, mode])

  const handleAuthSuccess = async (user: any, token: string) => {
    // Show professional form if we started in register mode
    if (wasRegisterMode) {
      // For registration, show professional form
      setCurrentUser(user)
      setCurrentToken(token)
      setShowProfessionalForm(true)
    } else {
      // For login, just complete
      onSuccess(user, token)
    }
  }

  const handleProfessionalSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      // Update user profile with professional info
      const response = await fetch(`${apiUrl}/users/${currentUser.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          account_type: accountType,
          pro_types: accountType === 'professionnel' ? proTypes : [],
          company_name: accountType === 'professionnel' ? companyName : '',
          vat_number: accountType === 'professionnel' ? vatNumber : ''
        })
      })

      if (response.ok) {
        const updatedUser = await response.json()
        onSuccess(updatedUser, currentToken)
        resetState()
      } else {
        // Even if update fails, user is registered, so continue
        console.error('Failed to update professional info')
        onSuccess(currentUser, currentToken)
        resetState()
      }
    } catch (err) {
      // Even on error, complete registration
      console.error('Error updating professional info:', err)
      onSuccess(currentUser, currentToken)
      resetState()
    } finally {
      setLoading(false)
    }
  }

  const resetState = () => {
    setShowProfessionalForm(false)
    setCurrentUser(null)
    setCurrentToken('')
    setAccountType('particulier')
    setProTypes([])
    setCompanyName('')
    setVatNumber('')
    setError('')
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  // If showing professional form after registration
  if (showProfessionalForm) {
    return (
      <Modal
        isOpen={true}
        onClose={() => {
          // Allow skipping professional info
          onSuccess(currentUser, currentToken)
          resetState()
        }}
        size="md"
        showCloseButton={true}
      >
        <ModalHeader>
          <div className="flex flex-col items-center mb-6">
            <img 
              src="/images/logo.png" 
              alt="Autodin" 
              width={60} 
              height={60}
              className="mb-2"
              style={{ width: '60px', height: '60px', objectFit: 'contain' }}
            />
            <div className="text-2xl font-bold" style={{ color: '#E67E22' }}>
              AUTODIN
            </div>
          </div>
          <ModalTitle className="text-center">
            Complétez votre profil
          </ModalTitle>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm font-medium">
                Type de compte
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="accountType"
                    value="particulier"
                    checked={accountType === 'particulier'}
                    onChange={() => setAccountType('particulier')}
                    className="w-4 h-4"
                    style={{ accentColor: '#E67E22' }}
                  />
                  <span>Particulier</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="accountType"
                    value="professionnel"
                    checked={accountType === 'professionnel'}
                    onChange={() => setAccountType('professionnel')}
                    className="w-4 h-4"
                    style={{ accentColor: '#E67E22' }}
                  />
                  <span>Professionnel</span>
                </label>
              </div>
            </div>

            {accountType === 'professionnel' && (
              <>
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Type d'activité
                  </label>
                  <div className="space-y-2">
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
                  <Text size="xs" className="mt-1 text-gray-600">
                    Sélectionnez toutes les activités qui vous concernent
                  </Text>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Nom de l'entreprise
                  </label>
                  <Input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Nom de votre entreprise"
                    fullWidth
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Numéro de TVA
                  </label>
                  <Input
                    type="text"
                    value={vatNumber}
                    onChange={(e) => setVatNumber(e.target.value)}
                    placeholder="BE0123456789"
                    fullWidth
                  />
                  <Text size="xs" className="mt-1 text-gray-600">
                    Format: BE0123456789
                  </Text>
                </div>
              </>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="flex gap-2 w-full">
            <Button
              variant="ghost"
              onClick={() => {
                // Skip professional info
                onSuccess(currentUser, currentToken)
                resetState()
              }}
              disabled={loading}
              fullWidth
            >
              Passer cette étape
            </Button>
            <Button
              onClick={handleProfessionalSubmit}
              loading={loading}
              disabled={accountType === 'professionnel' && (!companyName || !vatNumber || proTypes.length === 0)}
              fullWidth
              style={{ 
                backgroundColor: '#E67E22',
                color: 'white'
              }}
            >
              Terminer l'inscription
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    )
  }

  // Show standard auth modal
  return (
    <AuthModal
      isOpen={isOpen}
      onClose={handleClose}
      mode={mode}
      workspace={workspace}
      apiUrl={apiUrl}
      onSuccess={handleAuthSuccess}
    />
  )
}

export default AutodinAuth