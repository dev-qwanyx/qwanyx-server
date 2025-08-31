import { useMemo, useState } from 'react'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Button,
  Input,
  Badge,
  Icon,
  Text,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@qwanyx/ui'
import { useRequestManagement } from '../providers/RequestManagementProvider'
import { PartRequest, RequestStatus } from '../types'
import { RequestForm } from './RequestForm'
import { ProposalForm } from './ProposalForm'

export function RequestList() {
  const {
    requests,
    loading,
    error,
    selectedRequests,
    currentPage,
    pageSize,
    config,
    selectRequest,
    unselectRequest,
    selectAllRequests,
    unselectAllRequests,
    setPage,
    addRequest,
    editRequest,
    deleteRequest,
    deleteSelectedRequests,
    addProposal
  } = useRequestManagement()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<RequestStatus | ''>('')
  const [urgencyFilter, setUrgencyFilter] = useState<string>('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState<PartRequest | null>(null)
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<string>('')
  const [activeTab, setActiveTab] = useState('my-requests')
  const [viewingRequest, setViewingRequest] = useState<PartRequest | null>(null)
  
  const userRole = config.userRole || 'particulier'
  const currentUserId = config.currentUserId

  // Filtrer les demandes selon l'onglet actif
  const tabFilteredRequests = useMemo(() => {
    if (activeTab === 'my-requests') {
      return requests.filter(r => r.userId === currentUserId)
    }
    // "all-requests" visible seulement pour pro, admin et superuser
    if (userRole === 'professionnel' || userRole === 'admin' || userRole === 'superuser') {
      return requests
    }
    return []
  }, [requests, activeTab, currentUserId, userRole])

  const filteredRequests = useMemo(() => {
    return tabFilteredRequests.filter(request => {
      const matchesSearch = searchTerm === '' || 
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.carBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === '' || request.status === statusFilter
      const matchesUrgency = urgencyFilter === '' || request.urgency === urgencyFilter
      
      return matchesSearch && matchesStatus && matchesUrgency
    })
  }, [tabFilteredRequests, searchTerm, statusFilter, urgencyFilter])

  const handleEdit = (request: PartRequest) => {
    setEditingRequest(request)
    setIsFormOpen(true)
  }

  const handleView = (request: PartRequest) => {
    setViewingRequest(request)
  }

  const handleDelete = async (request: PartRequest) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      await deleteRequest(request._id || request.id || '')
    }
  }

  const handleProposal = (requestId: string) => {
    setSelectedRequestId(requestId)
    setShowProposalForm(true)
  }

  const handleFormSubmit = async (data: Partial<PartRequest>) => {
    if (editingRequest) {
      await editRequest({ ...editingRequest, ...data })
    } else {
      await addRequest(data)
    }
    setIsFormOpen(false)
    setEditingRequest(null)
  }

  const handleProposalSubmit = async (proposal: any) => {
    await addProposal(proposal)
    setShowProposalForm(false)
  }

  const canEditRequest = (request: PartRequest) => {
    return userRole === 'admin' || userRole === 'superuser' || request.userId === currentUserId
  }

  const getStatusBadgeColor = (status: RequestStatus) => {
    switch(status) {
      case 'open': return 'success'
      case 'closed': return 'secondary'
      case 'fulfilled': return 'primary'
      case 'cancelled': return 'error'
      default: return 'secondary'
    }
  }

  const getUrgencyBadgeColor = (urgency?: string) => {
    switch(urgency) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusLabel = (status: RequestStatus) => {
    switch(status) {
      case 'open': return 'Ouvert'
      case 'closed': return 'Fermé'
      case 'fulfilled': return 'Satisfait'
      case 'cancelled': return 'Annulé'
      default: return status
    }
  }

  const getUrgencyLabel = (urgency?: string) => {
    switch(urgency) {
      case 'high': return 'Urgent'
      case 'medium': return 'Normal'
      case 'low': return 'Faible'
      default: return '-'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Text>Chargement des demandes...</Text>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card style={{ border: '3px solid red', backgroundColor: '#ffeeee' }}>
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>🔴</span>
            <div>
              <Text size="lg" weight="bold" color="error">CRITICAL FAILURE - JIDOKA ALERT</Text>
              <Text color="error" style={{ marginTop: '0.5rem' }}>
                {error}
              </Text>
              <Text size="sm" style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                System halted. Fix the issue before continuing.
              </Text>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Vue détaillée d'une demande
  if (viewingRequest) {
    return (
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <CardTitle>{viewingRequest.title}</CardTitle>
            <Button variant="ghost" onClick={() => setViewingRequest(null)}>
              <Icon name="close" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <Text size="sm" color="muted">Demandeur</Text>
              <Text weight="medium">{viewingRequest.userName || viewingRequest.userEmail}</Text>
            </div>
            <div>
              <Text size="sm" color="muted">Statut</Text>
              <Badge color={getStatusBadgeColor(viewingRequest.status)}>
                {getStatusLabel(viewingRequest.status)}
              </Badge>
            </div>
            <div>
              <Text size="sm" color="muted">Pièce recherchée</Text>
              <Text weight="medium">{viewingRequest.partName}</Text>
            </div>
            <div>
              <Text size="sm" color="muted">Véhicule</Text>
              <Text weight="medium">
                {viewingRequest.carBrand} {viewingRequest.carModel} {viewingRequest.year}
              </Text>
            </div>
            <div>
              <Text size="sm" color="muted">Urgence</Text>
              <Badge color={getUrgencyBadgeColor(viewingRequest.urgency)}>
                {getUrgencyLabel(viewingRequest.urgency)}
              </Badge>
            </div>
            <div>
              <Text size="sm" color="muted">Date de création</Text>
              <Text weight="medium">
                {viewingRequest.createdAt ? new Date(viewingRequest.createdAt).toLocaleDateString('fr-FR') : '-'}
              </Text>
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <Text size="sm" color="muted">Description</Text>
            <Text>{viewingRequest.description}</Text>
          </div>

          {viewingRequest.proposals && viewingRequest.proposals.length > 0 && (
            <div>
              <Text weight="semibold" style={{ marginBottom: '1rem' }}>
                Propositions ({viewingRequest.proposals.length})
              </Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {viewingRequest.proposals.map((proposal) => (
                  <Card key={proposal._id || proposal.id} style={{ borderLeft: '3px solid #E67E22' }}>
                    <CardContent>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <Text weight="medium">{proposal.professionalName}</Text>
                        <Text size="lg" weight="bold" style={{ color: '#E67E22' }}>
                          {proposal.price}€
                        </Text>
                      </div>
                      <Text size="sm" color="secondary">{proposal.description}</Text>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <Badge size="sm" color="secondary">{proposal.condition === 'new' ? 'Neuf' : proposal.condition === 'used' ? 'Occasion' : 'Reconditionné'}</Badge>
                        <Badge size="sm" color="primary">{proposal.availability}</Badge>
                        {proposal.warranty && <Badge size="sm" color="success">Garantie: {proposal.warranty}</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            <Button variant="outline" onClick={() => setViewingRequest(null)}>
              Retour
            </Button>
            {canEditRequest(viewingRequest) && (
              <>
                <Button variant="primary" onClick={() => handleEdit(viewingRequest)}>
                  <Icon name="edit" /> Modifier
                </Button>
                <Button variant="ghost" onClick={() => handleDelete(viewingRequest)}>
                  <Icon name="delete" /> Supprimer
                </Button>
              </>
            )}
            {userRole === 'professionnel' && viewingRequest.status === 'open' && (
              <Button variant="primary" onClick={() => handleProposal(viewingRequest._id || viewingRequest.id || '')}>
                Faire une proposition
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Demandes de pièces</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tabs pour mes demandes / toutes les demandes */}
          {(userRole === 'professionnel' || userRole === 'admin' || userRole === 'superuser') ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList style={{ marginBottom: '1rem' }}>
                <TabsTrigger value="my-requests">Mes demandes</TabsTrigger>
                <TabsTrigger value="all-requests">Toutes les demandes</TabsTrigger>
              </TabsList>
            </Tabs>
          ) : null}

          {/* Filtres */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: '1 1 300px' }}
            />
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RequestStatus | '')}
              style={{ 
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #e5e7eb'
              }}
            >
              <option value="">Tous les statuts</option>
              <option value="open">Ouvert</option>
              <option value="closed">Fermé</option>
              <option value="fulfilled">Satisfait</option>
              <option value="cancelled">Annulé</option>
            </select>
            
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              style={{ 
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #e5e7eb'
              }}
            >
              <option value="">Toute urgence</option>
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Urgente</option>
            </select>
            
            {config.allowAdd && (
              <Button 
                variant="primary" 
                onClick={() => setIsFormOpen(true)}
              >
                <Icon name="add" />
                Nouvelle demande
              </Button>
            )}

            {selectedRequests.length > 0 && canEditRequest(requests.find(r => selectedRequests.includes(r._id || r.id || ''))!) && (
              <Button
                variant="ghost"
                onClick={deleteSelectedRequests}
              >
                <Icon name="delete" />
                Supprimer ({selectedRequests.length})
              </Button>
            )}
          </div>

          {/* Table des demandes */}
          <div className="qwanyx-overflow-x-auto">
            <table className="qwanyx-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }} className="qwanyx-p-2">
                    <input
                      type="checkbox"
                      checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          selectAllRequests()
                        } else {
                          unselectAllRequests()
                        }
                      }}
                      className="qwanyx-checkbox"
                    />
                  </th>
                  <th className="qwanyx-p-2 qwanyx-text-left">Titre</th>
                  <th className="qwanyx-p-2 qwanyx-text-left">Pièce</th>
                  <th className="qwanyx-p-2 qwanyx-text-left">Véhicule</th>
                  <th className="qwanyx-p-2 qwanyx-text-left">Demandeur</th>
                  <th className="qwanyx-p-2 qwanyx-text-left">Statut</th>
                  <th className="qwanyx-p-2 qwanyx-text-left">Urgence</th>
                  <th className="qwanyx-p-2 qwanyx-text-left">Propositions</th>
                  <th className="qwanyx-p-2 qwanyx-text-left">Date</th>
                  <th className="qwanyx-p-2 qwanyx-text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => {
                  const requestId = request._id || request.id || ''
                  const isSelected = selectedRequests.includes(requestId)
                  const canEdit = canEditRequest(request)
                  
                  return (
                    <tr key={requestId} className="qwanyx-border-t">
                      <td className="qwanyx-p-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              selectRequest(requestId)
                            } else {
                              unselectRequest(requestId)
                            }
                          }}
                          className="qwanyx-checkbox"
                        />
                      </td>
                      <td className="qwanyx-p-2">
                        <Text weight="medium">{request.title}</Text>
                      </td>
                      <td className="qwanyx-p-2">{request.partName}</td>
                      <td className="qwanyx-p-2">
                        <Text size="sm">{request.carBrand} {request.carModel}</Text>
                        {request.year && <Text size="xs" color="muted">{request.year}</Text>}
                      </td>
                      <td className="qwanyx-p-2">
                        <Text size="sm">{request.userName || request.userEmail}</Text>
                      </td>
                      <td className="qwanyx-p-2">
                        <Badge color={getStatusBadgeColor(request.status)}>
                          {getStatusLabel(request.status)}
                        </Badge>
                      </td>
                      <td className="qwanyx-p-2">
                        <Badge color={getUrgencyBadgeColor(request.urgency)}>
                          {getUrgencyLabel(request.urgency)}
                        </Badge>
                      </td>
                      <td className="qwanyx-p-2">
                        {request.proposals && request.proposals.length > 0 ? (
                          <Badge color="primary">{request.proposals.length}</Badge>
                        ) : (
                          <Text size="sm" color="muted">0</Text>
                        )}
                      </td>
                      <td className="qwanyx-p-2">
                        <Text size="sm">
                          {request.createdAt ? new Date(request.createdAt).toLocaleDateString('fr-FR') : '-'}
                        </Text>
                      </td>
                      <td className="qwanyx-p-2">
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleView(request)}
                          >
                            <Icon name="visibility" />
                          </Button>
                          
                          {userRole === 'professionnel' && request.status === 'open' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleProposal(requestId)}
                            >
                              <Icon name="attach_money" />
                            </Button>
                          )}
                          
                          {canEdit && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(request)}
                              >
                                <Icon name="edit" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(request)}
                              >
                                <Icon name="delete" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredRequests.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <Text color="muted">Aucune demande trouvée</Text>
            </div>
          )}
        </CardContent>
      </Card>

      <RequestForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingRequest(null)
        }}
        request={editingRequest}
        onSubmit={handleFormSubmit}
        mode={editingRequest ? 'edit' : 'add'}
      />

      <ProposalForm
        isOpen={showProposalForm}
        onClose={() => setShowProposalForm(false)}
        requestId={selectedRequestId}
        onSubmit={handleProposalSubmit}
      />
    </div>
  )
}