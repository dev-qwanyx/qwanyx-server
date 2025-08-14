import React from 'react';
import { Hero, Container, Button, Text, Heading } from '@qwanyx/ui';
import '@qwanyx/ui/dist/ui.css';

export interface HeroGenericProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  height?: 'sm' | 'md' | 'lg' | 'full';
  buttons?: Array<{
    label: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    onClick?: () => void;
    href?: string;
  }>;
  centered?: boolean;
  overlay?: boolean;
}

const HeroGeneric: React.FC<HeroGenericProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  backgroundColor,
  height = 'lg',
  buttons = [],
  centered = true,
  overlay = true
}) => {
  return (
    <Hero 
      backgroundImage={backgroundImage}
      backgroundColor={backgroundColor}
      size={height}
      overlay={overlay}
    >
      <Container>
        <div className={centered ? 'hero-content-centered' : 'hero-content'}>
          <Heading as="h1" size="3xl" weight="bold" className="hero-title">
            {title}
          </Heading>
          
          {subtitle && (
            <Heading as="h2" size="2xl" weight="medium" className="hero-subtitle">
              {subtitle}
            </Heading>
          )}
          
          {description && (
            <Text size="lg" className="hero-description">
              {description}
            </Text>
          )}
          
          {buttons.length > 0 && (
            <div className="hero-buttons">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant || 'primary'}
                  size="lg"
                  onClick={button.onClick}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </Container>
    </Hero>
  );
};

export default HeroGeneric;