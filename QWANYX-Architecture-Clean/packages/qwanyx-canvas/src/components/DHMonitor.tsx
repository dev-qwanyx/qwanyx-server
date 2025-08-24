import React, { useState, useEffect, useRef } from 'react'
import { Icon } from '@qwanyx/ui'

interface MonitorEvent {
  id: string
  timestamp: Date
  type: 'mail' | 'memory' | 'thought' | 'connection' | 'compression' | 'error' | 'success'
  category: string
  message: string
  details?: any
  icon?: string
}

interface DHMonitorProps {
  brainId: string
  onClose?: () => void
  style?: React.CSSProperties
}

export const DHMonitor: React.FC<DHMonitorProps> = ({ brainId, onClose, style }) => {
  const [events, setEvents] = useState<MonitorEvent[]>([])
  const [stats, setStats] = useState({
    totalMemories: 0,
    totalEmails: 0,
    totalContacts: 0,
    compressionRatio: 0,
    thoughtsPerSecond: 0,
    activeConnections: 0
  })
  const [mailServiceStatus, setMailServiceStatus] = useState<'stopped' | 'starting' | 'running' | 'stopping'>('stopped')
  const [autoScroll, setAutoScroll] = useState(true)
  const eventsEndRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  // Connect to WebSocket for real-time updates
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3004`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('📡 Monitor connected to brain')
      ws.send(JSON.stringify({ 
        type: 'subscribe', 
        brainId,
        channels: ['mail', 'memory', 'thought', 'compression']
      }))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      handleBrainEvent(data)
    }

    ws.onerror = (error) => {
      console.error('Monitor WebSocket error:', error)
    }

    return () => {
      ws.close()
    }
  }, [brainId])

  // Auto-scroll to bottom when new events arrive
  useEffect(() => {
    if (autoScroll && eventsEndRef.current) {
      eventsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [events, autoScroll])

  const handleBrainEvent = (data: any) => {
    // Process different event types
    if (data.type === 'mail:status') {
      addEvent({
        type: 'mail',
        category: 'Mail Service',
        message: data.message,
        details: data,
        icon: '📧'
      })
    } else if (data.type === 'mail:received') {
      addEvent({
        type: 'mail',
        category: 'Email Received',
        message: `New email from ${data.from}: "${data.subject}"`,
        details: data,
        icon: '📨'
      })
      setStats(prev => ({ ...prev, totalEmails: prev.totalEmails + 1 }))
    } else if (data.type === 'contact:created') {
      addEvent({
        type: 'success',
        category: 'Contact Created',
        message: `New contact: ${data.email}`,
        details: data,
        icon: '👤'
      })
      setStats(prev => ({ ...prev, totalContacts: prev.totalContacts + 1 }))
    } else if (data.type === 'memory:formed') {
      addEvent({
        type: 'memory',
        category: 'Memory Formation',
        message: `${data.memoryType} memory compressed (${(data.compressionRatio * 100).toFixed(1)}%)`,
        details: data,
        icon: '🧠'
      })
      setStats(prev => ({ ...prev, totalMemories: prev.totalMemories + 1 }))
    } else if (data.type === 'compression:cascade') {
      addEvent({
        type: 'compression',
        category: 'Compression Cascade',
        message: `Recompressed ${data.count} memories to level ${data.level}`,
        details: data,
        icon: '🌊'
      })
    } else if (data.type === 'thought') {
      // Update thoughts per second
      setStats(prev => ({ ...prev, thoughtsPerSecond: data.rate || 0 }))
    }
  }

  const addEvent = (eventData: Omit<MonitorEvent, 'id' | 'timestamp'>) => {
    const newEvent: MonitorEvent = {
      ...eventData,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date()
    }
    setEvents(prev => [...prev.slice(-100), newEvent])  // Keep last 100 events
  }

  const toggleMailService = async () => {
    if (mailServiceStatus === 'stopped') {
      setMailServiceStatus('starting')
      // Send command to start mail service
      wsRef.current?.send(JSON.stringify({ 
        type: 'command',
        action: 'startMailService',
        brainId 
      }))
      
      // Simulate startup
      setTimeout(() => {
        setMailServiceStatus('running')
        addEvent({
          type: 'success',
          category: 'Mail Service',
          message: 'Mail service started successfully',
          icon: '✅'
        })
      }, 2000)
    } else if (mailServiceStatus === 'running') {
      setMailServiceStatus('stopping')
      // Send command to stop mail service
      wsRef.current?.send(JSON.stringify({ 
        type: 'command',
        action: 'stopMailService',
        brainId 
      }))
      
      setTimeout(() => {
        setMailServiceStatus('stopped')
        addEvent({
          type: 'error',
          category: 'Mail Service',
          message: 'Mail service stopped',
          icon: '⏹️'
        })
      }, 1000)
    }
  }

  const getEventIcon = (event: MonitorEvent) => {
    if (event.icon) return <span style={{ fontSize: '20px' }}>{event.icon}</span>
    
    const iconMap: Record<string, string> = {
      'mail': 'Mail',
      'memory': 'Biotech',
      'thought': 'ElectricBolt',
      'connection': 'Link',
      'compression': 'Storage',
      'error': 'Error',
      'success': 'CheckCircle'
    }
    
    const iconName = iconMap[event.type] || 'Activity'
    const iconColor = event.type === 'error' ? '#ef4444' : 
                     event.type === 'success' ? '#10b981' : undefined
    
    return <Icon name={iconName} size="sm" style={iconColor ? { color: iconColor } : undefined} />
  }

  const getEventColor = (type: MonitorEvent['type']) => {
    switch (type) {
      case 'mail': return '#3b82f6'
      case 'memory': return '#8b5cf6'
      case 'thought': return '#f59e0b'
      case 'connection': return '#06b6d4'
      case 'compression': return '#6366f1'
      case 'error': return '#ef4444'
      case 'success': return '#10b981'
      default: return '#6b7280'
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      // fractionalSecondDigits: 3  // Not supported in all environments
    })
  }

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '800px',
      height: '600px',
      backgroundColor: '#0a0a0a',
      border: '2px solid #1f2937',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      fontFamily: 'monospace',
      zIndex: 10000,
      ...style
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #1f2937',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(to right, #111827, #1f2937)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Icon name="Biotech" size="lg" style={{ color: '#8b5cf6' }} />
          <h2 style={{ margin: 0, color: '#f3f4f6', fontSize: '18px' }}>
            Digital Human Monitor
          </h2>
          <span style={{ color: '#6b7280', fontSize: '12px' }}>
            Brain ID: {brainId.substring(0, 8)}...
          </span>
        </div>
        
        {/* Mail Service Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="Mail" size="md" style={{ color: '#3b82f6' }} />
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>Mail Service</span>
            <button
              onClick={toggleMailService}
              disabled={mailServiceStatus === 'starting' || mailServiceStatus === 'stopping'}
              style={{
                width: '60px',
                height: '28px',
                borderRadius: '14px',
                border: 'none',
                cursor: mailServiceStatus === 'starting' || mailServiceStatus === 'stopping' ? 'not-allowed' : 'pointer',
                backgroundColor: mailServiceStatus === 'running' ? '#10b981' : '#374151',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '12px',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: mailServiceStatus === 'running' ? 'translateX(32px)' : 'translateX(0)',
                transition: 'transform 0.3s ease'
              }}>
                <Icon 
                  name="Power" 
                  size="sm" 
                  style={{ color: mailServiceStatus === 'running' ? '#10b981' : '#6b7280' }} 
                />
              </div>
            </button>
            <span style={{ 
              color: mailServiceStatus === 'running' ? '#10b981' : '#6b7280',
              fontSize: '12px',
              minWidth: '60px'
            }}>
              {mailServiceStatus}
            </span>
          </div>
          
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid #1f2937',
        display: 'flex',
        gap: '24px',
        backgroundColor: '#111827'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="Biotech" size="sm" style={{ color: '#8b5cf6' }} />
          <span style={{ color: '#9ca3af', fontSize: '12px' }}>Memories:</span>
          <span style={{ color: '#f3f4f6', fontSize: '14px', fontWeight: 'bold' }}>
            {stats.totalMemories}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="Mail" size="sm" style={{ color: '#3b82f6' }} />
          <span style={{ color: '#9ca3af', fontSize: '12px' }}>Emails:</span>
          <span style={{ color: '#f3f4f6', fontSize: '14px', fontWeight: 'bold' }}>
            {stats.totalEmails}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="Activity" size="sm" style={{ color: '#06b6d4' }} />
          <span style={{ color: '#9ca3af', fontSize: '12px' }}>Contacts:</span>
          <span style={{ color: '#f3f4f6', fontSize: '14px', fontWeight: 'bold' }}>
            {stats.totalContacts}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="Storage" size="sm" style={{ color: '#6366f1' }} />
          <span style={{ color: '#9ca3af', fontSize: '12px' }}>Compression:</span>
          <span style={{ color: '#f3f4f6', fontSize: '14px', fontWeight: 'bold' }}>
            {(stats.compressionRatio * 100).toFixed(1)}%
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon name="ElectricBolt" size="sm" style={{ color: '#f59e0b' }} />
          <span style={{ color: '#9ca3af', fontSize: '12px' }}>Thoughts/s:</span>
          <span style={{ color: '#f3f4f6', fontSize: '14px', fontWeight: 'bold' }}>
            {stats.thoughtsPerSecond}
          </span>
        </div>
      </div>

      {/* Events Log */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        backgroundColor: '#030712'
      }}>
        {events.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#4b5563'
          }}>
            <Icon name="Activity" size="lg" style={{ color: '#4b5563' }} />
            <p style={{ marginTop: '16px' }}>Waiting for brain activity...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {events.map(event => (
              <div
                key={event.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '8px 12px',
                  backgroundColor: '#0a0a0a',
                  borderLeft: `3px solid ${getEventColor(event.type)}`,
                  borderRadius: '4px',
                  fontSize: '13px',
                  animation: 'slideIn 0.3s ease'
                }}
              >
                <span style={{ color: '#4b5563', fontSize: '11px', minWidth: '80px' }}>
                  {formatTime(event.timestamp)}
                </span>
                {getEventIcon(event)}
                <div style={{ flex: 1 }}>
                  <span style={{ color: getEventColor(event.type), fontWeight: 'bold' }}>
                    {event.category}
                  </span>
                  <span style={{ color: '#d1d5db', marginLeft: '8px' }}>
                    {event.message}
                  </span>
                  {event.details && (
                    <div style={{ 
                      marginTop: '4px', 
                      color: '#6b7280', 
                      fontSize: '11px',
                      fontFamily: 'monospace'
                    }}>
                      {typeof event.details === 'object' ? 
                        JSON.stringify(event.details, null, 2).substring(0, 100) + '...' :
                        event.details
                      }
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={eventsEndRef} />
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid #1f2937',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#111827'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', fontSize: '13px' }}>
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
            />
            Auto-scroll
          </label>
          <button
            onClick={() => setEvents([])}
            style={{
              padding: '4px 12px',
              backgroundColor: '#374151',
              border: 'none',
              borderRadius: '4px',
              color: '#9ca3af',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Clear Log
          </button>
        </div>
        <div style={{ color: '#6b7280', fontSize: '12px' }}>
          {events.length} events
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}