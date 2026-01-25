import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    await login();
    setIsLoading(false);
  };

  return (
    <div className="h-screen w-screen fixed inset-0 overflow-hidden">
      
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1592210454359-9043f067919b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/70 to-blue-900/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      </div>

      
      <div className="relative h-full w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md"> 
          
          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            
            
            <div className="h-24 sm:h-28 md:h-32 bg-gradient-to-r from-blue-600 to-cyan-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1">
                  Weather Analytics
                </h1>
                <p className="text-blue-100 text-xs sm:text-sm md:text-base">
                  Dashboard
                </p>
                <div className="mt-1 sm:mt-2 w-10 sm:w-12 md:w-16 h-0.5 sm:h-1 bg-white/50 rounded-full"></div>
              </div>
            </div>

            
            <div className="p-4 sm:p-5 md:p-6 lg:p-7">
              
             
              <div className="text-center mb-4 sm:mb-5 md:mb-6">
                <div className="mb-3 sm:mb-4">
                  <svg 
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto text-blue-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="1.5" 
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2 px-2">
                  Secure Login Required
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 px-4">
                  Access advanced weather analytics and comfort index data
                </p>
              </div>

             
              <div className="mb-4 sm:mb-5 md:mb-6">
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2.5 sm:py-3 md:py-3.5 px-4 sm:px-5 rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 group active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm sm:text-base md:text-lg">Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <svg 
                        className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="text-sm sm:text-base md:text-lg">
                        Continue with Auth0
                      </span>
                    </>
                  )}
                </button>
                
              
                <p className="text-center text-gray-500 text-[10px] sm:text-xs mt-1.5 sm:mt-2">
                  Enterprise-grade authentication required
                </p>
              </div>

              

              
              <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                    <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-500">Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-500">Secure</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-500">Authenticated</span>
                  </div>
                </div>
                <p className="text-center text-[9px] sm:text-[10px] md:text-xs text-gray-400 mt-1.5 sm:mt-2 px-2">
                  Protected by Auth0 with enterprise security protocols
                </p>
              </div>
            </div>
          </div>

          
          <div className="text-center mt-3 sm:mt-4">
            <p className="text-white/80 text-[10px] sm:text-xs">
              © 2024 Weather Analytics • Professional Edition
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}