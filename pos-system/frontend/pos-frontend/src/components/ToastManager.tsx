import React, { useState, useEffect } from 'react';
import { useNotifications, Notification } from '../contexts/NotificationContext';
import NotificationToast from './NotificationToast';

const ToastManager: React.FC = () => {
  const { notifications, markAsRead } = useNotifications();
  const [activeToasts, setActiveToasts] = useState<Notification[]>([]);
  const [queue, setQueue] = useState<Notification[]>([]);
  
  // Máximo número de toasts visibles simultáneamente
  const MAX_TOASTS = 3;
  
  // Procesar nuevas notificaciones
  useEffect(() => {
    // Filtrar solo notificaciones no leídas y que no estén ya en la cola o activas
    const newNotifications = notifications.filter(
      notification => 
        !notification.read && 
        !queue.some(q => q.id === notification.id) &&
        !activeToasts.some(t => t.id === notification.id)
    );
    
    if (newNotifications.length > 0) {
      setQueue(prev => [...prev, ...newNotifications]);
    }
  }, [notifications]);
  
  // Procesar la cola de notificaciones
  useEffect(() => {
    if (queue.length > 0 && activeToasts.length < MAX_TOASTS) {
      // Tomar la primera notificación de la cola
      const nextToast = queue[0];
      
      // Eliminarla de la cola
      setQueue(prev => prev.slice(1));
      
      // Añadirla a los toasts activos
      setActiveToasts(prev => [...prev, nextToast]);
    }
  }, [queue, activeToasts]);
  
  // Manejar el cierre de un toast
  const handleCloseToast = (id: number | string) => {
    // Marcar la notificación como leída
    markAsRead(id);
    
    // Eliminar de los toasts activos
    setActiveToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  return (
    <>
      {activeToasts.map(toast => (
        <NotificationToast
          key={toast.id}
          notification={toast}
          onClose={() => handleCloseToast(toast.id)}
          autoHideDuration={6000}
        />
      ))}
    </>
  );
};

export default ToastManager;

