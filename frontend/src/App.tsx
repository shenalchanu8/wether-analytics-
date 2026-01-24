import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function AppContent() {
  const { isAuthenticated, isLoading, error } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-lg font-semibold text-gray-700">Authenticating...</p>
          <p className="text-sm text-gray-500">Please wait while we verify your credentials</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <span className="text-6xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-red-600 text-center">Authentication Error</h1>
          <p className="text-gray-700 mt-3 text-center">{error.message}</p>
          
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-700 font-semibold">Common issues:</p>
            <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
              <li>Invalid Auth0 credentials</li>
              <li>MFA verification failed</li>
              <li>User not whitelisted</li>
              <li>Network connection issue</li>
            </ul>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg"
          >
            🔄 Retry Authentication
          </button>
        </div>
      </div>
    );
  }

  // Render appropriate page based on authentication status
  return isAuthenticated ? <Dashboard /> : <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}