import React from 'react'

export interface SimpleSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SimpleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SimpleSelectOption[]
  placeholder?: string
  fullWidth?: boolean
}

export const SimpleSelect: React.FC<SimpleSelectProps> = ({
  options = [],
  placeholder,
  fullWidth = false,
  className = '',
  style,
  ...rest
}) => {
  const selectStyle: React.CSSProperties = {
    padding: '0.5rem 0.75rem',
    border: '1px solid rgb(var(--border))',
    borderRadius: 'var(--radius)',
    backgroundColor: 'rgb(var(--background))',
    color: 'rgb(var(--foreground))',
    fontSize: '14px',
    lineHeight: '1.5',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    width: fullWidth ? '100%' : 'auto',
    ...style
  }

  return (
    <select 
      className={className}
      style={selectStyle}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgb(var(--primary))';
        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(var(--primary), 0.1)';
        rest.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgb(var(--border))';
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