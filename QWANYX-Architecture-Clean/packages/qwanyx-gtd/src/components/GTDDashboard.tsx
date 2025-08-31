import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  Text, 
  Button, 
  Badge,
  Flex,
  Grid
} from '@qwanyx/ui';
import { GTDItem, GTDStats, GTDProject, ProcessingDecision } from '../types';
import { InboxProcessor } from './InboxProcessor';
import { EmailVerification } from './EmailVerification';
import { ProjectsView } from './ProjectsView';

interface GTDDashboardProps {
  workspace?: string;
  userEmail?: string;
}

export const GTDDashboard: React.FC<GTDDashboardProps> = ({ 
  workspace, 
  userEmail = 'user@example.com'
}) => {
  const [viewMode, setViewMode] = useState<'process' | 'review' | 'plan' | 'email'>('process');
  const [stats] = useState<GTDStats>({
    inbox: 12,
    nextActions: 7,
    waiting: 3,
    projects: 4,
    completed: 28,
    delegated: 2
  });

  // Mock data for demo
  const [inboxItems] = useState<GTDItem[]>([
    {
      id: '1',
      name: 'Review project proposal',
      content: 'Need to review the Q4 project proposal and provide feedback',
      contentPreview: 'Need to review the Q4 project proposal...',
      dateAdded: new Date(),
      status: 'inbox',
      priority: 'high',
      energy: 'medium',
      contexts: ['@computer'],
      spuSuggestion: {
        action: 'do_now',
        confidence: 0.85,
        reasoning: 'High priority document review, estimated 30 minutes'
      }
    },
    {
      id: '2',
      name: 'Schedule dentist appointment',
      content: 'Call to schedule annual checkup',
      contentPreview: 'Call to schedule annual checkup',
      dateAdded: new Date(),
      status: 'inbox',
      priority: 'normal',
      energy: 'low',
      contexts: ['@phone'],
      spuSuggestion: {
        action: 'defer',
        confidence: 0.75,
        reasoning: 'Non-urgent health maintenance task'
      }
    },
    {
      id: '3',
      name: 'Email from Sarah about budget',
      content: 'Sarah needs the budget numbers for next quarter',
      contentPreview: 'Sarah needs the budget numbers...',
      dateAdded: new Date(),
      status: 'inbox',
      priority: 'high',
      energy: 'high',
      contexts: ['@computer'],
      emailSource: {
        from: 'sarah@company.com',
        subject: 'Q1 Budget Numbers Needed',
        date: new Date(),
        hasAttachments: true
      },
      spuSuggestion: {
        action: 'delegate',
        confidence: 0.70,
        reasoning: 'Finance team should handle budget requests'
      }
    }
  ]);

  const [projects] = useState<GTDProject[]>([
    {
      id: 'p1',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website',
      outcome: 'Modern, responsive website launched with improved UX',
      status: 'active',
      createdAt: new Date(),
      nextActions: ['1', '2'],
      reviewFrequency: 'weekly'
    },
    {
      id: 'p2',
      name: 'Q4 Planning',
      description: 'Strategic planning for Q4',
      outcome: 'Q4 roadmap approved and resourced',
      status: 'active',
      createdAt: new Date(),
      nextActions: ['3'],
      reviewFrequency: 'daily'
    }
  ]);

  const handleProcessItem = (item: GTDItem, decision: ProcessingDecision) => {
    console.log('Processing item:', item.name, 'Decision:', decision);
    // TODO: Implement actual processing logic
  };

  return (
    <Container padding="lg">
      {/* Header */}
      <Flex justify="between" align="center" marginBottom="lg">
        <Text variant="h1" size="xl">GTD Command Center</Text>
        <Flex gap="sm">
          <Badge variant="primary">{stats.inbox} inbox</Badge>
          <Badge variant="success">{stats.nextActions} actions</Badge>
          <Badge variant="warning">{stats.waiting} waiting</Badge>
          <Badge variant="info">{stats.projects} projects</Badge>
        </Flex>
      </Flex>

      {/* View Mode Tabs */}
      <Flex gap="sm" marginBottom="lg">
        <Button 
          variant={viewMode === 'process' ? 'primary' : 'ghost'}
          onClick={() => setViewMode('process')}
        >
          Process Inbox
        </Button>
        <Button 
          variant={viewMode === 'review' ? 'primary' : 'ghost'}
          onClick={() => setViewMode('review')}
        >
          Review
        </Button>
        <Button 
          variant={viewMode === 'plan' ? 'primary' : 'ghost'}
          onClick={() => setViewMode('plan')}
        >
          Projects
        </Button>
        <Button 
          variant={viewMode === 'email' ? 'primary' : 'ghost'}
          onClick={() => setViewMode('email')}
        >
          Email Setup
        </Button>
      </Flex>

      {/* Main Content Area */}
      <Grid columns={1} gap="lg">
        {viewMode === 'process' && (
          <InboxProcessor 
            items={inboxItems}
            onProcess={handleProcessItem}
            enableSPU={true}
          />
        )}

        {viewMode === 'review' && (
          <Grid columns={2} gap="lg">
            <Card padding="md">
              <Text variant="h3" marginBottom="sm">Next Actions</Text>
              <Text variant="large">{stats.nextActions}</Text>
              <Text variant="muted">Ready to do</Text>
            </Card>
            <Card padding="md">
              <Text variant="h3" marginBottom="sm">Waiting For</Text>
              <Text variant="large">{stats.waiting}</Text>
              <Text variant="muted">Delegated or blocked</Text>
            </Card>
            <Card padding="md">
              <Text variant="h3" marginBottom="sm">Projects</Text>
              <Text variant="large">{stats.projects}</Text>
              <Text variant="muted">Active projects</Text>
            </Card>
            <Card padding="md">
              <Text variant="h3" marginBottom="sm">Completed This Week</Text>
              <Text variant="large">{stats.completed}</Text>
              <Text variant="muted">Great progress!</Text>
            </Card>
          </Grid>
        )}

        {viewMode === 'plan' && (
          <ProjectsView 
            projects={projects}
            items={inboxItems}
          />
        )}

        {viewMode === 'email' && (
          <EmailVerification 
            userEmail={userEmail}
            workspace={workspace}
          />
        )}
      </Grid>

      {/* Quick Actions */}
      <Flex gap="sm" marginTop="lg">
        <Button variant="primary" size="sm">
          Quick Capture
        </Button>
        <Button variant="ghost" size="sm">
          Weekly Review
        </Button>
        <Button variant="ghost" size="sm">
          Process Email
        </Button>
      </Flex>
    </Container>
  );
};