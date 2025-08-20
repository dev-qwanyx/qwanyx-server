import React from 'react';
import { Button, Flex, Icon, Text } from '@qwanyx/ui';

interface QwanyxToolbarProps {
  onAddNode: (type: 'step' | 'decision' | 'actor') => void;
  onExport?: () => void;
  onImport?: () => void;
  onClear?: () => void;
}

const onDragStart = (event: React.DragEvent, nodeType: string) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

export const QwanyxToolbar: React.FC<QwanyxToolbarProps> = ({
  onAddNode,
  onExport,
  onImport,
  onClear,
}) => {
  return (
    <div style={{
      position: 'absolute',
      top: 10,
      left: 10,
      zIndex: 10,
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
    }}>
      <Flex gap="sm" align="center">
        <Text size="sm" weight="semibold" style={{ marginRight: '8px' }}>
          Ajouter:
        </Text>
        
        <div
          draggable
          onDragStart={(e) => onDragStart(e, 'step')}
          style={{ cursor: 'grab' }}
        >
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddNode('step')}
            style={{ gap: '4px' }}
          >
            <Icon name="PlayArrow" size="xs" />
            Étape
          </Button>
        </div>
        
        <div
          draggable
          onDragStart={(e) => onDragStart(e, 'decision')}
          style={{ cursor: 'grab' }}
        >
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddNode('decision')}
            style={{ gap: '4px' }}
          >
            <Icon name="Help" size="xs" />
            Décision
          </Button>
        </div>
        
        <div
          draggable
          onDragStart={(e) => onDragStart(e, 'actor')}
          style={{ cursor: 'grab' }}
        >
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAddNode('actor')}
            style={{ gap: '4px' }}
          >
            <Icon name="Person" size="xs" />
            Acteur
          </Button>
        </div>
        
        <div style={{
          width: '1px',
          height: '24px',
          backgroundColor: '#e5e7eb',
          margin: '0 8px',
        }} />
        
        {onExport && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onExport}
            style={{ gap: '4px' }}
          >
            <Icon name="Download" size="xs" />
            Export
          </Button>
        )}
        
        {onImport && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onImport}
            style={{ gap: '4px' }}
          >
            <Icon name="Upload" size="xs" />
            Import
          </Button>
        )}
        
        {onClear && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            style={{ gap: '4px', color: 'var(--qwanyx-text-danger)' }}
          >
            <Icon name="Delete" size="xs" />
            Effacer
          </Button>
        )}
      </Flex>
    </div>
  );
};