import React, { useState } from 'react';
import { useThemeMode } from '../hooks/useThemeMode';
import { Button } from './Button';

export interface ThemeToggleProps {
  showLabel?: boolean;
  variant?: 'icon' | 'dropdown' | 'switch';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showLabel = false,
  variant = 'icon',
  className = ''
}) => {
  const { mode, setMode } = useThemeMode();
  const [isOpen, setIsOpen] = useState(false);

  const icons = {
    light: '☀️',
    dark: '🌙',
    system: '💻'
  };

  const labels = {
    light: 'Clair',
    dark: 'Sombre',
    system: 'Système'
  };

  if (variant === 'icon') {
    // Simple toggle between light/dark/system
    const handleClick = () => {
      const nextMode = mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
      setMode(nextMode);
    };

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className={`theme-toggle theme-toggle--icon ${className}`}
        title={`Mode: ${labels[mode]}`}
      >
        <span className="theme-toggle__icon">{icons[mode]}</span>
        {showLabel && <span className="theme-toggle__label">{labels[mode]}</span>}
      </Button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`theme-toggle theme-toggle--dropdown ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="theme-toggle__trigger"
        >
          <span className="theme-toggle__icon">{icons[mode]}</span>
          {showLabel && <span className="theme-toggle__label">{labels[mode]}</span>}
          <span className="theme-toggle__arrow">▼</span>
        </Button>
        
        {isOpen && (
          <div className="theme-toggle__menu">
            {(['light', 'dark', 'system'] as const).map((option) => (
              <button
                key={option}
                className={`theme-toggle__option ${mode === option ? 'active' : ''}`}
                onClick={() => {
                  setMode(option);
                  setIsOpen(false);
                }}
              >
                <span className="theme-toggle__option-icon">{icons[option]}</span>
                <span className="theme-toggle__option-label">{labels[option]}</span>
                {mode === option && <span className="theme-toggle__check">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Switch variant (for settings page)
  return (
    <div className={`theme-toggle theme-toggle--switch ${className}`}>
      <div className="theme-toggle__options">
        {(['light', 'dark', 'system'] as const).map((option) => (
          <button
            key={option}
            className={`theme-toggle__switch-option ${mode === option ? 'active' : ''}`}
            onClick={() => setMode(option)}
            title={labels[option]}
          >
            <span className="theme-toggle__switch-icon">{icons[option]}</span>
            {showLabel && <span className="theme-toggle__switch-label">{labels[option]}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;