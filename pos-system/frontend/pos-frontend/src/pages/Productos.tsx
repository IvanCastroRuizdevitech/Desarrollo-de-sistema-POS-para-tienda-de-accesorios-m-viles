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
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { productService, inventoryService } from '../services/api';

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

const Productos: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [productos, setProductos] = useState<any[]>([]);
  const [inventario, setInventario] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [impuestos, setImpuestos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar productos
        const productosResponse = await productService.getAll();
        setProductos(productosResponse.data);
        
        // Cargar inventario
        const inventarioResponse = await inventoryService.getAll();
        setInventario(inventarioResponse.data);
        
        // Cargar unidades
        const unidadesResponse = await productService.getAllUnits();
        setUnidades(unidadesResponse.data);
        
        // Cargar impuestos
        const impuestosResponse = await productService.getAllTaxes();
        setImpuestos(impuestosResponse.data);
        
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

  // Manejar cambio de pestaña
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filtrar productos por término de búsqueda
  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir diálogo para crear/editar producto
  const handleOpenDialog = (producto: any = null) => {
    setCurrentProduct(producto);
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentProduct(null);
  };

  // Manejar cierre de snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
        Gestión de Productos e Inventario
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} aria-label="productos tabs">
        <Tab label="Productos" />
        <Tab label="Inventario" />
        <Tab label="Unidades" />
        <Tab label="Impuestos" />
      </Tabs>

      {/* Pestaña de Productos */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            label="Buscar productos"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: <SearchIcon />
            }}
            sx={{ width: '300px' }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nuevo Producto
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProductos.length > 0 ? (
                filteredProductos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>{producto.codigo}</TableCell>
                    <TableCell>{producto.nombre}</TableCell>
                    <TableCell>{producto.categoria}</TableCell>
                    <TableCell>${producto.precio_venta.toFixed(2)}</TableCell>
                    <TableCell>{producto.unidad?.nombre || 'N/A'}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenDialog(producto)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No se encontraron productos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Pestaña de Inventario */}
      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Tienda</TableCell>
                <TableCell>Stock Actual</TableCell>
                <TableCell>Stock Mínimo</TableCell>
                <TableCell>Última Actualización</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventario.length > 0 ? (
                inventario.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.producto?.nombre || 'N/A'}</TableCell>
                    <TableCell>{item.tienda?.nombre || 'N/A'}</TableCell>
                    <TableCell>{item.saldo}</TableCell>
                    <TableCell>{item.stock_minimo}</TableCell>
                    <TableCell>{new Date(item.fecha_actualizacion).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No se encontraron registros de inventario
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Pestaña de Unidades */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
          >
            Nueva Unidad
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Símbolo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {unidades.length > 0 ? (
                unidades.map((unidad) => (
                  <TableRow key={unidad.id}>
                    <TableCell>{unidad.nombre}</TableCell>
                    <TableCell>{unidad.simbolo}</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No se encontraron unidades
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Pestaña de Impuestos */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
          >
            Nuevo Impuesto
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Porcentaje</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {impuestos.length > 0 ? (
                impuestos.map((impuesto) => (
                  <TableRow key={impuesto.id}>
                    <TableCell>{impuesto.nombre}</TableCell>
                    <TableCell>{impuesto.porcentaje}%</TableCell>
                    <TableCell>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No se encontraron impuestos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Diálogo para crear/editar producto */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Código"
                fullWidth
                variant="outlined"
                defaultValue={currentProduct?.codigo || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                fullWidth
                variant="outlined"
                defaultValue={currentProduct?.nombre || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Categoría"
                fullWidth
                variant="outlined"
                defaultValue={currentProduct?.categoria || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Unidad</InputLabel>
                <Select
                  label="Unidad"
                  defaultValue={currentProduct?.unidad_id || ''}
                >
                  {unidades.map((unidad) => (
                    <MenuItem key={unidad.id} value={unidad.id}>
                      {unidad.nombre} ({unidad.simbolo})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Precio de Compra"
                fullWidth
                variant="outlined"
                type="number"
                defaultValue={currentProduct?.precio_compra || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Precio de Venta"
                fullWidth
                variant="outlined"
                type="number"
                defaultValue={currentProduct?.precio_venta || ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Impuesto</InputLabel>
                <Select
                  label="Impuesto"
                  defaultValue={currentProduct?.impuesto_id || ''}
                >
                  {impuestos.map((impuesto) => (
                    <MenuItem key={impuesto.id} value={impuesto.id}>
                      {impuesto.nombre} ({impuesto.porcentaje}%)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                defaultValue={currentProduct?.descripcion || ''}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" color="primary">
            {currentProduct ? 'Actualizar' : 'Guardar'}
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

export default Productos;

