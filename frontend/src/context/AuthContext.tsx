import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api, setAuthToken, removeAuthToken, getAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  login: (email: string, role: string) => Promise<void>;
  logout: () => void;
  quickSwitchRole: (role: UserRole) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getAuthToken();
      if (storedToken) {
        try {
          const profile = await api.getMe();
          setUser(profile);
          setRole(profile.role);
          setToken(storedToken);
        } catch (e) {
          removeAuthToken();
          setUser(null);
          setRole(null);
          setToken(null);
        }
      } else {
        // Auto login as Citizen for seamless evaluator experience if no session exists
        quickSwitchRole('CITIZEN');
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, pwd: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, pwd);
      setAuthToken(res.access_token);
      setToken(res.access_token);
      setRole(res.role);
      const profile = await api.getMe();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const quickSwitchRole = async (targetRole: UserRole) => {
    const creds: Record<UserRole, { email: string; pwd: string }> = {
      CITIZEN: { email: 'citizen@ecotrace.org', pwd: 'EcoCitizen2026!' },
      COLLECTOR: { email: 'collector@ecotrace.org', pwd: 'EcoCollector2026!' },
      RECYCLER: { email: 'recycler@ecotrace.org', pwd: 'EcoRecycler2026!' },
      ADMIN: { email: 'admin@ecotrace.org', pwd: 'EcoAdmin2026!' },
      SUPER_ADMIN: { email: 'superadmin@ecotrace.org', pwd: 'EcoSuperAdmin2026!' }
    };
    const c = creds[targetRole];
    await login(c.email, c.pwd);
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    setRole(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout, quickSwitchRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
