/**
 * Utilidades para validación de formularios
 */

// Validar email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar que un campo no esté vacío
export const isNotEmpty = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value.trim() !== '';
};

// Validar longitud mínima
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

// Validar longitud máxima
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

// Validar que un valor sea numérico
export const isNumeric = (value: string): boolean => {
  const numericRegex = /^[0-9]+$/;
  return numericRegex.test(value);
};

// Validar que un valor sea decimal
export const isDecimal = (value: string): boolean => {
  const decimalRegex = /^[0-9]+(\.[0-9]+)?$/;
  return decimalRegex.test(value);
};

// Validar que un valor sea positivo
export const isPositive = (value: number): boolean => {
  return value > 0;
};

// Validar que un valor sea no negativo
export const isNonNegative = (value: number): boolean => {
  return value >= 0;
};

// Validar RUC (para Ecuador)
export const isValidRUC = (ruc: string): boolean => {
  // Validación básica de RUC ecuatoriano (13 dígitos)
  const rucRegex = /^[0-9]{13}$/;
  return rucRegex.test(ruc);
};

// Validar teléfono
export const isValidPhone = (phone: string): boolean => {
  // Validación básica de teléfono (números, +, -, espacios)
  const phoneRegex = /^[0-9+\-\s]+$/;
  return phoneRegex.test(phone);
};

// Validar contraseña segura
export const isStrongPassword = (password: string): boolean => {
  // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Validar fecha
export const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

// Validar que una fecha sea futura
export const isFutureDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

// Validar que una fecha sea pasada
export const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Validar que un valor esté en un rango
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// Validar que un valor esté en una lista de valores permitidos
export const isInList = <T>(value: T, allowedValues: T[]): boolean => {
  return allowedValues.includes(value);
};

// Validar que dos valores sean iguales (útil para confirmar contraseñas)
export const areEqual = (value1: any, value2: any): boolean => {
  return value1 === value2;
};

// Obtener mensaje de error para validaciones comunes
export const getErrorMessage = (validationType: string, fieldName: string, ...params: any[]): string => {
  const fieldLabel = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  
  switch (validationType) {
    case 'required':
      return `${fieldLabel} es requerido`;
    case 'email':
      return `${fieldLabel} debe ser un correo electrónico válido`;
    case 'minLength':
      return `${fieldLabel} debe tener al menos ${params[0]} caracteres`;
    case 'maxLength':
      return `${fieldLabel} no debe exceder ${params[0]} caracteres`;
    case 'numeric':
      return `${fieldLabel} debe contener solo números`;
    case 'decimal':
      return `${fieldLabel} debe ser un número decimal válido`;
    case 'positive':
      return `${fieldLabel} debe ser un valor positivo`;
    case 'nonNegative':
      return `${fieldLabel} no puede ser negativo`;
    case 'ruc':
      return `${fieldLabel} debe ser un RUC válido`;
    case 'phone':
      return `${fieldLabel} debe ser un número de teléfono válido`;
    case 'password':
      return `${fieldLabel} debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial`;
    case 'date':
      return `${fieldLabel} debe ser una fecha válida`;
    case 'futureDate':
      return `${fieldLabel} debe ser una fecha futura`;
    case 'pastDate':
      return `${fieldLabel} debe ser una fecha pasada`;
    case 'range':
      return `${fieldLabel} debe estar entre ${params[0]} y ${params[1]}`;
    case 'match':
      return `${fieldLabel} no coincide con ${params[0]}`;
    default:
      return `${fieldLabel} no es válido`;
  }
};

