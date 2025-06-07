import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePlatform } from './PlatformContext';
import { getApiBaseUrl } from '../utils/environment';

// Definir la URL base de la API
const API_URL = getApiBaseUrl();

// Definir interfaces para los tipos
interface User {
  id: number;
  username: string;
  nombre: string;
  email: string;
  rol: {
    id: number;
    nombre: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { storage } = usePlatform();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Intentar obtener el token del almacenamiento
        const savedToken = await storage.get<string>('token');
        
        if (!savedToken) {
          setIsLoading(false);
          return;
        }

        // Configurar el token en los headers de axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        
        // Obtener información del usuario
        const response = await axios.get(`${API_URL}/auth/profile`);
        setToken(savedToken);
        setUser(response.data);
      } catch (error) {
        console.error('Error al verificar el token:', error);
        await storage.delete('token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [storage]);

  // Función para iniciar sesión
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      const { access_token, user } = response.data;
      
      // Guardar el token en el almacenamiento
      await storage.set('token', access_token);
      
      // Configurar el token en los headers de axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setToken(access_token);
      setUser(user);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      setError(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    await storage.delete('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  // Valor del contexto
  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

