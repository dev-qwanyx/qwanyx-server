import React, { useState } from 'react'
import { Modal, Input, Button, Text } from '@qwanyx/ui'

interface BelgicomicsAuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register'
  onSuccess: (user: any, token: string) => void
}

const BelgicomicsAuthModal: React.FC<BelgicomicsAuthModalProps> = ({
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
  
  // Additional fields for registration
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [accountType, setAccountType] = useState('passionné')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = mode === 'login' ? '/auth/request-code' : '/auth/register'
      const body = mode === 'register' 
        ? { 
            email, 
            workspace: 'belgicomics-be',
            firstName,
            lastName,
            phone,
            accountType
          }
        : { 
            email, 
            workspace: 'belgicomics' 
          }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002';
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()
      
      if (response.ok) {
        setStep('code')
        if (mode === 'register') {
          setError('Compte créé! Un code vous a été envoyé par email.')
        }
      } else {
        setError(data.error || 'Une erreur est survenue')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002';
      const response = await fetch(`${apiUrl}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          code,
          workspace: 'belgicomics'
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        onSuccess(data.user, data.token || data.access_token)
        // Reset form
        setEmail('')
        setCode('')
        setFirstName('')
        setLastName('')
        setPhone('')
        setAccountType('passionné')
        setStep('email')
      } else {
        setError(data.error || 'Code invalide')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setStep('email')
    setCode('')
    setError('')
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
    setStep('email')
    // Reset form
    setEmail('')
    setFirstName('')
    setLastName('')
    setPhone('')
    setAccountType('passionné')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
    >
      <div style={{ padding: '2rem 1rem 1rem' }}>
        {/* Logo */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          marginBottom: '1.5rem' 
        }}>
          <img 
            src="/img/belgicomixlogo.png" 
            alt="Belgicomics" 
            style={{ 
              height: '35px', 
              width: 'auto', 
              marginBottom: '0.75rem',
              display: 'block'
            }}
          />
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--gray-800)',
            textAlign: 'center'
          }}>
            {step === 'email' 
              ? (mode === 'login' ? 'CONNEXION' : 'INSCRIPTION')
              : 'VÉRIFICATION'
            }
          </h2>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit}>
            {mode === 'login' ? (
              <>
                <Text style={{ 
                  textAlign: 'center', 
                  marginBottom: '1.5rem',
                  color: 'var(--gray-600)',
                  fontSize: '0.9rem'
                }}>
                  Étape 1/2 - Entrez votre email
                </Text>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
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
                    required
                    size="md"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Registration fields */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
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
                      size="md"
                    />
                  </div>
                  <div>
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
                      size="md"
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
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
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
                    Téléphone (optionnel)
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+32 4xx xx xx xx"
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
                    Type de compte
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid rgb(var(--qwanyx-border))',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'white',
                      color: 'var(--gray-700)',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                    required
                  >
                    <option value="passionné">Passionné</option>
                    <option value="bénévole">Bénévole</option>
                    <option value="chercheur">Chercheur</option>
                    <option value="collaborateur">Collaborateur</option>
                  </select>
                </div>
              </>
            )}

            {error && (
              <Text style={{ 
                color: error.includes('créé') ? 'var(--success)' : 'var(--error)', 
                fontSize: '0.875rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {error}
              </Text>
            )}

            <Button
              type="submit"
              variant="solid"
              size="md"
              disabled={loading}
              style={{
                width: '100%',
                marginBottom: '1rem',
                background: 'var(--gray-700)',
                color: 'white'
              }}
            >
              {loading ? 'Envoi...' : (mode === 'login' ? 'Recevoir un code' : 'Créer mon compte')}
            </Button>

            <Text style={{ 
              textAlign: 'center',
              fontSize: '0.875rem',
              color: 'var(--gray-600)'
            }}>
              {mode === 'login' ? "Pas encore de compte?" : "Déjà inscrit?"}
              <button
                type="button"
                onClick={toggleMode}
                style={{
                  marginLeft: '0.5rem',
                  color: 'var(--gray-800)',
                  fontWeight: 500,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {mode === 'login' ? "S'inscrire" : "Se connecter"}
              </button>
            </Text>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit}>
            <Text style={{ 
              textAlign: 'center', 
              marginBottom: '0.5rem',
              color: 'var(--gray-600)',
              fontSize: '0.9rem'
            }}>
              Étape 2/2 - Entrez le code reçu
            </Text>
            
            <Text style={{ 
              textAlign: 'center', 
              marginBottom: '1.5rem',
              color: 'var(--gray-700)',
              fontSize: '0.9rem'
            }}>
              Un code a été envoyé à <strong style={{ color: 'var(--gray-800)' }}>{email}</strong>
            </Text>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.25rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--gray-700)'
              }}>
                Code de vérification
              </label>
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
                required
                size="md"
                maxLength={6}
                style={{ 
                  textAlign: 'center', 
                  letterSpacing: '0.5rem',
                  fontSize: '1.25rem',
                  fontWeight: 'bold'
                }}
              />
              <Text style={{
                fontSize: '0.75rem',
                color: 'var(--gray-600)',
                marginTop: '0.25rem'
              }}>
                Entrez le code à 6 chiffres reçu par email
              </Text>
            </div>

            {error && (
              <Text style={{ 
                color: 'var(--error)', 
                fontSize: '0.875rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {error}
              </Text>
            )}

            <Button
              type="submit"
              variant="solid"
              size="md"
              disabled={loading}
              style={{
                width: '100%',
                marginBottom: '1rem',
                background: 'var(--gray-700)',
                color: 'white'
              }}
            >
              {loading ? 'Vérification...' : 'Vérifier le code'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={handleBack}
              style={{
                width: '100%',
                color: 'var(--gray-600)'
              }}
            >
              Utiliser un autre email
            </Button>
          </form>
        )}
      </div>
    </Modal>
  )
}

export default BelgicomicsAuthModal