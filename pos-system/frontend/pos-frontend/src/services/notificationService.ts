import { alertService } from './api';
import { Notification } from '../contexts/NotificationContext';

class NotificationService {
  // Obtener alertas de bajo stock y convertirlas en notificaciones
  async getLowStockNotifications(tiendaId?: number): Promise<Notification[]> {
    try {
      let response;
      if (tiendaId) {
        response = await alertService.getLowStock();
      } else {
        // Si no se proporciona ID de tienda, obtener alertas de todas las tiendas
        response = await alertService.get('/alertas/bajo-stock');
      }
      
      const alerts = response.data.data;
      
      return alerts.map((alert: any) => ({
        id: alert.producto_id,
        title: 'Alerta de Stock',
        message: `El producto ${alert.nombre_producto} tiene un stock bajo (${alert.stock_actual} unidades) en la tienda ${alert.nombre_tienda}.`,
        type: 'warning' as const,
        read: false,
        createdAt: new Date().toISOString(),
        link: '/productos'
      }));
    } catch (error) {
      console.error('Error al obtener notificaciones de bajo stock:', error);
      return [];
    }
  }

  // Obtener alertas de stock cero y convertirlas en notificaciones
  async getStockZeroNotifications(): Promise<Notification[]> {
    try {
      const response = await alertService.get('/alertas/stock-cero');
      const alerts = response.data.data;
      
      return alerts.map((alert: any) => ({
        id: `zero-${alert.producto_id}`,
        title: 'Stock Agotado',
        message: `El producto ${alert.nombre_producto} está agotado en la tienda ${alert.nombre_tienda}.`,
        type: 'error' as const,
        read: false,
        createdAt: new Date().toISOString(),
        link: '/productos'
      }));
    } catch (error) {
      console.error('Error al obtener notificaciones de stock cero:', error);
      return [];
    }
  }

  // Obtener alertas de productos sin movimiento y convertirlas en notificaciones
  async getNoMovementNotifications(dias: number = 30): Promise<Notification[]> {
    try {
      const response = await alertService.get(`/alertas/sin-movimiento?dias=${dias}`);
      const alerts = response.data.data;
      
      return alerts.map((alert: any) => ({
        id: `nomov-${alert.producto_id}`,
        title: 'Producto sin Movimiento',
        message: `El producto ${alert.nombre_producto} no ha tenido movimiento en los últimos ${dias} días.`,
        type: 'info' as const,
        read: false,
        createdAt: new Date().toISOString(),
        link: '/productos'
      }));
    } catch (error) {
      console.error('Error al obtener notificaciones de productos sin movimiento:', error);
      return [];
    }
  }

  // Obtener todas las notificaciones combinadas
  async getAllNotifications(tiendaId?: number): Promise<Notification[]> {
    try {
      const [lowStockNotifications, stockZeroNotifications, noMovementNotifications] = await Promise.all([
        this.getLowStockNotifications(tiendaId),
        this.getStockZeroNotifications(),
        this.getNoMovementNotifications()
      ]);
      
      // Combinar todas las notificaciones
      const allNotifications = [
        ...lowStockNotifications,
        ...stockZeroNotifications,
        ...noMovementNotifications
      ];
      
      // Ordenar por fecha (más recientes primero)
      allNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return allNotifications;
    } catch (error) {
      console.error('Error al obtener todas las notificaciones:', error);
      return [];
    }
  }

  // Crear una notificación para una venta nueva
  createSaleNotification(sale: any): Notification {
    return {
      id: `sale-${sale.id}`,
      title: 'Nueva Venta Registrada',
      message: `Se ha registrado una nueva venta por $${sale.total.toFixed(2)} en la tienda ${sale.tienda.nombre}.`,
      type: 'success',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/ventas'
    };
  }

  // Crear una notificación para un gasto nuevo
  createExpenseNotification(expense: any): Notification {
    return {
      id: `expense-${expense.id}`,
      title: 'Nuevo Gasto Registrado',
      message: `Se ha registrado un nuevo gasto por $${expense.total.toFixed(2)} en la tienda ${expense.tienda.nombre}.`,
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/gastos'
    };
  }

  // Crear una notificación personalizada
  createCustomNotification(title: string, message: string, type: 'info' | 'warning' | 'error' | 'success', link?: string): Notification {
    return {
      id: Date.now(),
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      link
    };
  }
}

export const notificationService = new NotificationService();

