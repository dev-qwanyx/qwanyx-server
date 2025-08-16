import React from 'react'
import { Search, Home, Star, Heart, Settings, Menu, X, ChevronDown } from 'lucide-react'

export const SimpleIconTest: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Direct Lucide Icon Test</h2>
      <p>If you can see icons below, Lucide is working:</p>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '24px', marginTop: '1rem' }}>
        <Search size={24} />
        <Home size={24} />
        <Star size={24} />
        <Heart size={24} />
        <Settings size={24} />
        <Menu size={24} />
        <X size={24} />
        <ChevronDown size={24} />
      </div>
      
      <h3 style={{ marginTop: '2rem' }}>Using our Icon component:</h3>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div>
          <Search size={24} />
          <p style={{ fontSize: '12px' }}>Direct</p>
        </div>
        <div>
          {/* This would use our Icon component if imported */}
          <p style={{ fontSize: '12px' }}>Via Icon component</p>
        </div>
      </div>
    </div>
  )
}