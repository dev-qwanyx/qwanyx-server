import React from 'react';
import { cn } from '../../utils/classNames';

interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

const Footer = React.forwardRef<HTMLElement, FooterProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <footer ref={ref} className={cn('footer', className)} {...rest}>
      {children}
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;