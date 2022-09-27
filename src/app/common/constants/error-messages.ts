export const ERROR_MESSAGES: any = {
    required: (meta: any) => 'El campo es obligatorio',
    email: (meta: any) => 'El campo debe ser un correo válido',
    minlength: (meta: any) =>
      `El campo debe tener mínimo ${meta.requiredLength} caracteres`,
    maxlength: (meta: any) =>
      `El campo debe tener máximo ${meta.requiredLength} caracteres`,
    min: (meta: any) => `El valor minímo es ${meta.min}`,
    max: (meta: any) => `El valor maximo es ${meta.max}`,
  };
  