import React, { useState } from 'react'
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Text,
  Heading,
  Badge,
  Modal,
  SimpleSelect,
} from '@qwanyx/ui'
import { useThotContext } from '../providers/ThotProvider'
import { InboxEmail } from '../types'

export const InboxPage: React.FC = () => {
  const { 
    inbox, 
    templates, 
    prompts, 
    processEmail, 
    generateResponse, 
    sendResponse 
  } = useThotContext()
  
  const [selectedEmail, setSelectedEmail] = useState<InboxEmail | null>(null)
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)
  const [generatedResponse, setGeneratedResponse] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [selectedPrompt, setSelectedPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)


  const handleOpenResponseModal = (email: InboxEmail) => {
    setSelectedEmail(email)
    setIsResponseModalOpen(true)
    setGeneratedResponse('')
    setSelectedTemplate('')
    setSelectedPrompt('')
  }

  const handleGenerateResponse = async () => {
    if (!selectedEmail) return
    
    setIsGenerating(true)
    try {
      await processEmail(selectedEmail.id)
      const response = await generateResponse(
        selectedEmail.id, 
        selectedTemplate || undefined,
        selectedPrompt || undefined
      )
      setGeneratedResponse(response)
    } catch (error) {
      console.error('Erreur lors de la génération:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSendResponse = async () => {
    if (!selectedEmail || !generatedResponse) return
    
    await sendResponse(selectedEmail.id, generatedResponse)
    setIsResponseModalOpen(false)
    setSelectedEmail(null)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  return (
    <Container>
      <div className="qwanyx-mb-8">
        <Heading size="2xl">Boîte de réception</Heading>
        <Text className="qwanyx-mt-2" style={{ color: 'var(--qwanyx-text-secondary)' }}>
          Emails en attente de traitement automatique
        </Text>
      </div>

      <div className="qwanyx-space-y-4">
        {inbox.map((email) => (
          <Card key={email.id}>
            <CardContent>
              <div className="qwanyx-flex qwanyx-justify-between qwanyx-items-start">
                <div className="qwanyx-flex-1">
                  <div className="qwanyx-flex qwanyx-items-center qwanyx-gap-3 qwanyx-mb-2">
                    <Text className="qwanyx-font-semibold">
                      {email.from}
                    </Text>
                    <Badge variant="solid" size="sm">
                      {email.status}
                    </Badge>
                    <Badge variant="outline" size="sm">
                      {email.priority}
                    </Badge>
                    <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                      {formatDate(email.receivedAt)}
                    </Text>
                  </div>
                  
                  <Text className="qwanyx-font-medium qwanyx-mb-2">
                    {email.subject}
                  </Text>
                  
                  <Text 
                    className="qwanyx-line-clamp-2" 
                    style={{ color: 'var(--qwanyx-text-secondary)' }}
                  >
                    {email.body}
                  </Text>
                </div>
                
                <div className="qwanyx-flex qwanyx-gap-2">
                  {email.status === 'pending' && (
                    <Button 
                      size="sm" 
                      variant="primary"
                      onClick={() => handleOpenResponseModal(email)}
                    >
                      Répondre
                    </Button>
                  )}
                  {email.status === 'responded' && email.responseId && (
                    <Button 
                      size="sm" 
                      variant="secondary"
                    >
                      Voir réponse
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {inbox.length === 0 && (
          <Card>
            <CardContent>
              <Text style={{ color: 'var(--qwanyx-text-secondary)' }}>
                Aucun email en attente
              </Text>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de génération de réponse */}
      <Modal
        isOpen={isResponseModalOpen}
        onClose={() => setIsResponseModalOpen(false)}
        title="Générer une réponse"
      >
        {selectedEmail && (
          <div className="qwanyx-space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email original</CardTitle>
              </CardHeader>
              <CardContent>
                <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                  De: {selectedEmail.from}
                </Text>
                <Text className="qwanyx-font-medium qwanyx-my-2">
                  {selectedEmail.subject}
                </Text>
                <Text>{selectedEmail.body}</Text>
              </CardContent>
            </Card>

            <div>
              <Text className="qwanyx-mb-2">Template (optionnel)</Text>
              <SimpleSelect
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                options={[
                  { value: '', label: 'Aucun template' },
                  ...templates
                    .filter(t => t.isActive)
                    .map(t => ({ value: t.id, label: t.name }))
                ]}
              />
            </div>

            <div>
              <Text className="qwanyx-mb-2">Prompt AI (optionnel)</Text>
              <SimpleSelect
                value={selectedPrompt}
                onChange={(e) => setSelectedPrompt(e.target.value)}
                options={[
                  { value: '', label: 'Aucun prompt' },
                  ...prompts
                    .filter(p => p.isActive)
                    .map(p => ({ value: p.id, label: p.name }))
                ]}
              />
            </div>

            <Button
              variant="primary"
              onClick={handleGenerateResponse}
              disabled={isGenerating}
              className="qwanyx-w-full"
            >
              {isGenerating ? 'Génération en cours...' : 'Générer la réponse'}
            </Button>

            {generatedResponse && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Réponse générée</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      className="qwanyx-input qwanyx-w-full qwanyx-min-h-[200px]"
                      value={generatedResponse}
                      onChange={(e) => setGeneratedResponse(e.target.value)}
                    />
                  </CardContent>
                </Card>

                <div className="qwanyx-flex qwanyx-justify-end qwanyx-gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setIsResponseModalOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSendResponse}
                  >
                    Envoyer la réponse
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </Container>
  )
}