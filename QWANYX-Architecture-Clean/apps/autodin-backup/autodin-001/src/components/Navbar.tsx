'use client'

import { 
  SimpleNavbar,
  Button,
  Container,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu 
} from '@qwanyx/ui'
import { useState } from 'react'

interface NavbarProps {
  isLoggedIn?: boolean
  currentUser?: any
  onLoginClick: () => void
  onRegisterClick: () => void
  onLogout?: () => void
  onDashboardClick?: () => void
  currentPage?: string
}

export default function AutodinNavbar({ 
  isLoggedIn = false, 
  currentUser, 
  onLoginClick, 
  onRegisterClick, 
  onLogout, 
  onDashboardClick,
  currentPage 
}: NavbarProps) {
  
  const navItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Rechercher', href: '/search' },
    { label: 'Vendre', href: '/sell' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ]

  if (isLoggedIn) {
    navItems.push({ label: 'Dashboard', href: '/dashboard' })
  }

  return (
    <SimpleNavbar
      brand="Autodin"
      items={navItems}
      onAuthClick={isLoggedIn ? onLogout : onLoginClick}
      isAuthenticated={isLoggedIn}
      authButtonText={isLoggedIn ? 'Déconnexion' : 'Connexion'}
    />
  )
}