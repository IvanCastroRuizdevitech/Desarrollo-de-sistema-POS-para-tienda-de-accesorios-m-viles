import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getApiBaseUrl } from '../utils/environment';

// Configuración base para axios
const API_URL = getApiBaseUrl();

// Crear instancia de axios con configuración base
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación a las peticiones
axiosInstance.interceptors.request.use(
  async (config) => {
    // Intentar obtener el token del localStorage (para compatibilidad con versiones anteriores)
    // En una implementación completa, esto debería usar el adaptador de almacenamiento
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores de autenticación (401)
    if (error.response && error.response.status === 401) {
      // Si no estamos en la página de login, redirigir
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Interfaz genérica para respuestas de la API
interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

// Clase base para servicios de API
class ApiService {
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return axiosInstance.get<ApiResponse<T>>(url, config);
  }

  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return axiosInstance.post<ApiResponse<T>>(url, data, config);
  }

  protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return axiosInstance.put<ApiResponse<T>>(url, data, config);
  }

  protected async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return axiosInstance.patch<ApiResponse<T>>(url, data, config);
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return axiosInstance.delete<ApiResponse<T>>(url, config);
  }
}

// Servicio de autenticación
class AuthService extends ApiService {
  async login(email: string, password: string) {
    return this.post<{ token: string; user: any }>('/auth/login', { email, password });
  }

  async register(userData: any) {
    return this.post<{ token: string; user: any }>('/auth/register', userData);
  }

  async getProfile() {
    return this.get<any>('/auth/profile');
  }

  async changePassword(oldPassword: string, newPassword: string) {
    return this.post<any>('/auth/change-password', { oldPassword, newPassword });
  }
}

// Servicio de usuarios
class UserService extends ApiService {
  async getAll() {
    return this.get<any[]>('/usuarios');
  }

  async getById(id: number) {
    return this.get<any>(`/usuarios/${id}`);
  }

  async create(userData: any) {
    return this.post<any>('/usuarios', userData);
  }

  async update(id: number, userData: any) {
    return this.put<any>(`/usuarios/${id}`, userData);
  }

  async delete(id: number) {
    return this.delete<any>(`/usuarios/${id}`);
  }

  async toggleActive(id: number) {
    return this.patch<any>(`/usuarios/${id}/toggle-active`);
  }
}

// Servicio de roles
class RoleService extends ApiService {
  async getAll() {
    return this.get<any[]>('/roles');
  }

  async getById(id: number) {
    return this.get<any>(`/roles/${id}`);
  }

  async create(roleData: any) {
    return this.post<any>('/roles', roleData);
  }

  async update(id: number, roleData: any) {
    return this.put<any>(`/roles/${id}`, roleData);
  }

  async delete(id: number) {
    return this.delete<any>(`/roles/${id}`);
  }
}

// Servicio de compañías
class CompanyService extends ApiService {
  async getAll() {
    return this.get<any[]>('/companias');
  }

  async getById(id: number) {
    return this.get<any>(`/companias/${id}`);
  }

  async create(companyData: any) {
    return this.post<any>('/companias', companyData);
  }

  async update(id: number, companyData: any) {
    return this.put<any>(`/companias/${id}`, companyData);
  }

  async delete(id: number) {
    return this.delete<any>(`/companias/${id}`);
  }
}

// Servicio de tiendas
class StoreService extends ApiService {
  async getAll() {
    return this.get<any[]>('/tiendas');
  }

  async getById(id: number) {
    return this.get<any>(`/tiendas/${id}`);
  }

  async getByCompany(companyId: number) {
    return this.get<any[]>(`/tiendas/company/${companyId}`);
  }

  async create(storeData: any) {
    return this.post<any>('/tiendas', storeData);
  }

  async update(id: number, storeData: any) {
    return this.put<any>(`/tiendas/${id}`, storeData);
  }

  async delete(id: number) {
    return this.delete<any>(`/tiendas/${id}`);
  }
}

// Servicio de productos
class ProductService extends ApiService {
  async getAll() {
    return this.get<any[]>('/productos');
  }

  async getById(id: number) {
    return this.get<any>(`/productos/${id}`);
  }

  async create(productData: any) {
    return this.post<any>('/productos', productData);
  }

  async update(id: number, productData: any) {
    return this.put<any>(`/productos/${id}`, productData);
  }

  async delete(id: number) {
    return this.delete<any>(`/productos/${id}`);
  }

  async getUnits() {
    return this.get<any[]>('/productos/unidades');
  }

  async getTaxes() {
    return this.get<any[]>('/productos/impuestos');
  }
}

// Servicio de inventario
class InventoryService extends ApiService {
  async getAll() {
    return this.get<any[]>('/inventario');
  }

  async getByStore(storeId: number) {
    return this.get<any[]>(`/inventario/tienda/${storeId}`);
  }

  async getByProduct(productId: number) {
    return this.get<any[]>(`/inventario/producto/${productId}`);
  }

  async getById(id: number) {
    return this.get<any>(`/inventario/${id}`);
  }

  async update(id: number, inventoryData: any) {
    return this.put<any>(`/inventario/${id}`, inventoryData);
  }

  async getLowStock() {
    return this.get<any[]>('/inventario/bajo-stock');
  }
}

// Servicio de kardex
class KardexService extends ApiService {
  async getAll() {
    return this.get<any[]>('/kardex');
  }

  async getByProduct(productId: number) {
    return this.get<any[]>(`/kardex/producto/${productId}`);
  }

  async getByStore(storeId: number) {
    return this.get<any[]>(`/kardex/tienda/${storeId}`);
  }

  async create(kardexData: any) {
    return this.post<any>('/kardex', kardexData);
  }
}

// Servicio de ventas
class SaleService extends ApiService {
  async getAll() {
    return this.get<any[]>('/ventas');
  }

  async getById(id: number) {
    return this.get<any>(`/ventas/${id}`);
  }

  async getByStore(storeId: number) {
    return this.get<any[]>(`/ventas/tienda/${storeId}`);
  }

  async getByUser(userId: number) {
    return this.get<any[]>(`/ventas/usuario/${userId}`);
  }

  async getByDateRange(startDate: string, endDate: string) {
    return this.get<any[]>(`/ventas/fecha?inicio=${startDate}&fin=${endDate}`);
  }

  async create(saleData: any) {
    return this.post<any>('/ventas', saleData);
  }

  async cancel(id: number) {
    return this.patch<any>(`/ventas/${id}/cancelar`);
  }

  async getPaymentMethods() {
    return this.get<any[]>('/metodos-pago');
  }
}

// Servicio de gastos
class ExpenseService extends ApiService {
  async getAll() {
    return this.get<any[]>('/gastos');
  }

  async getById(id: number) {
    return this.get<any>(`/gastos/${id}`);
  }

  async getByStore(storeId: number) {
    return this.get<any[]>(`/gastos/tienda/${storeId}`);
  }

  async getByDateRange(startDate: string, endDate: string) {
    return this.get<any[]>(`/gastos/fecha?inicio=${startDate}&fin=${endDate}`);
  }

  async create(expenseData: any) {
    return this.post<any>('/gastos', expenseData);
  }

  async update(id: number, expenseData: any) {
    return this.put<any>(`/gastos/${id}`, expenseData);
  }

  async delete(id: number) {
    return this.delete<any>(`/gastos/${id}`);
  }
}

// Servicio de reportes
class ReportService extends ApiService {
  async getSalesByPeriod(period: 'day' | 'week' | 'month' | 'year', storeId?: number) {
    let url = `/reportes/ventas/${period}`;
    if (storeId) {
      url += `?tiendaId=${storeId}`;
    }
    return this.get<any[]>(url);
  }

  async getExpensesByPeriod(period: 'day' | 'week' | 'month' | 'year', storeId?: number) {
    let url = `/reportes/gastos/${period}`;
    if (storeId) {
      url += `?tiendaId=${storeId}`;
    }
    return this.get<any[]>(url);
  }

  async getBalanceByPeriod(period: 'day' | 'week' | 'month' | 'year', storeId?: number) {
    let url = `/reportes/balance/${period}`;
    if (storeId) {
      url += `?tiendaId=${storeId}`;
    }
    return this.get<any[]>(url);
  }

  async getTopProducts(limit: number = 10, storeId?: number) {
    let url = `/reportes/productos/top?limite=${limit}`;
    if (storeId) {
      url += `&tiendaId=${storeId}`;
    }
    return this.get<any[]>(url);
  }

  async getInventoryStatus(storeId?: number) {
    let url = `/reportes/inventario/estado`;
    if (storeId) {
      url += `?tiendaId=${storeId}`;
    }
    return this.get<any[]>(url);
  }

  async exportSales(format: 'pdf' | 'csv', startDate: string, endDate: string, storeId?: number) {
    let url = `/reportes/ventas/exportar?formato=${format}&inicio=${startDate}&fin=${endDate}`;
    if (storeId) {
      url += `&tiendaId=${storeId}`;
    }
    return this.get<any>(url, { responseType: 'blob' as any });
  }

  async exportExpenses(format: 'pdf' | 'csv', startDate: string, endDate: string, storeId?: number) {
    let url = `/reportes/gastos/exportar?formato=${format}&inicio=${startDate}&fin=${endDate}`;
    if (storeId) {
      url += `&tiendaId=${storeId}`;
    }
    return this.get<any>(url, { responseType: 'blob' as any });
  }

  async exportInventory(format: 'pdf' | 'csv', storeId?: number) {
    let url = `/reportes/inventario/exportar?formato=${format}`;
    if (storeId) {
      url += `&tiendaId=${storeId}`;
    }
    return this.get<any>(url, { responseType: 'blob' as any });
  }
}

// Servicio de alertas
class AlertService extends ApiService {
  async getAll() {
    return this.get<any[]>('/alertas');
  }

  async getLowStock() {
    return this.get<any[]>('/alertas/bajo-stock');
  }

  async markAsRead(id: number) {
    return this.patch<any>(`/alertas/${id}/leida`);
  }

  async markAllAsRead() {
    return this.patch<any>('/alertas/todas-leidas');
  }
}

// Instancias de los servicios
export const authService = new AuthService();
export const userService = new UserService();
export const roleService = new RoleService();
export const companyService = new CompanyService();
export const storeService = new StoreService();
export const productService = new ProductService();
export const inventoryService = new InventoryService();
export const kardexService = new KardexService();
export const saleService = new SaleService();
export const expenseService = new ExpenseService();
export const reportService = new ReportService();
export const alertService = new AlertService();

export default axiosInstance;

