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
} from '@qwanyx/ui'
import { useThotContext } from '../providers/ThotProvider'
import { ResponseLog } from '../types'

export const LogsPage: React.FC = () => {
  const { logs, inbox, templates, prompts } = useThotContext()
  const [selectedLog, setSelectedLog] = useState<ResponseLog | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)


  const getEmailById = (emailId: string) => {
    return inbox.find(e => e.id === emailId)
  }

  const getTemplateById = (templateId: string) => {
    return templates.find(t => t.id === templateId)
  }

  const getPromptById = (promptId: string) => {
    return prompts.find(p => p.id === promptId)
  }

  const handleViewDetails = (log: ResponseLog) => {
    setSelectedLog(log)
    setIsModalOpen(true)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  // Statistiques
  const stats = {
    total: logs.length,
    sent: logs.filter(l => l.status === 'sent').length,
    failed: logs.filter(l => l.status === 'failed').length,
    pending: logs.filter(l => l.status === 'pending').length,
  }

  return (
    <Container>
      <div className="qwanyx-mb-8">
        <Heading size="2xl">Logs des réponses</Heading>
        <Text className="qwanyx-mt-2" style={{ color: 'var(--qwanyx-text-secondary)' }}>
          Historique des réponses automatiques envoyées
        </Text>
      </div>

      {/* Statistiques */}
      <div className="qwanyx-grid qwanyx-grid-cols-4 qwanyx-gap-4 qwanyx-mb-6">
        <Card>
          <CardContent>
            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
              Total
            </Text>
            <Text size="2xl" className="qwanyx-font-bold">
              {stats.total}
            </Text>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
              Envoyées
            </Text>
            <Text size="2xl" className="qwanyx-font-bold qwanyx-text-success">
              {stats.sent}
            </Text>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
              En attente
            </Text>
            <Text size="2xl" className="qwanyx-font-bold qwanyx-text-warning">
              {stats.pending}
            </Text>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
              Échouées
            </Text>
            <Text size="2xl" className="qwanyx-font-bold qwanyx-text-danger">
              {stats.failed}
            </Text>
          </CardContent>
        </Card>
      </div>

      {/* Liste des logs */}
      <div className="qwanyx-space-y-3">
        {logs.map((log) => {
          const email = getEmailById(log.emailId)
          const template = log.templateId ? getTemplateById(log.templateId) : null
          const prompt = log.promptId ? getPromptById(log.promptId) : null

          return (
            <Card key={log.id}>
              <CardContent>
                <div className="qwanyx-flex qwanyx-justify-between qwanyx-items-start">
                  <div className="qwanyx-flex-1">
                    <div className="qwanyx-flex qwanyx-items-center qwanyx-gap-3 qwanyx-mb-2">
                      <Badge variant="solid">
                        {log.status}
                      </Badge>
                      <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                        {formatDate(log.sentAt)}
                      </Text>
                      {template && (
                        <Badge variant="outline" size="sm">
                          Template: {template.name}
                        </Badge>
                      )}
                      {prompt && (
                        <Badge variant="subtle" size="sm">
                          Prompt: {prompt.name}
                        </Badge>
                      )}
                    </div>
                    
                    {email && (
                      <div className="qwanyx-mb-2">
                        <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                          Email original
                        </Text>
                        <Text>
                          De: {email.from} • Sujet: {email.subject}
                        </Text>
                      </div>
                    )}
                    
                    <div>
                      <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                        Réponse générée
                      </Text>
                      <Text className="qwanyx-line-clamp-2">
                        {log.generatedResponse}
                      </Text>
                    </div>
                    
                    {log.error && (
                      <div className="qwanyx-mt-2">
                        <Badge variant="solid">
                          Erreur: {log.error}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleViewDetails(log)}
                  >
                    Détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
        
        {logs.length === 0 && (
          <Card>
            <CardContent>
              <Text style={{ color: 'var(--qwanyx-text-secondary)' }}>
                Aucun log de réponse pour le moment
              </Text>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de détails */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Détails de la réponse"
      >
        {selectedLog && (
          <div className="qwanyx-space-y-4">
            <div>
              <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                ID de log
              </Text>
              <Text>{selectedLog.id}</Text>
            </div>
            
            <div>
              <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                Date d'envoi
              </Text>
              <Text>{formatDate(selectedLog.sentAt)}</Text>
            </div>
            
            <div>
              <Text size="sm" style={{ color: 'var(--qwanyx-text-secondary)' }}>
                Statut
              </Text>
              <Badge variant="solid">
                {selectedLog.status}
              </Badge>
            </div>
            
            {(() => {
              const email = getEmailById(selectedLog.emailId)
              return email && (
                <Card>
                  <CardHeader>
                    <CardTitle>Email original</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Text size="sm">De: {email.from}</Text>
                    <Text size="sm">À: {email.to}</Text>
                    <Text className="qwanyx-font-medium qwanyx-my-2">
                      {email.subject}
                    </Text>
                    <Text>{email.body}</Text>
                  </CardContent>
                </Card>
              )
            })()}
            
            <Card>
              <CardHeader>
                <CardTitle>Réponse générée</CardTitle>
              </CardHeader>
              <CardContent>
                <Text style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedLog.generatedResponse}
                </Text>
              </CardContent>
            </Card>
            
            {selectedLog.error && (
              <Card>
                <CardHeader>
                  <CardTitle>Erreur</CardTitle>
                </CardHeader>
                <CardContent>
                  <Text style={{ color: 'var(--qwanyx-text-danger)' }}>
                    {selectedLog.error}
                  </Text>
                </CardContent>
              </Card>
            )}
            
            {selectedLog.metadata && (
              <Card>
                <CardHeader>
                  <CardTitle>Métadonnées</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="qwanyx-text-sm">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
            
            <div className="qwanyx-flex qwanyx-justify-end">
              <Button onClick={() => setIsModalOpen(false)}>
                Fermer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Container>
  )
}