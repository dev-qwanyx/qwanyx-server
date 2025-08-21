import React, { useState, useCallback } from 'react'
import { 
  Flex, 
  Text, 
  Button, 
  Icon, 
  Card,
  Heading,
  Badge,
  UserProfile,
  SearchBar,
  Collapsible,
  Tooltip
} from '@qwanyx/ui'
import { QwanyxFlowStandalone } from '@qwanyx/canvas'

interface DigitalHumanEditorProps {
  dhId?: string
  dhName?: string
  dhEmail?: string
}

export const DigitalHumanEditor: React.FC<DigitalHumanEditorProps> = ({ 
  dhId, 
  dhName = 'Digital Human',
  dhEmail = 'dh@qwanyx.com' 
}) => {
  // const [selectedNode] = useState<any>(null) // Will be used for node properties
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    // TODO: Save to API
    console.log('Saving workflow')
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }, [])

  const handleBack = () => {
    // Navigate directly to DH list (thot tab)
    window.location.href = '/dashboard?tab=thot'
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--qwanyx-bg-primary)',
      overflow: 'hidden'
    }}>
      {/* Slim Header */}
      <div style={{
        height: '60px',
        backgroundColor: 'var(--qwanyx-card)',
        borderBottom: '1px solid var(--qwanyx-border)',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        {/* Left side - DH Info */}
        <Flex align="center" gap="md">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBack}
            style={{ gap: '4px' }}
          >
            <Icon name="ArrowBack" size="sm" />
            Retour
          </Button>
          
          <div style={{
            width: '1px',
            height: '30px',
            backgroundColor: 'var(--qwanyx-border)'
          }} />
          
          <UserProfile
            user={{ name: dhName, email: dhEmail }}
            size="sm"
          />
          
          <Badge variant="subtle" style={{ marginLeft: '8px' }}>
            ID: {dhId || 'new'}
          </Badge>
        </Flex>

        {/* Center - Title */}
        <Heading size="lg">Configuration DH Brain</Heading>

        {/* Right side - Actions */}
        <Flex align="center" gap="sm">
          <Tooltip content="Tester le workflow">
            <Button 
              variant="ghost" 
              size="md"
              onClick={() => console.log('Test process')}
              style={{
                padding: '12px',
                minWidth: 'auto',
                width: '48px',
                height: '48px'
              }}
            >
              <Icon name="PlayArrow" size="md" />
            </Button>
          </Tooltip>
          
          <Tooltip content="Sauvegarder le workflow">
            <Button 
              variant="ghost" 
              size="md"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                padding: '12px',
                minWidth: 'auto',
                width: '48px',
                height: '48px'
              }}
            >
              <Icon name="Save" size="md" />
            </Button>
          </Tooltip>
        </Flex>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Left Toolbox - Hierarchical Node Menu */}
        <div style={{
          width: '300px',
          backgroundColor: 'var(--qwanyx-card)',
          borderRight: '1px solid var(--qwanyx-border)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0
        }}>
          {/* Search Bar */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--qwanyx-border)' }}>
            <SearchBar
              placeholder="Rechercher un composant..."
              value={searchQuery}
              onChange={setSearchQuery}
              size="sm"
            />
          </div>
          
          {/* Hierarchical Menu */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* Email Components */}
              <Collapsible 
                title="Connexions" 
                icon={<Icon name="Wifi" size="sm" />} 
                count={4}
                defaultExpanded={true}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Card 
                    draggable
                    style={{ 
                      padding: '10px',
                      cursor: 'grab',
                      border: '1px dashed var(--qwanyx-border)',
                      backgroundColor: 'var(--qwanyx-bg-primary)'
                    }}
                  >
                    <Flex align="center" gap="sm">
                      <Icon name="Inbox" size="sm" />
                      <Text size="sm">IMAP Config</Text>
                    </Flex>
                  </Card>
                  
                  <Card 
                    draggable
                    style={{ 
                      padding: '10px',
                      cursor: 'grab',
                      border: '1px dashed var(--qwanyx-border)',
                      backgroundColor: 'var(--qwanyx-bg-primary)'
                    }}
                  >
                    <Flex align="center" gap="sm">
                      <Icon name="Send" size="sm" />
                      <Text size="sm">SMTP Config</Text>
                    </Flex>
                  </Card>
                  
                  <Card 
                    draggable
                    style={{ 
                      padding: '10px',
                      cursor: 'grab',
                      border: '1px dashed var(--qwanyx-border)',
                      backgroundColor: 'var(--qwanyx-bg-primary)'
                    }}
                  >
                    <Flex align="center" gap="sm">
                      <Icon name="Key" size="sm" />
                      <Text size="sm">Credentials</Text>
                    </Flex>
                  </Card>
                  
                  <Card 
                    draggable
                    style={{ 
                      padding: '10px',
                      cursor: 'grab',
                      border: '1px dashed var(--qwanyx-border)',
                      backgroundColor: 'var(--qwanyx-bg-primary)'
                    }}
                  >
                    <Flex align="center" gap="sm">
                      <Icon name="Power" size="sm" />
                      <Text size="sm">Test Connection</Text>
                    </Flex>
                  </Card>
                </div>
              </Collapsible>

              {/* Email Operations */}
              <Collapsible 
                title="Email" 
                icon={<Icon name="Email" size="sm" />} 
                count={8}
                defaultExpanded={false}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Card draggable style={{ padding: '10px', cursor: 'grab', border: '1px dashed var(--qwanyx-border)', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="Folder" size="sm" />
                      <Text size="sm">Select Mailbox</Text>
                    </Flex>
                  </Card>
                  <Card draggable style={{ padding: '10px', cursor: 'grab', border: '1px dashed var(--qwanyx-border)', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="Search" size="sm" />
                      <Text size="sm">Fetch Emails</Text>
                    </Flex>
                  </Card>
                  <Card draggable style={{ padding: '10px', cursor: 'grab', border: '1px dashed var(--qwanyx-border)', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="OpenInNew" size="sm" />
                      <Text size="sm">Read Email</Text>
                    </Flex>
                  </Card>
                  <Card draggable style={{ padding: '10px', cursor: 'grab', border: '1px dashed var(--qwanyx-border)', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="Edit" size="sm" />
                      <Text size="sm">Compose Email</Text>
                    </Flex>
                  </Card>
                  <Card draggable style={{ padding: '10px', cursor: 'grab', border: '1px dashed var(--qwanyx-border)', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="Send" size="sm" />
                      <Text size="sm">Send Email</Text>
                    </Flex>
                  </Card>
                </div>
              </Collapsible>

              {/* Triggers */}
              <Collapsible 
                title="Déclencheurs" 
                icon={<Icon name="PlayArrow" size="sm" />} 
                count={5}
                defaultExpanded={false}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Card draggable style={{ padding: '10px', cursor: 'grab', border: '1px dashed var(--qwanyx-border)', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="Email" size="sm" />
                      <Text size="sm">Email Received</Text>
                    </Flex>
                  </Card>
                  <Card draggable style={{ padding: '10px', cursor: 'grab', border: '1px dashed var(--qwanyx-border)', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="Schedule" size="sm" />
                      <Text size="sm">Timer / Cron</Text>
                    </Flex>
                  </Card>
                  <Card draggable style={{ padding: '10px', cursor: 'grab', border: '1px dashed var(--qwanyx-border)', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="Api" size="sm" />
                      <Text size="sm">Webhook</Text>
                    </Flex>
                  </Card>
                </div>
              </Collapsible>

              {/* Actions */}
              <Collapsible 
                title="Actions" 
                icon={<Icon name="Bolt" size="sm" />} 
                count={6}
                defaultExpanded={false}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Card draggable style={{ padding: '10px', cursor: 'grab', border: '1px dashed var(--qwanyx-border)', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="Send" size="sm" />
                      <Text size="sm">Send Response</Text>
                    </Flex>
                  </Card>
                  <Card draggable style={{ padding: '10px', cursor: 'grab', border: '1px dashed var(--qwanyx-border)', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="Database" size="sm" />
                      <Text size="sm">Database Query</Text>
                    </Flex>
                  </Card>
                  <Card draggable style={{ padding: '10px', cursor: 'grab', border: '1px dashed var(--qwanyx-border)', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="Psychology" size="sm" />
                      <Text size="sm">AI Generate</Text>
                    </Flex>
                  </Card>
                </div>
              </Collapsible>

              {/* Logic & Control */}
              <Collapsible 
                title="Logique" 
                icon={<Icon name="AccountTree" size="sm" />} 
                count={4}
                defaultExpanded={false}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Card draggable style={{ padding: '10px', cursor: 'grab', border: '1px dashed var(--qwanyx-border)', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="Help" size="sm" />
                      <Text size="sm">Condition</Text>
                    </Flex>
                  </Card>
                  <Card draggable style={{ padding: '10px', cursor: 'grab', border: '1px dashed var(--qwanyx-border)', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="Loop" size="sm" />
                      <Text size="sm">Loop</Text>
                    </Flex>
                  </Card>
                  <Card draggable style={{ padding: '10px', cursor: 'grab', border: '1px dashed var(--qwanyx-border)', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="FolderOpen" size="sm" />
                      <Text size="sm">Sub-Process</Text>
                    </Flex>
                  </Card>
                </div>
              </Collapsible>

              {/* Divider */}
              <div style={{ 
                height: '1px', 
                backgroundColor: 'var(--qwanyx-border)', 
                margin: '12px 0' 
              }} />
              
              {/* Favorites */}
              <div>
                <Flex align="center" gap="sm" style={{ marginBottom: '8px' }}>
                  <Icon name="Star" size="sm" />
                  <Heading size="sm">Favoris</Heading>
                </Flex>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Card draggable style={{ padding: '10px', cursor: 'grab', border: '2px solid var(--qwanyx-primary)', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="Email" size="sm" />
                      <Text size="sm">Email Workflow</Text>
                    </Flex>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div style={{
          flex: 1,
          position: 'relative',
          backgroundColor: '#fafafa'
        }}>
          <QwanyxFlowStandalone
            initialNodes={[
              {
                id: '1',
                type: 'icon',
                position: { x: 350, y: 100 },
                data: { 
                  label: 'Email reçu', 
                  icon: 'Email',
                  description: 'Déclencheur: Reception d\'un nouvel email',
                  color: 'primary'
                }
              },
              {
                id: '2',
                type: 'icon',
                position: { x: 350, y: 280 },
                data: { 
                  label: 'Analyser', 
                  icon: 'Analytics',
                  description: 'Analyse du contenu avec IA',
                  color: 'accent'
                }
              },
              {
                id: '3',
                type: 'icon',
                position: { x: 350, y: 460 },
                data: { 
                  label: 'Répondre', 
                  icon: 'Send',
                  description: 'Envoyer une réponse automatique',
                  color: 'success'
                }
              }
            ]}
            initialEdges={[
              { id: 'e1-2', source: '1', target: '2', type: 'smart' },
              { id: 'e2-3', source: '2', target: '3', type: 'smart' }
            ]}
            height="100%"
            showToolbar={false}
          />
        </div>

        {/* Right Toolbox - QFlows Library */}
        <div style={{
          width: '320px',
          backgroundColor: 'var(--qwanyx-card)',
          borderLeft: '1px solid var(--qwanyx-border)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0
        }}>
          {/* Header with title and actions */}
          <div style={{ 
            padding: '16px', 
            borderBottom: '1px solid var(--qwanyx-border)'
          }}>
            <Flex align="center" justify="between">
              <Heading size="md">QFlows</Heading>
              <Flex gap="sm">
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => console.log('New QFlow')}
                >
                  <Icon name="Add" size="sm" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => console.log('Import QFlow')}
                >
                  <Icon name="Upload" size="sm" />
                </Button>
              </Flex>
            </Flex>
          </div>
          
          {/* QFlows Tree */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Current DH Flows */}
              <Collapsible 
                title="Current DH" 
                icon={<Icon name="Person" size="sm" />}
                count={3}
                defaultExpanded={true}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Card 
                    style={{ 
                      padding: '12px',
                      cursor: 'pointer',
                      border: '2px solid var(--qwanyx-primary)',
                      backgroundColor: 'var(--qwanyx-bg-primary)'
                    }}
                    onClick={() => console.log('Load main flow')}
                  >
                    <Flex align="center" justify="between">
                      <Flex align="center" gap="sm">
                        <Icon name="PlayCircle" size="sm" />
                        <div>
                          <Text size="sm" weight="semibold">Main Process</Text>
                          <Text size="sm" style={{ fontSize: '12px', color: 'var(--qwanyx-text-secondary)' }}>
                            Active • Modified 2h ago
                          </Text>
                        </div>
                      </Flex>
                      <Icon name="MoreVert" size="sm" />
                    </Flex>
                  </Card>
                  
                  <Card 
                    style={{ 
                      padding: '12px',
                      cursor: 'pointer',
                      backgroundColor: 'var(--qwanyx-bg-primary)'
                    }}
                  >
                    <Flex align="center" justify="between">
                      <Flex align="center" gap="sm">
                        <Icon name="Email" size="sm" />
                        <div>
                          <Text size="sm" weight="semibold">Email Handler</Text>
                          <Text size="sm" style={{ fontSize: '12px', color: 'var(--qwanyx-text-secondary)' }}>
                            Draft • 15 nodes
                          </Text>
                        </div>
                      </Flex>
                      <Icon name="MoreVert" size="sm" />
                    </Flex>
                  </Card>
                  
                  <Card 
                    style={{ 
                      padding: '12px',
                      cursor: 'pointer',
                      backgroundColor: 'var(--qwanyx-bg-primary)'
                    }}
                  >
                    <Flex align="center" gap="sm">
                      <Icon name="Support" size="sm" />
                      <div>
                        <Text size="sm" weight="semibold">Customer Support</Text>
                        <Text size="sm" style={{ fontSize: '12px', color: 'var(--qwanyx-text-secondary)' }}>
                          Template • 8 nodes
                        </Text>
                      </div>
                    </Flex>
                  </Card>
                </div>
              </Collapsible>
              
              {/* Shared Templates */}
              <Collapsible 
                title="Templates" 
                icon={<Icon name="FolderSpecial" size="sm" />}
                count={5}
                defaultExpanded={false}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Card style={{ padding: '12px', cursor: 'pointer', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="AutoAwesome" size="sm" />
                      <Text size="sm">Auto-Reply System</Text>
                    </Flex>
                  </Card>
                  <Card style={{ padding: '12px', cursor: 'pointer', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="Category" size="sm" />
                      <Text size="sm">Email Categorizer</Text>
                    </Flex>
                  </Card>
                  <Card style={{ padding: '12px', cursor: 'pointer', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="PriorityHigh" size="sm" />
                      <Text size="sm">Priority Router</Text>
                    </Flex>
                  </Card>
                </div>
              </Collapsible>
              
              {/* Team Flows */}
              <Collapsible 
                title="Team Library" 
                icon={<Icon name="Groups" size="sm" />}
                count={12}
                defaultExpanded={false}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Card style={{ padding: '12px', cursor: 'pointer', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="ShoppingCart" size="sm" />
                      <Text size="sm">Order Processing</Text>
                    </Flex>
                  </Card>
                  <Card style={{ padding: '12px', cursor: 'pointer', backgroundColor: 'var(--qwanyx-bg-primary)' }}>
                    <Flex align="center" gap="sm">
                      <Icon name="ContactSupport" size="sm" />
                      <Text size="sm">FAQ Responder</Text>
                    </Flex>
                  </Card>
                </div>
              </Collapsible>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}