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

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const newValue = digits.join('');
    onChange(newValue);
    
    if (newValue.length === length && onComplete) {
      onComplete(newValue);
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

  return (
    <div className={`flex gap-2 justify-center ${className}`}>
      {Array.from({ length }, (_, index) => (
        <div key={index} className="relative">
          <input
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            className={`
              w-12 h-14 
              text-center text-2xl font-bold
              border-2 rounded-lg
              transition-all duration-200
              ${disabled 
                ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' 
                : 'bg-white text-gray-900 hover:border-blue-400 focus:border-blue-500'
              }
              ${error 
                ? 'border-red-500 focus:border-red-500 animate-shake' 
                : digits[index] 
                  ? 'border-green-500' 
                  : 'border-gray-300'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20
            `}
          />
          {/* Dot indicator for filled fields */}
          {digits[index] && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            </div>
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
      <div className="text-center">
        <p className="text-red-600 text-sm mb-2">Code expired</p>
        {canResend && (
          <button
            onClick={handleResend}
            className="text-blue-500 hover:underline text-sm"
          >
            Resend code
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-gray-600 text-sm">
        Code expires in{' '}
        <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-900'}`}>
          {formatTime(timeLeft)}
        </span>
      </p>
    </div>
  );
};