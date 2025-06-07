import React from 'react';
import { 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  SelectChangeEvent,
  TextFieldProps,
  SelectProps
} from '@mui/material';

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => void;
  error?: boolean;
  helperText?: string;
  type?: string;
  required?: boolean;
  fullWidth?: boolean;
  select?: boolean;
  options?: Array<{value: string | number, label: string}>;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  InputProps?: TextFieldProps['InputProps'];
  SelectProps?: SelectProps;
  autoComplete?: string;
  placeholder?: string;
}

/**
 * Componente reutilizable para campos de formulario con validación
 */
const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  error = false,
  helperText = '',
  type = 'text',
  required = false,
  fullWidth = true,
  select = false,
  options = [],
  multiline = false,
  rows = 1,
  disabled = false,
  variant = 'outlined',
  size = 'medium',
  InputProps,
  SelectProps,
  autoComplete,
  placeholder
}) => {
  // Si es un campo de selección, renderizar un Select
  if (select) {
    return (
      <FormControl 
        fullWidth={fullWidth} 
        error={error} 
        variant={variant} 
        required={required}
        size={size}
        disabled={disabled}
      >
        <InputLabel id={`${id}-label`}>{label}</InputLabel>
        <Select
          labelId={`${id}-label`}
          id={id}
          name={name}
          value={value || ''}
          label={label}
          onChange={onChange}
          {...SelectProps}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }
  
  // Si no es un campo de selección, renderizar un TextField
  return (
    <TextField
      id={id}
      name={name}
      label={label}
      value={value || ''}
      onChange={onChange}
      error={error}
      helperText={helperText}
      type={type}
      required={required}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={rows}
      disabled={disabled}
      variant={variant}
      size={size}
      InputProps={InputProps}
      autoComplete={autoComplete}
      placeholder={placeholder}
    />
  );
};

export default FormField;

