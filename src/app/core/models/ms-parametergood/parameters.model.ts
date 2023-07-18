export interface IParameters {
  id: string | null;
  description: string | null;
  initialValue: number | null;
  finalValue: number | null;
  startDate: Date | null;
  endDate: Date | null;
  registryNumber: number | null;
}

export interface IIndicatorParameters {
  id: string | number;
  description: string;
  procedureArea: string | number;
  registryNumber: string | number;
  certificateType: string | number;
  certificateRE: string;
}

export interface IPupCalculateDevolutionDTO {
  fecCorteDevolucion: Date;
  tiFecInicioInteres: Date;
  importeSinInteres: string;
  diMonedaDeposito: string;
  diInstrumento: string;
  diBienDeposito: number;
}

export interface IPupCalculateDevolutionResult {
  interes_real: number;
  interes_estimado: number;
  interes_acreditado: number;
  di_subtotal: string;
  importe_devolucion: string;
  tasa_estimada: number;
}
