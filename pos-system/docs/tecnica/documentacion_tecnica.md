# Documentación Técnica: Sistema POS para Tienda de Accesorios Móviles

**Autor:** Manus AI  
**Fecha:** 6 de junio de 2025  
**Versión:** 1.0

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Backend (NestJS)](#backend-nestjs)
6. [Frontend (ReactJS + Electron)](#frontend-reactjs--electron)
7. [Base de Datos (PostgreSQL)](#base-de-datos-postgresql)
8. [Seguridad](#seguridad)
9. [API Reference](#api-reference)
10. [Despliegue](#despliegue)
11. [Mantenimiento](#mantenimiento)
12. [Solución de Problemas](#solución-de-problemas)
13. [Referencias](#referencias)



## Introducción

El Sistema POS (Point of Sale) para Tienda de Accesorios Móviles es una aplicación completa diseñada para gestionar todas las operaciones comerciales de una tienda de accesorios para dispositivos móviles. Este sistema permite la gestión de ventas, inventario, productos, clientes, proveedores, empleados, gastos y reportes, proporcionando una solución integral para el negocio.

### Propósito del Sistema

El propósito principal del Sistema POS es automatizar y optimizar los procesos de negocio de una tienda de accesorios móviles, facilitando la gestión diaria y proporcionando información valiosa para la toma de decisiones. El sistema está diseñado para ser utilizado por diferentes roles de usuario, como vendedores y administradores, cada uno con permisos específicos según sus responsabilidades.

### Alcance del Sistema

El Sistema POS abarca las siguientes funcionalidades principales:

- **Gestión de ventas**: Registro de ventas con diferentes métodos de pago (efectivo, tarjeta, transferencia).
- **Gestión de productos e inventario**: Control de stock, alertas de bajo stock, y movimientos tipo Kardex.
- **Gestión de usuarios**: Autenticación y control de acceso basado en roles (vendedor y administrador).
- **Gestión de gastos**: Registro y categorización de gastos.
- **Reportes**: Generación de informes de ventas, inventario, gastos e ingresos en formatos PDF y CSV.
- **Gestión de entidades**: Creación y administración de compañías, tiendas, clientes, proveedores y empleados.

### Audiencia Objetivo

Esta documentación técnica está dirigida a:

- **Desarrolladores**: Que necesiten mantener, extender o integrar el sistema con otras aplicaciones.
- **Administradores de sistemas**: Responsables de la instalación, configuración y mantenimiento del sistema.
- **Consultores técnicos**: Que asesoren a la empresa en la implementación y uso del sistema.

### Estructura de la Documentación

Este documento está organizado en secciones que cubren diferentes aspectos del sistema:

1. **Arquitectura del Sistema**: Visión general de la arquitectura y componentes del sistema.
2. **Tecnologías Utilizadas**: Descripción de las tecnologías y frameworks empleados.
3. **Estructura del Proyecto**: Organización de directorios y archivos.
4. **Backend (NestJS)**: Detalles de la implementación del backend.
5. **Frontend (ReactJS + Electron)**: Detalles de la implementación del frontend.
6. **Base de Datos (PostgreSQL)**: Estructura de la base de datos y relaciones.
7. **Seguridad**: Mecanismos de seguridad implementados.
8. **API REST**: Documentación de los endpoints disponibles.
9. **Despliegue**: Instrucciones para el despliegue del sistema.
10. **Mantenimiento**: Guías para el mantenimiento y actualización del sistema.
11. **Referencias**: Fuentes y recursos adicionales.



## Introducción

El Sistema POS (Point of Sale) para Tienda de Accesorios Móviles es una solución completa de gestión diseñada específicamente para tiendas que comercializan accesorios para dispositivos móviles. Este sistema integra todas las funcionalidades necesarias para administrar eficientemente el negocio, desde la gestión de inventario hasta el procesamiento de ventas y la generación de reportes financieros.

### Propósito del Sistema

El propósito principal del Sistema POS es proporcionar una plataforma robusta y fácil de usar que permita a los propietarios y empleados de tiendas de accesorios móviles:

- Gestionar el inventario de productos de manera eficiente
- Procesar ventas con múltiples métodos de pago
- Realizar un seguimiento detallado del movimiento de productos (Kardex)
- Administrar gastos y generar reportes financieros
- Gestionar múltiples tiendas bajo una misma compañía
- Controlar el acceso mediante un sistema de roles y permisos

### Alcance del Sistema

El Sistema POS abarca los siguientes módulos principales:

1. **Gestión de Usuarios y Roles**: Administración de usuarios con diferentes niveles de acceso (vendedor, administrador).

2. **Gestión de Productos e Inventario**: Catálogo de productos, control de stock, alertas de bajo inventario y seguimiento de movimientos tipo Kardex.

3. **Gestión de Ventas**: Procesamiento de transacciones con soporte para múltiples métodos de pago (efectivo, tarjeta, transferencia).

4. **Gestión de Gastos**: Registro y categorización de gastos operativos.

5. **Reportes y Análisis**: Generación de informes financieros, de ventas e inventario en formatos PDF y CSV.

6. **Administración de Compañías y Tiendas**: Soporte para múltiples tiendas asociadas a una compañía.

### Audiencia

Esta documentación técnica está dirigida a:

- Desarrolladores que necesiten mantener o extender el sistema
- Administradores de sistemas responsables de la instalación y configuración
- Personal técnico encargado del soporte y resolución de problemas
- Integradores que necesiten conectar el sistema con otras plataformas

### Convenciones del Documento

En este documento se utilizan las siguientes convenciones:

- `código` - Fragmentos de código, nombres de archivos, comandos o rutas
- **Negrita** - Términos importantes o énfasis
- *Cursiva* - Nuevos términos o referencias a otros documentos
- [Hipervínculo](#) - Enlaces a otras secciones o recursos externos

### Requisitos del Sistema

#### Requisitos de Hardware

- **Servidor**: 
  - CPU: 2 núcleos o más
  - RAM: 4GB mínimo (8GB recomendado)
  - Almacenamiento: 20GB mínimo
  
- **Cliente**:
  - CPU: 2 núcleos o más
  - RAM: 4GB mínimo
  - Almacenamiento: 5GB mínimo
  - Resolución de pantalla: 1280x720 o superior

#### Requisitos de Software

- **Servidor**:
  - Sistema Operativo: Ubuntu 20.04 LTS o superior
  - Node.js 16.x o superior
  - PostgreSQL 12 o superior
  
- **Cliente**:
  - Windows 10/11, macOS 10.15+, o Linux (Ubuntu 20.04+)
  - No se requiere software adicional (aplicación Electron autónoma)


## Arquitectura del Sistema

El Sistema POS para Tienda de Accesorios Móviles está construido siguiendo una arquitectura de tres capas, con una clara separación entre el frontend, el backend y la base de datos. Esta arquitectura proporciona modularidad, escalabilidad y facilidad de mantenimiento.

### Diagrama de Arquitectura

```
+-------------------+     +-------------------+     +-------------------+
|                   |     |                   |     |                   |
|     Frontend      |     |      Backend      |     |    Base de Datos  |
|                   |     |                   |     |                   |
| ReactJS + Electron| <-> |      NestJS       | <-> |     PostgreSQL    |
|                   |     |                   |     |                   |
+-------------------+     +-------------------+     +-------------------+
```

### Componentes Principales

#### 1. Frontend (Cliente)

El frontend está desarrollado con ReactJS y empaquetado como una aplicación de escritorio utilizando Electron. Esta capa es responsable de la interfaz de usuario y la interacción con el usuario.

**Características principales**:
- Interfaz de usuario moderna y responsiva con Material UI
- Gestión de estado con React Context API
- Enrutamiento con React Router
- Comunicación con el backend mediante Axios
- Validación de formularios con React Hook Form
- Exportación de datos a PDF/CSV
- Tema personalizable (modo claro/oscuro)

#### 2. Backend (Servidor)

El backend está desarrollado con NestJS, un framework de Node.js para construir aplicaciones del lado del servidor eficientes y escalables. Esta capa implementa la lógica de negocio y expone una API REST para la comunicación con el frontend.

**Características principales**:
- Arquitectura modular basada en módulos, controladores y servicios
- Autenticación y autorización con JWT
- Validación de datos con class-validator
- Documentación de API con Swagger
- Manejo de errores centralizado
- Logging y monitoreo
- Implementación de patrones de diseño (Repository, Dependency Injection, etc.)

#### 3. Base de Datos

La base de datos utilizada es PostgreSQL, un sistema de gestión de bases de datos relacional potente y de código abierto. Esta capa almacena todos los datos del sistema de manera persistente.

**Características principales**:
- Esquema relacional normalizado
- Integridad referencial con claves foráneas
- Índices para optimizar consultas frecuentes
- Transacciones para garantizar la consistencia de los datos
- Triggers para automatizar ciertas operaciones (como actualización de inventario)

### Flujo de Datos

1. **Solicitud del Usuario**: El usuario interactúa con la interfaz de usuario en el frontend.
2. **Procesamiento en el Frontend**: El frontend procesa la interacción, actualiza la UI si es necesario y envía una solicitud al backend a través de la API REST.
3. **Procesamiento en el Backend**: El backend recibe la solicitud, la valida, aplica la lógica de negocio correspondiente y realiza operaciones en la base de datos si es necesario.
4. **Acceso a la Base de Datos**: El backend se comunica con la base de datos para leer o escribir datos.
5. **Respuesta al Frontend**: El backend envía una respuesta al frontend con los datos solicitados o la confirmación de la operación.
6. **Actualización de la UI**: El frontend recibe la respuesta y actualiza la interfaz de usuario en consecuencia.

### Patrones de Diseño Utilizados

1. **Patrón MVC (Model-View-Controller)**: Separación clara entre los modelos de datos, la lógica de negocio y la presentación.
2. **Patrón Repository**: Abstracción de la capa de acceso a datos para desacoplar la lógica de negocio de la implementación específica de la base de datos.
3. **Patrón Dependency Injection**: Inyección de dependencias para facilitar el testing y reducir el acoplamiento entre componentes.
4. **Patrón Observer**: Utilizado en el frontend para la gestión de estado y la actualización reactiva de la UI.
5. **Patrón Strategy**: Implementado para manejar diferentes estrategias de autenticación y métodos de pago.

### Consideraciones de Escalabilidad

El sistema está diseñado para ser escalable y soportar el crecimiento del negocio:

- **Escalabilidad Horizontal**: El backend puede desplegarse en múltiples instancias detrás de un balanceador de carga.
- **Escalabilidad Vertical**: La base de datos puede configurarse para aprovechar recursos adicionales (CPU, memoria) según sea necesario.
- **Arquitectura Modular**: Facilita la adición de nuevas funcionalidades sin afectar las existentes.
- **Caché**: Implementación de estrategias de caché para mejorar el rendimiento en operaciones frecuentes.
- **Optimización de Consultas**: Índices y consultas optimizadas para mantener un buen rendimiento incluso con grandes volúmenes de datos.


## Arquitectura del Sistema

El Sistema POS para Tienda de Accesorios Móviles está construido siguiendo una arquitectura moderna de aplicación de tres capas, con una clara separación entre el frontend, el backend y la base de datos. Esta arquitectura proporciona modularidad, escalabilidad y facilidad de mantenimiento.

### Visión General de la Arquitectura

La arquitectura del sistema se basa en el patrón cliente-servidor, con una aplicación de escritorio (Electron) que se comunica con un servidor backend a través de una API REST. El sistema está diseñado para funcionar tanto en un entorno local como en un entorno distribuido.

![Arquitectura del Sistema](../assets/arquitectura_sistema.png)

*Nota: La imagen es una representación conceptual de la arquitectura del sistema.*

### Componentes Principales

#### 1. Frontend (Cliente)

El frontend está implementado como una aplicación de escritorio utilizando Electron, que encapsula una aplicación web desarrollada con ReactJS. Esta capa es responsable de:

- Presentar la interfaz de usuario
- Gestionar la interacción del usuario
- Comunicarse con el backend a través de la API REST
- Manejar el estado de la aplicación
- Proporcionar funcionalidades offline cuando sea necesario

#### 2. Backend (Servidor)

El backend está implementado con NestJS, un framework para Node.js que sigue los principios de arquitectura de software modernos. Esta capa es responsable de:

- Exponer una API REST para el frontend
- Implementar la lógica de negocio
- Gestionar la autenticación y autorización
- Comunicarse con la base de datos
- Validar y procesar los datos
- Generar reportes

#### 3. Base de Datos

La capa de persistencia utiliza PostgreSQL, un sistema de gestión de bases de datos relacional potente y robusto. Esta capa es responsable de:

- Almacenar todos los datos del sistema
- Garantizar la integridad de los datos
- Proporcionar mecanismos para consultas eficientes
- Mantener relaciones entre entidades

### Flujo de Datos

El flujo típico de datos en el sistema sigue estos pasos:

1. El usuario interactúa con la interfaz de usuario en la aplicación Electron.
2. La aplicación React captura la interacción y realiza una solicitud HTTP a la API REST del backend.
3. El backend recibe la solicitud, la valida y la procesa según la lógica de negocio.
4. Si es necesario, el backend consulta o modifica datos en la base de datos PostgreSQL.
5. El backend envía una respuesta HTTP al frontend.
6. El frontend actualiza la interfaz de usuario según la respuesta recibida.

### Patrones de Diseño

El sistema implementa varios patrones de diseño para garantizar una arquitectura limpia y mantenible:

#### En el Backend:

- **Patrón Repositorio**: Separa la lógica de acceso a datos de la lógica de negocio.
- **Inyección de Dependencias**: Facilita la prueba y el mantenimiento del código.
- **Patrón Servicio**: Encapsula la lógica de negocio en servicios reutilizables.
- **Patrón Controlador**: Maneja las solicitudes HTTP y delega el procesamiento a los servicios.
- **Patrón Middleware**: Procesa las solicitudes antes de que lleguen a los controladores.
- **Patrón Interceptor**: Transforma las respuestas antes de enviarlas al cliente.
- **Patrón Guardia**: Controla el acceso a las rutas según los permisos del usuario.

#### En el Frontend:

- **Patrón Contenedor/Presentación**: Separa la lógica de estado de la presentación.
- **Patrón Context**: Gestiona el estado global de la aplicación.
- **Patrón Hook**: Encapsula la lógica reutilizable.
- **Patrón HOC (Higher-Order Component)**: Compone componentes con funcionalidades adicionales.
- **Patrón Render Props**: Comparte código entre componentes React.

### Consideraciones de Escalabilidad

La arquitectura del sistema está diseñada para ser escalable:

- **Escalabilidad Horizontal**: El backend puede desplegarse en múltiples instancias detrás de un balanceador de carga.
- **Escalabilidad Vertical**: Tanto el backend como la base de datos pueden escalar verticalmente aumentando los recursos del servidor.
- **Caché**: Se implementan estrategias de caché para mejorar el rendimiento.
- **Optimización de Consultas**: Las consultas a la base de datos están optimizadas para manejar grandes volúmenes de datos.
- **Procesamiento Asíncrono**: Las operaciones intensivas se realizan de forma asíncrona para no bloquear el hilo principal.

### Consideraciones de Seguridad

La arquitectura incorpora varias capas de seguridad:

- **Autenticación**: Basada en JWT (JSON Web Tokens).
- **Autorización**: Control de acceso basado en roles.
- **Validación de Entrada**: Todas las entradas del usuario son validadas.
- **Protección contra Ataques Comunes**: XSS, CSRF, SQL Injection, etc.
- **Cifrado**: Datos sensibles cifrados en la base de datos.
- **HTTPS**: Comunicación cifrada entre el cliente y el servidor.

### Diagrama de Componentes

A continuación se muestra un diagrama detallado de los componentes del sistema:

```
+----------------------------------+
|           Cliente                |
|  +----------------------------+  |
|  |        Electron            |  |
|  |  +----------------------+  |  |
|  |  |      ReactJS        |  |  |
|  |  |  +--------------+   |  |  |
|  |  |  |  Componentes |   |  |  |
|  |  |  +--------------+   |  |  |
|  |  |  |   Servicios  |   |  |  |
|  |  |  +--------------+   |  |  |
|  |  |  |    Estado    |   |  |  |
|  |  |  +--------------+   |  |  |
|  |  +----------------------+  |  |
|  +----------------------------+  |
+----------------------------------+
              |
              | HTTP/HTTPS
              |
+----------------------------------+
|           Servidor               |
|  +----------------------------+  |
|  |         NestJS            |  |
|  |  +--------------+         |  |
|  |  | Controladores|         |  |
|  |  +--------------+         |  |
|  |  |  Servicios   |         |  |
|  |  +--------------+         |  |
|  |  | Repositorios |         |  |
|  |  +--------------+         |  |
|  |  |   Módulos    |         |  |
|  |  +--------------+         |  |
|  +----------------------------+  |
+----------------------------------+
              |
              | SQL
              |
+----------------------------------+
|        Base de Datos             |
|  +----------------------------+  |
|  |       PostgreSQL          |  |
|  |  +--------------+         |  |
|  |  |   Tablas     |         |  |
|  |  +--------------+         |  |
|  |  |   Índices    |         |  |
|  |  +--------------+         |  |
|  |  | Restricciones|         |  |
|  |  +--------------+         |  |
|  |  | Procedimientos|        |  |
|  |  +--------------+         |  |
|  +----------------------------+  |
+----------------------------------+
```

Este diagrama muestra la separación clara entre las tres capas principales del sistema y los componentes dentro de cada capa.


## Arquitectura del Sistema

El Sistema POS para Tienda de Accesorios Móviles está construido siguiendo una arquitectura de tres capas con un enfoque modular y orientado a servicios. Esta arquitectura proporciona una clara separación de responsabilidades, facilita el mantenimiento y permite la escalabilidad del sistema.

### Visión General de la Arquitectura

El sistema se compone de tres capas principales:

1. **Capa de Presentación (Frontend)**: Implementada con ReactJS y empaquetada como aplicación de escritorio mediante Electron.
2. **Capa de Lógica de Negocio (Backend)**: Desarrollada con NestJS, proporciona una API RESTful.
3. **Capa de Datos**: Gestionada por PostgreSQL como sistema de gestión de base de datos relacional.

La siguiente figura muestra la arquitectura general del sistema:

```
┌─────────────────────────────────┐
│                                 │
│    Frontend (ReactJS+Electron)  │
│                                 │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│                                 │
│      Backend API (NestJS)       │
│                                 │
└───────────────┬─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│                                 │
│     Base de Datos (PostgreSQL)  │
│                                 │
└─────────────────────────────────┘
```

### Componentes Principales

#### Frontend (ReactJS + Electron)

El frontend está desarrollado como una Single Page Application (SPA) utilizando ReactJS y se empaqueta como una aplicación de escritorio mediante Electron. Esta capa se encarga de:

- Presentar la interfaz de usuario
- Gestionar la interacción del usuario
- Comunicarse con el backend a través de peticiones HTTP
- Manejar el estado de la aplicación mediante contextos de React
- Proporcionar funcionalidades offline básicas

La aplicación Electron permite que el sistema funcione como una aplicación de escritorio nativa en diferentes sistemas operativos (Windows, macOS, Linux).

#### Backend (NestJS)

El backend está implementado con NestJS, un framework para Node.js que sigue los principios de arquitectura de Angular. Esta capa proporciona:

- API RESTful para la comunicación con el frontend
- Implementación de la lógica de negocio
- Validación de datos y manejo de errores
- Autenticación y autorización mediante JWT
- Acceso a la base de datos mediante TypeORM

El backend sigue una arquitectura modular, donde cada funcionalidad del sistema (usuarios, productos, ventas, etc.) está implementada como un módulo independiente.

#### Base de Datos (PostgreSQL)

PostgreSQL se utiliza como sistema de gestión de base de datos relacional. La estructura de la base de datos está diseñada para:

- Almacenar todos los datos del sistema de manera persistente
- Garantizar la integridad referencial mediante relaciones y restricciones
- Optimizar las consultas mediante índices
- Proporcionar transacciones ACID para operaciones críticas

### Patrones de Diseño Utilizados

El sistema implementa varios patrones de diseño para mejorar la calidad del código y facilitar el mantenimiento:

1. **Patrón Repositorio**: Utilizado en el backend para abstraer el acceso a la base de datos.
2. **Patrón Servicio**: Implementado para encapsular la lógica de negocio.
3. **Patrón Controlador**: Utilizado para manejar las peticiones HTTP y delegar el procesamiento a los servicios.
4. **Patrón Inyección de Dependencias**: Implementado mediante el sistema de inyección de dependencias de NestJS.
5. **Patrón Observador**: Utilizado en el frontend para la gestión del estado y la reactividad.
6. **Patrón Decorador**: Empleado para añadir funcionalidades como validación, autenticación y autorización.

### Flujo de Datos

El flujo típico de datos en el sistema sigue estos pasos:

1. El usuario interactúa con la interfaz de usuario en el frontend.
2. El frontend envía una petición HTTP a la API del backend.
3. El backend valida la petición y la autenticación/autorización del usuario.
4. El backend procesa la petición, aplicando la lógica de negocio necesaria.
5. El backend accede a la base de datos para leer o escribir datos.
6. El backend devuelve una respuesta al frontend.
7. El frontend actualiza la interfaz de usuario con los datos recibidos.

### Escalabilidad y Extensibilidad

La arquitectura del sistema está diseñada para ser escalable y extensible:

- **Escalabilidad Horizontal**: El backend puede desplegarse en múltiples instancias detrás de un balanceador de carga.
- **Escalabilidad Vertical**: Tanto el backend como la base de datos pueden escalar verticalmente aumentando los recursos del servidor.
- **Extensibilidad**: La arquitectura modular permite añadir nuevas funcionalidades sin afectar a las existentes.
- **Configurabilidad**: El sistema utiliza archivos de configuración y variables de entorno para adaptarse a diferentes entornos.

### Consideraciones de Seguridad en la Arquitectura

La seguridad está integrada en todos los niveles de la arquitectura:

- **Frontend**: Validación de datos de entrada, protección contra XSS, rutas protegidas.
- **Backend**: Autenticación JWT, autorización basada en roles, validación de datos, protección contra inyección SQL.
- **Base de Datos**: Acceso restringido, cifrado de datos sensibles, backups regulares.
- **Comunicación**: HTTPS para la comunicación entre frontend y backend.

### Diagrama de Despliegue

El siguiente diagrama muestra la configuración de despliegue recomendada para el sistema:

```
┌─────────────────────────┐     ┌─────────────────────────┐
│                         │     │                         │
│  Cliente (Aplicación    │     │  Cliente (Aplicación    │
│  Electron)              │     │  Electron)              │
│                         │     │                         │
└───────────┬─────────────┘     └───────────┬─────────────┘
            │                               │
            └───────────┬───────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                  Servidor Backend                       │
│                                                         │
│  ┌─────────────────────────┐  ┌─────────────────────┐   │
│  │                         │  │                     │   │
│  │  API NestJS             │  │  Servidor Web       │   │
│  │                         │  │  (Nginx/Apache)     │   │
│  └─────────────┬───────────┘  └─────────────────────┘   │
│                │                                         │
└────────────────┼─────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                 Servidor de Base de Datos               │
│                                                         │
│  ┌─────────────────────────┐                            │
│  │                         │                            │
│  │  PostgreSQL             │                            │
│  │                         │                            │
│  └─────────────────────────┘                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Este diagrama representa una configuración de despliegue típica, donde:

- Los clientes ejecutan la aplicación Electron en sus equipos locales.
- El servidor backend aloja la API NestJS y puede incluir un servidor web para servir archivos estáticos.
- El servidor de base de datos aloja PostgreSQL y puede estar en la misma máquina que el backend o en una máquina separada para mayor escalabilidad.


## Tecnologías Utilizadas

El Sistema POS para Tienda de Accesorios Móviles utiliza un conjunto de tecnologías modernas y robustas para garantizar un rendimiento óptimo, seguridad y facilidad de mantenimiento. A continuación, se detallan las principales tecnologías empleadas en cada capa del sistema.

### Backend

#### NestJS

NestJS es un framework para construir aplicaciones del lado del servidor en Node.js, inspirado en Angular. Proporciona una arquitectura que favorece la modularidad, testabilidad y mantenibilidad del código.

- **Versión**: 9.x
- **Características utilizadas**:
  - Módulos para organizar el código
  - Controladores para manejar las solicitudes HTTP
  - Servicios para implementar la lógica de negocio
  - Guards para proteger rutas
  - Interceptores para transformar respuestas
  - Pipes para validación de datos
  - Decoradores para metadatos y configuración

#### TypeORM

TypeORM es un ORM (Object-Relational Mapping) para TypeScript y JavaScript que facilita la interacción con bases de datos relacionales.

- **Versión**: 0.3.x
- **Características utilizadas**:
  - Entidades para mapear tablas de la base de datos
  - Repositorios para operaciones CRUD
  - Relaciones entre entidades (one-to-one, one-to-many, many-to-many)
  - Migraciones para gestionar cambios en el esquema
  - Transacciones para operaciones atómicas
  - Consultas personalizadas para operaciones complejas

#### Passport.js

Passport.js es un middleware de autenticación para Node.js que proporciona estrategias de autenticación flexibles.

- **Versión**: 0.6.x
- **Características utilizadas**:
  - Estrategia JWT para autenticación basada en tokens
  - Estrategia Local para autenticación con credenciales

#### Otras Bibliotecas Backend

- **class-validator**: Para validación de datos basada en decoradores
- **class-transformer**: Para transformación de objetos
- **bcrypt**: Para hash de contraseñas
- **jsonwebtoken**: Para generación y verificación de tokens JWT
- **swagger-ui-express**: Para documentación de API
- **helmet**: Para seguridad HTTP
- **compression**: Para compresión de respuestas HTTP
- **winston**: Para logging

### Frontend

#### ReactJS

ReactJS es una biblioteca de JavaScript para construir interfaces de usuario, desarrollada por Facebook.

- **Versión**: 18.x
- **Características utilizadas**:
  - Componentes funcionales
  - Hooks (useState, useEffect, useContext, useReducer, etc.)
  - Context API para gestión de estado global
  - React Router para enrutamiento
  - React Hook Form para manejo de formularios
  - Error Boundaries para manejo de errores

#### Electron

Electron es un framework para crear aplicaciones de escritorio multiplataforma utilizando tecnologías web.

- **Versión**: 24.x
- **Características utilizadas**:
  - IPC (Inter-Process Communication) para comunicación entre procesos
  - Acceso al sistema de archivos
  - Integración con impresoras
  - Notificaciones nativas
  - Auto-actualización

#### Material UI

Material UI es una biblioteca de componentes de React que implementa el diseño Material Design de Google.

- **Versión**: 5.x
- **Características utilizadas**:
  - Componentes de UI (Button, TextField, Table, etc.)
  - Sistema de Grid para layouts responsivos
  - Temas personalizables
  - Iconos
  - Componentes de navegación (Drawer, AppBar, etc.)

#### Otras Bibliotecas Frontend

- **Axios**: Para peticiones HTTP
- **date-fns**: Para manipulación de fechas
- **recharts**: Para visualización de datos
- **jspdf**: Para generación de PDF
- **xlsx**: Para exportación a Excel
- **electron-store**: Para almacenamiento persistente
- **electron-builder**: Para empaquetado y distribución

### Base de Datos

#### PostgreSQL

PostgreSQL es un sistema de gestión de bases de datos relacional de código abierto, conocido por su robustez, escalabilidad y cumplimiento de estándares.

- **Versión**: 14.x
- **Características utilizadas**:
  - Tablas con relaciones
  - Índices para optimización de consultas
  - Triggers para automatización
  - Funciones almacenadas
  - Transacciones ACID
  - Constraints para integridad de datos

### Herramientas de Desarrollo

- **TypeScript**: Superset de JavaScript que añade tipado estático
- **ESLint**: Para análisis estático de código
- **Prettier**: Para formateo de código
- **Jest**: Para testing unitario
- **Supertest**: Para testing de API
- **Docker**: Para contenerización (opcional)
- **Git**: Para control de versiones

### Entorno de Ejecución

- **Node.js**: Entorno de ejecución para JavaScript del lado del servidor
- **npm**: Gestor de paquetes para Node.js

Esta combinación de tecnologías proporciona un equilibrio entre rendimiento, facilidad de desarrollo, mantenibilidad y experiencia de usuario, permitiendo crear un sistema POS robusto y escalable.


## Tecnologías Utilizadas

El Sistema POS para Tienda de Accesorios Móviles ha sido desarrollado utilizando un stack tecnológico moderno y robusto, seleccionado para garantizar rendimiento, escalabilidad, mantenibilidad y una experiencia de usuario óptima. A continuación, se detallan las principales tecnologías empleadas en cada capa del sistema.

### Backend

#### NestJS

NestJS es un framework para construir aplicaciones del lado del servidor en Node.js, inspirado en Angular. Proporciona una arquitectura que favorece la modularidad, la testabilidad y la escalabilidad.

- **Versión**: 9.x
- **Características utilizadas**:
  - Módulos para organizar el código
  - Controladores para manejar las solicitudes HTTP
  - Servicios para encapsular la lógica de negocio
  - Pipes para validación de datos
  - Guards para protección de rutas
  - Interceptors para transformación de respuestas
  - Decoradores para metadatos y configuración

#### TypeORM

TypeORM es un ORM (Object-Relational Mapping) para TypeScript y JavaScript que facilita la interacción con bases de datos relacionales.

- **Versión**: 0.3.x
- **Características utilizadas**:
  - Entidades para mapear tablas de la base de datos
  - Repositorios para operaciones CRUD
  - Relaciones entre entidades (one-to-one, one-to-many, many-to-many)
  - Migraciones para gestionar cambios en el esquema
  - Transacciones para operaciones atómicas
  - Caché para mejorar el rendimiento

#### Passport.js

Passport.js es un middleware de autenticación para Node.js que proporciona estrategias de autenticación flexibles.

- **Versión**: 0.6.x
- **Características utilizadas**:
  - Estrategia JWT para autenticación basada en tokens
  - Estrategia Local para autenticación con credenciales

#### Otras Bibliotecas Backend

- **class-validator**: Para validación de datos basada en decoradores
- **class-transformer**: Para transformación de objetos
- **bcrypt**: Para hash de contraseñas
- **jsonwebtoken**: Para generación y verificación de JWT
- **swagger-ui-express**: Para documentación de API
- **helmet**: Para seguridad HTTP
- **compression**: Para compresión de respuestas HTTP
- **winston**: Para logging

### Frontend

#### ReactJS

ReactJS es una biblioteca JavaScript para construir interfaces de usuario, desarrollada por Facebook.

- **Versión**: 18.x
- **Características utilizadas**:
  - Componentes funcionales
  - Hooks (useState, useEffect, useContext, useReducer, etc.)
  - Context API para gestión de estado global
  - React Router para enrutamiento
  - Lazy loading para carga diferida de componentes
  - Error boundaries para manejo de errores

#### Electron

Electron es un framework para crear aplicaciones de escritorio multiplataforma utilizando tecnologías web.

- **Versión**: 24.x
- **Características utilizadas**:
  - IPC (Inter-Process Communication) para comunicación entre procesos
  - APIs nativas para acceso al sistema de archivos
  - Empaquetado y distribución de aplicaciones
  - Auto-actualización

#### Material-UI

Material-UI es una biblioteca de componentes React que implementa el diseño Material Design de Google.

- **Versión**: 5.x
- **Características utilizadas**:
  - Componentes de UI (Button, TextField, Table, etc.)
  - Sistema de temas para personalización
  - Grid system para layouts responsivos
  - Iconos
  - Componentes de navegación (Drawer, AppBar, etc.)

#### Otras Bibliotecas Frontend

- **axios**: Para peticiones HTTP
- **react-hook-form**: Para manejo de formularios
- **jspdf**: Para generación de PDFs
- **xlsx**: Para exportación a Excel
- **recharts**: Para visualización de datos
- **date-fns**: Para manipulación de fechas
- **i18next**: Para internacionalización

### Base de Datos

#### PostgreSQL

PostgreSQL es un sistema de gestión de bases de datos relacional de código abierto, conocido por su robustez, escalabilidad y cumplimiento de estándares.

- **Versión**: 14.x
- **Características utilizadas**:
  - Tipos de datos avanzados
  - Índices para optimización de consultas
  - Restricciones para integridad de datos
  - Triggers para automatización
  - Funciones y procedimientos almacenados
  - Vistas para consultas complejas
  - Particionamiento para tablas grandes

### Herramientas de Desarrollo

- **TypeScript**: Superset de JavaScript que añade tipado estático
- **ESLint**: Para análisis estático de código
- **Prettier**: Para formateo de código
- **Jest**: Para testing unitario
- **Supertest**: Para testing de API
- **Webpack**: Para bundling de código frontend
- **npm**: Para gestión de dependencias
- **Git**: Para control de versiones

### Herramientas de Despliegue

- **Docker**: Para contenerización
- **Docker Compose**: Para orquestación de contenedores
- **Electron Builder**: Para empaquetado de aplicaciones Electron
- **PM2**: Para gestión de procesos Node.js en producción

### Tabla Comparativa de Tecnologías

| Categoría | Tecnología | Versión | Alternativas Consideradas | Razón de Elección |
|-----------|------------|---------|---------------------------|-------------------|
| Backend Framework | NestJS | 9.x | Express, Koa, Fastify | Arquitectura modular, soporte para TypeScript, documentación robusta |
| ORM | TypeORM | 0.3.x | Sequelize, Prisma, Knex | Integración con TypeScript, soporte para múltiples bases de datos |
| Autenticación | Passport.js | 0.6.x | Auth0, Firebase Auth | Flexibilidad, integración con NestJS |
| Frontend Library | ReactJS | 18.x | Angular, Vue.js | Flexibilidad, rendimiento, ecosistema |
| Desktop Framework | Electron | 24.x | NW.js, Tauri | Madurez, documentación, comunidad |
| UI Library | Material-UI | 5.x | Ant Design, Chakra UI | Componentes completos, personalización, accesibilidad |
| Base de Datos | PostgreSQL | 14.x | MySQL, SQLite, MongoDB | Robustez, características avanzadas, escalabilidad |
| Lenguaje | TypeScript | 4.9.x | JavaScript | Tipado estático, mejor tooling, menos errores |

Esta combinación de tecnologías proporciona un equilibrio entre rendimiento, facilidad de desarrollo, mantenibilidad y experiencia de usuario, permitiendo crear un sistema POS robusto y escalable.


## Tecnologías Utilizadas

El Sistema POS para Tienda de Accesorios Móviles ha sido desarrollado utilizando un conjunto de tecnologías modernas y robustas que garantizan un alto rendimiento, seguridad y escalabilidad. A continuación, se detallan las principales tecnologías empleadas en cada capa del sistema.

### Backend

#### NestJS

NestJS es un framework para construir aplicaciones del lado del servidor en Node.js de manera eficiente y escalable. Está inspirado en Angular y proporciona una arquitectura que favorece la modularidad, la inyección de dependencias y la separación de responsabilidades.

**Versión utilizada**: 9.0.0

**Características principales**:
- Arquitectura modular
- Soporte para TypeScript
- Inyección de dependencias
- Decoradores para metadatos
- Middleware, interceptores, filtros y pipes
- Soporte para WebSockets y microservicios
- Integración con múltiples bases de datos

#### TypeORM

TypeORM es un ORM (Object-Relational Mapping) que facilita la interacción con bases de datos relacionales desde TypeScript y JavaScript.

**Versión utilizada**: 0.3.10

**Características principales**:
- Soporte para múltiples bases de datos
- Modelado de entidades mediante decoradores
- Relaciones entre entidades
- Migraciones de base de datos
- Transacciones
- Caché de consultas
- Eventos de entidades

#### Passport.js

Passport.js es un middleware de autenticación para Node.js que proporciona estrategias de autenticación flexibles y modulares.

**Versión utilizada**: 0.6.0

**Características principales**:
- Múltiples estrategias de autenticación
- Integración con JWT
- Sesiones
- Autenticación social (OAuth)

#### JWT (JSON Web Tokens)

JWT es un estándar abierto (RFC 7519) que define una forma compacta y autónoma de transmitir información de forma segura entre partes como un objeto JSON.

**Versión utilizada**: 9.0.0 (jsonwebtoken)

**Características principales**:
- Tokens firmados digitalmente
- Información verificable
- Expiración configurable
- Payload personalizable

#### Class Validator

Class Validator es una biblioteca que permite validar objetos JavaScript/TypeScript utilizando decoradores.

**Versión utilizada**: 0.13.2

**Características principales**:
- Validación basada en decoradores
- Mensajes de error personalizables
- Validación condicional
- Validación personalizada

#### Swagger

Swagger es un conjunto de herramientas para diseñar, construir, documentar y consumir APIs RESTful.

**Versión utilizada**: 6.1.0 (@nestjs/swagger)

**Características principales**:
- Documentación automática de API
- Interfaz interactiva para probar endpoints
- Generación de clientes API
- Especificación OpenAPI

### Frontend

#### ReactJS

ReactJS es una biblioteca JavaScript para construir interfaces de usuario, especialmente para aplicaciones de una sola página (SPA).

**Versión utilizada**: 18.2.0

**Características principales**:
- Componentes reutilizables
- Virtual DOM
- Renderizado declarativo
- Flujo de datos unidireccional
- Hooks para gestión de estado y efectos
- Context API para estado global

#### Electron

Electron es un framework que permite desarrollar aplicaciones de escritorio multiplataforma utilizando tecnologías web como JavaScript, HTML y CSS.

**Versión utilizada**: 22.0.0

**Características principales**:
- Aplicaciones multiplataforma (Windows, macOS, Linux)
- Acceso a APIs nativas del sistema
- Actualizaciones automáticas
- Empaquetado y distribución simplificados
- Integración con Node.js

#### Material-UI

Material-UI es una biblioteca de componentes React que implementa el diseño Material Design de Google.

**Versión utilizada**: 5.11.0

**Características principales**:
- Componentes prediseñados
- Personalización de temas
- Responsive design
- Sistema de grid
- Iconos y tipografía
- Animaciones y transiciones

#### React Router

React Router es una biblioteca de enrutamiento para React que permite la navegación entre diferentes componentes.

**Versión utilizada**: 6.6.1

**Características principales**:
- Enrutamiento declarativo
- Navegación programática
- Rutas anidadas
- Parámetros de ruta
- Redirecciones
- Protección de rutas

#### Axios

Axios es un cliente HTTP basado en promesas para el navegador y Node.js.

**Versión utilizada**: 1.2.1

**Características principales**:
- Peticiones HTTP basadas en promesas
- Interceptores de peticiones y respuestas
- Transformación automática de datos JSON
- Cancelación de peticiones
- Protección contra XSRF

#### React Hook Form

React Hook Form es una biblioteca para gestionar formularios en React con un enfoque en el rendimiento y la experiencia del desarrollador.

**Versión utilizada**: 7.41.0

**Características principales**:
- Validación de formularios
- Manejo de errores
- Rendimiento optimizado
- Integración con bibliotecas UI
- Campos controlados y no controlados

### Base de Datos

#### PostgreSQL

PostgreSQL es un sistema de gestión de bases de datos relacional orientado a objetos y de código abierto.

**Versión utilizada**: 14.0

**Características principales**:
- ACID compliant
- Soporte para JSON y JSONB
- Índices avanzados (B-tree, Hash, GiST, SP-GiST, GIN, BRIN)
- Triggers y procedimientos almacenados
- Extensibilidad
- Replicación
- Particionamiento de tablas

### Herramientas de Desarrollo

#### TypeScript

TypeScript es un superconjunto tipado de JavaScript que compila a JavaScript plano.

**Versión utilizada**: 4.9.4

**Características principales**:
- Tipado estático
- Interfaces y tipos
- Decoradores
- Genéricos
- Módulos
- Namespaces

#### ESLint

ESLint es una herramienta de análisis de código estático para identificar patrones problemáticos en el código JavaScript.

**Versión utilizada**: 8.30.0

**Características principales**:
- Reglas configurables
- Integración con editores
- Autofix
- Plugins personalizados
- Soporte para TypeScript

#### Jest

Jest es un framework de testing para JavaScript con un enfoque en la simplicidad.

**Versión utilizada**: 29.3.1

**Características principales**:
- Zero config
- Snapshots
- Mocks y spies
- Cobertura de código
- Paralelización de tests

#### Prettier

Prettier es un formateador de código opinado que soporta múltiples lenguajes.

**Versión utilizada**: 2.8.1

**Características principales**:
- Formateo consistente
- Integración con editores
- Configuración mínima
- Soporte para múltiples lenguajes

### Herramientas de Construcción y Despliegue

#### npm

npm es el gestor de paquetes por defecto para Node.js.

**Versión utilizada**: 8.19.2

**Características principales**:
- Gestión de dependencias
- Scripts
- Versionado semántico
- Publicación de paquetes
- Workspaces

#### Webpack

Webpack es un empaquetador de módulos para aplicaciones JavaScript modernas.

**Versión utilizada**: 5.75.0

**Características principales**:
- Empaquetado de módulos
- Code splitting
- Loaders para diferentes tipos de archivos
- Plugins para optimización
- Hot Module Replacement

#### electron-builder

electron-builder es una solución completa para empaquetar y construir aplicaciones Electron listas para distribución.

**Versión utilizada**: 23.6.0

**Características principales**:
- Empaquetado para múltiples plataformas
- Auto-actualización
- Code signing
- Generación de instaladores
- Publicación en tiendas de aplicaciones

### Tabla Resumen de Tecnologías

| Categoría | Tecnología | Versión | Propósito |
|-----------|------------|---------|-----------|
| **Backend** | NestJS | 9.0.0 | Framework de servidor |
| | TypeORM | 0.3.10 | ORM para base de datos |
| | Passport.js | 0.6.0 | Autenticación |
| | JWT | 9.0.0 | Tokens de autenticación |
| | Class Validator | 0.13.2 | Validación de datos |
| | Swagger | 6.1.0 | Documentación de API |
| **Frontend** | ReactJS | 18.2.0 | Biblioteca UI |
| | Electron | 22.0.0 | Framework de escritorio |
| | Material-UI | 5.11.0 | Componentes UI |
| | React Router | 6.6.1 | Enrutamiento |
| | Axios | 1.2.1 | Cliente HTTP |
| | React Hook Form | 7.41.0 | Gestión de formularios |
| **Base de Datos** | PostgreSQL | 14.0 | Sistema de gestión de BD |
| **Desarrollo** | TypeScript | 4.9.4 | Lenguaje de programación |
| | ESLint | 8.30.0 | Linting de código |
| | Jest | 29.3.1 | Testing |
| | Prettier | 2.8.1 | Formateo de código |
| **Construcción** | npm | 8.19.2 | Gestor de paquetes |
| | Webpack | 5.75.0 | Empaquetador |
| | electron-builder | 23.6.0 | Construcción de aplicación |

Esta combinación de tecnologías proporciona una base sólida para el desarrollo, mantenimiento y escalabilidad del Sistema POS para Tienda de Accesorios Móviles.


## Estructura del Proyecto

La estructura del proyecto está organizada de manera modular para facilitar el desarrollo, mantenimiento y escalabilidad del sistema. A continuación, se detalla la estructura de directorios tanto para el backend como para el frontend.

### Estructura General

```
pos-system/
├── backend/
│   └── pos-backend/       # Proyecto NestJS
├── frontend/
│   └── pos-frontend/      # Proyecto React + Electron
├── docs/                  # Documentación
│   ├── tecnica/           # Documentación técnica
│   └── usuario/           # Manual de usuario
└── scripts/               # Scripts de utilidad
```

### Estructura del Backend (NestJS)

```
pos-backend/
├── src/
│   ├── app.module.ts      # Módulo principal de la aplicación
│   ├── app.controller.ts  # Controlador principal
│   ├── app.service.ts     # Servicio principal
│   ├── main.ts            # Punto de entrada de la aplicación
│   ├── common/            # Código compartido entre módulos
│   │   ├── decorators/    # Decoradores personalizados
│   │   ├── dto/           # DTOs compartidos
│   │   ├── enums/         # Enumeraciones
│   │   ├── filters/       # Filtros de excepción
│   │   ├── guards/        # Guards compartidos
│   │   ├── interceptors/  # Interceptores
│   │   ├── interfaces/    # Interfaces compartidas
│   │   ├── middleware/    # Middleware
│   │   └── pipes/         # Pipes de validación
│   ├── config/            # Configuración de la aplicación
│   │   ├── database.config.ts  # Configuración de la base de datos
│   │   ├── jwt.config.ts       # Configuración de JWT
│   │   └── cors.config.ts      # Configuración de CORS
│   ├── modules/           # Módulos funcionales
│   │   ├── auth/          # Módulo de autenticación
│   │   ├── usuarios/      # Módulo de usuarios
│   │   ├── roles/         # Módulo de roles
│   │   ├── personas/      # Módulo de personas
│   │   ├── companias/     # Módulo de compañías
│   │   ├── tiendas/       # Módulo de tiendas
│   │   ├── productos/     # Módulo de productos
│   │   ├── inventario/    # Módulo de inventario
│   │   ├── kardex/        # Módulo de kardex
│   │   ├── ventas/        # Módulo de ventas
│   │   ├── gastos/        # Módulo de gastos
│   │   ├── metodos-pago/  # Módulo de métodos de pago
│   │   ├── proveedores/   # Módulo de proveedores
│   │   ├── reportes/      # Módulo de reportes
│   │   └── alertas/       # Módulo de alertas
├── test/                  # Pruebas
│   ├── app.e2e-spec.ts    # Pruebas end-to-end
│   └── jest-e2e.json      # Configuración de Jest para pruebas e2e
├── dist/                  # Código compilado
├── node_modules/          # Dependencias
├── .env                   # Variables de entorno
├── .env.development       # Variables de entorno para desarrollo
├── .env.production        # Variables de entorno para producción
├── .eslintrc.js           # Configuración de ESLint
├── .prettierrc            # Configuración de Prettier
├── nest-cli.json          # Configuración de NestJS CLI
├── package.json           # Dependencias y scripts
├── tsconfig.json          # Configuración de TypeScript
└── README.md              # Documentación básica
```

#### Estructura de un Módulo Típico

Cada módulo funcional sigue una estructura similar:

```
modulo/
├── controllers/           # Controladores del módulo
│   └── modulo.controller.ts
├── dto/                   # Data Transfer Objects
│   ├── create-modulo.dto.ts
│   └── update-modulo.dto.ts
├── entities/              # Entidades de base de datos
│   └── modulo.entity.ts
├── interfaces/            # Interfaces específicas del módulo
│   └── modulo.interface.ts
├── services/              # Servicios del módulo
│   └── modulo.service.ts
└── modulo.module.ts       # Definición del módulo
```

### Estructura del Frontend (React + Electron)

```
pos-frontend/
├── public/                # Archivos públicos
│   ├── index.html         # Plantilla HTML
│   ├── favicon.ico        # Favicon
│   └── manifest.json      # Manifest para PWA
├── src/                   # Código fuente
│   ├── assets/            # Recursos estáticos
│   │   ├── images/        # Imágenes
│   │   ├── styles/        # Estilos globales
│   │   └── fonts/         # Fuentes
│   ├── components/        # Componentes reutilizables
│   │   ├── common/        # Componentes comunes
│   │   ├── forms/         # Componentes de formularios
│   │   ├── layout/        # Componentes de layout
│   │   └── ui/            # Componentes de UI
│   ├── contexts/          # Contextos de React
│   │   ├── AuthContext.tsx  # Contexto de autenticación
│   │   └── ThemeContext.tsx # Contexto de tema
│   ├── hooks/             # Hooks personalizados
│   │   ├── useForm.ts     # Hook para formularios
│   │   └── useApi.ts      # Hook para llamadas a API
│   ├── layouts/           # Layouts de la aplicación
│   │   ├── MainLayout.tsx # Layout principal
│   │   └── AuthLayout.tsx # Layout de autenticación
│   ├── pages/             # Páginas de la aplicación
│   │   ├── Login.tsx      # Página de login
│   │   ├── Dashboard.tsx  # Dashboard principal
│   │   ├── Productos.tsx  # Gestión de productos
│   │   ├── Ventas.tsx     # Gestión de ventas
│   │   ├── Gastos.tsx     # Gestión de gastos
│   │   ├── Reportes.tsx   # Reportes
│   │   └── Administracion.tsx # Administración
│   ├── services/          # Servicios
│   │   ├── api.ts         # Cliente API
│   │   └── auth.ts        # Servicio de autenticación
│   ├── utils/             # Utilidades
│   │   ├── formatters.ts  # Formateadores
│   │   ├── validators.ts  # Validadores
│   │   └── helpers.ts     # Funciones auxiliares
│   ├── theme/             # Configuración de tema
│   │   └── index.ts       # Tema principal
│   ├── App.tsx            # Componente principal
│   ├── index.tsx          # Punto de entrada
│   └── react-app-env.d.ts # Tipos para CRA
├── electron/              # Código de Electron
│   ├── main.js            # Proceso principal
│   └── preload.js         # Script de precarga
├── build/                 # Código compilado para web
├── dist/                  # Distribución de Electron
├── node_modules/          # Dependencias
├── .env                   # Variables de entorno
├── .env.development       # Variables para desarrollo
├── .env.production        # Variables para producción
├── .eslintrc.js           # Configuración de ESLint
├── .prettierrc            # Configuración de Prettier
├── electron-builder.json  # Configuración de electron-builder
├── package.json           # Dependencias y scripts
├── tsconfig.json          # Configuración de TypeScript
└── README.md              # Documentación básica
```

### Estructura de la Base de Datos

La estructura de la base de datos está diseñada siguiendo principios de normalización y optimización para el rendimiento. A continuación, se presenta un diagrama simplificado de las principales tablas y sus relaciones:

```
+----------------+       +----------------+       +----------------+
| usuarios       |       | roles          |       | personas       |
+----------------+       +----------------+       +----------------+
| id             |------>| id             |       | id             |
| username       |       | nombre         |       | nombre         |
| password       |       | descripcion    |       | apellido       |
| email          |       | permisos       |       | tipo_persona   |
| rol_id         |       +----------------+       | tipo_id_id     |
| persona_id     |----+                           | num_identificacion |
| activo         |    |                           | direccion      |
+----------------+    |                           | telefono       |
                      |                           | email          |
                      |                           | activo         |
                      |                           +----------------+
                      |                                  ^
                      +----------------------------------+

+----------------+       +----------------+       +----------------+
| companias      |       | tiendas        |       | productos      |
+----------------+       +----------------+       +----------------+
| id             |       | id             |       | id             |
| nombre         |------>| nombre         |------>| nombre         |
| nit            |       | direccion      |       | descripcion    |
| direccion      |       | telefono       |       | codigo         |
| telefono       |       | email          |       | precio_venta   |
| email          |       | compania_id    |       | precio_compra  |
| activo         |       | activo         |       | impuesto_id    |
+----------------+       +----------------+       | unidad_id      |
                                                 | imagen         |
                                                 | activo         |
                                                 +----------------+

+----------------+       +----------------+       +----------------+
| inventario     |       | kardex         |       | ventas         |
+----------------+       +----------------+       +----------------+
| id             |       | id             |       | id             |
| producto_id    |------>| producto_id    |       | fecha          |
| tienda_id      |       | tipo_movimiento|       | cliente_id     |
| cantidad       |       | cantidad       |       | vendedor_id    |
| stock_minimo   |       | fecha          |       | tienda_id      |
| activo         |       | referencia     |       | total          |
+----------------+       | venta_id       |------>| subtotal       |
                         | activo         |       | impuesto       |
                         +----------------+       | estado         |
                                                 | metodo_pago_id  |
                                                 +----------------+
```

Esta estructura de proyecto proporciona una organización clara y modular, facilitando el desarrollo colaborativo y el mantenimiento a largo plazo del sistema.


## Estructura del Proyecto

El Sistema POS para Tienda de Accesorios Móviles está organizado en una estructura de directorios clara y modular que facilita el desarrollo, mantenimiento y escalabilidad del código. La estructura sigue las mejores prácticas para proyectos NestJS (backend) y ReactJS con Electron (frontend).

### Estructura General

El proyecto está dividido en dos directorios principales:

```
/pos-system/
├── backend/             # Código del backend (NestJS)
│   └── pos-backend/     # Proyecto NestJS
├── frontend/            # Código del frontend (ReactJS + Electron)
│   └── pos-frontend/    # Proyecto React con Electron
├── docs/                # Documentación del proyecto
│   ├── tecnica/         # Documentación técnica
│   └── usuario/         # Manual de usuario
├── dev-start.sh         # Script para iniciar el sistema en modo desarrollo
├── run-integration-tests.sh  # Script para ejecutar pruebas de integración
└── optimize.sh          # Script para optimización y corrección de errores
```

### Estructura del Backend

El backend sigue la estructura de directorios recomendada por NestJS, con algunas personalizaciones para adaptarse a las necesidades específicas del proyecto:

```
/backend/pos-backend/
├── src/                 # Código fuente
│   ├── app.module.ts    # Módulo principal de la aplicación
│   ├── app.controller.ts # Controlador principal
│   ├── app.service.ts   # Servicio principal
│   ├── main.ts          # Punto de entrada de la aplicación
│   ├── common/          # Código compartido entre módulos
│   │   ├── decorators/  # Decoradores personalizados
│   │   ├── dto/         # DTOs compartidos
│   │   ├── enums/       # Enumeraciones
│   │   ├── filters/     # Filtros de excepción
│   │   ├── guards/      # Guards compartidos
│   │   ├── interceptors/ # Interceptores
│   │   ├── interfaces/  # Interfaces compartidas
│   │   ├── middleware/  # Middleware
│   │   └── utils/       # Utilidades
│   ├── config/          # Configuración de la aplicación
│   │   ├── database.config.ts # Configuración de la base de datos
│   │   ├── jwt.config.ts # Configuración de JWT
│   │   └── cors.config.ts # Configuración de CORS
│   └── modules/         # Módulos de la aplicación
│       ├── auth/        # Módulo de autenticación
│       ├── usuarios/    # Módulo de usuarios
│       ├── roles/       # Módulo de roles
│       ├── personas/    # Módulo de personas
│       ├── companias/   # Módulo de compañías
│       ├── tiendas/     # Módulo de tiendas
│       ├── productos/   # Módulo de productos
│       ├── inventario/  # Módulo de inventario
│       ├── kardex/      # Módulo de kardex
│       ├── ventas/      # Módulo de ventas
│       ├── gastos/      # Módulo de gastos
│       ├── metodos-pago/ # Módulo de métodos de pago
│       ├── proveedores/ # Módulo de proveedores
│       ├── reportes/    # Módulo de reportes
│       └── alertas/     # Módulo de alertas
├── test/                # Pruebas
│   ├── app.e2e-spec.ts  # Pruebas end-to-end
│   └── integration/     # Pruebas de integración
├── dist/                # Código compilado
├── node_modules/        # Dependencias
├── .env                 # Variables de entorno
├── .env.development     # Variables de entorno para desarrollo
├── .env.production      # Variables de entorno para producción
├── .eslintrc.js         # Configuración de ESLint
├── .prettierrc          # Configuración de Prettier
├── nest-cli.json        # Configuración de NestJS CLI
├── package.json         # Dependencias y scripts
├── tsconfig.json        # Configuración de TypeScript
└── README.md            # Documentación básica
```

#### Estructura de un Módulo

Cada módulo en el backend sigue una estructura similar:

```
/modules/ejemplo/
├── controllers/       # Controladores del módulo
├── dto/               # DTOs específicos del módulo
├── entities/          # Entidades de base de datos
├── interfaces/        # Interfaces específicas del módulo
├── services/          # Servicios del módulo
├── ejemplo.module.ts  # Definición del módulo
├── ejemplo.controller.ts # Controlador principal
└── ejemplo.service.ts # Servicio principal
```

### Estructura del Frontend

El frontend sigue una estructura de directorios organizada por funcionalidad, con separación clara entre componentes, páginas y servicios:

```
/frontend/pos-frontend/
├── public/             # Archivos públicos
│   ├── index.html      # Plantilla HTML principal
│   ├── favicon.ico     # Favicon
│   └── manifest.json   # Manifest para PWA
├── src/                # Código fuente
│   ├── assets/         # Recursos estáticos (imágenes, fuentes, etc.)
│   ├── components/     # Componentes reutilizables
│   │   ├── common/     # Componentes comunes
│   │   ├── forms/      # Componentes de formularios
│   │   ├── layout/     # Componentes de layout
│   │   └── ui/         # Componentes de UI
│   ├── contexts/       # Contextos de React
│   │   ├── AuthContext.tsx # Contexto de autenticación
│   │   └── ThemeContext.tsx # Contexto de tema
│   ├── hooks/          # Hooks personalizados
│   ├── layouts/        # Layouts de la aplicación
│   │   ├── MainLayout.tsx # Layout principal
│   │   └── AuthLayout.tsx # Layout de autenticación
│   ├── pages/          # Páginas de la aplicación
│   │   ├── Login.tsx   # Página de login
│   │   ├── Dashboard.tsx # Dashboard principal
│   │   ├── Productos.tsx # Gestión de productos
│   │   ├── Ventas.tsx  # Gestión de ventas
│   │   ├── Gastos.tsx  # Gestión de gastos
│   │   ├── Reportes.tsx # Reportes
│   │   └── Administracion.tsx # Administración
│   ├── services/       # Servicios para comunicación con el backend
│   │   ├── api.ts      # Cliente API base
│   │   ├── auth.service.ts # Servicio de autenticación
│   │   ├── productos.service.ts # Servicio de productos
│   │   └── ...         # Otros servicios
│   ├── theme/          # Configuración de tema
│   ├── utils/          # Utilidades
│   │   ├── validations.ts # Utilidades de validación
│   │   ├── formatters.ts # Formateadores
│   │   └── helpers.ts  # Funciones auxiliares
│   ├── App.tsx         # Componente principal
│   ├── index.tsx       # Punto de entrada
│   └── react-app-env.d.ts # Declaraciones de tipos
├── electron/           # Código específico de Electron
│   ├── main.js         # Proceso principal de Electron
│   └── preload.js      # Script de precarga
├── node_modules/       # Dependencias
├── .env                # Variables de entorno
├── .env.development    # Variables de entorno para desarrollo
├── .env.production     # Variables de entorno para producción
├── .eslintrc.js        # Configuración de ESLint
├── .prettierrc         # Configuración de Prettier
├── electron-builder.json # Configuración de Electron Builder
├── package.json        # Dependencias y scripts
├── tsconfig.json       # Configuración de TypeScript
└── README.md           # Documentación básica
```

### Estructura de la Base de Datos

La estructura de la base de datos PostgreSQL refleja el modelo de dominio del sistema, con tablas para cada entidad principal y relaciones entre ellas. Las principales tablas son:

- `usuarios`: Almacena información de los usuarios del sistema
- `roles`: Define los roles disponibles en el sistema
- `personas`: Almacena información de personas (clientes, empleados, proveedores)
- `companias`: Almacena información de las compañías
- `tiendas`: Almacena información de las tiendas asociadas a una compañía
- `productos`: Catálogo de productos
- `inventario`: Estado actual del inventario por producto y tienda
- `kardex`: Registro de movimientos de inventario
- `ventas`: Registro de ventas
- `detalle_ventas`: Detalles de productos en cada venta
- `gastos`: Registro de gastos
- `detalle_gastos`: Detalles de cada gasto
- `metodos_pago`: Métodos de pago disponibles
- `proveedores_productos`: Relación entre proveedores y productos

### Convenciones de Nomenclatura

El proyecto sigue convenciones de nomenclatura consistentes para facilitar la comprensión y mantenimiento del código:

#### Backend

- **Archivos**: kebab-case (ej. `auth-service.ts`)
- **Clases**: PascalCase (ej. `AuthService`)
- **Métodos y variables**: camelCase (ej. `getUserById`)
- **Constantes**: UPPER_SNAKE_CASE (ej. `MAX_LOGIN_ATTEMPTS`)
- **Interfaces**: PascalCase con prefijo I (ej. `IUser`)
- **Enums**: PascalCase (ej. `UserRole`)
- **Decoradores**: camelCase (ej. `@isPublic()`)

#### Frontend

- **Archivos de componentes**: PascalCase (ej. `LoginForm.tsx`)
- **Archivos de utilidades**: camelCase (ej. `formatCurrency.ts`)
- **Componentes**: PascalCase (ej. `<ProductCard />`)
- **Hooks personalizados**: camelCase con prefijo use (ej. `useAuth`)
- **Contextos**: PascalCase con sufijo Context (ej. `AuthContext`)
- **Estilos**: camelCase (ej. `loginContainer`)

#### Base de Datos

- **Tablas**: snake_case en plural (ej. `usuarios`)
- **Columnas**: snake_case (ej. `fecha_creacion`)
- **Claves primarias**: Prefijo `id_` (ej. `id_usuario`)
- **Claves foráneas**: Nombre de la tabla referenciada en singular con prefijo `id_` (ej. `id_rol`)
- **Índices**: Prefijo `idx_` (ej. `idx_usuarios_email`)

### Flujo de Trabajo de Desarrollo

El proyecto está configurado para soportar un flujo de trabajo de desarrollo eficiente:

1. **Desarrollo local**: Utilizando el script `dev-start.sh` que inicia tanto el backend como el frontend en modo desarrollo con recarga en caliente.
2. **Pruebas**: Ejecución de pruebas unitarias y de integración mediante scripts npm.
3. **Construcción**: Generación de versiones optimizadas para producción.
4. **Despliegue**: Instrucciones y scripts para desplegar el sistema en diferentes entornos.

Esta estructura de proyecto proporciona una base sólida para el desarrollo y mantenimiento del Sistema POS, facilitando la colaboración entre desarrolladores y la extensión del sistema con nuevas funcionalidades.


## Estructura del Proyecto

El Sistema POS para Tienda de Accesorios Móviles está organizado en una estructura de directorios clara y modular que facilita el desarrollo, mantenimiento y escalabilidad del código. La estructura sigue las mejores prácticas para proyectos NestJS (backend) y ReactJS/Electron (frontend).

### Estructura General

El proyecto está dividido en dos directorios principales:

```
/pos-system/
├── backend/           # Código del servidor NestJS
├── frontend/          # Código de la aplicación ReactJS/Electron
├── docs/              # Documentación del proyecto
├── scripts/           # Scripts de utilidad
└── .env               # Variables de entorno globales
```

### Estructura del Backend

El backend sigue la estructura de directorios recomendada por NestJS, con una organización modular basada en las funcionalidades del sistema:

```
/backend/
├── dist/              # Código compilado
├── node_modules/      # Dependencias
├── src/
│   ├── common/        # Código compartido entre módulos
│   │   ├── decorators/    # Decoradores personalizados
│   │   ├── dto/           # DTOs compartidos
│   │   ├── enums/         # Enumeraciones
│   │   ├── exceptions/    # Excepciones personalizadas
│   │   ├── filters/       # Filtros de excepción
│   │   ├── guards/        # Guards compartidos
│   │   ├── interceptors/  # Interceptores
│   │   ├── interfaces/    # Interfaces compartidas
│   │   ├── middleware/    # Middleware
│   │   └── utils/         # Utilidades
│   ├── config/        # Configuración de la aplicación
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│   ├── modules/       # Módulos funcionales
│   │   ├── auth/          # Autenticación y autorización
│   │   ├── usuarios/      # Gestión de usuarios
│   │   ├── roles/         # Gestión de roles
│   │   ├── personas/      # Gestión de personas (clientes, empleados, proveedores)
│   │   ├── companias/     # Gestión de compañías
│   │   ├── tiendas/       # Gestión de tiendas
│   │   ├── productos/     # Gestión de productos
│   │   ├── inventario/    # Gestión de inventario
│   │   ├── kardex/        # Movimientos de inventario
│   │   ├── ventas/        # Gestión de ventas
│   │   ├── gastos/        # Gestión de gastos
│   │   ├── metodos-pago/  # Métodos de pago
│   │   ├── proveedores/   # Gestión de proveedores
│   │   ├── reportes/      # Generación de reportes
│   │   └── alertas/       # Sistema de alertas
│   ├── app.module.ts  # Módulo principal
│   ├── app.controller.ts  # Controlador principal
│   ├── app.service.ts     # Servicio principal
│   └── main.ts       # Punto de entrada
├── test/             # Tests
│   ├── unit/         # Tests unitarios
│   ├── integration/  # Tests de integración
│   └── e2e/          # Tests end-to-end
├── .env              # Variables de entorno
├── .env.development  # Variables de entorno para desarrollo
├── .env.production   # Variables de entorno para producción
├── .eslintrc.js      # Configuración de ESLint
├── .prettierrc       # Configuración de Prettier
├── nest-cli.json     # Configuración de NestJS CLI
├── package.json      # Dependencias y scripts
├── tsconfig.json     # Configuración de TypeScript
└── README.md         # Documentación básica
```

#### Estructura de un Módulo

Cada módulo en el backend sigue una estructura consistente:

```
/modules/ejemplo/
├── controllers/      # Controladores del módulo
│   └── ejemplo.controller.ts
├── dto/              # Data Transfer Objects
│   ├── create-ejemplo.dto.ts
│   └── update-ejemplo.dto.ts
├── entities/         # Entidades de base de datos
│   └── ejemplo.entity.ts
├── services/         # Servicios con lógica de negocio
│   └── ejemplo.service.ts
├── repositories/     # Repositorios personalizados (opcional)
│   └── ejemplo.repository.ts
├── interfaces/       # Interfaces específicas del módulo
│   └── ejemplo.interface.ts
├── ejemplo.module.ts # Definición del módulo
└── ejemplo.constants.ts  # Constantes específicas del módulo
```

### Estructura del Frontend

El frontend sigue una estructura organizada por características y componentes:

```
/frontend/
├── build/            # Código compilado para producción
├── node_modules/     # Dependencias
├── public/           # Archivos estáticos
│   ├── index.html    # Plantilla HTML principal
│   ├── favicon.ico   # Favicon
│   └── assets/       # Recursos estáticos
├── electron/         # Configuración de Electron
│   ├── main.js       # Proceso principal de Electron
│   └── preload.js    # Script de precarga
├── src/
│   ├── assets/       # Recursos de la aplicación
│   │   ├── images/   # Imágenes
│   │   ├── styles/   # Estilos globales
│   │   └── fonts/    # Fuentes
│   ├── components/   # Componentes reutilizables
│   │   ├── common/   # Componentes comunes
│   │   ├── forms/    # Componentes de formularios
│   │   ├── layout/   # Componentes de layout
│   │   └── ui/       # Componentes de UI
│   ├── contexts/     # Contextos de React
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/        # Hooks personalizados
│   │   ├── useForm.ts
│   │   └── useApi.ts
│   ├── layouts/      # Layouts de la aplicación
│   │   ├── MainLayout.tsx
│   │   └── AuthLayout.tsx
│   ├── pages/        # Páginas de la aplicación
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Productos.tsx
│   │   ├── Ventas.tsx
│   │   ├── Gastos.tsx
│   │   ├── Reportes.tsx
│   │   └── Administracion.tsx
│   ├── services/     # Servicios para comunicación con API
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── productos.service.ts
│   │   └── ventas.service.ts
│   ├── utils/        # Utilidades
│   │   ├── validations.ts
│   │   ├── formatters.ts
│   │   └── helpers.ts
│   ├── theme/        # Configuración de temas
│   │   └── index.ts
│   ├── App.tsx       # Componente principal
│   └── index.tsx     # Punto de entrada
├── .env              # Variables de entorno
├── .env.development  # Variables de entorno para desarrollo
├── .env.production   # Variables de entorno para producción
├── .eslintrc.js      # Configuración de ESLint
├── .prettierrc       # Configuración de Prettier
├── electron-builder.json  # Configuración de electron-builder
├── package.json      # Dependencias y scripts
├── tsconfig.json     # Configuración de TypeScript
└── README.md         # Documentación básica
```

### Estructura de la Base de Datos

La estructura de la base de datos PostgreSQL refleja el modelo de dominio del sistema:

```
pos_db
├── public
│   ├── compania                # Tabla de compañías
│   ├── tienda                  # Tabla de tiendas
│   ├── tipo_identificacion     # Tipos de identificación
│   ├── persona                 # Tabla de personas (clientes, empleados, proveedores)
│   ├── rol                     # Tabla de roles
│   ├── usuario                 # Tabla de usuarios
│   ├── unidad                  # Unidades de medida
│   ├── impuesto                # Tabla de impuestos
│   ├── producto                # Tabla de productos
│   ├── inventario              # Tabla de inventario
│   ├── kardex                  # Tabla de movimientos de inventario
│   ├── metodo_pago             # Tabla de métodos de pago
│   ├── venta                   # Tabla de ventas
│   ├── detalle_venta           # Detalles de ventas
│   ├── gasto                   # Tabla de gastos
│   ├── detalle_gasto           # Detalles de gastos
│   └── proveedor_producto      # Relación entre proveedores y productos
```

### Convenciones de Nomenclatura

El proyecto sigue convenciones de nomenclatura consistentes para facilitar la comprensión y mantenimiento del código:

#### Backend

- **Archivos**: kebab-case (ej. `user-profile.service.ts`)
- **Clases**: PascalCase (ej. `UserProfileService`)
- **Métodos y propiedades**: camelCase (ej. `getUserProfile()`)
- **Constantes**: SNAKE_CASE_MAYÚSCULAS (ej. `MAX_LOGIN_ATTEMPTS`)
- **Interfaces**: PascalCase con prefijo I (ej. `IUserProfile`)
- **Enumeraciones**: PascalCase (ej. `UserRole`)
- **Módulos**: kebab-case (ej. `user-profile`)

#### Frontend

- **Archivos de componentes**: PascalCase (ej. `UserProfile.tsx`)
- **Archivos de utilidades**: camelCase (ej. `formatDate.ts`)
- **Componentes**: PascalCase (ej. `UserProfile`)
- **Props**: camelCase (ej. `userName`)
- **Hooks personalizados**: camelCase con prefijo use (ej. `useFormValidation`)
- **Contextos**: PascalCase con sufijo Context (ej. `UserContext`)

#### Base de Datos

- **Tablas**: snake_case en singular (ej. `usuario`)
- **Columnas**: snake_case (ej. `fecha_creacion`)
- **Claves primarias**: id o tabla_id (ej. `usuario_id`)
- **Claves foráneas**: tabla_referenciada_id (ej. `rol_id`)
- **Índices**: idx_tabla_columna (ej. `idx_usuario_email`)

### Gestión de Dependencias

Las dependencias del proyecto se gestionan mediante npm y están definidas en los archivos `package.json` de los directorios backend y frontend. Las dependencias están organizadas en:

- **dependencies**: Dependencias necesarias para la ejecución del proyecto en producción.
- **devDependencies**: Dependencias necesarias solo para el desarrollo y testing.

### Scripts de Utilidad

El proyecto incluye varios scripts para facilitar el desarrollo, testing y despliegue:

#### Backend

- `npm run start`: Inicia el servidor en modo desarrollo.
- `npm run start:dev`: Inicia el servidor en modo desarrollo con hot reload.
- `npm run start:prod`: Inicia el servidor en modo producción.
- `npm run build`: Compila el proyecto.
- `npm run test`: Ejecuta los tests unitarios.
- `npm run test:e2e`: Ejecuta los tests end-to-end.
- `npm run lint`: Ejecuta el linter.

#### Frontend

- `npm run start`: Inicia la aplicación React en modo desarrollo.
- `npm run build`: Compila la aplicación React para producción.
- `npm run electron:dev`: Inicia la aplicación Electron en modo desarrollo.
- `npm run electron:build`: Compila la aplicación Electron para producción.
- `npm run test`: Ejecuta los tests.
- `npm run lint`: Ejecuta el linter.

### Flujo de Desarrollo

El flujo de desarrollo recomendado para el proyecto es:

1. Clonar el repositorio.
2. Instalar las dependencias con `npm install` en los directorios backend y frontend.
3. Configurar las variables de entorno en los archivos `.env`.
4. Iniciar la base de datos PostgreSQL.
5. Ejecutar las migraciones de la base de datos.
6. Iniciar el backend con `npm run start:dev`.
7. Iniciar el frontend con `npm run electron:dev`.
8. Desarrollar siguiendo las convenciones del proyecto.
9. Ejecutar los tests antes de hacer commit.
10. Construir la aplicación para producción cuando sea necesario.

Esta estructura de proyecto proporciona una base sólida para el desarrollo y mantenimiento del Sistema POS para Tienda de Accesorios Móviles, facilitando la colaboración entre desarrolladores y la escalabilidad del sistema.


## Estructura del Proyecto

El Sistema POS para Tienda de Accesorios Móviles está organizado siguiendo una estructura modular y clara que facilita el desarrollo, mantenimiento y escalabilidad. La organización de archivos y directorios sigue las mejores prácticas para proyectos NestJS (backend) y React+Electron (frontend).

### Estructura General del Proyecto

```
pos-system/
├── backend/                # Código del backend
│   └── pos-backend/        # Proyecto NestJS
├── frontend/               # Código del frontend
│   └── pos-frontend/       # Proyecto React+Electron
├── docs/                   # Documentación
│   ├── tecnica/            # Documentación técnica
│   └── usuario/            # Manual de usuario
├── scripts/                # Scripts de utilidad
├── dev-start.sh            # Script para iniciar el entorno de desarrollo
├── run-integration-tests.sh # Script para ejecutar pruebas de integración
└── optimize.sh             # Script para optimización y corrección de errores
```

### Estructura del Backend (NestJS)

El backend está organizado siguiendo la estructura recomendada por NestJS, con una clara separación de responsabilidades y un enfoque modular.

```
pos-backend/
├── src/
│   ├── main.ts                # Punto de entrada de la aplicación
│   ├── app.module.ts          # Módulo principal
│   ├── app.controller.ts      # Controlador principal
│   ├── app.service.ts         # Servicio principal
│   ├── common/                # Código compartido
│   │   ├── decorators/        # Decoradores personalizados
│   │   ├── dto/               # DTOs compartidos
│   │   ├── enums/             # Enumeraciones
│   │   │   ├── tipo-movimiento.enum.ts
│   │   │   └── tipo-persona.enum.ts
│   │   ├── filters/           # Filtros de excepción
│   │   │   ├── http-exception.filter.ts
│   │   │   └── all-exceptions.filter.ts
│   │   ├── interceptors/      # Interceptores
│   │   │   └── transform.interceptor.ts
│   │   └── middleware/        # Middleware
│   │       └── logger.middleware.ts
│   ├── config/                # Configuración
│   │   ├── database.config.ts # Configuración de base de datos
│   │   ├── jwt.config.ts      # Configuración de JWT
│   │   └── cors.config.ts     # Configuración de CORS
│   └── modules/               # Módulos funcionales
│       ├── auth/              # Autenticación
│       │   ├── auth.controller.ts
│       │   ├── auth.module.ts
│       │   ├── auth.service.ts
│       │   ├── dto/
│       │   │   ├── login.dto.ts
│       │   │   └── register.dto.ts
│       │   ├── guards/
│       │   │   ├── jwt-auth.guard.ts
│       │   │   └── roles.guard.ts
│       │   ├── decorators/
│       │   │   ├── public.decorator.ts
│       │   │   └── roles.decorator.ts
│       │   └── strategies/
│       │       └── jwt.strategy.ts
│       ├── usuarios/          # Usuarios
│       │   ├── usuarios.controller.ts
│       │   ├── usuarios.module.ts
│       │   ├── usuarios.service.ts
│       │   ├── dto/
│       │   │   ├── create-usuario.dto.ts
│       │   │   └── update-usuario.dto.ts
│       │   └── entities/
│       │       └── usuario.entity.ts
│       ├── roles/             # Roles
│       ├── personas/          # Personas
│       ├── companias/         # Compañías
│       ├── tiendas/           # Tiendas
│       ├── productos/         # Productos
│       │   ├── entities/
│       │   │   ├── producto.entity.ts
│       │   │   ├── unidad.entity.ts
│       │   │   └── impuesto.entity.ts
│       │   └── ...
│       ├── inventario/        # Inventario
│       ├── kardex/            # Kardex
│       ├── ventas/            # Ventas
│       │   ├── entities/
│       │   │   ├── venta.entity.ts
│       │   │   └── detalle-venta.entity.ts
│       │   └── ...
│       ├── gastos/            # Gastos
│       │   ├── entities/
│       │   │   ├── gasto.entity.ts
│       │   │   └── detalle-gasto.entity.ts
│       │   └── ...
│       ├── metodos-pago/      # Métodos de pago
│       ├── proveedores/       # Proveedores
│       ├── reportes/          # Reportes
│       └── alertas/           # Alertas
├── test/                      # Pruebas
│   ├── app.e2e-spec.ts
│   ├── jest-e2e.json
│   └── integration/           # Pruebas de integración
│       ├── auth.integration.spec.ts
│       ├── productos.integration.spec.ts
│       └── ventas-gastos.integration.spec.ts
├── .env                       # Variables de entorno
├── .env.development           # Variables para desarrollo
├── .env.production            # Variables para producción
├── nest-cli.json              # Configuración de NestJS CLI
├── package.json               # Dependencias y scripts
├── tsconfig.json              # Configuración de TypeScript
└── README.md                  # Documentación básica
```

#### Estructura de un Módulo Típico

Cada módulo funcional sigue una estructura similar para mantener la consistencia en todo el proyecto:

```
modulo/
├── modulo.controller.ts    # Controlador: maneja las peticiones HTTP
├── modulo.module.ts        # Módulo: configura el módulo y sus dependencias
├── modulo.service.ts       # Servicio: implementa la lógica de negocio
├── dto/                    # Data Transfer Objects
│   ├── create-modulo.dto.ts  # DTO para creación
│   └── update-modulo.dto.ts  # DTO para actualización
└── entities/               # Entidades de base de datos
    └── modulo.entity.ts    # Definición de la entidad
```

### Estructura del Frontend (React + Electron)

El frontend está organizado siguiendo las mejores prácticas para aplicaciones React, con una estructura que facilita la separación de responsabilidades y la reutilización de componentes.

```
pos-frontend/
├── public/                 # Archivos públicos
│   ├── index.html          # Plantilla HTML
│   ├── favicon.ico         # Favicon
│   └── manifest.json       # Web App Manifest
├── src/                    # Código fuente
│   ├── index.tsx           # Punto de entrada
│   ├── App.tsx             # Componente principal
│   ├── assets/             # Recursos estáticos
│   │   ├── images/         # Imágenes
│   │   └── styles/         # Estilos globales
│   ├── components/         # Componentes reutilizables
│   │   ├── FormField.tsx   # Campo de formulario
│   │   ├── ProtectedRoute.tsx # Ruta protegida
│   │   └── ThemeToggle.tsx # Cambio de tema
│   ├── contexts/           # Contextos de React
│   │   ├── AuthContext.tsx # Contexto de autenticación
│   │   └── ThemeContext.tsx # Contexto de tema
│   ├── hooks/              # Hooks personalizados
│   │   └── useForm.ts      # Hook para formularios
│   ├── layouts/            # Layouts
│   │   ├── MainLayout.tsx  # Layout principal
│   │   └── AuthLayout.tsx  # Layout de autenticación
│   ├── pages/              # Páginas
│   │   ├── Login.tsx       # Página de login
│   │   ├── Dashboard.tsx   # Dashboard
│   │   ├── Productos.tsx   # Gestión de productos
│   │   ├── Ventas.tsx      # Gestión de ventas
│   │   ├── Gastos.tsx      # Gestión de gastos
│   │   ├── Reportes.tsx    # Reportes
│   │   ├── Administracion.tsx # Administración
│   │   ├── NotFound.tsx    # Página 404
│   │   └── Unauthorized.tsx # Acceso no autorizado
│   ├── services/           # Servicios
│   │   └── api.ts          # Cliente API
│   ├── theme/              # Configuración de tema
│   │   └── index.ts        # Tema personalizado
│   └── utils/              # Utilidades
│       └── validations.ts  # Validaciones
├── electron/               # Código de Electron
│   ├── main.js             # Proceso principal
│   └── preload.js          # Script de precarga
├── scripts/                # Scripts
│   └── release.js          # Script de release
├── .env.development        # Variables para desarrollo
├── .env.production         # Variables para producción
├── electron-builder.json   # Configuración de electron-builder
├── package.json            # Dependencias y scripts
├── tsconfig.json           # Configuración de TypeScript
└── README.md               # Documentación básica
```

### Estructura de la Base de Datos

La base de datos PostgreSQL está diseñada siguiendo principios de normalización y optimización para el rendimiento. A continuación se muestra un diagrama simplificado de las principales tablas y sus relaciones:

```
+---------------+     +---------------+     +-------------------+
| roles         |     | usuarios      |     | personas          |
+---------------+     +---------------+     +-------------------+
| id            |<----| id            |     | id                |
| nombre        |     | username      |---->| nombre            |
| descripcion   |     | password      |     | apellido          |
| permisos      |     | email         |     | tipo_persona      |
| activo        |     | rol_id        |     | tipo_id_id        |
+---------------+     | persona_id    |     | num_identificacion|
                      | activo        |     | direccion         |
                      +---------------+     | telefono          |
                                            | email             |
                                            | activo            |
                                            +-------------------+

+---------------+     +---------------+     +-------------------+
| companias     |     | tiendas       |     | productos         |
+---------------+     +---------------+     +-------------------+
| id            |<----| id            |     | id                |
| nombre        |     | nombre        |     | nombre            |
| nit           |     | direccion     |     | descripcion       |
| direccion     |     | telefono      |     | codigo            |
| telefono      |     | email         |     | precio_venta      |
| email         |     | compania_id   |     | precio_compra     |
| activo        |     | activo        |     | impuesto_id       |
+---------------+     +---------------+     | unidad_id         |
                                            | imagen            |
                                            | activo            |
                                            +-------------------+

+---------------+     +---------------+     +-------------------+
| inventario    |     | kardex        |     | ventas            |
+---------------+     +---------------+     +-------------------+
| id            |     | id            |     | id                |
| producto_id   |     | producto_id   |     | fecha             |
| tienda_id     |     | tipo_movimiento|    | cliente_id        |
| cantidad      |     | cantidad      |     | vendedor_id       |
| stock_minimo  |     | fecha         |     | tienda_id         |
| activo        |     | referencia    |     | total             |
+---------------+     | venta_id      |     | subtotal          |
                      | activo        |     | impuesto          |
                      +---------------+     | estado            |
                                            | metodo_pago_id    |
                                            +-------------------+

+---------------+     +---------------+     +-------------------+
| gastos        |     | detalle_gasto |     | detalle_venta     |
+---------------+     +---------------+     +-------------------+
| id            |<----| id            |     | id                |
| fecha         |     | gasto_id      |     | venta_id          |
| descripcion   |     | descripcion   |     | producto_id       |
| total         |     | monto         |     | cantidad          |
| tienda_id     |     | activo        |     | precio            |
| usuario_id    |     +---------------+     | subtotal          |
| activo        |                           | impuesto          |
+---------------+                           | activo            |
                                            +-------------------+
```

### Convenciones de Nomenclatura

Para mantener la consistencia en todo el proyecto, se siguen las siguientes convenciones de nomenclatura:

1. **Archivos y Directorios**:
   - Nombres en minúsculas con guiones para separar palabras (kebab-case)
   - Extensiones según el tipo de archivo (.ts, .tsx, .js, .jsx, .md)

2. **Clases**:
   - PascalCase (primera letra de cada palabra en mayúscula)
   - Sufijos según su función (Controller, Service, Entity, etc.)

3. **Interfaces y Tipos**:
   - PascalCase
   - Prefijo "I" para interfaces (opcional)

4. **Variables y Funciones**:
   - camelCase (primera letra en minúscula, resto de palabras con primera letra en mayúscula)

5. **Constantes**:
   - UPPER_SNAKE_CASE (mayúsculas con guiones bajos)

6. **Componentes React**:
   - PascalCase
   - Un componente por archivo

7. **Tablas de Base de Datos**:
   - snake_case (minúsculas con guiones bajos)
   - Nombres en plural

8. **Columnas de Base de Datos**:
   - snake_case
   - Claves primarias: "id"
   - Claves foráneas: "entidad_id"

Esta estructura de proyecto proporciona una organización clara y coherente que facilita el desarrollo, mantenimiento y escalabilidad del sistema.


## Funcionalidades del Sistema

El Sistema POS para Tienda de Accesorios Móviles ofrece un conjunto completo de funcionalidades diseñadas para cubrir todas las necesidades operativas de una tienda de accesorios móviles, desde la gestión de inventario hasta el procesamiento de ventas y la generación de reportes. A continuación, se detallan las principales funcionalidades del sistema.

### Gestión de Usuarios y Autenticación

#### Autenticación y Control de Acceso

- **Inicio de sesión seguro**: Autenticación mediante credenciales (usuario/contraseña) con encriptación de contraseñas mediante bcrypt.
- **Autenticación basada en tokens**: Implementación de JWT (JSON Web Tokens) para mantener sesiones seguras.
- **Control de acceso basado en roles**: Dos roles principales (vendedor y administrador) con diferentes niveles de acceso a funcionalidades.
- **Protección de rutas**: Middleware de autenticación para proteger rutas sensibles.
- **Gestión de sesiones**: Manejo de sesiones con expiración configurable.
- **Bloqueo de cuentas**: Bloqueo temporal de cuentas después de múltiples intentos fallidos de inicio de sesión.

#### Gestión de Usuarios

- **Registro de usuarios**: Creación de nuevos usuarios con asignación de roles.
- **Edición de perfiles**: Actualización de información personal y credenciales.
- **Gestión de roles**: Asignación y modificación de roles para usuarios.
- **Activación/desactivación de usuarios**: Control de acceso al sistema mediante estados de usuario.
- **Recuperación de contraseñas**: Mecanismo seguro para restablecer contraseñas olvidadas.
- **Historial de actividad**: Registro de acciones realizadas por cada usuario.

### Gestión de Productos e Inventario

#### Catálogo de Productos

- **Registro de productos**: Creación y mantenimiento de productos con información detallada.
- **Categorización**: Organización de productos por categorías y subcategorías.
- **Gestión de precios**: Configuración de precios de venta y compra.
- **Gestión de impuestos**: Asignación de tasas de impuestos a productos.
- **Códigos de barras**: Generación y lectura de códigos de barras.
- **Imágenes de productos**: Carga y visualización de imágenes de productos.
- **Búsqueda avanzada**: Filtros y búsqueda por múltiples criterios.

#### Control de Inventario

- **Seguimiento de stock**: Monitoreo en tiempo real de niveles de inventario.
- **Múltiples ubicaciones**: Gestión de inventario en diferentes tiendas.
- **Alertas de stock bajo**: Notificaciones automáticas cuando el inventario alcanza niveles críticos.
- **Ajustes de inventario**: Corrección manual de discrepancias en el inventario.
- **Reserva de productos**: Capacidad para reservar productos para pedidos específicos.
- **Transferencias entre tiendas**: Movimiento de productos entre diferentes ubicaciones.

#### Sistema Kardex

- **Registro de movimientos**: Documentación detallada de todas las entradas y salidas de inventario.
- **Tipos de movimientos**: Categorización de movimientos (compra, venta, ajuste, transferencia).
- **Historial completo**: Trazabilidad completa de cada producto en el inventario.
- **Valoración de inventario**: Cálculo del valor del inventario basado en diferentes métodos (FIFO, LIFO, promedio ponderado).
- **Reportes de movimientos**: Generación de informes detallados de movimientos de inventario.

### Gestión de Ventas

#### Proceso de Venta

- **Interfaz de punto de venta**: Interfaz intuitiva y rápida para procesar ventas.
- **Búsqueda rápida de productos**: Búsqueda por código, nombre o escaneo de código de barras.
- **Cálculo automático**: Cálculo de subtotales, impuestos y total.
- **Descuentos**: Aplicación de descuentos por producto o al total de la venta.
- **Múltiples métodos de pago**: Soporte para efectivo, tarjeta, transferencia y pagos mixtos.
- **Emisión de comprobantes**: Generación de facturas, boletas y tickets.
- **Ventas a crédito**: Registro de ventas con pago diferido.
- **Devoluciones**: Procesamiento de devoluciones y reembolsos.

#### Gestión de Clientes

- **Registro de clientes**: Mantenimiento de base de datos de clientes.
- **Historial de compras**: Seguimiento de compras por cliente.
- **Crédito y saldo**: Control de crédito disponible y saldo pendiente.
- **Categorización de clientes**: Clasificación de clientes por volumen de compras o frecuencia.
- **Notificaciones**: Envío de notificaciones a clientes sobre promociones o saldos pendientes.

### Gestión de Gastos

- **Registro de gastos**: Documentación de gastos operativos y administrativos.
- **Categorización**: Clasificación de gastos por tipo y concepto.
- **Comprobantes**: Adjuntar comprobantes digitales a los registros de gastos.
- **Aprobaciones**: Flujo de aprobación para gastos que superan ciertos montos.
- **Gastos recurrentes**: Configuración de gastos periódicos.
- **Presupuestos**: Comparación de gastos contra presupuestos establecidos.

### Reportes y Análisis

#### Reportes Financieros

- **Balance de ingresos y gastos**: Resumen mensual de ingresos y gastos.
- **Estado de resultados**: Reporte de ganancias y pérdidas.
- **Flujo de caja**: Seguimiento de entradas y salidas de efectivo.
- **Análisis de rentabilidad**: Cálculo de márgenes de ganancia por producto y categoría.
- **Proyecciones**: Estimaciones de ventas y gastos futuros basados en datos históricos.

#### Reportes de Ventas

- **Ventas por período**: Análisis de ventas por día, semana, mes o año.
- **Ventas por vendedor**: Desempeño de cada vendedor.
- **Ventas por producto**: Productos más y menos vendidos.
- **Ventas por categoría**: Análisis por categoría de producto.
- **Ventas por método de pago**: Distribución de ventas según forma de pago.
- **Ventas por cliente**: Análisis de compras por cliente.
- **Tendencias de ventas**: Gráficos y análisis de tendencias a lo largo del tiempo.

#### Reportes de Inventario

- **Valoración de inventario**: Valor total del inventario actual.
- **Rotación de inventario**: Análisis de la velocidad de rotación de productos.
- **Productos sin movimiento**: Identificación de productos estancados.
- **Productos más vendidos**: Ranking de productos por volumen de ventas.
- **Productos con stock bajo**: Lista de productos que requieren reposición.
- **Pérdidas y mermas**: Registro y análisis de pérdidas de inventario.

### Administración del Sistema

#### Gestión de Compañías y Tiendas

- **Registro de compañías**: Creación y configuración de compañías.
- **Gestión de tiendas**: Administración de múltiples tiendas asociadas a una compañía.
- **Configuración por tienda**: Parámetros específicos para cada tienda.
- **Permisos por tienda**: Control de acceso de usuarios a tiendas específicas.

#### Gestión de Proveedores

- **Registro de proveedores**: Mantenimiento de base de datos de proveedores.
- **Catálogo por proveedor**: Asociación de productos con proveedores.
- **Historial de compras**: Seguimiento de compras realizadas a cada proveedor.
- **Evaluación de proveedores**: Calificación basada en cumplimiento y calidad.
- **Contactos**: Gestión de información de contacto de proveedores.

#### Configuración del Sistema

- **Parámetros generales**: Configuración de parámetros operativos del sistema.
- **Personalización de interfaz**: Adaptación de la interfaz a necesidades específicas.
- **Gestión de impuestos**: Configuración de tasas y reglas de impuestos.
- **Formatos de documentos**: Personalización de facturas, boletas y reportes.
- **Copias de seguridad**: Programación y ejecución de respaldos de datos.
- **Registro de auditoría**: Seguimiento de cambios y acciones en el sistema.

### Características Técnicas Avanzadas

#### Seguridad

- **Encriptación de datos sensibles**: Protección de información confidencial.
- **Validación de datos**: Verificación de integridad y formato de datos ingresados.
- **Protección contra ataques comunes**: Implementación de medidas contra SQL injection, XSS, CSRF, etc.
- **Registro de actividad**: Log detallado de acciones realizadas en el sistema.
- **Políticas de contraseñas**: Reglas para garantizar contraseñas seguras.

#### Rendimiento y Escalabilidad

- **Optimización de consultas**: Consultas SQL eficientes y uso de índices.
- **Caché**: Implementación de estrategias de caché para mejorar el rendimiento.
- **Paginación**: Carga eficiente de grandes conjuntos de datos.
- **Arquitectura modular**: Diseño que facilita la escalabilidad horizontal y vertical.
- **Procesamiento asíncrono**: Manejo de operaciones intensivas sin bloquear la interfaz de usuario.

#### Integración y Extensibilidad

- **API RESTful**: Interfaz de programación para integración con otros sistemas.
- **Exportación de datos**: Generación de archivos en formatos estándar (CSV, Excel, PDF).
- **Importación de datos**: Capacidad para importar datos desde archivos externos.
- **Arquitectura extensible**: Diseño que permite añadir nuevas funcionalidades sin modificar el código existente.
- **Webhooks**: Notificaciones en tiempo real de eventos importantes.

Esta amplia gama de funcionalidades hace del Sistema POS una solución completa y versátil para la gestión de tiendas de accesorios móviles, adaptable a diferentes tamaños de negocio y necesidades específicas.


## Backend (NestJS)

El backend del Sistema POS está desarrollado con NestJS, un framework progresivo para Node.js que proporciona una arquitectura de aplicación elegante y robusta. Esta sección detalla la implementación del backend, sus componentes principales y patrones de diseño utilizados.

### Arquitectura del Backend

El backend sigue una arquitectura modular basada en los principios de NestJS, que a su vez se inspira en Angular. Esta arquitectura facilita la organización del código, la inyección de dependencias y la separación de responsabilidades.

#### Componentes Principales

1. **Módulos**: Unidades organizativas que encapsulan un conjunto de funcionalidades relacionadas.
2. **Controladores**: Manejan las solicitudes HTTP y delegan el procesamiento a los servicios.
3. **Servicios**: Implementan la lógica de negocio y se comunican con los repositorios.
4. **Repositorios**: Abstraen el acceso a la base de datos y proporcionan métodos para operaciones CRUD.
5. **Entidades**: Representan las tablas de la base de datos y definen la estructura de los datos.
6. **DTOs (Data Transfer Objects)**: Definen la estructura de los datos que se transfieren entre el cliente y el servidor.
7. **Guards**: Protegen las rutas según criterios específicos, como la autenticación y autorización.
8. **Interceptores**: Transforman las respuestas antes de enviarlas al cliente.
9. **Pipes**: Validan y transforman los datos de entrada.
10. **Filtros**: Manejan las excepciones de manera centralizada.

### Módulos Implementados

El backend está organizado en módulos funcionales que encapsulan características específicas del sistema:

#### Módulo de Autenticación (auth)

Este módulo maneja la autenticación de usuarios y la generación de tokens JWT.

```typescript
// auth.module.ts
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d'),
        },
      }),
      inject: [ConfigService],
    }),
    UsuariosModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
```

**Características principales**:
- Autenticación basada en JWT
- Estrategia de autenticación local para login
- Generación y validación de tokens
- Protección de rutas mediante guards

#### Módulo de Usuarios (usuarios)

Este módulo gestiona los usuarios del sistema, incluyendo su creación, actualización y eliminación.

```typescript
// usuarios.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    RolesModule,
    PersonasModule,
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
```

**Características principales**:
- CRUD completo para usuarios
- Validación de datos de entrada
- Encriptación de contraseñas
- Relaciones con roles y personas

#### Módulo de Roles (roles)

Este módulo gestiona los roles y permisos del sistema.

```typescript
// roles.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Rol]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
```

**Características principales**:
- Definición de roles (administrador, vendedor)
- Asignación de permisos a roles
- Verificación de permisos

#### Módulo de Productos (productos)

Este módulo gestiona el catálogo de productos del sistema.

```typescript
// productos.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Unidad, Impuesto]),
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}
```

**Características principales**:
- CRUD completo para productos
- Gestión de unidades de medida
- Gestión de impuestos
- Validación de datos de productos

#### Módulo de Inventario (inventario)

Este módulo gestiona el inventario de productos por tienda.

```typescript
// inventario.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Inventario]),
    ProductosModule,
    TiendasModule,
  ],
  controllers: [InventarioController],
  providers: [InventarioService],
  exports: [InventarioService],
})
export class InventarioModule {}
```

**Características principales**:
- Control de stock por producto y tienda
- Alertas de bajo stock
- Actualización automática de inventario

#### Módulo de Kardex (kardex)

Este módulo registra los movimientos de inventario (entradas, salidas, ventas).

```typescript
// kardex.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Kardex]),
    ProductosModule,
    InventarioModule,
  ],
  controllers: [KardexController],
  providers: [KardexService],
  exports: [KardexService],
})
export class KardexModule {}
```

**Características principales**:
- Registro de movimientos de inventario
- Clasificación por tipo de movimiento
- Trazabilidad de productos

#### Módulo de Ventas (ventas)

Este módulo gestiona las ventas y sus detalles.

```typescript
// ventas.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, DetalleVenta]),
    ProductosModule,
    InventarioModule,
    KardexModule,
    PersonasModule,
    MetodosPagoModule,
    TiendasModule,
  ],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [VentasService],
})
export class VentasModule {}
```

**Características principales**:
- Registro de ventas con múltiples productos
- Cálculo automático de totales e impuestos
- Integración con diferentes métodos de pago
- Actualización automática de inventario y kardex

#### Módulo de Gastos (gastos)

Este módulo gestiona los gastos del negocio.

```typescript
// gastos.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Gasto, DetalleGasto]),
    TiendasModule,
  ],
  controllers: [GastosController],
  providers: [GastosService],
  exports: [GastosService],
})
export class GastosModule {}
```

**Características principales**:
- Registro de gastos con categorización
- Asignación de gastos a tiendas
- Cálculo de totales

#### Módulo de Reportes (reportes)

Este módulo genera reportes y estadísticas del sistema.

```typescript
// reportes.module.ts
@Module({
  imports: [
    VentasModule,
    GastosModule,
    ProductosModule,
    InventarioModule,
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
```

**Características principales**:
- Reportes de ventas por período
- Reportes de gastos por período
- Balance de ingresos y gastos
- Reportes de inventario
- Exportación a PDF y CSV

### Autenticación y Autorización

El sistema implementa un robusto mecanismo de autenticación y autorización basado en JWT (JSON Web Tokens).

#### Flujo de Autenticación

1. El usuario envía sus credenciales (nombre de usuario y contraseña) al endpoint `/auth/login`.
2. El servidor valida las credenciales contra la base de datos.
3. Si las credenciales son válidas, el servidor genera un token JWT que contiene el ID del usuario, su rol y otros datos relevantes.
4. El token se envía al cliente, que lo almacena (generalmente en localStorage).
5. Para las solicitudes posteriores, el cliente incluye el token en el encabezado `Authorization` con el formato `Bearer {token}`.
6. El servidor valida el token en cada solicitud protegida y extrae la información del usuario.

```typescript
// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usuariosService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      sub: user.id, 
      username: user.username,
      rol: user.rol.nombre 
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        rol: user.rol.nombre,
      },
    };
  }
}
```

#### Autorización Basada en Roles

El sistema implementa un control de acceso basado en roles (RBAC) mediante guards personalizados:

```typescript
// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.rol === role);
  }
}
```

Este guard se utiliza junto con un decorador personalizado para proteger rutas específicas:

```typescript
// roles.decorator.ts
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

Ejemplo de uso en un controlador:

```typescript
// productos.controller.ts
@Controller('productos')
export class ProductosController {
  constructor(private productosService: ProductosService) {}

  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  @Post()
  @Roles('administrador')
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }
}
```

### Validación de Datos

El sistema utiliza class-validator y class-transformer para validar y transformar los datos de entrada:

```typescript
// create-producto.dto.ts
export class CreateProductoDto {
  @ApiProperty({ description: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ description: 'Descripción del producto' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  descripcion?: string;

  @ApiProperty({ description: 'Código del producto' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo: string;

  @ApiProperty({ description: 'Precio de venta del producto' })
  @IsNumber()
  @IsPositive()
  precio_venta: number;

  @ApiProperty({ description: 'Precio de compra del producto' })
  @IsNumber()
  @IsPositive()
  precio_compra: number;

  @ApiProperty({ description: 'ID del impuesto aplicable' })
  @IsNumber()
  @IsPositive()
  impuesto_id: number;

  @ApiProperty({ description: 'ID de la unidad de medida' })
  @IsNumber()
  @IsPositive()
  unidad_id: number;

  @ApiProperty({ description: 'URL de la imagen del producto' })
  @IsString()
  @IsOptional()
  imagen?: string;
}
```

### Manejo de Errores

El sistema implementa un manejo centralizado de errores mediante filtros de excepción:

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

### Documentación de API

El backend utiliza Swagger para documentar la API REST:

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema POS API')
    .setDescription('API para el Sistema POS de Tienda de Accesorios Móviles')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Otras configuraciones...
  
  await app.listen(3001);
}
bootstrap();
```

### Transacciones

El sistema utiliza transacciones para garantizar la integridad de los datos en operaciones críticas:

```typescript
// ventas.service.ts
@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventasRepository: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detalleVentasRepository: Repository<DetalleVenta>,
    private inventarioService: InventarioService,
    private kardexService: KardexService,
    private connection: Connection,
  ) {}

  async create(createVentaDto: CreateVentaDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Crear la venta
      const venta = this.ventasRepository.create({
        fecha: new Date(),
        cliente_id: createVentaDto.cliente_id,
        vendedor_id: createVentaDto.vendedor_id,
        tienda_id: createVentaDto.tienda_id,
        metodo_pago_id: createVentaDto.metodo_pago_id,
        subtotal: 0,
        impuesto: 0,
        total: 0,
        estado: 'completada',
      });
      
      const ventaGuardada = await queryRunner.manager.save(venta);
      
      let subtotal = 0;
      let impuestoTotal = 0;
      
      // Procesar cada detalle de venta
      for (const detalle of createVentaDto.detalles) {
        // Verificar stock
        await this.inventarioService.verificarStock(
          detalle.producto_id,
          createVentaDto.tienda_id,
          detalle.cantidad,
        );
        
        // Obtener producto con su impuesto
        const producto = await this.productosService.findOne(detalle.producto_id);
        
        // Calcular valores
        const precioUnitario = detalle.precio || producto.precio_venta;
        const subtotalDetalle = precioUnitario * detalle.cantidad;
        const impuestoDetalle = subtotalDetalle * (producto.impuesto.porcentaje / 100);
        
        // Crear detalle de venta
        const detalleVenta = this.detalleVentasRepository.create({
          venta_id: ventaGuardada.id,
          producto_id: detalle.producto_id,
          cantidad: detalle.cantidad,
          precio_unitario: precioUnitario,
          subtotal: subtotalDetalle,
          impuesto: impuestoDetalle,
        });
        
        await queryRunner.manager.save(detalleVenta);
        
        // Actualizar inventario
        await this.inventarioService.reducirStock(
          queryRunner.manager,
          detalle.producto_id,
          createVentaDto.tienda_id,
          detalle.cantidad,
        );
        
        // Registrar movimiento en kardex
        await this.kardexService.registrarMovimiento(
          queryRunner.manager,
          {
            producto_id: detalle.producto_id,
            tipo_movimiento: TipoMovimiento.VENTA,
            cantidad: detalle.cantidad,
            referencia: `Venta #${ventaGuardada.id}`,
            venta_id: ventaGuardada.id,
          },
        );
        
        subtotal += subtotalDetalle;
        impuestoTotal += impuestoDetalle;
      }
      
      // Actualizar totales de la venta
      ventaGuardada.subtotal = subtotal;
      ventaGuardada.impuesto = impuestoTotal;
      ventaGuardada.total = subtotal + impuestoTotal;
      
      await queryRunner.manager.save(ventaGuardada);
      
      await queryRunner.commitTransaction();
      
      return ventaGuardada;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Error al crear la venta: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }
}
```

### Optimización de Rendimiento

El backend implementa varias estrategias para optimizar el rendimiento:

1. **Caché**: Utiliza caché para operaciones frecuentes y costosas.

```typescript
// app.module.ts
@Module({
  imports: [
    CacheModule.register({
      ttl: 60, // segundos
      max: 100, // máximo número de items en caché
    }),
    // otros módulos...
  ],
})
export class AppModule {}
```

2. **Lazy Loading**: Carga diferida de módulos para reducir el tiempo de inicio.

3. **Consultas Optimizadas**: Uso de consultas SQL optimizadas y joins eficientes.

```typescript
// productos.service.ts
@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  async findAll(): Promise<Producto[]> {
    return this.productosRepository.createQueryBuilder('producto')
      .leftJoinAndSelect('producto.impuesto', 'impuesto')
      .leftJoinAndSelect('producto.unidad', 'unidad')
      .select([
        'producto.id',
        'producto.nombre',
        'producto.codigo',
        'producto.precio_venta',
        'producto.precio_compra',
        'producto.imagen',
        'impuesto.id',
        'impuesto.nombre',
        'impuesto.porcentaje',
        'unidad.id',
        'unidad.nombre',
        'unidad.simbolo',
      ])
      .where('producto.activo = :activo', { activo: true })
      .getMany();
  }
}
```

4. **Compresión**: Compresión de respuestas HTTP para reducir el tamaño de los datos transferidos.

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  // otras configuraciones...
  await app.listen(3001);
}
bootstrap();
```

### Seguridad

El backend implementa varias medidas de seguridad:

1. **Helmet**: Protección contra vulnerabilidades web comunes mediante el establecimiento de cabeceras HTTP seguras.

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  // otras configuraciones...
  await app.listen(3001);
}
bootstrap();
```

2. **Rate Limiting**: Limitación de tasa para prevenir ataques de fuerza bruta y DDoS.

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // límite de 100 solicitudes por ventana
    }),
  );
  // otras configuraciones...
  await app.listen(3001);
}
bootstrap();
```

3. **Validación de Entrada**: Validación estricta de todos los datos de entrada para prevenir inyecciones y otros ataques.

4. **CORS**: Configuración adecuada de CORS para controlar qué dominios pueden acceder a la API.

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // otras configuraciones...
  await app.listen(3001);
}
bootstrap();
```

5. **Encriptación de Contraseñas**: Las contraseñas se almacenan encriptadas utilizando bcrypt.

```typescript
// usuarios.service.ts
@Injectable()
export class UsuariosService {
  // ...
  
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { password, ...userData } = createUsuarioDto;
    
    // Verificar si el usuario ya existe
    const existingUser = await this.findByUsername(createUsuarioDto.username);
    if (existingUser) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }
    
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear y guardar el nuevo usuario
    const newUser = this.usuariosRepository.create({
      ...userData,
      password: hashedPassword,
    });
    
    return this.usuariosRepository.save(newUser);
  }
}
```

### Logging

El sistema implementa un sistema de logging robusto utilizando Winston:

```typescript
// logger.middleware.ts
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: Function) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
```

### Conclusión

El backend del Sistema POS proporciona una base sólida y robusta para la aplicación, implementando las mejores prácticas de desarrollo con NestJS. La arquitectura modular, la separación de responsabilidades y los patrones de diseño utilizados facilitan el mantenimiento y la extensión del sistema.


## Funcionalidades del Sistema

El Sistema POS para Tienda de Accesorios Móviles ofrece un conjunto completo de funcionalidades diseñadas para satisfacer las necesidades de gestión de una tienda de accesorios móviles. A continuación, se detallan las principales funcionalidades organizadas por módulos.

### 1. Autenticación y Control de Acceso

#### 1.1. Autenticación de Usuarios

- **Inicio de sesión**: Autenticación mediante credenciales (usuario y contraseña)
- **Generación de tokens JWT**: Para mantener la sesión del usuario
- **Renovación automática de tokens**: Para mantener la sesión activa
- **Cierre de sesión**: Invalidación de tokens

#### 1.2. Control de Acceso Basado en Roles

- **Roles predefinidos**: Administrador y Vendedor
- **Permisos granulares**: Acceso específico a funcionalidades según el rol
- **Protección de rutas**: Verificación de permisos en cada endpoint
- **Interfaz adaptativa**: Elementos de UI visibles según permisos del usuario

### 2. Gestión de Usuarios y Roles

#### 2.1. Gestión de Usuarios

- **Creación de usuarios**: Registro de nuevos usuarios con datos básicos
- **Asignación de roles**: Definición del nivel de acceso
- **Edición de usuarios**: Modificación de datos y permisos
- **Activación/desactivación**: Control del estado de los usuarios
- **Restablecimiento de contraseñas**: Mecanismo seguro para recuperación

#### 2.2. Gestión de Roles

- **Definición de roles**: Creación y configuración de roles
- **Asignación de permisos**: Configuración de accesos por rol
- **Edición de roles**: Modificación de permisos y descripción
- **Visualización de usuarios por rol**: Listado filtrado

### 3. Gestión de Productos e Inventario

#### 3.1. Catálogo de Productos

- **Registro de productos**: Creación con datos completos (nombre, descripción, códigos, precios)
- **Categorización**: Organización por categorías y subcategorías
- **Gestión de imágenes**: Carga y visualización de imágenes de productos
- **Búsqueda avanzada**: Filtros por múltiples criterios
- **Exportación de catálogo**: Generación de reportes en PDF/CSV

#### 3.2. Control de Inventario

- **Registro de stock**: Seguimiento de existencias por producto y tienda
- **Alertas de stock mínimo**: Notificaciones automáticas
- **Ajustes de inventario**: Correcciones y actualizaciones manuales
- **Visualización de estado**: Dashboard con indicadores de inventario
- **Historial de cambios**: Registro de todas las modificaciones

#### 3.3. Sistema Kardex

- **Registro de movimientos**: Entradas, salidas y ventas
- **Trazabilidad completa**: Seguimiento del origen y destino de cada movimiento
- **Cálculo automático de saldos**: Actualización en tiempo real
- **Reportes detallados**: Movimientos por producto, fecha o tipo
- **Exportación de datos**: Generación de informes en PDF/CSV

### 4. Gestión de Ventas

#### 4.1. Proceso de Venta

- **Interfaz de punto de venta**: Diseño intuitivo para operaciones rápidas
- **Búsqueda de productos**: Por código, nombre o escaneo
- **Selección de cantidades**: Ajuste de unidades a vender
- **Aplicación de descuentos**: A nivel de producto o venta total
- **Cálculo automático**: Subtotales, impuestos y total
- **Selección de cliente**: Asociación de venta a cliente registrado o genérico
- **Múltiples métodos de pago**: Efectivo, tarjeta, transferencia

#### 4.2. Gestión de Ventas Realizadas

- **Historial de ventas**: Registro completo con filtros
- **Detalles de venta**: Visualización de productos, cantidades y precios
- **Anulación de ventas**: Con registro de motivo y usuario
- **Reimpresión de comprobantes**: Generación de duplicados
- **Estadísticas de ventas**: Por período, vendedor, producto o cliente

### 5. Gestión de Gastos

#### 5.1. Registro de Gastos

- **Categorización de gastos**: Organización por tipos
- **Registro detallado**: Descripción, monto, fecha y responsable
- **Adjuntos digitales**: Posibilidad de asociar comprobantes
- **Aprobación de gastos**: Flujo configurable según monto

#### 5.2. Reportes de Gastos

- **Gastos por período**: Filtrado por rangos de fechas
- **Gastos por categoría**: Distribución por tipos
- **Gastos por tienda**: Comparativa entre sucursales
- **Exportación de reportes**: Generación en PDF/CSV

### 6. Reportes y Estadísticas

#### 6.1. Reportes Financieros

- **Balance mensual**: Ingresos vs gastos
- **Flujo de caja**: Movimientos de efectivo
- **Rentabilidad**: Análisis de márgenes por producto
- **Proyecciones**: Estimaciones basadas en históricos

#### 6.2. Reportes de Ventas

- **Ventas por período**: Diarias, semanales, mensuales, anuales
- **Ventas por producto**: Ranking de productos más vendidos
- **Ventas por vendedor**: Desempeño del equipo
- **Ventas por cliente**: Fidelización y recurrencia
- **Ventas por método de pago**: Distribución de formas de pago

#### 6.3. Reportes de Inventario

- **Stock actual**: Estado del inventario en tiempo real
- **Rotación de productos**: Velocidad de venta
- **Productos sin movimiento**: Identificación de inventario estancado
- **Valorización de inventario**: Costo total del stock

### 7. Gestión de Compañías y Tiendas

#### 7.1. Gestión de Compañías

- **Registro de compañías**: Datos fiscales y de contacto
- **Configuración de parámetros**: Ajustes específicos por compañía
- **Gestión de logos e identidad**: Personalización visual

#### 7.2. Gestión de Tiendas

- **Múltiples sucursales**: Administración centralizada
- **Configuración por tienda**: Parámetros específicos
- **Asignación de empleados**: Personal por sucursal
- **Inventarios independientes**: Control separado por tienda

### 8. Gestión de Clientes y Proveedores

#### 8.1. Gestión de Clientes

- **Registro de clientes**: Datos personales y de contacto
- **Historial de compras**: Seguimiento de transacciones
- **Segmentación**: Categorización por frecuencia o volumen
- **Búsqueda avanzada**: Filtros por múltiples criterios

#### 8.2. Gestión de Proveedores

- **Registro de proveedores**: Datos comerciales y de contacto
- **Catálogo de productos por proveedor**: Asociación producto-proveedor
- **Historial de compras**: Seguimiento de adquisiciones
- **Evaluación de proveedores**: Calificación por cumplimiento

### 9. Configuración del Sistema

#### 9.1. Parámetros Generales

- **Datos de la empresa**: Información fiscal y de contacto
- **Configuración de impuestos**: Tasas aplicables
- **Unidades de medida**: Definición de unidades para productos
- **Métodos de pago**: Configuración de formas de pago aceptadas

#### 9.2. Personalización

- **Temas visuales**: Modo claro/oscuro
- **Diseño de comprobantes**: Personalización de tickets y facturas
- **Accesos directos**: Configuración de atajos de teclado
- **Dashboard personalizable**: Widgets configurables

### 10. Seguridad y Auditoría

#### 10.1. Seguridad

- **Encriptación de datos sensibles**: Protección de información crítica
- **Validación de entradas**: Prevención de inyecciones y ataques
- **Control de sesiones**: Gestión de tiempo de inactividad
- **Políticas de contraseñas**: Requisitos de complejidad y caducidad

#### 10.2. Auditoría

- **Registro de actividades**: Log de acciones de usuarios
- **Trazabilidad de cambios**: Historial de modificaciones
- **Alertas de seguridad**: Notificación de actividades sospechosas
- **Reportes de auditoría**: Generación de informes de actividad

### 11. Integración y Exportación

#### 11.1. Integración con Sistemas Externos

- **API RESTful**: Endpoints documentados para integración
- **Webhooks**: Notificaciones en tiempo real de eventos
- **Importación masiva**: Carga de datos desde archivos CSV/Excel

#### 11.2. Exportación de Datos

- **Formatos múltiples**: PDF, CSV, Excel
- **Personalización de reportes**: Configuración de campos y filtros
- **Programación de exportaciones**: Generación automática periódica

### 12. Aplicación de Escritorio

#### 12.1. Características de la Aplicación Electron

- **Interfaz nativa**: Experiencia de usuario de aplicación de escritorio
- **Funcionamiento offline**: Operación sin conexión con sincronización posterior
- **Impresión directa**: Conexión con impresoras locales
- **Actualizaciones automáticas**: Distribución de nuevas versiones

#### 12.2. Optimización para Punto de Venta

- **Modo pantalla completa**: Maximización del área de trabajo
- **Soporte para periféricos**: Lectores de códigos, impresoras térmicas, cajones
- **Atajos de teclado**: Operación rápida sin ratón
- **Modo de venta rápida**: Interfaz simplificada para operaciones frecuentes

Esta amplia gama de funcionalidades hace del Sistema POS una solución completa para la gestión integral de tiendas de accesorios móviles, cubriendo todos los aspectos operativos del negocio desde la administración de inventario hasta la generación de reportes financieros.


## Instalación y Configuración

Esta sección proporciona instrucciones detalladas para instalar, configurar y desplegar el Sistema POS para Tienda de Accesorios Móviles en diferentes entornos.

### Requisitos Previos

#### Requisitos de Hardware

- **Servidor Backend**:
  - CPU: 2 núcleos o más
  - RAM: 4 GB mínimo (8 GB recomendado)
  - Almacenamiento: 20 GB mínimo (SSD recomendado)
  - Conexión a Internet: 10 Mbps mínimo

- **Estaciones de Trabajo (Frontend)**:
  - CPU: 2 núcleos o más
  - RAM: 4 GB mínimo
  - Almacenamiento: 10 GB mínimo
  - Pantalla: Resolución mínima de 1366x768

#### Requisitos de Software

- **Sistema Operativo**:
  - Servidor: Ubuntu 20.04 LTS o superior, Windows Server 2019 o superior
  - Estaciones de Trabajo: Windows 10/11, macOS 11 o superior, Ubuntu 20.04 o superior

- **Software Base**:
  - Node.js 16.x o superior
  - npm 8.x o superior
  - PostgreSQL 14.x o superior
  - Git (para instalación desde repositorio)

- **Navegadores Compatibles** (para versión web):
  - Google Chrome 90 o superior
  - Mozilla Firefox 88 o superior
  - Microsoft Edge 90 o superior
  - Safari 14 o superior

### Instalación del Backend

#### Instalación desde Repositorio

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/empresa/pos-system.git
   cd pos-system/backend/pos-backend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   ```
   Editar el archivo `.env` con los valores apropiados para el entorno:
   ```
   # Configuración de la base de datos
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_NAME=pos_db
   DATABASE_USER=posadmin
   DATABASE_PASSWORD=posadmin123
   
   # Configuración de JWT
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRATION=1d
   
   # Configuración del servidor
   PORT=3001
   NODE_ENV=production
   ```

4. **Configurar la base de datos**:
   ```bash
   # Crear la base de datos
   sudo -u postgres psql -c "CREATE USER posadmin WITH PASSWORD 'posadmin123';"
   sudo -u postgres psql -c "CREATE DATABASE pos_db;"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE pos_db TO posadmin;"
   
   # Importar el esquema inicial
   sudo -u postgres psql -d pos_db -f /path/to/esquema_pos.sql
   ```

5. **Compilar el proyecto**:
   ```bash
   npm run build
   ```

6. **Iniciar el servidor**:
   ```bash
   npm run start:prod
   ```

#### Instalación con Docker

1. **Crear archivo docker-compose.yml**:
   ```yaml
   version: '3.8'
   
   services:
     postgres:
       image: postgres:14
       container_name: pos-postgres
       environment:
         POSTGRES_USER: posadmin
         POSTGRES_PASSWORD: posadmin123
         POSTGRES_DB: pos_db
       volumes:
         - postgres_data:/var/lib/postgresql/data
         - ./esquema_pos.sql:/docker-entrypoint-initdb.d/esquema_pos.sql
       ports:
         - "5432:5432"
       networks:
         - pos-network
   
     backend:
       build:
         context: ./backend/pos-backend
         dockerfile: Dockerfile
       container_name: pos-backend
       environment:
         DATABASE_HOST: postgres
         DATABASE_PORT: 5432
         DATABASE_NAME: pos_db
         DATABASE_USER: posadmin
         DATABASE_PASSWORD: posadmin123
         JWT_SECRET: your_jwt_secret_key
         JWT_EXPIRATION: 1d
         PORT: 3001
         NODE_ENV: production
       ports:
         - "3001:3001"
       depends_on:
         - postgres
       networks:
         - pos-network
   
   networks:
     pos-network:
       driver: bridge
   
   volumes:
     postgres_data:
   ```

2. **Crear Dockerfile para el backend**:
   ```dockerfile
   FROM node:16-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   
   RUN npm install
   
   COPY . .
   
   RUN npm run build
   
   EXPOSE 3001
   
   CMD ["npm", "run", "start:prod"]
   ```

3. **Iniciar los contenedores**:
   ```bash
   docker-compose up -d
   ```

### Instalación del Frontend

#### Instalación de la Aplicación de Escritorio

1. **Clonar el repositorio** (si no se ha hecho ya):
   ```bash
   git clone https://github.com/empresa/pos-system.git
   cd pos-system/frontend/pos-frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   ```
   Editar el archivo `.env` con los valores apropiados:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   REACT_APP_ENV=production
   ```

4. **Compilar la aplicación para producción**:
   ```bash
   npm run electron:build
   ```

5. **Distribuir la aplicación**:
   Los archivos de instalación se generarán en la carpeta `dist` y estarán listos para ser distribuidos a los usuarios finales.

#### Instalación de la Versión Web

1. **Clonar el repositorio** (si no se ha hecho ya):
   ```bash
   git clone https://github.com/empresa/pos-system.git
   cd pos-system/frontend/pos-frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   ```
   Editar el archivo `.env` con los valores apropiados:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   REACT_APP_ENV=production
   ```

4. **Compilar la aplicación para producción**:
   ```bash
   npm run build
   ```

5. **Desplegar en un servidor web**:
   Los archivos estáticos generados en la carpeta `build` pueden ser servidos por cualquier servidor web como Nginx o Apache.

   Ejemplo de configuración para Nginx:
   ```nginx
   server {
       listen 80;
       server_name pos.example.com;
       
       root /path/to/pos-frontend/build;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Configuración del Sistema

#### Configuración de la Base de Datos

1. **Optimización de PostgreSQL**:
   Editar el archivo `postgresql.conf` para optimizar el rendimiento:
   ```
   # Memoria
   shared_buffers = 1GB                  # 25% de la RAM disponible
   work_mem = 32MB                       # Para operaciones complejas
   maintenance_work_mem = 256MB          # Para mantenimiento
   
   # Escritura en disco
   wal_buffers = 16MB                    # Buffer para logs de transacciones
   checkpoint_completion_target = 0.9    # Distribuir escrituras de checkpoint
   
   # Planificador de consultas
   random_page_cost = 1.1                # Para SSD
   effective_cache_size = 3GB            # 75% de la RAM disponible
   
   # Paralelismo
   max_worker_processes = 8              # Número de núcleos disponibles
   max_parallel_workers_per_gather = 4   # Mitad de max_worker_processes
   max_parallel_workers = 8              # Igual a max_worker_processes
   ```

2. **Índices recomendados**:
   ```sql
   -- Índices para búsquedas frecuentes
   CREATE INDEX idx_productos_nombre ON productos(nombre);
   CREATE INDEX idx_productos_codigo ON productos(codigo);
   CREATE INDEX idx_ventas_fecha ON ventas(fecha);
   CREATE INDEX idx_kardex_fecha ON kardex(fecha);
   CREATE INDEX idx_kardex_producto_id ON kardex(producto_id);
   CREATE INDEX idx_inventario_producto_tienda ON inventario(producto_id, tienda_id);
   
   -- Índices para relaciones
   CREATE INDEX idx_usuarios_rol_id ON usuarios(rol_id);
   CREATE INDEX idx_tiendas_compania_id ON tiendas(compania_id);
   CREATE INDEX idx_ventas_cliente_id ON ventas(cliente_id);
   CREATE INDEX idx_ventas_vendedor_id ON ventas(vendedor_id);
   ```

#### Configuración de Seguridad

1. **Configuración de CORS**:
   Editar el archivo `src/config/cors.config.ts` para definir los orígenes permitidos:
   ```typescript
   export const corsOptions = {
     origin: [
       'http://localhost:3000',
       'https://pos.example.com'
     ],
     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
     allowedHeaders: ['Content-Type', 'Authorization'],
     credentials: true,
     maxAge: 86400
   };
   ```

2. **Configuración de JWT**:
   Editar el archivo `src/config/jwt.config.ts` para ajustar la configuración de tokens:
   ```typescript
   export const jwtConfig = {
     secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
     expiresIn: process.env.JWT_EXPIRATION || '1d',
     refreshExpiresIn: '7d',
     issuer: 'pos-system',
     audience: 'pos-users'
   };
   ```

3. **Configuración de Helmet**:
   Editar el archivo `src/main.ts` para ajustar las cabeceras de seguridad:
   ```typescript
   app.use(helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'self'"],
         scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
         styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
         imgSrc: ["'self'", 'data:', 'https://storage.example.com'],
         connectSrc: ["'self'", 'https://api.example.com'],
         fontSrc: ["'self'", 'https://fonts.gstatic.com'],
         objectSrc: ["'none'"],
         mediaSrc: ["'self'"],
         frameSrc: ["'none'"],
       },
     },
     xssFilter: true,
     noSniff: true,
     referrerPolicy: { policy: 'same-origin' }
   }));
   ```

#### Configuración para Producción

1. **Configuración de PM2** (para gestión de procesos Node.js):
   Crear archivo `ecosystem.config.js`:
   ```javascript
   module.exports = {
     apps: [{
       name: 'pos-backend',
       script: 'dist/main.js',
       instances: 'max',
       exec_mode: 'cluster',
       autorestart: true,
       watch: false,
       max_memory_restart: '1G',
       env: {
         NODE_ENV: 'production',
         PORT: 3001
       }
     }]
   };
   ```

2. **Iniciar con PM2**:
   ```bash
   pm2 start ecosystem.config.js
   ```

3. **Configurar inicio automático**:
   ```bash
   pm2 startup
   pm2 save
   ```

### Actualización del Sistema

#### Actualización del Backend

1. **Respaldo de datos**:
   ```bash
   pg_dump -U posadmin -d pos_db > backup_$(date +%Y%m%d).sql
   ```

2. **Actualizar código**:
   ```bash
   cd /path/to/pos-system
   git pull origin main
   cd backend/pos-backend
   npm install
   npm run build
   ```

3. **Reiniciar servicios**:
   ```bash
   pm2 restart pos-backend
   ```

#### Actualización del Frontend

1. **Actualizar código**:
   ```bash
   cd /path/to/pos-system
   git pull origin main
   cd frontend/pos-frontend
   npm install
   ```

2. **Compilar nueva versión**:
   ```bash
   # Para aplicación web
   npm run build
   
   # Para aplicación de escritorio
   npm run electron:build
   ```

3. **Distribuir nueva versión**:
   - Para la versión web, actualizar los archivos en el servidor web.
   - Para la aplicación de escritorio, distribuir los nuevos instaladores a los usuarios.

### Solución de Problemas Comunes

#### Problemas de Conexión a la Base de Datos

1. **Verificar estado del servicio PostgreSQL**:
   ```bash
   sudo systemctl status postgresql
   ```

2. **Verificar configuración de conexión**:
   ```bash
   cat /etc/postgresql/14/main/pg_hba.conf
   ```

3. **Verificar logs de PostgreSQL**:
   ```bash
   sudo tail -n 100 /var/log/postgresql/postgresql-14-main.log
   ```

#### Problemas de Autenticación

1. **Verificar configuración de JWT**:
   ```bash
   cat /path/to/pos-system/backend/pos-backend/.env | grep JWT
   ```

2. **Regenerar secreto JWT**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Actualizar el valor en el archivo `.env`.

#### Problemas de Rendimiento

1. **Verificar uso de recursos**:
   ```bash
   top
   htop
   ```

2. **Verificar logs de la aplicación**:
   ```bash
   pm2 logs pos-backend
   ```

3. **Analizar consultas lentas en PostgreSQL**:
   ```bash
   sudo -u postgres psql -d pos_db -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"
   ```

Esta guía de instalación y configuración proporciona los pasos necesarios para desplegar el Sistema POS en diferentes entornos, desde desarrollo hasta producción, y ofrece soluciones para los problemas más comunes que pueden surgir durante la operación del sistema.


## Frontend (ReactJS + Electron)

El frontend del Sistema POS está desarrollado con ReactJS y Electron, proporcionando una interfaz de usuario moderna, responsiva y fácil de usar. Esta sección detalla la implementación del frontend, sus componentes principales y patrones de diseño utilizados.

### Arquitectura del Frontend

El frontend sigue una arquitectura basada en componentes, utilizando React como biblioteca principal para la construcción de la interfaz de usuario. La aplicación se integra con Electron para proporcionar una experiencia de escritorio nativa.

#### Componentes Principales

1. **Componentes**: Unidades reutilizables que encapsulan la interfaz de usuario y su comportamiento.
2. **Páginas**: Componentes de nivel superior que representan las diferentes vistas de la aplicación.
3. **Layouts**: Componentes que definen la estructura general de las páginas.
4. **Contextos**: Proporcionan estado global a la aplicación y facilitan la comunicación entre componentes.
5. **Hooks**: Encapsulan la lógica reutilizable y el estado.
6. **Servicios**: Manejan la comunicación con el backend y otras operaciones asíncronas.
7. **Utilidades**: Funciones auxiliares para tareas comunes.

### Estructura de Componentes

El frontend está organizado en componentes reutilizables que siguen el principio de responsabilidad única:

#### Componentes de Interfaz de Usuario

```jsx
// src/components/FormField.tsx
import React from 'react';
import { TextField, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';

interface FormFieldProps {
  id: string;
  label: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => void;
  error?: string;
  type?: string;
  required?: boolean;
  options?: { value: string | number; label: string }[];
  fullWidth?: boolean;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  required = false,
  options,
  fullWidth = true,
  disabled = false,
}) => {
  if (type === 'select' && options) {
    return (
      <FormControl fullWidth={fullWidth} error={!!error} required={required} disabled={disabled}>
        <InputLabel id={`${id}-label`}>{label}</InputLabel>
        <Select
          labelId={`${id}-label`}
          id={id}
          value={value}
          label={label}
          onChange={onChange}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    );
  }

  return (
    <TextField
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error}
      type={type}
      required={required}
      fullWidth={fullWidth}
      disabled={disabled}
      variant="outlined"
      margin="normal"
    />
  );
};

export default FormField;
```

#### Componentes de Layout

```jsx
// src/layouts/MainLayout.tsx
import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
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
  CssBaseline,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Receipt as ReceiptIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

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
})<{
  open?: boolean;
}>(({ theme, open }) => ({
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
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Ventas', icon: <ShoppingCartIcon />, path: '/ventas' },
    { text: 'Productos', icon: <InventoryIcon />, path: '/productos' },
    { text: 'Gastos', icon: <ReceiptIcon />, path: '/gastos' },
    { text: 'Reportes', icon: <BarChartIcon />, path: '/reportes' },
  ];

  // Solo mostrar administración si el usuario es administrador
  if (user?.rol === 'administrador') {
    menuItems.push({ text: 'Administración', icon: <SettingsIcon />, path: '/administracion' });
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
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
          <ThemeToggle />
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
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
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
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem button onClick={logout}>
            <ListItemIcon>
              <ExitToAppIcon />
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

### Gestión de Estado

El frontend utiliza varios mecanismos para la gestión de estado:

#### Contexto de Autenticación

```jsx
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  id: number;
  username: string;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si hay un token almacenado
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      api.setAuthToken(storedToken);
    }

    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/auth/login', { username, password });
      const { access_token, user } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      setToken(access_token);
      setUser(user);
      api.setAuthToken(access_token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    api.setAuthToken(null);
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

#### Contexto de Tema

```jsx
// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext debe ser usado dentro de un ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>('light');

  useEffect(() => {
    const storedMode = localStorage.getItem('themeMode') as PaletteMode | null;
    if (storedMode) {
      setMode(storedMode);
    }
  }, []);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
          },
          h2: {
            fontSize: '2rem',
            fontWeight: 500,
          },
          h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
          },
          h4: {
            fontSize: '1.5rem',
            fontWeight: 500,
          },
          h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
          },
          h6: {
            fontSize: '1rem',
            fontWeight: 500,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
              },
            },
          },
        },
      }),
    [mode],
  );

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
```

### Comunicación con el Backend

El frontend utiliza Axios para la comunicación con el backend:

```typescript
// src/services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class Api {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Manejar errores de autenticación
        if (error.response && error.response.status === 401) {
          // Limpiar token y redirigir a login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Configurar token de autenticación
  setAuthToken(token: string | null): void {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  // Métodos HTTP
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.put<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.delete<T>(url, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.patch<T>(url, data, config);
  }
}

const api = new Api();
export default api;
```

### Rutas y Navegación

El frontend utiliza React Router para la gestión de rutas:

```jsx
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Ventas from './pages/Ventas';
import Gastos from './pages/Gastos';
import Reportes from './pages/Reportes';
import Administracion from './pages/Administracion';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        
        {/* Rutas protegidas */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout><Dashboard /></MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/productos" element={
          <ProtectedRoute>
            <MainLayout><Productos /></MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/ventas" element={
          <ProtectedRoute>
            <MainLayout><Ventas /></MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/gastos" element={
          <ProtectedRoute>
            <MainLayout><Gastos /></MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/reportes" element={
          <ProtectedRoute>
            <MainLayout><Reportes /></MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/administracion" element={
          <ProtectedRoute requiredRole="administrador">
            <MainLayout><Administracion /></MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Rutas de error */}
        <Route path="/unauthorized" element={<AuthLayout><Unauthorized /></AuthLayout>} />
        <Route path="/404" element={<AuthLayout><NotFound /></AuthLayout>} />
        
        {/* Redirecciones */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
```

### Componente de Ruta Protegida

```jsx
// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.rol !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

### Formularios y Validación

El frontend utiliza un hook personalizado para la gestión de formularios:

```typescript
// src/hooks/useForm.ts
import { useState, useCallback } from 'react';

interface ValidationRules {
  [key: string]: (value: any) => string | undefined;
}

interface FormState {
  [key: string]: any;
}

interface FormErrors {
  [key: string]: string;
}

const useForm = <T extends FormState>(initialState: T, validationRules?: ValidationRules) => {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
      const { name, value } = e.target;
      if (!name) return;

      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));

      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }));

      if (validationRules && validationRules[name]) {
        const error = validationRules[name](value);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error || '',
        }));
      }
    },
    [validationRules]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name } = e.target;
      if (!name) return;

      setTouched((prevTouched) => ({
        ...prevTouched,
        [name]: true,
      }));

      if (validationRules && validationRules[name]) {
        const error = validationRules[name](values[name]);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error || '',
        }));
      }
    },
    [validationRules, values]
  );

  const validateForm = useCallback(() => {
    if (!validationRules) return true;

    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((key) => {
      const error = validationRules[key](values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationRules, values]);

  const resetForm = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    if (validationRules && validationRules[name]) {
      const error = validationRules[name](value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error || '',
      }));
    }
  }, [validationRules]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFieldValue,
  };
};

export default useForm;
```

### Integración con Electron

El frontend se integra con Electron para proporcionar una experiencia de escritorio nativa:

```javascript
// electron/main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const Store = require('electron-store');

// Configuración de almacenamiento persistente
const store = new Store();

// Mantener una referencia global del objeto window para evitar que la ventana se cierre automáticamente
// cuando el objeto JavaScript es recogido por el recolector de basura.
let mainWindow;

function createWindow() {
  // Crear la ventana del navegador.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  });

  // Cargar la aplicación React.
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  // Abrir las herramientas de desarrollo en modo desarrollo.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Emitido cuando la ventana es cerrada.
  mainWindow.on('closed', () => {
    // Eliminar la referencia al objeto window, normalmente guardarías las ventanas
    // en un array si tu aplicación soporta múltiples ventanas, este es el momento
    // en que deberías eliminar el elemento correspondiente.
    mainWindow = null;
  });
}

// Este método será llamado cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador.
// Algunas APIs pueden usarse sólo después de que este evento ocurra.
app.whenReady().then(createWindow);

// Salir cuando todas las ventanas estén cerradas, excepto en macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // En macOS es común volver a crear una ventana en la aplicación cuando el
  // icono del dock es clicado y no hay otras ventanas abiertas.
  if (mainWindow === null) {
    createWindow();
  }
});

// Configuración de IPC (comunicación entre procesos)
ipcMain.handle('get-store-value', (event, key) => {
  return store.get(key);
});

ipcMain.handle('set-store-value', (event, key, value) => {
  store.set(key, value);
  return true;
});

ipcMain.handle('print-pdf', async (event, pdfPath) => {
  const pdfWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
  });

  await pdfWindow.loadURL(`file://${pdfPath}`);
  const data = await pdfWindow.webContents.printToPDF({});
  pdfWindow.close();

  return data;
});
```

```javascript
// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs protegidas a la ventana del navegador.
contextBridge.exposeInMainWorld('electron', {
  store: {
    get: (key) => ipcRenderer.invoke('get-store-value', key),
    set: (key, value) => ipcRenderer.invoke('set-store-value', key, value),
  },
  printer: {
    printPDF: (pdfPath) => ipcRenderer.invoke('print-pdf', pdfPath),
  },
  appInfo: {
    getVersion: () => process.env.npm_package_version,
  },
});
```

### Empaquetado y Distribución

El frontend utiliza electron-builder para empaquetar la aplicación para diferentes plataformas:

```json
// electron-builder.json
{
  "appId": "com.posystem.app",
  "productName": "Sistema POS",
  "copyright": "Copyright © 2025",
  "directories": {
    "output": "dist",
    "buildResources": "assets"
  },
  "files": [
    "build/**/*",
    "electron/**/*",
    "assets/**/*"
  ],
  "win": {
    "target": [
      "nsis"
    ],
    "icon": "assets/icon.png"
  },
  "mac": {
    "target": [
      "dmg"
    ],
    "icon": "assets/icon.png"
  },
  "linux": {
    "target": [
      "AppImage",
      "deb"
    ],
    "icon": "assets/icon.png",
    "category": "Office"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true
  }
}
```

### Optimización de Rendimiento

El frontend implementa varias estrategias para optimizar el rendimiento:

1. **Memoización**: Uso de React.memo, useMemo y useCallback para evitar renderizados innecesarios.

```jsx
// Ejemplo de uso de React.memo
const ProductItem = React.memo(({ product, onSelect }) => {
  return (
    <ListItem button onClick={() => onSelect(product)}>
      <ListItemText primary={product.nombre} secondary={`$${product.precio_venta}`} />
    </ListItem>
  );
});
```

2. **Lazy Loading**: Carga diferida de componentes para reducir el tamaño del bundle inicial.

```jsx
// src/App.tsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loading de componentes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Productos = lazy(() => import('./pages/Productos'));
const Ventas = lazy(() => import('./pages/Ventas'));
const Gastos = lazy(() => import('./pages/Gastos'));
const Reportes = lazy(() => import('./pages/Reportes'));
const Administracion = lazy(() => import('./pages/Administracion'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          {/* Rutas... */}
        </Routes>
      </Suspense>
    </Router>
  );
};
```

3. **Virtualización**: Uso de react-window para renderizar listas largas de manera eficiente.

```jsx
// Ejemplo de uso de react-window
import { FixedSizeList as List } from 'react-window';

const ProductList = ({ products, onSelectProduct }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ProductItem product={products[index]} onSelect={onSelectProduct} />
    </div>
  );

  return (
    <List
      height={400}
      width="100%"
      itemCount={products.length}
      itemSize={72}
    >
      {Row}
    </List>
  );
};
```

4. **Code Splitting**: División del código en chunks más pequeños para mejorar los tiempos de carga.

```jsx
// webpack.config.js (configuración en react-scripts)
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
    },
  },
};
```

### Seguridad

El frontend implementa varias medidas de seguridad:

1. **Sanitización de Datos**: Limpieza de datos de entrada para prevenir ataques XSS.

```jsx
// Ejemplo de sanitización de datos
import DOMPurify from 'dompurify';

const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input);
};
```

2. **Protección de Rutas**: Control de acceso basado en autenticación y roles.

3. **Almacenamiento Seguro**: Uso de electron-store para almacenar datos sensibles de manera segura.

4. **Validación de Datos**: Validación estricta de todos los datos de entrada.

```typescript
// src/utils/validations.ts
export const required = (value: any): string | undefined => {
  return value ? undefined : 'Este campo es obligatorio';
};

export const email = (value: string): string | undefined => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? undefined
    : 'Dirección de correo electrónico inválida';
};

export const minLength = (min: number) => (value: string): string | undefined => {
  return value && value.length >= min
    ? undefined
    : `Este campo debe tener al menos ${min} caracteres`;
};

export const maxLength = (max: number) => (value: string): string | undefined => {
  return value && value.length <= max
    ? undefined
    : `Este campo debe tener como máximo ${max} caracteres`;
};

export const numeric = (value: string): string | undefined => {
  return /^\d+$/.test(value) ? undefined : 'Este campo debe contener solo números';
};

export const decimal = (value: string): string | undefined => {
  return /^\d+(\.\d{1,2})?$/.test(value)
    ? undefined
    : 'Este campo debe ser un número decimal válido';
};

export const composeValidators = (...validators: Array<(value: any) => string | undefined>) => (
  value: any
): string | undefined => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) {
      return error;
    }
  }
  return undefined;
};
```

### Conclusión

El frontend del Sistema POS proporciona una interfaz de usuario moderna, responsiva y fácil de usar, implementando las mejores prácticas de desarrollo con ReactJS y Electron. La arquitectura basada en componentes, la separación de responsabilidades y los patrones de diseño utilizados facilitan el mantenimiento y la extensión del sistema.


## Frontend (ReactJS + Electron)

El frontend del Sistema POS está desarrollado con ReactJS y Electron, proporcionando una interfaz de usuario moderna, responsiva y adaptada para aplicaciones de escritorio. Esta sección detalla la implementación del frontend, sus componentes principales y patrones de diseño utilizados.

### Arquitectura del Frontend

El frontend sigue una arquitectura basada en componentes, utilizando los patrones y prácticas recomendadas de React. La aplicación está estructurada para maximizar la reutilización de código, mantener un estado global coherente y proporcionar una experiencia de usuario fluida.

#### Componentes Principales

1. **Componentes**: Unidades visuales reutilizables que encapsulan la interfaz de usuario y la lógica de presentación.
2. **Páginas**: Componentes de nivel superior que representan rutas completas en la aplicación.
3. **Layouts**: Estructuras de diseño que definen la disposición de los elementos en la pantalla.
4. **Contextos**: Gestores de estado global que proporcionan datos y funcionalidades a través del árbol de componentes.
5. **Hooks**: Funciones personalizadas que encapsulan lógica reutilizable.
6. **Servicios**: Módulos que manejan la comunicación con el backend y otras operaciones asíncronas.
7. **Utilidades**: Funciones auxiliares para tareas comunes.

### Integración con Electron

La integración con Electron permite que la aplicación React funcione como una aplicación de escritorio nativa, con acceso a funcionalidades del sistema operativo y una experiencia de usuario mejorada.

#### Configuración de Electron

El archivo principal de Electron (`main.js`) configura la ventana de la aplicación y establece la comunicación entre los procesos principal y de renderizado:

```javascript
// electron/main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const Store = require('electron-store');

// Configuración del almacenamiento persistente
const store = new Store();

// Mantener una referencia global del objeto window
let mainWindow;

function createWindow() {
  // Crear la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/icon.png')
  });

  // Cargar la URL de la aplicación
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  // Abrir DevTools en modo desarrollo
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Maximizar la ventana al inicio
  mainWindow.maximize();

  // Evento cuando la ventana es cerrada
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Crear ventana cuando Electron haya terminado de inicializarse
app.whenReady().then(createWindow);

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Comunicación IPC para operaciones del sistema
ipcMain.handle('get-store-value', (event, key) => {
  return store.get(key);
});

ipcMain.handle('set-store-value', (event, key, value) => {
  store.set(key, value);
  return true;
});

// Comunicación IPC para impresión
ipcMain.handle('print-content', async (event, options) => {
  const result = await mainWindow.webContents.print(options);
  return result;
});

// Comunicación IPC para acceso al sistema de archivos
ipcMain.handle('save-file', async (event, content, defaultPath) => {
  const { dialog } = require('electron');
  const fs = require('fs').promises;
  
  const { filePath } = await dialog.showSaveDialog({
    defaultPath
  });
  
  if (filePath) {
    await fs.writeFile(filePath, content);
    return filePath;
  }
  
  return null;
});
```

El archivo de precarga (`preload.js`) expone las funciones IPC al proceso de renderizado de manera segura:

```javascript
// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Exponer API segura a través del puente de contexto
contextBridge.exposeInMainWorld('electron', {
  store: {
    get: (key) => ipcRenderer.invoke('get-store-value', key),
    set: (key, value) => ipcRenderer.invoke('set-store-value', key, value),
  },
  print: (options) => ipcRenderer.invoke('print-content', options),
  saveFile: (content, defaultPath) => ipcRenderer.invoke('save-file', content, defaultPath),
  appVersion: process.env.npm_package_version,
});
```

### Gestión de Estado

El frontend utiliza varios mecanismos para la gestión de estado, adaptados a diferentes necesidades:

#### Contexto de Autenticación

El contexto de autenticación gestiona el estado de autenticación del usuario y proporciona funciones para iniciar y cerrar sesión:

```jsx
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  id: number;
  username: string;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar usuario y token desde localStorage al iniciar
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      api.setAuthToken(storedToken);
    }
    
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { username, password });
      const { access_token, user: userData } = response.data;
      
      // Guardar en estado y localStorage
      setUser(userData);
      setToken(access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', access_token);
      api.setAuthToken(access_token);
    } catch (error) {
      console.error('Error de autenticación:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Limpiar estado y localStorage
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    api.removeAuthToken();
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.rol === 'administrador';

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
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

El contexto de tema gestiona la apariencia visual de la aplicación, permitiendo cambiar entre modo claro y oscuro:

```jsx
// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createTheme } from '../theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Obtener preferencia guardada o usar preferencia del sistema
  const getInitialMode = (): ThemeMode => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    if (savedMode) return savedMode;
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };

  const [mode, setMode] = useState<ThemeMode>(getInitialMode);
  
  // Crear tema basado en el modo
  const theme = React.useMemo(() => createTheme(mode), [mode]);

  // Guardar preferencia cuando cambia
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    // También guardar en electron store si está disponible
    if (window.electron?.store) {
      window.electron.store.set('themeMode', mode);
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const value = {
    mode,
    toggleTheme,
    setMode,
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

### Comunicación con el Backend

El frontend se comunica con el backend a través de un servicio API centralizado que utiliza Axios:

```typescript
// src/services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Manejar errores de autenticación
        if (error.response && error.response.status === 401) {
          // Limpiar token y redirigir a login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Cargar token si existe
    const token = localStorage.getItem('token');
    if (token) {
      this.setAuthToken(token);
    }
  }

  // Configurar token de autenticación
  setAuthToken(token: string): void {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Eliminar token de autenticación
  removeAuthToken(): void {
    delete this.api.defaults.headers.common['Authorization'];
  }

  // Métodos para realizar peticiones HTTP
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.patch(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config);
    return response.data;
  }
}

const api = new ApiService();
export default api;
```

### Rutas y Navegación

La navegación en la aplicación se gestiona mediante React Router, con protección de rutas basada en autenticación y roles:

```jsx
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Ventas from './pages/Ventas';
import Gastos from './pages/Gastos';
import Reportes from './pages/Reportes';
import Administracion from './pages/Administracion';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Componente de ruta protegida
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.rol !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            } />
            
            {/* Rutas protegidas */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/productos" element={
              <ProtectedRoute>
                <MainLayout>
                  <Productos />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/ventas" element={
              <ProtectedRoute>
                <MainLayout>
                  <Ventas />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/gastos" element={
              <ProtectedRoute>
                <MainLayout>
                  <Gastos />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/reportes" element={
              <ProtectedRoute>
                <MainLayout>
                  <Reportes />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Rutas solo para administradores */}
            <Route path="/administracion" element={
              <ProtectedRoute requiredRole="administrador">
                <MainLayout>
                  <Administracion />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Rutas de error */}
            <Route path="/unauthorized" element={
              <AuthLayout>
                <Unauthorized />
              </AuthLayout>
            } />
            
            <Route path="*" element={
              <AuthLayout>
                <NotFound />
              </AuthLayout>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
```

### Componentes Principales

#### Layout Principal

El layout principal define la estructura general de la aplicación para usuarios autenticados:

```jsx
// src/layouts/MainLayout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Menu,
  MenuItem,
  Avatar,
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
  AccountCircle,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

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

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Productos', icon: <InventoryIcon />, path: '/productos' },
    { text: 'Ventas', icon: <ShoppingCartIcon />, path: '/ventas' },
    { text: 'Gastos', icon: <ReceiptIcon />, path: '/gastos' },
    { text: 'Reportes', icon: <BarChartIcon />, path: '/reportes' },
  ];

  // Añadir opción de administración solo para administradores
  if (isAdmin) {
    menuItems.push({
      text: 'Administración',
      icon: <SettingsIcon />,
      path: '/administracion',
    });
  }

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
          <ThemeToggle />
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>
                <Typography variant="body2">
                  {user?.username} ({user?.rol})
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cerrar sesión</ListItemText>
              </MenuItem>
            </Menu>
          </div>
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
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
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
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
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

#### Formulario de Login

El componente de login maneja la autenticación de usuarios:

```jsx
// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
  Alert,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Por favor ingrese usuario y contraseña');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(/images/login-bg.jpg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Iniciar Sesión
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error}
            </Alert>
          )}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nombre de Usuario"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
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
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
            <Typography variant="body2" color="text.secondary" align="center">
              Sistema POS para Tienda de Accesorios Móviles
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
```

### Tema y Estilos

La aplicación utiliza Material-UI con un tema personalizado que soporta modo claro y oscuro:

```typescript
// src/theme/index.ts
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Crear tema personalizado
export const createAppTheme = (mode: 'light' | 'dark') => {
  let theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
      },
      ...(mode === 'light'
        ? {
            // Paleta para modo claro
            background: {
              default: '#f5f5f5',
              paper: '#ffffff',
            },
            text: {
              primary: 'rgba(0, 0, 0, 0.87)',
              secondary: 'rgba(0, 0, 0, 0.6)',
            },
          }
        : {
            // Paleta para modo oscuro
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
            text: {
              primary: '#ffffff',
              secondary: 'rgba(255, 255, 255, 0.7)',
            },
          }),
    },
    typography: {
      fontFamily: [
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: '2.5rem',
        fontWeight: 500,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 500,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 500,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 500,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 500,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: mode === 'light' 
              ? '0px 2px 4px rgba(0, 0, 0, 0.1)' 
              : '0px 2px 4px rgba(0, 0, 0, 0.3)',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 'bold',
          },
        },
      },
    },
  });

  // Hacer las fuentes responsivas
  theme = responsiveFontSizes(theme);

  return theme;
};

export default createAppTheme;
```

### Validación de Formularios

La aplicación utiliza React Hook Form para la validación de formularios:

```typescript
// src/hooks/useForm.ts
import { useState, useCallback } from 'react';

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validate?: (value: any) => boolean | string;
}

interface FieldErrors {
  [key: string]: string;
}

export const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      setTouched((prev) => ({ ...prev, [name]: true }));
    },
    []
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const validate = useCallback(
    (validationRules: Record<keyof T, ValidationRules>) => {
      const newErrors: FieldErrors = {};
      let isValid = true;

      Object.keys(validationRules).forEach((key) => {
        const value = values[key];
        const rules = validationRules[key as keyof T];

        if (rules.required && !value) {
          newErrors[key] = 'Este campo es obligatorio';
          isValid = false;
        } else if (rules.minLength && value.length < rules.minLength) {
          newErrors[key] = `Debe tener al menos ${rules.minLength} caracteres`;
          isValid = false;
        } else if (rules.maxLength && value.length > rules.maxLength) {
          newErrors[key] = `Debe tener como máximo ${rules.maxLength} caracteres`;
          isValid = false;
        } else if (rules.pattern && !rules.pattern.test(value)) {
          newErrors[key] = 'Formato inválido';
          isValid = false;
        } else if (rules.validate) {
          const result = rules.validate(value);
          if (typeof result === 'string') {
            newErrors[key] = result;
            isValid = false;
          } else if (!result) {
            newErrors[key] = 'Valor inválido';
            isValid = false;
          }
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    [values]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    resetForm,
    setValues,
  };
};
```

### Componentes Reutilizables

La aplicación incluye varios componentes reutilizables para mejorar la consistencia y reducir la duplicación de código:

```jsx
// src/components/FormField.tsx
import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  TextFieldProps,
  SelectProps,
} from '@mui/material';

interface FormFieldProps extends Omit<TextFieldProps, 'select' | 'SelectProps'> {
  name: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  touched?: boolean;
  select?: boolean;
  options?: Array<{ value: string | number; label: string }>;
  selectProps?: Omit<SelectProps, 'value' | 'onChange' | 'error'>;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  select,
  options,
  selectProps,
  ...rest
}) => {
  const showError = touched && !!error;

  if (select) {
    return (
      <FormControl
        fullWidth
        error={showError}
        margin="normal"
        {...rest}
      >
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Select
          labelId={`${name}-label`}
          id={name}
          name={name}
          value={value}
          label={label}
          onChange={onChange}
          onBlur={onBlur}
          {...selectProps}
        >
          {options?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {showError && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    );
  }

  return (
    <TextField
      fullWidth
      id={name}
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={showError}
      helperText={showError ? error : ''}
      margin="normal"
      {...rest}
    />
  );
};

export default FormField;
```

### Empaquetado y Distribución

La aplicación utiliza electron-builder para empaquetar y distribuir la aplicación:

```json
// electron-builder.json
{
  "appId": "com.posystem.app",
  "productName": "Sistema POS",
  "copyright": "Copyright © 2025",
  "directories": {
    "output": "dist",
    "buildResources": "assets"
  },
  "files": [
    "build/**/*",
    "electron/**/*",
    "assets/**/*"
  ],
  "mac": {
    "category": "public.app-category.business",
    "target": ["dmg", "zip"],
    "icon": "assets/icon.png"
  },
  "win": {
    "target": ["nsis"],
    "icon": "assets/icon.png"
  },
  "linux": {
    "target": ["AppImage", "deb"],
    "category": "Office",
    "icon": "assets/icon.png"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true
  },
  "publish": {
    "provider": "github",
    "releaseType": "release"
  }
}
```

### Optimización de Rendimiento

El frontend implementa varias estrategias para optimizar el rendimiento:

1. **Memoización**: Uso de React.memo, useMemo y useCallback para evitar renderizados innecesarios.

```jsx
// Ejemplo de uso de useMemo y useCallback
const MemoizedComponent = React.memo(({ data, onAction }) => {
  // Componente que solo se renderiza cuando data u onAction cambian
  return (
    <div>
      {data.map(item => (
        <div key={item.id} onClick={() => onAction(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});

const ParentComponent = () => {
  const [items, setItems] = useState([]);
  
  // Memoizar datos procesados
  const processedData = useMemo(() => {
    return items.map(item => ({
      ...item,
      fullName: `${item.firstName} ${item.lastName}`
    }));
  }, [items]);
  
  // Memoizar función de callback
  const handleAction = useCallback((id) => {
    console.log(`Action on item ${id}`);
  }, []);
  
  return <MemoizedComponent data={processedData} onAction={handleAction} />;
};
```

2. **Code Splitting**: División del código en chunks más pequeños que se cargan bajo demanda.

```jsx
// src/App.tsx con lazy loading
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';

// Importaciones lazy para cargar componentes bajo demanda
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Productos = lazy(() => import('./pages/Productos'));
const Ventas = lazy(() => import('./pages/Ventas'));
// ... más importaciones lazy

const App = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/ventas" element={<Ventas />} />
          {/* ... más rutas */}
        </Routes>
      </Suspense>
    </Router>
  );
};
```

3. **Virtualización**: Renderizado eficiente de listas largas.

```jsx
// Ejemplo de virtualización con react-window
import { FixedSizeList } from 'react-window';

const VirtualizedList = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      Item {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={400}
      width="100%"
      itemCount={items.length}
      itemSize={50}
    >
      {Row}
    </FixedSizeList>
  );
};
```

### Seguridad

El frontend implementa varias medidas de seguridad:

1. **Sanitización de Entradas**: Validación y limpieza de datos de entrada para prevenir ataques XSS.

2. **Protección de Rutas**: Control de acceso basado en autenticación y roles.

3. **Almacenamiento Seguro**: Uso de localStorage para tokens con tiempo de expiración.

4. **Manejo de Errores**: Captura y manejo adecuado de errores para evitar fugas de información.

5. **Comunicación Segura**: Uso de HTTPS para todas las comunicaciones con el backend.

### Conclusión

El frontend del Sistema POS proporciona una interfaz de usuario moderna, intuitiva y responsiva, implementando las mejores prácticas de desarrollo con ReactJS y Electron. La arquitectura basada en componentes, la gestión de estado centralizada y los patrones de diseño utilizados facilitan el mantenimiento y la extensión del sistema, mientras que la integración con Electron permite una experiencia de usuario nativa en aplicaciones de escritorio.



## Sistema de Notificaciones y Alertas

El Sistema POS incluye un completo sistema de notificaciones y alertas que permite mantener informados a los usuarios sobre eventos importantes del sistema, como alertas de bajo stock, ventas realizadas, gastos registrados y otros eventos relevantes. Este sistema mejora la experiencia del usuario y facilita la toma de decisiones rápidas.

### Arquitectura del Sistema de Notificaciones

El sistema de notificaciones sigue una arquitectura basada en contextos de React y servicios especializados, con integración tanto en el backend como en el frontend.

#### Componentes Principales

1. **Backend (NestJS)**:
   - **AlertasService**: Servicio encargado de generar alertas basadas en condiciones del sistema (bajo stock, stock cero, productos sin movimiento).
   - **AlertasController**: Expone endpoints REST para consultar las diferentes alertas del sistema.
   - **Integración con otros módulos**: Los módulos de ventas, gastos e inventario generan eventos que pueden convertirse en notificaciones.

2. **Frontend (React)**:
   - **NotificationContext**: Contexto de React que gestiona el estado global de las notificaciones.
   - **NotificationCenter**: Componente que muestra las notificaciones en la interfaz de usuario.
   - **ToastManager**: Componente que gestiona las notificaciones emergentes (toast).
   - **NotificationService**: Servicio que se comunica con el backend para obtener y procesar las notificaciones.

### Tipos de Notificaciones

El sistema soporta cuatro tipos principales de notificaciones:

1. **Informativas (info)**: Notificaciones generales sobre eventos del sistema.
2. **Advertencias (warning)**: Alertas sobre situaciones que requieren atención pero no son críticas.
3. **Errores (error)**: Notificaciones sobre problemas que requieren atención inmediata.
4. **Éxito (success)**: Confirmaciones de operaciones completadas con éxito.

### Flujo de Notificaciones

El flujo típico de una notificación en el sistema es el siguiente:

1. **Generación**: Un evento en el sistema (backend o frontend) genera una notificación.
2. **Procesamiento**: La notificación se procesa y se clasifica según su tipo e importancia.
3. **Almacenamiento**: La notificación se almacena en el estado global gestionado por el NotificationContext.
4. **Visualización**: La notificación se muestra al usuario a través del NotificationCenter y/o como una notificación emergente (toast).
5. **Interacción**: El usuario puede interactuar con la notificación (marcarla como leída, eliminarla, hacer clic para ver más detalles).
6. **Actualización**: El estado de la notificación se actualiza según la interacción del usuario.

### Implementación del NotificationContext

El `NotificationContext` es un componente fundamental del sistema de notificaciones, ya que gestiona el estado global de las notificaciones y proporciona métodos para interactuar con ellas.

```typescript
// Definición de la interfaz Notification
export interface Notification {
  id: number | string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  link?: string;
}

// Contexto de notificaciones
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
      id: Date.now(),
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

  // Otras funciones para gestionar notificaciones...

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
```

### Implementación del NotificationCenter

El `NotificationCenter` es un componente de interfaz de usuario que muestra las notificaciones al usuario y le permite interactuar con ellas.

```typescript
const NotificationCenter: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearNotifications 
  } = useNotifications();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Funciones para gestionar la apertura y cierre del menú de notificaciones
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  // Función para manejar el clic en una notificación
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
    handleCloseMenu();
  };
  
  // Renderizado del componente
  return (
    <>
      <Tooltip title="Notificaciones">
        <IconButton color="inherit" onClick={handleOpenMenu}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        // Otras propiedades del menú...
      >
        {/* Contenido del menú de notificaciones */}
      </Menu>
    </>
  );
};
```

### Implementación del ToastManager

El `ToastManager` es un componente que gestiona las notificaciones emergentes (toast) que aparecen temporalmente en la pantalla.

```typescript
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
  
  // Renderizado del componente
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
```

### Integración con el Sistema de Alertas del Backend

El sistema de notificaciones se integra con el módulo de alertas del backend para mostrar notificaciones sobre productos con bajo stock, productos sin movimiento y otras alertas importantes.

```typescript
// Servicio de notificaciones
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

  // Otras funciones para obtener diferentes tipos de alertas...
}
```

### Notificaciones en Tiempo Real

El sistema incluye soporte para notificaciones en tiempo real cuando se realizan operaciones importantes como ventas o gastos:

```typescript
// En el servicio de ventas
async createSale(saleData: any) {
  try {
    const response = await this.post('/ventas', saleData);
    
    // Crear notificación para la venta
    const notification = notificationService.createSaleNotification(response.data.data);
    
    // Añadir la notificación al sistema
    // (esto se hace a través del contexto de notificaciones)
    
    return response;
  } catch (error) {
    throw error;
  }
}
```

### Notificaciones Nativas del Sistema Operativo

El sistema también puede mostrar notificaciones nativas del sistema operativo cuando está disponible:

```typescript
// Solicitar permiso para notificaciones nativas al cargar
useEffect(() => {
  if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
}, []);

// Mostrar notificación nativa
if ('Notification' in window && Notification.permission === 'granted') {
  new Notification(notification.title, {
    body: notification.message,
    icon: '/logo192.png'
  });
}
```

### Pruebas del Sistema de Notificaciones

Se han implementado pruebas automatizadas para verificar el correcto funcionamiento del sistema de notificaciones:

```javascript
// Pruebas para el sistema de notificaciones
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
  
  // Más pruebas...
});
```

### Optimización del Sistema de Notificaciones

Para garantizar un rendimiento óptimo, el sistema de notificaciones incluye varias optimizaciones:

1. **Memorización de componentes**: Los componentes de notificaciones utilizan React.memo para evitar renderizados innecesarios.
2. **Throttling de actualizaciones**: Las actualizaciones de notificaciones se limitan para evitar sobrecargar el sistema.
3. **Carga bajo demanda**: Las notificaciones se cargan solo cuando son necesarias.
4. **Limpieza automática**: Las notificaciones antiguas se eliminan automáticamente después de un período de tiempo.

### Conclusión

El sistema de notificaciones y alertas proporciona una forma eficiente de mantener informados a los usuarios sobre eventos importantes del sistema. Su arquitectura modular y su integración con el resto del sistema permiten una experiencia de usuario fluida y coherente.


