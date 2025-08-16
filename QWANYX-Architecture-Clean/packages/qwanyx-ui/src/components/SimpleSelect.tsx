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
  ...rest
}) => {
  const selectClass = [
    'qwanyx-select',
    'px-3 py-2',
    'border border-gray-300 rounded',
    'focus:outline-none focus:border-blue-500',
    'transition-colors',
    fullWidth && 'w-full',
    className
  ].filter(Boolean).join(' ')

  return (
    <select className={selectClass} {...rest}>
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