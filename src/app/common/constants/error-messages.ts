import { format } from 'date-fns';
import { DATE_FORMAT } from './data-formats/date.format';

export const ERROR_MESSAGES: any = {
  required: (meta: any) => 'El campo es obligatorio',
  email: (meta: any) => 'El campo debe ser un correo válido',
  minlength: (meta: any) =>
    `El campo debe tener mínimo ${meta.requiredLength} caracteres`,
  maxlength: (meta: any) =>
    `El campo debe tener máximo ${meta.requiredLength} caracteres`,
  min: (meta: any) => `El valor minímo es ${meta.min}`,
  max: (meta: any) => `El valor maximo es ${meta.max}`,
  minDate: (meta: any) => `La fecha mínima es ${format(meta.min, DATE_FORMAT)}`,
  maxDate: (meta: any) => `La fecha máxima es ${format(meta.max, DATE_FORMAT)}`,
  dateRange: (meta: any) =>
    `La fecha máxima no puede ser menor a fecha de inicio`,
  numeric: (meta: any) => 'El campo debe ser númerico',
  nonExist: (meta: any) => 'El registro no existe',
  TransferenteAndAct: (meta: any) =>
    `El transferente ${meta.transferent} no es valido para el Acta`,
};
