// Save as: frontend/src/pages/auth/GoogleCallback.tsx

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore'

export function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const handleCallback = async () => {
      // Get token and userType from URL parameters
      const token = searchParams.get('token');
      const userType = searchParams.get('userType');
      const error = searchParams.get('error');

      // Handle error from backend
      if (error) {
        setStatus('error');
        if (error === 'google_auth_failed') {
          setErrorMessage('Google authentication failed. Please try again.');
        } else if (error === 'token_generation_failed') {
          setErrorMessage('Failed to generate authentication token. Please try again.');
        } else {
          setErrorMessage('An unexpected error occurred. Please try again.');
        }
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        return;
      }

      // Check if token exists
      if (!token) {
        setStatus('error');
        setErrorMessage('No authentication token received.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        return;
      }


      // Store token and user type locally for immediate API access
      localStorage.setItem('token', token);
      if (userType) localStorage.setItem('userType', userType);

      // Attempt to fetch user profile and set the central auth store
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const user = await res.json()
          // set the auth store so rest of app stays in-sync
          setAuth(
            {
              id: user.id || user._id,
              _id: user.id || user._id,
              name: user.name || '',
              email: user.email || '',
              userType: user.userType,
            },
            token
          )

          // prefer server-provided userType when redirecting
          if (user?.userType) {
            // override the userType variable from the URL
            // so the redirect below uses the authoritative value
            // (keeps UX correct if URL is missing or different)
            // Note: userType (from URLSearchParams) is still available
          }
        }
      } catch (err) {
        // Non-fatal — token persisted in localStorage will be picked up by App.initialize
        console.warn('Failed to initialize auth store after Google callback', err)
      }

      // Set success status
      setStatus('success');

      // Redirect based on user type
      setTimeout(async () => {
        // Try to pick the most reliable userType: server user (via auth store) > URL param
        let resolvedType = userType
        try {
          const state = useAuthStore.getState()
          if (state.user?.userType) resolvedType = state.user.userType
        } catch (e) {
          // ignore
        }

        if (resolvedType === 'brand') {
          navigate('/brand/dashboard')
        } else {
          navigate('/influencer/dashboard')
        }
      }, 1500);
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Completing Sign In
            </h2>
            <p className="text-gray-600">
              Please wait while we set up your account...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Success!
            </h2>
            <p className="text-gray-600">
              You've been signed in successfully. Redirecting...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <p className="text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}