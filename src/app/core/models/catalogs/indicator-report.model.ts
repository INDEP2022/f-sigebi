export interface IIndicatorReport {
  id?: number;
  tipo_servicio: string;
  rango_porcentaje_inicial: number;
  rango_porcentaje_final: number;
  pena_convencional: number;
  no_contrato: string;
  usuario_creacion: string;
  fecha_creacion: Date;
  usuario_modificacion: string;
  fecha_modificacion: Date;
  estatus: number;
  version: number;
}
