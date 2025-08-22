import React, { useState, useCallback, useEffect } from 'react'
import { ObjectId } from 'bson'
import { 
  Flex, 
  Text, 
  Button, 
  Icon, 
  Card,
  Heading,
  Badge,
  SearchBar,
  Collapsible,
  Tooltip,
  UserProfile
} from '@qwanyx/ui'
import { QFlow } from '@qwanyx/canvas'
import { NodeRegistry, NodeCategory, NodeDefinition } from '../execution'

interface DigitalHumanEditorProps {
  dhId?: string
  dhName?: string
  dhFirstName?: string
  dhEmail?: string
}

export const DigitalHumanEditor: React.FC<DigitalHumanEditorProps> = ({ 
  dhId, 
  dhName = 'Digital Human',
  dhFirstName = '',
  dhEmail = 'dh@qwanyx.com' 
}) => {
  // const [selectedNode] = useState<any>(null) // Will be used for node properties
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [nodeTypes, setNodeTypes] = useState<Record<string, NodeDefinition[]>>({})
  const [nodes, setNodes] = useState<any[]>([])
  const [edges, setEdges] = useState<any[]>([])
  
  // No more demo nodes by default - start with empty canvas
  
  // Get workspace and user info from localStorage
  const [workspace, setWorkspace] = useState('autodin')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [dhFullData, setDhFullData] = useState<any>(null)
  
  // Load available node types
  useEffect(() => {
    const registry = NodeRegistry.getInstance()
    const menuStructure = registry.getMenuStructure()
    setNodeTypes(menuStructure)
    
    // Get user and workspace from localStorage
    const storedUser = localStorage.getItem('autodin_user')
    
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setCurrentUser(user)
      setWorkspace(user.workspace || 'autodin')
    }
    
    // Get complete DH data from sessionStorage (passed from dashboard)
    const storedDH = sessionStorage.getItem('editing_dh')
    if (storedDH) {
      const dhData = JSON.parse(storedDH)
      setDhFullData(dhData)
      console.log('Loaded DH from session:', dhData)
    }
  }, [])
  
  // Load existing flow from DH memory
  useEffect(() => {
    const loadFlow = async () => {
      if (!dhId) return
      
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:5002/api/dh/${dhId}/flow`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const flowData = await response.json()
          if (flowData.nodes && flowData.nodes.length > 0) {
            setNodes(flowData.nodes)
            console.log('Loaded flow with', flowData.nodes.length, 'nodes')
          }
        }
      } catch (error) {
        console.error('Error loading flow:', error)
      }
    }
    
    loadFlow()
  }, [dhId])

  const handleSave = useCallback(async () => {
    if (!dhId) {
      console.error('No DH ID provided')
      return
    }
    
    setIsSaving(true)
    
    try {
      // Prepare flow data
      const flowData = {
        name: 'Main Flow',
        description: `Flow configuration for ${dhName}`,
        nodes: nodes,
        edges: edges,
        active: true
      }
      
      // Get auth token from localStorage
      const token = localStorage.getItem('token')
      
      // Save to API
      const response = await fetch(`http://localhost:5002/api/dh/${dhId}/flow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(flowData)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Flow saved successfully:', result)
        // TODO: Show success notification
      } else {
        console.error('Failed to save flow:', response.statusText)
        // TODO: Show error notification
      }
    } catch (error) {
      console.error('Error saving flow:', error)
      // TODO: Show error notification
    } finally {
      setIsSaving(false)
    }
  }, [dhId, dhName, nodes, edges])

  const handleBack = () => {
    // Navigate directly to DH list (thot tab)
    window.location.href = '/dashboard?tab=thot'
  }
  
  // Download flow as JSON file
  const handleDownload = () => {
    const flowData = {
      name: `${dhName}_flow`,
      description: `Flow configuration for ${dhName}`,
      nodes: nodes,
      edges: edges,
      created: new Date().toISOString(),
      version: '1.0.0'
    }
    
    const dataStr = JSON.stringify(flowData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportName = `${dhName.toLowerCase().replace(/\s+/g, '_')}_flow_${Date.now()}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportName)
    linkElement.click()
  }
  
  // Upload/reload flow from JSON file
  const handleUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    
    input.onchange = async (e: any) => {
      const file = e.target.files[0]
      if (!file) return
      
      try {
        const text = await file.text()
        const flowData = JSON.parse(text)
        
        // Load nodes
        if (flowData.nodes) {
          setNodes(flowData.nodes)
          console.log('Loaded', flowData.nodes.length, 'nodes from file')
        }
        
        // TODO: Load edges when we implement edge management
        
      } catch (error) {
        console.error('Error loading flow file:', error)
        alert('Error loading flow file. Please check the file format.')
      }
    }
    
    input.click()
  }
  
  // Load a template flow
  const loadTemplate = (templateName: string) => {
    // Demo Email Flow template
    if (templateName === 'demo_email') {
      const demoNodes = [
        {
          _id: "demo_email_received",
          type: "icon",
          x: 350,
          y: 100,
          data: {
            label: "Email reçu",
            icon: "Email",
            description: "Déclencheur: Reception d'un nouvel email",
            color: "primary"
          }
        },
        {
          _id: "demo_analyze",
          type: "icon",
          x: 350,
          y: 280,
          data: {
            label: "Analyser",
            icon: "Analytics",
            description: "Analyse du contenu avec IA",
            color: "success"
          }
        },
        {
          _id: "demo_respond",
          type: "icon",
          x: 350,
          y: 460,
          data: {
            label: "Répondre",
            icon: "Send",
            description: "Génère et envoie une réponse",
            color: "warning"
          }
        }
      ]
      
      const demoEdges = [
        {
          _id: "demo_edge_1",
          s: "demo_email_received",  // QEdge uses 's' for source
          t: "demo_analyze"          // QEdge uses 't' for target
        },
        {
          _id: "demo_edge_2",
          s: "demo_analyze",
          t: "demo_respond"
        }
      ]
      
      setNodes(demoNodes)
      setEdges(demoEdges)
      console.log('Loaded demo email flow template with edges')
    }
  }
  
  // Handle drag start for menu items
  const handleDragStart = (e: React.DragEvent, nodeType: string, nodeLabel: string, nodeIcon: string) => {
    e.dataTransfer.setData('nodeType', nodeType)
    e.dataTransfer.setData('nodeLabel', nodeLabel)
    e.dataTransfer.setData('nodeIcon', nodeIcon)
    e.dataTransfer.effectAllowed = 'copy'
  }
  
  // Handle drop on canvas
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    
    const nodeType = e.dataTransfer.getData('nodeType')
    const nodeLabel = e.dataTransfer.getData('nodeLabel')
    const nodeIcon = e.dataTransfer.getData('nodeIcon')
    
    if (!nodeType) return
    
    // Get canvas position
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Create new node with nodeType in data for custom rendering
    const newNode = {
      _id: new ObjectId().toHexString(),
      type: 'icon' as const,
      x: x,
      y: y,
      data: {
        label: nodeLabel,
        icon: nodeIcon,
        description: `${nodeType} node`,
        color: 'primary',
        // Add default data for start-stop nodes
        ...(nodeType === 'start-stop' ? {
          nodeType: 'start-stop',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${dhName || 'DH'}`,
          isRunning: false
        } : {}),
        // Add Mail config data (SMTP & IMAP)
        ...(nodeType === 'mail-config' ? {
          nodeType: 'mail-config',
          color: 'error',
          icon: 'MailOutline',
          label: 'Mail Config',
          mailConfig: {
            smtp: {
              email: dhEmail || '',
              server: 'mail.qwanyx.com',
              port: 587,
              password: '',
              secure: true
            },
            imap: {
              email: dhEmail || '',
              server: 'mail.qwanyx.com',
              port: 993,
              password: '',
              secure: true
            }
          }
        } : {}),
        // For other nodes, just store the nodeType
        ...(!['start-stop', 'mail-config'].includes(nodeType) ? { 
          nodeType: nodeType 
        } : {})
      }
    }
    
    setNodes(prev => [...prev, newNode])
  }, [dhName, dhEmail])
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
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
          
          <Tooltip content="Charger un workflow">
            <Button 
              variant="ghost" 
              size="md"
              onClick={handleUpload}
              style={{
                padding: '12px',
                minWidth: 'auto',
                width: '48px',
                height: '48px'
              }}
            >
              <Icon name="Upload" size="md" />
            </Button>
          </Tooltip>
          
          <Tooltip content="Télécharger le workflow">
            <Button 
              variant="ghost" 
              size="md"
              onClick={handleDownload}
              style={{
                padding: '12px',
                minWidth: 'auto',
                width: '48px',
                height: '48px'
              }}
            >
              <Icon name="Download" size="md" />
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
              {/* Dynamic Node Categories from Registry */}
              {Object.entries(nodeTypes).map(([category, nodes]) => {
                // Map category to display names and icons
                const categoryConfig: Record<string, { title: string; icon: string; expanded: boolean }> = {
                  [NodeCategory.CONTROL]: { title: 'Contrôle', icon: 'PowerSettingsNew', expanded: true },
                  [NodeCategory.TRIGGER]: { title: 'Déclencheurs', icon: 'PlayArrow', expanded: false },
                  [NodeCategory.ACTION]: { title: 'Actions', icon: 'Bolt', expanded: false },
                  [NodeCategory.LOGIC]: { title: 'Logique', icon: 'FilterAlt', expanded: false },
                  [NodeCategory.MEMORY]: { title: 'Mémoire', icon: 'Storage', expanded: false },
                  [NodeCategory.INTEGRATION]: { title: 'Intégrations', icon: 'Api', expanded: false },
                  [NodeCategory.AI]: { title: 'Intelligence', icon: 'Psychology', expanded: false },
                  [NodeCategory.DATA]: { title: 'Données', icon: 'Info', expanded: false }
                }
                
                const config = categoryConfig[category] || { 
                  title: category, 
                  icon: 'Category', 
                  expanded: false 
                }
                
                if (nodes.length === 0) return null
                
                return (
                  <Collapsible 
                    key={category}
                    title={config.title} 
                    icon={<Icon name={config.icon as any} size="sm" />} 
                    count={nodes.length}
                    defaultExpanded={config.expanded}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {nodes.map((node) => (
                        <Card 
                          key={node.type}
                          draggable
                          onDragStart={(e) => handleDragStart(e, node.type, node.name, node.icon || 'Category')}
                          style={{ 
                            padding: '10px',
                            cursor: 'grab',
                            border: '1px dashed var(--qwanyx-border)',
                            backgroundColor: 'var(--qwanyx-bg-primary)'
                          }}
                        >
                          <Flex align="center" gap="sm">
                            <Icon name={node.icon as any} size="sm" />
                            <Text size="sm">{node.name}</Text>
                          </Flex>
                        </Card>
                      ))}
                    </div>
                  </Collapsible>
                )
              })}
              

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
        <div 
          style={{
            flex: 1,
            position: 'relative',
            backgroundColor: '#fafafa'
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <QFlow
            nodes={nodes}
            edges={edges}
            context={{ 
              dhId, 
              dhName, 
              dhFirstName, 
              dhEmail,
              dhFullData,
              workspace,
              currentUser
            }}
            onNodesChange={setNodes}
            onEdgesChange={setEdges}
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
                count={2}
                defaultExpanded={true}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Card 
                    style={{ padding: '12px', cursor: 'pointer', backgroundColor: 'var(--qwanyx-bg-primary)' }}
                    onClick={() => loadTemplate('demo_email')}
                  >
                    <Flex align="center" gap="sm">
                      <Icon name="Email" size="sm" />
                      <Text size="sm">Demo Email Flow</Text>
                    </Flex>
                  </Card>
                  <Card 
                    style={{ padding: '12px', cursor: 'pointer', backgroundColor: 'var(--qwanyx-bg-primary)' }}
                    onClick={() => { setNodes([]); setEdges([]) }}
                  >
                    <Flex align="center" gap="sm">
                      <Icon name="Clear" size="sm" />
                      <Text size="sm">Clear Canvas</Text>
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
