import React from 'react'
import { 
  Footer as QwanyxFooter, 
  FooterGrid, 
  FooterSection, 
  FooterTitle, 
  FooterLinks, 
  FooterLink,
  Text 
} from '@qwanyx/ui'

const Footer: React.FC = () => {
  return (
    <QwanyxFooter className="autodin-footer" variant="detailed">
      <FooterGrid cols={3} gap="xl">
        {/* Left Column - Title and Description */}
        <FooterSection>
          <FooterTitle className="text-white">
            Autodin
          </FooterTitle>
          <Text className="text-white opacity-80 text-sm mb-4">
            Votre marketplace de pièces automobiles de confiance
          </Text>
          
          {/* Contact Info */}
          <div className="text-white opacity-70 text-sm space-y-1">
            <p className="flex items-center">
              <i className="fas fa-map-marker-alt mr-2 text-xs w-4"></i>
              Boulevard Anspach 111, 1000 Bruxelles
            </p>
            <p className="flex items-center">
              <i className="fas fa-phone mr-2 text-xs w-4"></i>
              +32 2 xxx xx xx
            </p>
            <p className="flex items-center">
              <i className="fas fa-envelope mr-2 text-xs w-4"></i>
              info@autodin.be
            </p>
          </div>
        </FooterSection>
        
        {/* Middle Column - Empty/Spacer */}
        <div></div>
        
        {/* Right Column - Links and Social */}
        <FooterSection>
          <FooterLinks spacing="sm">
            <FooterLink href="#" className="text-white opacity-70 hover:opacity-100 flex items-center">
              <i className="fas fa-chevron-right mr-2 text-xs"></i>
              Conditions générales d'utilisation
            </FooterLink>
            <FooterLink href="#" className="text-white opacity-70 hover:opacity-100 flex items-center">
              <i className="fas fa-chevron-right mr-2 text-xs"></i>
              Politique de confidentialité (RGPD)
            </FooterLink>
            <FooterLink href="#" className="text-white opacity-70 hover:opacity-100 flex items-center">
              <i className="fas fa-chevron-right mr-2 text-xs"></i>
              Mentions légales
            </FooterLink>
            <FooterLink href="#" className="text-white opacity-70 hover:opacity-100 flex items-center">
              <i className="fas fa-chevron-right mr-2 text-xs"></i>
              Contact
            </FooterLink>
          </FooterLinks>
          
          {/* Social Media Icons */}
          <div className="flex gap-3 justify-end mt-4">
            <a href="#" className="text-white opacity-60 hover:opacity-100 text-xl">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-white opacity-60 hover:opacity-100 text-xl">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-white opacity-60 hover:opacity-100 text-xl">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#" className="text-white opacity-60 hover:opacity-100 text-xl">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </FooterSection>
      </FooterGrid>
    </QwanyxFooter>
  )
}

export default Footer