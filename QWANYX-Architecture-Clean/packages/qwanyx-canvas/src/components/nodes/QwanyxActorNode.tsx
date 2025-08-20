import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, UserProfile, Text, Badge } from '@qwanyx/ui';

export const QwanyxActorNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <>
      <Handle 
        type="target" 
        position={Position.Top}
        style={{
          background: '#3498db',
          width: 8,
          height: 8,
        }}
      />
      
      <Card
        style={{
          minWidth: '200px',
          padding: '12px 16px',
          backgroundColor: data.type === 'DH' ? '#fff3e0' : '#e3f2fd',
          border: selected ? '2px solid #3498db' : '1px solid #e5e7eb',
          boxShadow: selected ? '0 0 0 1px #3498db' : 'none',
          cursor: 'move',
        }}
      >
        <UserProfile
          user={{
            name: data.actor || 'Agent',
            email: data.email || `${(data.actor || 'agent').toLowerCase()}@autodin.com`,
            avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.actor || 'Agent'}`
          }}
          size="sm"
          showEmail={false}
        />
        
        <div style={{ marginTop: '8px', marginLeft: '40px' }}>
          <Badge 
            size="xs" 
            color={data.type === 'DH' ? 'warning' : 'info'}
          >
            {data.type === 'DH' ? '🤖 Digital Human' : '👤 Humain'}
          </Badge>
          
          {data.role && (
            <Text size="xs" style={{ 
              marginTop: '4px',
              color: 'var(--qwanyx-text-secondary)'
            }}>
              {data.role}
            </Text>
          )}
        </div>
      </Card>
      
      <Handle 
        type="source" 
        position={Position.Bottom}
        style={{
          background: '#3498db',
          width: 8,
          height: 8,
        }}
      />
    </>
  );
};