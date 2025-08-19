import React from 'react'

export interface SimpleSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SimpleSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options?: SimpleSelectOption[]
  placeholder?: string
  fullWidth?: boolean
  selectSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const SimpleSelect: React.FC<SimpleSelectProps> = ({
  options = [],
  placeholder,
  fullWidth = false,
  selectSize = 'md',
  className = '',
  style,
  ...rest
}) => {
  // Size-based padding
  const paddingMap = {
    xs: '0.25rem 0.5rem',
    sm: '0.375rem 0.625rem',
    md: '0.5rem 0.75rem',
    lg: '0.625rem 1rem',
    xl: '0.75rem 1.25rem'
  }

  // Size-based font size
  const fontSizeMap = {
    xs: '12px',
    sm: '13px',
    md: '14px',
    lg: '16px',
    xl: '18px'
  }

  const selectStyle: React.CSSProperties = {
    padding: paddingMap[selectSize || 'md'],
    border: '1px solid rgb(var(--qwanyx-border))',
    borderRadius: 'var(--qwanyx-radius)',
    backgroundColor: 'rgb(var(--qwanyx-background))',
    color: 'rgb(var(--qwanyx-foreground))',
    fontSize: fontSizeMap[selectSize || 'md'],
    lineHeight: '1.5',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    width: fullWidth ? '100%' : 'auto',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23000000' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '12px',
    paddingRight: '2.5rem',
    ...style
  }

  // Create a unique class name for this instance
  const uniqueClass = `qwanyx-select-${Math.random().toString(36).substr(2, 9)}`

  React.useEffect(() => {
    // Add styles for options in a style tag
    const styleElement = document.createElement('style')
    styleElement.textContent = `
      .${uniqueClass} option {
        background-color: white !important;
        color: black !important;
        padding: 0.5rem !important;
      }
      .${uniqueClass} option:hover {
        background-color: #f0f0f0 !important;
      }
      .${uniqueClass} option:disabled {
        color: #999 !important;
        cursor: not-allowed !important;
      }
      @media (prefers-color-scheme: dark) {
        .${uniqueClass} option {
          background-color: #1a1a1a !important;
          color: white !important;
        }
        .${uniqueClass} option:hover {
          background-color: #2a2a2a !important;
        }
      }
    `
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [uniqueClass])

  return (
    <select 
      className={`${uniqueClass} ${className}`}
      style={selectStyle}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgb(var(--qwanyx-primary))';
        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(var(--qwanyx-primary-rgb), 0.1)';
        rest.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgb(var(--qwanyx-border))';
        e.currentTarget.style.boxShadow = 'none';
        rest.onBlur?.(e);
      }}
      {...rest}>
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option 
          key={option.value} 
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  )
}