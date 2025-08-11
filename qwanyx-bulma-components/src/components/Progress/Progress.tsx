import React from 'react';
import { cn } from '../../utils/classNames';

interface ProgressProps extends React.ProgressHTMLAttributes<HTMLProgressElement> {
  color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'normal' | 'medium' | 'large';
}

const Progress = React.forwardRef<HTMLProgressElement, ProgressProps>(({
  color,
  size,
  className,
  ...rest
}, ref) => {
  const progressClasses = cn(
    'progress',
    color && `is-${color}`,
    size && size !== 'normal' && `is-${size}`,
    className
  );

  return (
    <progress
      ref={ref}
      className={progressClasses}
      {...rest}
    />
  );
});

Progress.displayName = 'Progress';

export default Progress;