import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4 as DarkIcon, Brightness7 as LightIcon } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  color?: 'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

/**
 * Componente para alternar entre tema claro y oscuro
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({ color = 'inherit' }) => {
  const { themeMode, toggleTheme } = useTheme();
  
  return (
    <Tooltip title={themeMode === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}>
      <IconButton onClick={toggleTheme} color={color} aria-label="toggle theme">
        {themeMode === 'light' ? <DarkIcon /> : <LightIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;

