import React from 'react';
import { Container, Card, CardContent, Button, Input, Textarea, Text, Heading } from '@qwanyx/ui';
// CSS imported by host app

const ContactAutodin: React.FC = () => {
  return (
    <section id="contact" style={{ 
      padding: '5rem 0',
      backgroundColor: 'white'
    }}>
      <Container>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Heading as="h2" style={{ 
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'var(--autodin-dark)',
            marginBottom: '1rem'
          }}>
            Contactez-nous
          </Heading>
          <Text size="lg" style={{ color: 'var(--gray-600)' }}>
            Une question ? N'hésitez pas à nous contacter
          </Text>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {/* Contact Form */}
          <Card>
            <CardContent style={{ padding: '2rem' }}>
              <form>
                <div style={{ marginBottom: '1.5rem' }}>
                  <Input
                    placeholder="Votre nom"
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <Input
                    type="email"
                    placeholder="Votre email"
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <Input
                    placeholder="Sujet"
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <Textarea
                    placeholder="Votre message"
                    rows={5}
                    style={{ width: '100%' }}
                  />
                </div>
                <Button
                  variant="primary"
                  style={{
                    backgroundColor: 'var(--autodin-primary)',
                    borderColor: 'var(--autodin-primary)',
                    width: '100%'
                  }}
                >
                  <i className="fas fa-paper-plane" style={{ marginRight: '0.5rem' }}></i>
                  Envoyer le message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div>
            <Card style={{ marginBottom: '1.5rem' }}>
              <CardContent style={{ 
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(230, 126, 34, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="fas fa-envelope" style={{ 
                    color: 'var(--autodin-primary)',
                    fontSize: '1.25rem'
                  }}></i>
                </div>
                <div>
                  <Text style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Email</Text>
                  <Text style={{ color: 'var(--gray-600)' }}>contact@autodin.be</Text>
                </div>
              </CardContent>
            </Card>

            <Card style={{ marginBottom: '1.5rem' }}>
              <CardContent style={{ 
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(230, 126, 34, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="fas fa-phone" style={{ 
                    color: 'var(--autodin-primary)',
                    fontSize: '1.25rem'
                  }}></i>
                </div>
                <div>
                  <Text style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Téléphone</Text>
                  <Text style={{ color: 'var(--gray-600)' }}>+32 2 123 45 67</Text>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent style={{ 
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(230, 126, 34, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="fas fa-map-marker-alt" style={{ 
                    color: 'var(--autodin-primary)',
                    fontSize: '1.25rem'
                  }}></i>
                </div>
                <div>
                  <Text style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Adresse</Text>
                  <Text style={{ color: 'var(--gray-600)' }}>Bruxelles, Belgique</Text>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ContactAutodin;