import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from './Tooltip'
import { Button } from '../Button'
import { Icon } from '../Icon'

const meta = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    content: 'This is a helpful tooltip',
    children: <Button>Hover me</Button>,
  },
}

export const Positions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', padding: '4rem' }}>
      <Tooltip content="Top tooltip" position="top">
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content="Bottom tooltip" position="bottom">
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content="Left tooltip" position="left">
        <Button>Left</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" position="right">
        <Button>Right</Button>
      </Tooltip>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <Tooltip content="Information" icon="Info">
        <Button variant="outline">
          <Icon name="Info" size="sm" />
        </Button>
      </Tooltip>
      <Tooltip content="Settings" icon="Settings">
        <Button variant="outline">
          <Icon name="Settings" size="sm" />
        </Button>
      </Tooltip>
      <Tooltip content="Delete item" icon="Warning">
        <Button variant="outline" style={{ color: 'var(--qwanyx-error)' }}>
          <Icon name="Delete" size="sm" />
        </Button>
      </Tooltip>
    </div>
  ),
}

export const CustomDelay: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <Tooltip content="Instant (0ms)" delay={0}>
        <Button>Instant</Button>
      </Tooltip>
      <Tooltip content="Fast (100ms)" delay={100}>
        <Button>Fast</Button>
      </Tooltip>
      <Tooltip content="Default (200ms)" delay={200}>
        <Button>Default</Button>
      </Tooltip>
      <Tooltip content="Slow (500ms)" delay={500}>
        <Button>Slow</Button>
      </Tooltip>
    </div>
  ),
}

export const LongContent: Story = {
  args: {
    content: 'This is a much longer tooltip message that provides detailed information',
    children: <Button>Long tooltip</Button>,
  },
}

export const IconButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Tooltip content="Dashboard">
        <Button variant="outline" size="sm" style={{ padding: '0.5rem' }}>
          <Icon name="Dashboard" size="sm" />
        </Button>
      </Tooltip>
      <Tooltip content="Edit">
        <Button variant="outline" size="sm" style={{ padding: '0.5rem' }}>
          <Icon name="Edit" size="sm" />
        </Button>
      </Tooltip>
      <Tooltip content="Settings">
        <Button variant="outline" size="sm" style={{ padding: '0.5rem' }}>
          <Icon name="Settings" size="sm" />
        </Button>
      </Tooltip>
      <Tooltip content="Delete">
        <Button variant="outline" size="sm" style={{ padding: '0.5rem', color: 'var(--qwanyx-error)' }}>
          <Icon name="Delete" size="sm" />
        </Button>
      </Tooltip>
    </div>
  ),
}