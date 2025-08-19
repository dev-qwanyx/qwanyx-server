'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TestDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Créer un utilisateur de test dans le localStorage
    const testUser = {
      id: '1',
      email: 'test@autodin.be',
      firstName: 'Jean',
      lastName: 'Dupont',
      role: 'Vendeur Pro',
      avatar: null
    }
    
    // Stocker l'utilisateur et le token de test
    localStorage.setItem('autodin_user', JSON.stringify(testUser))
    localStorage.setItem('autodin_token', 'test-token-123456')
    // Token valide pour 24h
    localStorage.setItem('autodin_token_expiry', String(Date.now() + 24 * 60 * 60 * 1000))
    
    // Rediriger vers le dashboard
    router.push('/dashboard')
  }, [router])

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #E67E22, #D35400)'
    }}>
      <div style={{ textAlign: 'center', color: 'white' }}>
        <h2>Configuration de l'utilisateur de test...</h2>
        <p>Redirection vers le dashboard...</p>
      </div>
    </div>
  )
}