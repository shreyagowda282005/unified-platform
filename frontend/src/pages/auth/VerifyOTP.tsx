// Save as: frontend/src/pages/auth/VerifyOTP.tsx

import { useState, useEffect } from 'react';
import type React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore'

export function VerifyOTP() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore()
  const userId = searchParams.get('userId');
  const email = searchParams.get('email');
  const requiresPassword = searchParams.get('requiresPassword') !== 'false';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resending, setResending] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!userId || !email) {
      navigate('/login');
    }
  }, [userId, email, navigate]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    
    setOtp(newOtp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (requiresPassword) {
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          otp: otpString,
          password: requiresPassword ? password : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      setSuccess('✅ Verification successful! Redirecting...');

      // If server returned auth token + user, update central auth store
      if (data?.token && data?.user) {
        setAuth(
          {
            id: data.user.id || data.user._id,
            _id: data.user.id || data.user._id,
            name: data.user.name || (email ? email.split('@')[0] : ''),
            email: data.user.email || email || '',
            userType: data.user.userType,
          },
          data.token
        )
      }

      // Store token and userType for backward compatibility
      if (data?.token) localStorage.setItem('token', data.token);
      if (data?.user?.userType) localStorage.setItem('userType', data.user.userType);
      setPassword('');
      setConfirmPassword('');

      // Redirect to dashboard
      setTimeout(() => {
        if (data.user.userType === 'brand') {
          navigate('/brand/dashboard');
        } else {
          navigate('/influencer/dashboard');
        }
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      setSuccess('✅ OTP has been resent to your email');
      setOtp(['', '', '', '', '', '']);
      setPassword('');
      setConfirmPassword('');
      
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg,rgb(67, 106, 73) 0%,rgb(144, 184, 122) 100%)',

      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        background: 'white',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          display: 'inline-block',
          background: '#6B8E23',
          color: 'white',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          Influenza
        </div>
        
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          color: '#6B8E23'
        }}>
          Verify Your Email
        </h2>
        
        <p style={{ 
          color: '#6B8E23', 
          marginBottom: '8px',
          fontSize: '15px'
        }}>
          We've sent a 6-digit code to <strong>{email}</strong>
        </p>
        
        {requiresPassword && (
          <p style={{ 
            color: '#6B8E23', 
            fontSize: '13px',
            marginBottom: '24px'
          }}>
            Enter the OTP and create your password to complete signup.
          </p>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '12px 16px',
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '12px',
            color: '#c33',
            marginBottom: '20px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div style={{
            padding: '12px 16px',
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '12px',
            color: '#155724',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* OTP Input Boxes */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '24px'
          }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={loading}
                style={{
                  width: '50px',
                  height: '60px',
                  textAlign: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: loading ? '#f7fafc' : 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            ))}
          </div>

          {requiresPassword && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px', 
              marginBottom: '24px' 
            }}>
              <div>
                <label style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#4a5568',
                  marginBottom: '8px'
                }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter a new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#B7F7A8';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#4a5568',
                  marginBottom: '8px'
                }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#B7F7A8';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                  }}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#a0aec0' : '#B7F7A8',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(65, 102, 83, 0.4)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#5a67d8';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#667eea';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? '⏳ Verifying...' : requiresPassword ? 'Verify & Set Password' : 'Verify Email'}
          </button>
        </form>

        {/* Resend OTP */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ 
            fontSize: '14px',
            color: '#718096',
            marginBottom: '8px'
          }}>
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resending}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              cursor: resending ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'underline',
              padding: '4px 8px'
            }}
          >
            {resending ? '⏳ Sending...' : 'Resend OTP'}
          </button>
        </div>

        <p style={{ 
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '14px',
          color: '#718096'
        }}>
          Having trouble?{' '}
          <a 
            href="/login"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Back to login
          </a>
        </p>
      </div>
    </div>
  );
}