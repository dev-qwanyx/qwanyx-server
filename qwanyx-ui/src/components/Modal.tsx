import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  overlayClassName?: string;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(({
  children,
  isOpen,
  onClose,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  overlayClassName = '',
  className = '',
  ...props
}, ref) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, closeOnEscape]);
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const combinedOverlayClassName = [
    'qwanyx-modal-overlay',
    overlayClassName
  ].filter(Boolean).join(' ');
  
  const combinedModalClassName = [
    'qwanyx-modal',
    `qwanyx-modal--${size}`,
    className
  ].filter(Boolean).join(' ');
  
  if (!isOpen) return null;
  
  return createPortal(
    <div
      className={combinedOverlayClassName}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={ref || modalRef}
        className={combinedModalClassName}
        {...props}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="qwanyx-modal__close"
            aria-label="Close modal"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
});

Modal.displayName = 'Modal';

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  const combinedClassName = [
    'qwanyx-modal__header',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {children}
    </div>
  );
});

ModalHeader.displayName = 'ModalHeader';

export interface ModalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const ModalTitle = React.forwardRef<HTMLHeadingElement, ModalTitleProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  const combinedClassName = [
    'qwanyx-modal__title',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <h2 ref={ref} className={combinedClassName} {...props}>
      {children}
    </h2>
  );
});

ModalTitle.displayName = 'ModalTitle';

export interface ModalDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const ModalDescription = React.forwardRef<HTMLParagraphElement, ModalDescriptionProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  const combinedClassName = [
    'qwanyx-modal__description',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <p ref={ref} className={combinedClassName} {...props}>
      {children}
    </p>
  );
});

ModalDescription.displayName = 'ModalDescription';

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  const combinedClassName = [
    'qwanyx-modal__body',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {children}
    </div>
  );
});

ModalBody.displayName = 'ModalBody';

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right' | 'between';
}

export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(({
  children,
  align = 'right',
  className = '',
  ...props
}, ref) => {
  const combinedClassName = [
    'qwanyx-modal__footer',
    `qwanyx-modal__footer--${align}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {children}
    </div>
  );
});

ModalFooter.displayName = 'ModalFooter';

// Simple Modal component for easy use
export interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

export const SimpleModal: React.FC<SimpleModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      closeOnOverlayClick={closeOnOverlayClick}
      closeOnEscape={closeOnEscape}
      showCloseButton={showCloseButton}
    >
      {(title || description) && (
        <ModalHeader>
          {title && <ModalTitle>{title}</ModalTitle>}
          {description && <ModalDescription>{description}</ModalDescription>}
        </ModalHeader>
      )}
      <ModalBody>{children}</ModalBody>
      {footer && <ModalFooter>{footer}</ModalFooter>}
    </Modal>
  );
};