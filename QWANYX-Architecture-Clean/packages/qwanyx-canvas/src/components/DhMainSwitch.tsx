import React, { useState, useEffect } from 'react'
import { Switch, UserProfile } from '@qwanyx/ui'
import { DhApi } from '../api/mock-dh-api'

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
  const [uptime, setUptime] = useState<number>(0) // Uptime in seconds
  
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
  
  // Function to check if DH process is currently running
  const checkDHStatus = async () => {
    if (!dhId) {
      setIsCheckingStatus(false)
      return
    }
    
    console.log(`Checking process status for DH ${dhId}...`)
    setIsCheckingStatus(true)
    
    try {
      // Call API to check if DH process is actually running
      const response = await fetch(`http://localhost:5002/api/dh/${dhId}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('autodin_token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log(`DH ${dhId} process status:`, data)
        
        // Update running state based on the actual process status
        const isProcessRunning = data.status?.running === true
        setIsRunning(isProcessRunning)
        console.log(`DH ${dhId} process is ${isProcessRunning ? 'RUNNING' : 'STOPPED'}`)
        
        // Store actual uptime if available
        if (isProcessRunning && data.status?.uptime) {
          setUptime(Math.round(data.status.uptime))
          console.log(`DH has been running for ${Math.round(data.status.uptime)} seconds`)
        } else {
          setUptime(0)
        }
      } else if (response.status === 404) {
        console.log(`DH ${dhId} not found`)
        setIsRunning(false)
      } else {
        console.error('Failed to get DH process status:', response.status)
        setIsRunning(false)
      }
    } catch (error) {
      console.error('Error checking DH process status:', error)
      // Assume not running if we can't check
      setIsRunning(false)
    } finally {
      setIsCheckingStatus(false)
    }
  }
  
  
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
  
  // Format uptime for display
  const formatUptime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
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
      border: showProfile ? '1px solid #e5e7eb' : 'none',
      minWidth: showProfile ? '180px' : 'auto',
      position: 'relative',
      transition: 'border-color 0.3s ease'
    }}>
      
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
      
      {/* Real uptime display */}
      {isRunning && uptime > 0 && (
        <div style={{
          fontSize: '10px',
          color: '#9ca3af',
          textAlign: 'center',
          marginTop: '4px'
        }}>
          Running for {formatUptime(uptime)}
        </div>
      )}
      
      {/* CSS Animation for green pulse */}
      <style>{`
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