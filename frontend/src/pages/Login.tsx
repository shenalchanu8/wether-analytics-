import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/95 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900">Weather Analytics</h1>
        <p className="text-gray-600 mt-2">
          Login to view Comfort Index dashboard (Auth0 protected).
        </p>

        <button
          onClick={login}
          className="mt-6 w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-xl transition"
        >
          Login with Auth0
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Only whitelisted users can access (careers@fidenz.com).
        </p>
      </div>
    </div>
  );
}
