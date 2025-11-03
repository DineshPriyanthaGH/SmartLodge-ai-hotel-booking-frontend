import React from 'react';

class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details in development
    if (import.meta.env.DEV) {
      console.error('Dashboard Error Boundary caught an error:', error, errorInfo);
    }
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Error</h2>
            <p className="text-gray-600 mb-4">
              Something went wrong while loading your dashboard. Please refresh the page to try again.
            </p>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left text-sm bg-gray-100 p-3 rounded mt-4">
                <summary className="font-semibold cursor-pointer">Error Details (Development)</summary>
                <div className="mt-2 text-red-600">
                  <strong>Error:</strong> {this.state.error.toString()}
                </div>
                {this.state.errorInfo?.componentStack && (
                  <div className="mt-2 text-gray-600">
                    <strong>Component Stack:</strong>
                    <pre className="whitespace-pre-wrap text-xs">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </details>
            )}
            
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DashboardErrorBoundary;