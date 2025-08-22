import React, { useState, useEffect } from 'react'
import { Switch, UserProfile } from '@qwanyx/ui'
import { DhApi } from '@qwanyx/api-client'

interface DhMainSwitchProps {
  dhId: string
  dhName?: string
  dhFirstName?: string
  dhEmail?: string
  initialState?: boolean
  onStateChange?: (isRunning: boolean) => void
  showProfile?: boolean
  size?: 'sm' | 'md' | 'lg'
}

// Create DH API instance
const dhApi = new DhApi()

export const DhMainSwitch: React.FC<DhMainSwitchProps> = ({
  dhId,
  dhName = '',
  dhFirstName = '',
  dhEmail = 'dh@qwanyx.com',
  initialState = false,
  onStateChange,
  showProfile = true,
  size = 'md'
}) => {
  const [isRunning, setIsRunning] = useState(initialState)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(true) // Loading state for initial check
  const [heartbeatCount, setHeartbeatCount] = useState(0)
  const [lastHeartbeat, setLastHeartbeat] = useState<Date | null>(null)
  const [isHeartbeating, setIsHeartbeating] = useState(false)
  
  // Get full DH data from sessionStorage if available
  const [dhFullData, setDhFullData] = useState<any>(null)
  
  useEffect(() => {
    // Try to get complete DH data from sessionStorage
    const storedDH = sessionStorage.getItem('editing_dh')
    if (storedDH) {
      try {
        const dhData = JSON.parse(storedDH)
        if (dhData._id === dhId) {
          setDhFullData(dhData)
          // Don't use stored active state, we'll check real status
        }
      } catch (e) {
        console.error('Error parsing stored DH data:', e)
      }
    }
    
    // Check real-time status of the DH when component mounts
    checkDHStatus()
  }, [dhId])
  
  // Function to check if DH is currently running
  const checkDHStatus = async () => {
    if (!dhId) {
      setIsCheckingStatus(false)
      return
    }
    
    console.log(`Checking status for DH ${dhId}...`)
    setIsCheckingStatus(true)
    
    try {
      // Call API to get all users and find our DH
      const response = await fetch(`http://localhost:5002/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('autodin_token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const users = await response.json()
        console.log(`Got ${users.length} users, looking for DH ${dhId}`)
        
        // Find our DH in the list
        const dhUser = users.find((u: any) => u._id === dhId || u.id === dhId)
        
        if (dhUser) {
          console.log(`Found DH ${dhId}:`, dhUser)
          
          // Update running state based on the 'active' field
          const isActive = dhUser.active === true
          setIsRunning(isActive)
          console.log(`DH ${dhId} is ${isActive ? 'ACTIVE' : 'INACTIVE'}`)
          
          // If running, start heartbeat counter
          if (isActive) {
            setHeartbeatCount(0)
          }
        } else {
          console.log(`DH ${dhId} not found in users list`)
          setIsRunning(false)
        }
      } else {
        console.error('Failed to get users:', response.status)
        setIsRunning(false)
      }
    } catch (error) {
      console.error('Error checking DH status:', error)
      // Assume not running if we can't check
      setIsRunning(false)
    } finally {
      setIsCheckingStatus(false)
    }
  }
  
  // Heartbeat simulation effect
  useEffect(() => {
    if (!isRunning) {
      setHeartbeatCount(0)
      setLastHeartbeat(null)
      return
    }
    
    // Simulate heartbeat every 2 seconds when running
    const heartbeatInterval = setInterval(() => {
      setHeartbeatCount(prev => prev + 1)
      setLastHeartbeat(new Date())
      
      // Trigger heartbeat animation
      setIsHeartbeating(true)
      setTimeout(() => setIsHeartbeating(false), 300)
    }, 2000)
    
    // Initial heartbeat
    setIsHeartbeating(true)
    setTimeout(() => setIsHeartbeating(false), 300)
    
    return () => clearInterval(heartbeatInterval)
  }, [isRunning])
  
  const handleToggle = async (checked: boolean) => {
    console.log(`DH ${dhId} switched:`, checked ? 'ON' : 'OFF')
    
    if (!dhId) {
      console.error('No DH ID provided')
      return
    }
    
    // Check for auth token
    const token = localStorage.getItem('autodin_token')
    if (!token) {
      console.error('No auth token found')
      alert('Please login to control Digital Humans')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Use the centralized API client to toggle DH state
      const result = await dhApi.toggle(dhId, checked)
      
      if (result.success) {
        console.log('DH toggle successful:', result.data)
        
        // Update local state
        setIsRunning(checked)
        
        // Call callback if provided
        if (onStateChange) {
          onStateChange(checked)
        }
      } else {
        console.error('Failed to toggle DH:', result.error)
        alert(`Failed to ${checked ? 'start' : 'stop'} Digital Human: ${result.error}`)
      }
      
    } catch (error) {
      console.error(`Error ${checked ? 'starting' : 'stopping'} DH:`, error)
      alert(`Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Build display name and avatar
  const displayName = dhFullData 
    ? `${dhFullData.firstName || ''} ${dhFullData.name || ''}`.trim()
    : `${dhFirstName} ${dhName}`.trim() || 'Digital Human'
    
  const displayEmail = dhFullData?.email || dhEmail
  
  const avatarUrl = dhFullData 
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${dhFullData.firstName || ''}${dhFullData.name || ''}`
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${dhFirstName}${dhName}`
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      padding: showProfile ? '16px' : '0',
      backgroundColor: showProfile ? 'white' : 'transparent',
      borderRadius: showProfile ? '12px' : '0',
      boxShadow: showProfile ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
      border: showProfile ? `2px solid ${isRunning ? '#10b981' : '#e5e7eb'}` : 'none',
      minWidth: showProfile ? '180px' : 'auto',
      position: 'relative',
      transition: 'border-color 0.3s ease'
    }}>
      {/* Heartbeat indicator */}
      {isRunning && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            animation: isHeartbeating ? 'heartbeat 0.3s ease' : 'none',
            boxShadow: isHeartbeating ? '0 0 8px rgba(239, 68, 68, 0.6)' : 'none'
          }} />
          <span style={{
            fontSize: '10px',
            color: '#6b7280',
            fontFamily: 'monospace'
          }}>
            {heartbeatCount > 0 ? `${heartbeatCount}` : ''}
          </span>
        </div>
      )}
      
      {/* UserProfile with avatar */}
      {showProfile && (
        <div style={{
          position: 'relative'
        }}>
          <UserProfile
            user={{
              name: displayName,
              email: displayEmail,
              avatar: avatarUrl
            }}
            size={size}
            showEmail={false}
          />
          {/* Status indicator on avatar */}
          {isRunning && (
            <div style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              border: '2px solid white',
              animation: 'pulse 2s infinite'
            }} />
          )}
        </div>
      )}
      
      {/* Switch with status text */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px'
      }}>
        <Switch 
          checked={isRunning}
          onChange={handleToggle}
          disabled={isLoading || isCheckingStatus}
          size={size}
        />
        <span style={{
          fontSize: '11px',
          color: isCheckingStatus ? '#f59e0b' : (isRunning ? '#10b981' : '#9ca3af'),
          fontWeight: 500
        }}>
          {isCheckingStatus ? 'Checking...' : (isRunning ? 'Active' : 'Inactive')}
        </span>
      </div>
      
      {/* Last heartbeat time */}
      {lastHeartbeat && isRunning && (
        <div style={{
          fontSize: '10px',
          color: '#9ca3af',
          textAlign: 'center'
        }}>
          Last beat: {lastHeartbeat.toLocaleTimeString()}
        </div>
      )}
      
      {/* CSS Animations */}
      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
      `}</style>
    </div>
  )
}