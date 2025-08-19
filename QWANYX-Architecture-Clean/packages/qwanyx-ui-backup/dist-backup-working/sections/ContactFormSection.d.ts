import { default as React } from 'react';
export interface ContactFormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
    placeholder?: string;
    required?: boolean;
    options?: string[];
    rows?: number;
}
export interface ContactFormSectionProps {
    title?: string;
    subtitle?: string;
    fields?: ContactFormField[];
    submitText?: string;
    onSubmit?: (data: Record<string, string>) => void | Promise<void>;
    backgroundImage?: string;
    overlayOpacity?: number;
    parallax?: 'none' | 'slow' | 'normal' | 'fast' | 'fixed';
    className?: string;
}
export declare const simpleContactFields: ContactFormField[];
export declare const detailedContactFields: ContactFormField[];
export declare const businessContactFields: ContactFormField[];
export declare const ContactFormSection: React.FC<ContactFormSectionProps>;
//# sourceMappingURL=ContactFormSection.d.ts.map