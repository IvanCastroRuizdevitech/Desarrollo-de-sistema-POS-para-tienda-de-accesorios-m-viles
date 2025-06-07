# Documentación Técnica - Sistema POS para Tienda de Accesorios Móviles

**Autor:** Manus AI  
**Fecha:** 6 de junio de 2025  
**Versión:** 1.0

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Backend (NestJS)](#backend-nestjs)
4. [Frontend (ReactJS + Electron)](#frontend-reactjs--electron)
5. [Base de Datos (PostgreSQL)](#base-de-datos-postgresql)
6. [Seguridad](#seguridad)
7. [Despliegue](#despliegue)
8. [Mantenimiento](#mantenimiento)
9. [Referencias](#referencias)

## Introducción

Este documento proporciona la documentación técnica completa del Sistema POS (Point of Sale) desarrollado para tiendas de accesorios móviles. El sistema está diseñado para gestionar eficientemente las operaciones diarias de una tienda, incluyendo ventas, inventario, gastos y reportes.

### Propósito

El propósito de este sistema es proporcionar una solución integral para la gestión de tiendas de accesorios móviles, permitiendo:

- Gestión de ventas con múltiples métodos de pago
- Control de inventario con sistema Kardex
- Gestión de gastos y reportes financieros
- Administración de usuarios con diferentes roles
- Gestión de múltiples tiendas asociadas a una compañía

### Alcance

El sistema abarca todas las operaciones esenciales de una tienda de accesorios móviles, desde la gestión de productos e inventario hasta la realización de ventas y generación de reportes. Está diseñado para ser utilizado por diferentes tipos de usuarios, como vendedores y administradores, con diferentes niveles de acceso y funcionalidades.

### Tecnologías Utilizadas

El sistema ha sido desarrollado utilizando las siguientes tecnologías:

- **Backend**: NestJS, Node.js, TypeORM
- **Frontend**: ReactJS, Material UI, Electron
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT (JSON Web Tokens)
- **Documentación API**: Swagger
- **Pruebas**: Jest, Supertest, Puppeteer

## Arquitectura del Sistema

El sistema sigue una arquitectura de tres capas:

1. **Capa de Presentación**: Implementada con ReactJS y Electron para proporcionar una interfaz de usuario intuitiva y responsiva.
2. **Capa de Lógica de Negocio**: Implementada con NestJS para manejar la lógica de negocio y las reglas de la aplicación.
3. **Capa de Datos**: Implementada con PostgreSQL para almacenar y gestionar los datos del sistema.

### Diagrama de Arquitectura

```
+----------------------------------+
|                                  |
|  Frontend (ReactJS + Electron)   |
|                                  |
+----------------+----------------+
                 |
                 | HTTP/REST
                 |
+----------------v----------------+
|                                  |
|      Backend (NestJS)            |
|                                  |
+----------------+----------------+
                 |
                 | TypeORM
                 |
+----------------v----------------+
|                                  |
|      Base de Datos (PostgreSQL)  |
|                                  |
+----------------------------------+
```

### Comunicación entre Componentes

La comunicación entre el frontend y el backend se realiza mediante una API RESTful. El backend expone endpoints que el frontend consume para realizar operaciones como autenticación, gestión de productos, ventas, etc.

La comunicación entre el backend y la base de datos se realiza mediante TypeORM, un ORM (Object-Relational Mapping) que facilita la interacción con la base de datos PostgreSQL.

### Patrones de Diseño

El sistema implementa varios patrones de diseño para garantizar una arquitectura robusta y mantenible:

- **Patrón Repositorio**: Para abstraer la lógica de acceso a datos.
- **Patrón Servicio**: Para encapsular la lógica de negocio.
- **Patrón Controlador**: Para manejar las solicitudes HTTP y delegar el procesamiento a los servicios.
- **Patrón Inyección de Dependencias**: Para desacoplar componentes y facilitar las pruebas.
- **Patrón Observador**: Para implementar notificaciones y alertas en tiempo real.

## Backend (NestJS)

El backend del sistema está desarrollado con NestJS, un framework para construir aplicaciones del lado del servidor en Node.js. NestJS proporciona una arquitectura que facilita la creación de aplicaciones escalables y mantenibles.

### Estructura de Directorios

```
backend/
├── src/
│   ├── common/           # Utilidades, filtros, interceptores, etc.
│   ├── config/           # Configuraciones del sistema
│   ├── modules/          # Módulos de la aplicación
│   │   ├── auth/         # Autenticación y autorización
│   │   ├── usuarios/     # Gestión de usuarios
│   │   ├── roles/        # Gestión de roles
│   │   ├── productos/    # Gestión de productos
│   │   ├── inventario/   # Gestión de inventario
│   │   ├── kardex/       # Sistema Kardex
│   │   ├── ventas/       # Gestión de ventas
│   │   ├── gastos/       # Gestión de gastos
│   │   ├── reportes/     # Generación de reportes
│   │   └── alertas/      # Sistema de alertas
│   ├── app.module.ts     # Módulo principal
│   └── main.ts           # Punto de entrada
├── test/                 # Pruebas
└── package.json          # Dependencias
```

### Módulos Principales

#### Módulo de Autenticación

El módulo de autenticación maneja el registro, inicio de sesión y gestión de sesiones de los usuarios. Utiliza JWT (JSON Web Tokens) para la autenticación y Passport para la implementación de estrategias de autenticación.

```typescript
// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const usuario = await this.usuariosService.findByEmail(email);
    if (usuario && await bcrypt.compare(password, usuario.password)) {
      const { password, ...result } = usuario;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, rol: user.rol.nombre };
    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }
}
```

#### Módulo de Usuarios

El módulo de usuarios maneja la creación, actualización y eliminación de usuarios del sistema. También gestiona la asignación de roles a los usuarios.

```typescript
// usuarios.service.ts
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private rolesRepository: Repository<Rol>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find({
      relations: ['rol'],
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      relations: ['rol'],
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { rol_id, ...usuarioData } = createUsuarioDto;
    
    const rol = await this.rolesRepository.findOne({
      where: { id: rol_id },
    });
    
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${rol_id} no encontrado`);
    }
    
    const hashedPassword = await bcrypt.hash(usuarioData.password, 10);
    
    const usuario = this.usuariosRepository.create({
      ...usuarioData,
      password: hashedPassword,
      rol,
    });
    
    return this.usuariosRepository.save(usuario);
  }
}
```

#### Módulo de Productos e Inventario

El módulo de productos e inventario maneja la gestión de productos, unidades, impuestos y el control de inventario. También implementa el sistema Kardex para el seguimiento de movimientos de inventario.

```typescript
// inventario.service.ts
@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
    @InjectRepository(Tienda)
    private tiendasRepository: Repository<Tienda>,
    private kardexService: KardexService,
  ) {}

  async actualizarInventario(
    productoId: number,
    tiendaId: number,
    cantidad: number,
    tipoMovimiento: TipoMovimiento,
    descripcion: string,
    precioUnitario: number,
  ): Promise<Inventario> {
    const inventario = await this.inventarioRepository.findOne({
      where: {
        producto: { id: productoId },
        tienda: { id: tiendaId },
      },
      relations: ['producto', 'tienda'],
    });

    if (!inventario) {
      throw new NotFoundException(`Inventario para producto ${productoId} en tienda ${tiendaId} no encontrado`);
    }

    // Actualizar cantidad según tipo de movimiento
    if (tipoMovimiento === TipoMovimiento.ENTRADA) {
      inventario.cantidad += cantidad;
    } else if (tipoMovimiento === TipoMovimiento.SALIDA || tipoMovimiento === TipoMovimiento.VENTA) {
      if (inventario.cantidad < cantidad) {
        throw new BadRequestException(`Stock insuficiente. Disponible: ${inventario.cantidad}`);
      }
      inventario.cantidad -= cantidad;
    }

    // Registrar movimiento en kardex
    await this.kardexService.create({
      producto_id: productoId,
      tienda_id: tiendaId,
      tipo_movimiento: tipoMovimiento,
      cantidad,
      precio_unitario: precioUnitario,
      descripcion,
    });

    // Verificar stock mínimo y generar alerta si es necesario
    if (inventario.cantidad <= inventario.producto.stock_minimo) {
      // Lógica para generar alerta de bajo stock
    }

    return this.inventarioRepository.save(inventario);
  }
}
```

#### Módulo de Ventas

El módulo de ventas maneja la creación y gestión de ventas, incluyendo la actualización automática del inventario y el registro de movimientos en el kardex.

```typescript
// ventas.service.ts
@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventasRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detallesRepository: Repository<DetalleVenta>,
    private inventarioService: InventarioService,
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    const { detalles, ...ventaData } = createVentaDto;
    
    // Crear la venta
    const venta = this.ventasRepository.create(ventaData);
    const ventaGuardada = await this.ventasRepository.save(venta);
    
    // Crear los detalles de la venta
    const detallesVenta = [];
    let total = 0;
    
    for (const detalle of detalles) {
      const subtotal = detalle.cantidad * detalle.precio_unitario * (1 - detalle.descuento / 100);
      total += subtotal;
      
      const detalleVenta = this.detallesRepository.create({
        ...detalle,
        venta: ventaGuardada,
        subtotal,
      });
      
      detallesVenta.push(await this.detallesRepository.save(detalleVenta));
      
      // Actualizar inventario
      await this.inventarioService.actualizarInventario(
        detalle.producto_id,
        ventaData.tienda_id,
        detalle.cantidad,
        TipoMovimiento.VENTA,
        `Venta #${ventaGuardada.id}`,
        detalle.precio_unitario,
      );
    }
    
    // Actualizar el total de la venta
    ventaGuardada.total = total;
    ventaGuardada.detalles = detallesVenta;
    
    return this.ventasRepository.save(ventaGuardada);
  }
}
```

#### Módulo de Reportes

El módulo de reportes maneja la generación de reportes de ventas, gastos, inventario y balance financiero.

```typescript
// reportes.service.ts
@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Venta)
    private ventasRepository: Repository<Venta>,
    @InjectRepository(Gasto)
    private gastosRepository: Repository<Gasto>,
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
  ) {}

  async getVentasByPeriod(period: string, tiendaId?: number): Promise<any[]> {
    const query = this.ventasRepository.createQueryBuilder('venta')
      .select(`DATE_TRUNC('${period}', venta.fecha)`, 'periodo')
      .addSelect('SUM(venta.total)', 'total')
      .addSelect('COUNT(venta.id)', 'cantidad')
      .where('venta.estado = :estado', { estado: 'Completada' })
      .groupBy('periodo')
      .orderBy('periodo', 'ASC');
    
    if (tiendaId) {
      query.andWhere('venta.tienda_id = :tiendaId', { tiendaId });
    }
    
    return query.getRawMany();
  }

  async getBalanceByPeriod(period: string, tiendaId?: number): Promise<any[]> {
    const ventas = await this.getVentasByPeriod(period, tiendaId);
    const gastos = await this.getGastosByPeriod(period, tiendaId);
    
    // Combinar ventas y gastos por período
    const periodos = new Map();
    
    ventas.forEach(venta => {
      periodos.set(venta.periodo, {
        periodo: venta.periodo,
        ingresos: parseFloat(venta.total),
        gastos: 0,
        balance: parseFloat(venta.total),
      });
    });
    
    gastos.forEach(gasto => {
      if (periodos.has(gasto.periodo)) {
        const periodo = periodos.get(gasto.periodo);
        periodo.gastos = parseFloat(gasto.total);
        periodo.balance = periodo.ingresos - periodo.gastos;
      } else {
        periodos.set(gasto.periodo, {
          periodo: gasto.periodo,
          ingresos: 0,
          gastos: parseFloat(gasto.total),
          balance: -parseFloat(gasto.total),
        });
      }
    });
    
    return Array.from(periodos.values());
  }
}
```

### API RESTful

El backend expone una API RESTful para que el frontend pueda consumir los servicios. La API está documentada con Swagger, lo que facilita su comprensión y uso.

#### Endpoints Principales

- **Autenticación**:
  - `POST /api/auth/login`: Iniciar sesión
  - `POST /api/auth/register`: Registrar nuevo usuario
  - `GET /api/auth/profile`: Obtener perfil del usuario autenticado

- **Usuarios**:
  - `GET /api/usuarios`: Obtener todos los usuarios
  - `GET /api/usuarios/:id`: Obtener un usuario por ID
  - `POST /api/usuarios`: Crear un nuevo usuario
  - `PUT /api/usuarios/:id`: Actualizar un usuario
  - `DELETE /api/usuarios/:id`: Eliminar un usuario

- **Productos**:
  - `GET /api/productos`: Obtener todos los productos
  - `GET /api/productos/:id`: Obtener un producto por ID
  - `POST /api/productos`: Crear un nuevo producto
  - `PUT /api/productos/:id`: Actualizar un producto
  - `DELETE /api/productos/:id`: Eliminar un producto

- **Inventario**:
  - `GET /api/inventario`: Obtener todo el inventario
  - `GET /api/inventario/producto/:id`: Obtener inventario por producto
  - `GET /api/inventario/tienda/:id`: Obtener inventario por tienda
  - `POST /api/inventario`: Crear una entrada de inventario
  - `PUT /api/inventario/:id`: Actualizar una entrada de inventario

- **Ventas**:
  - `GET /api/ventas`: Obtener todas las ventas
  - `GET /api/ventas/:id`: Obtener una venta por ID
  - `POST /api/ventas`: Crear una nueva venta
  - `PATCH /api/ventas/:id/cancelar`: Cancelar una venta

- **Reportes**:
  - `GET /api/reportes/ventas/:period`: Obtener reporte de ventas por período
  - `GET /api/reportes/gastos/:period`: Obtener reporte de gastos por período
  - `GET /api/reportes/balance/:period`: Obtener balance por período
  - `GET /api/reportes/productos/top`: Obtener productos más vendidos

### Validación y Manejo de Errores

El backend implementa validación de datos y manejo de errores para garantizar la integridad de los datos y proporcionar mensajes de error claros al frontend.

```typescript
// http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof exceptionResponse === 'object' && 'message' in exceptionResponse
        ? exceptionResponse['message']
        : exception.message,
    };
    
    response.status(status).json(errorResponse);
  }
}
```

### Seguridad

El backend implementa varias medidas de seguridad para proteger los datos y prevenir ataques:

- **Autenticación JWT**: Para verificar la identidad de los usuarios.
- **Control de Acceso Basado en Roles**: Para restringir el acceso a ciertas funcionalidades según el rol del usuario.
- **Validación de Datos**: Para prevenir ataques de inyección y otros tipos de ataques.
- **CORS**: Para controlar qué dominios pueden acceder a la API.
- **Encriptación de Contraseñas**: Para almacenar las contraseñas de forma segura.

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar prefijo global para la API
  app.setGlobalPrefix('api');
  
  // Configurar CORS
  app.enableCors(corsConfig);
  
  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Configurar filtros de excepciones
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new HttpExceptionFilter(),
  );
  
  // Configurar interceptores
  app.useGlobalInterceptors(new TransformInterceptor());
  
  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('POS System API')
    .setDescription('API para el sistema POS de tienda de accesorios móviles')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Iniciar servidor
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Aplicación iniciada en: http://localhost:${port}/api`);
  console.log(`Documentación disponible en: http://localhost:${port}/api/docs`);
}
bootstrap();
```


## Frontend (ReactJS + Electron)

El frontend del sistema está desarrollado con ReactJS y Electron. ReactJS proporciona una interfaz de usuario dinámica y responsiva, mientras que Electron permite convertir la aplicación web en una aplicación de escritorio multiplataforma.

### Estructura de Directorios

```
frontend/
├── public/              # Archivos públicos
├── src/
│   ├── assets/          # Imágenes, iconos, etc.
│   ├── components/      # Componentes reutilizables
│   ├── contexts/        # Contextos de React (estado global)
│   ├── hooks/           # Hooks personalizados
│   ├── layouts/         # Layouts de la aplicación
│   ├── pages/           # Páginas de la aplicación
│   ├── services/        # Servicios para comunicación con la API
│   ├── theme/           # Configuración del tema
│   ├── utils/           # Utilidades
│   ├── App.tsx          # Componente principal
│   └── index.tsx        # Punto de entrada
├── electron/            # Configuración de Electron
│   ├── main.js          # Proceso principal de Electron
│   └── preload.js       # Script de precarga
└── package.json         # Dependencias
```

### Componentes Principales

#### Contexto de Autenticación

El contexto de autenticación maneja el estado global de autenticación, permitiendo que cualquier componente acceda al usuario autenticado y realice operaciones relacionadas con la autenticación.

```tsx
// AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si hay un token almacenado
    const token = localStorage.getItem('token');
    if (token) {
      // Obtener el perfil del usuario
      authService.getProfile()
        .then(response => {
          setUser(response.data.data);
        })
        .catch(() => {
          // Si hay un error, limpiar el token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(email, password);
      const { token, user } = response.data.data;
      
      // Guardar token y usuario en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al iniciar sesión');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
```

#### Contexto de Tema

El contexto de tema maneja el tema de la aplicación, permitiendo cambiar entre tema claro y oscuro.

```tsx
// ThemeContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createTheme, Theme } from '@mui/material/styles';
import { lightTheme, darkTheme } from '../theme';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>(lightTheme);

  useEffect(() => {
    // Verificar si hay una preferencia de tema almacenada
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      setTheme(darkTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    setTheme(newIsDarkMode ? darkTheme : lightTheme);
    localStorage.setItem('theme', newIsDarkMode ? 'dark' : 'light');
  };

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};
```

#### Layout Principal

El layout principal define la estructura básica de la aplicación, incluyendo la barra lateral, la barra superior y el contenido principal.

```tsx
// MainLayout.tsx
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', dataTestId: 'menu-dashboard' },
    { text: 'Productos', icon: <InventoryIcon />, path: '/productos', dataTestId: 'menu-productos' },
    { text: 'Ventas', icon: <ShoppingCartIcon />, path: '/ventas', dataTestId: 'menu-ventas' },
    { text: 'Gastos', icon: <ReceiptIcon />, path: '/gastos', dataTestId: 'menu-gastos' },
    { text: 'Reportes', icon: <BarChartIcon />, path: '/reportes', dataTestId: 'menu-reportes' },
  ];

  const adminMenuItems = [
    { text: 'Administración', icon: <SettingsIcon />, path: '/admin', dataTestId: 'menu-admin' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema POS - Tienda de Accesorios Móviles
          </Typography>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            data-testid="theme-toggle"
          >
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
      >
        <DrawerHeader>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            {user?.nombre || 'Usuario'}
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              data-testid={item.dataTestId}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        {user?.rol?.nombre === 'Administrador' && (
          <>
            <List>
              {adminMenuItems.map((item) => (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  selected={location.pathname === item.path}
                  data-testid={item.dataTestId}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
            <Divider />
          </>
        )}
        <List>
          <ListItem
            button
            onClick={handleLogout}
            data-testid="logout-button"
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
};

export default MainLayout;
```

#### Página de Login

La página de login permite a los usuarios autenticarse en el sistema.

```tsx
// Login.tsx
import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Sistema POS - Iniciar Sesión
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
```

#### Página de Dashboard

La página de dashboard muestra un resumen de la información más relevante del sistema.

```tsx
// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { reportService, inventarioService, alertService } from '../services/api';

const Dashboard: React.FC = () => {
  const [ventasData, setVentasData] = useState<any[]>([]);
  const [productosTopData, setProductosTopData] = useState<any[]>([]);
  const [inventarioBajoStock, setInventarioBajoStock] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener ventas por día
        const ventasResponse = await reportService.getSalesByPeriod('day');
        setVentasData(ventasResponse.data.data);

        // Obtener productos más vendidos
        const productosTopResponse = await reportService.getTopProducts(5);
        setProductosTopData(productosTopResponse.data.data);

        // Obtener inventario con bajo stock
        const inventarioBajoStockResponse = await inventarioService.getLowStock();
        setInventarioBajoStock(inventarioBajoStockResponse.data.data);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box data-testid="dashboard">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Gráfico de ventas */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 300,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Ventas por Día
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ventasData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Total de Ventas" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Productos más vendidos */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 300,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Productos Más Vendidos
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productosTopData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cantidad"
                  nameKey="nombre"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {productosTopData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Inventario con bajo stock */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Inventario con Bajo Stock
            </Typography>
            <List>
              {inventarioBajoStock.length > 0 ? (
                inventarioBajoStock.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem>
                      <ListItemText
                        primary={item.producto.nombre}
                        secondary={`Stock Actual: ${item.cantidad} | Stock Mínimo: ${item.producto.stock_minimo} | Tienda: ${item.tienda.nombre}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No hay productos con bajo stock" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
```

### Integración con Electron

La integración con Electron permite convertir la aplicación web en una aplicación de escritorio multiplataforma. Esto se logra mediante la configuración de los archivos `main.js` y `preload.js` en el directorio `electron`.

#### Proceso Principal (main.js)

El proceso principal de Electron es responsable de crear la ventana de la aplicación y manejar eventos del sistema.

```javascript
// main.js
const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const Store = require('electron-store');

// Configurar almacenamiento persistente
const store = new Store();

// Mantener una referencia global del objeto window para evitar que la ventana se cierre automáticamente
// cuando el objeto JavaScript es recogido por el recolector de basura.
let mainWindow;

// Crear la ventana principal
function createWindow() {
  // Obtener el tamaño de la ventana guardado o usar valores predeterminados
  const windowSize = store.get('windowSize') || { width: 1200, height: 800 };
  
  mainWindow = new BrowserWindow({
    width: windowSize.width,
    height: windowSize.height,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    show: false, // No mostrar hasta que esté listo
  });

  // Cargar la aplicación React
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Abrir DevTools en desarrollo
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Mostrar la ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Guardar el tamaño de la ventana cuando se cierra
  mainWindow.on('close', () => {
    const { width, height } = mainWindow.getBounds();
    store.set('windowSize', { width, height });
  });

  // Cuando la ventana se cierra, eliminar la referencia
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Crear menú
  createMenu();
}

// Crear menú de la aplicación
function createMenu() {
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Configuración',
          click: () => {
            // Implementar configuración
          }
        },
        { type: 'separator' },
        {
          label: 'Salir',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo', label: 'Deshacer' },
        { role: 'redo', label: 'Rehacer' },
        { type: 'separator' },
        { role: 'cut', label: 'Cortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Pegar' },
        { role: 'delete', label: 'Eliminar' },
        { type: 'separator' },
        { role: 'selectAll', label: 'Seleccionar todo' }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { role: 'reload', label: 'Recargar' },
        { role: 'forceReload', label: 'Forzar recarga' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom normal' },
        { role: 'zoomIn', label: 'Acercar' },
        { role: 'zoomOut', label: 'Alejar' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Pantalla completa' }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Acerca de',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              title: 'POS System',
              message: 'Sistema POS para tienda de accesorios móviles',
              detail: `Versión: ${app.getVersion()}\nElectron: ${process.versions.electron}\nChrome: ${process.versions.chrome}\nNode.js: ${process.versions.node}`,
              buttons: ['OK'],
              icon: path.join(__dirname, '../assets/icon.png')
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Crear ventana cuando la aplicación esté lista
app.whenReady().then(createWindow);

// Salir cuando todas las ventanas estén cerradas, excepto en macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// En macOS, recrear la ventana cuando se haga clic en el icono del dock
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Manejar eventos IPC desde el renderer
ipcMain.handle('get-app-path', () => app.getPath('userData'));
ipcMain.handle('get-app-version', () => app.getVersion());

// Manejar eventos IPC para diálogos
ipcMain.handle('show-open-dialog', async (event, options) => {
  const result = await dialog.showOpenDialog(options);
  return result;
});

ipcMain.handle('show-save-dialog', async (event, options) => {
  const result = await dialog.showSaveDialog(options);
  return result;
});

// Manejar eventos IPC para almacenamiento
ipcMain.handle('store-get', (event, key) => {
  return store.get(key);
});

ipcMain.handle('store-set', (event, key, value) => {
  store.set(key, value);
  return true;
});

ipcMain.handle('store-delete', (event, key) => {
  store.delete(key);
  return true;
});
```

#### Script de Precarga (preload.js)

El script de precarga expone funciones seguras del proceso principal al proceso de renderizado.

```javascript
// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Exponer API segura a través del puente de contexto
contextBridge.exposeInMainWorld('electron', {
  // Información de la aplicación
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Diálogos
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  
  // Almacenamiento
  store: {
    get: (key) => ipcRenderer.invoke('store-get', key),
    set: (key, value) => ipcRenderer.invoke('store-set', key, value),
    delete: (key) => ipcRenderer.invoke('store-delete', key),
  },
  
  // Sistema operativo
  platform: process.platform,
});
```

### Servicios API

Los servicios API proporcionan una capa de abstracción para comunicarse con el backend. Utilizan Axios para realizar peticiones HTTP y manejar respuestas.

```typescript
// api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Configuración base para axios
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Crear instancia de axios con configuración base
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación a las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
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
```

## Base de Datos (PostgreSQL)

La base de datos del sistema está implementada en PostgreSQL, un sistema de gestión de bases de datos relacional potente y de código abierto.

### Modelo de Datos

El modelo de datos del sistema está diseñado para soportar todas las funcionalidades requeridas, como la gestión de productos, inventario, ventas, gastos, etc.

#### Diagrama Entidad-Relación

```
+----------------+       +----------------+       +----------------+
|    Compania    |       |     Tienda     |       |    Persona     |
+----------------+       +----------------+       +----------------+
| id             |<----->| id             |       | id             |
| nombre         |       | nombre         |       | nombre         |
| direccion      |       | direccion      |       | email          |
| telefono       |       | telefono       |       | telefono       |
| email          |       | compania_id    |       | direccion      |
| ruc            |       +----------------+       | tipo_persona   |
+----------------+               |                | tipo_id_id     |
                                 |                +----------------+
                                 |                        |
                                 v                        |
+----------------+       +----------------+       +----------------+
|    Producto    |       |   Inventario   |       |     Usuario    |
+----------------+       +----------------+       +----------------+
| id             |<----->| id             |       | id             |
| nombre         |       | producto_id    |       | email          |
| descripcion    |       | tienda_id      |       | password       |
| codigo         |       | cantidad       |       | persona_id     |
| precio_compra  |       | ubicacion      |       | rol_id         |
| precio_venta   |       +----------------+       | activo         |
| stock_minimo   |               |                +----------------+
| unidad_id      |               |                        |
| impuesto_id    |               v                        |
+----------------+       +----------------+       +----------------+
        |                |     Kardex     |       |      Rol       |
        |                +----------------+       +----------------+
        |                | id             |       | id             |
        |                | producto_id    |       | nombre         |
        |                | tienda_id      |       | descripcion    |
        |                | tipo_movimiento|       +----------------+
        |                | cantidad       |
        |                | precio_unitario|
        |                | fecha          |
        |                | descripcion    |
        |                +----------------+
        |
        v
+----------------+       +----------------+       +----------------+
|     Venta      |       | DetalleVenta   |       |  MetodoPago    |
+----------------+       +----------------+       +----------------+
| id             |<----->| id             |       | id             |
| fecha          |       | venta_id       |<----->| nombre         |
| total          |       | producto_id    |       | descripcion    |
| estado         |       | cantidad       |       +----------------+
| tienda_id      |       | precio_unitario|
| cliente_id     |       | descuento      |
| usuario_id     |       | subtotal       |
| metodo_pago_id |       +----------------+
+----------------+
        |
        v
+----------------+       +----------------+
|     Gasto      |       | DetalleGasto   |
+----------------+       +----------------+
| id             |<----->| id             |
| fecha          |       | gasto_id       |
| total          |       | concepto       |
| descripcion    |       | monto          |
| tienda_id      |       +----------------+
| usuario_id     |
+----------------+
```

### Tablas Principales

#### Tabla de Usuarios

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    persona_id INTEGER REFERENCES personas(id),
    rol_id INTEGER REFERENCES roles(id),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabla de Productos

```sql
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    codigo VARCHAR(50) UNIQUE,
    precio_compra DECIMAL(10, 2) NOT NULL,
    precio_venta DECIMAL(10, 2) NOT NULL,
    stock_minimo INTEGER DEFAULT 0,
    unidad_id INTEGER REFERENCES unidades(id),
    impuesto_id INTEGER REFERENCES impuestos(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabla de Inventario

```sql
CREATE TABLE inventario (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id),
    tienda_id INTEGER REFERENCES tiendas(id),
    cantidad INTEGER NOT NULL DEFAULT 0,
    ubicacion VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(producto_id, tienda_id)
);
```

#### Tabla de Kardex

```sql
CREATE TABLE kardex (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id),
    tienda_id INTEGER REFERENCES tiendas(id),
    tipo_movimiento VARCHAR(50) NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabla de Ventas

```sql
CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(50) DEFAULT 'Completada',
    tienda_id INTEGER REFERENCES tiendas(id),
    cliente_id INTEGER REFERENCES personas(id),
    usuario_id INTEGER REFERENCES usuarios(id),
    metodo_pago_id INTEGER REFERENCES metodos_pago(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabla de Detalles de Venta

```sql
CREATE TABLE detalles_venta (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER REFERENCES ventas(id),
    producto_id INTEGER REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    descuento DECIMAL(5, 2) DEFAULT 0,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Índices

Para mejorar el rendimiento de las consultas, se han creado índices en las columnas más utilizadas:

```sql
-- Índices para búsquedas frecuentes
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_codigo ON productos(codigo);
CREATE INDEX idx_ventas_fecha ON ventas(fecha);
CREATE INDEX idx_gastos_fecha ON gastos(fecha);
CREATE INDEX idx_inventario_producto_tienda ON inventario(producto_id, tienda_id);
CREATE INDEX idx_kardex_producto_fecha ON kardex(producto_id, fecha);
CREATE INDEX idx_ventas_usuario ON ventas(usuario_id);
```

### Restricciones

Para garantizar la integridad de los datos, se han definido varias restricciones:

- **Claves Primarias**: Cada tabla tiene una clave primaria única.
- **Claves Foráneas**: Para mantener la integridad referencial entre tablas.
- **Restricciones Únicas**: Para evitar duplicados en campos como el código de producto o el email de usuario.
- **Valores por Defecto**: Para campos como la fecha de creación o el estado de una venta.

### Optimización

Para optimizar el rendimiento de la base de datos, se han implementado las siguientes medidas:

- **Índices**: Para acelerar las consultas más frecuentes.
- **Normalización**: Para evitar la redundancia de datos.
- **Tipos de Datos Adecuados**: Para optimizar el almacenamiento.
- **Restricciones**: Para garantizar la integridad de los datos.
- **Consultas Optimizadas**: Para minimizar el tiempo de respuesta.

## Seguridad

El sistema implementa varias medidas de seguridad para proteger los datos y prevenir ataques:

### Autenticación y Autorización

- **JWT (JSON Web Tokens)**: Para la autenticación de usuarios.
- **Control de Acceso Basado en Roles**: Para restringir el acceso a ciertas funcionalidades según el rol del usuario.
- **Encriptación de Contraseñas**: Utilizando bcrypt para almacenar las contraseñas de forma segura.

### Protección contra Ataques Comunes

- **Validación de Datos**: Para prevenir ataques de inyección SQL y otros tipos de ataques.
- **CORS (Cross-Origin Resource Sharing)**: Para controlar qué dominios pueden acceder a la API.
- **Protección contra CSRF (Cross-Site Request Forgery)**: Mediante tokens CSRF.
- **Protección contra XSS (Cross-Site Scripting)**: Mediante la sanitización de datos.

### Seguridad en la Comunicación

- **HTTPS**: Para cifrar la comunicación entre el cliente y el servidor.
- **Cabeceras de Seguridad**: Para prevenir ataques como clickjacking, sniffing, etc.

## Despliegue

El sistema puede ser desplegado en diferentes entornos, desde desarrollo hasta producción.

### Requisitos del Sistema

- **Node.js**: v14.0.0 o superior
- **PostgreSQL**: v12.0 o superior
- **Espacio en Disco**: 500 MB mínimo
- **Memoria RAM**: 2 GB mínimo

### Pasos para el Despliegue

1. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/usuario/pos-system.git
   cd pos-system
   ```

2. **Configurar el Backend**:
   ```bash
   cd backend/pos-backend
   npm install
   cp .env.example .env
   # Editar .env con la configuración adecuada
   npm run build
   ```

3. **Configurar la Base de Datos**:
   ```bash
   # Crear la base de datos y el usuario
   sudo -u postgres psql -c "CREATE USER posadmin WITH PASSWORD 'posadmin123';"
   sudo -u postgres psql -c "CREATE DATABASE pos_db;"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE pos_db TO posadmin;"
   
   # Importar el esquema
   sudo -u postgres psql -d pos_db -f esquema.sql
   ```

4. **Configurar el Frontend**:
   ```bash
   cd ../../frontend/pos-frontend
   npm install
   cp .env.example .env
   # Editar .env con la configuración adecuada
   npm run build
   ```

5. **Iniciar el Sistema**:
   ```bash
   # Iniciar el backend
   cd ../../backend/pos-backend
   npm run start:prod
   
   # Iniciar el frontend (en otra terminal)
   cd ../../frontend/pos-frontend
   npx serve -s build
   ```

6. **Empaquetar la Aplicación Electron**:
   ```bash
   cd ../../frontend/pos-frontend
   npm run electron:build
   ```

### Despliegue en Producción

Para un despliegue en producción, se recomienda utilizar un servidor web como Nginx o Apache para servir el frontend, y un gestor de procesos como PM2 para el backend.

```bash
# Instalar PM2
npm install -g pm2

# Iniciar el backend con PM2
cd backend/pos-backend
pm2 start dist/main.js --name pos-backend

# Configurar Nginx para servir el frontend
# Editar /etc/nginx/sites-available/pos-frontend
# server {
#     listen 80;
#     server_name example.com;
#     root /path/to/pos-system/frontend/pos-frontend/build;
#     index index.html;
#     location / {
#         try_files $uri $uri/ /index.html;
#     }
# }

# Activar la configuración de Nginx
# sudo ln -s /etc/nginx/sites-available/pos-frontend /etc/nginx/sites-enabled/
# sudo nginx -t
# sudo systemctl restart nginx
```

## Mantenimiento

Para mantener el sistema funcionando correctamente, se recomienda realizar las siguientes tareas periódicamente:

### Copias de Seguridad

Realizar copias de seguridad regulares de la base de datos:

```bash
# Crear una copia de seguridad de la base de datos
pg_dump -U posadmin -d pos_db > backup_$(date +%Y%m%d).sql
```

### Actualizaciones

Mantener las dependencias actualizadas:

```bash
# Actualizar dependencias del backend
cd backend/pos-backend
npm update

# Actualizar dependencias del frontend
cd frontend/pos-frontend
npm update
```

### Monitoreo

Monitorear el rendimiento y los errores del sistema:

- Utilizar herramientas como PM2 para monitorear el backend.
- Implementar un sistema de logs para registrar errores y eventos importantes.
- Configurar alertas para notificar problemas críticos.

## Referencias

1. [NestJS Documentation](https://docs.nestjs.com/)
2. [ReactJS Documentation](https://reactjs.org/docs/getting-started.html)
3. [Electron Documentation](https://www.electronjs.org/docs)
4. [PostgreSQL Documentation](https://www.postgresql.org/docs/)
5. [TypeORM Documentation](https://typeorm.io/)
6. [Material UI Documentation](https://mui.com/getting-started/usage/)
7. [JWT Authentication](https://jwt.io/introduction/)
8. [Swagger Documentation](https://swagger.io/docs/)
9. [Node.js Documentation](https://nodejs.org/en/docs/)
10. [TypeScript Documentation](https://www.typescriptlang.org/docs/)

