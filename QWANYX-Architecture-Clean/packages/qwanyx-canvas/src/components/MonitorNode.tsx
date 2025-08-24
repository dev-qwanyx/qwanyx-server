import React, { useState, useEffect, useRef } from 'react'
import { 
  Tabs, TabsList, TabsTrigger, TabsContent,
  Flex, Text, Icon, Badge, Button, Switch, Card
} from '@qwanyx/ui'
import { Bag } from './Bag'

interface MonitorNodeProps {
  nodeId: string
  initialData?: {
    title?: string
    brainId?: string
    isLocked?: boolean
  }
  onChange?: (data: any) => void
  onClose?: () => void
}

interface MonitorEvent {
  id: string
  timestamp: Date
  type: 'mail' | 'memory' | 'thought' | 'connection' | 'compression' | 'error' | 'success'
  category: string
  message: string
  details?: any
}

interface Stats {
  totalMemories: number
  totalEmails: number
  totalContacts: number
  compressionRatio: number
  thoughtsPerSecond: number
  activeConnections: number
  mailQueue: number
  processingRate: number
  lastProcessed?: Date
  brainThoughts: number
  brainState: 'active' | 'thinking' | 'processing' | 'idle'
  lastThought?: Date
}

// Add CSS for pulse animation
const pulseStyle = `
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`

export const MonitorNode: React.FC<MonitorNodeProps> = ({
  nodeId,
  initialData,
  onChange,
  onClose
}) => {
  const [title] = useState(initialData?.title || 'DH Monitor')
  const [events, setEvents] = useState<MonitorEvent[]>([])
  const [stats, setStats] = useState<Stats>({
    totalMemories: 0,
    totalEmails: 0,
    totalContacts: 0,
    compressionRatio: 0,
    thoughtsPerSecond: 0,
    activeConnections: 0,
    mailQueue: 0,
    processingRate: 0,
    brainThoughts: 0,
    brainState: 'idle'
  })
  const [mailServiceStatus, setMailServiceStatus] = useState<'stopped' | 'running'>('stopped')
  const [autoScroll, setAutoScroll] = useState(true)
  const [activeTab, setActiveTab] = useState('events')
  const eventsEndRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  // Inject pulse animation CSS
  useEffect(() => {
    const styleEl = document.createElement('style')
    styleEl.textContent = pulseStyle
    document.head.appendChild(styleEl)
    return () => {
      document.head.removeChild(styleEl)
    }
  }, [])

  // Connect to WebSocket for real-time updates
  useEffect(() => {
    const brainId = initialData?.brainId || 'phil-qwanyx-com'
    const ws = new WebSocket(`ws://localhost:3003/neural`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('📡 Monitor node connected to brain server')
      // First connect to the brain
      ws.send(JSON.stringify({ 
        type: 'connect',
        payload: { brainId }
      }))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      handleBrainEvent(data)
    }

    return () => {
      ws.close()
    }
  }, [initialData?.brainId])

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && eventsEndRef.current && activeTab === 'events') {
      eventsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [events, autoScroll, activeTab])

  const handleBrainEvent = (data: any) => {
    console.log('Brain event received:', data)
    
    // Handle stream events (thoughts)
    if (data.type === 'stream' && data.payload) {
      const { stream, data: streamData } = data.payload
      
      if (stream === 'thought') {
        // Update thought counter
        setStats(prev => ({ 
          ...prev, 
          brainThoughts: streamData.count || prev.brainThoughts + 1,
          brainState: 'thinking',
          lastThought: new Date(),
          thoughtsPerSecond: 10
        }))
        // Add event to log every 100 thoughts
        if (streamData.count % 100 === 0) {
          addEvent({
            type: 'thought',
            category: 'Brain',
            message: `${streamData.count} thoughts processed`
          })
        }
      }
    }
    
    // Handle regular events
    if (data.type === 'event' && data.payload) {
      const { event, data: eventData } = data.payload
      
      if (event === 'state') {
        // Initial connection - we get the current state
        console.log('Received initial state')
        // Brain is connected and alive
        setStats(prev => ({ 
          ...prev, 
          brainState: 'thinking'
        }))
      } else if (event === 'mail:received') {
        addEvent({
          type: 'mail',
          category: 'Email',
          message: `From ${data.payload.from}: ${data.payload.subject?.substring(0, 50)}...`
        })
        setStats(prev => ({ ...prev, totalEmails: prev.totalEmails + 1 }))
      } else if (event === 'contact:created') {
        addEvent({
          type: 'success',
          category: 'Contact',
          message: `New: ${data.payload.email}`
        })
        setStats(prev => ({ ...prev, totalContacts: prev.totalContacts + 1 }))
      } else if (event === 'mail:status') {
        addEvent({
          type: 'mail',
          category: 'Mail Service',
          message: data.payload.message
        })
        if (data.payload.queue) {
          setStats(prev => ({ ...prev, mailQueue: data.payload.queue }))
        }
      } else if (event === 'mail:processing') {
        addEvent({
          type: 'mail',
          category: 'Processing',
          message: `Processing email ${data.payload.current}/${data.payload.total}`
        })
        setStats(prev => ({ 
          ...prev, 
          mailQueue: data.payload.total - data.payload.current,
          lastProcessed: new Date()
        }))
      } else if (event === 'thought') {
        // Brain thinking events
        setStats(prev => ({ 
          ...prev, 
          brainThoughts: data.payload.count || prev.brainThoughts + 1,
          brainState: 'thinking',
          lastThought: new Date(),
          thoughtsPerSecond: 10 // Brain thinks 10 times per second
        }))
      } else if (event === 'state-change') {
        // Brain state changes
        setStats(prev => ({ 
          ...prev, 
          brainState: data.payload.state || 'active'
        }))
        addEvent({
          type: 'connection',
          category: 'Brain',
          message: `State: ${data.payload.state}`
        })
      }
    } else if (data.type === 'memory:formed') {
      addEvent({
        type: 'memory',
        category: 'Memory',
        message: `${data.memoryType} compressed ${(data.compressionRatio * 100).toFixed(0)}%`
      })
      setStats(prev => ({ ...prev, totalMemories: prev.totalMemories + 1 }))
    } else if (data.type === 'compression:cascade') {
      addEvent({
        type: 'compression',
        category: 'Cascade',
        message: `${data.count} memories → level ${data.level}`
      })
    }
  }

  const addEvent = (eventData: Omit<MonitorEvent, 'id' | 'timestamp'>) => {
    const newEvent: MonitorEvent = {
      ...eventData,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date()
    }
    setEvents(prev => [...prev.slice(-50), newEvent])  // Keep last 50 events
  }

  const toggleMailService = () => {
    const newStatus = mailServiceStatus === 'stopped' ? 'running' : 'stopped'
    setMailServiceStatus(newStatus)
    wsRef.current?.send(JSON.stringify({ 
      type: 'command',
      payload: {
        type: newStatus === 'running' ? 'startMailService' : 'stopMailService'
      }
    }))
    addEvent({
      type: newStatus === 'running' ? 'success' : 'error',
      category: 'Mail',
      message: `Service ${newStatus}`
    })
  }

  const getEventIcon = (type: MonitorEvent['type']) => {
    switch (type) {
      case 'mail': return '📧'
      case 'memory': return '🧠'
      case 'thought': return '⚡'
      case 'connection': return '🔗'
      case 'compression': return '🌊'
      case 'error': return '❌'
      case 'success': return '✅'
      default: return '📍'
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // Stop propagation for interactive elements
  const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
  }

  return (
    <Bag 
      color="#1f2937" 
      opacity={0.95} 
      blur={false} 
      padding="md"
      style={{ width: '700px', minHeight: '400px' }}
    >
      {/* Header */}
      <Flex direction="row" justify="between" align="center" style={{ marginBottom: '12px' }}>
        <Flex direction="row" gap="sm" align="center">
          <Text size="lg" weight="bold" style={{ color: '#f3f4f6' }}>
            {title}
          </Text>
          <Badge variant={mailServiceStatus === 'running' ? 'outline' : 'subtle'}>
            {mailServiceStatus}
          </Badge>
          {/* Brain Activity Indicator */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            padding: '4px 8px',
            backgroundColor: stats.brainState === 'thinking' ? '#065f46' : '#1f2937',
            borderRadius: '4px',
            transition: 'all 0.3s'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: stats.brainState === 'thinking' ? '#10b981' : '#6b7280',
              animation: stats.brainState === 'thinking' ? 'pulse 1s infinite' : 'none'
            }} />
            <Text size="xs" style={{ color: '#e5e7eb' }}>
              {stats.brainThoughts} thoughts
            </Text>
          </div>
        </Flex>
        <Flex direction="row" gap="sm" align="center">
          <Text size="sm" style={{ color: '#9ca3af' }}>Mail Service</Text>
          <Switch
            checked={mailServiceStatus === 'running'}
            onChange={toggleMailService}
          />
        </Flex>
      </Flex>

      {/* Tabs */}
      <Tabs defaultValue="events" value={activeTab} onValueChange={setActiveTab}>
        <TabsList style={{ backgroundColor: '#374151' }}>
          <TabsTrigger value="events">
            Events ({events.length})
          </TabsTrigger>
          <TabsTrigger value="stats">
            Statistics
          </TabsTrigger>
          <TabsTrigger value="mail">
            Mail Queue
          </TabsTrigger>
          <TabsTrigger value="memory">
            Memory Graph
          </TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events">
          <div 
            style={{
              height: '280px',
              overflowY: 'auto',
              backgroundColor: '#111827',
              borderRadius: '6px',
              padding: '8px'
            }}
            onMouseDown={stopPropagation}
          >
            {events.length === 0 ? (
              <Flex direction="col" align="center" justify="center" style={{ height: '100%' }}>
                <Icon name="Activity" size="lg" style={{ color: '#4b5563' }} />
                <Text size="sm" style={{ color: '#6b7280', marginTop: '8px' }}>
                  Waiting for brain activity...
                </Text>
              </Flex>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {events.map(event => (
                  <div
                    key={event.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 8px',
                      backgroundColor: '#1f2937',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    <span style={{ color: '#6b7280', minWidth: '60px' }}>
                      {formatTime(event.timestamp)}
                    </span>
                    <span style={{ fontSize: '14px' }}>{getEventIcon(event.type)}</span>
                    <span style={{ color: '#e5e7eb', flex: 1 }}>
                      <strong style={{ color: '#93c5fd' }}>{event.category}:</strong> {event.message}
                    </span>
                  </div>
                ))}
                <div ref={eventsEndRef} />
              </div>
            )}
          </div>
          
          {/* Controls */}
          <Flex direction="row" justify="between" align="center" style={{ marginTop: '8px' }}>
            <Flex direction="row" gap="sm" align="center">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                onClick={stopPropagation}
              />
              <Text size="xs" style={{ color: '#9ca3af' }}>Auto-scroll</Text>
            </Flex>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                stopPropagation(e)
                setEvents([])
              }}
            >
              Clear
            </Button>
          </Flex>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats">
          <div style={{ padding: '16px', backgroundColor: '#111827', borderRadius: '6px', minHeight: '200px' }}>
            {/* Brain Activity Card - Prominent at top */}
            <Card style={{ 
              padding: '16px', 
              backgroundColor: stats.brainState === 'thinking' ? '#064e3b' : '#1f2937',
              marginBottom: '16px',
              border: stats.brainState === 'thinking' ? '2px solid #10b981' : '2px solid #374151'
            }}>
              <Flex direction="row" justify="between" align="center">
                <Flex direction="col" gap="sm">
                  <Text size="sm" style={{ color: '#9ca3af' }}>Brain Activity</Text>
                  <Flex direction="row" gap="md" align="center">
                    <Text size="3xl" weight="bold" style={{ color: '#f3f4f6' }}>
                      {stats.brainThoughts.toLocaleString()}
                    </Text>
                    <Text size="lg" style={{ color: '#10b981' }}>
                      thoughts
                    </Text>
                  </Flex>
                  <Text size="xs" style={{ color: '#6b7280' }}>
                    {stats.thoughtsPerSecond} thoughts/sec • State: {stats.brainState}
                  </Text>
                </Flex>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: stats.brainState === 'thinking' 
                    ? 'radial-gradient(circle, #10b981, #065f46)' 
                    : 'radial-gradient(circle, #6b7280, #374151)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: stats.brainState === 'thinking' ? 'pulse 1s infinite' : 'none'
                }}>
                  <Text size="2xl">🧠</Text>
                </div>
              </Flex>
            </Card>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Card style={{ padding: '12px', backgroundColor: '#1f2937' }}>
                <Flex direction="col" gap="sm">
                  <Text size="xs" style={{ color: '#9ca3af' }}>Total Memories</Text>
                  <Text size="xl" weight="bold" style={{ color: '#f3f4f6' }}>
                    {stats.totalMemories}
                  </Text>
                  <Text size="xs" style={{ color: '#10b981' }}>🧠 Formed</Text>
                </Flex>
              </Card>
              
              <Card style={{ padding: '12px', backgroundColor: '#1f2937' }}>
                <Flex direction="col" gap="sm">
                  <Text size="xs" style={{ color: '#9ca3af' }}>Emails Processed</Text>
                  <Text size="xl" weight="bold" style={{ color: '#f3f4f6' }}>
                    {stats.totalEmails}
                  </Text>
                  <Text size="xs" style={{ color: '#3b82f6' }}>📧 Received</Text>
                </Flex>
              </Card>
              
              <Card style={{ padding: '12px', backgroundColor: '#1f2937' }}>
                <Flex direction="col" gap="sm">
                  <Text size="xs" style={{ color: '#9ca3af' }}>Contacts</Text>
                  <Text size="xl" weight="bold" style={{ color: '#f3f4f6' }}>
                    {stats.totalContacts}
                  </Text>
                  <Text size="xs" style={{ color: '#8b5cf6' }}>👤 Created</Text>
                </Flex>
              </Card>
              
              <Card style={{ padding: '12px', backgroundColor: '#1f2937' }}>
                <Flex direction="col" gap="sm">
                  <Text size="xs" style={{ color: '#9ca3af' }}>Compression</Text>
                  <Text size="xl" weight="bold" style={{ color: '#f3f4f6' }}>
                    {(stats.compressionRatio * 100).toFixed(0)}%
                  </Text>
                  <Text size="xs" style={{ color: '#f59e0b' }}>📊 Average</Text>
                </Flex>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Mail Queue Tab */}
        <TabsContent value="mail">
          <div style={{ padding: '16px', backgroundColor: '#111827', borderRadius: '6px', minHeight: '200px' }}>
            <Flex direction="col" gap="md">
              {/* Queue Status */}
              <Card style={{ padding: '16px', backgroundColor: '#1f2937', borderLeft: '4px solid #3b82f6' }}>
                <Flex direction="row" justify="between" align="center">
                  <Flex direction="col" gap="sm">
                    <Text size="lg" weight="bold" style={{ color: '#f3f4f6' }}>
                      Mail Queue
                    </Text>
                    <Text size="sm" style={{ color: '#9ca3af' }}>
                      {stats.mailQueue > 0 ? `${stats.mailQueue} emails pending` : 'Queue empty'}
                    </Text>
                  </Flex>
                  <Flex direction="col" align="end" gap="sm">
                    <Text size="2xl" weight="bold" style={{ color: stats.mailQueue > 0 ? '#f59e0b' : '#10b981' }}>
                      {stats.mailQueue}
                    </Text>
                    {stats.lastProcessed && (
                      <Text size="xs" style={{ color: '#6b7280' }}>
                        Last: {formatTime(stats.lastProcessed)}
                      </Text>
                    )}
                  </Flex>
                </Flex>
              </Card>
              
              {/* Connection Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Card style={{ padding: '12px', backgroundColor: '#1f2937' }}>
                  <Flex direction="col" gap="sm">
                    <Flex direction="row" justify="between" align="center">
                      <Text size="sm" style={{ color: '#e5e7eb' }}>IMAP</Text>
                      <Badge variant="outline" size="sm">Connected</Badge>
                    </Flex>
                    <Text size="xs" style={{ color: '#9ca3af' }}>mail.qwanyx.com</Text>
                    <Text size="xs" style={{ color: '#6b7280' }}>phil@qwanyx.com</Text>
                  </Flex>
                </Card>
                
                <Card style={{ padding: '12px', backgroundColor: '#1f2937' }}>
                  <Flex direction="col" gap="sm">
                    <Flex direction="row" justify="between" align="center">
                      <Text size="sm" style={{ color: '#e5e7eb' }}>SMTP</Text>
                      <Badge variant="outline" size="sm">Ready</Badge>
                    </Flex>
                    <Text size="xs" style={{ color: '#9ca3af' }}>AWS SES</Text>
                    <Text size="xs" style={{ color: '#6b7280' }}>us-east-1</Text>
                  </Flex>
                </Card>
              </div>
              
              {/* Processing Info */}
              <Card style={{ padding: '12px', backgroundColor: '#1f2937' }}>
                <Flex direction="col" gap="sm">
                  <Text size="sm" weight="bold" style={{ color: '#e5e7eb' }}>Processing Configuration</Text>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <Text size="xs" style={{ color: '#9ca3af' }}>• Batch size: 10 emails</Text>
                    <Text size="xs" style={{ color: '#9ca3af' }}>• Check interval: 60s</Text>
                    <Text size="xs" style={{ color: '#9ca3af' }}>• Auto-compress: Yes</Text>
                    <Text size="xs" style={{ color: '#9ca3af' }}>• Create contacts: Yes</Text>
                  </div>
                </Flex>
              </Card>
              
              {/* Action Buttons */}
              <Flex direction="row" gap="sm">
                <Button
                  size="sm"
                  variant={mailServiceStatus === 'running' ? 'outline' : 'primary'}
                  onClick={(e) => {
                    stopPropagation(e)
                    toggleMailService()
                  }}
                  style={{ flex: 1 }}
                >
                  {mailServiceStatus === 'running' ? 'Stop Mail Service' : 'Start Mail Service'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    stopPropagation(e)
                    wsRef.current?.send(JSON.stringify({ 
                      type: 'command',
                      action: 'checkMail'
                    }))
                    addEvent({
                      type: 'mail',
                      category: 'Manual',
                      message: 'Checking for new emails...'
                    })
                  }}
                  disabled={mailServiceStatus !== 'running'}
                >
                  Check Now
                </Button>
              </Flex>
            </Flex>
          </div>
        </TabsContent>

        {/* Memory Graph Tab */}
        <TabsContent value="memory">
          <div style={{ padding: '16px', backgroundColor: '#111827', borderRadius: '6px', minHeight: '200px' }}>
            <Flex direction="col" gap="md" align="center" justify="center" style={{ height: '100%' }}>
              <Icon name="Biotech" size="lg" style={{ color: '#8b5cf6' }} />
              <Text size="sm" style={{ color: '#9ca3af', textAlign: 'center' }}>
                Memory graph visualization
              </Text>
              <Text size="xs" style={{ color: '#6b7280', textAlign: 'center' }}>
                {stats.totalMemories} nodes • {stats.totalContacts + stats.totalEmails} edges
              </Text>
            </Flex>
          </div>
        </TabsContent>
      </Tabs>
    </Bag>
  )
}