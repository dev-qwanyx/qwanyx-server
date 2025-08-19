/**
 * 🔍 SearchBar Component
 * Search input with icon and optional suggestions
 */

import React, { useState } from 'react';

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'ghost';
  showIcon?: boolean;
  showButton?: boolean;
  buttonText?: string;
  suggestions?: string[];
  autoComplete?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value: controlledValue,
  defaultValue = '',
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  size = 'md',
  variant = 'default',
  showIcon = true,
  showButton = false,
  buttonText = 'Search',
  suggestions = [],
  autoComplete = false,
  className = '',
  style = {}
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
    if (autoComplete && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(value);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (controlledValue === undefined) {
      setInternalValue(suggestion);
    }
    onChange?.(suggestion);
    onSubmit?.(suggestion);
    setShowSuggestions(false);
  };

  const sizeStyles = {
    sm: { height: '32px', fontSize: '0.875rem', padding: '0 0.75rem' },
    md: { height: '40px', fontSize: '1rem', padding: '0 1rem' },
    lg: { height: '48px', fontSize: '1.125rem', padding: '0 1.25rem' }
  };

  const variantStyles = {
    default: {
      backgroundColor: 'rgb(var(--background))',
      border: '1px solid rgb(var(--border))',
      color: 'rgb(var(--foreground))'
    },
    filled: {
      backgroundColor: 'rgb(var(--muted) / 0.1)',
      border: '1px solid transparent',
      color: 'rgb(var(--foreground))'
    },
    ghost: {
      backgroundColor: 'transparent',
      border: '1px solid transparent',
      color: 'rgb(var(--foreground))'
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    width: '100%',
    ...style
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    width: '100%',
    position: 'relative'
  };

  const inputStyle: React.CSSProperties = {
    ...sizeStyles[size],
    ...variantStyles[variant],
    width: '100%',
    borderRadius: 'var(--radius)',
    paddingLeft: showIcon ? '2.5rem' : sizeStyles[size].padding,
    paddingRight: showButton ? '5rem' : sizeStyles[size].padding,
    outline: 'none',
    transition: 'all var(--transition)'
  };

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    opacity: 0.5,
    pointerEvents: 'none'
  };

  const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '4px',
    top: '50%',
    transform: 'translateY(-50%)',
    height: `calc(100% - 8px)`,
    padding: '0 1rem',
    backgroundColor: 'rgb(var(--primary))',
    color: 'rgb(var(--primary-foreground))',
    border: 'none',
    borderRadius: 'calc(var(--radius) - 2px)',
    fontSize: sizeStyles[size].fontSize,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'opacity var(--transition)'
  };

  const suggestionsStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '4px',
    backgroundColor: 'rgb(var(--background))',
    border: '1px solid rgb(var(--border))',
    borderRadius: 'var(--radius)',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 10,
    boxShadow: 'var(--shadow-md)'
  };

  const suggestionItemStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    transition: 'background-color var(--transition)'
  };

  return (
    <div className={`qwanyx-searchbar ${className}`.trim()} style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        {showIcon && (
          <svg 
            style={iconStyle}
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        )}
        
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => {
            onFocus?.();
            if (autoComplete && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            onBlur?.();
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          placeholder={placeholder}
          style={inputStyle}
          className="qwanyx-searchbar__input"
        />

        {showButton && (
          <button 
            type="submit" 
            style={buttonStyle}
            className="qwanyx-searchbar__button"
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            {buttonText}
          </button>
        )}
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div style={suggestionsStyle} className="qwanyx-searchbar__suggestions">
          {suggestions
            .filter(s => s.toLowerCase().includes(value.toLowerCase()))
            .map((suggestion, index) => (
              <div
                key={index}
                style={suggestionItemStyle}
                className="qwanyx-searchbar__suggestion"
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(var(--muted) / 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {suggestion}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};