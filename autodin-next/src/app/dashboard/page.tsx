'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Lazy load heavy dashboard components
const DashboardContent = dynamic(
  () => import('@/components/autodin/DashboardContent'),
  { 
    loading: () => <DashboardSkeleton />,
    ssr: false // Client-side only for dashboard
  }
)

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="mt-8 h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}