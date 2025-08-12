import React, { useState } from 'react'
import { Container, Input, Button } from '@qwanyx/ui'

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission here
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section className="belgicomics-contact-section" id="contact">
      <Container>
        <div style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: '5rem 0'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 400,
            textAlign: 'center',
            marginBottom: '0.75rem',
            color: 'white'
          }}>
            Contactez-nous
          </h2>
          
          <p style={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '3rem',
            fontSize: '1rem',
            fontWeight: 300
          }}>
            Pour toute question, suggestion ou reporter une correction
          </p>

          <div style={{
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '0.75rem',
            padding: '2.5rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
          }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--gray-800)'
                }}>
                  Nom
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-user" style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--gray-400)',
                    fontSize: '0.875rem',
                    zIndex: 1
                  }}></i>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={handleChange}
                    size="md"
                    style={{
                      paddingLeft: '2.5rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--gray-800)'
                }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-envelope" style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--gray-400)',
                    fontSize: '0.875rem',
                    zIndex: 1
                  }}></i>
                  <Input
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    size="md"
                    style={{
                      paddingLeft: '2.5rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--gray-800)'
                }}>
                  Sujet
                </label>
                <Input
                  type="text"
                  name="subject"
                  placeholder="Objet de votre message"
                  value={formData.subject}
                  onChange={handleChange}
                  size="md"
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--gray-800)'
                }}>
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder="Votre message..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="qwanyx-input qwanyx-input--md"
                  style={{
                    width: '100%',
                    resize: 'vertical',
                    minHeight: '100px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <Button
                  type="submit"
                  variant="outline"
                  size="md"
                  className="belgicomics-login-button"
                >
                  <i className="fas fa-paper-plane"></i>
                  <span>Envoyer</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default Contact