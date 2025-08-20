import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, Text, Icon } from '@qwanyx/ui';

export const QwanyxDecisionNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <>
      <Handle 
        type="target" 
        position={Position.Top}
        style={{
          background: '#9b59b6',
          width: 8,
          height: 8,
        }}
      />
      
      <div
        style={{
          transform: 'rotate(45deg)',
          width: '100px',
          height: '100px',
        }}
      >
        <Card
          style={{
            width: '100%',
            height: '100%',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            border: selected ? '2px solid #9b59b6' : '1px solid #e5e7eb',
            boxShadow: selected ? '0 0 0 1px #9b59b6' : 'none',
            cursor: 'move',
          }}
        >
          <div style={{ transform: 'rotate(-45deg)' }}>
            <Icon name="Help" size="sm" style={{ color: '#9b59b6', marginBottom: '4px' }} />
            <Text size="xs" weight="medium" style={{ textAlign: 'center' }}>
              {data.label || 'Décision'}
            </Text>
          </div>
        </Card>
      </div>
      
      {/* Yes branch - right */}
      <Handle 
        type="source" 
        position={Position.Right}
        id="yes"
        style={{
          background: '#27ae60',
          width: 8,
          height: 8,
          top: '50%',
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '12px',
          fontSize: '10px',
          color: '#27ae60',
          fontWeight: 'bold',
        }}>
          OUI
        </div>
      </Handle>
      
      {/* No branch - bottom */}
      <Handle 
        type="source" 
        position={Position.Bottom}
        id="no"
        style={{
          background: '#e74c3c',
          width: 8,
          height: 8,
        }}
      >
        <div style={{
          position: 'absolute',
          bottom: '-20px',
          left: '-10px',
          fontSize: '10px',
          color: '#e74c3c',
          fontWeight: 'bold',
        }}>
          NON
        </div>
      </Handle>
    </>
  );
};