import { default as React } from 'react';
export interface OTPInputProps {
    length?: number;
    value?: string;
    onChange: (value: string) => void;
    onComplete?: (value: string) => void;
    disabled?: boolean;
    error?: boolean;
    autoFocus?: boolean;
    className?: string;
}
export declare const OTPInput: React.FC<OTPInputProps>;
export interface OTPTimerProps {
    duration?: number;
    onExpire?: () => void;
    onResend?: () => void;
    canResend?: boolean;
}
export declare const OTPTimer: React.FC<OTPTimerProps>;
//# sourceMappingURL=OTPInput.d.ts.map