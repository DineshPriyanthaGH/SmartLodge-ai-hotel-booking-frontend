import React, { useState, useEffect } from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  // Redirect if not in verification mode
  useEffect(() => {
    if (isLoaded && (!signUp || signUp.status !== 'missing_requirements')) {
      navigate('/sign-up');
    }
  }, [isLoaded, signUp, navigate]);

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setIsVerifying(true);
    setError('');

    try {
      // Attempt email verification
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: code,
      });

      if (completeSignUp.status === 'complete') {
        // Set the active session
        await setActive({ session: completeSignUp.createdSessionId });
        
        // Sync user with backend
        await syncUserWithBackend(completeSignUp);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError('Verification incomplete. Please try again.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.errors?.[0]?.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const syncUserWithBackend = async (completedSignUp) => {
    try {
      if (import.meta.env.DEV) {
        console.log('Syncing user with backend...', {
          clerkId: completedSignUp.createdUserId,
          email: completedSignUp.emailAddress,
          firstName: completedSignUp.firstName,
          lastName: completedSignUp.lastName,
        });
      }

      // Try multiple endpoints for user sync
      const endpoints = [
        `${import.meta.env.VITE_API_URL}/test-sync`,
        `${import.meta.env.VITE_API_URL}/webhooks/sync-clerk-user`,
        `${import.meta.env.VITE_API_URL}/auth/sync-clerk-user`
      ];

      const userData = {
        clerkId: completedSignUp.createdUserId,
        email: completedSignUp.emailAddress,
        firstName: completedSignUp.firstName,
        lastName: completedSignUp.lastName,
        imageUrl: completedSignUp.imageUrl || ''
      };

      for (const endpoint of endpoints) {
        try {
          if (import.meta.env.DEV) {
            console.log(`Trying endpoint: ${endpoint}`);
          }
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
          });

          const result = await response.json();
          
          if (response.ok) {
            if (import.meta.env.DEV) {
              console.log('User successfully synced with backend:', result);
            }
            return; // Success, exit the loop
          } else {
            console.warn(`Endpoint ${endpoint} failed:`, result);
          }
        } catch (endpointError) {
          console.warn(`Endpoint ${endpoint} error:`, endpointError);
        }
      }
      
      console.warn('All sync endpoints failed, but user is still authenticated through Clerk');
    } catch (error) {
      console.error('Backend sync error:', error);
      // Don't block the flow if backend sync fails
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded || !signUp || resending) return;

    setResending(true);
    setError('');

    try {
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
      
      // Show success message (you could add a toast here)
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Resend error:', err);
      setError(err.errors?.[0]?.message || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (!isLoaded || !signUp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify your email address
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a 6-digit verification code to{' '}
            <span className="font-medium text-blue-600">
              {signUp?.emailAddress}
            </span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleVerification}>
          <div>
            <label htmlFor="verification-code" className="sr-only">
              Verification Code
            </label>
            <Input
              id="verification-code"
              name="code"
              type="text"
              required
              maxLength={6}
              className="text-center text-2xl tracking-widest"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={isVerifying}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isVerifying || code.length !== 6}
            >
              {isVerifying ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resending}
                  className="font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50"
                >
                  {resending ? 'Sending...' : 'Resend code'}
                </button>
              </p>
            </div>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate('/sign-up')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;