'use client'

import { Button } from '@/components/ui/Button'

export default function DataTable() {
  const data = [
    { id: 1, reference: 'REF-001', client: 'Jean Dupont', montant: '234€', status: 'En cours' },
    { id: 2, reference: 'REF-002', client: 'Marie Martin', montant: '567€', status: 'Livré' },
    { id: 3, reference: 'REF-003', client: 'Pierre Bernard', montant: '123€', status: 'En attente' },
    { id: 4, reference: 'REF-004', client: 'Sophie Leroy', montant: '890€', status: 'En cours' },
    { id: 5, reference: 'REF-005', client: 'Lucas Moreau', montant: '456€', status: 'Livré' },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium text-gray-700">Référence</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Client</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Montant</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{row.reference}</td>
              <td className="py-3 px-4">{row.client}</td>
              <td className="py-3 px-4 font-semibold">{row.montant}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  row.status === 'Livré' ? 'bg-green-100 text-green-800' :
                  row.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {row.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <Button size="sm" variant="ghost" color="primary">
                  Voir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}