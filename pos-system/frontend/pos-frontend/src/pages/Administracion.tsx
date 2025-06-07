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
  Snackbar,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon
} from '@mui/icons-material';
import { userService, roleService, companyService, storeService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

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

const Administracion: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [companias, setCompanias] = useState<any[]>([]);
  const [tiendas, setTiendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [dialogType, setDialogType] = useState<'usuario' | 'rol' | 'compania' | 'tienda'>('usuario');
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
        
        // Cargar datos según la pestaña activa
        switch (tabValue) {
          case 0: // Usuarios
            const usuariosResponse = await userService.getAll();
            setUsuarios(usuariosResponse.data);
            break;
          case 1: // Roles
            const rolesResponse = await roleService.getAll();
            setRoles(rolesResponse.data);
            break;
          case 2: // Compañías
            const companiasResponse = await companyService.getAll();
            setCompanias(companiasResponse.data);
            break;
          case 3: // Tiendas
            const tiendasResponse = await storeService.getAll();
            setTiendas(tiendasResponse.data);
            break;
        }
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
  }, [tabValue]);

  // Manejar cambio de pestaña
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSearchTerm('');
  };

  // Filtrar elementos según el término de búsqueda
  const getFilteredItems = () => {
    switch (tabValue) {
      case 0: // Usuarios
        return usuarios.filter(usuario =>
          usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.rol?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 1: // Roles
        return roles.filter(rol =>
          rol.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rol.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 2: // Compañías
        return companias.filter(compania =>
          compania.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          compania.ruc.includes(searchTerm) ||
          compania.direccion.toLowerCase().includes(searchTerm.toLowerCase())
        );
      case 3: // Tiendas
        return tiendas.filter(tienda =>
          tienda.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tienda.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tienda.compania?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
      default:
        return [];
    }
  };

  // Abrir diálogo para crear/editar elemento
  const handleOpenDialog = (type: 'usuario' | 'rol' | 'compania' | 'tienda', item: any = null) => {
    setDialogType(type);
    setCurrentItem(item);
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentItem(null);
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
        Administración
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
        <Tab label="Usuarios" />
        <Tab label="Roles" />
        <Tab label="Compañías" />
        <Tab label="Tiendas" />
      </Tabs>

      {/* Pestaña de Usuarios */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            label="Buscar usuarios"
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
            onClick={() => handleOpenDialog('usuario')}
          >
            Nuevo Usuario
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredItems().length > 0 ? (
                getFilteredItems().map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.nombre}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.rol?.nombre || 'Sin rol'}</TableCell>
                    <TableCell>
                      {usuario.activo ? (
                        <Typography color="success.main">Activo</Typography>
                      ) : (
                        <Typography color="error">Inactivo</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenDialog('usuario', usuario)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color={usuario.activo ? 'error' : 'success'}>
                        {usuario.activo ? <LockIcon /> : <LockOpenIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Pestaña de Roles */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            label="Buscar roles"
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
            onClick={() => handleOpenDialog('rol')}
          >
            Nuevo Rol
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredItems().length > 0 ? (
                getFilteredItems().map((rol) => (
                  <TableRow key={rol.id}>
                    <TableCell>{rol.nombre}</TableCell>
                    <TableCell>{rol.descripcion}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenDialog('rol', rol)}>
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
                    No se encontraron roles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Pestaña de Compañías */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            label="Buscar compañías"
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
            onClick={() => handleOpenDialog('compania')}
          >
            Nueva Compañía
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>RUC</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredItems().length > 0 ? (
                getFilteredItems().map((compania) => (
                  <TableRow key={compania.id}>
                    <TableCell>{compania.nombre}</TableCell>
                    <TableCell>{compania.ruc}</TableCell>
                    <TableCell>{compania.direccion}</TableCell>
                    <TableCell>{compania.telefono}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenDialog('compania', compania)}>
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
                  <TableCell colSpan={5} align="center">
                    No se encontraron compañías
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Pestaña de Tiendas */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            label="Buscar tiendas"
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
            onClick={() => handleOpenDialog('tienda')}
          >
            Nueva Tienda
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Compañía</TableCell>
                <TableCell>Dirección</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredItems().length > 0 ? (
                getFilteredItems().map((tienda) => (
                  <TableRow key={tienda.id}>
                    <TableCell>{tienda.nombre}</TableCell>
                    <TableCell>{tienda.compania?.nombre || 'N/A'}</TableCell>
                    <TableCell>{tienda.direccion}</TableCell>
                    <TableCell>{tienda.telefono}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleOpenDialog('tienda', tienda)}>
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
                  <TableCell colSpan={5} align="center">
                    No se encontraron tiendas
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Diálogo para crear/editar elemento */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentItem ? `Editar ${dialogType}` : `Nuevo ${dialogType}`}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Formulario para Usuario */}
            {dialogType === 'usuario' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombre"
                    fullWidth
                    variant="outlined"
                    defaultValue={currentItem?.nombre || ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    variant="outlined"
                    type="email"
                    defaultValue={currentItem?.email || ''}
                  />
                </Grid>
                {!currentItem && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Contraseña"
                      fullWidth
                      variant="outlined"
                      type="password"
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Rol</InputLabel>
                    <Select
                      label="Rol"
                      defaultValue={currentItem?.rol_id || ''}
                    >
                      {roles.map((rol) => (
                        <MenuItem key={rol.id} value={rol.id}>
                          {rol.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={currentItem ? currentItem.activo : true}
                      />
                    }
                    label="Usuario activo"
                  />
                </Grid>
              </>
            )}

            {/* Formulario para Rol */}
            {dialogType === 'rol' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombre"
                    fullWidth
                    variant="outlined"
                    defaultValue={currentItem?.nombre || ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Descripción"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                    defaultValue={currentItem?.descripcion || ''}
                  />
                </Grid>
              </>
            )}

            {/* Formulario para Compañía */}
            {dialogType === 'compania' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombre"
                    fullWidth
                    variant="outlined"
                    defaultValue={currentItem?.nombre || ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="RUC"
                    fullWidth
                    variant="outlined"
                    defaultValue={currentItem?.ruc || ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Teléfono"
                    fullWidth
                    variant="outlined"
                    defaultValue={currentItem?.telefono || ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    variant="outlined"
                    type="email"
                    defaultValue={currentItem?.email || ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Dirección"
                    fullWidth
                    variant="outlined"
                    defaultValue={currentItem?.direccion || ''}
                  />
                </Grid>
              </>
            )}

            {/* Formulario para Tienda */}
            {dialogType === 'tienda' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombre"
                    fullWidth
                    variant="outlined"
                    defaultValue={currentItem?.nombre || ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Compañía</InputLabel>
                    <Select
                      label="Compañía"
                      defaultValue={currentItem?.compania_id || ''}
                    >
                      {companias.map((compania) => (
                        <MenuItem key={compania.id} value={compania.id}>
                          {compania.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Teléfono"
                    fullWidth
                    variant="outlined"
                    defaultValue={currentItem?.telefono || ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    variant="outlined"
                    type="email"
                    defaultValue={currentItem?.email || ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Dirección"
                    fullWidth
                    variant="outlined"
                    defaultValue={currentItem?.direccion || ''}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" color="primary">
            {currentItem ? 'Actualizar' : 'Guardar'}
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

export default Administracion;

