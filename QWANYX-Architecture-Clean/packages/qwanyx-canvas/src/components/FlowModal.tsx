import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, Button, Icon, Flex, Tooltip } from '@qwanyx/ui'
import { QwanyxFlowStandalone } from './QwanyxFlow'
import { Node, Edge } from 'reactflow'

export interface FlowModalProps {
  isOpen: boolean
  onClose: () => void
  nodeId: string
  nodeLabel: string
  initialNodes?: Node[]
  initialEdges?: Edge[]
  isMemory?: boolean  // Is this a separated memory flow or internal?
  onToggleMemory?: () => void
  onSave?: (nodes: Node[], edges: Edge[]) => void
}

export const FlowModal: React.FC<FlowModalProps> = ({
  isOpen,
  onClose,
  nodeId,
  nodeLabel,
  initialNodes = [],
  initialEdges = [],
  isMemory = false,
  onToggleMemory,
  onSave
}) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleSave = () => {
    if (onSave) {
      onSave(nodes, edges)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={isFullscreen ? 'full' : 'xl'}
      showCloseButton={false}
    >
      <ModalHeader style={{ padding: '12px 16px' }}>
        <Flex align="center" justify="between" style={{ width: '100%' }}>
          <Flex align="center" gap="sm">
            <Icon name="AccountTree" size="sm" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>
              {nodeLabel}
            </h3>
          </Flex>
          
          <Flex align="center" gap="sm">
            {/* Save as memory button */}
            <Tooltip content={isMemory ? "Already saved as memory" : "Save as memory engram"}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                style={{ 
                  padding: '8px',
                  color: isMemory ? 'var(--qwanyx-primary)' : 'var(--qwanyx-text-secondary)'
                }}
              >
                <Icon name="Memory" size="md" />
              </Button>
            </Tooltip>

            {/* Fullscreen toggle */}
            <Tooltip content={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                style={{ padding: '8px' }}
              >
                <Icon 
                  name={isFullscreen ? "FullscreenExit" : "Fullscreen"} 
                  size="md"
                />
              </Button>
            </Tooltip>

            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              style={{ padding: '8px' }}
            >
              <Icon name="Close" size="md" />
            </Button>
          </Flex>
        </Flex>
      </ModalHeader>
      
      <ModalBody style={{ 
        height: isFullscreen ? 'calc(100vh - 60px)' : '600px',
        padding: 0,
        overflow: 'hidden'
      }}>
        <QwanyxFlowStandalone
          initialNodes={nodes}
          initialEdges={edges}
          onNodesChange={setNodes}
          onEdgesChange={setEdges}
          height="100%"
          showToolbar={false}
          showControls={false}
          readOnly={true}
        />
      </ModalBody>
    </Modal>
  )
}