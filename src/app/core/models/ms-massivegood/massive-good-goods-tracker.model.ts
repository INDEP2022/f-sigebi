export interface IMassiveGoodTracker {
  bienes_aceptados: IAprovedGoods[];
  bienes_rechazados: string[];
  aceptados: number;
  rechazados: number;
}

export interface IAprovedGoods {
  goodNumber: string;
  description: string;
  amount: string;
  approved: string;
  keyAct: string;
}

export interface IIdentifierCount {
  identificador: string;
  fec_cargamasiv: string;
  count: string;
}

export interface IPupValidMassive {
  no_bien: string;
  comentario: string;
  comision: number;
  descripcion: string;
  disponible: 'N' | 'S';
  estatus: string;
  identificador: string;
  importe: number;
  ivacom: number;
  ivavta: number;
  precio_venta: number;
  proceso_ext_dom: string;
  valor_avaluo: string;
  no_delegacion: number;
  no_subdelegacion: number;
  no_expediente: number;
  no_volante: number;
  no_exp_asociado: number;
}
