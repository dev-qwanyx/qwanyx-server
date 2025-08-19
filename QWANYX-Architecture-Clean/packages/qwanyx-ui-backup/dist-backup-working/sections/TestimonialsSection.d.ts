import { default as React } from 'react';
export interface Testimonial {
    id: string;
    content: string;
    author: string;
    role?: string;
    company?: string;
    avatar?: string;
    rating?: number;
}
export interface TestimonialsSectionProps {
    id?: string;
    title?: string;
    subtitle?: string;
    testimonials: Testimonial[];
    columns?: 1 | 2 | 3;
    variant?: 'default' | 'cards' | 'minimal' | 'quotes';
    backgroundColor?: string;
}
export declare const TestimonialsSection: React.FC<TestimonialsSectionProps>;
//# sourceMappingURL=TestimonialsSection.d.ts.map