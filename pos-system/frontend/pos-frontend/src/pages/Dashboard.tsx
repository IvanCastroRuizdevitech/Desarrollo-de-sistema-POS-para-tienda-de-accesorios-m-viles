import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Avatar,
  LinearProgress,
  Tooltip,
  IconButton,
  useTheme
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  AttachMoney as AttachMoneyIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { reportService, alertService, productService } from '../services/api';
import { useNotifications } from '../contexts/NotificationContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [salesData, setSalesData] = useState<any>(null);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [todaySales, setTodaySales] = useState<number>(0);
  const [todayExpenses, setTodayExpenses] = useState<number>(0);
  const [salesByDay, setSalesByDay] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  // Colores para gráficos
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      
      // Obtener fecha actual
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      
      // Obtener balance mensual
      const balanceResponse = await reportService.getMonthlyBalance(1, year, month);
      setSalesData(balanceResponse.data.data);
      
      // Obtener productos con bajo stock
      const lowStockResponse = await alertService.getLowStock(1, 5);
      setLowStockProducts(lowStockResponse.data.data);
      
      // Obtener ventas de hoy
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();
      
      const salesByDayResponse = await reportService.getSalesByDay(1, startOfDay, endOfDay);
      const expensesByDayResponse = await reportService.getExpensesByDay(1, startOfDay, endOfDay);
      
      // Calcular total de ventas y gastos de hoy
      const todaySalesData = salesByDayResponse.data.data[0] || { total_ventas: 0 };
      const todayExpensesData = expensesByDayResponse.data.data[0] || { total_gastos: 0 };
      
      setTodaySales(todaySalesData.total_ventas || 0);
      setTodayExpenses(todayExpensesData.total_gastos || 0);
      
      // Obtener ventas de los últimos 7 días
      const lastWeekDate = new Date();
      lastWeekDate.setDate(lastWeekDate.getDate() - 7);
      const lastWeekStart = lastWeekDate.toISOString();
      
      const salesByWeekResponse = await reportService.getSalesByDay(1, lastWeekStart, endOfDay);
      const salesByWeekData = salesByWeekResponse.data.data || [];
      
      // Formatear datos para el gráfico
      const formattedSalesByDay = salesByWeekData.map((item: any) => ({
        fecha: new Date(item.fecha).toLocaleDateString('es-ES', { weekday: 'short' }),
        ventas: item.total_ventas || 0,
        cantidad: item.cantidad_ventas || 0
      }));
      
      setSalesByDay(formattedSalesByDay);
      
      // Obtener productos más vendidos
      const topProductsResponse = await reportService.getTopProducts(1, 5);
      setTopProducts(topProductsResponse.data.data || []);
      
      // Mostrar notificación de actualización
      addNotification({
        title: 'Dashboard Actualizado',
        message: 'Los datos del dashboard han sido actualizados correctamente.',
        type: 'success'
      });
      
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      addNotification({
        title: 'Error',
        message: 'No se pudieron cargar los datos del dashboard.',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1">
            Bienvenido, {user?.nombre || 'Usuario'}
          </Typography>
        </Box>
        <Tooltip title="Actualizar datos">
          <IconButton onClick={handleRefresh} disabled={refreshing}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {refreshing && (
        <LinearProgress sx={{ mb: 2 }} />
      )}

      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 140,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Ventas de Hoy
            </Typography>
            <Typography component="p" variant="h4" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              ${todaySales.toFixed(2)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 24, height: 24, mr: 1 }}>
                <ShoppingCartIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Actualizado hace unos momentos
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 140,
              borderLeft: `4px solid ${theme.palette.error.main}`,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Gastos de Hoy
            </Typography>
            <Typography component="p" variant="h4" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              ${todayExpenses.toFixed(2)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: theme.palette.error.main, width: 24, height: 24, mr: 1 }}>
                <AttachMoneyIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Actualizado hace unos momentos
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 140,
              borderLeft: `4px solid ${theme.palette.success.main}`,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Ventas del Mes
            </Typography>
            <Typography component="p" variant="h4" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              ${salesData?.totalVentas?.toFixed(2) || '0.00'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: theme.palette.success.main, width: 24, height: 24, mr: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                {salesData?.cantidadVentas || 0} ventas este mes
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 140,
              borderLeft: `4px solid ${theme.palette.warning.main}`,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Gastos del Mes
            </Typography>
            <Typography component="p" variant="h4" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              ${salesData?.totalGastos?.toFixed(2) || '0.00'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 24, height: 24, mr: 1 }}>
                <TrendingDownIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                {salesData?.cantidadGastos || 0} gastos este mes
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Contenido principal */}
      <Grid container spacing={3}>
        {/* Gráfico de ventas por día */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardHeader 
              title="Ventas de los Últimos 7 Días" 
              titleTypographyProps={{ variant: 'h6' }}
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  <TrendingUpIcon />
                </Avatar>
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ height: 300, width: '100%' }}>
                {salesByDay.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesByDay}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis />
                      <RechartsTooltip 
                        formatter={(value: any) => [`$${value}`, 'Ventas']}
                        labelFormatter={(label) => `Día: ${label}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="ventas" 
                        name="Ventas ($)" 
                        stroke={theme.palette.primary.main} 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" color="text.secondary">
                      No hay datos de ventas disponibles.
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Balance del mes */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardHeader 
              title="Balance del Mes" 
              titleTypographyProps={{ variant: 'h6' }}
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                  <AttachMoneyIcon />
                </Avatar>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Ingresos:</Typography>
                  <Typography variant="h6" color="success.main">
                    ${salesData?.totalVentas?.toFixed(2) || '0.00'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Gastos:</Typography>
                  <Typography variant="h6" color="error.main">
                    ${salesData?.totalGastos?.toFixed(2) || '0.00'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1">Balance:</Typography>
                  <Typography 
                    variant="h5" 
                    color={salesData?.balance >= 0 ? 'success.main' : 'error.main'}
                  >
                    ${salesData?.balance?.toFixed(2) || '0.00'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ height: 200, width: '100%', mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Ingresos', value: salesData?.totalVentas || 0 },
                            { name: 'Gastos', value: salesData?.totalGastos || 0 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill={theme.palette.success.main} />
                          <Cell fill={theme.palette.error.main} />
                        </Pie>
                        <RechartsTooltip formatter={(value) => [`$${value}`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Productos más vendidos */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader 
              title="Productos Más Vendidos" 
              titleTypographyProps={{ variant: 'h6' }}
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                  <ShoppingCartIcon />
                </Avatar>
              }
            />
            <Divider />
            <CardContent>
              {topProducts.length > 0 ? (
                <Box sx={{ height: 300, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topProducts}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="nombre" 
                        type="category" 
                        width={120}
                        tick={{ fontSize: 12 }}
                      />
                      <RechartsTooltip 
                        formatter={(value: any, name: any) => [value, name === 'cantidad' ? 'Unidades vendidas' : 'Total vendido ($)']}
                        labelFormatter={(label) => `Producto: ${label}`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="cantidad" 
                        name="Unidades" 
                        fill={theme.palette.primary.main} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hay datos de productos vendidos disponibles.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Productos con bajo stock */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader 
              title="Productos con Bajo Stock" 
              titleTypographyProps={{ variant: 'h6' }}
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                  <WarningIcon />
                </Avatar>
              }
            />
            <Divider />
            <CardContent>
              {lowStockProducts.length > 0 ? (
                <List>
                  {lowStockProducts.map((product, index) => (
                    <React.Fragment key={product.producto_id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2">
                              {product.nombre_producto}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="body2" sx={{ minWidth: 100 }}>
                                  Stock actual:
                                </Typography>
                                <Typography variant="body2" fontWeight="bold" color="error">
                                  {product.stock_actual} unidades
                                </Typography>
                              </Box>
                              <Box sx={{ width: '100%', mt: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={(product.stock_actual / 10) * 100} 
                                  color={product.stock_actual <= 5 ? "error" : "warning"}
                                  sx={{ height: 8, borderRadius: 5 }}
                                />
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < lowStockProducts.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hay productos con bajo stock.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

