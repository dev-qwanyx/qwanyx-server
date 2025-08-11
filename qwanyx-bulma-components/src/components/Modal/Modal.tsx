import React from 'react';
import { cn } from '../../utils/classNames';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  onClose?: () => void;
}

interface ModalBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {}
interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {}
interface ModalCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'normal' | 'medium' | 'large';
}
interface ModalCardProps extends React.HTMLAttributes<HTMLDivElement> {}
interface ModalCardHeadProps extends React.HTMLAttributes<HTMLElement> {}
interface ModalCardTitleProps extends React.HTMLAttributes<HTMLParagraphElement> {}
interface ModalCardBodyProps extends React.HTMLAttributes<HTMLElement> {}
interface ModalCardFootProps extends React.HTMLAttributes<HTMLElement> {}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(({
  isActive = false,
  onClose,
  className,
  children,
  ...rest
}, ref) => {
  const modalClasses = cn(
    'modal',
    isActive && 'is-active',
    className
  );

  return (
    <div ref={ref} className={modalClasses} {...rest}>
      {children}
    </div>
  );
});

export const ModalBackground = React.forwardRef<HTMLDivElement, ModalBackgroundProps>(({
  className,
  ...rest
}, ref) => {
  return (
    <div ref={ref} className={cn('modal-background', className)} {...rest} />
  );
});

export const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <div ref={ref} className={cn('modal-content', className)} {...rest}>
      {children}
    </div>
  );
});

export const ModalClose = React.forwardRef<HTMLButtonElement, ModalCloseProps>(({
  size,
  className,
  ...rest
}, ref) => {
  const closeClasses = cn(
    'modal-close',
    size && size !== 'normal' && `is-${size}`,
    className
  );

  return (
    <button ref={ref} className={closeClasses} aria-label="close" {...rest} />
  );
});

export const ModalCard = React.forwardRef<HTMLDivElement, ModalCardProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <div ref={ref} className={cn('modal-card', className)} {...rest}>
      {children}
    </div>
  );
});

export const ModalCardHead = React.forwardRef<HTMLElement, ModalCardHeadProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <header ref={ref} className={cn('modal-card-head', className)} {...rest}>
      {children}
    </header>
  );
});

export const ModalCardTitle = React.forwardRef<HTMLParagraphElement, ModalCardTitleProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <p ref={ref} className={cn('modal-card-title', className)} {...rest}>
      {children}
    </p>
  );
});

export const ModalCardBody = React.forwardRef<HTMLElement, ModalCardBodyProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <section ref={ref} className={cn('modal-card-body', className)} {...rest}>
      {children}
    </section>
  );
});

export const ModalCardFoot = React.forwardRef<HTMLElement, ModalCardFootProps>(({
  className,
  children,
  ...rest
}, ref) => {
  return (
    <footer ref={ref} className={cn('modal-card-foot', className)} {...rest}>
      {children}
    </footer>
  );
});

Modal.displayName = 'Modal';
ModalBackground.displayName = 'ModalBackground';
ModalContent.displayName = 'ModalContent';
ModalClose.displayName = 'ModalClose';
ModalCard.displayName = 'ModalCard';
ModalCardHead.displayName = 'ModalCardHead';
ModalCardTitle.displayName = 'ModalCardTitle';
ModalCardBody.displayName = 'ModalCardBody';
ModalCardFoot.displayName = 'ModalCardFoot';

export default Modal;