import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Button } from './ui/button'
import { userAPI, bookingAPI, reviewAPI } from '../services/api'

function ApiTest() {
  const { user } = useUser()
  const [testResults, setTestResults] = useState({})
  const [loading, setLoading] = useState(false)

  const testAPI = async (apiName, apiCall) => {
    try {
      setLoading(true)
      const result = await apiCall()
      setTestResults(prev => ({
        ...prev,
        [apiName]: { success: true, data: result }
      }))
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [apiName]: { success: false, error: error.message }
      }))
    } finally {
      setLoading(false)
    }
  }

  const runTests = async () => {
    setTestResults({})
    
    // Test CORS first (no auth required)
    await testAPI('corsTest', () => 
      fetch('http://localhost:5001/api/test-cors').then(r => r.json())
    )
    
    if (!user) {
      alert('Please sign in for authenticated API tests')
      return
    }
    
    // Test user stats API
    await testAPI('userStats', () => userAPI.getUserStats())
    
    // Test user bookings API
    await testAPI('userBookings', () => bookingAPI.getUserBookings())
    
    // Test user reviews API
    await testAPI('userReviews', () => reviewAPI.getUserReviews())
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">API Integration Test</h3>
      
      <Button 
        onClick={runTests} 
        disabled={loading || !user}
        className="mb-4"
      >
        {loading ? 'Testing...' : 'Test API Connections'}
      </Button>

      {Object.keys(testResults).length > 0 && (
        <div className="space-y-3">
          {Object.entries(testResults).map(([apiName, result]) => (
            <div key={apiName} className="p-3 rounded border">
              <div className="flex items-center justify-between">
                <span className="font-medium">{apiName}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  result.success 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {result.success ? 'Success' : 'Failed'}
                </span>
              </div>
              {result.error && (
                <p className="text-red-600 text-sm mt-1">{result.error}</p>
              )}
              {result.success && (
                <p className="text-green-600 text-sm mt-1">
                  Response received: {JSON.stringify(result.data).slice(0, 100)}...
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ApiTest