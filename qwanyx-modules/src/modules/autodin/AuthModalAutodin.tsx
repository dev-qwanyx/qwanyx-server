import React, { useState } from 'react';
import { Modal, Input, Button, Text, Heading, Checkbox } from '@qwanyx/ui';
// CSS imported by host app

export interface AuthModalAutodinProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  workspace?: string;
  apiUrl?: string;
  onSuccess?: (user: any, token: string) => void;
}

const AuthModalAutodin: React.FC<AuthModalAutodinProps> = ({
  isOpen,
  onClose,
  mode: initialMode,
  workspace = 'autodin-be',
  apiUrl = 'http://localhost:5002',
  onSuccess
}) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isProfessional, setIsProfessional] = useState(false);
  const [proTypes, setProTypes] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';
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
        : { email, workspace };

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        if (mode === 'register' || (mode === 'login' && data.message)) {
          setError(data.message || 'Code envoyé par email');
        }
        
        if (mode === 'login' && data.token) {
          onSuccess?.(data.user, data.token);
          onClose();
        }
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ padding: '2rem', minWidth: '400px' }}>
        <Heading as="h2" style={{ 
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          color: 'var(--autodin-dark)'
        }}>
          {mode === 'register' ? 'Créer un compte' : 'Se connecter'}
        </Heading>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>

          {mode === 'register' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <Input
                  placeholder="Prénom"
                  value={firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <Input
                  placeholder="Nom"
                  value={lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <Input
                  placeholder="Téléphone"
                  value={phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <Checkbox
                  checked={isProfessional}
                  onChange={setIsProfessional}
                  label="Je suis un professionnel"
                />
              </div>

              {isProfessional && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <Text style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      Type de professionnel
                    </Text>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <Checkbox
                        checked={proTypes.includes('garagiste')}
                        onChange={(checked: boolean) => {
                          if (checked) {
                            setProTypes([...proTypes, 'garagiste']);
                          } else {
                            setProTypes(proTypes.filter(t => t !== 'garagiste'));
                          }
                        }}
                        label="Garagiste"
                      />
                      <Checkbox
                        checked={proTypes.includes('fournisseur')}
                        onChange={(checked: boolean) => {
                          if (checked) {
                            setProTypes([...proTypes, 'fournisseur']);
                          } else {
                            setProTypes(proTypes.filter(t => t !== 'fournisseur'));
                          }
                        }}
                        label="Fournisseur de pièces"
                      />
                      <Checkbox
                        checked={proTypes.includes('carrossier')}
                        onChange={(checked: boolean) => {
                          if (checked) {
                            setProTypes([...proTypes, 'carrossier']);
                          } else {
                            setProTypes(proTypes.filter(t => t !== 'carrossier'));
                          }
                        }}
                        label="Carrossier"
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <Input
                      placeholder="Nom de l'entreprise"
                      value={companyName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <Input
                      placeholder="Numéro de TVA"
                      value={vatNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVatNumber(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </>
              )}
            </>
          )}

          {error && (
            <div style={{ 
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: error.includes('envoyé') ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
              borderRadius: '4px',
              color: error.includes('envoyé') ? '#27ae60' : '#e74c3c'
            }}>
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: 'var(--autodin-primary)',
              borderColor: 'var(--autodin-primary)'
            }}
          >
            {loading ? 'Chargement...' : (mode === 'register' ? 'S\'inscrire' : 'Se connecter')}
          </Button>
        </form>

        <div style={{ 
          marginTop: '1.5rem',
          textAlign: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid var(--gray-200)'
        }}>
          <Text style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
            {mode === 'register' ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
              style={{ 
                marginLeft: '0.5rem',
                color: 'var(--autodin-primary)'
              }}
            >
              {mode === 'register' ? 'Se connecter' : 'S\'inscrire'}
            </Button>
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModalAutodin;