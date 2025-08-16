'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost' | 'link'
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'solid',
  color = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className,
  disabled,
  ...props
}, ref) => {
  
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    solid: {
      primary: 'bg-autodin-primary text-white hover:bg-autodin-accent focus:ring-autodin-primary',
      secondary: 'bg-autodin-secondary text-white hover:bg-gray-700 focus:ring-autodin-secondary',
      accent: 'bg-autodin-accent text-white hover:bg-orange-500 focus:ring-autodin-accent',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-600',
      warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-600',
      error: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600'
    },
    outline: {
      primary: 'border-2 border-autodin-primary text-autodin-primary hover:bg-autodin-primary hover:text-white focus:ring-autodin-primary',
      secondary: 'border-2 border-autodin-secondary text-autodin-secondary hover:bg-autodin-secondary hover:text-white focus:ring-autodin-secondary',
      accent: 'border-2 border-autodin-accent text-autodin-accent hover:bg-autodin-accent hover:text-white focus:ring-autodin-accent',
      success: 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-600',
      warning: 'border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white focus:ring-yellow-600',
      error: 'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-600'
    },
    ghost: {
      primary: 'text-autodin-primary hover:bg-autodin-primary/10 focus:ring-autodin-primary',
      secondary: 'text-autodin-secondary hover:bg-autodin-secondary/10 focus:ring-autodin-secondary',
      accent: 'text-autodin-accent hover:bg-autodin-accent/10 focus:ring-autodin-accent',
      success: 'text-green-600 hover:bg-green-600/10 focus:ring-green-600',
      warning: 'text-yellow-600 hover:bg-yellow-600/10 focus:ring-yellow-600',
      error: 'text-red-600 hover:bg-red-600/10 focus:ring-red-600'
    },
    link: {
      primary: 'text-autodin-primary underline-offset-4 hover:underline focus:ring-autodin-primary',
      secondary: 'text-autodin-secondary underline-offset-4 hover:underline focus:ring-autodin-secondary',
      accent: 'text-autodin-accent underline-offset-4 hover:underline focus:ring-autodin-accent',
      success: 'text-green-600 underline-offset-4 hover:underline focus:ring-green-600',
      warning: 'text-yellow-600 underline-offset-4 hover:underline focus:ring-yellow-600',
      error: 'text-red-600 underline-offset-4 hover:underline focus:ring-red-600'
    }
  }
  
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  }
  
  const variantStyles = variants[variant][color]
  const sizeStyles = sizes[size]
  const widthStyles = fullWidth ? 'w-full' : ''
  
  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variantStyles,
        sizeStyles,
        widthStyles,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && iconPosition === 'left' && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
      {loading && iconPosition === 'right' && (
        <svg className="animate-spin ml-2 -mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
    </button>
  )
})

Button.displayName = 'Button'