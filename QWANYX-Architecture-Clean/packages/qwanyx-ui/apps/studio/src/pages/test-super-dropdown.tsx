import React, { useState } from 'react';
import { 
  SuperDropdown, 
  Select, 
  MultiSelect, 
  Combobox, 
  CommandPalette,
  DropdownOption 
} from '../../../../src/components/SuperDropdown';

// Sample data with all the rich features
const sampleOptions: DropdownOption[] = [
  // Team members with avatars and status
  {
    value: 'john',
    label: 'John Doe',
    description: 'Product Designer',
    avatar: 'https://i.pravatar.cc/150?u=john',
    status: 'online',
    group: 'Design Team',
    tags: ['UI', 'UX'],
    badge: 'Lead',
    command: '⌘J',
  },
  {
    value: 'jane',
    label: 'Jane Smith',
    description: 'Frontend Developer',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    status: 'busy',
    group: 'Engineering',
    tags: ['React', 'TypeScript'],
    badge: 5,
  },
  {
    value: 'bob',
    label: 'Bob Johnson',
    description: 'Backend Developer',
    avatar: 'https://i.pravatar.cc/150?u=bob',
    status: 'away',
    group: 'Engineering',
    tags: ['Node.js', 'Python'],
  },
  {
    value: 'alice',
    label: 'Alice Williams',
    description: 'Product Manager',
    avatar: 'https://i.pravatar.cc/150?u=alice',
    status: 'offline',
    group: 'Product',
    tags: ['Strategy'],
    disabled: true,
  },
  
  // Projects with icons
  {
    value: 'dashboard',
    label: 'Dashboard Redesign',
    description: 'Q1 2024 Priority',
    icon: '📊',
    group: 'Active Projects',
    tags: ['High Priority'],
    color: 'error',
  },
  {
    value: 'mobile',
    label: 'Mobile App',
    description: 'iOS and Android development',
    icon: '📱',
    group: 'Active Projects',
    tags: ['In Progress'],
    color: 'warning',
  },
  {
    value: 'api',
    label: 'API v2.0',
    description: 'REST to GraphQL migration',
    icon: '🔌',
    group: 'Active Projects',
    tags: ['Planning'],
    color: 'info',
  },
  
  // Actions with icons
  {
    value: 'create',
    label: 'Create New Project',
    icon: 'add_circle',
    group: 'Actions',
    command: '⌘N',
  },
  {
    value: 'import',
    label: 'Import from CSV',
    icon: 'upload_file',
    group: 'Actions',
    command: '⌘I',
  },
  {
    value: 'export',
    label: 'Export Data',
    icon: 'download',
    group: 'Actions',
    command: '⌘E',
  },
  
  // Settings
  {
    value: 'preferences',
    label: 'Preferences',
    icon: 'settings',
    group: 'Settings',
    command: '⌘,',
  },
  {
    value: 'notifications',
    label: 'Notifications',
    icon: 'notifications',
    group: 'Settings',
    badge: 12,
  },
  {
    value: 'security',
    label: 'Security',
    icon: 'lock',
    group: 'Settings',
  },
];

// Countries for simple select
const countries: DropdownOption[] = [
  { value: 'us', label: 'United States', icon: '🇺🇸' },
  { value: 'gb', label: 'United Kingdom', icon: '🇬🇧' },
  { value: 'fr', label: 'France', icon: '🇫🇷' },
  { value: 'de', label: 'Germany', icon: '🇩🇪' },
  { value: 'jp', label: 'Japan', icon: '🇯🇵' },
  { value: 'cn', label: 'China', icon: '🇨🇳' },
  { value: 'in', label: 'India', icon: '🇮🇳' },
  { value: 'br', label: 'Brazil', icon: '🇧🇷' },
  { value: 'ca', label: 'Canada', icon: '🇨🇦' },
  { value: 'au', label: 'Australia', icon: '🇦🇺' },
];

// Programming languages for multi-select
const languages: DropdownOption[] = [
  { value: 'js', label: 'JavaScript', icon: '🟨', tags: ['Frontend', 'Backend'] },
  { value: 'ts', label: 'TypeScript', icon: '🔷', tags: ['Frontend', 'Backend'] },
  { value: 'py', label: 'Python', icon: '🐍', tags: ['Backend', 'AI'] },
  { value: 'go', label: 'Go', icon: '🐹', tags: ['Backend'] },
  { value: 'rust', label: 'Rust', icon: '🦀', tags: ['Systems'] },
  { value: 'cpp', label: 'C++', icon: '⚡', tags: ['Systems'] },
  { value: 'java', label: 'Java', icon: '☕', tags: ['Backend'] },
  { value: 'swift', label: 'Swift', icon: '🦉', tags: ['iOS'] },
  { value: 'kotlin', label: 'Kotlin', icon: '🟣', tags: ['Android'] },
  { value: 'ruby', label: 'Ruby', icon: '💎', tags: ['Backend'] },
];

export default function TestSuperDropdownPage() {
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [multiValue, setMultiValue] = useState<any[]>([]);
  const [commandValue, setCommandValue] = useState<any>(null);
  
  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: 'rgb(var(--background))',
      minHeight: '100vh'
    }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '40px' }}>
        🚀 SuperDropdown Showcase
      </h1>
      
      <div style={{ display: 'grid', gap: '48px' }}>
        
        {/* Basic Select */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
            Basic Select with Icons
          </h2>
          <div style={{ maxWidth: '400px', display: 'grid', gap: '16px' }}>
            <Select
              options={countries}
              value={selectedValue}
              onChange={setSelectedValue}
              placeholder="Select a country..."
              showIcons
              size="md"
              clearable
            />
            <p style={{ color: 'rgb(var(--text-secondary))' }}>
              Selected: {selectedValue || 'None'}
            </p>
          </div>
        </div>
        
        {/* Rich Team Member Select */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
            Rich Team Member Select (Everything!)
          </h2>
          <div style={{ maxWidth: '400px', display: 'grid', gap: '16px' }}>
            <SuperDropdown
              options={sampleOptions}
              placeholder="Assign to team member..."
              showAvatars
              showDescriptions
              showStatus
              showTags
              showBadges
              grouped
              searchable
              fuzzySearch
              clearable
              size="lg"
              animation="spring"
              variant="outlined"
            />
            <p style={{ fontSize: '14px', color: 'rgb(var(--text-secondary))' }}>
              Features: Avatars, Status, Tags, Badges, Groups, Search, Descriptions
            </p>
          </div>
        </div>
        
        {/* Multi-Select with Tags */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
            Multi-Select Languages
          </h2>
          <div style={{ maxWidth: '400px', display: 'grid', gap: '16px' }}>
            <MultiSelect
              options={languages}
              value={multiValue}
              onChange={setMultiValue}
              placeholder="Select languages..."
              showIcons
              showTags
              searchable
              size="md"
              variant="filled"
              color="secondary"
            />
            <p style={{ color: 'rgb(var(--text-secondary))' }}>
              Selected: {multiValue.join(', ') || 'None'}
            </p>
          </div>
        </div>
        
        {/* Command Palette Style */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
            Command Palette (⌘K Style)
          </h2>
          <div style={{ maxWidth: '500px', display: 'grid', gap: '16px' }}>
            <CommandPalette
              options={sampleOptions}
              value={commandValue}
              onChange={setCommandValue}
              placeholder="Type a command or search..."
              showIcons
              showDescriptions
              grouped
              size="lg"
              variant="glass"
              animation="morph"
            />
            <p style={{ fontSize: '14px', color: 'rgb(var(--text-secondary))' }}>
              Try fuzzy search: Type "jd" to find "John Doe", or "api" for API project
            </p>
          </div>
        </div>
        
        {/* Combobox with Create */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
            Combobox with Create Option
          </h2>
          <div style={{ maxWidth: '400px', display: 'grid', gap: '16px' }}>
            <Combobox
              options={[
                { value: 'react', label: 'React' },
                { value: 'vue', label: 'Vue' },
                { value: 'angular', label: 'Angular' },
                { value: 'svelte', label: 'Svelte' },
              ]}
              placeholder="Select or create framework..."
              createOption={(value) => ({ value, label: value })}
              onCreate={(value) => console.log('Creating:', value)}
              size="md"
            />
            <p style={{ fontSize: '14px', color: 'rgb(var(--text-secondary))' }}>
              Type something new and hit enter to create it!
            </p>
          </div>
        </div>
        
        {/* Different Animations */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
            Animation Showcase
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {(['fade', 'slide', 'scale', 'spring', 'morph'] as const).map(anim => (
              <div key={anim}>
                <label style={{ 
                  fontSize: '12px', 
                  textTransform: 'uppercase',
                  color: 'rgb(var(--text-secondary))',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  {anim}
                </label>
                <Select
                  options={countries.slice(0, 3)}
                  placeholder={`${anim} animation...`}
                  animation={anim}
                  showIcons
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Different Variants */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
            Style Variants
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {(['default', 'outlined', 'filled', 'ghost', 'glass'] as const).map(variant => (
              <div key={variant}>
                <label style={{ 
                  fontSize: '12px', 
                  textTransform: 'uppercase',
                  color: 'rgb(var(--text-secondary))',
                  marginBottom: '8px',
                  display: 'block'
                }}>
                  {variant}
                </label>
                <Select
                  options={countries.slice(0, 3)}
                  placeholder={`${variant} style...`}
                  variant={variant}
                  showIcons
                  size="md"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Different Sizes */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
            Size Options
          </h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
              <Select
                key={size}
                options={countries.slice(0, 3)}
                placeholder={`Size ${size}`}
                size={size}
                showIcons
              />
            ))}
          </div>
        </div>
        
        {/* Feature Matrix */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
            🎯 Feature Highlights
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            padding: '24px',
            backgroundColor: 'rgb(var(--surface))',
            borderRadius: 'var(--radius-lg)',
          }}>
            {[
              { icon: '🔍', title: 'Fuzzy Search', desc: 'Type "jd" to find "John Doe"' },
              { icon: '👥', title: 'Avatars & Status', desc: 'Show user presence indicators' },
              { icon: '🏷️', title: 'Tags & Badges', desc: 'Rich metadata display' },
              { icon: '📁', title: 'Grouped Options', desc: 'Organize by categories' },
              { icon: '⌨️', title: 'Keyboard Nav', desc: 'Full keyboard support' },
              { icon: '✨', title: 'Animations', desc: '5 beautiful animations' },
              { icon: '🎨', title: 'Variants', desc: '5 style variants' },
              { icon: '📏', title: 'Sizes', desc: 'XS to XL sizing' },
              { icon: '➕', title: 'Create Options', desc: 'Add new items on the fly' },
              { icon: '☑️', title: 'Multi-Select', desc: 'Select multiple with checkboxes' },
              { icon: '🚀', title: 'Performance', desc: 'Virtual scroll ready' },
              { icon: '🎯', title: 'Command Palette', desc: 'Spotlight-like interface' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ fontSize: '24px' }}>{icon}</div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{title}</div>
                  <div style={{ fontSize: '14px', color: 'rgb(var(--text-secondary))' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}