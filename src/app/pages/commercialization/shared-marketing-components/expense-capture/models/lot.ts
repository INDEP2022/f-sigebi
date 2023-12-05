export interface ILotDTO {
  p_fpago: string;
  id_evento: string;
  lotePub: string;
}

export interface IValidStatusChangeDTO {
  id_gasto: string;
  id_lote: string;
}

export interface IValidSubPriceDTO {
  eventId: string;
  lotId: string;
  spentId: string;
}

export interface IDivideCommandsDTO {
  eventId: string;
  amount2: number;
  iva2: number;
  withholdingIsr2: string;
  withholding_vat2: string;
  expenseId: string;
}

export interface ILoadLotDTO {
  pEventId: number;
  pBatchId: number;
  pConceptoId: number;
  pScreen: string;
}

export interface ILoadLotDelResDTO {
  v_id_evento: number;
  v_id_lote: number;
  id_concepto: number;
  cve_pantalla: string;
}

export interface IComerDetGastosDTO {
  select_cambia_status: string;
  no_bien: any;
}

export interface ICancelVtaDTO {
  id_lote: string;
  id_gasto: string;
  id_evento: string;
  lote_pub: string;
  pMotivo: string;
  id_concepto: string;
  p_prueba: string;
  user: string;
  comer_detgastos: IComerDetGastosDTO[];
  cat_motivos_rev: { motiveDescription: string; selection: number }[];
}

export interface ILoadLotResponse {
  goods: { cvman: string; no_bien: string }[];
  selectChange: {
    SELECT_CAMBIA_CLASIF_UPDATE: boolean;
    SELECT_CAMBIA_CLASIF_ENABLED: boolean;
    V_BIEN_REP_ROBO: number;
    SELECT_CAMBIA_CLASIF: string;
  };
}

export interface IFillDatosRevDTO {
  pEvent: number;
  pGood: number;
  pScreen: string;
  reasons: string;
  reason1: string;
  reason2: string;
  reason3: string;
  reason4: string;
  reason5: string;
  reason6: string;
  reason7: string;
  reason8: string;
  reason9: string;
  reason10: string;
  cgEvent: number;
  address: string;
}
