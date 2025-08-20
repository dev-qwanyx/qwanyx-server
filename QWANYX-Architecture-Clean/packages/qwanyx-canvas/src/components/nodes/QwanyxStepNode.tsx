import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, Flex, Icon, Text } from '@qwanyx/ui';

export const QwanyxStepNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <>
      <Handle 
        type="target" 
        position={Position.Top}
        style={{
          background: '#E67E22',
          width: 8,
          height: 8,
        }}
      />
      
      <Card
        style={{
          minWidth: '180px',
          padding: '12px 16px',
          border: selected ? '2px solid #E67E22' : '1px solid #e5e7eb',
          boxShadow: selected ? '0 0 0 1px #E67E22' : 'none',
          cursor: 'move',
        }}
      >
        <Flex align="center" gap="sm">
          <Icon name="PlayArrow" size="sm" style={{ color: '#E67E22' }} />
          <Text size="sm" weight="medium">
            {data.label || 'Étape'}
          </Text>
        </Flex>
        
        {data.description && (
          <Text size="xs" style={{ 
            marginTop: '4px', 
            color: 'var(--qwanyx-text-secondary)',
            marginLeft: '24px'
          }}>
            {data.description}
          </Text>
        )}
      </Card>
      
      <Handle 
        type="source" 
        position={Position.Bottom}
        style={{
          background: '#E67E22',
          width: 8,
          height: 8,
        }}
      />
    </>
  );
};