import React, { createContext, useContext, useState, useEffect } from 'react';
import { trpc } from '@/utils/trpc';
import type { LoginResponse, SessionResponse } from '../../../server/src/schema';

interface AuthContextType {
  user: SessionResponse['user'];
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionResponse['user']>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(
    localStorage.getItem('clinic_session_id')
  );

  const isAuthenticated = !!user && user.is_active;

  // Check existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      if (sessionId) {
        try {
          const response = await trpc.auth.verifySession.query({ session_id: sessionId });
          if (response.valid && response.user) {
            setUser(response.user);
          } else {
            localStorage.removeItem('clinic_session_id');
            setSessionId(null);
          }
        } catch (error) {
          console.error('Session verification failed:', error);
          localStorage.removeItem('clinic_session_id');
          setSessionId(null);
        }
      }
      setLoading(false);
    };

    checkSession();
  }, [sessionId]);

  const login = async (username: string, password: string) => {
    try {
      const response: LoginResponse = await trpc.auth.login.mutate({
        username,
        password
      });

      if (response.success && response.user) {
        setUser(response.user);
        // Store session ID (in real implementation, this would come from the login response)
        const mockSessionId = `mock-session-${response.user.id}-${Date.now()}`;
        localStorage.setItem('clinic_session_id', mockSessionId);
        setSessionId(mockSessionId);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (sessionId) {
        await trpc.auth.logout.mutate({ session_id: sessionId });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('clinic_session_id');
      setSessionId(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}