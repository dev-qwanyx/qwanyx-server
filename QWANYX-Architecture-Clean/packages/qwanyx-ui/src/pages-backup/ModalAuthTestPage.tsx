import { useState } from 'react'
import { 
  Button, 
  Modal, 
  Input, 
  Checkbox, 
  Container, 
  Heading, 
  Text,
  Alert
} from '../components'

export const ModalAuthTestPage = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    firstName: '',
    lastName: '',
    phone: '',
    accountType: '',
    rememberMe: false
  })
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(`Form submitted in ${mode} mode`)
    console.log('Form data:', formData)
  }

  const renderAuthModal = () => (
    <Modal
      isOpen={isAuthOpen}
      onClose={() => {
        setIsAuthOpen(false)
        setMessage('')
      }}
      size="md"
    >
      <div style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Heading as="h2" size="2xl">
            {mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </Heading>
          <Text color="muted" style={{ marginTop: '0.5rem' }}>
            {mode === 'login' 
              ? 'Connectez-vous à votre compte' 
              : 'Créez votre compte Autodin'}
          </Text>
        </div>

        {/* Alert for messages */}
        {message && (
          <Alert 
            variant={message.includes('error') ? 'error' : 'success'}
            style={{ marginBottom: '1rem' }}
          >
            {message}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <Input
                  type="text"
                  placeholder="Prénom"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  fullWidth
                />
                <Input
                  type="text"
                  placeholder="Nom"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  fullWidth
                />
              </div>
            </>
          )}

          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            fullWidth
            style={{ marginBottom: '1rem' }}
            required
          />

          {mode === 'login' && (
            <Input
              type="text"
              placeholder="Code de vérification (6 chiffres)"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              fullWidth
              style={{ marginBottom: '1rem' }}
              maxLength={6}
              pattern="[0-9]{6}"
            />
          )}

          {mode === 'register' && (
            <>
              <Input
                type="tel"
                placeholder="Téléphone (optionnel)"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                fullWidth
                style={{ marginBottom: '1rem' }}
              />

              <select
                value={formData.accountType}
                onChange={(e) => setFormData({...formData, accountType: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '16px',
                  border: '2px solid rgb(var(--border))',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  marginBottom: '1rem'
                }}
              >
                <option value="">Type de compte...</option>
                <option value="personal">Personnel</option>
                <option value="professional">Professionnel</option>
              </select>
            </>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <Checkbox
              checked={formData.rememberMe}
              onChange={(checked: boolean) => setFormData({...formData, rememberMe: checked})}
              label="Se souvenir de moi"
            />
          </div>

          <Button
            type="submit"
            fullWidth
            variant="primary"
          >
            {mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </Button>
        </form>

        {/* Switch mode */}
        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid rgb(var(--border))'
        }}>
          <Text size="sm" color="muted">
            {mode === 'login' ? "Pas encore de compte ?" : "Déjà un compte ?"}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              style={{ marginLeft: '0.5rem' }}
            >
              {mode === 'login' ? "S'inscrire" : "Se connecter"}
            </Button>
          </Text>
        </div>
      </div>
    </Modal>
  )

  return (
    <Container style={{ padding: '2rem' }}>
      <Heading as="h1" size="3xl" style={{ marginBottom: '1rem' }}>
        Modal Auth Test
      </Heading>
      
      <Text style={{ marginBottom: '2rem' }}>
        This page tests the Modal component with Auth-like content using @qwanyx/ui components
      </Text>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <Button 
          onClick={() => {
            setMode('login')
            setIsAuthOpen(true)
          }}
        >
          Open Login Modal
        </Button>

        <Button 
          onClick={() => {
            setMode('register')
            setIsAuthOpen(true)
          }}
          variant="outline"
        >
          Open Register Modal
        </Button>
      </div>

      {/* Render the modal */}
      {renderAuthModal()}

      {/* Test results */}
      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: 'rgb(var(--muted))',
        borderRadius: '8px'
      }}>
        <Heading as="h3" size="lg" style={{ marginBottom: '0.5rem' }}>
          Form Data (Debug)
        </Heading>
        <pre style={{ fontSize: '14px' }}>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </Container>
  )
}