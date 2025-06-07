/**
 * Pruebas para el sistema de notificaciones
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationProvider, useNotifications } from '../contexts/NotificationContext';
import NotificationCenter from '../components/NotificationCenter';
import ToastManager from '../components/ToastManager';
import { BrowserRouter } from 'react-router-dom';

// Componente de prueba para usar el hook de notificaciones
const TestComponent = () => {
  const { addNotification, notifications, unreadCount } = useNotifications();
  
  const handleAddInfoNotification = () => {
    addNotification({
      title: 'Notificación de información',
      message: 'Esta es una notificación de prueba de tipo info',
      type: 'info'
    });
  };
  
  const handleAddWarningNotification = () => {
    addNotification({
      title: 'Notificación de advertencia',
      message: 'Esta es una notificación de prueba de tipo warning',
      type: 'warning'
    });
  };
  
  const handleAddErrorNotification = () => {
    addNotification({
      title: 'Notificación de error',
      message: 'Esta es una notificación de prueba de tipo error',
      type: 'error'
    });
  };
  
  const handleAddSuccessNotification = () => {
    addNotification({
      title: 'Notificación de éxito',
      message: 'Esta es una notificación de prueba de tipo success',
      type: 'success'
    });
  };
  
  return (
    <div>
      <h1>Prueba de Notificaciones</h1>
      <p>Notificaciones no leídas: {unreadCount}</p>
      <p>Total de notificaciones: {notifications.length}</p>
      
      <button onClick={handleAddInfoNotification}>Añadir notificación info</button>
      <button onClick={handleAddWarningNotification}>Añadir notificación warning</button>
      <button onClick={handleAddErrorNotification}>Añadir notificación error</button>
      <button onClick={handleAddSuccessNotification}>Añadir notificación success</button>
      
      <NotificationCenter />
      <ToastManager />
    </div>
  );
};

// Wrapper para los componentes de prueba
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <NotificationProvider>
      {children}
    </NotificationProvider>
  </BrowserRouter>
);

describe('Sistema de Notificaciones', () => {
  test('Debe mostrar el centro de notificaciones', () => {
    render(
      <TestWrapper>
        <NotificationCenter />
      </TestWrapper>
    );
    
    // Verificar que el botón de notificaciones existe
    const notificationButton = screen.getByRole('button');
    expect(notificationButton).toBeInTheDocument();
  });
  
  test('Debe añadir una notificación y actualizar el contador', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    
    // Verificar que inicialmente no hay notificaciones
    expect(screen.getByText('Notificaciones no leídas: 0')).toBeInTheDocument();
    
    // Añadir una notificación
    fireEvent.click(screen.getByText('Añadir notificación info'));
    
    // Verificar que el contador se actualiza
    await waitFor(() => {
      expect(screen.getByText('Notificaciones no leídas: 1')).toBeInTheDocument();
    });
  });
  
  test('Debe mostrar diferentes tipos de notificaciones', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    
    // Añadir diferentes tipos de notificaciones
    fireEvent.click(screen.getByText('Añadir notificación info'));
    fireEvent.click(screen.getByText('Añadir notificación warning'));
    fireEvent.click(screen.getByText('Añadir notificación error'));
    fireEvent.click(screen.getByText('Añadir notificación success'));
    
    // Verificar que el contador se actualiza
    await waitFor(() => {
      expect(screen.getByText('Notificaciones no leídas: 4')).toBeInTheDocument();
    });
    
    // Abrir el centro de notificaciones
    const notificationButton = screen.getAllByRole('button')[4]; // El quinto botón es el de notificaciones
    fireEvent.click(notificationButton);
    
    // Verificar que se muestran las notificaciones
    await waitFor(() => {
      expect(screen.getByText('Notificación de información')).toBeInTheDocument();
      expect(screen.getByText('Notificación de advertencia')).toBeInTheDocument();
      expect(screen.getByText('Notificación de error')).toBeInTheDocument();
      expect(screen.getByText('Notificación de éxito')).toBeInTheDocument();
    });
  });
});

// Pruebas para el gestor de notificaciones toast
describe('Gestor de Notificaciones Toast', () => {
  test('Debe mostrar notificaciones toast', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );
    
    // Añadir una notificación
    fireEvent.click(screen.getByText('Añadir notificación success'));
    
    // Verificar que se muestra la notificación toast
    await waitFor(() => {
      expect(screen.getByText('Notificación de éxito')).toBeInTheDocument();
      expect(screen.getByText('Esta es una notificación de prueba de tipo success')).toBeInTheDocument();
    });
  });
});

