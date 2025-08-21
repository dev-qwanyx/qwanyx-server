'use client'

import React from 'react'
import { DigitalHumanEditor } from '@qwanyx/thot'
import { useSearchParams } from 'next/navigation'

export default function DigitalHumanEditorPage() {
  const searchParams = useSearchParams()
  const dhId = searchParams.get('id')
  const dhName = searchParams.get('name')
  const dhEmail = searchParams.get('email')

  return (
    <DigitalHumanEditor 
      dhId={dhId || undefined}
      dhName={dhName || undefined}
      dhEmail={dhEmail || undefined}
    />
  )
}