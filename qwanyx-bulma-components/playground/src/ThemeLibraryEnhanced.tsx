import React, { useState, useEffect } from 'react';
import {
  Title,
  Subtitle,
  Box,
  Button,
  Columns,
  Column,
  Card,
  CardContent,
  CardFooter,
  CardFooterItem,
  Tags,
  Tag,
  Notification,
  Section,
  Field,
  Control,
  Input,
  Modal,
  ModalBackground,
  ModalCard,
  ModalCardHead,
  ModalCardTitle,
  ModalCardBody,
  ModalCardFoot,
  Tabs,
  Tab
} from '@qwanyx/bulma-components';
import { themes, applyTheme, generateThemeCSS, Theme } from '../../src/themes/themeLibrary';

interface CustomTheme extends Theme {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface ThemeLibraryEnhancedProps {
  onThemeSelect?: (name: string, id?: string) => void;
}

export const ThemeLibraryEnhanced: React.FC<ThemeLibraryEnhancedProps> = ({ onThemeSelect }) => {
  const [selectedLightTheme, setSelectedLightTheme] = useState<string>('qwanyxLight');
  const [selectedDarkTheme, setSelectedDarkTheme] = useState<string>('qwanyxDark');
  const [currentMode, setCurrentMode] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'prebuilt' | 'custom'>('prebuilt');
  
  // Custom themes state
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>(() => {
    const saved = localStorage.getItem('qwanyx-custom-themes-library');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Modal states
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [themeName, setThemeName] = useState('');
  const [themeDescription, setThemeDescription] = useState('');
  const [editingTheme, setEditingTheme] = useState<CustomTheme | null>(null);
  
  // Load current theme from Theme Editor
  const getCurrentTheme = () => {
    const saved = localStorage.getItem('qwanyx-current-theme');
    return saved ? JSON.parse(saved) : null;
  };

  // Save custom themes to localStorage
  useEffect(() => {
    localStorage.setItem('qwanyx-custom-themes-library', JSON.stringify(customThemes));
  }, [customThemes]);

  // Apply theme when selection changes
  useEffect(() => {
    const themeKey = currentMode === 'dark' ? selectedDarkTheme : selectedLightTheme;
    const theme = themes[themeKey as keyof typeof themes];
    if (theme) {
      applyTheme(theme);
    }
  }, [selectedLightTheme, selectedDarkTheme, currentMode]);

  // Listen for system theme changes
  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setCurrentMode(e.matches ? 'dark' : 'light');
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setCurrentMode(mediaQuery.matches ? 'dark' : 'light');
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // CRUD Operations
  const saveCurrentTheme = () => {
    const currentTheme = getCurrentTheme();
    if (!currentTheme || !themeName.trim()) return;

    const newTheme: CustomTheme = {
      id: Date.now().toString(),
      name: themeName,
      description: themeDescription || `Custom theme created on ${new Date().toLocaleDateString()}`,
      colors: currentTheme,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCustomThemes([...customThemes, newTheme]);
    setShowSaveModal(false);
    setThemeName('');
    setThemeDescription('');
  };

  const updateTheme = (id: string) => {
    if (!editingTheme) return;
    
    setCustomThemes(customThemes.map(theme => 
      theme.id === id 
        ? { ...editingTheme, updatedAt: new Date().toISOString() }
        : theme
    ));
    setShowEditModal(false);
    setEditingTheme(null);
  };

  const deleteTheme = (id: string) => {
    if (confirm('Are you sure you want to delete this theme?')) {
      setCustomThemes(customThemes.filter(theme => theme.id !== id));
    }
  };

  const applyCustomTheme = (theme: CustomTheme) => {
    applyTheme(theme);
    // Also save to current theme
    localStorage.setItem('qwanyx-current-theme', JSON.stringify(theme.colors));
    // Notify parent component
    if (onThemeSelect) {
      onThemeSelect(theme.name, theme.id);
    }
  };

  const exportTheme = (theme: CustomTheme) => {
    const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.name.replace(/\s+/g, '-').toLowerCase()}-theme.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          const imported: CustomTheme = {
            id: Date.now().toString(),
            name: data.name || 'Imported Theme',
            description: data.description || 'Imported theme',
            colors: data.colors,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setCustomThemes([...customThemes, imported]);
        } catch (error) {
          console.error('Failed to import theme:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleThemeSelect = (themeName: string, isDark: boolean, displayName?: string) => {
    if (isDark) {
      setSelectedDarkTheme(themeName);
      setCurrentMode('dark');
    } else {
      setSelectedLightTheme(themeName);
      setCurrentMode('light');
    }
    // Notify parent for pre-built themes
    if (onThemeSelect && displayName) {
      onThemeSelect(displayName);
    }
  };

  const ThemeCard = ({ theme, isSelected, onSelect }: { 
    theme: Theme | CustomTheme; 
    isSelected: boolean; 
    onSelect: () => void 
  }) => {
    const isCustom = 'id' in theme;
    
    return (
      <Card style={{ 
        backgroundColor: theme.colors['scheme-main'] || '#ffffff',
        color: theme.colors.text || '#000000',
        border: isSelected ? '2px solid var(--bulma-primary)' : '1px solid rgba(0,0,0,0.1)'
      }}>
        <CardContent>
          <Title size={5} style={{ color: theme.colors.text || '#000000' }}>{theme.name}</Title>
          <p className="mb-3" style={{ color: theme.colors.text || '#000000' }}>{theme.description}</p>
          
          {isCustom && (
            <Tags className="mb-2">
              <Tag color="info">Custom</Tag>
              <Tag>Created: {new Date((theme as CustomTheme).createdAt).toLocaleDateString()}</Tag>
            </Tags>
          )}
          
          {/* Color preview - Always show theme's actual colors */}
          <div className="mb-3">
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <div 
                style={{ 
                  width: '30px', 
                  height: '30px', 
                  backgroundColor: theme.colors.primary,
                  border: '1px solid rgba(0,0,0,0.2)',
                  borderRadius: '4px'
                }} 
                title="Primary"
              />
              <div 
                style={{ 
                  width: '30px', 
                  height: '30px', 
                  backgroundColor: theme.colors['scheme-main'],
                  border: '1px solid rgba(0,0,0,0.2)',
                  borderRadius: '4px'
                }} 
                title="Background"
              />
              <div 
                style={{ 
                  width: '30px', 
                  height: '30px', 
                  backgroundColor: theme.colors.text,
                  border: '1px solid rgba(0,0,0,0.2)',
                  borderRadius: '4px'
                }} 
                title="Text"
              />
              <div 
                style={{ 
                  width: '30px', 
                  height: '30px', 
                  backgroundColor: theme.colors.link,
                  border: '1px solid rgba(0,0,0,0.2)',
                  borderRadius: '4px'
                }} 
                title="Link"
              />
            </div>
          </div>

          {isSelected && (
            <Tag color="success">Currently Active</Tag>
          )}
        </CardContent>
        <CardFooter>
          <CardFooterItem>
            <Button 
              color={isSelected ? 'success' : 'primary'} 
              onClick={onSelect}
              fullwidth
            >
              {isSelected ? '✓ Selected' : 'Apply Theme'}
            </Button>
          </CardFooterItem>
          {isCustom && (
            <>
              <CardFooterItem>
                <Button 
                  onClick={() => {
                    setEditingTheme(theme as CustomTheme);
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </Button>
              </CardFooterItem>
              <CardFooterItem>
                <Button 
                  color="danger" 
                  onClick={() => deleteTheme((theme as CustomTheme).id)}
                >
                  Delete
                </Button>
              </CardFooterItem>
              <CardFooterItem>
                <Button 
                  onClick={() => exportTheme(theme as CustomTheme)}
                >
                  Export
                </Button>
              </CardFooterItem>
            </>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div>
      <Box>
        <Title size={3}>🎨 Enhanced Theme Library</Title>
        <Subtitle>Pre-built and custom themes with full management</Subtitle>
        
        <div className="buttons mb-4">
          <Button 
            color={currentMode === 'light' ? 'primary' : undefined}
            onClick={() => setCurrentMode('light')}
          >
            ☀️ Light Mode
          </Button>
          <Button 
            color={currentMode === 'dark' ? 'primary' : undefined}
            onClick={() => setCurrentMode('dark')}
          >
            🌙 Dark Mode
          </Button>
          <Button 
            color="success" 
            onClick={() => setShowSaveModal(true)}
          >
            💾 Save Current Theme
          </Button>
          <div className="file is-primary">
            <label className="file-label">
              <input
                className="file-input"
                type="file"
                accept=".json"
                onChange={importTheme}
              />
              <span className="file-cta">
                <span className="file-label">📤 Import Theme</span>
              </span>
            </label>
          </div>
        </div>

        <Notification color="info" light>
          <strong>Tip:</strong> Edit colors in the Theme Editor tab, then come here to save your custom theme with a name!
        </Notification>
      </Box>

      {/* Tabs for Pre-built vs Custom */}
      <Tabs size="medium" boxed>
        <Tab isActive={activeTab === 'prebuilt'} onClick={() => setActiveTab('prebuilt')}>
          <a>Pre-built Themes ({Object.keys(themes).length})</a>
        </Tab>
        <Tab isActive={activeTab === 'custom'} onClick={() => setActiveTab('custom')}>
          <a>Custom Themes ({customThemes.length})</a>
        </Tab>
      </Tabs>

      {activeTab === 'prebuilt' ? (
        <>
          {/* Pre-built themes sections */}
          <Section>
            <Title size={4}>QWANYX - Minimalist Black & White</Title>
            <Columns>
              <Column size="half">
                <ThemeCard 
                  theme={themes.qwanyxLight}
                  isSelected={currentMode === 'light' && selectedLightTheme === 'qwanyxLight'}
                  onSelect={() => handleThemeSelect('qwanyxLight', false, 'QWANYX Light')}
                />
              </Column>
              <Column size="half">
                <ThemeCard 
                  theme={themes.qwanyxDark}
                  isSelected={currentMode === 'dark' && selectedDarkTheme === 'qwanyxDark'}
                  onSelect={() => handleThemeSelect('qwanyxDark', true, 'QWANYX Dark')}
                />
              </Column>
            </Columns>
          </Section>

          {/* Autodin Themes */}
          <Section>
            <Title size={4}>Autodin - Orange & Black</Title>
            <Columns>
              <Column size="half">
                <ThemeCard 
                  theme={themes.autodinLight}
                  isSelected={currentMode === 'light' && selectedLightTheme === 'autodinLight'}
                  onSelect={() => handleThemeSelect('autodinLight', false, 'Autodin Light')}
                />
              </Column>
              <Column size="half">
                <ThemeCard 
                  theme={themes.autodinDark}
                  isSelected={currentMode === 'dark' && selectedDarkTheme === 'autodinDark'}
                  onSelect={() => handleThemeSelect('autodinDark', true, 'Autodin Dark')}
                />
              </Column>
            </Columns>
          </Section>

          {/* Belgicomics Themes */}
          <Section>
            <Title size={4}>Belgicomics - Modern Grey</Title>
            <Columns>
              <Column size="half">
                <ThemeCard 
                  theme={themes.belgicomicsLight}
                  isSelected={currentMode === 'light' && selectedLightTheme === 'belgicomicsLight'}
                  onSelect={() => handleThemeSelect('belgicomicsLight', false, 'Belgicomics Light')}
                />
              </Column>
              <Column size="half">
                <ThemeCard 
                  theme={themes.belgicomicsDark}
                  isSelected={currentMode === 'dark' && selectedDarkTheme === 'belgicomicsDark'}
                  onSelect={() => handleThemeSelect('belgicomicsDark', true, 'Belgicomics Dark')}
                />
              </Column>
            </Columns>
          </Section>

          {/* Personal-CASH Themes */}
          <Section>
            <Title size={4}>Personal-CASH - Professional Green</Title>
            <Columns>
              <Column size="half">
                <ThemeCard 
                  theme={themes.personalCashLight}
                  isSelected={currentMode === 'light' && selectedLightTheme === 'personalCashLight'}
                  onSelect={() => handleThemeSelect('personalCashLight', false, 'Personal-CASH Light')}
                />
              </Column>
              <Column size="half">
                <ThemeCard 
                  theme={themes.personalCashDark}
                  isSelected={currentMode === 'dark' && selectedDarkTheme === 'personalCashDark'}
                  onSelect={() => handleThemeSelect('personalCashDark', true, 'Personal-CASH Dark')}
                />
              </Column>
            </Columns>
          </Section>

          {/* Digital Human Themes */}
          <Section>
            <Title size={4}>Digital Human - Futuristic Cyan</Title>
            <Columns>
              <Column size="half">
                <ThemeCard 
                  theme={themes.digitalHumanLight}
                  isSelected={currentMode === 'light' && selectedLightTheme === 'digitalHumanLight'}
                  onSelect={() => handleThemeSelect('digitalHumanLight', false, 'Digital Human Light')}
                />
              </Column>
              <Column size="half">
                <ThemeCard 
                  theme={themes.digitalHumanDark}
                  isSelected={currentMode === 'dark' && selectedDarkTheme === 'digitalHumanDark'}
                  onSelect={() => handleThemeSelect('digitalHumanDark', true, 'Digital Human Dark')}
                />
              </Column>
            </Columns>
          </Section>
        </>
      ) : (
        <Section>
          <Title size={4}>Your Custom Themes</Title>
          {customThemes.length === 0 ? (
            <Notification>
              No custom themes yet. Edit colors in the Theme Editor and save them here!
            </Notification>
          ) : (
            <Columns multiline>
              {customThemes.map(theme => (
                <Column key={theme.id} size="one-third">
                  <ThemeCard 
                    theme={theme}
                    isSelected={false}
                    onSelect={() => applyCustomTheme(theme)}
                  />
                </Column>
              ))}
            </Columns>
          )}
        </Section>
      )}

      {/* Save Theme Modal */}
      <Modal isActive={showSaveModal}>
        <ModalBackground onClick={() => setShowSaveModal(false)} />
        <ModalCard>
          <ModalCardHead>
            <ModalCardTitle>Save Current Theme</ModalCardTitle>
            <button className="delete" onClick={() => setShowSaveModal(false)}></button>
          </ModalCardHead>
          <ModalCardBody>
            <Field>
              <label className="label">Theme Name</label>
              <Control>
                <Input 
                  placeholder="e.g., My Cool Theme"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                />
              </Control>
            </Field>
            <Field>
              <label className="label">Description (optional)</label>
              <Control>
                <Input 
                  placeholder="e.g., Dark theme with cyan accents"
                  value={themeDescription}
                  onChange={(e) => setThemeDescription(e.target.value)}
                />
              </Control>
            </Field>
          </ModalCardBody>
          <ModalCardFoot>
            <Button color="success" onClick={saveCurrentTheme}>Save Theme</Button>
            <Button onClick={() => setShowSaveModal(false)}>Cancel</Button>
          </ModalCardFoot>
        </ModalCard>
      </Modal>

      {/* Edit Theme Modal */}
      <Modal isActive={showEditModal}>
        <ModalBackground onClick={() => setShowEditModal(false)} />
        <ModalCard>
          <ModalCardHead>
            <ModalCardTitle>Edit Theme</ModalCardTitle>
            <button className="delete" onClick={() => setShowEditModal(false)}></button>
          </ModalCardHead>
          <ModalCardBody>
            <Field>
              <label className="label">Theme Name</label>
              <Control>
                <Input 
                  value={editingTheme?.name || ''}
                  onChange={(e) => setEditingTheme(editingTheme ? {...editingTheme, name: e.target.value} : null)}
                />
              </Control>
            </Field>
            <Field>
              <label className="label">Description</label>
              <Control>
                <Input 
                  value={editingTheme?.description || ''}
                  onChange={(e) => setEditingTheme(editingTheme ? {...editingTheme, description: e.target.value} : null)}
                />
              </Control>
            </Field>
          </ModalCardBody>
          <ModalCardFoot>
            <Button color="success" onClick={() => editingTheme && updateTheme(editingTheme.id)}>
              Update Theme
            </Button>
            <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
          </ModalCardFoot>
        </ModalCard>
      </Modal>
    </div>
  );
};