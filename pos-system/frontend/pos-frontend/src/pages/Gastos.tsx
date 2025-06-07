import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  Divider,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { expenseService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

const Gastos: React.FC = () => {
  const { user } = useAuth();
  const [gastos, setGastos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Estado para filtros de fecha
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);

  // Estado para nuevo gasto
  const [nuevoGasto, setNuevoGasto] = useState({
    tienda_id: 1, // Por defecto la primera tienda
    usuario_id: user?.id || null,
    fecha: new Date(),
    concepto: '',
    total: 0,
    detalles: [] as any[]
  });

  // Estado para detalle de gasto
  const [nuevoDetalle, setNuevoDetalle] = useState({
    descripcion: '',
    monto: 0
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar gastos
        const gastosResponse = await expenseService.getAll();
        setGastos(gastosResponse.data);
        
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setSnackbar({
          open: true,
          message: 'Error al cargar datos. Por favor, intenta nuevamente.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filtrar gastos por término de búsqueda y fechas
  const filteredGastos = gastos.filter(gasto => {
    // Filtrar por término de búsqueda
    const matchesSearch = 
      gasto.id.toString().includes(searchTerm) ||
      gasto.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (gasto.usuario?.nombre && gasto.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtrar por fecha de inicio
    const matchesFechaInicio = fechaInicio 
      ? new Date(gasto.fecha) >= fechaInicio
      : true;
    
    // Filtrar por fecha de fin
    const matchesFechaFin = fechaFin
      ? new Date(gasto.fecha) <= fechaFin
      : true;
    
    return matchesSearch && matchesFechaInicio && matchesFechaFin;
  });

  // Abrir diálogo para crear gasto
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Reiniciar estado de nuevo gasto
    setNuevoGasto({
      tienda_id: 1,
      usuario_id: user?.id || null,
      fecha: new Date(),
      concepto: '',
      total: 0,
      detalles: []
    });
    // Reiniciar estado de nuevo detalle
    setNuevoDetalle({
      descripcion: '',
      monto: 0
    });
  };

  // Manejar cierre de snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Agregar detalle al gasto
  const handleAddDetalle = () => {
    if (!nuevoDetalle.descripcion || nuevoDetalle.monto <= 0) {
      setSnackbar({
        open: true,
        message: 'Por favor, ingresa una descripción y un monto válido.',
        severity: 'error'
      });
      return;
    }
    
    const updatedDetalles = [...nuevoGasto.detalles, { ...nuevoDetalle }];
    const total = updatedDetalles.reduce((sum, detalle) => sum + detalle.monto, 0);
    
    setNuevoGasto({
      ...nuevoGasto,
      detalles: updatedDetalles,
      total
    });
    
    // Reiniciar estado de nuevo detalle
    setNuevoDetalle({
      descripcion: '',
      monto: 0
    });
  };

  // Eliminar detalle del gasto
  const handleRemoveDetalle = (index: number) => {
    const updatedDetalles = nuevoGasto.detalles.filter((_, i) => i !== index);
    const total = updatedDetalles.reduce((sum, detalle) => sum + detalle.monto, 0);
    
    setNuevoGasto({
      ...nuevoGasto,
      detalles: updatedDetalles,
      total
    });
  };

  // Guardar nuevo gasto
  const handleSaveGasto = async () => {
    if (!nuevoGasto.concepto || nuevoGasto.detalles.length === 0) {
      setSnackbar({
        open: true,
        message: 'Por favor, ingresa un concepto y al menos un detalle.',
        severity: 'error'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Crear gasto
      await expenseService.create(nuevoGasto);
      
      // Recargar gastos
      const gastosResponse = await expenseService.getAll();
      setGastos(gastosResponse.data);
      
      setSnackbar({
        open: true,
        message: 'Gasto registrado correctamente.',
        severity: 'success'
      });
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar gasto:', error);
      setSnackbar({
        open: true,
        message: 'Error al guardar gasto. Por favor, intenta nuevamente.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
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
      <Typography variant="h4" gutterBottom>
        Gestión de Gastos
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              label="Buscar gastos"
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end"><SearchIcon /></InputAdornment>
              }}
            />
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
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              fullWidth
            >
              Nuevo Gasto
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Concepto</TableCell>
              <TableCell>Registrado por</TableCell>
              <TableCell>Tienda</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGastos.length > 0 ? (
              filteredGastos.map((gasto) => (
                <TableRow key={gasto.id}>
                  <TableCell>{gasto.id}</TableCell>
                  <TableCell>{new Date(gasto.fecha).toLocaleDateString()}</TableCell>
                  <TableCell>{gasto.concepto}</TableCell>
                  <TableCell>{gasto.usuario?.nombre || 'N/A'}</TableCell>
                  <TableCell>{gasto.tienda?.nombre || 'N/A'}</TableCell>
                  <TableCell>${gasto.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <ReceiptIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No se encontraron gastos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para crear gasto */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Nuevo Gasto
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Concepto"
                fullWidth
                variant="outlined"
                value={nuevoGasto.concepto}
                onChange={(e) => setNuevoGasto({...nuevoGasto, concepto: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha"
                  value={nuevoGasto.fecha}
                  onChange={(date) => setNuevoGasto({...nuevoGasto, fecha: date || new Date()})}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Chip label="Detalles del Gasto" />
              </Divider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Descripción"
                fullWidth
                variant="outlined"
                value={nuevoDetalle.descripcion}
                onChange={(e) => setNuevoDetalle({...nuevoDetalle, descripcion: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Monto"
                fullWidth
                variant="outlined"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={nuevoDetalle.monto}
                onChange={(e) => setNuevoDetalle({...nuevoDetalle, monto: parseFloat(e.target.value) || 0})}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="outlined"
                fullWidth
                sx={{ height: '100%' }}
                onClick={handleAddDetalle}
              >
                Agregar
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Monto</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {nuevoGasto.detalles.length > 0 ? (
                      nuevoGasto.detalles.map((detalle, index) => (
                        <TableRow key={index}>
                          <TableCell>{detalle.descripcion}</TableCell>
                          <TableCell>${detalle.monto.toFixed(2)}</TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleRemoveDetalle(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No hay detalles agregados
                        </TableCell>
                      </TableRow>
                    )}
                    {nuevoGasto.detalles.length > 0 && (
                      <TableRow>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total:</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>${nuevoGasto.total.toFixed(2)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSaveGasto}
            disabled={!nuevoGasto.concepto || nuevoGasto.detalles.length === 0}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

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

export default Gastos;

