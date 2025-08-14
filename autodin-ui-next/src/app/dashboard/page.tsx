'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

// Lazy load the dashboard component
const DashboardAutodin = dynamic(
  () => import('@/components/DashboardAutodin'),
  { 
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Chargement du tableau de bord...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-autodin-primary mx-auto"></div>
        </div>
      </div>
    ),
    ssr: false
  }
)

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('autodin_token')
    const userData = localStorage.getItem('autodin_user')
    
    if (!token || !userData) {
      // Redirect to home if not authenticated
      router.push('/')
      return
    }
    
    setUser(JSON.parse(userData))
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-autodin-primary"></div>
      </div>
    )
  }

  return (
    <DashboardAutodin 
      currentUser={user}
      onBack={() => router.push('/')}
      onNavigate={(page) => {
        if (page === 'demandes') {
          router.push('/demandes')
        }
      }}
    />
  )
}