import React from 'react';
import { Footer, Container, Text, Heading } from '@qwanyx/ui';
import '@qwanyx/ui/dist/ui.css';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterGenericProps {
  logo?: string;
  logoAlt?: string;
  description?: string;
  sections?: FooterSection[];
  socialLinks?: Array<{
    icon: string;
    href: string;
    label: string;
  }>;
  copyright?: string;
  theme?: 'light' | 'dark';
}

const FooterGeneric: React.FC<FooterGenericProps> = ({
  logo,
  logoAlt = 'Logo',
  description,
  sections = [],
  socialLinks = [],
  copyright = `© ${new Date().getFullYear()} QWANYX. Tous droits réservés.`
}) => {
  return (
    <Footer>
      <Container>
        <div className="footer-content">
          <div className="footer-main">
            {(logo || description) && (
              <div className="footer-brand">
                {logo && (
                  <img src={logo} alt={logoAlt} height="40" className="footer-logo" />
                )}
                {description && (
                  <Text size="sm" className="footer-description">
                    {description}
                  </Text>
                )}
              </div>
            )}

            {sections.length > 0 && (
              <div className="footer-sections">
                {sections.map((section, index) => (
                  <div key={index} className="footer-section">
                    <Heading as="h4" weight="semibold" className="footer-section-title">
                      {section.title}
                    </Heading>
                    <ul className="footer-links">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a href={link.href} className="footer-link">
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="footer-bottom">
            <Text size="sm" className="footer-copyright">
              {copyright}
            </Text>

            {socialLinks.length > 0 && (
              <div className="footer-social">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="footer-social-link"
                    aria-label={social.label}
                  >
                    <i className={`fab fa-${social.icon}`}></i>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </Footer>
  );
};

export default FooterGeneric;