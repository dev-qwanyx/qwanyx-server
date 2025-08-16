import React from 'react'
import { Container, Section, Grid } from '../components/Container'
import { Card, CardContent } from '../components/Card'
import { Heading, Text } from '../components/Text'
import { Avatar } from '../components/Avatar'

export interface Testimonial {
  id: string
  content: string
  author: string
  role?: string
  company?: string
  avatar?: string
  rating?: number
}

export interface TestimonialsSectionProps {
  id?: string
  title?: string
  subtitle?: string
  testimonials: Testimonial[]
  columns?: 1 | 2 | 3
  variant?: 'default' | 'cards' | 'minimal' | 'quotes'
  backgroundColor?: string
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  id,
  title,
  subtitle,
  testimonials,
  columns = 3,
  variant = 'cards',
  backgroundColor
}) => {
  return (
    <Section 
      id={id} 
      spacing="xl"
      style={{ backgroundColor: backgroundColor || '#f8f9fa' }}
    >
      <Container>
        {(title || subtitle) && (
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            {title && <Heading size="2xl">{title}</Heading>}
            {subtitle && <Text size="lg" style={{ marginTop: '1rem' }}>{subtitle}</Text>}
          </div>
        )}
        
        <Grid cols={columns} style={{ gap: '2rem' }}>
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className={variant === 'minimal' ? 'qwanyx-card--borderless' : ''}>
              <CardContent>
                {testimonial.rating && (
                  <div style={{ marginBottom: '1rem' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ color: i < testimonial.rating! ? '#fbbf24' : '#e5e7eb' }}>
                        ★
                      </span>
                    ))}
                  </div>
                )}
                
                {variant === 'quotes' && (
                  <Text size="3xl" style={{ opacity: 0.2, marginBottom: '-0.5rem' }}>"</Text>
                )}
                
                <Text style={{ 
                  marginBottom: '1.5rem',
                  fontStyle: variant === 'quotes' ? 'italic' : 'normal'
                }}>
                  {testimonial.content}
                </Text>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {testimonial.avatar && (
                    <Avatar 
                      src={testimonial.avatar} 
                      alt={testimonial.author}
                      size="md"
                    />
                  )}
                  <div>
                    <Text weight="semibold">{testimonial.author}</Text>
                    {(testimonial.role || testimonial.company) && (
                      <Text size="sm" style={{ color: '#6b7280' }}>
                        {testimonial.role}
                        {testimonial.role && testimonial.company && ' at '}
                        {testimonial.company}
                      </Text>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  )
}