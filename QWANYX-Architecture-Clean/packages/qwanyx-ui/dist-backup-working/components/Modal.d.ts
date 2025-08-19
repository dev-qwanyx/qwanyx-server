import { default as React } from 'react';
export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen: boolean;
    onClose: () => void;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    showCloseButton?: boolean;
    overlayClassName?: string;
}
export declare const Modal: React.ForwardRefExoticComponent<ModalProps & React.RefAttributes<HTMLDivElement>>;
export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare const ModalHeader: React.ForwardRefExoticComponent<ModalHeaderProps & React.RefAttributes<HTMLDivElement>>;
export interface ModalTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
}
export declare const ModalTitle: React.ForwardRefExoticComponent<ModalTitleProps & React.RefAttributes<HTMLHeadingElement>>;
export interface ModalDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
}
export declare const ModalDescription: React.ForwardRefExoticComponent<ModalDescriptionProps & React.RefAttributes<HTMLParagraphElement>>;
export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
}
export declare const ModalBody: React.ForwardRefExoticComponent<ModalBodyProps & React.RefAttributes<HTMLDivElement>>;
export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: 'left' | 'center' | 'right' | 'between';
}
export declare const ModalFooter: React.ForwardRefExoticComponent<ModalFooterProps & React.RefAttributes<HTMLDivElement>>;
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
export declare const SimpleModal: React.FC<SimpleModalProps>;
//# sourceMappingURL=Modal.d.ts.map