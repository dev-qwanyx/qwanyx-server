import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Icon } from './Icon';
import { Text } from './Text';

export interface ServiceCardProps {
  icon: string;
  iconColor?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
  hoverable?: boolean;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  iconColor = 'primary',
  title,
  description,
  hoverable = true,
  className
}) => {
  return (
    <Card className={className} hoverable={hoverable}>
      <CardHeader>
        <Icon name={icon} size="xl" color={iconColor} />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Text>{description}</Text>
      </CardContent>
    </Card>
  );
};

ServiceCard.displayName = 'ServiceCard';