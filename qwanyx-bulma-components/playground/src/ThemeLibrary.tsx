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
  Select
} from '@qwanyx/bulma-components';
import { themes, applyTheme, generateThemeCSS, exportTheme, Theme } from '../../src/themes/themeLibrary';

export const ThemeLibrary: React.FC = () => {
  const [selectedLightTheme, setSelectedLightTheme] = useState<string>('qwanyxLight');
  const [selectedDarkTheme, setSelectedDarkTheme] = useState<string>('qwanyxDark');
  const [currentMode, setCurrentMode] = useState<'light' | 'dark'>('light');
  const [showExportModal, setShowExportModal] = useState(false);

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

  const handleThemeSelect = (themeName: string, isDark: boolean) => {
    if (isDark) {
      setSelectedDarkTheme(themeName);
      setCurrentMode('dark');
    } else {
      setSelectedLightTheme(themeName);
      setCurrentMode('light');
    }
  };

  const handleExport = () => {
    const lightTheme = themes[selectedLightTheme as keyof typeof themes];
    const darkTheme = themes[selectedDarkTheme as keyof typeof themes];
    
    const config = {
      light: selectedLightTheme,
      dark: selectedDarkTheme,
      themes: {
        light: lightTheme,
        dark: darkTheme
      },
      css: {
        light: generateThemeCSS(lightTheme),
        dark: generateThemeCSS(darkTheme)
      }
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theme-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const ThemeCard = ({ theme, isSelected, onSelect }: { theme: Theme; isSelected: boolean; onSelect: () => void }) => (
    <Card className={isSelected ? 'has-background-light' : ''}>
      <CardContent>
        <Title size={5}>{theme.name}</Title>
        <p className="mb-3">{theme.description}</p>
        
        {/* Color preview */}
        <div className="mb-3">
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <div 
              style={{ 
                width: '30px', 
                height: '30px', 
                backgroundColor: theme.colors.primary,
                border: '1px solid #ddd',
                borderRadius: '4px',
                title: 'Primary'
              }} 
            />
            <div 
              style={{ 
                width: '30px', 
                height: '30px', 
                backgroundColor: theme.colors['scheme-main'],
                border: '1px solid #ddd',
                borderRadius: '4px',
                title: 'Background'
              }} 
            />
            <div 
              style={{ 
                width: '30px', 
                height: '30px', 
                backgroundColor: theme.colors.text,
                border: '1px solid #ddd',
                borderRadius: '4px',
                title: 'Text'
              }} 
            />
            <div 
              style={{ 
                width: '30px', 
                height: '30px', 
                backgroundColor: theme.colors.link,
                border: '1px solid #ddd',
                borderRadius: '4px',
                title: 'Link'
              }} 
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
      </CardFooter>
    </Card>
  );

  return (
    <div>
      <Box>
        <Title size={3}>🎨 Theme Library</Title>
        <Subtitle>Pre-built themes for all QWANYX projects</Subtitle>
        
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
          <Button color="info" onClick={handleExport}>
            📥 Export Selected Themes
          </Button>
        </div>

        <Notification color="info" light>
          <strong>Current Selection:</strong>
          <br />
          Light Theme: <strong>{themes[selectedLightTheme as keyof typeof themes].name}</strong>
          <br />
          Dark Theme: <strong>{themes[selectedDarkTheme as keyof typeof themes].name}</strong>
        </Notification>
      </Box>

      {/* QWANYX Themes */}
      <Section>
        <Title size={4}>QWANYX - Minimalist Black & White</Title>
        <Columns>
          <Column size="half">
            <ThemeCard 
              theme={themes.qwanyxLight}
              isSelected={currentMode === 'light' && selectedLightTheme === 'qwanyxLight'}
              onSelect={() => handleThemeSelect('qwanyxLight', false)}
            />
          </Column>
          <Column size="half">
            <ThemeCard 
              theme={themes.qwanyxDark}
              isSelected={currentMode === 'dark' && selectedDarkTheme === 'qwanyxDark'}
              onSelect={() => handleThemeSelect('qwanyxDark', true)}
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
              onSelect={() => handleThemeSelect('autodinLight', false)}
            />
          </Column>
          <Column size="half">
            <ThemeCard 
              theme={themes.autodinDark}
              isSelected={currentMode === 'dark' && selectedDarkTheme === 'autodinDark'}
              onSelect={() => handleThemeSelect('autodinDark', true)}
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
              onSelect={() => handleThemeSelect('belgicomicsLight', false)}
            />
          </Column>
          <Column size="half">
            <ThemeCard 
              theme={themes.belgicomicsDark}
              isSelected={currentMode === 'dark' && selectedDarkTheme === 'belgicomicsDark'}
              onSelect={() => handleThemeSelect('belgicomicsDark', true)}
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
              onSelect={() => handleThemeSelect('personalCashLight', false)}
            />
          </Column>
          <Column size="half">
            <ThemeCard 
              theme={themes.personalCashDark}
              isSelected={currentMode === 'dark' && selectedDarkTheme === 'personalCashDark'}
              onSelect={() => handleThemeSelect('personalCashDark', true)}
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
              onSelect={() => handleThemeSelect('digitalHumanLight', false)}
            />
          </Column>
          <Column size="half">
            <ThemeCard 
              theme={themes.digitalHumanDark}
              isSelected={currentMode === 'dark' && selectedDarkTheme === 'digitalHumanDark'}
              onSelect={() => handleThemeSelect('digitalHumanDark', true)}
            />
          </Column>
        </Columns>
      </Section>

      {/* Usage Instructions */}
      <Box>
        <Title size={4}>📚 How to Use Themes</Title>
        <Subtitle>Quick implementation guide</Subtitle>
        
        <div className="content">
          <p><strong>1. Select your themes:</strong></p>
          <pre className="has-background-light p-3">
{`// Choose light and dark themes from the library
// For example: QWANYX Light + QWANYX Dark`}
          </pre>

          <p><strong>2. Export the configuration:</strong></p>
          <pre className="has-background-light p-3">
{`// Click "Export Selected Themes" to download config`}
          </pre>

          <p><strong>3. Import in your project:</strong></p>
          <pre className="has-background-light p-3">
{`import { themes, applyTheme } from '@qwanyx/bulma-components';

// Apply based on system preference
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = isDark ? themes.qwanyxDark : themes.qwanyxLight;
applyTheme(theme);`}
          </pre>

          <p><strong>4. Or use the CSS directly:</strong></p>
          <pre className="has-background-light p-3">
{`/* Add to your global CSS */
${generateThemeCSS(themes[selectedLightTheme as keyof typeof themes]).slice(0, 200)}...`}
          </pre>
        </div>
      </Box>
    </div>
  );
};