import React from 'react';
import {
  Container,
  Section,
  Heading,
  Text,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Grid,
  Flex,
  Card,
  CardContent,
  Badge,
  // Agile Status Molecules
  AgileStatusIcon,
  AgileStatusBadge,
  AgileTaskCard,
  // User Profile Molecule
  UserProfile,
} from '../../src';

export const MoleculesShowcase: React.FC = () => {
  return (
    <Container>
      <Section spacing="xl">
        <div className="qwanyx-mb-8">
          <Heading as="h1" className="qwanyx-mb-4">🧬 Molecules</Heading>
          <Text size="lg" color="secondary">
            Combinations of atoms that form more complex, reusable components.
          </Text>
        </div>

        <Tabs defaultValue="user">
          <TabsList variant="boxed" fullWidth>
            <TabsTrigger value="user">👤 User Profile</TabsTrigger>
            <TabsTrigger value="agile">📊 Agile Status</TabsTrigger>
            <TabsTrigger value="forms">📝 Form Groups</TabsTrigger>
            <TabsTrigger value="cards">🃏 Card Variants</TabsTrigger>
            <TabsTrigger value="navigation">🧭 Navigation</TabsTrigger>
          </TabsList>

          {/* User Profile Tab */}
          <TabsContent value="user">
            <div className="qwanyx-space-y-12">
              <div>
                <Heading as="h3" className="qwanyx-mb-4">UserProfile</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="success" size="sm">New</Badge> • 
                  Molecule composée d'Avatar + Text + Flex
                </Text>
                
                <div className="qwanyx-space-y-8">
                  {/* Sizes */}
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-4">Sizes</Text>
                    <Flex gap="lg" wrap="wrap" align="center">
                      <Card>
                        <CardContent>
                          <UserProfile
                            user={{
                              name: 'John Doe',
                              email: 'john@example.com',
                              avatar: 'https://i.pravatar.cc/150?img=1'
                            }}
                            size="sm"
                          />
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent>
                          <UserProfile
                            user={{
                              name: 'Jane Smith',
                              email: 'jane@example.com',
                              avatar: 'https://i.pravatar.cc/150?img=2'
                            }}
                            size="md"
                          />
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent>
                          <UserProfile
                            user={{
                              name: 'Bob Johnson',
                              email: 'bob@example.com',
                              avatar: 'https://i.pravatar.cc/150?img=3'
                            }}
                            size="lg"
                          />
                        </CardContent>
                      </Card>
                    </Flex>
                  </div>

                  {/* Orientations */}
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-4">Orientations</Text>
                    <Flex gap="lg" wrap="wrap">
                      <Card>
                        <CardContent>
                          <Text size="xs" color="secondary" className="qwanyx-mb-2">Horizontal</Text>
                          <UserProfile
                            user={{
                              name: 'Alice Cooper',
                              email: 'alice@example.com',
                              role: 'Designer',
                              avatar: 'https://i.pravatar.cc/150?img=5'
                            }}
                            orientation="horizontal"
                            showRole={true}
                            showEmail={false}
                          />
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent>
                          <Text size="xs" color="secondary" className="qwanyx-mb-2">Vertical</Text>
                          <UserProfile
                            user={{
                              name: 'Charlie Brown',
                              email: 'charlie@example.com',
                              role: 'Developer',
                              avatar: 'https://i.pravatar.cc/150?img=8'
                            }}
                            orientation="vertical"
                            showRole={true}
                          />
                        </CardContent>
                      </Card>
                    </Flex>
                  </div>

                  {/* Without Avatar */}
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-4">Fallback (No Avatar)</Text>
                    <Flex gap="lg" wrap="wrap">
                      <Card>
                        <CardContent>
                          <UserProfile
                            user={{
                              name: 'Philippe Martin',
                              email: 'phil@pixanima.com'
                            }}
                            size="md"
                          />
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent>
                          <UserProfile
                            user={{
                              name: 'Marie Dupont',
                              role: 'Admin'
                            }}
                            showRole={true}
                            showEmail={false}
                          />
                        </CardContent>
                      </Card>
                    </Flex>
                  </div>

                  {/* Interactive */}
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-4">Interactive (with onClick)</Text>
                    <Flex gap="lg" wrap="wrap">
                      <Card>
                        <CardContent>
                          <UserProfile
                            user={{
                              name: 'Click Me',
                              email: 'interactive@example.com'
                            }}
                            onClick={() => alert('User clicked!')}
                          />
                        </CardContent>
                      </Card>
                    </Flex>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Agile Status Tab */}
          <TabsContent value="agile">
            <div className="qwanyx-space-y-12">
              <div className="qwanyx-p-8 qwanyx-bg-info/10 qwanyx-rounded-lg qwanyx-border qwanyx-border-info">
                <Heading as="h3" className="qwanyx-mb-4">📈 Agile Project Management Components</Heading>
                <Text className="qwanyx-mb-4">
                  Specialized molecules for agile workflows, combining Progress icons with status colors.
                </Text>
              </div>

              {/* AgileStatusIcon Section */}
              <div>
                <Heading as="h3" className="qwanyx-mb-4">AgileStatusIcon</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="success" size="sm">Ready</Badge> • 
                  Used in: Kanban boards, Task lists, Sprint planning
                </Text>
                <div className="qwanyx-space-y-6">
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">All Status Icons</Text>
                    <Flex gap="xl" wrap="wrap" align="center">
                      <div className="qwanyx-text-center">
                        <AgileStatusIcon status="backlog" size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">Backlog</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <AgileStatusIcon status="todo" size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">To Do</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <AgileStatusIcon status="doing" size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">In Progress</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <AgileStatusIcon status="review" size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">Review</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <AgileStatusIcon status="done" size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">Done</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <AgileStatusIcon status="blocked" size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">Blocked</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <AgileStatusIcon status="validated" size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">Validated</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <AgileStatusIcon status="archived" size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">Archived</Text>
                      </div>
                    </Flex>
                  </div>

                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">With Custom Progress</Text>
                    <Flex gap="xl" wrap="wrap" align="center">
                      <AgileStatusIcon status="doing" progress={25} showLabel />
                      <AgileStatusIcon status="doing" progress={50} showLabel />
                      <AgileStatusIcon status="doing" progress={75} showLabel />
                      <AgileStatusIcon status="review" progress={90} showLabel />
                    </Flex>
                  </div>

                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">Progress Visualization (0% to 100%)</Text>
                    <Flex gap="xl" wrap="wrap" align="center">
                      <div className="qwanyx-text-center">
                        <AgileStatusIcon status="doing" progress={0} size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">0%</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <AgileStatusIcon status="doing" progress={10} size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">10%</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <AgileStatusIcon status="doing" progress={20} size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">20%</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <AgileStatusIcon status="doing" progress={40} size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">40%</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <AgileStatusIcon status="doing" progress={60} size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">60%</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <AgileStatusIcon status="doing" progress={80} size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">80%</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <AgileStatusIcon status="doing" progress={90} size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">90%</Text>
                      </div>
                      <div className="qwanyx-text-center">
                        <AgileStatusIcon status="doing" progress={100} size="lg" />
                        <Text size="xs" className="qwanyx-mt-2">100%</Text>
                      </div>
                    </Flex>
                  </div>
                  
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">Icon Sizes</Text>
                    <Flex gap="lg" align="center" wrap="wrap">
                      <AgileStatusIcon status="doing" progress={60} size="xs" />
                      <AgileStatusIcon status="doing" progress={60} size="sm" />
                      <AgileStatusIcon status="doing" progress={60} size="md" />
                      <AgileStatusIcon status="doing" progress={60} size="lg" />
                      <AgileStatusIcon status="doing" progress={60} size="xl" />
                    </Flex>
                  </div>
                </div>
              </div>

              {/* AgileStatusBadge Section */}
              <div>
                <Heading as="h3" className="qwanyx-mb-4">AgileStatusBadge</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="success" size="sm">Ready</Badge> • 
                  Used in: Task cards, User stories, Issue tracking
                </Text>
                <div className="qwanyx-space-y-6">
                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">Status Badges</Text>
                    <Flex gap="md" wrap="wrap">
                      <AgileStatusBadge status="backlog" />
                      <AgileStatusBadge status="todo" />
                      <AgileStatusBadge status="doing" progress={45} />
                      <AgileStatusBadge status="review" />
                      <AgileStatusBadge status="done" />
                      <AgileStatusBadge status="blocked" />
                      <AgileStatusBadge status="validated" />
                      <AgileStatusBadge status="archived" />
                    </Flex>
                  </div>

                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">Without Icons</Text>
                    <Flex gap="md" wrap="wrap">
                      <AgileStatusBadge status="backlog" showIcon={false} />
                      <AgileStatusBadge status="todo" showIcon={false} />
                      <AgileStatusBadge status="doing" showIcon={false} progress={60} />
                      <AgileStatusBadge status="review" showIcon={false} />
                      <AgileStatusBadge status="done" showIcon={false} />
                    </Flex>
                  </div>

                  <div>
                    <Text weight="semibold" className="qwanyx-mb-3">Sizes</Text>
                    <Flex gap="md" align="center" wrap="wrap">
                      <AgileStatusBadge status="doing" size="xs" progress={10} />
                      <AgileStatusBadge status="doing" size="sm" progress={40} />
                      <AgileStatusBadge status="doing" size="md" progress={60} />
                      <AgileStatusBadge status="doing" size="lg" progress={80} />
                    </Flex>
                  </div>
                </div>
              </div>

              {/* AgileTaskCard Section */}
              <div>
                <Heading as="h3" className="qwanyx-mb-4">AgileTaskCard</Heading>
                <Text color="muted" className="qwanyx-mb-6">
                  Status: <Badge color="success" size="sm">Ready</Badge> • 
                  Used in: Kanban boards, Sprint boards, Task management
                </Text>
                <Grid cols={2} gap="lg">
                  <AgileTaskCard
                    title="Implement user authentication"
                    status="doing"
                    progress={65}
                    assignee="John Doe"
                    priority="high"
                    dueDate="Dec 25"
                    description="Add OAuth2 integration with social providers"
                  />
                  <AgileTaskCard
                    title="Fix responsive layout issues"
                    status="review"
                    assignee="Jane Smith"
                    priority="medium"
                    dueDate="Dec 23"
                    description="Mobile view breaking on smaller screens"
                  />
                  <AgileTaskCard
                    title="Database migration"
                    status="blocked"
                    assignee="Bob Wilson"
                    priority="critical"
                    dueDate="Dec 20"
                    description="Waiting for DevOps team approval"
                  />
                  <AgileTaskCard
                    title="Update documentation"
                    status="todo"
                    assignee="Alice Brown"
                    priority="low"
                    dueDate="Dec 30"
                    description="Add API endpoints documentation"
                  />
                  <AgileTaskCard
                    title="Performance optimization"
                    status="done"
                    assignee="Charlie Davis"
                    priority="high"
                    dueDate="Dec 22"
                    description="Optimize database queries and caching"
                  />
                  <AgileTaskCard
                    title="Security audit"
                    status="validated"
                    assignee="Eve Martinez"
                    priority="critical"
                    dueDate="Dec 18"
                    description="Complete security assessment passed"
                  />
                </Grid>
              </div>

              {/* Usage Example */}
              <div>
                <Heading as="h3" className="qwanyx-mb-4">Real-World Example: Sprint Board</Heading>
                <div className="qwanyx-grid qwanyx-grid-cols-4 qwanyx-gap-4">
                  <div className="qwanyx-bg-gray-50 qwanyx-p-4 qwanyx-rounded-lg">
                    <Flex justify="between" align="center" className="qwanyx-mb-4">
                      <Text weight="semibold">Backlog</Text>
                      <Badge className="qwanyx-bg-status-backlog qwanyx-text-white">3</Badge>
                    </Flex>
                    <div className="qwanyx-space-y-3">
                      <div className="qwanyx-p-3 qwanyx-bg-white qwanyx-rounded qwanyx-shadow-sm">
                        <AgileStatusIcon status="backlog" size="sm" showLabel />
                        <Text size="sm" className="qwanyx-mt-2">Setup CI/CD pipeline</Text>
                      </div>
                      <div className="qwanyx-p-3 qwanyx-bg-white qwanyx-rounded qwanyx-shadow-sm">
                        <AgileStatusIcon status="backlog" size="sm" showLabel />
                        <Text size="sm" className="qwanyx-mt-2">Add unit tests</Text>
                      </div>
                      <div className="qwanyx-p-3 qwanyx-bg-white qwanyx-rounded qwanyx-shadow-sm">
                        <AgileStatusIcon status="backlog" size="sm" showLabel />
                        <Text size="sm" className="qwanyx-mt-2">Refactor auth module</Text>
                      </div>
                    </div>
                  </div>

                  <div className="qwanyx-bg-blue-50 qwanyx-p-4 qwanyx-rounded-lg">
                    <Flex justify="between" align="center" className="qwanyx-mb-4">
                      <Text weight="semibold">To Do</Text>
                      <Badge className="qwanyx-bg-status-todo qwanyx-text-white">2</Badge>
                    </Flex>
                    <div className="qwanyx-space-y-3">
                      <div className="qwanyx-p-3 qwanyx-bg-white qwanyx-rounded qwanyx-shadow-sm">
                        <AgileStatusIcon status="todo" size="sm" showLabel />
                        <Text size="sm" className="qwanyx-mt-2">Design new dashboard</Text>
                      </div>
                      <div className="qwanyx-p-3 qwanyx-bg-white qwanyx-rounded qwanyx-shadow-sm">
                        <AgileStatusIcon status="todo" size="sm" showLabel />
                        <Text size="sm" className="qwanyx-mt-2">API integration</Text>
                      </div>
                    </div>
                  </div>

                  <div className="qwanyx-bg-orange-50 qwanyx-p-4 qwanyx-rounded-lg">
                    <Flex justify="between" align="center" className="qwanyx-mb-4">
                      <Text weight="semibold">In Progress</Text>
                      <Badge className="qwanyx-bg-status-doing qwanyx-text-white">2</Badge>
                    </Flex>
                    <div className="qwanyx-space-y-3">
                      <div className="qwanyx-p-3 qwanyx-bg-white qwanyx-rounded qwanyx-shadow-sm">
                        <AgileStatusIcon status="doing" progress={60} size="sm" showLabel />
                        <Text size="sm" className="qwanyx-mt-2">User profile page</Text>
                      </div>
                      <div className="qwanyx-p-3 qwanyx-bg-white qwanyx-rounded qwanyx-shadow-sm">
                        <AgileStatusIcon status="doing" progress={30} size="sm" showLabel />
                        <Text size="sm" className="qwanyx-mt-2">Search functionality</Text>
                      </div>
                    </div>
                  </div>

                  <div className="qwanyx-bg-green-50 qwanyx-p-4 qwanyx-rounded-lg">
                    <Flex justify="between" align="center" className="qwanyx-mb-4">
                      <Text weight="semibold">Done</Text>
                      <Badge className="qwanyx-bg-status-done qwanyx-text-white">3</Badge>
                    </Flex>
                    <div className="qwanyx-space-y-3">
                      <div className="qwanyx-p-3 qwanyx-bg-white qwanyx-rounded qwanyx-shadow-sm">
                        <AgileStatusIcon status="done" size="sm" showLabel />
                        <Text size="sm" className="qwanyx-mt-2">Login page</Text>
                      </div>
                      <div className="qwanyx-p-3 qwanyx-bg-white qwanyx-rounded qwanyx-shadow-sm">
                        <AgileStatusIcon status="validated" size="sm" showLabel />
                        <Text size="sm" className="qwanyx-mt-2">Database setup</Text>
                      </div>
                      <div className="qwanyx-p-3 qwanyx-bg-white qwanyx-rounded qwanyx-shadow-sm">
                        <AgileStatusIcon status="archived" size="sm" showLabel />
                        <Text size="sm" className="qwanyx-mt-2">Initial setup</Text>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Other tabs placeholder */}
          <TabsContent value="forms">
            <div className="qwanyx-p-8 qwanyx-border-2 qwanyx-border-dashed qwanyx-rounded-lg qwanyx-text-center">
              <Text color="muted">Form group molecules will be showcased here</Text>
            </div>
          </TabsContent>

          <TabsContent value="cards">
            <div className="qwanyx-p-8 qwanyx-border-2 qwanyx-border-dashed qwanyx-rounded-lg qwanyx-text-center">
              <Text color="muted">Card variant molecules will be showcased here</Text>
            </div>
          </TabsContent>

          <TabsContent value="navigation">
            <div className="qwanyx-p-8 qwanyx-border-2 qwanyx-border-dashed qwanyx-rounded-lg qwanyx-text-center">
              <Text color="muted">Navigation molecules will be showcased here</Text>
            </div>
          </TabsContent>
        </Tabs>
      </Section>
    </Container>
  );
};