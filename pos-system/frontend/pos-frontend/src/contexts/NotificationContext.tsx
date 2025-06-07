import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';

// Definir interfaces para los tipos
export interface Notification {
  id: number | string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: number | string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: number | string) => void;
  clearNotifications: () => void;
  fetchNotifications: () => Promise<void>;
}

// Crear el contexto
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Proveedor del contexto
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  
  // Calcular el número de notificaciones no leídas
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Cargar notificaciones al iniciar y cuando cambia el usuario
  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Configurar un intervalo para verificar nuevas notificaciones cada 5 minutos
      const intervalId = setInterval(() => {
        fetchNotifications();
      }, 5 * 60 * 1000);
      
      return () => clearInterval(intervalId);
    }
  }, [user]);

  // Función para obtener notificaciones del servidor
  const fetchNotifications = async () => {
    try {
      if (!user) return;
      
      // Obtener la tienda del usuario actual (si está disponible)
      const tiendaId = user.tienda_id;
      
      // Obtener todas las notificaciones
      const allNotifications = await notificationService.getAllNotifications(tiendaId);
      
      setNotifications(allNotifications);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    }
  };

  // Función para agregar una nueva notificación
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(), // Usar timestamp como ID temporal
      read: false,
      createdAt: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Mostrar notificación nativa del sistema si está soportado
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo192.png'
      });
    }
  };

  // Función para marcar una notificación como leída
  const markAsRead = (id: number | string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Función para marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Función para eliminar una notificación
  const removeNotification = (id: number | string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Función para eliminar todas las notificaciones
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Solicitar permiso para notificaciones nativas al cargar
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  // Valor del contexto
  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
    fetchNotifications
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications debe ser usado dentro de un NotificationProvider');
  }
  return context;
};

