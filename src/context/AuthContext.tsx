
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('paypulse_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('paypulse_user');
      }
    }
  }, []);

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      
      // Mock validation
      if (!email || !password) {
        setError('Email and password are required');
        return false;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      
      // For demo purposes - in reality this would be from an API
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'user'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('paypulse_user', JSON.stringify(mockUser));
      toast.success('Successfully logged in!');
      return true;
    } catch (err) {
      setError('Failed to login. Please try again.');
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('paypulse_user');
    toast.info('You have been logged out');
  };
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};
