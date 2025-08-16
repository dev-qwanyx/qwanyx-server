import React from 'react'
import { Search, Palette, HelpCircle, ChevronDown } from 'lucide-react'

export const TestIcon: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h3>Direct Lucide Icons Test:</h3>
      <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
        <Search size={24} />
        <Palette size={24} />
        <HelpCircle size={24} />
        <ChevronDown size={24} />
      </div>
    </div>
  )
}