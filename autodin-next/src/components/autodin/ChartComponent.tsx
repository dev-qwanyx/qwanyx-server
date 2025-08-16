'use client'

export default function ChartComponent({ type }: { type: string }) {
  // This would normally use a charting library like recharts or chart.js
  // For now, just a placeholder
  return (
    <div className="h-64 bg-gradient-to-br from-autodin-primary/10 to-autodin-accent/10 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">
        {type === 'sales' ? 'Graphique des ventes' : 'Graphique des catégories'}
      </p>
    </div>
  )
}