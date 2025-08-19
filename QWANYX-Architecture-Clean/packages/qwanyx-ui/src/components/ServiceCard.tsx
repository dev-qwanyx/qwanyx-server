import React from 'react';
import { Icon } from './Icon';

export interface ServiceCardProps {
  icon: string;
  iconColor?: string;
  title: string;
  description: string;
  hoverable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  iconColor = '#E67E22',
  title,
  description,
  hoverable = true,
  className,
  style
}) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#3E4E5E',
    borderRadius: '16px',
    padding: '2rem',
    width: '100%',
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    border: 'none',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    ...style
  };

  const iconWrapperStyle: React.CSSProperties = {
    marginBottom: '1.25rem'
  };

  const titleStyle: React.CSSProperties = {
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '0.75rem'
  };

  const descriptionStyle: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    padding: '0 0.5rem'
  };

  const hoverStyle = hoverable ? {
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
  } : {};

  return (
    <div 
      className={className} 
      style={cardStyle}
      {...hoverStyle}
    >
      <div style={iconWrapperStyle}>
        <Icon 
          name={icon} 
          size="2xl" 
          style={{ color: iconColor, fontSize: '3rem' }} 
        />
      </div>
      <h3 style={titleStyle}>{title}</h3>
      <p style={descriptionStyle}>{description}</p>
    </div>
  );
};

ServiceCard.displayName = 'ServiceCard';