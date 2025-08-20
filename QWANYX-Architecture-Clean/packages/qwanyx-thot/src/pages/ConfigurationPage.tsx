import React, { useState } from 'react'
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Switch,
  Button,
  Text,
  Heading,
  SimpleSelect,
  Grid,
  Badge,
} from '@qwanyx/ui'
import { useThotContext } from '../providers/ThotProvider'

export const ConfigurationPage: React.FC = () => {
  const { config, updateConfig, isLoading, testEmailConnection } = useThotContext()
  const [testingConnection, setTestingConnection] = useState<'imap' | 'smtp' | null>(null)
  const [useSharedCredentials, setUseSharedCredentials] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // La mise à jour est gérée individuellement par chaque champ
  }

  const handleSharedCredentialsChange = (checked: boolean) => {
    setUseSharedCredentials(checked)
    if (checked && config.credentials.imap.user) {
      // Copy IMAP credentials to SMTP
      updateConfig({
        credentials: {
          ...config.credentials,
          smtp: {
            ...config.credentials.smtp,
            user: config.credentials.imap.user,
            password: config.credentials.imap.password
          }
        }
      })
    }
  }

  const handleCredentialChange = (type: 'imap' | 'smtp', field: 'user' | 'password', value: string) => {
    if (useSharedCredentials) {
      // Update both IMAP and SMTP when shared
      updateConfig({
        credentials: {
          ...config.credentials,
          imap: { ...config.credentials.imap, [field]: value },
          smtp: { ...config.credentials.smtp, [field]: value }
        }
      })
    } else {
      // Update only the specified type
      updateConfig({
        credentials: {
          ...config.credentials,
          [type]: { ...config.credentials[type], [field]: value }
        }
      })
    }
  }

  const handleTestConnection = async (type: 'imap' | 'smtp') => {
    setTestingConnection(type)
    try {
      await testEmailConnection(type)
      
      await updateConfig({
        credentials: {
          ...config.credentials,
          connectionStatus: {
            ...config.credentials.connectionStatus,
            [type]: 'connected',
            lastTest: new Date(),
          }
        }
      })
    } catch (error) {
      await updateConfig({
        credentials: {
          ...config.credentials,
          connectionStatus: {
            ...config.credentials.connectionStatus,
            [type]: 'error',
            lastTest: new Date(),
            lastError: error instanceof Error ? error.message : 'Erreur de connexion'
          }
        }
      })
    } finally {
      setTestingConnection(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="subtle">✓ Connecté</Badge>
      case 'error':
        return <Badge variant="subtle">✗ Erreur</Badge>
      case 'testing':
        return <Badge variant="subtle">⟳ Test en cours...</Badge>
      default:
        return <Badge variant="subtle">Non configuré</Badge>
    }
  }

  if (!config) {
    return (
      <Container>
        <Text>Loading configuration...</Text>
      </Container>
    )
  }
  
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Heading size="2xl">Configuration Digital Team</Heading>
        <Text style={{ marginTop: '0.5rem', color: 'var(--qwanyx-text-secondary)' }}>
          Configurez votre équipe d'agents intelligents
        </Text>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section Credentials Email */}
        <div style={{ marginBottom: '2rem' }}>
          <Heading size="xl" style={{ marginBottom: '1rem' }}>Credentials Email</Heading>
          
          {/* Toggle for shared credentials */}
          <Card style={{ marginBottom: '1rem' }}>
            <CardContent>
              <label className="qwanyx-flex qwanyx-items-center qwanyx-gap-3">
                <Switch
                  checked={useSharedCredentials}
                  onChange={handleSharedCredentialsChange}
                />
                <div>
                  <Text weight="semibold">Utiliser les mêmes identifiants pour IMAP et SMTP</Text>
                  <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                    La plupart des fournisseurs utilisent les mêmes identifiants pour l'envoi et la réception
                  </Text>
                </div>
              </label>
            </CardContent>
          </Card>
          
          <Grid cols={2} gap="lg">
            {/* Configuration IMAP */}
            <Card>
              <CardHeader>
                <div className="qwanyx-flex qwanyx-justify-between qwanyx-items-center">
                  <CardTitle>Configuration IMAP (Réception)</CardTitle>
                  {getStatusBadge(
                    testingConnection === 'imap' ? 'testing' : config.credentials.connectionStatus.imap
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="qwanyx-space-y-4">
                  <div>
                    <Text className="qwanyx-mb-2">Serveur IMAP</Text>
                    <Input
                      type="text"
                      value={config.credentials.imap.host}
                      onChange={(e) => updateConfig({
                        credentials: {
                          ...config.credentials,
                          imap: { ...config.credentials.imap, host: e.target.value }
                        }
                      })}
                      placeholder="imap.gmail.com"
                    />
                  </div>

                  <div className="qwanyx-grid qwanyx-grid-cols-2 qwanyx-gap-2">
                    <div>
                      <Text className="qwanyx-mb-2">Port</Text>
                      <Input
                        type="number"
                        value={config.credentials.imap.port}
                        onChange={(e) => updateConfig({
                          credentials: {
                            ...config.credentials,
                            imap: { ...config.credentials.imap, port: parseInt(e.target.value) }
                          }
                        })}
                      />
                    </div>
                    <div>
                      <label className="qwanyx-flex qwanyx-items-center qwanyx-mt-8 qwanyx-gap-2">
                        <Switch
                          checked={config.credentials.imap.secure}
                          onChange={(checked) => updateConfig({
                            credentials: {
                              ...config.credentials,
                              imap: { ...config.credentials.imap, secure: checked }
                            }
                          })}
                        />
                        <Text>SSL/TLS</Text>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Text className="qwanyx-mb-2">Email</Text>
                    <Input
                      type="email"
                      value={config.credentials.imap.user}
                      onChange={(e) => handleCredentialChange('imap', 'user', e.target.value)}
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <Text className="qwanyx-mb-2">Mot de passe</Text>
                    <Input
                      type="password"
                      value={config.credentials.imap.password}
                      onChange={(e) => handleCredentialChange('imap', 'password', e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <Text className="qwanyx-mb-2">Dossier</Text>
                    <Input
                      type="text"
                      value={config.credentials.imap.folder}
                      onChange={(e) => updateConfig({
                        credentials: {
                          ...config.credentials,
                          imap: { ...config.credentials.imap, folder: e.target.value }
                        }
                      })}
                      placeholder="INBOX"
                    />
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection('imap')}
                    disabled={testingConnection === 'imap' || !config.credentials.imap.host || !config.credentials.imap.user}
                    fullWidth
                  >
                    {testingConnection === 'imap' ? 'Test en cours...' : 'Tester la connexion IMAP'}
                  </Button>

                  {config.credentials.connectionStatus.lastError && config.credentials.connectionStatus.imap === 'error' && (
                    <Text size="sm" style={{ color: 'var(--qwanyx-text-danger)' }}>
                      {config.credentials.connectionStatus.lastError}
                    </Text>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Configuration SMTP */}
            <Card>
              <CardHeader>
                <div className="qwanyx-flex qwanyx-justify-between qwanyx-items-center">
                  <CardTitle>Configuration SMTP (Envoi)</CardTitle>
                  {getStatusBadge(
                    testingConnection === 'smtp' ? 'testing' : config.credentials.connectionStatus.smtp
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="qwanyx-space-y-4">
                  <div>
                    <Text className="qwanyx-mb-2">Serveur SMTP</Text>
                    <Input
                      type="text"
                      value={config.credentials.smtp.host}
                      onChange={(e) => updateConfig({
                        credentials: {
                          ...config.credentials,
                          smtp: { ...config.credentials.smtp, host: e.target.value }
                        }
                      })}
                      placeholder="smtp.gmail.com"
                    />
                  </div>

                  <div className="qwanyx-grid qwanyx-grid-cols-2 qwanyx-gap-2">
                    <div>
                      <Text className="qwanyx-mb-2">Port</Text>
                      <Input
                        type="number"
                        value={config.credentials.smtp.port}
                        onChange={(e) => updateConfig({
                          credentials: {
                            ...config.credentials,
                            smtp: { ...config.credentials.smtp, port: parseInt(e.target.value) }
                          }
                        })}
                      />
                    </div>
                    <div>
                      <label className="qwanyx-flex qwanyx-items-center qwanyx-mt-8 qwanyx-gap-2">
                        <Switch
                          checked={config.credentials.smtp.secure}
                          onChange={(checked) => updateConfig({
                            credentials: {
                              ...config.credentials,
                              smtp: { ...config.credentials.smtp, secure: checked }
                            }
                          })}
                        />
                        <Text>SSL/TLS</Text>
                      </label>
                    </div>
                  </div>

                  {!useSharedCredentials && (
                    <>
                      <div>
                        <Text className="qwanyx-mb-2">Email</Text>
                        <Input
                          type="email"
                          value={config.credentials.smtp.user}
                          onChange={(e) => handleCredentialChange('smtp', 'user', e.target.value)}
                          placeholder="votre@email.com"
                        />
                      </div>

                      <div>
                        <Text className="qwanyx-mb-2">Mot de passe</Text>
                        <Input
                          type="password"
                          value={config.credentials.smtp.password}
                          onChange={(e) => handleCredentialChange('smtp', 'password', e.target.value)}
                          placeholder="••••••••"
                        />
                      </div>
                    </>
                  )}

                  {useSharedCredentials && (
                    <div style={{ 
                      padding: '1rem', 
                      backgroundColor: 'var(--qwanyx-bg-secondary)', 
                      borderRadius: '0.5rem',
                      marginTop: '0.5rem'
                    }}>
                      <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                        Les identifiants IMAP seront utilisés pour l'envoi SMTP
                      </Text>
                    </div>
                  )}

                  <div>
                    <Text className="qwanyx-mb-2">Nom d'affichage</Text>
                    <Input
                      type="text"
                      value={config.credentials.smtp.from}
                      onChange={(e) => updateConfig({
                        credentials: {
                          ...config.credentials,
                          smtp: { ...config.credentials.smtp, from: e.target.value }
                        }
                      })}
                      placeholder="Support Autodin"
                    />
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection('smtp')}
                    disabled={testingConnection === 'smtp' || !config.credentials.smtp.host || !config.credentials.smtp.user}
                    fullWidth
                  >
                    {testingConnection === 'smtp' ? 'Test en cours...' : 'Tester la connexion SMTP'}
                  </Button>

                  {config.credentials.connectionStatus.lastError && config.credentials.connectionStatus.smtp === 'error' && (
                    <Text size="sm" style={{ color: 'var(--qwanyx-text-danger)' }}>
                      {config.credentials.connectionStatus.lastError}
                    </Text>
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </div>

        {/* Configuration générale */}
        <Grid cols={2} gap="lg">
          <Card>
            <CardHeader>
              <CardTitle>Configuration générale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="qwanyx-space-y-4">
                <div>
                  <label className="qwanyx-flex qwanyx-items-center qwanyx-justify-between">
                    <Text>Digital Team activé</Text>
                    <Switch
                      checked={config.enabled}
                      onChange={(checked) => updateConfig({ enabled: checked })}
                    />
                  </label>
                </div>

                <div>
                  <Text className="qwanyx-mb-2">Modèle AI</Text>
                  <SimpleSelect
                    value={config.model}
                    onChange={(value) => updateConfig({ model: value as any })}
                    options={[
                      { value: 'gpt-4', label: 'GPT-4 (Plus intelligent)' },
                      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Plus rapide)' },
                      { value: 'claude-3', label: 'Claude 3 (Équilibré)' },
                      { value: 'local', label: 'Modèle local' },
                    ]}
                  />
                </div>

                <div>
                  <Text className="qwanyx-mb-2">Délai de réponse (secondes)</Text>
                  <Input
                    type="number"
                    min="0"
                    max="3600"
                    value={config.responseDelay}
                    onChange={(e) => updateConfig({ responseDelay: parseInt(e.target.value) })}
                  />
                  <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                    Temps d'attente avant l'envoi de la réponse automatique
                  </Text>
                </div>

                <div>
                  <Text className="qwanyx-mb-2">Max réponses par jour</Text>
                  <Input
                    type="number"
                    min="0"
                    value={config.maxResponsesPerDay}
                    onChange={(e) => updateConfig({ maxResponsesPerDay: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Heures de travail */}
          <Card>
            <CardHeader>
              <CardTitle>Heures de travail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="qwanyx-space-y-4">
                <div>
                  <label className="qwanyx-flex qwanyx-items-center qwanyx-justify-between">
                    <Text>Activer les heures de travail</Text>
                    <Switch
                      checked={config.workingHours.enabled}
                      onChange={(checked) => 
                        updateConfig({ 
                          workingHours: { ...config.workingHours, enabled: checked }
                        })
                      }
                    />
                  </label>
                </div>

                {config.workingHours.enabled && (
                  <>
                    <div>
                      <Text className="qwanyx-mb-2">Heure de début</Text>
                      <Input
                        type="time"
                        value={config.workingHours.start}
                        onChange={(e) => 
                          updateConfig({ 
                            workingHours: { ...config.workingHours, start: e.target.value }
                          })
                        }
                      />
                    </div>

                    <div>
                      <Text className="qwanyx-mb-2">Heure de fin</Text>
                      <Input
                        type="time"
                        value={config.workingHours.end}
                        onChange={(e) => 
                          updateConfig({ 
                            workingHours: { ...config.workingHours, end: e.target.value }
                          })
                        }
                      />
                    </div>

                    <div>
                      <Text className="qwanyx-mb-2">Fuseau horaire</Text>
                      <SimpleSelect
                        value={config.workingHours.timezone}
                        onChange={(e) => 
                          updateConfig({ 
                            workingHours: { ...config.workingHours, timezone: e.target.value }
                          })
                        }
                        options={[
                          { value: 'Europe/Paris', label: 'Paris (UTC+1)' },
                          { value: 'Europe/London', label: 'Londres (UTC+0)' },
                          { value: 'America/New_York', label: 'New York (UTC-5)' },
                          { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)' },
                        ]}
                      />
                    </div>
                  </>
                )}

                <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                  La Digital Team ne répondra automatiquement que pendant ces heures
                </Text>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <div className="qwanyx-mt-6">
          <Button 
            type="submit" 
            variant="primary" 
            size="lg"
            disabled={isLoading}
          >
            Sauvegarder la configuration
          </Button>
        </div>
      </form>
    </div>
  )
}