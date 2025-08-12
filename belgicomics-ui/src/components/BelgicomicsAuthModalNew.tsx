import React, { useState, useEffect } from 'react'
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, Input, Button, Text, Checkbox, OTPInput, OTPTimer } from '@qwanyx/ui'

interface BelgicomicsAuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  onSuccess: (user: any, token: string) => void
}

const BelgicomicsAuthModalNew: React.FC<BelgicomicsAuthModalProps> = ({
  isOpen,
  onClose,
  mode: initialMode,
  onSuccess
}) => {
  const [mode, setMode] = useState(initialMode)
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Common fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  
  // Professional fields
  const [isProfessional, setIsProfessional] = useState(false)
  const [proTypes, setProTypes] = useState<string[]>([])
  const [organizationName, setOrganizationName] = useState('')
  const [vatNumber, setVatNumber] = useState('')

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002'
  const workspace = import.meta.env.VITE_WORKSPACE || 'belgicomics-be'

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStep('email')
      setEmail('')
      setCode('')
      setError('')
      setSuccess('')
      setLoading(false)
      setFirstName('')
      setLastName('')
      setPhone('')
      setIsProfessional(false)
      setProTypes([])
      setOrganizationName('')
      setVatNumber('')
    } else {
      setMode(initialMode)
    }
  }, [isOpen, initialMode])

  const handleSendCode = async () => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer une adresse email valide')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/request-code'
      const body = mode === 'register' 
        ? {
            email,
            workspace,
            metadata: {
              first_name: firstName,
              last_name: lastName,
              phone: phone,
              account_type: isProfessional ? 'professionnel' : 'passionné',
              pro_types: isProfessional ? proTypes : [],
              organization_name: isProfessional ? organizationName : '',
              vat_number: isProfessional ? vatNumber : ''
            }
          }
        : {
            email,
            workspace
          }
      
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()
      
      if (response.ok) {
        setSuccess(mode === 'register' 
          ? 'Bienvenue ! Vérifiez votre email pour le code de vérification.' 
          : 'Code envoyé ! Vérifiez votre email.')
        setStep('code')
      } else {
        setError(data.error || 'Échec de l\'envoi du code')
      }
    } catch (err) {
      setError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`${apiUrl}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code,
          workspace
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem(`${workspace}_token`, data.access_token)
        localStorage.setItem(`${workspace}_user`, JSON.stringify(data.user))
        
        if (onSuccess) {
          onSuccess(data.user, data.access_token)
        }
        
        setEmail('')
        setCode('')
        setStep('email')
        onClose()
      } else {
        setError(data.error || 'Code invalide')
      }
    } catch (err) {
      setError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep('email')
    setCode('')
    setError('')
    setSuccess('')
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setStep('email')
    setError('')
    setSuccess('')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={true}
    >
      <ModalHeader>
        <div className="flex flex-col items-center mb-6">
          <img 
            src="/img/belgicomixlogo.png" 
            alt="Belgicomics" 
            width={180} 
            height={135}
            className="mb-2"
            style={{ width: '180px', height: '135px', objectFit: 'contain' }}
          />
        </div>
        <ModalTitle className="text-center">
          {mode === 'login' ? 'Connexion' : 'Créer un compte'}
        </ModalTitle>
        <ModalDescription className="text-center">
          {step === 'email' 
            ? `Entrez votre email pour ${mode === 'login' ? 'vous connecter' : 'vous inscrire'}`
            : 'Entrez le code envoyé à votre email'
          }
        </ModalDescription>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}

          {step === 'email' ? (
            <>
              {mode === 'register' && (
                <>
                  {/* Champs communs pour tous les utilisateurs */}
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.25rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'var(--gray-700)'
                      }}>
                        Prénom
                      </label>
                      <Input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Votre prénom"
                        required
                        fullWidth
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.25rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'var(--gray-700)'
                      }}>
                        Nom
                      </label>
                      <Input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Votre nom"
                        required
                        fullWidth
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.25rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'var(--gray-700)'
                    }}>
                      Téléphone
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+32 123 45 67 89"
                      fullWidth
                    />
                  </div>

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
                          value="passionné"
                          checked={!isProfessional}
                          onChange={() => setIsProfessional(false)}
                          className="w-4 h-4 text-gray-600 focus:ring-gray-500"
                          style={{
                            accentColor: '#4B5563'
                          }}
                        />
                        <span style={{ fontSize: '0.875rem' }}>Passionné</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="accountType"
                          value="professionnel"
                          checked={isProfessional}
                          onChange={() => setIsProfessional(true)}
                          className="w-4 h-4 text-gray-600 focus:ring-gray-500"
                          style={{
                            accentColor: '#4B5563'
                          }}
                        />
                        <span style={{ fontSize: '0.875rem' }}>Professionnel</span>
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
                          Type de professionnel
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <Checkbox
                            label="Chercheur"
                            checked={proTypes.includes('chercheur')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProTypes([...proTypes, 'chercheur'])
                              } else {
                                setProTypes(proTypes.filter(t => t !== 'chercheur'))
                              }
                            }}
                          />
                          <Checkbox
                            label="Auteur (scénariste, dessinateur, coloriste)"
                            checked={proTypes.includes('auteur')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProTypes([...proTypes, 'auteur'])
                              } else {
                                setProTypes(proTypes.filter(t => t !== 'auteur'))
                              }
                            }}
                          />
                          <Checkbox
                            label="Éditeur"
                            checked={proTypes.includes('editeur')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProTypes([...proTypes, 'editeur'])
                              } else {
                                setProTypes(proTypes.filter(t => t !== 'editeur'))
                              }
                            }}
                          />
                          <Checkbox
                            label="Institution culturelle"
                            checked={proTypes.includes('institution')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProTypes([...proTypes, 'institution'])
                              } else {
                                setProTypes(proTypes.filter(t => t !== 'institution'))
                              }
                            }}
                          />
                          <Checkbox
                            label="Sponsor/Mécène"
                            checked={proTypes.includes('sponsor')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProTypes([...proTypes, 'sponsor'])
                              } else {
                                setProTypes(proTypes.filter(t => t !== 'sponsor'))
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.25rem',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: 'var(--gray-700)'
                        }}>
                          Nom de l'organisation
                        </label>
                        <Input
                          type="text"
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                          placeholder="Université, Maison d'édition, etc."
                          fullWidth
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
                          Numéro TVA (optionnel)
                        </label>
                        <Input
                          type="text"
                          value={vatNumber}
                          onChange={(e) => setVatNumber(e.target.value)}
                          placeholder="BE0123456789"
                          fullWidth
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--gray-700)'
                }}>
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  fullWidth
                  autoFocus
                />
              </div>

              <div style={{ marginTop: '1rem' }}>
                <Button
                  onClick={handleSendCode}
                  variant="outline"
                  size="md"
                  loading={loading}
                  fullWidth
                  className="belgicomics-login-button"
                >
                  {mode === 'login' ? 'Se connecter' : 'S\'inscrire'}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--gray-700)'
                }}>
                  Code de vérification
                </label>
                <OTPInput
                  length={6}
                  value={code}
                  onChange={setCode}
                  onComplete={handleVerifyCode}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="md"
                  fullWidth
                  className="belgicomics-login-button"
                >
                  Retour
                </Button>
                <Button
                  onClick={handleVerifyCode}
                  variant="outline"
                  size="md"
                  loading={loading}
                  fullWidth
                  className="belgicomics-login-button"
                >
                  Vérifier
                </Button>
              </div>

              <div className="text-center">
                <OTPTimer 
                  duration={300}
                  onExpire={() => setError('Le code a expiré. Veuillez demander un nouveau code.')}
                />
              </div>
            </>
          )}

          {step === 'email' && (
            <div className="text-center text-sm text-gray-600">
              {mode === 'login' ? (
                <>
                  Pas encore de compte ?{' '}
                  <button
                    onClick={toggleMode}
                    className="text-gray-700 hover:text-gray-900 font-medium"
                  >
                    S'inscrire
                  </button>
                </>
              ) : (
                <>
                  Déjà inscrit ?{' '}
                  <button
                    onClick={toggleMode}
                    className="text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Se connecter
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </ModalBody>
    </Modal>
  )
}

export default BelgicomicsAuthModalNew