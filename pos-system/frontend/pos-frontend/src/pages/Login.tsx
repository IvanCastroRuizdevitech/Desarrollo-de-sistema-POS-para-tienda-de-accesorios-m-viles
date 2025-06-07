import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormInputs {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { login, error, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    await login(data.username, data.password);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Iniciar Sesión
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        margin="normal"
        fullWidth
        id="username"
        label="Nombre de usuario"
        autoComplete="username"
        autoFocus
        {...register('username', { required: 'El nombre de usuario es requerido' })}
        error={!!errors.username}
        helperText={errors.username?.message}
      />

      <TextField
        margin="normal"
        fullWidth
        id="password"
        label="Contraseña"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        {...register('password', { required: 'La contraseña es requerida' })}
        error={!!errors.password}
        helperText={errors.password?.message}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </Box>
  );
};

export default Login;

