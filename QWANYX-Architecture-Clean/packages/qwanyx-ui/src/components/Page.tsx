import React from 'react'
import { SimpleNavbar } from './Navbar'
import { Footer } from './Footer'
import './Page.css'

export interface NavigationItem {
  label: string
  href?: string
  active?: boolean
  onClick?: () => void
}

export interface PageProps {
  children: React.ReactNode
  
  // Navigation Props
  navigation?: {
    title?: string
    subtitle?: string
    logo?: React.ReactNode
    items?: NavigationItem[]
    actions?: React.ReactNode
    fixed?: boolean
    sticky?: boolean
  }
  
  // Footer Props
  footer?: {
    show?: boolean
    content?: React.ReactNode
  }
  
  // SEO Props
  title?: string
  description?: string
  keywords?: string
  author?: string
  ogImage?: string
  
  // Style Props
  className?: string
  backgroundColor?: string
  backgroundImage?: string
  backgroundGradient?: string
  minHeight?: string
  
  // Layout Props
  fullWidth?: boolean
  noPadding?: boolean
  centered?: boolean
}

export const Page: React.FC<PageProps> = ({
  children,
  navigation,
  footer = { show: true },
  className = '',
  backgroundColor,
  backgroundImage,
  backgroundGradient,
  minHeight = '100vh',
  fullWidth = false,
  noPadding = false,
  centered = false
}) => {
  // Build style object for main content area
  const contentStyle: React.CSSProperties = {
    minHeight: navigation || footer?.show ? `calc(${minHeight} - var(--navbar-height, 64px) - var(--footer-height, 200px))` : minHeight,
    ...(backgroundColor && { backgroundColor }),
    ...(backgroundImage && { 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }),
    ...(backgroundGradient && { background: backgroundGradient })
  }

  // Build class names
  const pageClasses = [
    'qwanyx-page',
    fullWidth && 'qwanyx-page--full-width',
    noPadding && 'qwanyx-page--no-padding',
    centered && 'qwanyx-page--centered',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className="qwanyx-page-wrapper">
      {/* Automatic Navigation */}
      {navigation && (
        <SimpleNavbar
          title={navigation.title}
          subtitle={navigation.subtitle}
          logo={navigation.logo}
          items={navigation.items}
          actions={navigation.actions}
          fixed={navigation.fixed}
          sticky={navigation.sticky ?? true}
        />
      )}
      
      {/* Main Content */}
      <div className={pageClasses} style={contentStyle}>
        {children}
      </div>
      
      {/* Automatic Footer */}
      {footer?.show && (
        footer.content || <Footer />
      )}
    </div>
  )
}

// Page Header Section
export interface PageHeaderProps {
  children: React.ReactNode
  sticky?: boolean
  transparent?: boolean
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  children,
  sticky = false,
  transparent = false,
  className = ''
}) => {
  const headerClasses = [
    'qwanyx-page__header',
    sticky && 'qwanyx-page__header--sticky',
    transparent && 'qwanyx-page__header--transparent',
    className
  ].filter(Boolean).join(' ')

  return (
    <header className={headerClasses}>
      {children}
    </header>
  )
}

// Page Content Section
export interface PageContentProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: boolean
}

export const PageContent: React.FC<PageContentProps> = ({
  children,
  className = '',
  maxWidth = 'xl',
  padding = true
}) => {
  const contentClasses = [
    'qwanyx-page__content',
    `qwanyx-page__content--${maxWidth}`,
    padding && 'qwanyx-page__content--padded',
    className
  ].filter(Boolean).join(' ')

  return (
    <main className={contentClasses}>
      {children}
    </main>
  )
}

// Page Footer Section
export interface PageFooterProps {
  children: React.ReactNode
  className?: string
  sticky?: boolean
}

export const PageFooter: React.FC<PageFooterProps> = ({
  children,
  className = '',
  sticky = false
}) => {
  const footerClasses = [
    'qwanyx-page__footer',
    sticky && 'qwanyx-page__footer--sticky',
    className
  ].filter(Boolean).join(' ')

  return (
    <footer className={footerClasses}>
      {children}
    </footer>
  )
}

// Page Section - Generic section wrapper
export interface PageSectionProps {
  children: React.ReactNode
  className?: string
  backgroundColor?: string
  backgroundImage?: string
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  id?: string
  style?: React.CSSProperties
}

export const PageSection: React.FC<PageSectionProps> = ({
  children,
  className = '',
  backgroundColor,
  backgroundImage,
  spacing = 'md',
  id,
  style
}) => {
  const sectionStyle: React.CSSProperties = {
    ...(backgroundColor && { backgroundColor }),
    ...(backgroundImage && { 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }),
    ...style
  }

  const sectionClasses = [
    'qwanyx-page__section',
    `qwanyx-page__section--spacing-${spacing}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <section id={id} className={sectionClasses} style={sectionStyle}>
      {children}
    </section>
  )
}