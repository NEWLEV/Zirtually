import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { User } from '../types';
import { IAuthService, LoginCredentials } from '../services/auth/types';
import { MockAuthService } from '../services/auth/MockAuthService';
import { SupabaseAuthService } from '../services/auth/SupabaseAuthService';
import { isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  users: User[]; // Kept for the mock user picker UI
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabase: boolean; // Flag to indicate if we're using real auth
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (
    credentials: LoginCredentials & { fullName: string; department: string }
  ) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Determine which service to use based on configuration
const authService: IAuthService = isSupabaseConfigured()
  ? new SupabaseAuthService()
  : new MockAuthService();

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        const allUsers = await authService.getUsers();
        setUser(currentUser);
        setUsers(allUsers);
      } catch (error) {
        console.error('Failed to initialize auth', error);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const signUp = useCallback(
    async (credentials: LoginCredentials & { fullName: string; department: string }) => {
      setIsLoading(true);
      try {
        if (authService.signUp) {
          const response = await authService.signUp(credentials);
          setUser(response.user);
        } else {
          throw new Error('Sign up is not supported by the current auth service.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateUser = useCallback(async (updatedUser: User) => {
    setIsLoading(true);
    try {
      const result = await authService.updateUser(updatedUser);
      setUser(result);
      // Also update the list if needed
      setUsers(prev => prev.map(u => (u.id === result.id ? result : u)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    users,
    isAuthenticated: !!user,
    isLoading,
    isSupabase: isSupabaseConfigured(),
    login,
    logout,
    signUp,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
