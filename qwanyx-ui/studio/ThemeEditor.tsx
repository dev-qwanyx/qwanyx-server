import React, { useState, useEffect } from 'react';
import { useTheme } from '../src/providers/ThemeProvider';
import {
  Container,
  Section,
  Grid,
  Flex,
  Heading,
  Text,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
} from '../src';

export const ThemeEditor: React.FC = () => {
  const { theme, setTheme, themes, addTheme, removeTheme } = useTheme();
  const [editingTheme, setEditingTheme] = useState(theme);
  const [themeName, setThemeName] = useState(theme.name);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  
  // Update editing theme when global theme changes
  useEffect(() => {
    setEditingTheme(theme);
    setThemeName(theme.name);
  }, [theme]);
  
  const handleColorChange = (key: keyof typeof theme.colors, value: string) => {
    const updatedTheme = {
      ...editingTheme,
      colors: {
        ...editingTheme.colors,
        [key]: value
      }
    };
    setEditingTheme(updatedTheme);
    setTheme(updatedTheme); // Apply changes immediately
  };
  
  const handleSaveTheme = () => {
    const themeToSave = {
      ...editingTheme,
      name: themeName
    };
    
    // Check if theme with this name already exists
    const existingIndex = themes.findIndex(t => t.name === themeName);
    if (existingIndex === -1) {
      addTheme(themeToSave);
    } else {
      // Update existing theme
      const updatedThemes = [...themes];
      updatedThemes[existingIndex] = themeToSave;
      // Since we don't have an updateTheme method, we'll just use setTheme
      setTheme(themeToSave);
    }
    
    alert(`Theme "${themeName}" saved successfully!`);
  };
  
  const handleLoadTheme = (selectedTheme: typeof theme) => {
    setTheme(selectedTheme);
    setEditingTheme(selectedTheme);
    setThemeName(selectedTheme.name);
    setSelectedPreset(selectedTheme.name);
  };
  
  const handleDeleteTheme = (themeName: string) => {
    if (confirm(`Are you sure you want to delete "${themeName}"?`)) {
      removeTheme(themeName);
    }
  };
  
  // Color input component
  const ColorInput: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
  }> = ({ label, value, onChange }) => {
    return (
      <div className="qwanyx-space-y-2">
        <Text size="sm" weight="medium">{label}</Text>
        <Flex gap="sm" align="center">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="qwanyx-w-12 qwanyx-h-12 qwanyx-rounded qwanyx-border qwanyx-cursor-pointer"
          />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            inputSize="sm"
            className="qwanyx-font-mono"
            placeholder="#000000"
          />
        </Flex>
      </div>
    );
  };
  
  return (
    <Container>
      <Section spacing="xl">
        <Heading as="h2" className="qwanyx-mb-8">Theme Editor</Heading>
        
        <Grid cols={3} gap="lg">
          {/* Theme Presets */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Theme Library</CardTitle>
                <CardDescription>Select a preset or create your own</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="qwanyx-space-y-2">
                  {themes.map((t) => (
                    <Flex key={t.name} justify="between" align="center" className="qwanyx-p-2 qwanyx-rounded qwanyx-hover-bg-foreground-5">
                      <Button
                        variant={selectedPreset === t.name ? 'outline' : 'ghost'}
                        color={selectedPreset === t.name ? 'primary' : undefined}
                        size="sm"
                        fullWidth
                        onClick={() => handleLoadTheme(t)}
                        className="qwanyx-justify-start"
                      >
                        {t.name}
                      </Button>
                      {!['QWANYX Light', 'QWANYX Dark', 'Ocean Blue', 'Forest Green'].includes(t.name) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          color="error"
                          onClick={() => handleDeleteTheme(t.name)}
                        >
                          ×
                        </Button>
                      )}
                    </Flex>
                  ))}
                </div>
                
                <div className="qwanyx-mt-6 qwanyx-pt-6 qwanyx-border-t">
                  <Input
                    placeholder="Theme name"
                    value={themeName}
                    onChange={(e) => setThemeName(e.target.value)}
                    className="qwanyx-mb-3"
                  />
                  <Button
                    fullWidth
                    onClick={handleSaveTheme}
                    disabled={!themeName.trim()}
                  >
                    Save Current Theme
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Color Editor */}
          <div className="qwanyx-lg-col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Color Palette</CardTitle>
                <CardDescription>Customize your theme colors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="qwanyx-space-y-8">
                  {/* Brand Colors */}
                  <div>
                    <Heading as="h4" size="lg" className="qwanyx-mb-4">Brand Colors</Heading>
                    <Grid cols={2} gap="md">
                      <ColorInput
                        label="Primary"
                        value={editingTheme.colors.primary}
                        onChange={(v) => handleColorChange('primary', v)}
                      />
                      <ColorInput
                        label="Secondary"
                        value={editingTheme.colors.secondary}
                        onChange={(v) => handleColorChange('secondary', v)}
                      />
                      <ColorInput
                        label="Accent"
                        value={editingTheme.colors.accent}
                        onChange={(v) => handleColorChange('accent', v)}
                      />
                    </Grid>
                  </div>
                  
                  {/* Semantic Colors */}
                  <div>
                    <Heading as="h4" size="lg" className="qwanyx-mb-4">Semantic Colors</Heading>
                    <Grid cols={2} gap="md">
                      <ColorInput
                        label="Success"
                        value={editingTheme.colors.success}
                        onChange={(v) => handleColorChange('success', v)}
                      />
                      <ColorInput
                        label="Warning"
                        value={editingTheme.colors.warning}
                        onChange={(v) => handleColorChange('warning', v)}
                      />
                      <ColorInput
                        label="Error"
                        value={editingTheme.colors.error}
                        onChange={(v) => handleColorChange('error', v)}
                      />
                      <ColorInput
                        label="Info"
                        value={editingTheme.colors.info}
                        onChange={(v) => handleColorChange('info', v)}
                      />
                    </Grid>
                  </div>
                  
                  {/* Neutral Colors */}
                  <div>
                    <Heading as="h4" size="lg" className="qwanyx-mb-4">Neutral Colors</Heading>
                    <Grid cols={2} gap="md">
                      <ColorInput
                        label="Background"
                        value={editingTheme.colors.background}
                        onChange={(v) => handleColorChange('background', v)}
                      />
                      <ColorInput
                        label="Foreground"
                        value={editingTheme.colors.foreground}
                        onChange={(v) => handleColorChange('foreground', v)}
                      />
                      <ColorInput
                        label="Border"
                        value={editingTheme.colors.border}
                        onChange={(v) => handleColorChange('border', v)}
                      />
                      <ColorInput
                        label="Card"
                        value={editingTheme.colors.card}
                        onChange={(v) => handleColorChange('card', v)}
                      />
                      <ColorInput
                        label="Card Text"
                        value={editingTheme.colors['card-foreground']}
                        onChange={(v) => handleColorChange('card-foreground', v)}
                      />
                      <ColorInput
                        label="Input"
                        value={editingTheme.colors.input}
                        onChange={(v) => handleColorChange('input', v)}
                      />
                      <ColorInput
                        label="Ring"
                        value={editingTheme.colors.ring}
                        onChange={(v) => handleColorChange('ring', v)}
                      />
                    </Grid>
                  </div>
                  
                  {/* Text Colors */}
                  <div>
                    <Heading as="h4" size="lg" className="qwanyx-mb-4">Text Colors</Heading>
                    <Grid cols={2} gap="md">
                      <ColorInput
                        label="Primary Text"
                        value={editingTheme.colors['text-primary']}
                        onChange={(v) => handleColorChange('text-primary', v)}
                      />
                      <ColorInput
                        label="Secondary Text"
                        value={editingTheme.colors['text-secondary']}
                        onChange={(v) => handleColorChange('text-secondary', v)}
                      />
                      <ColorInput
                        label="Muted Text"
                        value={editingTheme.colors['text-muted']}
                        onChange={(v) => handleColorChange('text-muted', v)}
                      />
                    </Grid>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Grid>
        
        {/* Live Preview */}
        <div className="qwanyx-mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>See your theme in action</CardDescription>
            </CardHeader>
            <CardContent>
              <Grid cols={3} gap="lg">
                <Card variant="outlined">
                  <CardContent>
                    <Heading as="h4">Sample Card</Heading>
                    <Text color="secondary" className="qwanyx-mt-2">
                      This is how your cards will look with the current theme.
                    </Text>
                    <Flex gap="sm" className="qwanyx-mt-4">
                      <Button size="sm">Primary</Button>
                      <Button size="sm" variant="outline" color="secondary">Secondary</Button>
                    </Flex>
                  </CardContent>
                </Card>
                
                <Card variant="filled">
                  <CardContent>
                    <div className="qwanyx-space-y-3">
                      <Input placeholder="Sample input field" inputSize="sm" />
                      <Flex gap="sm">
                        <Button size="sm" color="success">Success</Button>
                        <Button size="sm" color="warning">Warning</Button>
                        <Button size="sm" color="error">Error</Button>
                      </Flex>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="qwanyx-space-y-2">
                  <div className="qwanyx-p-3 qwanyx-rounded-md" style={{
                    backgroundColor: `${editingTheme.colors.success}20`,
                    color: editingTheme.colors.success
                  }}>Success message</div>
                  <div className="qwanyx-p-3 qwanyx-rounded-md" style={{
                    backgroundColor: `${editingTheme.colors.warning}20`,
                    color: editingTheme.colors.warning
                  }}>Warning message</div>
                  <div className="qwanyx-p-3 qwanyx-rounded-md" style={{
                    backgroundColor: `${editingTheme.colors.error}20`,
                    color: editingTheme.colors.error
                  }}>Error message</div>
                  <div className="qwanyx-p-3 qwanyx-rounded-md" style={{
                    backgroundColor: `${editingTheme.colors.info}20`,
                    color: editingTheme.colors.info
                  }}>Info message</div>
                </div>
              </Grid>
            </CardContent>
          </Card>
        </div>
      </Section>
    </Container>
  );
};