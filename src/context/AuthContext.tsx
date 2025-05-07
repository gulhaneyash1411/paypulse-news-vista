
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
  signup: (name: string, email: string, password: string) => Promise<boolean>;
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

  // Sign up function
  const signup = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      
      // Mock validation
      if (!name || !email || !password) {
        setError('All fields are required');
        return false;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
      
      // Check if user already exists in local storage (for demo purposes)
      const usersStr = localStorage.getItem('paypulse_users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      if (users.some((u: any) => u.email === email)) {
        setError('Email already in use');
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: email.includes('admin') ? 'admin' : 'user'
      };
      
      // Store user in "database" (localStorage)
      users.push({...newUser, password});
      localStorage.setItem('paypulse_users', JSON.stringify(users));
      
      toast.success('Account created successfully! You can now log in.');
      return true;
    } catch (err) {
      setError('Failed to create account. Please try again.');
      return false;
    }
  };

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      
      // Mock validation
      if (!email || !password) {
        setError('Email and password are required');
        return false;
      }
      
      // Check against "database" (localStorage)
      const usersStr = localStorage.getItem('paypulse_users');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (!foundUser) {
        setError('Invalid email or password');
        return false;
      }
      
      // Create user without password
      const loggedInUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role
      };
      
      setUser(loggedInUser);
      setIsAuthenticated(true);
      localStorage.setItem('paypulse_user', JSON.stringify(loggedInUser));
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
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};
