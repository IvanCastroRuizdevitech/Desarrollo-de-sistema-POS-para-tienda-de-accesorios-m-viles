import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../../src/common/interceptors/transform.interceptor';

describe('VentasController (Integration)', () => {
  let app: INestApplication;
  let authToken: string;
  let productoId: number;
  let ventaId: number;

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

    // Crear un producto para las pruebas
    const productoResponse = await request(app.getHttpServer())
      .post('/api/productos')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nombre: 'Producto Venta',
        descripcion: 'Producto para pruebas de venta',
        codigo: 'VENTA001',
        precio_compra: 15,
        precio_venta: 25,
        stock_minimo: 5,
        unidad_id: 1,
        impuesto_id: 1,
      });

    productoId = productoResponse.body.data.id;

    // Crear inventario para el producto
    await request(app.getHttpServer())
      .post('/api/inventario')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        producto_id: productoId,
        tienda_id: 1,
        cantidad: 100,
        ubicacion: 'Estante V-1',
      });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Ventas CRUD', () => {
    it('should create a new sale', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/ventas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          tienda_id: 1,
          cliente_id: 1, // Asumiendo que el cliente con ID 1 existe
          metodo_pago_id: 1, // Asumiendo que el método de pago con ID 1 existe
          detalles: [
            {
              producto_id: productoId,
              cantidad: 2,
              precio_unitario: 25,
              descuento: 0,
            }
          ]
        })
        .expect(201);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('total');
      expect(response.body.data.total).toBe(50); // 2 * 25
      expect(response.body.data.detalles).toBeInstanceOf(Array);
      expect(response.body.data.detalles.length).toBe(1);
      ventaId = response.body.data.id;
    });

    it('should get all sales', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/ventas')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should get a sale by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/ventas/${ventaId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.id).toBe(ventaId);
      expect(response.body.data).toHaveProperty('detalles');
      expect(response.body.data.detalles).toBeInstanceOf(Array);
    });

    it('should verify inventory was updated after sale', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/inventario/producto/${productoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].cantidad).toBe(98); // 100 - 2
    });

    it('should verify kardex entry was created for the sale', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/kardex/producto/${productoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // Buscar el movimiento de venta
      const ventaMovimiento = response.body.data.find(
        (m: any) => m.tipo_movimiento === 'Venta' && m.cantidad === 2
      );
      
      expect(ventaMovimiento).toBeDefined();
      expect(ventaMovimiento.precio_unitario).toBe(25);
    });

    it('should cancel a sale', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/ventas/${ventaId}/cancelar`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.id).toBe(ventaId);
      expect(response.body.data.estado).toBe('Cancelada');

      // Verificar que el inventario se restauró
      const inventarioResponse = await request(app.getHttpServer())
        .get(`/api/inventario/producto/${productoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(inventarioResponse.body.data[0].cantidad).toBe(100); // Restaurado a 100
    });
  });

  describe('Reportes de Ventas', () => {
    it('should get sales by period', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/reportes/ventas/day')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should get top products', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/reportes/productos/top?limite=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });
  });
});

