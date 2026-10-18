export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const re = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,6}$/;
  return re.test(phone);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, min: number): boolean => {
  return value.trim().length >= min;
};

export const validateMaxLength = (value: string, max: number): boolean => {
  return value.trim().length <= max;
};

export const validateDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const validateFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

export const validateTime = (timeString: string): boolean => {
  const re = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return re.test(timeString);
};

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateForm = <T extends Record<string, unknown>>(
  data: T,
  rules: Record<keyof T, Array<{ validator: (value: unknown) => boolean; message: string }>>
): ValidationResult => {
  const errors: Record<string, string> = {};
  
  Object.entries(rules).forEach(([field, fieldRules]) => {
    const value = data[field];
    for (const rule of fieldRules) {
      if (!rule.validator(value)) {
        errors[field] = rule.message;
        break;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const createFieldValidator = <T>(
  validators: Array<{ validate: (value: T) => boolean; message: string }>
) => {
  return (value: T): string | undefined => {
    for (const validator of validators) {
      if (!validator.validate(value)) {
        return validator.message;
      }
    }
    return undefined;
  };
};