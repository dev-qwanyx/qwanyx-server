import React from 'react'
import { Container, Grid } from '../components/Container'
import { Text } from '../components/Text'
import { MaterialIcon } from '../components/MaterialIcon'

export interface SimpleFooterSectionProps {
  logo?: React.ReactNode
  title?: string
  description?: string
  address?: {
    street?: string
    city?: string
    country?: string
  }
  phone?: string
  email?: string
  links?: Array<{
    label: string
    href?: string
    onClick?: () => void
  }>
  socials?: Array<{
    icon: string
    href?: string
    onClick?: () => void
    label?: string
  }>
  copyright?: string
  className?: string
  bgColor?: string // e.g., 'card', 'background', 'primary', or custom color
  textColor?: string // e.g., 'primary', 'secondary', 'muted', or custom color
}

export const SimpleFooterSection: React.FC<SimpleFooterSectionProps> = ({
  logo,
  title,
  description,
  address,
  phone,
  email,
  links = [],
  socials = [],
  copyright,
  className = '',
  bgColor = 'card',
  textColor
}) => {
  // Helper to get the background class or style
  const getBgClass = () => {
    const themeColors = ['card', 'background', 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info']
    if (themeColors.includes(bgColor)) {
      return `qwanyx-bg-${bgColor}`
    }
    return ''
  }

  const bgClass = getBgClass()
  const bgStyle = !bgClass && bgColor ? { backgroundColor: bgColor } : {}

  return (
    <footer 
      className={`${bgClass || ''} qwanyx-border-t qwanyx-mt-20 ${className}`}
      style={{ ...bgStyle, paddingTop: '2rem', paddingBottom: '2rem' }}
    >
      <Container>
        <div>
          <Grid cols={3} gap="xl" responsive>
            {/* Left Column - Logo, Description, Address & Contact */}
            <div className="qwanyx-space-y-4">
              {(logo || title) && (
                <div className="qwanyx-flex qwanyx-items-center qwanyx-gap-3">
                  {logo}
                  {title && (
                    <Text size="lg" color={(textColor || "secondary") as any}>{title}</Text>
                  )}
                </div>
              )}
              {description && (
                <Text size="sm" color={(textColor || "secondary") as any}>
                  {description}
                </Text>
              )}
              {address && (
                <div className="qwanyx-flex qwanyx-items-start qwanyx-gap-2 qwanyx-mt-3">
                  <MaterialIcon icon="Location" size="sm" color={(textColor || "secondary") as any} />
                  <div className="qwanyx-space-y-1">
                    {address.street && <Text size="sm" color={(textColor || "secondary") as any}>{address.street}</Text>}
                    {address.city && <Text size="sm" color={(textColor || "secondary") as any}>{address.city}</Text>}
                    {address.country && <Text size="sm" color={(textColor || "secondary") as any}>{address.country}</Text>}
                  </div>
                </div>
              )}
              {phone && (
                <div className="qwanyx-flex qwanyx-items-center qwanyx-gap-2 qwanyx-mt-2">
                  <MaterialIcon icon="Phone" size="sm" color={(textColor || "secondary") as any} />
                  <Text size="sm" color={(textColor || "secondary") as any}>{phone}</Text>
                </div>
              )}
              {email && (
                <div className="qwanyx-flex qwanyx-items-center qwanyx-gap-2 qwanyx-mt-2">
                  <MaterialIcon icon="Mail" size="sm" color={(textColor || "secondary") as any} />
                  <Text size="sm" color={(textColor || "secondary") as any}>
                    <a 
                      href={`mailto:${email}`}
                      className="qwanyx-text-inherit qwanyx-no-underline qwanyx-hover-text-primary"
                    >
                      {email}
                    </a>
                  </Text>
                </div>
              )}
            </div>

            {/* Middle Column - Empty or other content */}
            <div className="qwanyx-space-y-3">
            </div>

            {/* Right Column - Links */}
            <div className="qwanyx-space-y-4">
              {links.length > 0 && (
                <nav className="qwanyx-space-y-2">
                  {links.map((link, index) => (
                    <div key={index}>
                      <a
                        href={link.href || '#'}
                        onClick={link.onClick}
                        className={`qwanyx-flex qwanyx-items-center qwanyx-gap-2 qwanyx-text-sm ${textColor ? '' : 'qwanyx-text-secondary'} qwanyx-hover-text-primary qwanyx-transition-colors`}
                        style={textColor && !textColor.includes('var(') ? { color: textColor } : {}}
                      >
                        <MaterialIcon icon="ChevronRight" size="xs" color={textColor as any} />
                        {link.label}
                      </a>
                    </div>
                  ))}
                </nav>
              )}
              
              {socials.length > 0 && (
                <div className="qwanyx-flex qwanyx-gap-3 qwanyx-mt-6">
                  {socials.map((social, index) => (
                    <a
                      key={index}
                      href={social.href || '#'}
                      onClick={social.onClick}
                      aria-label={social.label || social.icon}
                      className={`${textColor ? '' : 'qwanyx-text-secondary'} qwanyx-hover-text-primary qwanyx-transition-colors`}
                      style={textColor && !textColor.includes('var(') ? { color: textColor } : {}}
                    >
                      <MaterialIcon icon={social.icon} size="md" color={textColor as any} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </Grid>
        </div>
      </Container>
      
      {/* Copyright - Full Width */}
      {copyright && (
        <div className="qwanyx-mt-12 qwanyx-pt-8 qwanyx-border-t qwanyx-border-border">
          <Container>
            <Text size="xs" color={(textColor || "muted") as any} align="center">
              {copyright}
            </Text>
          </Container>
        </div>
      )}
    </footer>
  )
}