import { useAuth } from "../contexts/AuthContext";

export default function TopBar({
  onRefresh,
  darkMode,
  onToggleDarkMode,
  showChart,
  onToggleChart
}: {
  onRefresh: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  showChart: boolean;
  onToggleChart: () => void;
}) {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-lg transition-colors duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left side - Brand & User */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Weather Analytics</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Real-time insights</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3 pl-4 border-l border-gray-300 dark:border-gray-700">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-900 dark:text-white truncate max-w-[150px]">{user?.email || "user@example.com"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active session</p>
            </div>
          </div>
        </div>

        {/* Right side - Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <span className="text-lg">{darkMode ? "☀️" : "🌙"}</span>
            <span className="text-sm font-medium hidden sm:inline">{darkMode ? "Light" : "Dark"}</span>
          </button>

          {/* Chart Toggle */}
          <button
            onClick={onToggleChart}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200"
            title={showChart ? "Switch to Table View" : "Switch to Chart View"}
          >
            <span className="text-lg">📊</span>
            <span className="text-sm font-medium hidden sm:inline">{showChart ? "Table" : "Chart"}</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-md"
            title="Refresh data (bypass cache)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm font-medium hidden sm:inline">Refresh</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 shadow-md"
            title="Logout from dashboard"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Status indicators */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">System</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">API</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">Cache</span>
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}