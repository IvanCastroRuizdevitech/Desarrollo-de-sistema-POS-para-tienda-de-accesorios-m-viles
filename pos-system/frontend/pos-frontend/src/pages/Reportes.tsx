import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  CardHeader,
  Divider
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
  Cell
} from 'recharts';
import { reportService, alertService } from '../services/api';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { Download as DownloadIcon } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Colores para gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Reportes: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tiendaId, setTiendaId] = useState<number>(1);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(
    new Date(new Date().setDate(1)) // Primer día del mes actual
  );
  const [fechaFin, setFechaFin] = useState<Date | null>(new Date());
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Estados para los diferentes reportes
  const [balanceMensual, setBalanceMensual] = useState<any>(null);
  const [ventasPorDia, setVentasPorDia] = useState<any[]>([]);
  const [gastosPorDia, setGastosPorDia] = useState<any[]>([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState<any[]>([]);
  const [ventasPorCategoria, setVentasPorCategoria] = useState<any[]>([]);
  const [ventasPorVendedor, setVentasPorVendedor] = useState<any[]>([]);
  const [productosBajoStock, setProductosBajoStock] = useState<any[]>([]);

  // Manejar cambio de pestaña
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    cargarDatosReporte(newValue);
  };

  // Cargar datos del reporte seleccionado
  const cargarDatosReporte = async (reporteIndex: number) => {
    if (!fechaInicio || !fechaFin) return;
    
    try {
      setLoading(true);
      
      const inicio = fechaInicio.toISOString();
      const fin = fechaFin.toISOString();
      
      switch (reporteIndex) {
        case 0: // Balance Mensual
          const year = fechaInicio.getFullYear();
          const month = fechaInicio.getMonth() + 1;
          const balanceResponse = await reportService.getMonthlyBalance(tiendaId, year, month);
          setBalanceMensual(balanceResponse.data);
          break;
          
        case 1: // Ventas por Día
          const ventasDiaResponse = await reportService.getSalesByDay(tiendaId, inicio, fin);
          setVentasPorDia(ventasDiaResponse.data);
          break;
          
        case 2: // Gastos por Día
          const gastosDiaResponse = await reportService.getExpensesByDay(tiendaId, inicio, fin);
          setGastosPorDia(gastosDiaResponse.data);
          break;
          
        case 3: // Productos Más Vendidos
          const productosResponse = await reportService.getTopSellingProducts(tiendaId, inicio, fin, 10);
          setProductosMasVendidos(productosResponse.data);
          break;
          
        case 4: // Ventas por Categoría
          const categoriaResponse = await reportService.getSalesByCategory(tiendaId, inicio, fin);
          setVentasPorCategoria(categoriaResponse.data);
          break;
          
        case 5: // Ventas por Vendedor
          const vendedorResponse = await reportService.getSalesBySeller(tiendaId, inicio, fin);
          setVentasPorVendedor(vendedorResponse.data);
          break;
          
        case 6: // Productos con Bajo Stock
          const bajoStockResponse = await alertService.getLowStock(tiendaId, 10);
          setProductosBajoStock(bajoStockResponse.data);
          break;
      }
    } catch (error) {
      console.error('Error al cargar datos del reporte:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar datos del reporte. Por favor, intenta nuevamente.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosReporte(tabValue);
  }, [tiendaId, fechaInicio, fechaFin]);

  // Manejar cierre de snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Generar reporte en PDF
  const handleGenerarPDF = () => {
    // Implementar generación de PDF
    setSnackbar({
      open: true,
      message: 'Generación de PDF no implementada aún.',
      severity: 'info'
    });
  };

  // Generar reporte en CSV
  const handleGenerarCSV = () => {
    // Implementar generación de CSV
    setSnackbar({
      open: true,
      message: 'Generación de CSV no implementada aún.',
      severity: 'info'
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reportes
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tienda</InputLabel>
              <Select
                label="Tienda"
                value={tiendaId}
                onChange={(e) => setTiendaId(e.target.value as number)}
              >
                <MenuItem value={1}>Tienda Principal</MenuItem>
                <MenuItem value={2}>Tienda Secundaria</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Fecha inicio"
                value={fechaInicio}
                onChange={(date) => setFechaInicio(date)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker
                label="Fecha fin"
                value={fechaFin}
                onChange={(date) => setFechaFin(date)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleGenerarPDF}
                size="small"
              >
                PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleGenerarCSV}
                size="small"
              >
                CSV
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        aria-label="reportes tabs"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Balance Mensual" />
        <Tab label="Ventas por Día" />
        <Tab label="Gastos por Día" />
        <Tab label="Productos Más Vendidos" />
        <Tab label="Ventas por Categoría" />
        <Tab label="Ventas por Vendedor" />
        <Tab label="Productos con Bajo Stock" />
      </Tabs>

      {/* Pestaña de Balance Mensual */}
      <TabPanel value={tabValue} index={0}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Balance Mensual" />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">Ingresos:</Typography>
                      <Typography variant="h6" color="success.main">
                        ${balanceMensual?.totalVentas?.toFixed(2) || '0.00'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle1">Gastos:</Typography>
                      <Typography variant="h6" color="error.main">
                        ${balanceMensual?.totalGastos?.toFixed(2) || '0.00'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1">Balance:</Typography>
                      <Typography 
                        variant="h5" 
                        color={balanceMensual?.balance >= 0 ? 'success.main' : 'error.main'}
                      >
                        ${balanceMensual?.balance?.toFixed(2) || '0.00'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Resumen" />
                <Divider />
                <CardContent>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell>Cantidad de Ventas</TableCell>
                          <TableCell align="right">{balanceMensual?.cantidadVentas || 0}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Cantidad de Gastos</TableCell>
                          <TableCell align="right">{balanceMensual?.cantidadGastos || 0}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Promedio de Venta</TableCell>
                          <TableCell align="right">
                            ${balanceMensual?.promedioVenta?.toFixed(2) || '0.00'}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Promedio de Gasto</TableCell>
                          <TableCell align="right">
                            ${balanceMensual?.promedioGasto?.toFixed(2) || '0.00'}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Gráfico de Ingresos vs Gastos" />
                <Divider />
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { name: 'Ingresos', value: balanceMensual?.totalVentas || 0 },
                        { name: 'Gastos', value: balanceMensual?.totalGastos || 0 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                      <Legend />
                      <Bar dataKey="value" name="Monto" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      {/* Pestaña de Ventas por Día */}
      <TabPanel value={tabValue} index={1}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Ventas por Día" />
                <Divider />
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={ventasPorDia}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="fecha" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => `$${Number(value).toFixed(2)}`}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Legend />
                      <Bar dataKey="total_ventas" name="Ventas" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Cantidad de Ventas</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ventasPorDia.length > 0 ? (
                      ventasPorDia.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(item.fecha).toLocaleDateString()}</TableCell>
                          <TableCell>{item.cantidad_ventas}</TableCell>
                          <TableCell>${item.total_ventas.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No hay datos disponibles
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      {/* Pestaña de Gastos por Día */}
      <TabPanel value={tabValue} index={2}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Gastos por Día" />
                <Divider />
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={gastosPorDia}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="fecha" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => `$${Number(value).toFixed(2)}`}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Legend />
                      <Bar dataKey="total_gastos" name="Gastos" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Cantidad de Gastos</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {gastosPorDia.length > 0 ? (
                      gastosPorDia.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(item.fecha).toLocaleDateString()}</TableCell>
                          <TableCell>{item.cantidad_gastos}</TableCell>
                          <TableCell>${item.total_gastos.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No hay datos disponibles
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      {/* Pestaña de Productos Más Vendidos */}
      <TabPanel value={tabValue} index={3}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Productos Más Vendidos" />
                <Divider />
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={productosMasVendidos}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="nombre_producto" 
                        type="category" 
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="cantidad_vendida" name="Cantidad Vendida" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Ingresos por Producto" />
                <Divider />
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={productosMasVendidos}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="nombre_producto" 
                        type="category" 
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                      <Legend />
                      <Bar dataKey="total_ventas" name="Total Ventas" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell>Categoría</TableCell>
                      <TableCell>Cantidad Vendida</TableCell>
                      <TableCell>Total Ventas</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productosMasVendidos.length > 0 ? (
                      productosMasVendidos.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.nombre_producto}</TableCell>
                          <TableCell>{item.categoria}</TableCell>
                          <TableCell>{item.cantidad_vendida}</TableCell>
                          <TableCell>${item.total_ventas.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No hay datos disponibles
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      {/* Pestaña de Ventas por Categoría */}
      <TabPanel value={tabValue} index={4}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Ventas por Categoría" />
                <Divider />
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={ventasPorCategoria}
                        dataKey="total_ventas"
                        nameKey="categoria"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                        label={(entry) => entry.categoria}
                      >
                        {ventasPorCategoria.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <TableContainer component={Paper} sx={{ height: '100%' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Categoría</TableCell>
                      <TableCell>Cantidad de Productos</TableCell>
                      <TableCell>Total Ventas</TableCell>
                      <TableCell>Porcentaje</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ventasPorCategoria.length > 0 ? (
                      ventasPorCategoria.map((item, index) => {
                        const totalVentas = ventasPorCategoria.reduce((sum, cat) => sum + cat.total_ventas, 0);
                        const porcentaje = (item.total_ventas / totalVentas) * 100;
                        
                        return (
                          <TableRow key={index}>
                            <TableCell>{item.categoria}</TableCell>
                            <TableCell>{item.cantidad_productos}</TableCell>
                            <TableCell>${item.total_ventas.toFixed(2)}</TableCell>
                            <TableCell>{porcentaje.toFixed(2)}%</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No hay datos disponibles
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      {/* Pestaña de Ventas por Vendedor */}
      <TabPanel value={tabValue} index={5}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Ventas por Vendedor" />
                <Divider />
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={ventasPorVendedor}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nombre_vendedor" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                      <Legend />
                      <Bar dataKey="total_ventas" name="Total Ventas" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vendedor</TableCell>
                      <TableCell>Cantidad de Ventas</TableCell>
                      <TableCell>Total Ventas</TableCell>
                      <TableCell>Promedio por Venta</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ventasPorVendedor.length > 0 ? (
                      ventasPorVendedor.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.nombre_vendedor}</TableCell>
                          <TableCell>{item.cantidad_ventas}</TableCell>
                          <TableCell>${item.total_ventas.toFixed(2)}</TableCell>
                          <TableCell>
                            ${(item.total_ventas / item.cantidad_ventas).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No hay datos disponibles
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      {/* Pestaña de Productos con Bajo Stock */}
      <TabPanel value={tabValue} index={6}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Los siguientes productos tienen un nivel de stock bajo y requieren reposición.
              </Alert>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell>Categoría</TableCell>
                      <TableCell>Tienda</TableCell>
                      <TableCell>Stock Actual</TableCell>
                      <TableCell>Stock Mínimo</TableCell>
                      <TableCell>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productosBajoStock.length > 0 ? (
                      productosBajoStock.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.nombre_producto}</TableCell>
                          <TableCell>{item.categoria}</TableCell>
                          <TableCell>{item.nombre_tienda}</TableCell>
                          <TableCell>{item.stock_actual}</TableCell>
                          <TableCell>{item.stock_minimo}</TableCell>
                          <TableCell>
                            {item.stock_actual === 0 ? (
                              <Typography color="error">Sin Stock</Typography>
                            ) : (
                              <Typography color="warning.main">Bajo Stock</Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No hay productos con bajo stock
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </TabPanel>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Reportes;

