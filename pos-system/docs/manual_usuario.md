# Manual de Usuario - Sistema POS para Tienda de Accesorios Móviles

**Fecha:** 6 de junio de 2025  
**Versión:** 1.0

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Instalación](#instalación)
4. [Inicio de Sesión](#inicio-de-sesión)
5. [Interfaz Principal](#interfaz-principal)
6. [Gestión de Productos](#gestión-de-productos)
7. [Gestión de Inventario](#gestión-de-inventario)
8. [Realización de Ventas](#realización-de-ventas)
9. [Registro de Gastos](#registro-de-gastos)
10. [Generación de Reportes](#generación-de-reportes)
11. [Administración del Sistema](#administración-del-sistema)
12. [Solución de Problemas](#solución-de-problemas)
13. [Preguntas Frecuentes](#preguntas-frecuentes)

## Introducción

Bienvenido al Manual de Usuario del Sistema POS para Tienda de Accesorios Móviles. Este sistema ha sido diseñado para facilitar la gestión diaria de su tienda, permitiéndole realizar ventas, controlar el inventario, registrar gastos y generar reportes de manera eficiente.

### Acerca del Sistema

El Sistema POS (Point of Sale) es una aplicación de escritorio que le permite:

- Gestionar productos e inventario
- Realizar ventas con diferentes métodos de pago
- Registrar gastos
- Generar reportes de ventas, inventario y finanzas
- Administrar usuarios, roles y tiendas

Este manual le guiará a través de todas las funcionalidades del sistema, desde la instalación hasta las operaciones diarias.

## Requisitos del Sistema

Para utilizar el Sistema POS, su computadora debe cumplir con los siguientes requisitos mínimos:

- **Sistema Operativo**: Windows 10/11, macOS 10.14 o superior, o Linux (Ubuntu 20.04 o superior)
- **Procesador**: Intel Core i3 o equivalente
- **Memoria RAM**: 4 GB mínimo
- **Espacio en Disco**: 500 MB mínimo
- **Resolución de Pantalla**: 1280x720 o superior
- **Conexión a Internet**: Recomendada para actualizaciones

## Instalación

### Windows

1. Descargue el archivo de instalación `POS-System-Setup.exe` desde el sitio web oficial.
2. Ejecute el archivo descargado.
3. Siga las instrucciones del asistente de instalación.
4. Una vez completada la instalación, el sistema se iniciará automáticamente.

### macOS

1. Descargue el archivo `POS-System.dmg` desde el sitio web oficial.
2. Abra el archivo descargado.
3. Arrastre el icono de la aplicación a la carpeta de Aplicaciones.
4. Abra la aplicación desde la carpeta de Aplicaciones o desde el Launchpad.

### Linux

1. Descargue el archivo `POS-System.AppImage` desde el sitio web oficial.
2. Abra una terminal y navegue hasta la ubicación del archivo descargado.
3. Ejecute los siguientes comandos:
   ```bash
   chmod +x POS-System.AppImage
   ./POS-System.AppImage
   ```

## Inicio de Sesión

Al iniciar el sistema por primera vez, se le presentará la pantalla de inicio de sesión.

![Pantalla de Inicio de Sesión](ruta/a/imagen/login.png)

Para iniciar sesión:

1. Ingrese su dirección de correo electrónico en el campo "Correo Electrónico".
2. Ingrese su contraseña en el campo "Contraseña".
3. Haga clic en el botón "Iniciar Sesión".

Si es la primera vez que utiliza el sistema, contacte al administrador para obtener sus credenciales de acceso.

### Recuperación de Contraseña

Si ha olvidado su contraseña:

1. Haga clic en el enlace "¿Olvidó su contraseña?" en la pantalla de inicio de sesión.
2. Ingrese su dirección de correo electrónico.
3. Siga las instrucciones enviadas a su correo electrónico para restablecer su contraseña.

## Interfaz Principal

Una vez que haya iniciado sesión, se le presentará la interfaz principal del sistema, que consta de los siguientes elementos:

![Interfaz Principal](ruta/a/imagen/dashboard.png)

1. **Barra Lateral**: Contiene los enlaces a las diferentes secciones del sistema.
2. **Barra Superior**: Muestra el nombre del usuario actual y contiene botones para acciones rápidas.
3. **Área de Contenido**: Muestra la información y los controles de la sección seleccionada.
4. **Panel de Dashboard**: Muestra un resumen de la información más relevante del sistema.

### Navegación

Para navegar por el sistema, utilice los enlaces de la barra lateral:

- **Dashboard**: Muestra un resumen de la información más relevante.
- **Productos**: Gestión de productos e inventario.
- **Ventas**: Realización de ventas y consulta de ventas anteriores.
- **Gastos**: Registro y consulta de gastos.
- **Reportes**: Generación de reportes de ventas, inventario y finanzas.
- **Administración**: Gestión de usuarios, roles, tiendas y configuración del sistema (solo para administradores).

### Personalización de la Interfaz

El sistema permite personalizar algunos aspectos de la interfaz:

- **Tema Claro/Oscuro**: Haga clic en el botón de tema en la barra superior para cambiar entre tema claro y oscuro.
- **Tamaño de la Ventana**: Puede redimensionar la ventana de la aplicación según sus preferencias.

## Gestión de Productos

La sección de Productos le permite gestionar el catálogo de productos de su tienda.

![Gestión de Productos](ruta/a/imagen/productos.png)

### Consulta de Productos

Para consultar los productos existentes:

1. Haga clic en "Productos" en la barra lateral.
2. Utilice el campo de búsqueda para filtrar los productos por nombre, código o descripción.
3. Utilice los filtros adicionales para refinar la búsqueda por categoría, proveedor, etc.

### Creación de Productos

Para crear un nuevo producto:

1. Haga clic en el botón "Nuevo Producto".
2. Complete el formulario con la información del producto:
   - **Nombre**: Nombre del producto.
   - **Descripción**: Descripción detallada del producto.
   - **Código**: Código único del producto (puede ser generado automáticamente).
   - **Precio de Compra**: Precio de compra del producto.
   - **Precio de Venta**: Precio de venta del producto.
   - **Stock Mínimo**: Cantidad mínima de stock antes de generar una alerta.
   - **Unidad**: Unidad de medida del producto (unidad, kg, litro, etc.).
   - **Impuesto**: Impuesto aplicable al producto.
3. Haga clic en el botón "Guardar".

### Edición de Productos

Para editar un producto existente:

1. Haga clic en el botón de edición (icono de lápiz) junto al producto que desea editar.
2. Modifique la información del producto según sea necesario.
3. Haga clic en el botón "Guardar".

### Eliminación de Productos

Para eliminar un producto:

1. Haga clic en el botón de eliminación (icono de papelera) junto al producto que desea eliminar.
2. Confirme la eliminación en el cuadro de diálogo que aparece.

**Nota**: Solo se pueden eliminar productos que no tengan movimientos asociados (ventas, entradas de inventario, etc.).

## Gestión de Inventario

La sección de Inventario le permite controlar el stock de productos en sus tiendas.

![Gestión de Inventario](ruta/a/imagen/inventario.png)

### Consulta de Inventario

Para consultar el inventario:

1. Haga clic en "Productos" en la barra lateral.
2. Seleccione la pestaña "Inventario".
3. Utilice el campo de búsqueda para filtrar por producto o tienda.
4. Utilice los filtros adicionales para refinar la búsqueda.

### Entrada de Inventario

Para registrar una entrada de inventario:

1. Haga clic en el botón "Nueva Entrada".
2. Seleccione el producto y la tienda.
3. Ingrese la cantidad y el precio unitario.
4. Ingrese una descripción para la entrada (opcional).
5. Haga clic en el botón "Guardar".

### Salida de Inventario

Para registrar una salida de inventario:

1. Haga clic en el botón "Nueva Salida".
2. Seleccione el producto y la tienda.
3. Ingrese la cantidad.
4. Ingrese una descripción para la salida (opcional).
5. Haga clic en el botón "Guardar".

### Consulta de Kardex

El sistema Kardex permite llevar un registro detallado de los movimientos de inventario:

1. Haga clic en "Productos" en la barra lateral.
2. Seleccione la pestaña "Kardex".
3. Seleccione el producto y la tienda.
4. Especifique el rango de fechas.
5. Haga clic en el botón "Buscar".

## Realización de Ventas

La sección de Ventas le permite realizar ventas y consultar ventas anteriores.

![Realización de Ventas](ruta/a/imagen/ventas.png)

### Nueva Venta

Para realizar una nueva venta:

1. Haga clic en "Ventas" en la barra lateral.
2. Haga clic en el botón "Nueva Venta".
3. Seleccione la tienda donde se realiza la venta.
4. Seleccione el cliente o cree uno nuevo.
5. Agregue productos a la venta:
   - Busque el producto por nombre o código.
   - Ingrese la cantidad.
   - Aplique descuentos si es necesario.
   - Haga clic en el botón "Agregar".
6. Repita el paso 5 para agregar más productos.
7. Seleccione el método de pago.
8. Haga clic en el botón "Finalizar Venta".
9. Imprima o envíe por correo electrónico el comprobante de venta si es necesario.

### Consulta de Ventas

Para consultar ventas anteriores:

1. Haga clic en "Ventas" en la barra lateral.
2. Utilice el campo de búsqueda para filtrar por número de venta, cliente, etc.
3. Utilice los filtros adicionales para refinar la búsqueda por fecha, tienda, etc.
4. Haga clic en una venta para ver los detalles.

### Cancelación de Ventas

Para cancelar una venta:

1. Haga clic en "Ventas" en la barra lateral.
2. Busque la venta que desea cancelar.
3. Haga clic en el botón de cancelación (icono de X) junto a la venta.
4. Ingrese el motivo de la cancelación.
5. Haga clic en el botón "Confirmar".

**Nota**: Solo se pueden cancelar ventas del día actual. Para cancelar ventas anteriores, contacte al administrador.

## Registro de Gastos

La sección de Gastos le permite registrar y consultar los gastos de su tienda.

![Registro de Gastos](ruta/a/imagen/gastos.png)

### Nuevo Gasto

Para registrar un nuevo gasto:

1. Haga clic en "Gastos" en la barra lateral.
2. Haga clic en el botón "Nuevo Gasto".
3. Seleccione la tienda donde se realiza el gasto.
4. Ingrese la fecha del gasto.
5. Ingrese una descripción general del gasto.
6. Agregue los detalles del gasto:
   - Ingrese el concepto.
   - Ingrese el monto.
   - Haga clic en el botón "Agregar".
7. Repita el paso 6 para agregar más detalles.
8. Haga clic en el botón "Guardar".

### Consulta de Gastos

Para consultar gastos anteriores:

1. Haga clic en "Gastos" en la barra lateral.
2. Utilice el campo de búsqueda para filtrar por descripción, concepto, etc.
3. Utilice los filtros adicionales para refinar la búsqueda por fecha, tienda, etc.
4. Haga clic en un gasto para ver los detalles.

## Generación de Reportes

La sección de Reportes le permite generar informes sobre ventas, inventario, gastos, etc.

![Generación de Reportes](ruta/a/imagen/reportes.png)

### Tipos de Reportes

El sistema ofrece los siguientes tipos de reportes:

- **Ventas por Período**: Muestra las ventas realizadas en un período específico.
- **Ventas por Producto**: Muestra las ventas de cada producto en un período específico.
- **Ventas por Cliente**: Muestra las ventas realizadas a cada cliente en un período específico.
- **Ventas por Vendedor**: Muestra las ventas realizadas por cada vendedor en un período específico.
- **Inventario Actual**: Muestra el inventario actual de productos en cada tienda.
- **Productos con Bajo Stock**: Muestra los productos que están por debajo del stock mínimo.
- **Gastos por Período**: Muestra los gastos realizados en un período específico.
- **Balance de Ingresos y Gastos**: Muestra un balance de ingresos y gastos en un período específico.

### Generación de un Reporte

Para generar un reporte:

1. Haga clic en "Reportes" en la barra lateral.
2. Seleccione el tipo de reporte que desea generar.
3. Especifique los parámetros del reporte (período, tienda, etc.).
4. Haga clic en el botón "Generar Reporte".
5. El reporte se mostrará en pantalla.

### Exportación de Reportes

Para exportar un reporte:

1. Genere el reporte como se describe en la sección anterior.
2. Haga clic en el botón "Exportar" en la parte superior del reporte.
3. Seleccione el formato de exportación (PDF, CSV, Excel).
4. Seleccione la ubicación donde desea guardar el archivo.
5. Haga clic en el botón "Guardar".

## Administración del Sistema

La sección de Administración le permite gestionar usuarios, roles, tiendas y la configuración del sistema.

![Administración del Sistema](ruta/a/imagen/administracion.png)

**Nota**: Esta sección solo está disponible para usuarios con rol de Administrador.

### Gestión de Usuarios

Para gestionar los usuarios del sistema:

1. Haga clic en "Administración" en la barra lateral.
2. Seleccione la pestaña "Usuarios".

#### Creación de Usuarios

Para crear un nuevo usuario:

1. Haga clic en el botón "Nuevo Usuario".
2. Complete el formulario con la información del usuario:
   - **Nombre**: Nombre completo del usuario.
   - **Correo Electrónico**: Dirección de correo electrónico del usuario.
   - **Contraseña**: Contraseña inicial del usuario.
   - **Rol**: Rol del usuario (Administrador, Vendedor, etc.).
   - **Tienda**: Tienda a la que pertenece el usuario.
3. Haga clic en el botón "Guardar".

#### Edición de Usuarios

Para editar un usuario existente:

1. Haga clic en el botón de edición (icono de lápiz) junto al usuario que desea editar.
2. Modifique la información del usuario según sea necesario.
3. Haga clic en el botón "Guardar".

#### Desactivación de Usuarios

Para desactivar un usuario:

1. Haga clic en el botón de desactivación (icono de toggle) junto al usuario que desea desactivar.
2. Confirme la desactivación en el cuadro de diálogo que aparece.

### Gestión de Roles

Para gestionar los roles del sistema:

1. Haga clic en "Administración" en la barra lateral.
2. Seleccione la pestaña "Roles".

#### Creación de Roles

Para crear un nuevo rol:

1. Haga clic en el botón "Nuevo Rol".
2. Ingrese el nombre y la descripción del rol.
3. Seleccione los permisos que tendrá el rol.
4. Haga clic en el botón "Guardar".

#### Edición de Roles

Para editar un rol existente:

1. Haga clic en el botón de edición (icono de lápiz) junto al rol que desea editar.
2. Modifique la información del rol según sea necesario.
3. Haga clic en el botón "Guardar".

### Gestión de Tiendas

Para gestionar las tiendas del sistema:

1. Haga clic en "Administración" en la barra lateral.
2. Seleccione la pestaña "Tiendas".

#### Creación de Tiendas

Para crear una nueva tienda:

1. Haga clic en el botón "Nueva Tienda".
2. Complete el formulario con la información de la tienda:
   - **Nombre**: Nombre de la tienda.
   - **Dirección**: Dirección física de la tienda.
   - **Teléfono**: Número de teléfono de la tienda.
   - **Compañía**: Compañía a la que pertenece la tienda.
3. Haga clic en el botón "Guardar".

#### Edición de Tiendas

Para editar una tienda existente:

1. Haga clic en el botón de edición (icono de lápiz) junto a la tienda que desea editar.
2. Modifique la información de la tienda según sea necesario.
3. Haga clic en el botón "Guardar".

### Configuración del Sistema

Para acceder a la configuración del sistema:

1. Haga clic en "Administración" en la barra lateral.
2. Seleccione la pestaña "Configuración".

Desde aquí puede configurar diversos aspectos del sistema, como:

- **Configuración General**: Nombre de la empresa, logo, etc.
- **Configuración de Correo Electrónico**: Servidor SMTP, dirección de correo, etc.
- **Configuración de Impresión**: Formato de impresión, impresora predeterminada, etc.
- **Configuración de Backup**: Programación de copias de seguridad, ubicación, etc.

## Solución de Problemas

Esta sección proporciona soluciones a problemas comunes que puede encontrar al utilizar el sistema.

### Problemas de Inicio de Sesión

**Problema**: No puedo iniciar sesión en el sistema.

**Solución**:
1. Verifique que está ingresando el correo electrónico y la contraseña correctos.
2. Verifique que su cuenta no haya sido desactivada.
3. Intente restablecer su contraseña utilizando la opción "¿Olvidó su contraseña?".
4. Si el problema persiste, contacte al administrador del sistema.

### Problemas de Impresión

**Problema**: No puedo imprimir comprobantes de venta.

**Solución**:
1. Verifique que la impresora esté conectada y encendida.
2. Verifique que la impresora esté configurada correctamente en el sistema.
3. Intente reiniciar la aplicación.
4. Si el problema persiste, contacte al administrador del sistema.

### Problemas de Rendimiento

**Problema**: El sistema se ejecuta lentamente.

**Solución**:
1. Cierre otras aplicaciones que puedan estar consumiendo recursos.
2. Reinicie la aplicación.
3. Verifique que su computadora cumpla con los requisitos mínimos del sistema.
4. Si el problema persiste, contacte al administrador del sistema.

## Preguntas Frecuentes

### ¿Cómo puedo cambiar mi contraseña?

Para cambiar su contraseña:

1. Haga clic en su nombre de usuario en la barra superior.
2. Seleccione "Cambiar Contraseña".
3. Ingrese su contraseña actual.
4. Ingrese su nueva contraseña.
5. Confirme su nueva contraseña.
6. Haga clic en el botón "Guardar".

### ¿Cómo puedo crear un nuevo cliente?

Para crear un nuevo cliente:

1. Haga clic en "Ventas" en la barra lateral.
2. Haga clic en el botón "Nueva Venta".
3. Haga clic en el botón "Nuevo Cliente" junto al campo de selección de cliente.
4. Complete el formulario con la información del cliente.
5. Haga clic en el botón "Guardar".

### ¿Cómo puedo ver el historial de ventas de un cliente?

Para ver el historial de ventas de un cliente:

1. Haga clic en "Ventas" en la barra lateral.
2. Utilice el campo de búsqueda para buscar al cliente.
3. Haga clic en el botón "Ver Historial" junto al cliente.

### ¿Cómo puedo realizar una devolución?

Para realizar una devolución:

1. Haga clic en "Ventas" en la barra lateral.
2. Busque la venta original.
3. Haga clic en el botón "Devolución" junto a la venta.
4. Seleccione los productos a devolver y las cantidades.
5. Ingrese el motivo de la devolución.
6. Haga clic en el botón "Confirmar Devolución".

### ¿Cómo puedo actualizar el sistema?

El sistema se actualiza automáticamente cuando hay nuevas versiones disponibles. Sin embargo, si desea verificar manualmente si hay actualizaciones:

1. Haga clic en su nombre de usuario en la barra superior.
2. Seleccione "Acerca de".
3. Haga clic en el botón "Buscar Actualizaciones".
4. Si hay actualizaciones disponibles, siga las instrucciones en pantalla para instalarlas.

---

Si tiene alguna pregunta o problema que no esté cubierto en este manual, por favor contacte al soporte técnico en support@possystem.com o llame al +1-800-123-4567.


## Sistema de Notificaciones y Alertas

El Sistema POS incluye un completo sistema de notificaciones y alertas que le mantiene informado sobre eventos importantes del sistema, como alertas de bajo stock, ventas realizadas, gastos registrados y otros eventos relevantes.

![Centro de Notificaciones](ruta/a/imagen/notificaciones.png)

### Acceso al Centro de Notificaciones

Para acceder al centro de notificaciones:

1. Haga clic en el icono de campana ubicado en la barra superior de la aplicación.
2. Se desplegará un panel con todas sus notificaciones, ordenadas por fecha (las más recientes primero).
3. Las notificaciones no leídas se muestran con un indicador visual (punto azul) y en un color más destacado.

### Tipos de Notificaciones

El sistema muestra diferentes tipos de notificaciones, cada una con un color distintivo:

- **Informativas (azul)**: Notificaciones generales sobre eventos del sistema.
- **Advertencias (amarillo)**: Alertas sobre situaciones que requieren atención pero no son críticas.
- **Errores (rojo)**: Notificaciones sobre problemas que requieren atención inmediata.
- **Éxito (verde)**: Confirmaciones de operaciones completadas con éxito.

### Gestión de Notificaciones

Desde el centro de notificaciones, puede realizar las siguientes acciones:

#### Marcar como Leída/No Leída

Para marcar una notificación como leída:

1. Haga clic en la notificación para abrirla.
2. La notificación se marcará automáticamente como leída.

Para marcar una notificación como no leída:

1. Haga clic en el icono de "Marcar como no leída" (círculo vacío) junto a la notificación.
2. La notificación volverá a aparecer como no leída.

#### Eliminar Notificaciones

Para eliminar una notificación individual:

1. Pase el cursor sobre la notificación.
2. Haga clic en el icono de papelera que aparece.
3. Confirme la eliminación si se le solicita.

Para eliminar todas las notificaciones:

1. Haga clic en el botón "Eliminar todas" en la parte superior del centro de notificaciones.
2. Confirme la eliminación en el cuadro de diálogo que aparece.

#### Filtrar Notificaciones

Para filtrar las notificaciones por tipo:

1. Haga clic en el botón de filtro en la parte superior del centro de notificaciones.
2. Seleccione el tipo de notificación que desea ver (Todas, Informativas, Advertencias, Errores, Éxito).
3. El centro de notificaciones mostrará solo las notificaciones del tipo seleccionado.

### Notificaciones Emergentes (Toast)

Además del centro de notificaciones, el sistema muestra notificaciones emergentes (toast) para alertas importantes que requieren atención inmediata.

![Notificación Emergente](ruta/a/imagen/toast.png)

Estas notificaciones aparecen en la esquina inferior derecha de la pantalla y desaparecen automáticamente después de unos segundos. Puede:

- Hacer clic en la notificación para ver más detalles.
- Hacer clic en el botón "X" para cerrarla inmediatamente.

### Configuración de Notificaciones

Para personalizar las notificaciones que recibe:

1. Haga clic en su nombre de usuario en la barra superior.
2. Seleccione "Preferencias" en el menú desplegable.
3. Vaya a la pestaña "Notificaciones".
4. Configure las siguientes opciones:
   - **Notificaciones de bajo stock**: Active/desactive las alertas cuando un producto está por debajo del stock mínimo.
   - **Notificaciones de ventas**: Active/desactive las alertas cuando se realiza una venta.
   - **Notificaciones de gastos**: Active/desactive las alertas cuando se registra un gasto.
   - **Notificaciones del sistema**: Active/desactive las alertas sobre eventos del sistema.
   - **Notificaciones emergentes**: Active/desactive las notificaciones emergentes (toast).
   - **Notificaciones de escritorio**: Active/desactive las notificaciones nativas del sistema operativo.
5. Haga clic en el botón "Guardar" para aplicar los cambios.

### Notificaciones de Bajo Stock

El sistema genera automáticamente notificaciones cuando un producto está por debajo del stock mínimo configurado:

1. La notificación incluye el nombre del producto, el stock actual y el stock mínimo.
2. Puede hacer clic en la notificación para ir directamente a la página de inventario del producto.
3. Estas notificaciones se actualizan automáticamente cuando se repone el stock.

### Notificaciones de Ventas

Cuando se completa una venta, el sistema genera una notificación con:

1. El número de la venta.
2. El monto total.
3. El método de pago utilizado.
4. Puede hacer clic en la notificación para ver los detalles completos de la venta.

### Notificaciones de Gastos

Cuando se registra un gasto, el sistema genera una notificación con:

1. La descripción del gasto.
2. El monto total.
3. La fecha del gasto.
4. Puede hacer clic en la notificación para ver los detalles completos del gasto.

### Notificaciones del Sistema

El sistema también genera notificaciones sobre eventos importantes como:

1. Inicio y cierre de sesión.
2. Cambios en la configuración del sistema.
3. Copias de seguridad realizadas o fallidas.
4. Actualizaciones disponibles.

### Notificaciones de Escritorio

Si ha habilitado las notificaciones de escritorio, el sistema mostrará notificaciones nativas del sistema operativo incluso cuando la aplicación esté minimizada o en segundo plano.

Para habilitar las notificaciones de escritorio:

1. La primera vez que inicie el sistema, se le solicitará permiso para mostrar notificaciones.
2. Haga clic en "Permitir" para habilitar las notificaciones de escritorio.
3. Si denegó el permiso anteriormente y desea habilitarlo, consulte la configuración de notificaciones de su sistema operativo.

## Proceso de Ventas Mejorado

El Sistema POS incluye un proceso de ventas mejorado que facilita la realización de ventas de manera rápida y eficiente.

![Proceso de Ventas](ruta/a/imagen/proceso_ventas.png)

### Flujo de Trabajo por Pasos

El nuevo proceso de ventas sigue un flujo de trabajo por pasos que le guía a través de todo el proceso:

#### Paso 1: Selección de Productos

1. Escanee el código de barras del producto utilizando un lector de códigos de barras o ingrese el código manualmente en el campo "Código de barras".
2. Alternativamente, busque el producto por nombre utilizando el campo de búsqueda.
3. El producto se añadirá automáticamente a la lista de productos seleccionados.
4. Puede ajustar la cantidad de cada producto utilizando los botones + y - o ingresando directamente la cantidad.
5. Para eliminar un producto, haga clic en el botón de eliminación (icono de papelera) junto al producto.
6. Una vez que haya seleccionado todos los productos, haga clic en el botón "Continuar".

#### Paso 2: Método de Pago

1. Seleccione el método de pago haciendo clic en una de las opciones disponibles:
   - **Efectivo**: Pago en efectivo.
   - **Tarjeta de Crédito**: Pago con tarjeta de crédito.
   - **Transferencia**: Pago por transferencia bancaria.
2. Si selecciona "Efectivo", ingrese el monto recibido y el sistema calculará automáticamente el cambio.
3. Una vez seleccionado el método de pago e ingresada la información necesaria, haga clic en el botón "Continuar".

#### Paso 3: Confirmación

1. Revise los detalles de la venta:
   - Lista de productos y cantidades.
   - Subtotal, impuestos y total.
   - Método de pago seleccionado.
   - Monto recibido y cambio (si aplica).
2. Si todo es correcto, haga clic en el botón "Completar Venta".
3. Si necesita hacer cambios, haga clic en el botón "Volver" para regresar al paso anterior.

### Venta Completada

Una vez completada la venta:

1. Se mostrará un mensaje de confirmación.
2. Puede imprimir el recibo haciendo clic en el botón "Imprimir Recibo".
3. Puede iniciar una nueva venta haciendo clic en el botón "Nueva Venta".

### Funcionalidades Adicionales

El proceso de ventas mejorado incluye las siguientes funcionalidades adicionales:

#### Escaneo de Códigos de Barras

El sistema soporta la lectura de códigos de barras utilizando un lector conectado a su computadora:

1. Conecte el lector de códigos de barras a su computadora.
2. Asegúrese de que el cursor esté en el campo "Código de barras".
3. Escanee el código de barras del producto.
4. El producto se añadirá automáticamente a la lista de productos seleccionados.

#### Búsqueda Rápida de Productos

La búsqueda de productos ha sido mejorada para proporcionar resultados más rápidos y precisos:

1. Comience a escribir el nombre o código del producto en el campo de búsqueda.
2. Se mostrarán sugerencias a medida que escribe.
3. Seleccione el producto deseado de la lista de sugerencias.
4. El producto se añadirá automáticamente a la lista de productos seleccionados.

#### Gestión de Clientes

Puede asociar un cliente a la venta:

1. Haga clic en el botón "Seleccionar Cliente" en la parte superior de la pantalla.
2. Busque el cliente por nombre o número de identificación.
3. Seleccione el cliente de la lista de resultados.
4. Si el cliente no existe, puede crear uno nuevo haciendo clic en el botón "Nuevo Cliente".

#### Descuentos

Puede aplicar descuentos a productos individuales o a toda la venta:

1. Para aplicar un descuento a un producto individual, haga clic en el botón de descuento (icono de porcentaje) junto al producto.
2. Para aplicar un descuento a toda la venta, haga clic en el botón "Aplicar Descuento" en la parte inferior de la pantalla.
3. Ingrese el monto o porcentaje del descuento.
4. Haga clic en el botón "Aplicar".

#### Ventas en Espera

Puede poner una venta en espera para atenderla más tarde:

1. Haga clic en el botón "Poner en Espera" en la parte inferior de la pantalla.
2. Ingrese un nombre o identificador para la venta en espera.
3. Haga clic en el botón "Guardar".
4. Para recuperar una venta en espera, haga clic en el botón "Ventas en Espera" y seleccione la venta deseada.

## Dashboard Mejorado

El Dashboard del Sistema POS ha sido mejorado para proporcionar una visión más clara y detallada del estado de su negocio.

![Dashboard Mejorado](ruta/a/imagen/dashboard_mejorado.png)

### Gráficos Interactivos

El Dashboard ahora incluye gráficos interactivos que le permiten visualizar datos importantes:

#### Gráfico de Ventas

El gráfico de ventas muestra las ventas realizadas en un período específico:

1. Puede seleccionar el período de tiempo (día, semana, mes, año) utilizando los botones en la parte superior del gráfico.
2. Pase el cursor sobre el gráfico para ver detalles específicos de cada punto.
3. Haga clic en una barra o punto del gráfico para ver los detalles de las ventas de ese período.

#### Gráfico de Productos Más Vendidos

Este gráfico muestra los productos más vendidos en un período específico:

1. Puede seleccionar el período de tiempo y la cantidad de productos a mostrar.
2. Haga clic en un producto para ver detalles adicionales.

#### Gráfico de Ingresos vs. Gastos

Este gráfico compara los ingresos y gastos en un período específico:

1. Puede seleccionar el período de tiempo utilizando los botones en la parte superior del gráfico.
2. Las barras verdes representan los ingresos y las barras rojas representan los gastos.
3. Pase el cursor sobre una barra para ver el monto exacto.

### Indicadores Clave de Rendimiento (KPIs)

El Dashboard muestra indicadores clave de rendimiento que le permiten evaluar rápidamente el estado de su negocio:

#### Ventas del Día

Muestra el total de ventas realizadas en el día actual, con una comparación con el día anterior.

#### Ventas del Mes

Muestra el total de ventas realizadas en el mes actual, con una comparación con el mes anterior.

#### Productos con Bajo Stock

Muestra la cantidad de productos que están por debajo del stock mínimo, con un enlace para ver la lista completa.

#### Gastos del Mes

Muestra el total de gastos registrados en el mes actual, con una comparación con el mes anterior.

### Actividad Reciente

La sección de actividad reciente muestra las últimas operaciones realizadas en el sistema:

#### Últimas Ventas

Muestra las últimas ventas realizadas, con información sobre el monto, el cliente y el vendedor.

#### Últimos Gastos

Muestra los últimos gastos registrados, con información sobre el monto y la descripción.

#### Últimos Movimientos de Inventario

Muestra los últimos movimientos de inventario, con información sobre el producto, la cantidad y el tipo de movimiento.

### Personalización del Dashboard

Puede personalizar el Dashboard según sus necesidades:

1. Haga clic en el botón "Personalizar" en la esquina superior derecha del Dashboard.
2. Seleccione los widgets que desea mostrar y su posición.
3. Haga clic en el botón "Guardar" para aplicar los cambios.

## Conclusión

El Sistema POS para Tienda de Accesorios Móviles ha sido diseñado para facilitar la gestión diaria de su tienda. Con las nuevas funcionalidades de notificaciones, proceso de ventas mejorado y dashboard interactivo, ahora es más fácil que nunca mantener el control de su negocio.

Si tiene alguna pregunta o necesita asistencia adicional, no dude en contactar a nuestro equipo de soporte técnico.

¡Gracias por utilizar nuestro Sistema POS!

