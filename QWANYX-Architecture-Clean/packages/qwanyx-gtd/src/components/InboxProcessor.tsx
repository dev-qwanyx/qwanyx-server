import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Card, 
  Text, 
  Button, 
  Badge,
  Flex,
  Progress,
  Input,
  Select
} from '@qwanyx/ui';
import { GTDItem, ProcessingDecision } from '../types';

interface InboxProcessorProps {
  items?: GTDItem[];
  onProcess?: (item: GTDItem, decision: ProcessingDecision) => void;
  enableSPU?: boolean;
}

export const InboxProcessor: React.FC<InboxProcessorProps> = ({ 
  items = [],
  onProcess,
  enableSPU = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [decision, setDecision] = useState<Partial<ProcessingDecision>>({});
  
  const currentItem = items[currentIndex];
  const progress = items.length > 0 ? ((currentIndex + 1) / items.length) * 100 : 0;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!currentItem || processing) return;
      
      switch(e.key) {
        case '1':
        case 'd':
          handleQuickDecision('do_now');
          break;
        case '2':
        case 'p':
          handleQuickDecision('defer');
          break;
        case '3':
        case 'w':
          handleQuickDecision('delegate');
          break;
        case '4':
        case 'x':
          handleQuickDecision('delete');
          break;
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [currentItem, processing]);

  const handleQuickDecision = useCallback((action: ProcessingDecision['decision']) => {
    if (!currentItem) return;
    
    const processingDecision: ProcessingDecision = {
      itemId: currentItem.id,
      decision: action,
      ...decision
    };
    
    setProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      if (onProcess) {
        onProcess(currentItem, processingDecision);
      }
      
      // Move to next item
      if (currentIndex < items.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setDecision({});
      }
      setProcessing(false);
    }, 300);
  }, [currentItem, currentIndex, items.length, decision, onProcess]);

  if (items.length === 0) {
    return (
      <Card padding="xl" textAlign="center">
        <Text variant="h2" marginBottom="md">📭 Inbox Zero!</Text>
        <Text variant="muted">No items to process. Great job!</Text>
      </Card>
    );
  }

  if (!currentItem) {
    return (
      <Card padding="xl" textAlign="center">
        <Text variant="h2" marginBottom="md">✅ All Done!</Text>
        <Text variant="muted">You've processed all {items.length} items.</Text>
        <Button variant="primary" marginTop="md" onClick={() => setCurrentIndex(0)}>
          Review Again
        </Button>
      </Card>
    );
  }

  return (
    <Container>
      {/* Progress Bar */}
      <Flex justify="between" align="center" marginBottom="md">
        <Text variant="muted">
          Item {currentIndex + 1} of {items.length}
        </Text>
        <Text variant="muted">
          {Math.round(progress)}% complete
        </Text>
      </Flex>
      <Progress value={progress} marginBottom="lg" />

      {/* Current Item */}
      <Card padding="lg" marginBottom="lg">
        <Flex justify="between" align="start" marginBottom="md">
          <Text variant="h3">{currentItem.name}</Text>
          {currentItem.spuSuggestion && enableSPU && (
            <Badge variant="info">
              SPU: {currentItem.spuSuggestion.action} 
              ({Math.round(currentItem.spuSuggestion.confidence * 100)}%)
            </Badge>
          )}
        </Flex>
        
        {currentItem.contentPreview && (
          <Text variant="muted" marginBottom="md">
            {currentItem.contentPreview}
          </Text>
        )}
        
        {currentItem.emailSource && (
          <Flex gap="sm" marginBottom="md">
            <Badge variant="ghost">From: {currentItem.emailSource.from}</Badge>
            <Badge variant="ghost">📎 Attachments</Badge>
          </Flex>
        )}

        {/* SPU Reasoning */}
        {currentItem.spuSuggestion?.reasoning && enableSPU && (
          <Card variant="ghost" padding="sm" marginTop="md">
            <Text variant="small" color="muted">
              💡 {currentItem.spuSuggestion.reasoning}
            </Text>
          </Card>
        )}
      </Card>

      {/* Quick Actions */}
      <Grid columns={4} gap="sm" marginBottom="lg">
        <Button 
          variant="primary" 
          onClick={() => handleQuickDecision('do_now')}
          disabled={processing}
        >
          <Flex direction="column" align="center" gap="xs">
            <Text>Do Now</Text>
            <Text variant="small" color="muted">(1 or D)</Text>
          </Flex>
        </Button>
        
        <Button 
          variant="secondary"
          onClick={() => handleQuickDecision('defer')}
          disabled={processing}
        >
          <Flex direction="column" align="center" gap="xs">
            <Text>Defer</Text>
            <Text variant="small" color="muted">(2 or P)</Text>
          </Flex>
        </Button>
        
        <Button 
          variant="warning"
          onClick={() => handleQuickDecision('delegate')}
          disabled={processing}
        >
          <Flex direction="column" align="center" gap="xs">
            <Text>Delegate</Text>
            <Text variant="small" color="muted">(3 or W)</Text>
          </Flex>
        </Button>
        
        <Button 
          variant="danger"
          onClick={() => handleQuickDecision('delete')}
          disabled={processing}
        >
          <Flex direction="column" align="center" gap="xs">
            <Text>Delete</Text>
            <Text variant="small" color="muted">(4 or X)</Text>
          </Flex>
        </Button>
      </Grid>

      {/* Additional Options */}
      <Card variant="ghost" padding="md">
        <Text variant="h4" marginBottom="sm">Additional Options</Text>
        
        <Grid columns={2} gap="md">
          <div>
            <Text variant="small" marginBottom="xs">Context</Text>
            <Select
              value={decision.context || ''}
              onChange={(e) => setDecision({...decision, context: e.target.value})}
              size="sm"
            >
              <option value="">Select context...</option>
              <option value="@computer">@computer</option>
              <option value="@phone">@phone</option>
              <option value="@home">@home</option>
              <option value="@office">@office</option>
              <option value="@errands">@errands</option>
            </Select>
          </div>
          
          <div>
            <Text variant="small" marginBottom="xs">Time Estimate (minutes)</Text>
            <Input
              type="number"
              value={decision.timeEstimate || ''}
              onChange={(e) => setDecision({...decision, timeEstimate: parseInt(e.target.value)})}
              placeholder="15"
              size="sm"
            />
          </div>
          
          <div>
            <Text variant="small" marginBottom="xs">Delegate To</Text>
            <Input
              type="email"
              value={decision.delegateTo || ''}
              onChange={(e) => setDecision({...decision, delegateTo: e.target.value})}
              placeholder="colleague@example.com"
              size="sm"
            />
          </div>
          
          <div>
            <Text variant="small" marginBottom="xs">Project</Text>
            <Select
              value={decision.projectId || ''}
              onChange={(e) => setDecision({...decision, projectId: e.target.value})}
              size="sm"
            >
              <option value="">No project</option>
              <option value="new">+ Create new project</option>
            </Select>
          </div>
        </Grid>
      </Card>

      {/* Navigation */}
      <Flex justify="between" marginTop="lg">
        <Button 
          variant="ghost"
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0 || processing}
        >
          Previous
        </Button>
        
        <Button 
          variant="ghost"
          onClick={() => setCurrentIndex(Math.min(items.length - 1, currentIndex + 1))}
          disabled={currentIndex === items.length - 1 || processing}
        >
          Skip
        </Button>
      </Flex>
    </Container>
  );
};

// Fix Grid component that's not imported
const Grid: React.FC<{ columns: number; gap: string; children: React.ReactNode }> = ({ 
  columns, 
  gap, 
  children 
}) => {
  const gapSizes = { sm: '8px', md: '16px', lg: '24px' };
  const gapValue = gapSizes[gap as keyof typeof gapSizes] || gap;
  
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: gapValue 
    }}>
      {children}
    </div>
  );
};