import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Button } from './ui/button';

const AuthTest = () => {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAuthentication = async () => {
    setLoading(true);
    setTestResults(null);

    try {
      // Get token from Clerk
      const token = await getToken();
      console.log('Token obtained:', token ? 'Yes' : 'No');

      if (!token) {
        setTestResults({
          success: false,
          message: 'No token available',
          details: 'Unable to get session token from Clerk'
        });
        return;
      }

      // Test API call with token
      const response = await fetch('http://localhost:5001/api/test-auth', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      setTestResults({
        success: response.ok,
        status: response.status,
        data: data,
        token: token.substring(0, 20) + '...' // Show partial token for security
      });

    } catch (error) {
      console.error('Auth test error:', error);
      setTestResults({
        success: false,
        message: 'Test failed',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Authentication Test
        </h3>
        <p className="text-yellow-700">Please sign in to test JWT authentication.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">JWT Authentication Test</h3>
      
      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          <p><strong>User:</strong> {user?.emailAddresses?.[0]?.emailAddress}</p>
          <p><strong>Clerk ID:</strong> {user?.id}</p>
          <p><strong>Signed In:</strong> {isSignedIn ? 'Yes' : 'No'}</p>
        </div>

        <Button 
          onClick={testAuthentication} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test JWT Authentication'}
        </Button>

        {testResults && (
          <div className={`p-4 rounded-lg border ${
            testResults.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h4 className={`font-semibold mb-2 ${
              testResults.success ? 'text-green-800' : 'text-red-800'
            }`}>
              Test Results
            </h4>
            
            <div className="text-sm space-y-2">
              <p><strong>Status:</strong> {testResults.status}</p>
              <p><strong>Success:</strong> {testResults.success ? 'Yes' : 'No'}</p>
              
              {testResults.token && (
                <p><strong>Token:</strong> {testResults.token}</p>
              )}
              
              {testResults.data && (
                <div>
                  <strong>Response:</strong>
                  <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(testResults.data, null, 2)}
                  </pre>
                </div>
              )}
              
              {testResults.error && (
                <p className="text-red-600">
                  <strong>Error:</strong> {testResults.error}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthTest;