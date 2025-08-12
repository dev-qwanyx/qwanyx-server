import React, { useState, useEffect } from 'react'
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter, Input, Button, Text, Checkbox, OTPInput, OTPTimer } from '@qwanyx/ui'

interface AutodinAuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  onSuccess: (user: any, token: string) => void
}

const AutodinAuthModalNew: React.FC<AutodinAuthModalProps> = ({
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
  const [companyName, setCompanyName] = useState('')
  const [vatNumber, setVatNumber] = useState('')

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002'
  const workspace = import.meta.env.VITE_WORKSPACE || 'autodin-be'

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
      setCompanyName('')
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
              account_type: isProfessional ? 'professionnel' : 'particulier',
              pro_types: isProfessional ? proTypes : [],
              company_name: isProfessional ? companyName : '',
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
                          value="particulier"
                          checked={!isProfessional}
                          onChange={() => setIsProfessional(false)}
                          className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                          style={{
                            accentColor: '#E67E22'
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
                          className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                          style={{
                            accentColor: '#E67E22'
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
              )}

              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <i className="fas fa-envelope" style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                  fontSize: '14px',
                  zIndex: 1
                }}></i>
                <Input
                  type="email"
                  placeholder="Entrez votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  fullWidth={true}
                  style={{ paddingLeft: '2.5rem' }}
                  error={!!error && step === 'email'}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  title="Veuillez entrer une adresse email valide"
                  required
                />
              </div>

              <Button
                fullWidth
                onClick={handleSendCode}
                loading={loading}
                disabled={!email || (mode === 'register' && (!firstName || !lastName)) || (mode === 'register' && isProfessional && (!companyName || !vatNumber))}
                style={{ 
                  backgroundColor: '#E67E22',
                  color: 'white',
                  opacity: (!email || (mode === 'register' && (!firstName || !lastName)) || (mode === 'register' && isProfessional && (!companyName || !vatNumber))) ? 0.6 : 1
                }}
              >
                {mode === 'login' ? 'Envoyer le code' : 'Créer mon compte'}
              </Button>
            </>
          ) : (
            <>
              <div className="text-center text-sm text-gray-600 mb-4">
                Code envoyé à : <strong>{email}</strong>
              </div>
              
              <OTPInput
                value={code}
                onChange={setCode}
                onComplete={() => {
                  if (code.length === 6) {
                    handleVerifyCode()
                  }
                }}
                disabled={loading}
                error={!!error}
                autoFocus={true}
              />
              
              <div className="mt-4">
                <OTPTimer
                  duration={600}
                  onExpire={() => setError('Code expiré. Veuillez demander un nouveau code.')}
                  onResend={handleSendCode}
                />
              </div>

              <Button
                fullWidth
                onClick={handleVerifyCode}
                loading={loading}
                disabled={!code || code.length !== 6}
                className="mt-4"
                style={{ 
                  backgroundColor: '#E67E22',
                  color: 'white',
                  marginTop: '1rem'
                }}
              >
                Vérifier le code
              </Button>
              
              <Button
                fullWidth
                variant="ghost"
                onClick={handleReset}
                disabled={loading}
              >
                Utiliser un autre email
              </Button>
            </>
          )}
        </div>
      </ModalBody>

      <ModalFooter align="center">
        <Text size="sm">
          {mode === 'login' ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <button
            onClick={toggleMode}
            className="text-blue-500 hover:underline"
            disabled={loading}
          >
            {mode === 'login' ? 'S\'inscrire' : 'Se connecter'}
          </button>
        </Text>
      </ModalFooter>
    </Modal>
  )
}

export default AutodinAuthModalNew