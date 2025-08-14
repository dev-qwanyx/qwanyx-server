import React from 'react';
import { Container, Card, Text, Heading, Button } from '@qwanyx/ui';
import '@qwanyx/ui/dist/ui.css';

export interface Service {
  icon?: string;
  iconColor?: string;
  title: string;
  description: string;
  link?: {
    label: string;
    href: string;
  };
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ServicesGridProps {
  title?: string;
  subtitle?: string;
  services: Service[];
  columns?: 2 | 3 | 4;
  centered?: boolean;
}

const ServicesGrid: React.FC<ServicesGridProps> = ({
  title,
  subtitle,
  services,
  columns = 3,
  centered = true
}) => {
  return (
    <section className="services-section">
      <Container>
        {(title || subtitle) && (
          <div className={centered ? 'section-header-centered' : 'section-header'}>
            {title && (
              <Heading as="h2" size="3xl" weight="bold">
                {title}
              </Heading>
            )}
            {subtitle && (
              <Text size="lg" color="muted">
                {subtitle}
              </Text>
            )}
          </div>
        )}

        <div className={`services-grid services-grid--${columns}`}>
          {services.map((service, index) => (
            <Card key={index} hoverable className="service-card">
              {service.icon && (
                <div 
                  className="service-icon"
                  style={{ color: service.iconColor }}
                >
                  <i className={`fas fa-${service.icon} fa-3x`}></i>
                </div>
              )}
              
              <Heading as="h3" size="xl" weight="semibold" className="service-title">
                {service.title}
              </Heading>
              
              <Text color="muted" className="service-description">
                {service.description}
              </Text>

              {service.link && (
                <a href={service.link.href} className="service-link">
                  {service.link.label} →
                </a>
              )}

              {service.action && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={service.action.onClick}
                  className="service-action"
                >
                  {service.action.label}
                </Button>
              )}
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ServicesGrid;