import React, { useState } from 'react'
import { Container, Input, Button } from '@qwanyx/ui'
import { motion, useScroll, useTransform } from 'framer-motion'

const Contact: React.FC = () => {
  const { scrollY } = useScroll()
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -400])
  
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
    <motion.section 
      className="autodin-contact-section" 
      id="contact"
      style={{
        backgroundPositionY: backgroundY
      }}
    >
      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="contact-container">
          <h2 className="contact-title">
            Contactez-nous
          </h2>
          
          <p className="contact-subtitle">
            Pour toute question, suggestion ou reporter une correction
          </p>

          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit}>
              <div className="contact-field">
                <label className="contact-label">
                  Nom
                </label>
                <div className="contact-input-wrapper">
                  <i className="fas fa-user contact-input-icon"></i>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={handleChange}
                    size="md"
                    className="contact-input-with-icon"
                  />
                </div>
              </div>

              <div className="contact-field">
                <label className="contact-label">
                  Email
                </label>
                <div className="contact-input-wrapper">
                  <i className="fas fa-envelope contact-input-icon"></i>
                  <Input
                    type="email"
                    name="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    size="md"
                    className="contact-input-with-icon"
                  />
                </div>
              </div>

              <div className="contact-field">
                <label className="contact-label">
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

              <div className="contact-field-last">
                <label className="contact-label">
                  Message
                </label>
                <textarea
                  name="message"
                  placeholder="Votre message..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="qwanyx-input qwanyx-input--md contact-textarea"
                />
              </div>

              <div className="contact-submit-wrapper">
                <Button
                  type="submit"
                  variant="solid"
                  size="md"
                  className="autodin-button-primary"
                >
                  <i className="fas fa-paper-plane"></i>
                  <span>Envoyer</span>
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </Container>
    </motion.section>
  )
}

export default Contact