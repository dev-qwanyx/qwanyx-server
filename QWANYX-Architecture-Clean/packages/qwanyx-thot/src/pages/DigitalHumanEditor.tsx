import React, { useState, useCallback, useEffect, useRef } from 'react'
import { ObjectId } from 'bson'
import { 
  Flex, 
  Text, 
  Button, 
  Icon, 
  Card,
  Heading,
  SearchBar,
  Collapsible,
  Tooltip,
  UserProfile
} from '@qwanyx/ui'
import { QFlow } from '@qwanyx/canvas'
import { NodeRegistry, NodeCategory, NodeDefinition } from '../execution'
import { Breadcrumb } from '../components/Breadcrumb'


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
  console.log('🧠 DigitalHumanEditor mounted with:', { dhId, dhEmail })
  // const [selectedNode] = useState<any>(null) // Will be used for node properties
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [nodeTypes, setNodeTypes] = useState<Record<string, NodeDefinition[]>>({})
  const [nodes, setNodes] = useState<any[]>([])
  const [edges, setEdges] = useState<any[]>([])
  const [currentFlowTitle, setCurrentFlowTitle] = useState<string>('root')
  const [currentFlowId, setCurrentFlowId] = useState<string | undefined>(dhId)
  const [_flowStack, setFlowStack] = useState<Array<{id: string, title: string}>>([]) // Will be used for navigation breadcrumbs
  
  // No more demo nodes by default - start with empty canvas
  
  // Get workspace and user info from localStorage
  const [workspace, setWorkspace] = useState('autodin')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [dhFullData, setDhFullData] = useState<any>(null)
  
  // WebSocket connection to brain
  const wsRef = useRef<WebSocket | null>(null)
  const [_brainConnected, setBrainConnected] = useState(false)
  
  // Connect to brain on mount
  useEffect(() => {
    // Get DH email to use as brain ID
    const brainId = dhEmail?.replace('@', '-').replace('.', '-') || 'stephen-qwanyx-com'
    
    console.log('Connecting to brain:', brainId)
    
    // Connect to brain server
    const ws = new WebSocket('ws://localhost:3003/neural')
    wsRef.current = ws
    
    ws.onopen = () => {
      console.log('Connected to brain server')
      setBrainConnected(true)
      
      // Send connect message with brain ID
      ws.send(JSON.stringify({
        type: 'connect',
        brainId: brainId
      }))
    }
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        // FIXED: Only log important messages, not continuous stream messages
        if (message.type !== 'stream') {
          console.log('Brain message (non-stream):', message)
        } else {
          // Stream messages - DON'T LOG
        }
        
        // Handle event messages
        if (message.type === 'event' && message.payload) {
          const { event: eventType, nodes: brainNodes, edges: brainEdges } = message.payload
          
          if (eventType === 'state' && brainNodes && brainEdges) {
            console.log('Loading brain state:', brainNodes.length, 'nodes,', brainEdges.length, 'edges')
            setNodes(brainNodes)
            setEdges(brainEdges)
          } else if (eventType === 'connected') {
            console.log('Connected to brain server:', message.payload.message)
          }
        }
      } catch (err) {
        console.error('Failed to parse brain message:', err)
      }
    }
    
    ws.onerror = (error) => {
      console.error('Brain connection error:', error)
      setBrainConnected(false)
    }
    
    ws.onclose = () => {
      console.log('Disconnected from brain')
      setBrainConnected(false)
    }
    
    // Cleanup on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    }
  }, []) // Run once on mount, not dependent on dhEmail
  
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
      if (!dhId || !dhEmail) return
      
      try {
        const token = localStorage.getItem('autodin_token')
        const workspace = localStorage.getItem('autodin_workspace') || 'autodin'
        
        // Pull flow from memory using new endpoint
        const response = await fetch('http://localhost:5002/api/dh/pull', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Workspace': workspace
          },
          body: JSON.stringify({
            dh_email: dhEmail,
            dh_id: dhId
          })
        })
        
        if (response.ok) {
          const flowData = await response.json()
          // Load the flow data
          setNodes(flowData.nodes || [])
          setEdges(flowData.edges || [])
          setCurrentFlowTitle(flowData.title || 'root')
          
          if (flowData.exists) {
            console.log('Loaded existing flow:', flowData.title)
          } else {
            console.log('No flow found, starting with empty flow')
          }
        } else {
          console.error('Failed to load flow:', response.status)
          // Start with empty flow
          setNodes([])
          setEdges([])
          setCurrentFlowTitle('root')
        }
      } catch (error) {
        console.error('Error loading flow:', error)
        // Start with empty flow on error
        setNodes([])
        setEdges([])
        setCurrentFlowTitle('root')
      }
    }
    
    loadFlow()
  }, [dhId, dhEmail])

  const handleSave = useCallback(async () => {
    if (!dhId) {
      console.error('No DH ID provided')
      return
    }
    
    if (!dhEmail) {
      console.error('No DH email provided')
      return
    }
    
    setIsSaving(true)
    
    try {
      // Prepare data for push endpoint
      const pushData = {
        dh_email: dhEmail,
        dh_id: currentFlowId || dhId,  // Save to CURRENT flow, not always root!
        flow_title: currentFlowTitle,
        nodes: nodes,
        edges: edges
      }
      
      console.log('Saving flow:', currentFlowTitle, 'with ID:', currentFlowId || dhId)
      
      // Get auth token from localStorage
      const token = localStorage.getItem('autodin_token')
      const workspace = localStorage.getItem('autodin_workspace') || 'autodin'
      
      // Push to memory API
      const response = await fetch('http://localhost:5002/api/dh/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Workspace': workspace
        },
        body: JSON.stringify(pushData)
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
  }, [dhId, dhEmail, dhName, nodes, edges, currentFlowTitle])

  const handleBack = () => {
    // Navigate directly to DH list (thot tab)
    window.location.href = '/dashboard?tab=thot'
  }
  
  // Reset brain memory to clean state
  const handleResetMemory = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected')
      return
    }
    
    const confirmReset = window.confirm('Are you sure you want to reset the brain memory? This will clear all nodes and edges.')
    if (!confirmReset) return
    
    console.log('Resetting brain memory...')
    
    // Send reset command to brain
    wsRef.current.send(JSON.stringify({
      type: 'command',
      brainId: dhEmail?.replace('@', '-').replace('.', '-'),
      payload: {
        type: 'reset-memory'
      }
    }))
    
    // Clear local state
    setNodes([])
    setEdges([])
    console.log('Brain memory reset to clean state')
  }, [dhEmail])
  
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
      {/* Header with title and breadcrumb */}
      <div style={{
        height: '80px',
        backgroundColor: 'var(--qwanyx-card)',
        borderBottom: '1px solid var(--qwanyx-border)',
        padding: '10px 20px',
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
            user={{ 
              name: dhFirstName ? `${dhFirstName} ${dhName}` : dhName,
              email: dhEmail,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${dhFirstName}${dhName}`
            }}
            size="sm"
          />
        </Flex>

        {/* Center - Title with Breadcrumb below */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          flex: 1
        }}>
          <Heading size="lg" style={{ margin: 0, lineHeight: 1 }}>{currentFlowTitle}</Heading>
          {/* Breadcrumb navigation below title */}
          <Breadcrumb
            items={[
              { 
                label: 'Digital Humans', 
                href: '/dashboard?tab=thot' 
              },
              { 
                label: dhFirstName ? `${dhFirstName} ${dhName}` : dhName || 'DH',
                onClick: async () => {
                  // Always allow clicking to go back to root
                  console.log('Navigating back to root flow')
                  
                  // Only save if we're not already at root
                  if (currentFlowId !== dhId) {
                    await handleSave() // Save current flow first
                  }
                  
                  const token = localStorage.getItem('autodin_token')
                  const workspace = localStorage.getItem('autodin_workspace') || 'autodin'
                  
                  // Pull the root flow
                  const response = await fetch('http://localhost:5002/api/dh/pull', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`,
                      'X-Workspace': workspace
                    },
                    body: JSON.stringify({
                      dh_email: dhEmail,
                      dh_id: dhId  // Root flow ID
                    })
                  })
                  
                  if (response.ok) {
                    const flowData = await response.json()
                    setNodes(flowData.nodes || [])
                    setEdges(flowData.edges || [])
                    setCurrentFlowTitle('root')
                    setCurrentFlowId(dhId)
                    setFlowStack([])  // Clear the stack when going to root
                  }
                }
              },
              ..._flowStack.map((flow, index) => ({
                label: flow.title,
                onClick: async () => {
                  // Simple navigation - just pull the flow by its ID
                  console.log(`Navigating to flow: ${flow.title} (${flow.id})`)
                  await handleSave() // Save current flow first
                  
                  const token = localStorage.getItem('autodin_token')
                  const workspace = localStorage.getItem('autodin_workspace') || 'autodin'
                  
                  // Pull the target flow
                  const response = await fetch('http://localhost:5002/api/dh/pull', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`,
                      'X-Workspace': workspace
                    },
                    body: JSON.stringify({
                      dh_email: dhEmail,
                      dh_id: flow.id  // Just pull by the flow's ID
                    })
                  })
                  
                  if (response.ok) {
                    const flowData = await response.json()
                    setNodes(flowData.nodes || [])
                    setEdges(flowData.edges || [])
                    setCurrentFlowTitle(flow.title)
                    setCurrentFlowId(flow.id)
                    // Trim the stack to this point
                    setFlowStack(prev => prev.slice(0, index))
                  }
                }
              })),
              // Only show current flow if it's not 'root' or if we're in a sub-flow
              ...(_flowStack.length > 0 || currentFlowTitle !== 'root' ? [{
                label: currentFlowTitle, 
                active: true 
              }] : [])
            ]}
            separator="/"
            size="sm"
            style={{ opacity: 0.8 }}
          />
        </div>

        {/* Right side - Actions */}
        <Flex align="center" gap="md">
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
          
          <Tooltip content="Reset brain memory (clear all)">
            <Button 
              variant="ghost" 
              size="md"
              onClick={handleResetMemory}
              style={{
                padding: '12px',
                minWidth: 'auto',
                width: '48px',
                height: '48px',
                color: 'var(--qwanyx-error)'
              }}
            >
              <Icon name="RefreshCw" size="md" />
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
            onOpenSubFlow={async (node) => {
              // The node's ID IS the sub-flow ID
              const nodeIdStr = typeof node._id === 'object' ? node._id.toString() : String(node._id)
              const subFlowTitle = node.data?.label || 'Sub-flow'
              
              console.log('Opening sub-flow for node:', nodeIdStr, subFlowTitle, '- isMemoryNode:', node.data?.isMemoryNode)
              
              try {
                // Save current flow first WITH THE UPDATED NODE (marked as isMemoryNode)
                console.log('Saving current flow before navigation...')
                // Update the nodes array with the memory node
                const updatedNodes = nodes.map(n => 
                  (typeof n._id === 'object' ? n._id.toString() : String(n._id)) === nodeIdStr 
                    ? node  // Use the updated node with isMemoryNode flag
                    : n
                )
                
                const pushData = {
                  dh_email: dhEmail,
                  dh_id: currentFlowId || dhId,
                  flow_title: currentFlowTitle,
                  nodes: updatedNodes,  // Use updated nodes with memory flag
                  edges: edges
                }
                
                const token = localStorage.getItem('autodin_token')
                const workspace = localStorage.getItem('autodin_workspace') || 'autodin'
                
                const saveResponse = await fetch('http://localhost:5002/api/dh/push', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Workspace': workspace
                  },
                  body: JSON.stringify(pushData)
                })
                
                if (!saveResponse.ok) {
                  console.error('Failed to save current flow')
                  return
                }
                
                console.log('Current flow saved, loading sub-flow...')
                
                // Try to load the sub-flow using the node's ID
                const response = await fetch('http://localhost:5002/api/dh/pull', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-Workspace': workspace
                  },
                  body: JSON.stringify({
                    dh_email: dhEmail,
                    dh_id: nodeIdStr  // Use the node's ID as the sub-flow ID
                  })
                })
                
                if (response.ok) {
                  const flowData = await response.json()
                  console.log('Sub-flow data:', flowData)
                  
                  // Update navigation stack FIRST (but don't add 'root' to the stack)
                  if (currentFlowTitle !== 'root') {
                    setFlowStack(prev => [...prev, { id: currentFlowId || dhId || '', title: currentFlowTitle }])
                  }
                  setCurrentFlowId(nodeIdStr)
                  
                  if (flowData.exists) {
                    // Load existing sub-flow
                    console.log('Loading existing sub-flow')
                    setNodes(flowData.nodes || [])
                    setEdges(flowData.edges || [])
                    setCurrentFlowTitle(flowData.title || subFlowTitle)
                  } else {
                    // Create new sub-flow - completely empty, no self-reference!
                    console.log('Creating new empty sub-flow')
                    setNodes([])
                    setEdges([])
                    setCurrentFlowTitle(subFlowTitle)
                    
                    // Save the new empty sub-flow - NO nodes inside!
                    const newFlowData = {
                      dh_email: dhEmail,
                      dh_id: nodeIdStr,
                      flow_title: subFlowTitle,
                      nodes: [],  // Empty! The node exists in parent, not here
                      edges: []
                    }
                    
                    await fetch('http://localhost:5002/api/dh/push', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'X-Workspace': workspace
                      },
                      body: JSON.stringify(newFlowData)
                    })
                  }
                  
                  console.log('Navigation complete. Current flow:', subFlowTitle)
                } else {
                  console.error('Failed to load sub-flow:', response.status)
                }
              } catch (error) {
                console.error('Error navigating to sub-flow:', error)
              }
            }}
            onSave={async (nodes, edges) => {
              // Save to DH memory - use currentFlowId which could be a sub-flow
              const pushData = {
                dh_email: dhEmail,
                dh_id: currentFlowId || dhId,
                flow_title: currentFlowTitle,
                nodes: nodes,
                edges: edges
              }
              
              const token = localStorage.getItem('autodin_token')
              const workspace = localStorage.getItem('autodin_workspace') || 'autodin'
              
              const response = await fetch('http://localhost:5002/api/dh/push', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                  'X-Workspace': workspace
                },
                body: JSON.stringify(pushData)
              })
              
              if (!response.ok) {
                throw new Error(`Failed to save: ${response.statusText}`)
              }
              
              console.log('Flow saved successfully')
              // QFlow will automatically set hasUnsavedChanges to false after this returns
            }}
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
