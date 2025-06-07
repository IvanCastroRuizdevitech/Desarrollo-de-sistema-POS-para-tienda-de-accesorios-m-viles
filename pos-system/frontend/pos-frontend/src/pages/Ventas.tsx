import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Snackbar,
  Autocomplete,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Card,
  CardContent,
  CardActions,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  Tooltip,
  Badge,
  Fade,
  useTheme,
  Collapse,
  Stack,
  Switch,
  FormControlLabel,
  Backdrop
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  ShoppingCart as ShoppingCartIcon,
  RemoveCircleOutline as RemoveIcon,
  AddCircleOutline as AddCircleIcon,
  CreditCard as CreditCardIcon,
  LocalAtm as CashIcon,
  AccountBalance as BankIcon,
  QrCodeScanner as ScannerIcon,
  Print as PrintIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import { saleService, productService, paymentMethodService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

// Pasos del proceso de venta
const steps = ['Selección de productos', 'Método de pago', 'Confirmación'];

const Ventas: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [tabValue, setTabValue] = useState(0);
  const [ventas, setVentas] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [metodosPago, setMetodosPago] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [codigoBarras, setCodigoBarras] = useState('');
  const [processingVenta, setProcessingVenta] = useState(false);
  const [ventaCompletada, setVentaCompletada] = useState(false);
  const [detalleVentaDialog, setDetalleVentaDialog] = useState<{open: boolean, venta: any}>({
    open: false,
    venta: null
  });
  const [filtroFechas, setFiltroFechas] = useState({
    desde: format(new Date(new Date().setDate(new Date().getDate() - 30)), 'yyyy-MM-dd'),
    hasta: format(new Date(), 'yyyy-MM-dd')
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const codigoBarrasRef = useRef<HTMLInputElement>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Estado para nueva venta
  const [nuevaVenta, setNuevaVenta] = useState({
    cliente_id: null,
    tienda_id: 1, // Por defecto la primera tienda
    usuario_id: user?.id || null,
    metodo_pago_id: null,
    total: 0,
    recibido: 0,
    cambio: 0,
    items: [] as any[]
  });

  // Cargar datos iniciales
  useEffect(() => {
    fetchData();
  }, []);

  // Enfocar el campo de código de barras cuando cambia el paso
  useEffect(() => {
    if (activeStep === 0 && codigoBarrasRef.current) {
      setTimeout(() => {
        codigoBarrasRef.current?.focus();
      }, 100);
    }
  }, [activeStep, tabValue]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      
      // Cargar ventas
      const ventasResponse = await saleService.getAll();
      setVentas(ventasResponse.data.data);
      
      // Cargar productos
      const productosResponse = await productService.getAll();
      setProductos(productosResponse.data.data);
      
      // Cargar métodos de pago
      const metodosPagoResponse = await paymentMethodService.getAll();
      setMetodosPago(metodosPagoResponse.data.data);
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar datos. Por favor, intenta nuevamente.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Manejar cambio de pestaña
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Reiniciar estado de nueva venta si cambia a la pestaña de nueva venta
    if (newValue === 1) {
      resetNuevaVenta();
      setActiveStep(0);
      setVentaCompletada(false);
    }
  };

  // Filtrar ventas por término de búsqueda y fechas
  const filteredVentas = ventas.filter(venta => {
    const matchesSearch = 
      venta.id.toString().includes(searchTerm) ||
      (venta.cliente?.nombre && venta.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (venta.usuario?.nombre && venta.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const ventaDate = new Date(venta.fecha);
    const desdeDate = new Date(filtroFechas.desde);
    const hastaDate = new Date(filtroFechas.hasta);
    hastaDate.setHours(23, 59, 59, 999); // Ajustar al final del día
    
    const matchesFecha = ventaDate >= desdeDate && ventaDate <= hastaDate;
    
    return matchesSearch && matchesFecha;
  });

  // Abrir diálogo para crear venta
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Manejar cierre de snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Reiniciar estado de nueva venta
  const resetNuevaVenta = () => {
    setNuevaVenta({
      cliente_id: null,
      tienda_id: 1,
      usuario_id: user?.id || null,
      metodo_pago_id: null,
      total: 0,
      recibido: 0,
      cambio: 0,
      items: []
    });
  };

  // Agregar producto a la venta
  const handleAddProducto = (producto: any) => {
    // Verificar si el producto ya está en la lista
    const existingItem = nuevaVenta.items.find(item => item.producto_id === producto.id);
    
    if (existingItem) {
      // Actualizar cantidad si ya existe
      const updatedItems = nuevaVenta.items.map(item => 
        item.producto_id === producto.id 
          ? { ...item, cantidad: item.cantidad + 1 } 
          : item
      );
      
      setNuevaVenta({
        ...nuevaVenta,
        items: updatedItems,
        total: calcularTotal(updatedItems)
      });
    } else {
      // Agregar nuevo item
      const newItem = {
        producto_id: producto.id,
        producto: producto,
        cantidad: 1,
        precio_unitario: producto.precio_venta,
        subtotal: producto.precio_venta
      };
      
      const updatedItems = [...nuevaVenta.items, newItem];
      
      setNuevaVenta({
        ...nuevaVenta,
        items: updatedItems,
        total: calcularTotal(updatedItems)
      });
    }
    
    // Limpiar campo de código de barras
    setCodigoBarras('');
    
    // Enfocar nuevamente el campo de código de barras
    if (codigoBarrasRef.current) {
      codigoBarrasRef.current.focus();
    }
  };

  // Buscar producto por código de barras
  const handleBuscarPorCodigo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && codigoBarras.trim() !== '') {
      const producto = productos.find(p => p.codigo === codigoBarras.trim());
      
      if (producto) {
        handleAddProducto(producto);
      } else {
        setSnackbar({
          open: true,
          message: 'Producto no encontrado',
          severity: 'error'
        });
      }
    }
  };

  // Eliminar producto de la venta
  const handleRemoveProducto = (productoId: number) => {
    const updatedItems = nuevaVenta.items.filter(item => item.producto_id !== productoId);
    
    setNuevaVenta({
      ...nuevaVenta,
      items: updatedItems,
      total: calcularTotal(updatedItems)
    });
  };

  // Actualizar cantidad de un producto
  const handleUpdateCantidad = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      handleRemoveProducto(productoId);
      return;
    }
    
    const updatedItems = nuevaVenta.items.map(item => 
      item.producto_id === productoId 
        ? { 
            ...item, 
            cantidad, 
            subtotal: item.precio_unitario * cantidad 
          } 
        : item
    );
    
    setNuevaVenta({
      ...nuevaVenta,
      items: updatedItems,
      total: calcularTotal(updatedItems)
    });
  };

  // Calcular total de la venta
  const calcularTotal = (items: any[]) => {
    return items.reduce((total, item) => total + (item.precio_unitario * item.cantidad), 0);
  };

  // Manejar cambio en el monto recibido
  const handleMontoRecibidoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const recibido = parseFloat(e.target.value) || 0;
    const cambio = recibido - nuevaVenta.total;
    
    setNuevaVenta({
      ...nuevaVenta,
      recibido,
      cambio: cambio > 0 ? cambio : 0
    });
  };

  // Avanzar al siguiente paso
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  // Retroceder al paso anterior
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Completar venta
  const handleCompletarVenta = async () => {
    try {
      setProcessingVenta(true);
      
      // Preparar datos para la API
      const ventaData = {
        cliente_id: nuevaVenta.cliente_id,
        tienda_id: nuevaVenta.tienda_id,
        usuario_id: nuevaVenta.usuario_id,
        metodo_pago_id: nuevaVenta.metodo_pago_id,
        total: nuevaVenta.total,
        items: nuevaVenta.items.map(item => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario
        }))
      };
      
      // Enviar a la API
      const response = await saleService.create(ventaData);
      
      // Actualizar lista de ventas
      setVentas([response.data.data, ...ventas]);
      
      // Mostrar notificación
      addNotification({
        title: 'Venta Completada',
        message: `Se ha registrado una nueva venta por $${nuevaVenta.total.toFixed(2)}`,
        type: 'success',
        link: '/ventas'
      });
      
      setSnackbar({
        open: true,
        message: 'Venta completada con éxito',
        severity: 'success'
      });
      
      // Marcar venta como completada
      setVentaCompletada(true);
      
    } catch (error) {
      console.error('Error al completar venta:', error);
      setSnackbar({
        open: true,
        message: 'Error al completar la venta. Por favor, intenta nuevamente.',
        severity: 'error'
      });
    } finally {
      setProcessingVenta(false);
    }
  };

  // Iniciar nueva venta
  const handleNuevaVenta = () => {
    resetNuevaVenta();
    setActiveStep(0);
    setVentaCompletada(false);
  };

  // Ver detalle de venta
  const handleVerDetalle = (venta: any) => {
    setDetalleVentaDialog({
      open: true,
      venta
    });
  };

  // Cerrar diálogo de detalle de venta
  const handleCloseDetalleDialog = () => {
    setDetalleVentaDialog({
      open: false,
      venta: null
    });
  };

  // Renderizar contenido según el paso actual
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Código de barras"
                    variant="outlined"
                    value={codigoBarras}
                    onChange={(e) => setCodigoBarras(e.target.value)}
                    onKeyPress={handleBuscarPorCodigo}
                    inputRef={codigoBarrasRef}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Escanear código">
                            <IconButton edge="end">
                              <ScannerIcon />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                
                <Autocomplete
                  options={productos}
                  getOptionLabel={(option) => `${option.codigo} - ${option.nombre}`}
                  renderInput={(params) => <TextField {...params} label="Buscar producto" variant="outlined" />}
                  onChange={(event, value) => {
                    if (value) {
                      handleAddProducto(value);
                    }
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  sx={{ mb: 2 }}
                />
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <ShoppingCartIcon sx={{ mr: 1 }} />
                  Productos Seleccionados
                  <Chip 
                    label={nuevaVenta.items.length} 
                    color="primary" 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                </Typography>
                
                <TableContainer sx={{ maxHeight: 400 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Producto</TableCell>
                        <TableCell align="right">Precio</TableCell>
                        <TableCell align="center">Cantidad</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {nuevaVenta.items.length > 0 ? (
                        nuevaVenta.items.map((item) => (
                          <TableRow key={item.producto_id} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {item.producto.nombre}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Código: {item.producto.codigo}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">${item.precio_unitario.toFixed(2)}</TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleUpdateCantidad(item.producto_id, item.cantidad - 1)}
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                                <Typography sx={{ mx: 1, minWidth: '30px', textAlign: 'center' }}>
                                  {item.cantidad}
                                </Typography>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleUpdateCantidad(item.producto_id, item.cantidad + 1)}
                                >
                                  <AddCircleIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography fontWeight="bold">
                                ${(item.precio_unitario * item.cantidad).toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleRemoveProducto(item.producto_id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <ShoppingCartIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                              <Typography variant="body1" color="text.secondary">
                                No hay productos agregados
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Escanea un código de barras o busca un producto para agregarlo
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={resetNuevaVenta}
                    disabled={nuevaVenta.items.length === 0}
                  >
                    Cancelar Venta
                  </Button>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ mr: 2 }}>
                      Total: ${nuevaVenta.total.toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      onClick={handleNext}
                      disabled={nuevaVenta.items.length === 0}
                    >
                      Continuar
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Seleccionar Método de Pago
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {metodosPago.map((metodo) => (
                    <Grid item xs={12} sm={6} md={4} key={metodo.id}>
                      <Card 
                        elevation={nuevaVenta.metodo_pago_id === metodo.id ? 3 : 1}
                        sx={{ 
                          cursor: 'pointer',
                          border: nuevaVenta.metodo_pago_id === metodo.id ? `2px solid ${theme.palette.primary.main}` : 'none',
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: 3
                          }
                        }}
                        onClick={() => setNuevaVenta({...nuevaVenta, metodo_pago_id: metodo.id})}
                      >
                        <CardContent sx={{ textAlign: 'center' }}>
                          {metodo.nombre === 'Efectivo' && <CashIcon sx={{ fontSize: 40, mb: 1 }} color="success" />}
                          {metodo.nombre === 'Tarjeta de Crédito' && <CreditCardIcon sx={{ fontSize: 40, mb: 1 }} color="info" />}
                          {metodo.nombre === 'Transferencia' && <BankIcon sx={{ fontSize: 40, mb: 1 }} color="primary" />}
                          <Typography variant="h6">{metodo.nombre}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                {nuevaVenta.metodo_pago_id === 1 && ( // Asumiendo que ID 1 es Efectivo
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Detalles del Pago en Efectivo
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Monto Recibido"
                          type="number"
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          }}
                          value={nuevaVenta.recibido || ''}
                          onChange={handleMontoRecibidoChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Total a Pagar"
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            readOnly: true,
                          }}
                          value={nuevaVenta.total.toFixed(2)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Cambio"
                          InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            readOnly: true,
                          }}
                          value={nuevaVenta.cambio.toFixed(2)}
                          sx={{
                            '& .MuiInputBase-input': {
                              color: nuevaVenta.cambio > 0 ? theme.palette.success.main : 'inherit',
                              fontWeight: 'bold'
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Resumen de Venta
                </Typography>
                
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Productos" 
                      secondary={`${nuevaVenta.items.length} productos diferentes`} 
                    />
                    <Typography variant="body1">
                      {nuevaVenta.items.reduce((total, item) => total + item.cantidad, 0)} unidades
                    </Typography>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Subtotal" />
                    <Typography variant="body1">${nuevaVenta.total.toFixed(2)}</Typography>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Impuestos" />
                    <Typography variant="body1">$0.00</Typography>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText primary="Total" />
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ${nuevaVenta.total.toFixed(2)}
                    </Typography>
                  </ListItem>
                </List>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                  >
                    Volver
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleNext}
                    disabled={!nuevaVenta.metodo_pago_id || (nuevaVenta.metodo_pago_id === 1 && nuevaVenta.recibido < nuevaVenta.total)}
                  >
                    Continuar
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        );
      
      case 2:
        return (
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                {ventaCompletada ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                      ¡Venta Completada con Éxito!
                    </Typography>
                    <Typography variant="body1" paragraph>
                      La venta ha sido registrada correctamente en el sistema.
                    </Typography>
                    
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<PrintIcon />}
                      >
                        Imprimir Recibo
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingCartIcon />}
                        onClick={handleNuevaVenta}
                      >
                        Nueva Venta
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                      Confirmar Venta
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                          Detalles de la Venta
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText primary="Fecha" secondary={format(new Date(), 'PPP', { locale: es })} />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Vendedor" secondary={user?.nombre || 'Usuario'} />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Método de Pago" 
                              secondary={metodosPago.find(m => m.id === nuevaVenta.metodo_pago_id)?.nombre || 'No seleccionado'} 
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Total" 
                              secondary={<Typography fontWeight="bold" color="primary">${nuevaVenta.total.toFixed(2)}</Typography>} 
                            />
                          </ListItem>
                          {nuevaVenta.metodo_pago_id === 1 && (
                            <>
                              <ListItem>
                                <ListItemText primary="Monto Recibido" secondary={`$${nuevaVenta.recibido.toFixed(2)}`} />
                              </ListItem>
                              <ListItem>
                                <ListItemText 
                                  primary="Cambio" 
                                  secondary={<Typography fontWeight="bold" color="success.main">${nuevaVenta.cambio.toFixed(2)}</Typography>} 
                                />
                              </ListItem>
                            </>
                          )}
                        </List>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                          Resumen de Productos
                        </Typography>
                        <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                          {nuevaVenta.items.map((item) => (
                            <ListItem key={item.producto_id}>
                              <ListItemText 
                                primary={item.producto.nombre} 
                                secondary={`${item.cantidad} x $${item.precio_unitario.toFixed(2)}`} 
                              />
                              <Typography variant="body2">
                                ${(item.cantidad * item.precio_unitario).toFixed(2)}
                              </Typography>
                            </ListItem>
                          ))}
                        </List>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                      <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                        disabled={processingVenta}
                      >
                        Volver
                      </Button>
                      
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={processingVenta ? <CircularProgress size={24} color="inherit" /> : <CheckCircleIcon />}
                        onClick={handleCompletarVenta}
                        disabled={processingVenta}
                      >
                        {processingVenta ? 'Procesando...' : 'Completar Venta'}
                      </Button>
                    </Box>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        );
      
      default:
        return null;
    }
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
        <Typography variant="h4">
          Gestión de Ventas
        </Typography>
        <Tooltip title="Actualizar datos">
          <IconButton onClick={fetchData} disabled={refreshing}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {refreshing && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
        </Box>
      )}

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        aria-label="ventas tabs"
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          mb: 2
        }}
      >
        <Tab 
          label="Historial de Ventas" 
          icon={<ReceiptIcon />} 
          iconPosition="start"
        />
        <Tab 
          label="Nueva Venta" 
          icon={<ShoppingCartIcon />} 
          iconPosition="start"
        />
      </Tabs>

      {/* Pestaña de Historial de Ventas */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Buscar ventas"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                sx={{ mr: 1 }}
              >
                Filtros
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setTabValue(1)}
              >
                Nueva Venta
              </Button>
            </Grid>
          </Grid>
          
          <Collapse in={mostrarFiltros}>
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Filtrar por Fecha
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Desde"
                    type="date"
                    value={filtroFechas.desde}
                    onChange={(e) => setFiltroFechas({...filtroFechas, desde: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Hasta"
                    type="date"
                    value={filtroFechas.hasta}
                    onChange={(e) => setFiltroFechas({...filtroFechas, hasta: e.target.value})}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      setFiltroFechas({
                        desde: format(new Date(new Date().setDate(new Date().getDate() - 30)), 'yyyy-MM-dd'),
                        hasta: format(new Date(), 'yyyy-MM-dd')
                      });
                    }}
                  >
                    Reiniciar
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Collapse>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Vendedor</TableCell>
                <TableCell>Método de Pago</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVentas.length > 0 ? (
                filteredVentas.map((venta) => (
                  <TableRow key={venta.id} hover>
                    <TableCell>{venta.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2">
                          {format(new Date(venta.fecha), 'dd/MM/yyyy')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(venta.fecha), 'HH:mm')}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{venta.cliente?.nombre || 'Cliente General'}</TableCell>
                    <TableCell>{venta.usuario?.nombre || 'N/A'}</TableCell>
                    <TableCell>{venta.metodo_pago?.nombre || 'N/A'}</TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="medium">
                        ${venta.total.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver detalle">
                        <IconButton size="small" color="primary" onClick={() => handleVerDetalle(venta)}>
                          <ReceiptIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box sx={{ py: 3 }}>
                      <Typography variant="body1">
                        No se encontraron ventas
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Intenta con otros criterios de búsqueda
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Pestaña de Nueva Venta */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {renderStepContent(activeStep)}
        </Box>
      </TabPanel>

      {/* Diálogo de detalle de venta */}
      <Dialog
        open={detalleVentaDialog.open}
        onClose={handleCloseDetalleDialog}
        maxWidth="md"
        fullWidth
      >
        {detalleVentaDialog.venta && (
          <>
            <DialogTitle>
              Detalle de Venta #{detalleVentaDialog.venta.id}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Información General
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Fecha" 
                        secondary={format(new Date(detalleVentaDialog.venta.fecha), 'PPP', { locale: es })} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Hora" 
                        secondary={format(new Date(detalleVentaDialog.venta.fecha), 'HH:mm:ss')} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Cliente" 
                        secondary={detalleVentaDialog.venta.cliente?.nombre || 'Cliente General'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Vendedor" 
                        secondary={detalleVentaDialog.venta.usuario?.nombre || 'N/A'} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Método de Pago" 
                        secondary={detalleVentaDialog.venta.metodo_pago?.nombre || 'N/A'} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Resumen
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Subtotal" 
                        secondary={`$${detalleVentaDialog.venta.total.toFixed(2)}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Impuestos" 
                        secondary="$0.00" 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Total" 
                        secondary={
                          <Typography fontWeight="bold" color="primary">
                            ${detalleVentaDialog.venta.total.toFixed(2)}
                          </Typography>
                        } 
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Productos
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Producto</TableCell>
                          <TableCell align="right">Precio Unitario</TableCell>
                          <TableCell align="center">Cantidad</TableCell>
                          <TableCell align="right">Subtotal</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detalleVentaDialog.venta.detalles?.map((detalle: any) => (
                          <TableRow key={detalle.id}>
                            <TableCell>{detalle.producto?.nombre || 'Producto'}</TableCell>
                            <TableCell align="right">${detalle.precio_unitario.toFixed(2)}</TableCell>
                            <TableCell align="center">{detalle.cantidad}</TableCell>
                            <TableCell align="right">${(detalle.precio_unitario * detalle.cantidad).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetalleDialog}>Cerrar</Button>
              <Button 
                variant="outlined" 
                startIcon={<PrintIcon />}
              >
                Imprimir
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Backdrop para procesamiento de venta */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={processingVenta}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>Procesando venta...</Typography>
        </Box>
      </Backdrop>

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

export default Ventas;

