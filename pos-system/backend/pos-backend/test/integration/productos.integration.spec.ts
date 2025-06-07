import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../../src/common/interceptors/transform.interceptor';

describe('ProductosController (Integration)', () => {
  let app: INestApplication;
  let authToken: string;
  let productoId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Aplicar las mismas configuraciones que en main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.setGlobalPrefix('api');
    
    await app.init();

    // Obtener token de autenticación
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com', // Asumiendo que este usuario existe
        password: 'admin123',
      });

    authToken = loginResponse.body.data.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Productos CRUD', () => {
    it('should create a new product', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/productos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nombre: 'Producto de Prueba',
          descripcion: 'Descripción del producto de prueba',
          codigo: 'TEST001',
          precio_compra: 10.5,
          precio_venta: 15.75,
          stock_minimo: 5,
          unidad_id: 1, // Asumiendo que la unidad con ID 1 existe
          impuesto_id: 1, // Asumiendo que el impuesto con ID 1 existe
        })
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.nombre).toBe('Producto de Prueba');
      productoId = response.body.data.id;
    });

    it('should get all products', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/productos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should get a product by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/productos/${productoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.id).toBe(productoId);
      expect(response.body.data.nombre).toBe('Producto de Prueba');
    });

    it('should update a product', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/productos/${productoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nombre: 'Producto Actualizado',
          descripcion: 'Descripción actualizada',
          precio_venta: 18.5,
        })
        .expect(200);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.id).toBe(productoId);
      expect(response.body.data.nombre).toBe('Producto Actualizado');
      expect(response.body.data.precio_venta).toBe(18.5);
    });

    it('should delete a product', async () => {
      await request(app.getHttpServer())
        .delete(`/api/productos/${productoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verificar que el producto fue eliminado
      await request(app.getHttpServer())
        .get(`/api/productos/${productoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('Inventario', () => {
    let inventarioId: number;
    let nuevoProductoId: number;

    it('should create a new product for inventory test', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/productos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nombre: 'Producto Inventario',
          descripcion: 'Producto para prueba de inventario',
          codigo: 'INV001',
          precio_compra: 20,
          precio_venta: 30,
          stock_minimo: 10,
          unidad_id: 1,
          impuesto_id: 1,
        })
        .expect(201);

      nuevoProductoId = response.body.data.id;
    });

    it('should create inventory entry', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/inventario')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          producto_id: nuevoProductoId,
          tienda_id: 1, // Asumiendo que la tienda con ID 1 existe
          cantidad: 50,
          ubicacion: 'Estante A-1',
        })
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.producto_id).toBe(nuevoProductoId);
      expect(response.body.data.cantidad).toBe(50);
      inventarioId = response.body.data.id;
    });

    it('should get inventory by product', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/inventario/producto/${nuevoProductoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].producto_id).toBe(nuevoProductoId);
    });

    it('should update inventory quantity', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/inventario/${inventarioId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          cantidad: 45,
          ubicacion: 'Estante A-2',
        })
        .expect(200);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.id).toBe(inventarioId);
      expect(response.body.data.cantidad).toBe(45);
      expect(response.body.data.ubicacion).toBe('Estante A-2');
    });

    it('should register kardex movement', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/kardex')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          producto_id: nuevoProductoId,
          tienda_id: 1,
          tipo_movimiento: 'Entrada',
          cantidad: 10,
          precio_unitario: 20,
          descripcion: 'Entrada de prueba',
        })
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.producto_id).toBe(nuevoProductoId);
      expect(response.body.data.tipo_movimiento).toBe('Entrada');
      expect(response.body.data.cantidad).toBe(10);

      // Verificar que el inventario se actualizó
      const inventarioResponse = await request(app.getHttpServer())
        .get(`/api/inventario/${inventarioId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(inventarioResponse.body.data.cantidad).toBe(55); // 45 + 10
    });
  });
});

