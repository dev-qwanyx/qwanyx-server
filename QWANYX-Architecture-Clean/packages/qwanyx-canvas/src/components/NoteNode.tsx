import React, { useState, useEffect } from 'react'
import { Input, Field, Flex, Text, Icon, Tabs, TabsList, TabsTrigger, TabsContent } from '@qwanyx/ui'
import { Bag } from './Bag'

interface NoteNodeProps {
  nodeId: string
  initialData?: {
    title?: string
    brief?: string  // This is the actual note content
    color?: string
    icon?: string
    isLocked?: boolean
  }
  onChange?: (data: any) => void
  onClose?: () => void
}

// Available colors for nodes (actual colors for the icon)
const nodeColors = [
  { name: 'Yellow', value: 'warning', hex: '#fbbf24' },
  { name: 'Blue', value: 'primary', hex: '#667eea' },
  { name: 'Green', value: 'success', hex: '#84fab0' },
  { name: 'Red', value: 'error', hex: '#f5576c' },
  { name: 'Purple', value: 'secondary', hex: '#764ba2' },
  { name: 'Grey', value: 'default', hex: '#6b7280' }
]

// Available icons
const nodeIcons = [
  'Edit',
  'Description',
  'StickyNote2',
  'Assignment',
  'Book',
  'Info'
]

export const NoteNode: React.FC<NoteNodeProps> = ({
  nodeId,
  initialData,
  onChange,
  onClose
}) => {
  const [title, setTitle] = useState(initialData?.title || 'Note')
  const [brief, setBrief] = useState(initialData?.brief || '')  // This is the note content
  const [selectedColor, setSelectedColor] = useState(initialData?.color || 'warning')
  const [selectedIcon, setSelectedIcon] = useState(initialData?.icon || 'Edit')
  const [isLocked, setIsLocked] = useState(initialData?.isLocked || false)
  const [showStyle, setShowStyle] = useState(false)

  // Auto-save when data changes
  useEffect(() => {
    if (onChange) {
      onChange({
        title,
        brief,  // The note content
        label: title + (brief ? '*' : ''),  // Add asterisk to label if there's content
        color: selectedColor,
        icon: selectedIcon,
        isLocked
      })
    }
  }, [title, brief, selectedColor, selectedIcon, isLocked])

  // Stop propagation for interactive elements to prevent node dragging
  const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
  }

  return (
    <Bag color="#d1d5db" opacity={0.9} blur={false} padding="sm">
      {/* Header with icons */}
      <Flex direction="row" justify="end" align="center" style={{ marginBottom: '8px' }}>
        <Flex direction="row" gap="sm" align="center">
          {/* Style toggle icon */}
          <div
            onClick={(e) => {
              e.stopPropagation()
              setShowStyle(!showStyle)
            }}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280'
            }}
            title="Toggle style options"
          >
            <Icon name="Autorenew" size="sm" />
          </div>
          
          {/* Lock icon */}
          <div
            onClick={(e) => {
              e.stopPropagation()
              setIsLocked(!isLocked)
            }}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280'
            }}
            title={isLocked ? "Unlock editing" : "Lock editing"}
          >
            <Icon name={isLocked ? "Lock" : "LockOpen"} size="sm" />
          </div>
        </Flex>
      </Flex>

      {!showStyle ? (
        // Note content
        <Flex direction="col" gap="sm" style={{ width: '100%' }}>
          {!isLocked ? (
            <>
              <Field name="title" label="Title">
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onMouseDown={stopPropagation}
                  placeholder="Note title..."
                  inputSize="sm"
                  style={{ width: '100%' }}
                />
              </Field>

              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                onMouseDown={stopPropagation}
                placeholder="Write your note here..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(55, 65, 81, 0.3)',
                  backgroundColor: 'white',
                  color: '#1f2937',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </>
          ) : (
            // Locked view - display only the note content
            <div style={{ 
              padding: '8px',
              minHeight: '120px',
              whiteSpace: 'pre-wrap',
              color: '#4b5563',
              fontSize: '14px'
            }}>
              {brief || 'No content'}
            </div>
          )}
        </Flex>
      ) : (
        // Style options
        <Flex direction="col" gap="sm" style={{ width: '100%' }}>
          <Field name="color" label="Color">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
              {nodeColors.map(color => (
                <div
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: color.hex,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: selectedColor === color.value ? '3px solid #1f2937' : '1px solid rgba(0,0,0,0.2)',
                    boxShadow: selectedColor === color.value ? '0 0 0 2px white, 0 0 0 3px #1f2937' : 'none'
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </Field>
          
          <Field name="icon" label="Icon">
            <Flex direction="row" gap="sm" style={{ width: '100%' }}>
              <Input
                type="text"
                value={selectedIcon}
                onChange={(e) => setSelectedIcon(e.target.value)}
                placeholder="Icon name"
                inputSize="sm"
                style={{ flex: 1 }}
              />
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedIcon(e.target.value)
                    e.target.value = '' // Reset dropdown after selection
                  }
                }}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  border: '1px solid rgba(55, 65, 81, 0.3)',
                  backgroundColor: 'white',
                  color: '#1f2937',
                  fontSize: '14px',
                  cursor: 'pointer',
                  minWidth: '100px'
                }}
              >
                <option value="">Choose...</option>
                {nodeIcons.map(icon => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </Flex>
          </Field>
        </Flex>
      )}
    </Bag>
  )
}