export interface IIndicatorDeadline {
  id: number;
  indicator: string;
  formula: string;
  deadline: number;
  usuario_creacion: string;
  fecha_creacion: Date;
  usuario_modificacion: string;
  fecha_modificacion: Date;
  estatus: number;
  version: number;
}
