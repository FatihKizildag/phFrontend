import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  sex: string;
  phone_number: string;
  dob: string;
  email: string;
  userType: string;
  reservations: string[];
  comments: string[];
  favorites: string[];
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  city: string;
  country: string;
  userPoint: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
  
        if (token && storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Authentication failed:', error);
      } finally {
        setLoading(false);
      }
    };
  
    checkAuth();
  }, []);
  

  const login = async (credentials: { email: string; password: string }) => {
    console.log('Attempting login...');
    try {
      const response = await fetch('https://phbackend-9rp2.onrender.com/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      if (response.ok) {
        const loginData = await response.json();
        const token = loginData.tokens.acces_token;
  
        // console.log('Login successful, token:', token);
        // console.log('Login response:', loginData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(loginData));
        localStorage.setItem('isLoggedIn', 'true');
        // console.log('localStorage token:', localStorage.getItem('token'));
        setUser(loginData);
        navigate('/signedLand');
      } else {
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.clear(); 
    navigate('/'); 
  };
  

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth};
