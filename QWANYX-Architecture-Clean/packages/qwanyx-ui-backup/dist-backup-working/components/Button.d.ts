import { default as React } from 'react';
import { HTMLMotionProps } from 'framer-motion';
export interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'color'> {
    variant?: 'solid' | 'outline' | 'ghost' | 'link' | 'validate' | 'primary' | 'secondary' | 'tab' | 'pill' | 'segment' | 'nav';
    color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    animationType?: 'default' | 'spring' | 'pop' | 'pulse' | 'shake' | 'none';
    isActive?: boolean;
    showRipple?: boolean;
}
export declare const Button: React.ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=Button.d.ts.map