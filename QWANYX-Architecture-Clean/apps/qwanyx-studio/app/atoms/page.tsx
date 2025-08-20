'use client';

import {
  Button,
  Input,
  Text,
  Container,
  Section,
  Heading,
  Badge,
  Icon,
  Label,
  Checkbox,
  Radio,
  Toggle,
  Page
} from '@qwanyx/ui';

export default function AtomsShowcase() {
  return (
    <Page layoutStrategy="sections">
      <Section padding="xl">
        <Container maxWidth="lg">
          <Heading size="4xl" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            🔵 ATOMS - Composants de Base
          </Heading>

          {/* Buttons */}
          <Container style={{ marginBottom: '4rem' }}>
            <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
              Buttons
            </Heading>
            <Container style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button variant="primary" size="sm">Primary Small</Button>
              <Button variant="primary" size="md">Primary Medium</Button>
              <Button variant="primary" size="lg">Primary Large</Button>
              <Button variant="secondary" size="md">Secondary</Button>
              <Button variant="danger" size="md">Danger</Button>
              <Button variant="success" size="md">Success</Button>
              <Button variant="warning" size="md">Warning</Button>
              <Button variant="ghost" size="md">Ghost</Button>
              <Button variant="primary" size="md" disabled>Disabled</Button>
            </Container>
          </Container>

          {/* Inputs */}
          <Container style={{ marginBottom: '4rem' }}>
            <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
              Inputs
            </Heading>
            <Container style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
              <Input placeholder="Text input" />
              <Input type="email" placeholder="Email input" />
              <Input type="password" placeholder="Password input" />
              <Input type="number" placeholder="Number input" />
              <Input placeholder="Disabled input" disabled />
              <Input placeholder="With error" error />
              <Input 
                placeholder="With icon" 
                leftIcon={<span>🔍</span>}
              />
            </Container>
          </Container>

          {/* Text */}
          <Container style={{ marginBottom: '4rem' }}>
            <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
              Text
            </Heading>
            <Container style={{ display: 'grid', gap: '0.5rem' }}>
              <Text size="xs">Extra Small Text (xs)</Text>
              <Text size="sm">Small Text (sm)</Text>
              <Text size="md">Medium Text (md) - Default</Text>
              <Text size="lg">Large Text (lg)</Text>
              <Text size="xl">Extra Large Text (xl)</Text>
              <Text size="2xl">2X Large Text (2xl)</Text>
              <Text weight="light">Light Weight Text</Text>
              <Text weight="normal">Normal Weight Text</Text>
              <Text weight="medium">Medium Weight Text</Text>
              <Text weight="semibold">Semibold Weight Text</Text>
              <Text weight="bold">Bold Weight Text</Text>
            </Container>
          </Container>

          {/* Headings */}
          <Container style={{ marginBottom: '4rem' }}>
            <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
              Headings
            </Heading>
            <Container style={{ display: 'grid', gap: '1rem' }}>
              <Heading size="xs">Extra Small Heading</Heading>
              <Heading size="sm">Small Heading</Heading>
              <Heading size="md">Medium Heading</Heading>
              <Heading size="lg">Large Heading</Heading>
              <Heading size="xl">Extra Large Heading</Heading>
              <Heading size="2xl">2X Large Heading</Heading>
              <Heading size="3xl">3X Large Heading</Heading>
              <Heading size="4xl">4X Large Heading</Heading>
            </Container>
          </Container>

          {/* Badges */}
          <Container style={{ marginBottom: '4rem' }}>
            <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
              Badges
            </Heading>
            <Container style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="primary" size="sm">Small</Badge>
              <Badge variant="primary" size="md">Medium</Badge>
              <Badge variant="primary" size="lg">Large</Badge>
            </Container>
          </Container>

          {/* Labels */}
          <Container style={{ marginBottom: '4rem' }}>
            <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
              Labels
            </Heading>
            <Container style={{ display: 'grid', gap: '0.5rem', maxWidth: '300px' }}>
              <Label>Normal Label</Label>
              <Label required>Required Label</Label>
              <Label htmlFor="test-input">Label for Input</Label>
            </Container>
          </Container>

          {/* Checkboxes */}
          <Container style={{ marginBottom: '4rem' }}>
            <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
              Checkboxes
            </Heading>
            <Container style={{ display: 'grid', gap: '1rem' }}>
              <Checkbox label="Unchecked" />
              <Checkbox label="Checked" defaultChecked />
              <Checkbox label="Disabled" disabled />
              <Checkbox label="Disabled Checked" disabled defaultChecked />
            </Container>
          </Container>

          {/* Radio Buttons */}
          <Container style={{ marginBottom: '4rem' }}>
            <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
              Radio Buttons
            </Heading>
            <Container style={{ display: 'grid', gap: '1rem' }}>
              <Radio name="demo" label="Option 1" value="1" />
              <Radio name="demo" label="Option 2" value="2" defaultChecked />
              <Radio name="demo" label="Option 3 (Disabled)" value="3" disabled />
            </Container>
          </Container>

          {/* Toggles */}
          <Container style={{ marginBottom: '4rem' }}>
            <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
              Toggles
            </Heading>
            <Container style={{ display: 'grid', gap: '1rem' }}>
              <Toggle label="Toggle Off" />
              <Toggle label="Toggle On" defaultChecked />
              <Toggle label="Disabled Off" disabled />
              <Toggle label="Disabled On" disabled defaultChecked />
            </Container>
          </Container>

          {/* Icons (emojis for now) */}
          <Container style={{ marginBottom: '4rem' }}>
            <Heading size="2xl" style={{ marginBottom: '1.5rem', borderBottom: '2px solid #E67E22', paddingBottom: '0.5rem' }}>
              Icons (Placeholder)
            </Heading>
            <Container style={{ display: 'flex', gap: '1rem', fontSize: '2rem' }}>
              <span>🏠</span>
              <span>🔍</span>
              <span>⚙️</span>
              <span>👤</span>
              <span>📧</span>
              <span>🔔</span>
              <span>❤️</span>
              <span>⭐</span>
              <span>🛒</span>
              <span>📱</span>
            </Container>
          </Container>
        </Container>
      </Section>
    </Page>
  );
}