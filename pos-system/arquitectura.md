# Arquitectura del Sistema POS para Tienda de Accesorios Móviles

## Visión General

El sistema POS (Point of Sale) está diseñado para gestionar las operaciones diarias de una tienda de accesorios móviles, incluyendo ventas, inventario, gastos y reportes. La arquitectura sigue un enfoque de microservicios con una clara separación entre el frontend y el backend.

## Componentes Principales

### Backend (NestJS + PostgreSQL)

El backend está construido con NestJS, un framework progresivo de Node.js, y utiliza PostgreSQL como base de datos relacional.

#### Capas de la Arquitectura Backend:

1. **Capa de Controladores**: Maneja las solicitudes HTTP y delega el procesamiento a los servicios.
2. **Capa de Servicios**: Contiene la lógica de negocio y coordina las operaciones entre repositorios.
3. **Capa de Repositorios**: Interactúa con la base de datos a través de TypeORM.
4. **Capa de Entidades**: Define los modelos de datos que reflejan las tablas de la base de datos.
5. **Capa de DTOs (Data Transfer Objects)**: Define los objetos para transferencia de datos entre capas.
6. **Capa de Middleware**: Maneja autenticación, autorización, validación y logging.

### Frontend (ReactJS + Electron)

El frontend está construido con ReactJS y empaquetado como una aplicación de escritorio utilizando Electron.

#### Capas de la Arquitectura Frontend:

1. **Capa de Componentes UI**: Componentes React reutilizables para la interfaz de usuario.
2. **Capa de Páginas/Vistas**: Componentes de nivel superior que representan páginas completas.
3. **Capa de Servicios**: Maneja la comunicación con el backend a través de API REST.
4. **Capa de Estado**: Gestiona el estado global de la aplicación (usando Context API o Redux).
5. **Capa de Utilidades**: Funciones auxiliares y helpers.

## Flujo de Datos

1. **Autenticación**:
   - El usuario ingresa credenciales en la interfaz de login.
   - El frontend envía las credenciales al backend.
   - El backend valida las credenciales y genera un token JWT.
   - El frontend almacena el token y lo utiliza para solicitudes posteriores.

2. **Gestión de Ventas**:
   - El usuario selecciona productos para vender.
   - El sistema calcula subtotales, impuestos y total.
   - El usuario selecciona método de pago y completa la venta.
   - El backend actualiza el inventario y registra la venta en la base de datos.
   - Se genera un comprobante de venta en PDF.

3. **Gestión de Inventario**:
   - El sistema monitorea niveles de inventario.
   - Se generan alertas cuando los productos alcanzan niveles bajos.
   - El usuario puede registrar entradas y salidas de productos.
   - El sistema mantiene un registro Kardex de todos los movimientos.

4. **Reportes**:
   - El usuario solicita un reporte específico.
   - El backend consulta la base de datos y genera los datos necesarios.
   - El frontend presenta los datos en formato tabular o gráfico.
   - El usuario puede exportar los reportes a PDF o CSV.

## Seguridad

1. **Autenticación**: Basada en JWT (JSON Web Tokens).
2. **Autorización**: Control de acceso basado en roles (RBAC).
3. **Validación de Datos**: Validación en frontend y backend.
4. **Protección contra ataques comunes**: XSS, CSRF, SQL Injection.

## Escalabilidad

El sistema está diseñado para soportar múltiples tiendas asociadas a una compañía:

1. **Multitenancy**: Cada tienda tiene su propio conjunto de datos pero comparte la misma infraestructura.
2. **Sincronización**: Posibilidad de sincronización de datos entre tiendas.
3. **Consolidación**: Reportes consolidados a nivel de compañía.

## Diagrama de Arquitectura

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
|    Backend (NestJS)              |
|                                  |
+----------------+----------------+
                 |
                 | TypeORM
                 |
+----------------v----------------+
|                                  |
|    Base de Datos (PostgreSQL)    |
|                                  |
+----------------------------------+
```

## Tecnologías Utilizadas

- **Backend**: NestJS, TypeORM, PostgreSQL, JWT
- **Frontend**: ReactJS, Electron, Material-UI, React Router, Axios
- **Herramientas de Desarrollo**: TypeScript, ESLint, Prettier
- **Generación de Reportes**: jsPDF, xlsx

