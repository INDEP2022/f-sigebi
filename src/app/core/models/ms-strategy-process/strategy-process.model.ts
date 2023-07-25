export interface IStrategyProcess {
  processNumber?: number;
  desShort?: string;
  description: string;
  relayEstate?: string;
  relayStrategy?: string;
  programmingType?: string;
  registryNumber?: number;
  nbOrigin?: string;
}

export interface IStrategy {
  cve_reporte: string;
  no_reporte: string;
  no_formato: string;
  estatus: string;
  fec_captura: string;
  fec_autoriza: string;
  no_mes: string;
  no_anio: string;
  en_tiempo: string;
  no_registro: string;
  usr_elaboro: string;
  observaciones: string;
  no_estatus_ri: string;
  observaciones_op: string;
  folio_universal: string;
  cve_reporte_a: string;
  nb_origen: string;
}
