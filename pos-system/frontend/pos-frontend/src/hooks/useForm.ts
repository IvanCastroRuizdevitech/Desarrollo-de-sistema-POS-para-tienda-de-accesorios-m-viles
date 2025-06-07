import { useState, useCallback, ChangeEvent } from 'react';

interface ValidationRule {
  validate: (value: any, formValues?: any) => boolean;
  message: string;
}

interface FieldConfig {
  value: any;
  rules?: ValidationRule[];
  touched: boolean;
  error: string;
}

interface FormConfig {
  [key: string]: FieldConfig;
}

/**
 * Hook personalizado para manejar formularios con validación
 * @param initialValues Valores iniciales del formulario
 * @returns Objeto con valores, errores, métodos para manejar cambios y validación
 */
const useForm = <T extends Record<string, any>>(initialValues: T) => {
  // Crear configuración inicial del formulario
  const createInitialFormConfig = (): FormConfig => {
    const config: FormConfig = {};
    
    Object.keys(initialValues).forEach(key => {
      config[key] = {
        value: initialValues[key],
        rules: [],
        touched: false,
        error: ''
      };
    });
    
    return config;
  };
  
  const [formConfig, setFormConfig] = useState<FormConfig>(createInitialFormConfig());
  
  // Extraer valores actuales del formulario
  const values = Object.keys(formConfig).reduce((acc, key) => {
    acc[key] = formConfig[key].value;
    return acc;
  }, {} as Record<string, any>) as T;
  
  // Extraer errores del formulario
  const errors = Object.keys(formConfig).reduce((acc, key) => {
    acc[key] = formConfig[key].error;
    return acc;
  }, {} as Record<string, string>);
  
  // Verificar si hay errores en el formulario
  const hasErrors = Object.values(errors).some(error => error !== '');
  
  // Verificar si todos los campos requeridos están tocados
  const allTouched = Object.keys(formConfig).every(key => 
    formConfig[key].rules?.length ? formConfig[key].touched : true
  );
  
  // Validar un campo específico
  const validateField = useCallback((name: string, value: any): string => {
    const field = formConfig[name];
    
    if (!field || !field.rules || field.rules.length === 0) {
      return '';
    }
    
    for (const rule of field.rules) {
      if (!rule.validate(value, values)) {
        return rule.message;
      }
    }
    
    return '';
  }, [formConfig, values]);
  
  // Validar todo el formulario
  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newFormConfig = { ...formConfig };
    
    Object.keys(newFormConfig).forEach(key => {
      const error = validateField(key, newFormConfig[key].value);
      newFormConfig[key] = {
        ...newFormConfig[key],
        error,
        touched: true
      };
      
      if (error) {
        isValid = false;
      }
    });
    
    setFormConfig(newFormConfig);
    return isValid;
  }, [formConfig, validateField]);
  
  // Manejar cambios en los campos del formulario
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    if (!name) return;
    
    setFormConfig(prev => {
      const error = validateField(name, value);
      
      return {
        ...prev,
        [name]: {
          ...prev[name],
          value,
          touched: true,
          error
        }
      };
    });
  }, [validateField]);
  
  // Establecer un valor específico en el formulario
  const setValue = useCallback((name: string, value: any) => {
    setFormConfig(prev => {
      const error = validateField(name, value);
      
      return {
        ...prev,
        [name]: {
          ...prev[name],
          value,
          touched: true,
          error
        }
      };
    });
  }, [validateField]);
  
  // Establecer múltiples valores en el formulario
  const setValues = useCallback((newValues: Partial<T>) => {
    setFormConfig(prev => {
      const updated = { ...prev };
      
      Object.entries(newValues).forEach(([key, value]) => {
        if (key in updated) {
          const error = validateField(key, value);
          
          updated[key] = {
            ...updated[key],
            value,
            touched: true,
            error
          };
        }
      });
      
      return updated;
    });
  }, [validateField]);
  
  // Restablecer el formulario a los valores iniciales
  const resetForm = useCallback(() => {
    setFormConfig(createInitialFormConfig());
  }, []);
  
  // Agregar reglas de validación a un campo
  const setFieldRules = useCallback((name: string, rules: ValidationRule[]) => {
    setFormConfig(prev => {
      if (!prev[name]) return prev;
      
      return {
        ...prev,
        [name]: {
          ...prev[name],
          rules
        }
      };
    });
  }, []);
  
  // Marcar un campo como tocado
  const touchField = useCallback((name: string) => {
    setFormConfig(prev => {
      if (!prev[name]) return prev;
      
      const error = validateField(name, prev[name].value);
      
      return {
        ...prev,
        [name]: {
          ...prev[name],
          touched: true,
          error
        }
      };
    });
  }, [validateField]);
  
  // Marcar todos los campos como tocados
  const touchAll = useCallback(() => {
    setFormConfig(prev => {
      const updated = { ...prev };
      
      Object.keys(updated).forEach(key => {
        const error = validateField(key, updated[key].value);
        
        updated[key] = {
          ...updated[key],
          touched: true,
          error
        };
      });
      
      return updated;
    });
  }, [validateField]);
  
  return {
    values,
    errors,
    hasErrors,
    allTouched,
    handleChange,
    setValue,
    setValues,
    validateForm,
    resetForm,
    setFieldRules,
    touchField,
    touchAll
  };
};

export default useForm;

