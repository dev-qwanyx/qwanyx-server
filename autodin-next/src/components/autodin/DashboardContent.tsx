'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import dynamic from 'next/dynamic'

// Lazy load heavy components
const ChartComponent = dynamic(() => import('./ChartComponent'), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded" />,
  ssr: false
})

const DataTable = dynamic(() => import('./DataTable'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded" />,
  ssr: false
})

export default function DashboardContent() {
  const [stats, setStats] = useState({
    totalParts: 0,
    activeLists: 0,
    pendingOrders: 0,
    revenue: 0
  })

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalParts: 1234,
        activeLists: 56,
        pendingOrders: 12,
        revenue: 45678
      })
    }, 1000)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-autodin-secondary">Dashboard</h1>
            <Button color="primary">Nouvelle annonce</Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card padding="lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Pièces totales</h3>
            <p className="text-3xl font-bold text-autodin-primary">{stats.totalParts}</p>
            <p className="text-sm text-green-600 mt-2">+12% ce mois</p>
          </Card>
          
          <Card padding="lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Annonces actives</h3>
            <p className="text-3xl font-bold text-autodin-primary">{stats.activeLists}</p>
            <p className="text-sm text-green-600 mt-2">+5 cette semaine</p>
          </Card>
          
          <Card padding="lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Commandes en attente</h3>
            <p className="text-3xl font-bold text-autodin-accent">{stats.pendingOrders}</p>
            <p className="text-sm text-orange-600 mt-2">3 urgentes</p>
          </Card>
          
          <Card padding="lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Revenus (€)</h3>
            <p className="text-3xl font-bold text-green-600">{stats.revenue.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-2">+18% ce mois</p>
          </Card>
        </div>

        {/* Search Bar */}
        <Card padding="lg" className="mb-8">
          <div className="flex gap-4">
            <Input
              placeholder="Rechercher une pièce, référence, client..."
              fullWidth
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <Button color="primary">Rechercher</Button>
          </div>
        </Card>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card padding="lg">
            <h3 className="text-lg font-bold mb-4">Ventes mensuelles</h3>
            <ChartComponent type="sales" />
          </Card>
          
          <Card padding="lg">
            <h3 className="text-lg font-bold mb-4">Catégories populaires</h3>
            <ChartComponent type="categories" />
          </Card>
        </div>

        {/* Data Table */}
        <Card padding="lg">
          <h3 className="text-lg font-bold mb-4">Dernières commandes</h3>
          <DataTable />
        </Card>
      </div>
    </div>
  )
}