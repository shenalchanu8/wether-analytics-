import React, { createContext, useContext, useEffect } from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: any;
  error?: Error;
  login: () => void;
  logout: () => void;
  getToken: () => Promise<string>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function AuthInnerProvider({ children }: { children: React.ReactNode }) {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    error,
    loginWithRedirect, 
    logout, 
    getAccessTokenSilently 
  } = useAuth0();

  useEffect(() => {
    if (error) {
      console.error("Auth0 Error:", error);
    }
  }, [error]);

  const login = () => {
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin,
      }
    });
  };

  const doLogout = () => {
    logout({
      logoutParams: { 
        returnTo: window.location.origin 
      }
    });
  };

  const getToken = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE
        }
      });
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        error,
        login,
        logout: doLogout,
        getToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  if (!domain || !clientId || !audience) {
    console.error("Missing Auth0 configuration!");
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <h1 className="text-2xl font-bold text-red-600">Configuration Error</h1>
          <p className="text-gray-700 mt-2">
            Missing Auth0 environment variables. Please check your .env file.
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-mono text-gray-600">Required variables:</p>
            <ul className="text-sm font-mono text-gray-600 mt-2 space-y-1">
              <li>• VITE_AUTH0_DOMAIN</li>
              <li>• VITE_AUTH0_CLIENT_ID</li>
              <li>• VITE_AUTH0_AUDIENCE</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <AuthInnerProvider>{children}</AuthInnerProvider>
    </Auth0Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}