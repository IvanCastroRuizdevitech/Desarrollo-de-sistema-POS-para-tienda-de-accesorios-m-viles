
-- ===================== Tipos y ENUMs =====================
CREATE TYPE tipo_movimiento_enum AS ENUM ('Entrada', 'Salida', 'Venta');
CREATE TYPE tipo_persona_enum AS ENUM ('Cliente', 'Empleado', 'Proveedor');

-- ===================== Tablas =====================

CREATE TABLE Tipos_Identificacion (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT
);

CREATE TABLE Personas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    telefono VARCHAR(20),
    direccion TEXT,
    tipo tipo_persona_enum,
    tipo_identificacion_id INT REFERENCES Tipos_Identificacion(id),
    numero_identificacion VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE Roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    permisos TEXT
);

CREATE TABLE Usuarios (
    id SERIAL PRIMARY KEY,
    persona_id INT REFERENCES Personas(id),
    correo VARCHAR(100) UNIQUE NOT NULL,
    contraseña TEXT NOT NULL,
    rol_id INT REFERENCES Roles(id),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usuarios_persona_id ON Usuarios(persona_id);

CREATE TABLE Compañias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    NIT VARCHAR(20) UNIQUE,
    direccion TEXT
);

CREATE TABLE Tiendas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    direccion TEXT,
    compañia_id INT REFERENCES Compañias(id)
);

CREATE TABLE Unidades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT
);

CREATE TABLE Impuestos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    porcentaje DECIMAL(5,2) NOT NULL
);

CREATE TABLE Productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    categoria VARCHAR(50),
    precio DECIMAL(10,2),
    unidad_id INT REFERENCES Unidades(id),
    impuesto_id INT REFERENCES Impuestos(id)
);

CREATE TABLE Inventario (
    id SERIAL PRIMARY KEY,
    producto_id INT REFERENCES Productos(id),
    tienda_id INT REFERENCES Tiendas(id),
    saldo INT DEFAULT 0
);

CREATE INDEX idx_inventario_producto_id ON Inventario(producto_id);
CREATE INDEX idx_inventario_tienda_id ON Inventario(tienda_id);

CREATE TABLE Kardex (
    id SERIAL PRIMARY KEY,
    producto_id INT REFERENCES Productos(id),
    tienda_id INT REFERENCES Tiendas(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_movimiento tipo_movimiento_enum,
    cantidad INT,
    saldo INT
);

CREATE INDEX idx_kardex_producto_fecha ON Kardex(producto_id, fecha);

CREATE TABLE Metodos_Pago (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50)
);

CREATE TABLE Ventas (
    id SERIAL PRIMARY KEY,
    vendedor_id INT REFERENCES Personas(id),
    cliente_id INT REFERENCES Personas(id),
    tienda_id INT REFERENCES Tiendas(id),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2),
    metodo_pago_id INT REFERENCES Metodos_Pago(id)
);

CREATE INDEX idx_ventas_fecha ON Ventas(fecha);

CREATE TABLE Detalles_Ventas (
    id SERIAL PRIMARY KEY,
    venta_id INT REFERENCES Ventas(id),
    producto_id INT REFERENCES Productos(id),
    cantidad INT,
    subtotal DECIMAL(10,2)
);

CREATE TABLE Gastos (
    id SERIAL PRIMARY KEY,
    tienda_id INT REFERENCES Tiendas(id),
    total DECIMAL(10,2),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Detalles_Gastos (
    id SERIAL PRIMARY KEY,
    gasto_id INT REFERENCES Gastos(id),
    concepto TEXT,
    monto DECIMAL(10,2)
);

CREATE TABLE Proveedores_Productos (
    id SERIAL PRIMARY KEY,
    proveedor_id INT REFERENCES Personas(id),
    producto_id INT REFERENCES Productos(id),
    precio DECIMAL(10,2),
    disponibilidad BOOLEAN DEFAULT TRUE
);
