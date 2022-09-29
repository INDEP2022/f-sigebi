export interface IRegulatory {
  id?: number;
  id_fraccion: number;
  numero: string;
  descripcion: string;
  validar_ef: string;
  validar_ec: string;
  usuario_creacion?: string;
  fecha_creacion?: Date;
  usuario_modificacion?: string;
  fecha_modificacion?: Date;
  version: number;
}
