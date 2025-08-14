import React, { useState } from 'react'
import { 
  Container, 
  Card, 
  CardContent, 
  Button,
  Text,
  Heading,
  Badge,
  Flex,
  Form,
  Field,
  Input,
  Select,
  Textarea,
  Modal
} from '@qwanyx/ui'

interface Demande {
  id: string
  titre: string
  marque: string
  modele: string
  annee: string
  piece: string
  description: string
  status: 'active' | 'closed' | 'pending'
  date: string
  reponses: number
}

interface DemandesPageProps {
  onBack?: () => void
  onNavigate?: (page: string) => void
}

const DemandesPage: React.FC<DemandesPageProps> = ({ onBack, onNavigate }) => {
  const [showForm, setShowForm] = useState(false) // Masquer le formulaire par défaut
  const [viewMode, setViewMode] = useState<'mes-demandes' | 'toutes-demandes'>('mes-demandes')
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null)
  const [responseData, setResponseData] = useState({
    prix: '',
    disponibilite: '',
    etat: '',
    message: ''
  })
  const [formData, setFormData] = useState({
    marque: '',
    modele: '',
    annee: '',
    piece: '',
    description: '',
    urgence: 'normal',
    budget: '',
    localisation: ''
  })

  // Données fictives pour la démo - Mes demandes
  const [mesDemandes] = useState<Demande[]>([
    {
      id: '1',
      titre: 'Pare-choc avant',
      marque: 'Peugeot',
      modele: '308',
      annee: '2018',
      piece: 'Pare-choc avant',
      description: 'Recherche pare-choc avant en bon état, couleur gris métallisé',
      status: 'active',
      date: '2024-01-15',
      reponses: 3
    },
    {
      id: '2',
      titre: 'Rétroviseur droit',
      marque: 'Renault',
      modele: 'Clio IV',
      annee: '2015',
      piece: 'Rétroviseur droit',
      description: 'Rétroviseur droit complet avec clignotant intégré',
      status: 'active',
      date: '2024-01-14',
      reponses: 5
    },
    {
      id: '3',
      titre: 'Phare avant gauche',
      marque: 'Volkswagen',
      modele: 'Golf 7',
      annee: '2017',
      piece: 'Phare avant gauche',
      description: 'Phare xenon avant gauche, sans rayures',
      status: 'closed',
      date: '2024-01-10',
      reponses: 8
    }
  ])

  // Données fictives pour toutes les demandes (incluant d'autres utilisateurs)
  const [toutesDemandes] = useState<Demande[]>([
    ...mesDemandes,
    {
      id: '4',
      titre: 'Moteur TDI 2.0',
      marque: 'Audi',
      modele: 'A4',
      annee: '2016',
      piece: 'Moteur complet',
      description: 'Recherche moteur TDI 2.0 en bon état, moins de 150000km',
      status: 'active',
      date: '2024-01-16',
      reponses: 2
    },
    {
      id: '5',
      titre: 'Porte arrière gauche',
      marque: 'Ford',
      modele: 'Focus',
      annee: '2019',
      piece: 'Porte arrière gauche',
      description: 'Porte complète avec vitre et mécanisme',
      status: 'active',
      date: '2024-01-16',
      reponses: 1
    },
    {
      id: '6',
      titre: 'Boîte de vitesses',
      marque: 'BMW',
      modele: 'Série 3',
      annee: '2017',
      piece: 'Boîte automatique',
      description: 'Boîte automatique 8 rapports',
      status: 'pending',
      date: '2024-01-15',
      reponses: 0
    }
  ])

  const marques = [
    'Peugeot', 'Renault', 'Citroën', 'Volkswagen', 'Audi', 'BMW', 
    'Mercedes', 'Ford', 'Opel', 'Toyota', 'Nissan', 'Fiat'
  ]

  const handleSubmit = (data: any) => {
    // Logique pour soumettre la demande
    console.log('Nouvelle demande:', data)
    alert('Demande créée avec succès !')
    // Reset form will be handled by Form component
  }

  const handleResponse = (demande: Demande) => {
    setSelectedDemande(demande)
    setShowResponseModal(true)
  }

  const submitResponse = () => {
    console.log('Réponse à la demande:', selectedDemande, responseData)
    alert('Réponse envoyée avec succès !')
    setShowResponseModal(false)
    setResponseData({
      prix: '',
      disponibilite: '',
      etat: '',
      message: ''
    })
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'success',
      closed: 'error',
      pending: 'warning'
    }
    const labels = {
      active: 'Active',
      closed: 'Clôturée',
      pending: 'En attente'
    }
    return (
      <Badge variant={colors[status as keyof typeof colors] as any}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  // Sélectionner les demandes à afficher selon le mode
  const demandesToShow = viewMode === 'mes-demandes' ? mesDemandes : toutesDemandes

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: 'var(--gray-100)'
    }}>
      <Container>
        {/* Breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          paddingTop: '1.5rem',
          paddingBottom: '1rem',
          fontSize: '1.035rem',
          color: 'var(--gray-600)'
        }}>
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.location.href = '/'
            }}
            style={{
              color: 'var(--autodin-primary)',
              textDecoration: 'none'
            }}
          >
            <i className="fas fa-home" style={{ marginRight: '0.25rem' }}></i>
            Accueil
          </a>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.75rem' }}></i>
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onBack?.()
            }}
            style={{
              color: 'var(--autodin-primary)',
              textDecoration: 'none'
            }}
          >
            Tableau de bord
          </a>
          <i className="fas fa-chevron-right" style={{ fontSize: '0.75rem' }}></i>
          <span style={{ color: 'var(--gray-700)', fontWeight: '500' }}>
            Demandes
          </span>
        </div>

        {/* Header */}
        <Flex style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <Heading as="h1" style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: 'var(--autodin-dark)',
              marginBottom: '0.5rem'
            }}>
              {viewMode === 'mes-demandes' ? 'Mes Demandes de Pièces' : 'Toutes les Demandes'}
            </Heading>
            <Text style={{ color: 'var(--gray-600)' }}>
              {viewMode === 'mes-demandes' 
                ? 'Diffusez vos demandes de pièces chez nos partenaires'
                : 'Consultez toutes les demandes de pièces de la communauté'}
            </Text>
          </div>
          <Flex style={{ gap: '1rem' }}>
            <Button
              variant={showForm ? 'outline' : 'solid'}
              onClick={() => setShowForm(!showForm)}
              style={{ 
                backgroundColor: showForm ? 'transparent' : 'var(--autodin-primary)',
                color: showForm ? 'var(--autodin-primary)' : 'white',
                borderColor: 'var(--autodin-primary)'
              }}
            >
              <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`} style={{ marginRight: '0.5rem' }}></i>
              {showForm ? 'Masquer le formulaire' : 'Nouvelle demande'}
            </Button>
          </Flex>
        </Flex>

        {/* Formulaire de création */}
        {showForm && (
          <Card style={{ 
            marginBottom: '2rem',
            backgroundColor: 'var(--autodin-dark-light)',
            border: 'none'
          }}>
            <CardContent style={{
              backgroundColor: 'var(--autodin-dark-light)'
            }}>
              <Heading as="h2" style={{
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                color: 'var(--autodin-dark)'
              }}>
                Créer une nouvelle demande
              </Heading>
              <Form onSubmit={handleSubmit} defaultValues={formData}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <Field name="marque" label="Marque" required>
                    <Select 
                      name="marque"
                      options={[
                        { value: '', label: 'Sélectionnez une marque', disabled: true },
                        ...marques.map(marque => ({ value: marque, label: marque }))
                      ]}
                      fullWidth
                    />
                  </Field>

                  <Field name="modele" label="Modèle" required>
                    <Input 
                      name="modele"
                      type="text"
                      placeholder="Ex: 308, Clio IV, Golf 7..."
                      required
                    />
                  </Field>

                  <Field name="annee" label="Année" required>
                    <Input 
                      name="annee"
                      type="text"
                      placeholder="Ex: 2018"
                      required
                      maxLength={4}
                    />
                  </Field>
                </div>

                <Field name="piece" label="Pièce recherchée" required>
                  <Input 
                    name="piece"
                    type="text"
                    placeholder="Ex: Pare-choc avant, Rétroviseur droit..."
                    required
                  />
                </Field>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <Field name="urgence" label="Urgence">
                    <Select 
                      name="urgence"
                      options={[
                        { value: 'normal', label: 'Normal' },
                        { value: 'urgent', label: 'Urgent' },
                        { value: 'tres_urgent', label: 'Très urgent' }
                      ]}
                      fullWidth
                    />
                  </Field>

                  <Field name="budget" label="Budget estimé">
                    <Input 
                      name="budget"
                      type="text"
                      placeholder="Ex: 100-200€"
                    />
                  </Field>

                  <Field name="localisation" label="Localisation">
                    <Input 
                      name="localisation"
                      type="text"
                      placeholder="Ex: Bruxelles, Liège..."
                    />
                  </Field>
                </div>

                <Field name="description" label="Description détaillée">
                  <Textarea
                    name="description"
                    placeholder="Décrivez précisément la pièce recherchée (état souhaité, couleur, options spécifiques...)"
                    rows={4}
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </Field>

                <Flex style={{ gap: '1rem', justifyContent: 'flex-end' }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="solid"
                    style={{ 
                      backgroundColor: 'var(--autodin-primary)',
                      color: 'white'
                    }}
                  >
                    <i className="fas fa-paper-plane" style={{ marginRight: '0.5rem' }}></i>
                    Diffuser la demande
                  </Button>
                </Flex>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Boutons de bascule */}
        <Flex style={{ gap: '0.5rem', marginBottom: '2rem' }}>
          <Button
            variant={viewMode === 'mes-demandes' ? 'solid' : 'outline'}
            onClick={() => setViewMode('mes-demandes')}
            style={{ 
              backgroundColor: viewMode === 'mes-demandes' ? 'var(--autodin-primary)' : 'transparent',
              color: viewMode === 'mes-demandes' ? 'white' : 'var(--autodin-primary)',
              borderColor: 'var(--autodin-primary)'
            }}
          >
            Mes demandes
          </Button>
          <Button
            variant={viewMode === 'toutes-demandes' ? 'solid' : 'outline'}
            onClick={() => setViewMode('toutes-demandes')}
            style={{ 
              backgroundColor: viewMode === 'toutes-demandes' ? 'var(--autodin-primary)' : 'transparent',
              color: viewMode === 'toutes-demandes' ? 'white' : 'var(--autodin-primary)',
              borderColor: 'var(--autodin-primary)'
            }}
          >
            Toutes les demandes
          </Button>
        </Flex>

        {/* Statistiques */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <Card>
            <CardContent style={{ textAlign: 'center', padding: '1.5rem' }}>
              <Text style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--autodin-primary)' }}>
                {demandesToShow.filter(d => d.status === 'active').length}
              </Text>
              <Text style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                Demandes actives
              </Text>
            </CardContent>
          </Card>
          <Card>
            <CardContent style={{ textAlign: 'center', padding: '1.5rem' }}>
              <Text style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--qwanyx-info)' }}>
                {demandesToShow.reduce((acc, d) => acc + d.reponses, 0)}
              </Text>
              <Text style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                Réponses reçues
              </Text>
            </CardContent>
          </Card>
          <Card>
            <CardContent style={{ textAlign: 'center', padding: '1.5rem' }}>
              <Text style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--qwanyx-success)' }}>
                {demandesToShow.filter(d => d.status === 'closed').length}
              </Text>
              <Text style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                Demandes satisfaites
              </Text>
            </CardContent>
          </Card>
        </div>

        {/* Liste des demandes */}
        <Card>
          <CardContent>
            <Heading as="h2" style={{
              fontSize: '1.5rem',
              marginBottom: '1.5rem',
              color: 'var(--autodin-dark)'
            }}>
              {viewMode === 'mes-demandes' ? 'Vos demandes récentes' : 'Demandes récentes de la communauté'}
            </Heading>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--gray-300)' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--gray-700)' }}>
                      Pièce
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--gray-700)' }}>
                      Véhicule
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--gray-700)' }}>
                      Date
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--gray-700)' }}>
                      Réponses
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--gray-700)' }}>
                      Statut
                    </th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--gray-700)' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {demandesToShow.map(demande => (
                    <tr key={demande.id} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                      <td style={{ padding: '1rem' }}>
                        <Text style={{ fontWeight: '600', color: 'var(--autodin-dark)' }}>
                          {demande.titre}
                        </Text>
                        <Text style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                          {demande.description}
                        </Text>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <Text>{demande.marque} {demande.modele}</Text>
                        <Text style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                          {demande.annee}
                        </Text>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <Text style={{ fontSize: '0.875rem' }}>
                          {new Date(demande.date).toLocaleDateString('fr-FR')}
                        </Text>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <Badge variant="info">
                          {demande.reponses} réponses
                        </Badge>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        {getStatusBadge(demande.status)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <Flex style={{ gap: '0.5rem', justifyContent: 'center' }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            style={{ color: 'var(--qwanyx-info)' }}
                            title="Voir détails"
                          >
                            <i className="fas fa-eye"></i>
                          </Button>
                          {demande.status === 'active' && viewMode === 'toutes-demandes' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              style={{ color: 'var(--qwanyx-success)' }}
                              onClick={() => handleResponse(demande)}
                              title="Répondre à cette demande"
                            >
                              <i className="fas fa-reply"></i>
                            </Button>
                          )}
                          {demande.status === 'active' && viewMode === 'mes-demandes' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              style={{ color: 'var(--qwanyx-error)' }}
                              title="Clôturer la demande"
                            >
                              <i className="fas fa-times"></i>
                            </Button>
                          )}
                        </Flex>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Container>

      {/* Modal de réponse */}
      {showResponseModal && selectedDemande && (
        <Modal
          isOpen={showResponseModal}
          onClose={() => setShowResponseModal(false)}
          title={`Répondre à la demande : ${selectedDemande.titre}`}
        >
          <div style={{ padding: '1.5rem' }}>
            <Form onSubmit={submitResponse}>
            <Field name="prix" label="Prix proposé (€)" required>
              <Input 
                name="prix"
                type="text"
                placeholder="Ex: 150€"
                value={responseData.prix}
                onChange={(e) => setResponseData({...responseData, prix: e.target.value})}
                required
              />
            </Field>

            <Field name="disponibilite" label="Disponibilité" required>
              <Select 
                name="disponibilite"
                value={responseData.disponibilite}
                onChange={(e) => setResponseData({...responseData, disponibilite: e.target.value})}
                options={[
                  { value: '', label: 'Sélectionnez...', disabled: true },
                  { value: 'stock', label: 'En stock' },
                  { value: '24h', label: 'Disponible sous 24h' },
                  { value: '48h', label: 'Disponible sous 48h' },
                  { value: 'semaine', label: 'Disponible sous 1 semaine' },
                  { value: 'commande', label: 'Sur commande' }
                ]}
                fullWidth
              />
            </Field>

            <Field name="etat" label="État de la pièce" required>
              <Select 
                name="etat"
                value={responseData.etat}
                onChange={(e) => setResponseData({...responseData, etat: e.target.value})}
                options={[
                  { value: '', label: 'Sélectionnez...', disabled: true },
                  { value: 'neuf', label: 'Neuf' },
                  { value: 'excellent', label: 'Excellent état' },
                  { value: 'bon', label: 'Bon état' },
                  { value: 'correct', label: 'État correct' },
                  { value: 'usage', label: 'Traces d\'usage' }
                ]}
                fullWidth
              />
            </Field>

            <Field name="message" label="Message">
              <Textarea
                name="message"
                placeholder="Informations complémentaires sur la pièce..."
                value={responseData.message}
                onChange={(e) => setResponseData({...responseData, message: e.target.value})}
                rows={4}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </Field>

            <Flex style={{ gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowResponseModal(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="solid"
                style={{ 
                  backgroundColor: 'var(--autodin-primary)',
                  color: 'white'
                }}
              >
                <i className="fas fa-paper-plane" style={{ marginRight: '0.5rem' }}></i>
                Envoyer la réponse
              </Button>
            </Flex>
          </Form>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default DemandesPage