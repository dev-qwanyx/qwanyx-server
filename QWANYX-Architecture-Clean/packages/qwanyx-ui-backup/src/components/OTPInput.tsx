import React, { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';

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

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value = '',
  onChange,
  onComplete,
  disabled = false,
  error = false,
  autoFocus = true,
  className = ''
}) => {
  const [digits, setDigits] = useState<string[]>(() => {
    const initialDigits = value.split('').slice(0, length);
    return [...initialDigits, ...Array(length - initialDigits.length).fill('')];
  });
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const newValue = digits.join('');
    onChange(newValue);
    
    // Check if all digits are filled
    const filledDigits = digits.filter(d => d !== '').length;
    if (filledDigits === length && newValue.length === length && onComplete && !hasCompletedRef.current) {
      // Mark as completed to prevent multiple calls
      hasCompletedRef.current = true;
      onComplete(newValue);
    } else if (filledDigits < length) {
      // Reset the flag if user clears the input
      hasCompletedRef.current = false;
    }
  }, [digits, length, onChange, onComplete]);

  const handleChange = (index: number, digit: string) => {
    if (disabled) return;
    
    // Only allow digits
    if (digit && !/^\d$/.test(digit)) return;

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Handle backspace
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // If current field is empty, move to previous field
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
      } else {
        // Clear current field
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
      e.preventDefault();
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    
    if (pastedData) {
      const newDigits = pastedData.split('').slice(0, length);
      const paddedDigits = [...newDigits, ...Array(length - newDigits.length).fill('')];
      setDigits(paddedDigits);
      
      // Focus on the next empty field or the last field
      const nextEmptyIndex = paddedDigits.findIndex(d => d === '');
      const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    // Select all text when focusing
    inputRefs.current[index]?.select();
  };

  const getInputStyle = (index: number) => {
    const baseStyle = {
      width: '48px',
      height: '56px',
      textAlign: 'center' as const,
      fontSize: '1.5rem',
      fontWeight: 'bold',
      borderRadius: '8px',
      border: '2px solid rgb(var(--qwanyx-border))',
      backgroundColor: 'rgb(var(--qwanyx-input))',
      color: 'rgb(var(--qwanyx-foreground))',
      outline: 'none',
      transition: 'all 200ms ease'
    };

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: 'rgb(var(--qwanyx-muted))',
        color: 'rgb(var(--qwanyx-muted-foreground))',
        borderColor: 'rgb(var(--qwanyx-border))',
        cursor: 'not-allowed',
        opacity: 0.6
      };
    } else if (error) {
      return {
        ...baseStyle,
        borderColor: 'rgb(var(--qwanyx-error))',
        backgroundColor: 'rgb(var(--qwanyx-input))'
      };
    } else if (digits[index]) {
      return {
        ...baseStyle,
        borderColor: 'rgb(var(--qwanyx-success))',
        backgroundColor: 'rgb(var(--qwanyx-card))'
      };
    }
    
    return baseStyle;
  };

  const getInputClassName = (index: number) => {
    const classes = ['qwanyx-otp-input'];
    
    if (disabled) {
      classes.push('qwanyx-otp-input--disabled');
    } else if (error) {
      classes.push('qwanyx-otp-input--error');
    } else if (digits[index]) {
      classes.push('qwanyx-otp-input--filled');
    }
    
    return classes.join(' ');
  };

  return (
    <div 
      className={`qwanyx-otp-container ${className}`}
      style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
    >
      {Array.from({ length }, (_, index) => (
        <div key={index} className="qwanyx-otp-digit-wrapper" style={{ position: 'relative' }}>
          <input
            ref={(el) => {
              if (el) inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            className={getInputClassName(index)}
            style={getInputStyle(index)}
          />
          {/* Dot indicator for filled fields */}
          {digits[index] && !error && (
            <div 
              className="qwanyx-otp-dot" 
              style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '6px',
                height: '6px',
                backgroundColor: 'rgb(var(--qwanyx-primary))',
                borderRadius: '50%'
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Optional timer component for code expiration
export interface OTPTimerProps {
  duration?: number; // in seconds
  onExpire?: () => void;
  onResend?: () => void;
  canResend?: boolean;
}

export const OTPTimer: React.FC<OTPTimerProps> = ({
  duration = 600, // 10 minutes default
  onExpire,
  onResend,
  canResend = true
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = () => {
    setTimeLeft(duration);
    setExpired(false);
    if (onResend) onResend();
  };

  if (expired) {
    return (
      <div className="qwanyx-otp-timer">
        <p className="qwanyx-otp-timer-expired">Code expired</p>
        {canResend && (
          <button
            onClick={handleResend}
            className="qwanyx-otp-resend-button"
          >
            Resend code
          </button>
        )}
      </div>
    );
  }

  const getCountdownClassName = () => {
    if (timeLeft < 30) return 'qwanyx-otp-timer-countdown qwanyx-otp-timer-countdown--danger';
    if (timeLeft < 60) return 'qwanyx-otp-timer-countdown qwanyx-otp-timer-countdown--warning';
    return 'qwanyx-otp-timer-countdown';
  };

  return (
    <div className="qwanyx-otp-timer">
      <p className="qwanyx-otp-timer-text">
        Code expires in{' '}
        <span className={getCountdownClassName()}>
          {formatTime(timeLeft)}
        </span>
      </p>
    </div>
  );
};