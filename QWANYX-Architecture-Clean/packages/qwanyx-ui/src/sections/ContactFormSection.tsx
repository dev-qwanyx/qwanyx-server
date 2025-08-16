import React, { useState } from 'react'
import { Input } from '../components/Input'
import { Textarea } from '../components/Input'
import { Button } from '../components/Button'
import { Card, CardContent } from '../components/Card'

export interface ContactFormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select'
  placeholder?: string
  required?: boolean
  options?: string[] // For select type
  rows?: number // For textarea
}

export interface ContactFormSectionProps {
  title?: string
  subtitle?: string
  fields?: ContactFormField[]
  submitText?: string
  onSubmit?: (data: Record<string, string>) => void | Promise<void>
  backgroundImage?: string
  overlayOpacity?: number
  parallax?: 'none' | 'slow' | 'normal' | 'fast' | 'fixed'
  className?: string
}

// Preset field configurations
export const simpleContactFields: ContactFormField[] = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Your name', required: true },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', required: true },
  { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Your message...', rows: 6, required: true }
]

export const detailedContactFields: ContactFormField[] = [
  { name: 'firstname', label: 'First Name', type: 'text', placeholder: 'John', required: true },
  { name: 'lastname', label: 'Last Name', type: 'text', placeholder: 'Doe', required: true },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com', required: true },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
  { name: 'subject', label: 'Subject', type: 'text', placeholder: 'How can we help?', required: true },
  { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Tell us more...', rows: 6, required: true }
]

export const businessContactFields: ContactFormField[] = [
  { name: 'firstname', label: 'First Name', type: 'text', placeholder: 'John', required: true },
  { name: 'lastname', label: 'Last Name', type: 'text', placeholder: 'Doe', required: true },
  { name: 'company', label: 'Company', type: 'text', placeholder: 'Acme Inc.' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'john@company.com', required: true },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000', required: true },
  { name: 'department', label: 'Department', type: 'select', options: ['Sales', 'Support', 'Technical', 'Partnership', 'Other'] },
  { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Tell us about your needs...', rows: 6, required: true }
]

// Default to simple fields
const defaultFields = simpleContactFields

export const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  title = 'Contactez-nous',
  subtitle = 'Pour toute question, suggestion ou reporter une correction',
  fields = defaultFields,
  submitText = 'Envoyer',
  onSubmit,
  backgroundImage,
  overlayOpacity = 0.7,
  parallax = 'none',
  className = ''
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (onSubmit) {
      setIsSubmitting(true)
      try {
        await onSubmit(formData)
        // Reset form on success
        setFormData({})
      } catch (error) {
        console.error('Form submission error:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const renderField = (field: ContactFormField) => {
    const value = formData[field.name] || ''
    
    switch (field.type) {
      case 'textarea':
        return (
          <div className="qwanyx-space-y-2">
            <label className="qwanyx-text-sm qwanyx-font-medium qwanyx-text-secondary">
              {field.label}
            </label>
            <Textarea
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
              rows={field.rows}
              fullWidth
            />
          </div>
        )
      
      case 'select':
        return (
          <div className="qwanyx-space-y-2">
            <label className="qwanyx-text-sm qwanyx-font-medium qwanyx-text-secondary">
              {field.label}
            </label>
            <select
              className="qwanyx-input qwanyx-w-full"
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
            >
              <option value="">{field.placeholder || `Select ${field.label}`}</option>
              {field.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )
      
      default:
        return (
          <div className="qwanyx-space-y-2">
            <label className="qwanyx-text-sm qwanyx-font-medium qwanyx-text-secondary">
              {field.label}
            </label>
            <Input
              type={field.type}
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              required={field.required}
              fullWidth
            />
          </div>
        )
    }
  }

  // Simple section with optional background
  return (
    <section 
      className={`qwanyx-relative qwanyx-overflow-hidden qwanyx-flex qwanyx-items-center qwanyx-justify-center ${className}`}
      style={{
        paddingTop: '2rem', 
        paddingBottom: '3.4rem',
        ...(backgroundImage ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: parallax === 'fixed' ? 'fixed' : 'scroll'
        } : {})
      }}
    >
      {/* Overlay */}
      {backgroundImage && (
        <div 
          className="qwanyx-absolute qwanyx-inset-0 qwanyx-bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      
      {/* Content */}
      <div style={{ 
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '750px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
          {/* Header */}
          <div className="qwanyx-text-center qwanyx-mb-8">
            {title && (
              <h2 className={`qwanyx-text-4xl qwanyx-font-bold qwanyx-mb-4 ${
                backgroundImage ? 'qwanyx-text-white' : 'qwanyx-text-text-primary'
              }`} style={{ 
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: backgroundImage ? 'white' : 'var(--qwanyx-text-primary)'
              }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`qwanyx-text-lg ${
                backgroundImage ? 'qwanyx-text-gray-200' : 'qwanyx-text-text-secondary'
              }`} style={{
                fontSize: '1.125rem',
                color: backgroundImage ? '#e5e7eb' : 'var(--qwanyx-text-secondary)',
                marginBottom: '2rem'
              }}>
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Form Card */}
          <Card className="qwanyx-shadow-2xl">
            <CardContent>
              <form onSubmit={handleSubmit} className="qwanyx-space-y-4">
                {fields.map(field => (
                  <div key={field.name}>
                    {renderField(field)}
                  </div>
                ))}
                
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Envoi en cours...' : submitText}
                </Button>
              </form>
            </CardContent>
          </Card>
      </div>
    </section>
  )
}