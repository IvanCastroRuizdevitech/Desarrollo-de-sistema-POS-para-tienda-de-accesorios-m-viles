# Sistema POS para Tienda de Accesorios Móviles

**Fecha:** 6 de junio de 2025  
**Versión:** 1.0

## Descripción

Sistema POS (Point of Sale) completo para tiendas de accesorios móviles, desarrollado con NestJS (backend), ReactJS + Electron (frontend) y PostgreSQL (base de datos).

## Características

- **Gestión de ventas** con múltiples métodos de pago (efectivo, tarjeta, transferencia)
- **Gestión de productos e inventario** con alertas de bajo stock
- **Sistema Kardex** para control de movimientos de inventario
- **Autenticación de usuarios** con roles (vendedor y administrador)
- **Registro de gastos** y reportes de ingresos/gastos mensuales
- **Creación de compañías, tiendas, clientes, proveedores y empleados**
- **Generación de reportes** en PDF/CSV

## Tecnologías Utilizadas

- **Backend**: NestJS, Node.js, TypeORM
- **Frontend**: ReactJS, Electron, Material UI
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT
- **Documentación API**: Swagger

## Estructura del Proyecto

```
pos-system/
├── backend/                # Backend NestJS
│   └── pos-backend/
│       ├── src/            # Código fuente
│       ├── test/           # Pruebas
│       └── ...
├── frontend/               # Frontend ReactJS + Electron
│   └── pos-frontend/
│       ├── src/            # Código fuente
│       ├── electron/       # Configuración de Electron
│       └── ...
├── docs/                   # Documentación
│   ├── documentacion_tecnica.md
│   ├── documentacion_tecnica.pdf
│   ├── manual_usuario.md
│   ├── manual_usuario.pdf
│   ├── manual_instalacion.md
│   └── manual_instalacion.pdf
├── dev-start.sh            # Script para iniciar en modo desarrollo
├── optimize.sh             # Script para optimizar y corregir errores
└── README.md               # Este archivo
```

## Requisitos del Sistema

- **Node.js**: v14.0.0 o superior
- **npm**: v6.0.0 o superior
- **PostgreSQL**: v12.0 o superior
- **Sistema Operativo**: Windows 10/11, macOS 10.14 o superior, o Linux (Ubuntu 20.04 o superior)

## Instalación Rápida

1. Clone el repositorio:
   ```bash
   git clone https://github.com/usuario/pos-system.git
   cd pos-system
   ```

2. Ejecute el script de instalación:
   ```bash
   ./install.sh
   ```

3. Siga las instrucciones en pantalla.

Para instrucciones detalladas, consulte el [Manual de Instalación y Configuración](docs/manual_instalacion.pdf).

## Documentación

- [Documentación Técnica](docs/documentacion_tecnica.pdf): Información detallada sobre la arquitectura y el funcionamiento interno del sistema.
- [Manual de Usuario](docs/manual_usuario.pdf): Guía completa para el uso del sistema.
- [Manual de Instalación y Configuración](docs/manual_instalacion.pdf): Instrucciones detalladas para la instalación y configuración del sistema.

## Desarrollo

### Iniciar en Modo Desarrollo

```bash
./dev-start.sh
```

Este script inicia tanto el backend como el frontend en modo desarrollo.

### Compilar para Producción

#### Backend

```bash
cd backend/pos-backend
npm run build
```

#### Frontend

```bash
cd frontend/pos-frontend
npm run build
```

#### Aplicación Electron

```bash
cd frontend/pos-frontend
npm run electron:build
```

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - vea el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Para soporte técnico o consultas, contacte a:

- **Email**: support@possystem.com
- **Teléfono**: +1-800-123-4567

