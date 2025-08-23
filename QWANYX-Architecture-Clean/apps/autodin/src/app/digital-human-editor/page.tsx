'use client'

import React, { useState } from 'react'
import { DigitalHumanEditor } from '@qwanyx/thot'
import { useSearchParams } from 'next/navigation'

export default function DigitalHumanEditorPage() {
  const searchParams = useSearchParams()
  
  // Initialize state directly from sessionStorage to avoid double render
  const [dhData] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const storedDhData = sessionStorage.getItem('editing_dh')
      console.log('Stored DH data:', storedDhData)
      if (storedDhData) {
        const parsed = JSON.parse(storedDhData)
        console.log('Parsed DH data:', parsed)
        return parsed
      }
    }
    return null
  })
  
  // URL params as fallback
  const dhId = searchParams.get('id') || dhData?.id || dhData?._id
  const dhName = searchParams.get('name') || dhData?.name || dhData?.lastName
  const dhFirstName = searchParams.get('firstName') || dhData?.firstName
  const dhEmail = searchParams.get('email') || dhData?.email
  
  console.log('DH Editor props:', { dhId, dhName, dhFirstName, dhEmail })
  console.log('DH Data from sessionStorage:', dhData)

  return (
    <DigitalHumanEditor 
      dhId={dhId || undefined}
      dhName={dhName || undefined}
      dhFirstName={dhFirstName || undefined}
      dhEmail={dhEmail || undefined}
    />
  )
}