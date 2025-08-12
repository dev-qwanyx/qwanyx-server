import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { Text } from './Text';
import { OTPInput, OTPTimer } from './OTPInput';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'login' | 'register';
  workspace?: string;
  apiUrl?: string;
  onSuccess?: (user: any, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode: initialMode = 'login',
  workspace = 'qwanyx-ui',
  apiUrl = 'http://135.181.72.183:5002',
  onSuccess
}) => {
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset everything when modal closes
      setStep('email');
      setEmail('');
      setCode('');
      setError('');
      setSuccess('');
      setLoading(false);
    } else {
      // Reset to initial mode when opening
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  const handleSendCode = async () => {
    // Validate email format
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/request-code';
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          site: workspace,
          workspace  // For register, workspace is used instead of site
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess(mode === 'register' 
          ? 'Welcome! Check your email for verification code.' 
          : 'Code sent! Check your email.');
        setStep('code');
      } else {
        setError(data.error || 'Failed to send code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${apiUrl}/auth/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
          site: workspace
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store token
        localStorage.setItem(`${workspace}_token`, data.access_token);
        localStorage.setItem(`${workspace}_user`, JSON.stringify(data.user));
        
        // Call success callback
        if (onSuccess) {
          onSuccess(data.user, data.access_token);
        }
        
        // Reset and close
        setEmail('');
        setCode('');
        setStep('email');
        onClose();
      } else {
        setError(data.error || 'Invalid code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('email');
    setCode('');
    setError('');
    setSuccess('');
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setStep('email');
    setError('');
    setSuccess('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={true}
    >
      <ModalHeader>
        <div className="flex flex-col items-center mb-6">
          <img 
            src="/images/logo.png" 
            alt="Logo" 
            width={60} 
            height={60}
            className="mb-2"
            style={{ width: '60px', height: '60px', objectFit: 'contain' }}
          />
          <div className="text-2xl font-bold text-primary">
            {workspace.toUpperCase()}
          </div>
        </div>
        <ModalTitle className="text-center">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </ModalTitle>
        <ModalDescription className="text-center">
          {step === 'email' 
            ? `Enter your email to ${mode === 'login' ? 'sign in' : 'register'}`
            : 'Enter the code sent to your email'
          }
        </ModalDescription>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}

          {step === 'email' ? (
            <>
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <i className="fas fa-envelope" style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999',
                  fontSize: '14px',
                  zIndex: 1
                }}></i>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  fullWidth={true}
                  style={{ paddingLeft: '2.5rem' }}
                  error={!!error && step === 'email'}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  title="Please enter a valid email address"
                  required
                />
              </div>
              <Button
                fullWidth
                onClick={handleSendCode}
                loading={loading}
                disabled={!email}
                style={{ 
                  backgroundColor: '#E67E22',
                  color: 'white',
                  opacity: !email ? 0.6 : 1
                }}
              >
                Send Code
              </Button>
            </>
          ) : (
            <>
              <div className="text-center text-sm text-gray-600 mb-4">
                Code sent to: <strong>{email}</strong>
              </div>
              
              <OTPInput
                value={code}
                onChange={setCode}
                onComplete={() => {
                  // Auto-submit when all digits are entered
                  if (code.length === 6) {
                    handleVerifyCode();
                  }
                }}
                disabled={loading}
                error={!!error}
                autoFocus={true}
              />
              
              <div className="mt-4">
                <OTPTimer
                  duration={600}
                  onExpire={() => setError('Code expired. Please request a new one.')}
                  onResend={handleSendCode}
                />
              </div>

              <Button
                fullWidth
                onClick={handleVerifyCode}
                loading={loading}
                disabled={!code || code.length !== 6}
                className="mt-4"
              >
                Verify Code
              </Button>
              
              <Button
                fullWidth
                variant="ghost"
                onClick={handleReset}
                disabled={loading}
              >
                Use Different Email
              </Button>
            </>
          )}
        </div>
      </ModalBody>

      <ModalFooter align="center">
        <Text size="sm">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={toggleMode}
            className="text-blue-500 hover:underline"
            disabled={loading}
          >
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </Text>
      </ModalFooter>
    </Modal>
  );
};

// Auth Status Component
export interface AuthStatusProps {
  workspace?: string;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const AuthStatus: React.FC<AuthStatusProps> = ({
  workspace = 'qwanyx-ui',
  onLogin,
  onLogout
}) => {
  const userStr = localStorage.getItem(`${workspace}_user`);
  const user = userStr ? JSON.parse(userStr) : null;

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Text size="sm">{user.email}</Text>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            localStorage.removeItem(`${workspace}_token`);
            localStorage.removeItem(`${workspace}_user`);
            if (onLogout) onLogout();
          }}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button size="sm" onClick={onLogin}>
      Sign In
    </Button>
  );
};