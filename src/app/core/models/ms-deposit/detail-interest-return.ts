export interface IDetailInterestReturn {
  returnNumber: number;
  row: number;
  interestType: string;
  period: string;
  startDate: string;
  endDate: string;
  days: number;
  capital: number;
  rate: number;
  interest: number;
  balance: number;
  recordNumber: number;
  originNb: string;
}

export interface IPupDetalleDevolutionDTO {
  fec_corte_devolucion: string;
  no_devolucion: number;
  ti_fec_inicio_interes: string;
  tipo_cheque: string;
  importe_sin_interes: string;
  no_movimiento_origen_deposito: number;
  di_moneda_deposito: string;
  di_instrumento: string;
}

export interface IPupDetalleDevolutionResult {
  no_devolucion: number;
  vn_renglon: number;
  vc_tipo_interesx: string;
  vc_periodox: string;
  vf_inicio: string;
  vf_fin: string;
  vn_diasx: number;
  vn_capitalx: number;
  vn_tasax: string;
  vn_interesx: number;
  vn_saldox: number;
}
