import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  Text, 
  Button, 
  Badge,
  Flex,
  Input,
  TextArea,
  Select
} from '@qwanyx/ui';
import { GTDProject, GTDItem } from '../types';

interface ProjectsViewProps {
  projects?: GTDProject[];
  items?: GTDItem[];
  onCreateProject?: (project: Partial<GTDProject>) => void;
  onUpdateProject?: (project: GTDProject) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ 
  projects = [],
  items = [],
  onCreateProject,
  onUpdateProject
}) => {
  const [selectedProject, setSelectedProject] = useState<GTDProject | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState<Partial<GTDProject>>({
    name: '',
    description: '',
    outcome: '',
    status: 'active'
  });

  const activeProjects = projects.filter(p => p.status === 'active');
  const onHoldProjects = projects.filter(p => p.status === 'on_hold');
  const completedProjects = projects.filter(p => p.status === 'completed');

  const getNextActionsForProject = (projectId: string) => {
    return items.filter(item => 
      item.projectId === projectId && 
      item.status === 'next_action'
    );
  };

  const handleCreateProject = () => {
    if (onCreateProject && newProject.name && newProject.outcome) {
      onCreateProject({
        ...newProject,
        createdAt: new Date(),
        nextActions: [],
        reviewFrequency: 'weekly'
      });
      setNewProject({ name: '', description: '', outcome: '', status: 'active' });
      setShowNewProject(false);
    }
  };

  return (
    <Container>
      <Flex justify="between" align="center" marginBottom="lg">
        <Text variant="h2">Projects</Text>
        <Button 
          variant="primary"
          onClick={() => setShowNewProject(true)}
        >
          + New Project
        </Button>
      </Flex>

      {/* Project Stats */}
      <Grid columns={4} gap="md" marginBottom="lg">
        <Card padding="md" textAlign="center">
          <Text variant="h3">{activeProjects.length}</Text>
          <Text variant="muted">Active</Text>
        </Card>
        <Card padding="md" textAlign="center">
          <Text variant="h3">{onHoldProjects.length}</Text>
          <Text variant="muted">On Hold</Text>
        </Card>
        <Card padding="md" textAlign="center">
          <Text variant="h3">{completedProjects.length}</Text>
          <Text variant="muted">Completed</Text>
        </Card>
        <Card padding="md" textAlign="center">
          <Text variant="h3">
            {projects.reduce((sum, p) => sum + (p.nextActions?.length || 0), 0)}
          </Text>
          <Text variant="muted">Total Actions</Text>
        </Card>
      </Grid>

      {/* New Project Form */}
      {showNewProject && (
        <Card padding="lg" marginBottom="lg">
          <Text variant="h3" marginBottom="md">Create New Project</Text>
          
          <div style={{ marginBottom: '16px' }}>
            <Text variant="label" marginBottom="xs">Project Name *</Text>
            <Input
              value={newProject.name}
              onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              placeholder="e.g., Redesign website"
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Text variant="label" marginBottom="xs">Desired Outcome *</Text>
            <TextArea
              value={newProject.outcome}
              onChange={(e) => setNewProject({...newProject, outcome: e.target.value})}
              placeholder="What does 'done' look like?"
              rows={2}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Text variant="label" marginBottom="xs">Description</Text>
            <TextArea
              value={newProject.description}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              placeholder="Additional details..."
              rows={3}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Text variant="label" marginBottom="xs">Review Frequency</Text>
            <Select
              value={newProject.reviewFrequency || 'weekly'}
              onChange={(e) => setNewProject({...newProject, reviewFrequency: e.target.value as any})}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </div>
          
          <Flex gap="sm">
            <Button variant="primary" onClick={handleCreateProject}>
              Create Project
            </Button>
            <Button variant="ghost" onClick={() => setShowNewProject(false)}>
              Cancel
            </Button>
          </Flex>
        </Card>
      )}

      {/* Projects List */}
      <Grid columns={selectedProject ? 2 : 1} gap="lg">
        <div>
          <Text variant="h3" marginBottom="md">Active Projects</Text>
          {activeProjects.length === 0 ? (
            <Card padding="md">
              <Text variant="muted">No active projects</Text>
            </Card>
          ) : (
            activeProjects.map(project => (
              <Card 
                key={project.id} 
                padding="md" 
                marginBottom="sm"
                onClick={() => setSelectedProject(project)}
                style={{ cursor: 'pointer' }}
              >
                <Flex justify="between" align="start">
                  <div style={{ flex: 1 }}>
                    <Text variant="h4">{project.name}</Text>
                    <Text variant="muted" size="sm" marginTop="xs">
                      {project.outcome}
                    </Text>
                    <Flex gap="sm" marginTop="sm">
                      <Badge variant="primary" size="sm">
                        {getNextActionsForProject(project.id).length} actions
                      </Badge>
                      {project.dueDate && (
                        <Badge variant="warning" size="sm">
                          Due: {new Date(project.dueDate).toLocaleDateString()}
                        </Badge>
                      )}
                      <Badge variant="ghost" size="sm">
                        Review: {project.reviewFrequency}
                      </Badge>
                    </Flex>
                  </div>
                </Flex>
              </Card>
            ))
          )}
        </div>

        {/* Project Details */}
        {selectedProject && (
          <Card padding="lg">
            <Flex justify="between" align="start" marginBottom="md">
              <Text variant="h3">{selectedProject.name}</Text>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedProject(null)}
              >
                Close
              </Button>
            </Flex>
            
            <Card variant="ghost" padding="md" marginBottom="md">
              <Text variant="label" marginBottom="xs">Outcome</Text>
              <Text>{selectedProject.outcome}</Text>
            </Card>
            
            {selectedProject.description && (
              <Card variant="ghost" padding="md" marginBottom="md">
                <Text variant="label" marginBottom="xs">Description</Text>
                <Text>{selectedProject.description}</Text>
              </Card>
            )}
            
            <div>
              <Flex justify="between" align="center" marginBottom="sm">
                <Text variant="h4">Next Actions</Text>
                <Button variant="primary" size="sm">
                  + Add Action
                </Button>
              </Flex>
              
              {getNextActionsForProject(selectedProject.id).length === 0 ? (
                <Card variant="ghost" padding="md">
                  <Text variant="muted">No next actions defined</Text>
                </Card>
              ) : (
                getNextActionsForProject(selectedProject.id).map(action => (
                  <Card key={action.id} variant="ghost" padding="sm" marginBottom="xs">
                    <Flex justify="between" align="center">
                      <Text>{action.name}</Text>
                      <Flex gap="xs">
                        {action.contexts.map(ctx => (
                          <Badge key={ctx} variant="ghost" size="sm">
                            {ctx}
                          </Badge>
                        ))}
                        {action.timeEstimate && (
                          <Badge variant="ghost" size="sm">
                            {action.timeEstimate}min
                          </Badge>
                        )}
                      </Flex>
                    </Flex>
                  </Card>
                ))
              )}
            </div>
            
            <Flex gap="sm" marginTop="md">
              <Button variant="secondary" size="sm">
                Put On Hold
              </Button>
              <Button variant="success" size="sm">
                Mark Complete
              </Button>
              <Button variant="danger" size="sm">
                Delete Project
              </Button>
            </Flex>
          </Card>
        )}
      </Grid>
    </Container>
  );
};

// Helper Grid component
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