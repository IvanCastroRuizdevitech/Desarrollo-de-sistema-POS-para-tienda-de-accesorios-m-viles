import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { PlatformProvider } from './contexts/PlatformContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Ventas from './pages/Ventas';
import Gastos from './pages/Gastos';
import Reportes from './pages/Reportes';
import Administracion from './pages/Administracion';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import ToastManager from './components/ToastManager';

const App: React.FC = () => {
  return (
    <Router>
      <PlatformProvider>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <Routes>
                {/* Rutas de autenticación */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                </Route>

                {/* Rutas protegidas */}
                <Route element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/productos" element={<Productos />} />
                  <Route path="/ventas" element={<Ventas />} />
                  <Route path="/gastos" element={<Gastos />} />
                  <Route path="/reportes" element={<Reportes />} />
                  
                  {/* Rutas protegidas solo para administradores */}
                  <Route 
                    path="/administracion" 
                    element={
                      <ProtectedRoute requiredRole="administrador">
                        <Administracion />
                      </ProtectedRoute>
                    } 
                  />
                </Route>

                {/* Ruta de acceso no autorizado */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Ruta de página no encontrada */}
                <Route path="/404" element={<NotFound />} />
                
                {/* Redirección a dashboard si está en la raíz */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Redirección a 404 para cualquier otra ruta */}
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
              
              {/* Gestor de notificaciones toast */}
              <ToastManager />
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </PlatformProvider>
    </Router>
  );
};

export default App;

