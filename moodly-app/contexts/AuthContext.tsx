import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  Mood: any;
}

interface AuthContextType {
  user: User | null;
  jwt: string | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  setAuthData: (jwt: string, user: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  jwt: null,
  isLoading: true,
  logout: async () => {},
  setAuthData: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedJwt = await AsyncStorage.getItem('jwt');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedJwt && storedUser) {
        setJwt(storedJwt);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('jwt');
      await AsyncStorage.removeItem('user');
      setJwt(null);
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const setAuthData = (newJwt: string, newUser: User) => {
    setJwt(newJwt);
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ user, jwt, isLoading, logout, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
}
