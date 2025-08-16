import React from 'react'
import { Container, Section, Grid } from '../components/Container'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card'
import { Heading, Text } from '../components/Text'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'

export interface PricingPlan {
  id: string
  name: string
  price: string
  period?: string
  description?: string
  features: string[]
  highlighted?: boolean
  badge?: string
  ctaLabel?: string
  ctaAction?: () => void
}

export interface PricingSectionProps {
  id?: string
  title?: string
  subtitle?: string
  plans: PricingPlan[]
  columns?: 2 | 3 | 4
  backgroundColor?: string
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  id,
  title,
  subtitle,
  plans,
  columns = 3,
  backgroundColor
}) => {
  return (
    <Section 
      id={id} 
      spacing="xl"
      style={{ backgroundColor }}
    >
      <Container>
        {(title || subtitle) && (
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            {title && <Heading size="2xl">{title}</Heading>}
            {subtitle && <Text size="lg" style={{ marginTop: '1rem' }}>{subtitle}</Text>}
          </div>
        )}
        
        <Grid cols={columns} style={{ gap: '2rem' }}>
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={plan.highlighted ? 'qwanyx-card--highlighted' : ''}
              style={plan.highlighted ? {
                borderColor: 'rgb(var(--qwanyx-primary))',
                borderWidth: '2px',
                transform: 'scale(1.05)'
              } : {}}
            >
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <CardTitle>{plan.name}</CardTitle>
                  {plan.badge && (
                    <Badge color="primary" variant="subtle">
                      {plan.badge}
                    </Badge>
                  )}
                </div>
                
                <div style={{ margin: '1rem 0' }}>
                  <Text size="3xl" weight="bold">{plan.price}</Text>
                  {plan.period && (
                    <Text size="sm" style={{ color: '#6b7280' }}>/{plan.period}</Text>
                  )}
                </div>
                
                {plan.description && (
                  <CardDescription>{plan.description}</CardDescription>
                )}
              </CardHeader>
              
              <CardContent>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0,
                  marginBottom: '2rem'
                }}>
                  {plan.features.map((feature, idx) => (
                    <li 
                      key={idx} 
                      style={{ 
                        padding: '0.75rem 0',
                        borderBottom: idx < plan.features.length - 1 ? '1px solid #e5e7eb' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span style={{ color: 'rgb(var(--qwanyx-primary))' }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  fullWidth 
                  variant={plan.highlighted ? 'primary' : 'outline'}
                  onClick={plan.ctaAction}
                >
                  {plan.ctaLabel || 'Get Started'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  )
}